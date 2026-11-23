"""
_lqa_checks.py - Automated LQA regression checks for ES/CA UI strings.

Direct serverless module mirror of novachat-es-ca-lqa/lqa-checker/lqa_checks.py
with optional extended SaaS/Support glossary profile support.
Standard library only, zero external dependencies.
"""

import re

# Placeholders: ICU-style {name} and printf-style %s / %d / %1$s
PLACEHOLDER_RE = re.compile(r"\{[a-zA-Z_][a-zA-Z0-9_]*\}|%(?:\d+\$)?[sd]")


def find_placeholders(text: str) -> list[str]:
    return sorted(PLACEHOLDER_RE.findall(text))


def issue(row: dict, check: str, category: str, severity: str, message: str) -> dict:
    return {
        "id": row["id"],
        "locale": row["locale"],
        "check": check,
        "mqm_category": category,
        "severity": severity,
        "message": message,
        "target": row["target"],
    }


def check_placeholders(row: dict, cfg: dict) -> list[dict]:
    """Regression test 1: ICU/printf variables must match source exactly."""
    src, tgt = find_placeholders(row["source"]), find_placeholders(row["target"])
    if src != tgt:
        return [
            issue(
                row,
                "placeholder_mismatch",
                "Accuracy",
                "Major",
                f"Source has {src}, target has {tgt}",
            )
        ]
    return []


def check_length(row: dict, cfg: dict) -> list[dict]:
    """Regression test 4: target must fit the UI character limit."""
    raw_limit = row.get("max_chars")
    if raw_limit is None or str(raw_limit).strip() == "":
        return []
    limit = int(raw_limit)
    if limit <= 0:
        return []
    length = len(row["target"])
    if length > limit:
        return [
            issue(
                row,
                "length_limit",
                "UX clarity",
                "Major",
                f"{length} chars, limit is {limit} (+{length - limit})",
            )
        ]
    return []


def check_gendered(row: dict, cfg: dict) -> list[dict]:
    """Regression test 5: no masculine generics (inclusive language policy)."""
    terms = cfg["rules"]["gendered_terms"].get(row["locale"], [])
    found = [
        t for t in terms if re.search(rf"\b{t}\b", row["target"], re.IGNORECASE)
    ]
    if found:
        return [
            issue(
                row,
                "gendered_language",
                "Cultural / dialectal appropriateness",
                "Major",
                f"Masculine generic found: {', '.join(found)}",
            )
        ]
    return []


def check_untranslated(row: dict, cfg: dict) -> list[dict]:
    """Target identical to source (unless the term is on the allow list)."""
    src_clean = row["source"].strip()
    tgt_clean = row["target"].strip()
    if (
        src_clean
        and src_clean == tgt_clean
        and src_clean not in cfg["rules"]["allow_identical"]
    ):
        return [
            issue(
                row,
                "untranslated",
                "Accuracy",
                "Major",
                "Target is identical to source",
            )
        ]
    return []


def check_glossary(row: dict, cfg: dict) -> list[dict]:
    """If the source contains a glossary term, the approved target must appear."""
    issues = []
    locale = row["locale"]
    match_key = "es_match" if locale == "es-ES" else "ca_match"
    for entry in cfg["glossary"]:
        approved = entry.get(locale, "")
        if not approved:
            continue
        if not re.search(rf"\b{re.escape(entry['en'])}\b", row["source"], re.IGNORECASE):
            continue
        pattern = entry.get(match_key)
        if pattern:
            matched = bool(re.search(rf"\b(?:{pattern})\b", row["target"], re.IGNORECASE))
        else:
            # Word boundary: "Configuració" must not match inside "Configuración"
            matched = bool(re.search(rf"\b{re.escape(approved)}\b", row["target"], re.IGNORECASE))
        if not matched:
            issues.append(
                issue(
                    row,
                    "glossary",
                    "Terminology",
                    "Minor",
                    f"'{entry['en']}' should be '{approved}'",
                )
            )
    return issues


def check_inverted_punctuation(row: dict, cfg: dict) -> list[dict]:
    """ES only: questions and exclamations need opening ¿ / ¡."""
    if row["locale"] != "es-ES":
        return []
    tgt = row["target"]
    issues = []
    if "?" in tgt and "¿" not in tgt:
        issues.append(
            issue(
                row,
                "missing_inverted_mark",
                "Fluency",
                "Minor",
                "Question without opening '¿'",
            )
        )
    if "!" in tgt and "¡" not in tgt:
        issues.append(
            issue(
                row,
                "missing_inverted_mark",
                "Fluency",
                "Minor",
                "Exclamation without opening '¡'",
            )
        )
    return issues


def check_catalan(row: dict, cfg: dict) -> list[dict]:
    """CA only: punt volat (l·l), obsolete diacritics and Castilianisms."""
    if row["locale"] != "ca-ES":
        return []
    tgt = row["target"]
    issues = []
    if re.search(r"l[.•\-]l", tgt, re.IGNORECASE):
        issues.append(
            issue(
                row,
                "punt_volat",
                "Fluency",
                "Minor",
                "Wrong middle dot: use 'l·l'",
            )
        )
    obsolete = [
        w
        for w in cfg["rules"].get("obsolete_diacritics_ca", [])
        if re.search(rf"\b{w}\b", tgt, re.IGNORECASE)
    ]
    if obsolete:
        issues.append(
            issue(
                row,
                "obsolete_diacritic",
                "Fluency",
                "Minor",
                f"Pre-2016 diacritic (IEC reform): {', '.join(obsolete)}",
            )
        )
    found = [
        w
        for w in cfg["rules"]["castilianisms_ca"]
        if re.search(rf"\b{w}\b", tgt, re.IGNORECASE)
    ]
    if found:
        issues.append(
            issue(
                row,
                "castilianism",
                "Cultural / dialectal appropriateness",
                "Major",
                f"Castilianized form: {', '.join(found)}",
            )
        )
    return issues


def check_whitespace(row: dict, cfg: dict) -> list[dict]:
    """Double spaces and leading/trailing whitespace."""
    tgt = row["target"]
    issues = []
    if "  " in tgt:
        issues.append(
            issue(row, "double_space", "Fluency", "Minor", "Double space in target")
        )
    if tgt != tgt.strip():
        issues.append(
            issue(
                row,
                "edge_whitespace",
                "Fluency",
                "Minor",
                "Leading or trailing whitespace",
            )
        )
    return issues


CHECKS = [
    check_placeholders,
    check_length,
    check_gendered,
    check_untranslated,
    check_glossary,
    check_inverted_punctuation,
    check_catalan,
    check_whitespace,
]


def run(rows: list[dict], cfg: dict) -> list[dict]:
    issues = []
    for row in rows:
        for check in CHECKS:
            issues.extend(check(row, cfg))
    return issues
