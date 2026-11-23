"use client";

import React, { useMemo, useState } from "react";
import {
  AlertOctagon,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Code2,
  Eye,
  Filter,
  HelpCircle,
  MessageSquareQuote,
  Scale,
} from "lucide-react";
import { LocaleBadge, SeverityBadge, VerdictBadge } from "./Badges";
import type {
  EvalCase,
  EvalRow,
  MatrixPreset,
  RunSummary,
} from "@/types/novachat";

interface ComparatorTabProps {
  cases: EvalCase[];
  evaluations: EvalRow[];
  runsSummary: RunSummary[];
  mode: "case" | "matrix";
  onModeChange: (m: "case" | "matrix") => void;
  selectedCaseId: string;
  onSelectCaseId: (cid: string) => void;
  matrixPreset: MatrixPreset;
  onMatrixPresetChange: (p: MatrixPreset) => void;
  selectedRunFilter: string;
  onSelectedRunFilterChange: (r: string) => void;
  onJumpToDefect: (defectId: string) => void;
}

export function ComparatorTab({
  cases,
  evaluations,
  runsSummary,
  mode,
  onModeChange,
  selectedCaseId,
  onSelectCaseId,
  matrixPreset,
  onMatrixPresetChange,
  selectedRunFilter,
  onSelectedRunFilterChange,
  onJumpToDefect,
}: ComparatorTabProps) {
  const [showAssertions, setShowAssertions] = useState(false);
  const [matrixLocale, setMatrixLocale] = useState("ALL");
  const [matrixSeverity, setMatrixSeverity] = useState("ALL");

  const activeCase = useMemo(
    () => cases.find((c) => c.case_id === selectedCaseId) ?? cases[0],
    [cases, selectedCaseId]
  );

  const runOrderIndex = useMemo(() => {
    const map: Record<string, number> = {};
    runsSummary.forEach((r, idx) => {
      map[r.run] = idx;
    });
    return map;
  }, [runsSummary]);

  const caseEvaluations = useMemo(() => {
    if (!activeCase) return [];
    return evaluations
      .filter((e) => e.case_id === activeCase.case_id)
      .sort(
        (a, b) =>
          (runOrderIndex[a.run] ?? 99) - (runOrderIndex[b.run] ?? 99)
      );
  }, [evaluations, activeCase, runOrderIndex]);

  const caseFailCounts = useMemo(() => {
    const map: Record<string, { humanFails: number; blindSpots: number }> = {};
    for (const c of cases) {
      const rows = evaluations.filter((e) => e.case_id === c.case_id);
      map[c.case_id] = {
        humanFails: rows.filter((r) => r.human_verdict === "FAIL").length,
        blindSpots: rows.filter((r) => !r.pass_fail_agree).length,
      };
    }
    return map;
  }, [cases, evaluations]);

  const matrixRows = useMemo(() => {
    return evaluations.filter((e) => {
      if (selectedRunFilter !== "ALL" && e.run !== selectedRunFilter)
        return false;
      if (matrixLocale !== "ALL" && e.locale !== matrixLocale) return false;
      if (matrixSeverity !== "ALL" && e.human_severity !== matrixSeverity)
        return false;
      if (matrixPreset === "disagreements" && e.pass_fail_agree) return false;
      if (matrixPreset === "queries" && e.human_verdict !== "QUERY")
        return false;
      if (
        matrixPreset === "grounded_fails" &&
        !(e.prompt_type === "grounded" && e.human_verdict === "FAIL")
      )
        return false;
      if (matrixPreset === "all_fails" && e.human_verdict !== "FAIL")
        return false;
      return true;
    });
  }, [
    evaluations,
    selectedRunFilter,
    matrixLocale,
    matrixSeverity,
    matrixPreset,
  ]);

  const presets: { id: MatrixPreset; label: string; count: number }[] = [
    { id: "all", label: "All Answers", count: evaluations.length },
    {
      id: "disagreements",
      label: "Suite Blind Spots",
      count: evaluations.filter((e) => !e.pass_fail_agree).length,
    },
    {
      id: "grounded_fails",
      label: "Grounded Failures",
      count: evaluations.filter(
        (e) => e.prompt_type === "grounded" && e.human_verdict === "FAIL"
      ).length,
    },
    {
      id: "queries",
      label: "Product Owner Queries (QUERY)",
      count: evaluations.filter((e) => e.human_verdict === "QUERY").length,
    },
    {
      id: "all_fails",
      label: "All Human Failures",
      count: evaluations.filter((e) => e.human_verdict === "FAIL").length,
    },
  ];

  const caseById = useMemo(() => {
    const m: Record<string, EvalCase> = {};
    cases.forEach((c) => {
      m[c.case_id] = c;
    });
    return m;
  }, [cases]);

  const hasQueryInActiveCase = caseEvaluations.some(
    (e) => e.human_verdict === "QUERY"
  );

  return (
    <div className="space-y-5">
      {/* Sub-mode Toggle Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-navy-700 bg-navy-800/90 px-5 py-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-semibold text-white">
            4-Model Recorded Evaluation Explorer · 6 Runs (72 Answers)
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            4 distinct LLMs across 6 runs: Gemini 3.5 Flash-Lite (1 ungrounded
            baseline + 2 grounded runs to test consistency), plus 1 grounded run
            each for Gemini 3.8 Flash, NVIDIA Nemotron 3 Ultra, and Baidu ERNIE
            5.5 Flash.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-navy-700 bg-navy-900 p-1 self-start shrink-0">
          <button
            onClick={() => onModeChange("case")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === "case"
                ? "bg-sky-500/20 text-sky-200 border border-sky-500/35"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Side-by-Side by Case (12)
          </button>
          <button
            onClick={() => onModeChange("matrix")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === "matrix"
                ? "bg-sky-500/20 text-sky-200 border border-sky-500/35"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Audit Matrix (72)
          </button>
        </div>
      </div>

      {/* MODE A: Case-by-Case Side-by-Side */}
      {mode === "case" && activeCase ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Case Selector Sidebar */}
          <aside className="lg:col-span-3 space-y-1.5">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-1 mb-2">
              Select Eval Case ({cases.length})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5">
              {cases.map((c) => {
                const isSelected = c.case_id === activeCase.case_id;
                const stats = caseFailCounts[c.case_id];
                return (
                  <button
                    key={c.case_id}
                    onClick={() => {
                      onSelectCaseId(c.case_id);
                      setShowAssertions(false);
                    }}
                    className={`w-full text-left rounded-xl border p-3 transition-all ${
                      isSelected
                        ? "border-sky-500/50 bg-sky-500/15 shadow-md shadow-sky-950/30"
                        : "border-navy-700/80 bg-navy-800/70 hover:border-navy-600 hover:bg-navy-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-xs font-bold text-white">
                        {c.case_id}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          c.locale === "ca-ES"
                            ? "bg-indigo-500/20 text-indigo-300"
                            : "bg-cyan-500/20 text-cyan-300"
                        }`}
                      >
                        {c.locale}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-300 truncate">
                      {c.intent}
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono">
                      <span
                        className={
                          stats.humanFails > 0
                            ? "text-rose-300"
                            : "text-emerald-400"
                        }
                      >
                        {stats.humanFails}/6 fail
                      </span>
                      {stats.blindSpots > 0 && (
                        <span className="text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded">
                          {stats.blindSpots} blind spot
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Comparison Area */}
          <div className="lg:col-span-9 space-y-5">
            {/* Case Brief Card */}
            <div className="rounded-2xl border border-navy-700 bg-navy-800/90 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-base font-bold text-white">
                    {activeCase.case_id}
                  </span>
                  <LocaleBadge locale={activeCase.locale} />
                  <SeverityBadge severity={activeCase.risk} />
                  <span className="text-sm font-medium text-slate-200">
                    {activeCase.intent}
                  </span>
                </div>

                {activeCase.linked_defects.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">
                      Linked defects:
                    </span>
                    {activeCase.linked_defects.map((did) => (
                      <button
                        key={did}
                        onClick={() => onJumpToDefect(did)}
                        className="inline-flex items-center gap-1 rounded-md border border-sky-500/35 bg-sky-500/10 hover:bg-sky-500/20 px-2 py-0.5 text-xs font-mono text-sky-300 transition-colors"
                      >
                        {did}
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-navy-700 bg-navy-900/90 p-4 flex items-start gap-3">
                <MessageSquareQuote className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                    User Prompt Sent to All 6 Runs (Temperature 0)
                  </div>
                  <p className="text-sm md:text-base font-medium text-white">
                    &ldquo;{activeCase.question}&rdquo;
                  </p>
                </div>
              </div>

              {/* Expandable Promptfoo Assertions */}
              <div className="mt-3">
                <button
                  onClick={() => setShowAssertions((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-sky-300 transition-colors"
                >
                  <Code2 className="h-3.5 w-3.5" />
                  {showAssertions ? "Hide" : "Inspect"} Promptfoo assertions (
                  {activeCase.assertions.length})
                  {showAssertions ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>

                {showAssertions && (
                  <div className="mt-2.5 space-y-2">
                    {activeCase.assertions.map((a, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-navy-700 bg-navy-950/80 p-3 font-mono text-xs flex flex-wrap items-center gap-2"
                      >
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                          {a.type}
                        </span>
                        {a.metric && (
                          <span className="px-2 py-0.5 rounded bg-navy-800 text-slate-300">
                            metric: {a.metric}
                          </span>
                        )}
                        <code className="text-sky-200 break-all">{a.value}</code>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Contextual QUERY Explainer Banner (shown on EC-001 & EC-002) */}
            {hasQueryInActiveCase && (
              <div className="rounded-xl border border-violet-500/35 bg-violet-500/[0.08] p-3.5 flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                <HelpCircle className="h-4 w-4 text-violet-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-violet-200 font-mono">
                    What does QUERY mean?
                  </strong>{" "}
                  Not a clear failure, but an unverified policy extrapolation:
                  the model gave the right menu path and then extended
                  NovaChat&apos;s <em>cancellation</em> rules to a{" "}
                  <em>plan downgrade</em> (which the source policy does not
                  cover). In a real QA workflow, this is escalated to the{" "}
                  <strong className="text-white">Product Owner (PO)</strong> for
                  policy confirmation.
                </div>
              </div>
            )}

            {/* 6 Model Run Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseEvaluations.map((ev) => {
                const isBaseline = ev.prompt_type === "baseline";
                const isBlindSpot = !ev.pass_fail_agree;
                return (
                  <article
                    key={ev.run}
                    className={`rounded-2xl border p-4 flex flex-col justify-between transition-colors ${
                      isBlindSpot
                        ? "border-amber-500/60 bg-amber-500/[0.06]"
                        : isBaseline
                        ? "border-rose-500/35 bg-navy-800/95"
                        : "border-navy-700 bg-navy-800/85"
                    }`}
                  >
                    <div>
                      {/* Run Header */}
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-navy-700/70">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h4 className="text-sm font-semibold text-white">
                              {ev.short_label}
                            </h4>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                                isBaseline
                                  ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                                  : "bg-navy-900 text-slate-400 border-navy-700"
                              }`}
                            >
                              {ev.run_tag}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                            {ev.model}
                          </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-1.5 shrink-0">
                          <VerdictBadge verdict={ev.auto_result} prefix="Auto:" />
                          <VerdictBadge
                            verdict={ev.human_verdict}
                            prefix="Human:"
                          />
                        </div>
                      </div>

                      {isBlindSpot && (
                        <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-2 flex items-center gap-2 text-xs text-amber-200 font-medium">
                          <AlertOctagon className="h-4 w-4 shrink-0 text-amber-300" />
                          Suite Blind Spot: Automated check passed, human
                          reviewer flagged a Catalan grammar error.
                        </div>
                      )}

                      {/* Verbatim Model Response */}
                      <div className="mt-3 rounded-xl border border-navy-700/80 bg-navy-900/90 p-3.5 text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
                        {ev.answer}
                      </div>

                      {/* Failed Metrics & Severity */}
                      {(ev.auto_failed_metrics.length > 0 ||
                        ev.human_severity) && (
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          {ev.human_severity && (
                            <SeverityBadge severity={ev.human_severity} />
                          )}
                          {ev.auto_failed_metrics.map((m) => (
                            <span
                              key={m}
                              className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/25"
                            >
                              failed: {m}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Human Review Notes */}
                      {ev.human_notes && (
                        <div className="mt-3 text-xs leading-relaxed text-slate-300 bg-navy-900/50 rounded-lg p-2.5 border border-navy-700/60">
                          <span className="font-semibold text-sky-300">
                            Human Audit Note:{" "}
                          </span>
                          {ev.human_notes}
                        </div>
                      )}

                      {/* Cached LLM Judge Reasoning (EC-005 / EC-006) */}
                      {ev.judge && (
                        <div className="mt-3 rounded-lg border border-indigo-400/30 bg-indigo-500/[0.08] p-2.5 text-xs">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="inline-flex items-center gap-1 font-semibold text-indigo-300">
                              <Scale className="h-3.5 w-3.5" />
                              LLM Judge ({ev.judge.judge_model})
                            </span>
                            <VerdictBadge verdict={ev.judge.verdict} />
                          </div>
                          <p className="text-slate-300 leading-relaxed">
                            {ev.judge.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* MODE B: Filterable 72-Answer Audit Matrix */
        <div className="space-y-4">
          <div className="rounded-2xl border border-navy-700 bg-navy-800/90 p-5 space-y-4">
            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 mr-1">
                <Filter className="h-3.5 w-3.5" />
                Quick views:
              </span>
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onMatrixPresetChange(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    matrixPreset === p.id
                      ? "bg-sky-500/20 text-sky-200 border-sky-500/45"
                      : "bg-navy-900/70 text-slate-300 border-navy-700 hover:border-navy-600"
                  }`}
                >
                  {p.label}{" "}
                  <span className="font-mono opacity-75 ml-1">({p.count})</span>
                </button>
              ))}
            </div>

            {matrixPreset === "queries" && (
              <div className="rounded-xl border border-violet-500/35 bg-violet-500/[0.08] p-3 flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                <HelpCircle className="h-4 w-4 text-violet-300 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-violet-200 font-mono">QUERY</strong> =
                  Accurate answer, not a clear failure, but the model
                  extrapolated a policy rule beyond the source documentation
                  (applying cancellation rules to plan downgrades). In
                  production localization QA, these are escalated to the{" "}
                  <strong className="text-white">Product Owner (PO)</strong>{" "}
                  rather than arbitrarily marked PASS or FAIL.
                </span>
              </div>
            )}

            {/* Secondary Dropdown Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-navy-700/70">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedRunFilter}
                  onChange={(e) => onSelectedRunFilterChange(e.target.value)}
                  className="rounded-xl border border-navy-700 bg-navy-900 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="ALL">All 6 Runs (4 Models)</option>
                  {runsSummary.map((r) => (
                    <option key={r.run} value={r.run}>
                      {r.short_label}
                    </option>
                  ))}
                </select>

                <select
                  value={matrixLocale}
                  onChange={(e) => setMatrixLocale(e.target.value)}
                  className="rounded-xl border border-navy-700 bg-navy-900 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="ALL">All Locales</option>
                  <option value="es-ES">es-ES</option>
                  <option value="ca-ES">ca-ES</option>
                </select>

                <select
                  value={matrixSeverity}
                  onChange={(e) => setMatrixSeverity(e.target.value)}
                  className="rounded-xl border border-navy-700 bg-navy-900 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="ALL">All Severities</option>
                  <option value="Critical">Critical (8)</option>
                  <option value="Major">Major (4)</option>
                  <option value="Minor">Minor (6)</option>
                </select>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Showing{" "}
                <span className="text-white font-semibold">
                  {matrixRows.length}
                </span>{" "}
                of {evaluations.length} recorded answers
              </div>
            </div>
          </div>

          {matrixRows.length === 0 ? (
            <div className="rounded-2xl border border-navy-700 bg-navy-800/60 p-10 text-center text-sm text-slate-300">
              No recorded answers match this combination of filters.
            </div>
          ) : (
            <div className="space-y-3">
              {matrixRows.map((ev) => {
                const cObj = caseById[ev.case_id];
                const isBlindSpot = !ev.pass_fail_agree;
                return (
                  <article
                    key={`${ev.case_id}-${ev.run}`}
                    className={`rounded-2xl border p-4 transition-colors ${
                      isBlindSpot
                        ? "border-amber-500/55 bg-amber-500/[0.06]"
                        : "border-navy-700 bg-navy-800/90"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-navy-700/70">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white bg-navy-900 border border-navy-700 px-2 py-0.5 rounded">
                          {ev.case_id}
                        </span>
                        <LocaleBadge locale={ev.locale} />
                        <span className="text-sm font-semibold text-slate-100">
                          {ev.short_label}
                        </span>
                        {cObj && (
                          <span className="text-xs text-slate-400">
                            · {cObj.intent}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {isBlindSpot && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/20 text-amber-200 border border-amber-500/40">
                            SUITE BLIND SPOT
                          </span>
                        )}
                        <VerdictBadge verdict={ev.auto_result} prefix="Auto:" />
                        <VerdictBadge
                          verdict={ev.human_verdict}
                          prefix="Human:"
                        />
                        <SeverityBadge severity={ev.human_severity} />
                        <button
                          onClick={() => {
                            onSelectCaseId(ev.case_id);
                            onModeChange("case");
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-navy-600 bg-navy-900 hover:border-sky-500/50 px-2 py-0.5 text-xs text-sky-300 transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          Compare all 6
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-3">
                      <div className="lg:col-span-7 rounded-xl border border-navy-700/80 bg-navy-900/90 p-3 text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
                        {ev.answer}
                      </div>
                      <div className="lg:col-span-5 space-y-2 text-xs">
                        {ev.human_notes ? (
                          <div className="rounded-xl border border-navy-700/60 bg-navy-900/50 p-3 text-slate-300 leading-relaxed">
                            <span className="font-semibold text-sky-300 block mb-0.5">
                              Human Review Note
                            </span>
                            {ev.human_notes}
                          </div>
                        ) : (
                          <div className="rounded-xl border border-navy-700/40 bg-navy-900/30 p-3 text-slate-500">
                            Clean pass — no issues noted in bilingual audit.
                          </div>
                        )}
                        {ev.judge && (
                          <div className="rounded-xl border border-indigo-400/25 bg-indigo-500/[0.08] p-3 text-slate-300 leading-relaxed">
                            <span className="font-semibold text-indigo-300 block mb-0.5">
                              LLM Judge ({ev.judge.verdict})
                            </span>
                            {ev.judge.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
