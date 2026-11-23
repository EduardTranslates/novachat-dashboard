"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookMarked,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Edit3,
  Loader2,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Terminal,
  XCircle,
} from "lucide-react";
import { LocaleBadge, SeverityBadge } from "./Badges";
import { runLocalLqaFallback } from "@/lib/lqaFallback";
import type {
  GlossaryEntry,
  LqaCheckResponse,
  LqaIssue,
  LqaRules,
  SampleStringRow,
} from "@/types/novachat";

interface LiveCheckerTabProps {
  glossary: GlossaryEntry[];
  rules: LqaRules;
  sampleStrings: SampleStringRow[];
}

interface PresetExample {
  id: string;
  label: string;
  tag: string;
  locale: "es-ES" | "ca-ES";
  max_chars: string;
  source: string;
  target: string;
  clean?: boolean;
}

const CHECK_EXPLANATIONS: Record<string, string> = {
  placeholder_mismatch:
    "Broken or dropped ICU/printf variables render literally in production UI or hide critical runtime values.",
  length_limit:
    "Exceeds mobile viewport character budget; key calls-to-action risk getting truncated on small screens.",
  gendered_language:
    "Violates NovaChat's inclusive language style guide (neutral greetings instead of masculine generics).",
  untranslated:
    "Target string matches the English source verbatim and is not on the approved keep-as-is allow list.",
  glossary:
    "Deviates from the approved bilingual ES/CA UI glossary — breaks consistency between product UI and AI support answers.",
  missing_inverted_mark:
    "Spanish orthography requires opening inverted punctuation marks (¿ / ¡) for questions and exclamations.",
  punt_volat:
    "Catalan geminated 'l' requires the proper middle dot (l·l), not a period, bullet, or hyphen.",
  obsolete_diacritic:
    "Uses a Catalan diacritic accent abolished by the 2016 IEC orthographic reform (e.g., 'vés' → 'ves').",
  castilianism:
    "Spanish lexical interference inside Catalan UI — one of the most frequent real-world ES→CA localization defects.",
  double_space:
    "Consecutive spaces in target text; usually a sign of unpolished manual editing in a TMS.",
  edge_whitespace:
    "Leading or trailing space can break button centering and inline UI alignment.",
};

export function LiveCheckerTab({
  glossary,
  rules,
  sampleStrings,
}: LiveCheckerTabProps) {
  const presets: PresetExample[] = useMemo(
    () => [
      {
        id: "UI-012",
        label: "CA Castilianism + Glossary",
        tag: "ca-ES · 2 issues",
        locale: "ca-ES",
        max_chars: "20",
        source: "Settings",
        target: "Configuración",
      },
      {
        id: "UI-003",
        label: "Broken ICU {cuont}",
        tag: "es-ES · Major",
        locale: "es-ES",
        max_chars: "60",
        source: "You have {count} new messages",
        target: "Tienes {cuont} mensajes nuevos",
      },
      {
        id: "CA-IEC",
        label: 'CA Pre-2016 Accent ("vés")',
        tag: "ca-ES · IEC 2016",
        locale: "ca-ES",
        max_chars: "60",
        source: "Go to Settings > Language.",
        target: "Per canviar l'idioma, vés a Configuració > Idioma.",
      },
      {
        id: "UI-001",
        label: "Gendered Greeting",
        tag: "es-ES · Major",
        locale: "es-ES",
        max_chars: "30",
        source: "Welcome back, {name}!",
        target: "¡Bienvenido de nuevo, {name}!",
      },
      {
        id: "UI-015",
        label: "CA Punt Volat (l.l)",
        tag: "ca-ES · Minor",
        locale: "ca-ES",
        max_chars: "40",
        source: "Intelligence level",
        target: "Nivell d'intel.ligència",
      },
      {
        id: "UI-006",
        label: "Mobile Overflow (+22)",
        tag: "es-ES · Major",
        locale: "es-ES",
        max_chars: "50",
        source: "Could not connect to the server. Try again later.",
        target:
          "No se ha podido conectar con el servidor. Vuelve a intentarlo más tarde.",
      },
      {
        id: "UI-016",
        label: "Dropped %s Variable",
        tag: "ca-ES · Major",
        locale: "ca-ES",
        max_chars: "40",
        source: "Payment failed: %s",
        target: "El pagament ha fallat",
      },
      {
        id: "UI-013",
        label: "Clean CA String",
        tag: "ca-ES · PASS",
        locale: "ca-ES",
        max_chars: "60",
        source: "Do you want to cancel your subscription?",
        target: "Vols cancel·lar la teva subscripció?",
        clean: true,
      },
    ],
    []
  );

  const [mode, setMode] = useState<"single" | "batch">("single");
  const [activePresetId, setActivePresetId] = useState<string>("UI-012");

  // Single string form state (initialized to the iconic UI-012 Configuració/Configuración bug!)
  const [stringId, setStringId] = useState<string>("UI-012");
  const [locale, setLocale] = useState<"es-ES" | "ca-ES">("ca-ES");
  const [maxChars, setMaxChars] = useState<string>("20");
  const [source, setSource] = useState<string>("Settings");
  const [target, setTarget] = useState<string>("Configuración");

  const [singleLoading, setSingleLoading] = useState(false);
  const [singleResult, setSingleResult] = useState<LqaCheckResponse | null>(
    null
  );

  // Batch state
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<LqaCheckResponse | null>(null);
  const [batchFilter, setBatchFilter] = useState<
    "ALL" | "FLAGGED" | "CLEAN" | "es-ES" | "ca-ES"
  >("ALL");

  // Reference drawer
  const [showRulesDrawer, setShowRulesDrawer] = useState(false);

  const callLqaEndpoint = useCallback(
    async (
      payload:
        | {
            mode: "single";
            row: {
              id: string;
              locale: string;
              source: string;
              target: string;
              max_chars: string;
            };
          }
        | { mode: "batch" }
    ): Promise<LqaCheckResponse> => {
      try {
        const res = await fetch("/api/lqa_check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = (await res.json()) as LqaCheckResponse;
        if (!json || typeof json.ok !== "boolean") {
          throw new Error("Invalid response shape");
        }
        return json;
      } catch {
        // Seamless fallback when running plain `npm run dev` locally without Vercel Python runtime
        const rows =
          payload.mode === "batch" ? sampleStrings : [payload.row];
        return runLocalLqaFallback(rows, glossary, rules);
      }
    },
    [glossary, rules, sampleStrings]
  );

  const runSingleCheck = useCallback(
    async (override?: {
      id: string;
      locale: "es-ES" | "ca-ES";
      source: string;
      target: string;
      max_chars: string;
    }) => {
      const rowToRun = override ?? {
        id: stringId || "CUSTOM",
        locale,
        source,
        target,
        max_chars: maxChars,
      };
      setSingleLoading(true);
      const data = await callLqaEndpoint({ mode: "single", row: rowToRun });
      setSingleResult(data);
      setSingleLoading(false);
    },
    [callLqaEndpoint, stringId, locale, source, target, maxChars]
  );

  const runBatchAudit = useCallback(async () => {
    setBatchLoading(true);
    const data = await callLqaEndpoint({ mode: "batch" });
    setBatchResult(data);
    setBatchLoading(false);
  }, [callLqaEndpoint]);

  // Run initial check on mount so the visitor immediately sees live Python results
  useEffect(() => {
    void runSingleCheck({
      id: "UI-012",
      locale: "ca-ES",
      source: "Settings",
      target: "Configuración",
      max_chars: "20",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-run batch audit the first time the user opens Batch mode
  useEffect(() => {
    if (mode === "batch" && !batchResult && !batchLoading) {
      void runBatchAudit();
    }
  }, [mode, batchResult, batchLoading, runBatchAudit]);

  const loadPreset = (p: PresetExample) => {
    setActivePresetId(p.id);
    setStringId(p.id);
    setLocale(p.locale);
    setMaxChars(p.max_chars);
    setSource(p.source);
    setTarget(p.target);
    void runSingleCheck({
      id: p.id,
      locale: p.locale,
      source: p.source,
      target: p.target,
      max_chars: p.max_chars,
    });
  };

  const loadRowIntoSandbox = (row: SampleStringRow) => {
    const loc: "es-ES" | "ca-ES" = row.locale === "ca-ES" ? "ca-ES" : "es-ES";
    setActivePresetId(row.id);
    setStringId(row.id);
    setLocale(loc);
    setMaxChars(row.max_chars);
    setSource(row.source);
    setTarget(row.target);
    setMode("single");
    void runSingleCheck({
      id: row.id,
      locale: loc,
      source: row.source,
      target: row.target,
      max_chars: row.max_chars,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const numericLimit = Number.parseInt(maxChars, 10);
  const hasLimit = Number.isFinite(numericLimit) && numericLimit > 0;
  const isOverLimit = hasLimit && target.length > numericLimit;

  const issuesByRowId = useMemo(() => {
    const map: Record<string, LqaIssue[]> = {};
    if (!batchResult) return map;
    for (const iss of batchResult.issues) {
      if (!map[iss.id]) map[iss.id] = [];
      map[iss.id].push(iss);
    }
    return map;
  }, [batchResult]);

  const filteredBatchRows = useMemo(() => {
    return sampleStrings.filter((row) => {
      const rowIssues = issuesByRowId[row.id] ?? [];
      if (batchFilter === "FLAGGED") return rowIssues.length > 0;
      if (batchFilter === "CLEAN") return rowIssues.length === 0;
      if (batchFilter === "es-ES") return row.locale === "es-ES";
      if (batchFilter === "ca-ES") return row.locale === "ca-ES";
      return true;
    });
  }, [sampleStrings, issuesByRowId, batchFilter]);

  const renderEnginePill = (res: LqaCheckResponse | null) => {
    if (!res) return null;
    const isPy = res.engine === "python-serverless";
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono border ${
          isPy
            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/35"
            : "bg-amber-500/10 text-amber-200 border-amber-500/35"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            isPy ? "bg-emerald-400" : "bg-amber-400"
          }`}
        />
        {isPy
          ? `Python ${res.python_version} · Vercel Serverless (lqa_checks.py) · ${res.elapsed_ms} ms`
          : `Local TS mirror (deploy on Vercel for Python Serverless) · ${res.elapsed_ms} ms`}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Mode & Intro Bar */}
      <section className="rounded-2xl border border-navy-700 bg-gradient-to-br from-navy-800 via-navy-850 to-navy-900 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/35 bg-sky-500/10 px-3 py-0.5 text-xs font-mono text-sky-300">
            <Terminal className="h-3.5 w-3.5" />
            Phase 2 · Live Python Serverless Tool (Zero External Dependencies)
          </div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
            Live ES/CA LQA Regression Checker
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Test any English-to-Spanish or English-to-Catalan UI string live
            against{" "}
            <code className="px-1.5 py-0.5 rounded bg-navy-950 border border-navy-700 text-sky-200 text-xs">
              lqa_checks.py
            </code>{" "}
            — running directly in Python on Vercel with 8 deterministic rules
            covering placeholders, length, inclusive greetings, glossary,
            Castilianisms, and Catalan IEC 2016 orthography.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-navy-700 bg-navy-900 p-1 self-start shrink-0">
          <button
            onClick={() => setMode("single")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
              mode === "single"
                ? "bg-sky-500/20 text-sky-200 border border-sky-500/35"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Single String Sandbox
          </button>
          <button
            onClick={() => setMode("batch")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
              mode === "batch"
                ? "bg-sky-500/20 text-sky-200 border border-sky-500/35"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Batch Sample Audit (20)
          </button>
        </div>
      </section>

      {/* MODE 1: SINGLE STRING SANDBOX */}
      {mode === "single" ? (
        <div className="space-y-5">
          {/* 1-Click Presets */}
          <div className="rounded-2xl border border-navy-700 bg-navy-800/90 p-4 md:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                Try a Real Defect in 1 Click (or type your own below)
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Fix the target text and re-run to turn a FAIL into PASS
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {presets.map((p) => {
                const isSelected = activePresetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => loadPreset(p)}
                    className={`rounded-xl border px-3 py-1.5 text-left transition-all ${
                      isSelected
                        ? p.clean
                          ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-100"
                          : "border-sky-500/55 bg-sky-500/20 text-white"
                        : "border-navy-700 bg-navy-900/70 text-slate-300 hover:border-navy-600 hover:bg-navy-900"
                    }`}
                  >
                    <div className="text-xs font-medium">{p.label}</div>
                    <div
                      className={`text-[10px] font-mono ${
                        p.clean ? "text-emerald-300" : "text-slate-400"
                      }`}
                    >
                      {p.tag}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Grid: Left Form / Right Live Results */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void runSingleCheck();
              }}
              className="lg:col-span-6 rounded-2xl border border-navy-700 bg-navy-800/90 p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Locale Toggle */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Target Locale
                    </label>
                    <div className="inline-flex rounded-xl border border-navy-700 bg-navy-900 p-0.5">
                      {(["es-ES", "ca-ES"] as const).map((loc) => (
                        <button
                          type="button"
                          key={loc}
                          onClick={() => {
                            setLocale(loc);
                            setActivePresetId("");
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                            locale === loc
                              ? loc === "ca-ES"
                                ? "bg-indigo-500/25 text-indigo-200 border border-indigo-400/40"
                                : "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Max Chars Input */}
                  <div className="space-y-1">
                    <label
                      htmlFor="lqa-max-chars"
                      className="block text-[11px] font-mono uppercase tracking-wider text-slate-400"
                    >
                      Max Chars (optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="lqa-max-chars"
                        type="number"
                        min={0}
                        max={500}
                        value={maxChars}
                        onChange={(e) => {
                          setMaxChars(e.target.value);
                          setActivePresetId("");
                        }}
                        placeholder="No limit"
                        className="w-24 rounded-xl border border-navy-700 bg-navy-900 px-3 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-sky-500"
                      />
                      <span
                        className={`text-xs font-mono px-2 py-1 rounded-lg border ${
                          isOverLimit
                            ? "bg-rose-500/15 text-rose-300 border-rose-500/35"
                            : "bg-navy-900 text-slate-400 border-navy-700"
                        }`}
                      >
                        {target.length}
                        {hasLimit ? ` / ${numericLimit}` : " chars"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Source (EN) */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="lqa-source"
                    className="block text-[11px] font-mono uppercase tracking-wider text-slate-400"
                  >
                    Source String (EN)
                  </label>
                  <textarea
                    id="lqa-source"
                    rows={2}
                    value={source}
                    onChange={(e) => {
                      setSource(e.target.value);
                      setActivePresetId("");
                    }}
                    placeholder="e.g. You have {count} new messages"
                    className="w-full rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                {/* Target (ES / CA) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="lqa-target"
                      className="block text-[11px] font-mono uppercase tracking-wider text-slate-400"
                    >
                      Target String ({locale})
                    </label>
                    {target !== target.trim() && (
                      <span className="text-[11px] font-mono text-amber-300">
                        Leading/trailing whitespace detected
                      </span>
                    )}
                  </div>
                  <textarea
                    id="lqa-target"
                    rows={3}
                    value={target}
                    onChange={(e) => {
                      setTarget(e.target.value);
                      setActivePresetId("");
                    }}
                    placeholder={
                      locale === "ca-ES"
                        ? "e.g. Per canviar l'idioma, vés a Configuració > Idioma."
                        : "e.g. Tienes {cuont} mensajes nuevos"
                    }
                    className="w-full rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-navy-700/70">
                <button
                  type="button"
                  onClick={() => {
                    setActivePresetId("");
                    setStringId("CUSTOM");
                    setSource("");
                    setTarget("");
                    setMaxChars("");
                    setSingleResult(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-navy-600 bg-navy-900 hover:bg-navy-750 px-3 py-2 text-xs font-medium text-slate-300 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={singleLoading || (!source && !target)}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-navy-950 font-semibold px-4 py-2 text-xs sm:text-sm shadow-lg shadow-sky-500/20 transition-all"
                >
                  {singleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 fill-current" />
                  )}
                  Run Python LQA Check
                </button>
              </div>
            </form>

            {/* Right: Live Diagnostic Panel */}
            <div className="lg:col-span-6 rounded-2xl border border-navy-700 bg-navy-800/90 p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Diagnostic Output
                  </span>
                  {renderEnginePill(singleResult)}
                </div>

                {!singleResult ? (
                  <div className="rounded-xl border border-dashed border-navy-600 bg-navy-900/50 p-8 text-center text-xs text-slate-400">
                    Enter a source and target string (or select a preset above)
                    and click <strong className="text-slate-200">Run Python LQA Check</strong>.
                  </div>
                ) : singleResult.issue_count === 0 ? (
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/[0.08] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      PASS · 0 mechanical issues detected
                    </div>
                    <p className="text-xs text-emerald-100/80 leading-relaxed">
                      All 8 deterministic rules passed for{" "}
                      <span className="font-mono">{locale}</span>. Remember: a
                      mechanical pass means form is clean—meaning, tone, and
                      naturalness still belong to human linguistic review.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-rose-500/35 bg-rose-500/[0.08] px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-rose-200 font-semibold text-sm">
                        <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                        FAIL · {singleResult.issue_count}{" "}
                        {singleResult.issue_count === 1 ? "issue" : "issues"}{" "}
                        flagged
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        {singleResult.by_severity.Major > 0 && (
                          <span className="text-amber-300">
                            {singleResult.by_severity.Major} Major
                          </span>
                        )}
                        {singleResult.by_severity.Minor > 0 && (
                          <span className="text-sky-300">
                            {singleResult.by_severity.Minor} Minor
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {singleResult.issues.map((iss, idx) => (
                        <div
                          key={`${iss.check}-${idx}`}
                          className="rounded-xl border border-navy-700 bg-navy-900/80 p-3.5 space-y-1.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <code className="px-2 py-0.5 rounded bg-navy-950 border border-navy-700 text-xs font-mono font-semibold text-sky-300">
                                {iss.check}
                              </code>
                              <SeverityBadge severity={iss.severity} />
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {iss.mqm_category}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-white">
                            {iss.message}
                          </p>
                          {CHECK_EXPLANATIONS[iss.check] && (
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {CHECK_EXPLANATIONS[iss.check]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Deliberate Automation Boundary */}
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.05] p-3.5 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <ShieldAlert className="h-4 w-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-200">
                    What this script deliberately does NOT catch:
                  </strong>{" "}
                  Form is automatable; meaning is not. Semantic reversals (
                  <em>&ldquo;ends in&rdquo;</em> translated as past{" "}
                  <em>&ldquo;terminó hace&rdquo;</em>, D-009), tone/register
                  drift (<em>usted/vostè</em>), and open-ended Catalan grammar (
                  <code>se&apos;te cobrarà</code>, <code>escrivim</code>) still
                  require a human linguist.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MODE 2: BATCH SAMPLE AUDIT (sample_strings.csv — 20 STRINGS) */
        <div className="space-y-5">
          {/* Batch Summary Bar */}
          <div className="rounded-2xl border border-navy-700 bg-navy-800/90 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Full Batch Run on{" "}
                  <code className="text-sky-300 font-mono text-sm">
                    sample_strings.csv
                  </code>{" "}
                  (20 Synthetic UI Strings)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  12 strings with seeded defects + 8 clean control strings (0
                  false positives). Click any row to edit and fix it live in the
                  sandbox.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {renderEnginePill(batchResult)}
                <button
                  onClick={() => void runBatchAudit()}
                  disabled={batchLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/45 bg-sky-500/15 hover:bg-sky-500/25 px-3 py-1.5 text-xs font-semibold text-sky-200 transition-colors"
                >
                  {batchLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                  Re-run Python Audit
                </button>
              </div>
            </div>

            {batchResult && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-navy-700 bg-navy-900/70 p-3.5">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400">
                      Strings Checked
                    </div>
                    <div className="mt-1 text-2xl font-bold font-mono text-white">
                      {batchResult.strings_checked}
                    </div>
                  </div>
                  <div className="rounded-xl border border-navy-700 bg-navy-900/70 p-3.5">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400">
                      Issues Detected
                    </div>
                    <div className="mt-1 text-2xl font-bold font-mono text-rose-300">
                      {batchResult.issue_count}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      {batchResult.by_severity.Major} Major ·{" "}
                      {batchResult.by_severity.Minor} Minor
                    </div>
                  </div>
                  <div className="rounded-xl border border-navy-700 bg-navy-900/70 p-3.5">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400">
                      Flagged Strings
                    </div>
                    <div className="mt-1 text-2xl font-bold font-mono text-amber-300">
                      {batchResult.flagged_strings}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      12/12 seeded caught
                    </div>
                  </div>
                  <div className="rounded-xl border border-navy-700 bg-navy-900/70 p-3.5">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400">
                      Clean Strings
                    </div>
                    <div className="mt-1 text-2xl font-bold font-mono text-emerald-300">
                      {batchResult.clean_strings}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      0 false positives
                    </div>
                  </div>
                </div>

                {/* Filter Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-navy-700/70">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(
                      [
                        { id: "ALL", label: "All (20)" },
                        {
                          id: "FLAGGED",
                          label: `Flagged (${batchResult.flagged_strings})`,
                        },
                        {
                          id: "CLEAN",
                          label: `Clean (${batchResult.clean_strings})`,
                        },
                        { id: "es-ES", label: "es-ES (10)" },
                        { id: "ca-ES", label: "ca-ES (10)" },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setBatchFilter(f.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          batchFilter === f.id
                            ? "bg-sky-500/20 text-sky-200 border-sky-500/45"
                            : "bg-navy-900/60 text-slate-400 border-navy-700 hover:text-slate-200"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs font-mono text-slate-400">
                    Showing{" "}
                    <span className="text-white">
                      {filteredBatchRows.length}
                    </span>{" "}
                    strings
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 20-String Results List */}
          {batchLoading && !batchResult ? (
            <div className="rounded-2xl border border-navy-700 bg-navy-800/70 p-10 text-center text-sm text-slate-300 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
              Running lqa_checks.py on 20 strings...
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredBatchRows.map((row) => {
                const rowIssues = issuesByRowId[row.id] ?? [];
                const isClean = rowIssues.length === 0;
                return (
                  <article
                    key={row.id}
                    className={`rounded-2xl border p-4 transition-colors ${
                      isClean
                        ? "border-navy-700/80 bg-navy-800/70"
                        : "border-rose-500/30 bg-navy-800/95"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-navy-700/60">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white bg-navy-900 border border-navy-700 px-2 py-0.5 rounded">
                          {row.id}
                        </span>
                        <LocaleBadge locale={row.locale} />
                        <span className="text-xs text-slate-400 font-mono">
                          {row.context}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {row.target.length}/{row.max_chars} chars
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isClean ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/35">
                            <CheckCircle2 className="h-3 w-3" />
                            PASS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono bg-rose-500/15 text-rose-300 border border-rose-500/35">
                            <AlertTriangle className="h-3 w-3" />
                            {rowIssues.length}{" "}
                            {rowIssues.length === 1 ? "issue" : "issues"}
                          </span>
                        )}

                        <button
                          onClick={() => loadRowIntoSandbox(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-navy-600 bg-navy-900 hover:border-sky-500/50 px-2.5 py-1 text-xs text-sky-300 transition-colors"
                        >
                          <Edit3 className="h-3 w-3" />
                          Edit in Sandbox
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl border border-navy-700/70 bg-navy-900/60 p-3">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                          Source (EN)
                        </div>
                        <div className="font-mono text-slate-200">
                          {row.source}
                        </div>
                      </div>
                      <div className="rounded-xl border border-navy-700/70 bg-navy-900/80 p-3">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                          Target ({row.locale})
                        </div>
                        <div className="font-mono text-white whitespace-pre-wrap">
                          {row.target}
                          {row.target !== row.target.trim() && (
                            <span className="ml-1 px-1 rounded bg-amber-500/20 text-amber-300 text-[10px]">
                              [trailing space]
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {rowIssues.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {rowIssues.map((iss, i) => (
                          <div
                            key={`${iss.check}-${i}`}
                            className="inline-flex flex-wrap items-center gap-1.5 rounded-lg border border-navy-700 bg-navy-950/80 px-2.5 py-1.5 text-xs"
                          >
                            <code className="font-mono text-sky-300 font-semibold">
                              {iss.check}
                            </code>
                            <SeverityBadge severity={iss.severity} />
                            <span className="text-slate-300">{iss.message}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Collapsible Reference Drawer: Glossary + Rules + Word-Boundary Note */}
      <section className="rounded-2xl border border-navy-700 bg-navy-800/80 overflow-hidden">
        <button
          onClick={() => setShowRulesDrawer((v) => !v)}
          className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-navy-800 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <BookMarked className="h-4 w-4 text-sky-400" />
            <div>
              <div className="text-sm font-semibold text-white">
                Inspect Active Bilingual Glossary ({glossary.length} terms) &amp;
                Rule Lists (rules.json)
              </div>
              <div className="text-xs text-slate-400">
                The exact configuration consumed by lqa_checks.py (shared with
                the Promptfoo eval suite)
              </div>
            </div>
          </div>
          {showRulesDrawer ? (
            <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
          )}
        </button>

        {showRulesDrawer && (
          <div className="px-5 pb-5 pt-2 border-t border-navy-700/70 space-y-5">
            {/* Glossary Table */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-sky-300 mb-2.5">
                glossary.csv — Approved EN → ES/CA UI Terms
              </h4>
              <div className="overflow-x-auto rounded-xl border border-navy-700">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy-900 text-slate-400 font-mono">
                    <tr>
                      <th className="px-3.5 py-2.5">EN Source</th>
                      <th className="px-3.5 py-2.5">es-ES</th>
                      <th className="px-3.5 py-2.5">ca-ES</th>
                      <th className="px-3.5 py-2.5">LQA Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-700/70 bg-navy-900/40">
                    {glossary.map((g) => (
                      <tr key={g.en}>
                        <td className="px-3.5 py-2 font-mono text-white">
                          {g.en}
                        </td>
                        <td className="px-3.5 py-2 font-mono text-cyan-300">
                          {g["es-ES"]}
                        </td>
                        <td className="px-3.5 py-2 font-mono text-indigo-300">
                          {g["ca-ES"]}
                        </td>
                        <td className="px-3.5 py-2 text-slate-400">
                          {g.note || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-navy-700 bg-navy-900/60 p-3.5 space-y-2">
                <div className="font-mono text-indigo-300 font-semibold">
                  castilianisms_ca ({rules.castilianisms_ca.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {rules.castilianisms_ca.map((w) => (
                    <span
                      key={w}
                      className="px-1.5 py-0.5 rounded bg-navy-950 border border-navy-700 font-mono text-[11px] text-slate-300"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-navy-700 bg-navy-900/60 p-3.5 space-y-2">
                <div className="font-mono text-amber-300 font-semibold">
                  obsolete_diacritics_ca ({rules.obsolete_diacritics_ca.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {rules.obsolete_diacritics_ca.map((w) => (
                    <span
                      key={w}
                      className="px-1.5 py-0.5 rounded bg-navy-950 border border-navy-700 font-mono text-[11px] text-slate-300"
                    >
                      {w}
                    </span>
                  ))}
                </div>
                <div className="font-mono text-emerald-300 font-semibold pt-2">
                  allow_identical ({rules.allow_identical.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {rules.allow_identical.map((w) => (
                    <span
                      key={w}
                      className="px-1.5 py-0.5 rounded bg-navy-950 border border-navy-700 font-mono text-[11px] text-slate-300"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-navy-700 bg-navy-900/60 p-3.5 space-y-2">
                <div className="font-mono text-cyan-300 font-semibold">
                  gendered_terms (es-ES / ca-ES)
                </div>
                <div className="flex flex-wrap gap-1">
                  {(rules.gendered_terms["es-ES"] ?? []).map((w) => (
                    <span
                      key={`es-${w}`}
                      className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/25 font-mono text-[11px] text-cyan-200"
                    >
                      {w}
                    </span>
                  ))}
                  {(rules.gendered_terms["ca-ES"] ?? []).map((w) => (
                    <span
                      key={`ca-${w}`}
                      className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-400/25 font-mono text-[11px] text-indigo-200"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Word-boundary bug callout from lqa-checker/README.md */}
            <div className="rounded-xl border border-sky-500/25 bg-sky-500/[0.06] p-3.5 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
              <Code2 className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sky-200">
                  Real ES/CA engineering trap documented in{" "}
                  <code>lqa_checks.py</code>:
                </strong>{" "}
                The first version of the glossary check used a plain substring
                match, so the Spanish Castilianism{" "}
                <code className="text-rose-200">Configuración</code> in Catalan
                UI <strong>passed</strong> because it contains the approved
                Catalan word{" "}
                <code className="text-emerald-200">Configuració</code>.
                Switching to a word-boundary regex (
                <code className="text-sky-200">{"\\bConfiguració\\b"}</code>) fixed
                the false negative—try preset{" "}
                <button
                  type="button"
                  onClick={() => {
                    loadPreset(presets[0]);
                    setMode("single");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-0.5 text-sky-300 hover:text-sky-200 font-semibold underline underline-offset-2"
                >
                  UI-012 above <ArrowRight className="h-3 w-3" />
                </button>{" "}
                to see both checks fire together.
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
