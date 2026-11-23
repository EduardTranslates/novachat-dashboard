import type {
  GlossaryEntry,
  LqaCheckResponse,
  LqaIssue,
  LqaRules,
} from "@/types/novachat";

export interface CheckerInputRow {
  id: string;
  locale: string;
  source: string;
  target: string;
  max_chars: string;
}

const PLACEHOLDER_RE = /\{[a-zA-Z_][a-zA-Z0-9_]*\}|%(?:\d+\$)?[sd]/g;

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Unicode-aware equivalent of Python 3's \b for Spanish/Catalan accented words
function hasWord(text: string, term: string): boolean {
  const re = new RegExp(
    `(?<![\\p{L}\\p{N}_])${escapeRegex(term)}(?![\\p{L}\\p{N}_])`,
    "iu"
  );
  return re.test(text);
}

function findPlaceholders(text: string): string[] {
  const matches = text.match(PLACEHOLDER_RE);
  return matches ? [...matches].sort() : [];
}

function makeIssue(
  row: CheckerInputRow,
  check: string,
  mqm_category: string,
  severity: "Critical" | "Major" | "Minor",
  message: string
): LqaIssue {
  return {
    id: row.id,
    locale: row.locale,
    check,
    mqm_category,
    severity,
    message,
    target: row.target,
  };
}

function formatPyList(items: string[]): string {
  return `[${items.map((x) => `'${x}'`).join(", ")}]`;
}

export function runLocalLqaFallback(
  rows: CheckerInputRow[],
  glossary: GlossaryEntry[],
  rules: LqaRules
): LqaCheckResponse {
  const t0 = performance.now();
  const issues: LqaIssue[] = [];

  for (const row of rows) {
    // 1. Placeholders
    const srcPh = findPlaceholders(row.source);
    const tgtPh = findPlaceholders(row.target);
    if (
      srcPh.length !== tgtPh.length ||
      srcPh.some((v, idx) => v !== tgtPh[idx])
    ) {
      issues.push(
        makeIssue(
          row,
          "placeholder_mismatch",
          "Accuracy",
          "Major",
          `Source has ${formatPyList(srcPh)}, target has ${formatPyList(tgtPh)}`
        )
      );
    }

    // 2. Length limit
    if (row.max_chars && row.max_chars.trim() !== "") {
      const limit = Number.parseInt(row.max_chars, 10);
      if (Number.isFinite(limit) && limit > 0 && row.target.length > limit) {
        issues.push(
          makeIssue(
            row,
            "length_limit",
            "UX clarity",
            "Major",
            `${row.target.length} chars, limit is ${limit} (+${row.target.length - limit})`
          )
        );
      }
    }

    // 3. Gendered generics
    const gTerms = rules.gendered_terms[row.locale] ?? [];
    const foundGendered = gTerms.filter((t) => hasWord(row.target, t));
    if (foundGendered.length > 0) {
      issues.push(
        makeIssue(
          row,
          "gendered_language",
          "Cultural / dialectal appropriateness",
          "Major",
          `Masculine generic found: ${foundGendered.join(", ")}`
        )
      );
    }

    // 4. Untranslated
    const srcClean = row.source.trim();
    const tgtClean = row.target.trim();
    if (
      srcClean !== "" &&
      srcClean === tgtClean &&
      !rules.allow_identical.includes(srcClean)
    ) {
      issues.push(
        makeIssue(
          row,
          "untranslated",
          "Accuracy",
          "Major",
          "Target is identical to source"
        )
      );
    }

    // 5. Glossary
    for (const entry of glossary) {
      const approved =
        row.locale === "es-ES"
          ? entry["es-ES"]
          : row.locale === "ca-ES"
          ? entry["ca-ES"]
          : "";
      if (
        approved &&
        hasWord(row.source, entry.en) &&
        !hasWord(row.target, approved)
      ) {
        issues.push(
          makeIssue(
            row,
            "glossary",
            "Terminology",
            "Minor",
            `'${entry.en}' should be '${approved}'`
          )
        );
      }
    }

    // 6. Inverted punctuation (es-ES)
    if (row.locale === "es-ES") {
      if (row.target.includes("?") && !row.target.includes("¿")) {
        issues.push(
          makeIssue(
            row,
            "missing_inverted_mark",
            "Fluency",
            "Minor",
            "Question without opening '¿'"
          )
        );
      }
      if (row.target.includes("!") && !row.target.includes("¡")) {
        issues.push(
          makeIssue(
            row,
            "missing_inverted_mark",
            "Fluency",
            "Minor",
            "Exclamation without opening '¡'"
          )
        );
      }
    }

    // 7. Catalan checks (ca-ES)
    if (row.locale === "ca-ES") {
      if (/l[.•-]l/i.test(row.target)) {
        issues.push(
          makeIssue(
            row,
            "punt_volat",
            "Fluency",
            "Minor",
            "Wrong middle dot: use 'l·l'"
          )
        );
      }
      const obsolete = (rules.obsolete_diacritics_ca ?? []).filter((w) =>
        hasWord(row.target, w)
      );
      if (obsolete.length > 0) {
        issues.push(
          makeIssue(
            row,
            "obsolete_diacritic",
            "Fluency",
            "Minor",
            `Pre-2016 diacritic (IEC reform): ${obsolete.join(", ")}`
          )
        );
      }
      const cast = (rules.castilianisms_ca ?? []).filter((w) =>
        hasWord(row.target, w)
      );
      if (cast.length > 0) {
        issues.push(
          makeIssue(
            row,
            "castilianism",
            "Cultural / dialectal appropriateness",
            "Major",
            `Castilianized form: ${cast.join(", ")}`
          )
        );
      }
    }

    // 8. Whitespace
    if (row.target.includes("  ")) {
      issues.push(
        makeIssue(
          row,
          "double_space",
          "Fluency",
          "Minor",
          "Double space in target"
        )
      );
    }
    if (row.target !== row.target.trim()) {
      issues.push(
        makeIssue(
          row,
          "edge_whitespace",
          "Fluency",
          "Minor",
          "Leading or trailing whitespace"
        )
      );
    }
  }

  const flaggedIds = new Set(issues.map((i) => i.id));
  const by_severity = { Critical: 0, Major: 0, Minor: 0 };
  const by_check: Record<string, number> = {};
  for (const iss of issues) {
    by_severity[iss.severity] += 1;
    by_check[iss.check] = (by_check[iss.check] ?? 0) + 1;
  }

  return {
    ok: true,
    engine: "ts-local-fallback",
    python_version: "local-ts-mirror",
    elapsed_ms: Number((performance.now() - t0).toFixed(2)),
    strings_checked: rows.length,
    flagged_strings: flaggedIds.size,
    clean_strings: rows.length - flaggedIds.size,
    issue_count: issues.length,
    by_severity,
    by_check,
    issues,
  };
}
