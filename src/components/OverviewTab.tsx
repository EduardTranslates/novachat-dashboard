"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cpu,
  Database,
  FileSearch,
  Info,
  Layers,
  Scale,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import type { MatrixPreset, NovaChatData, TabId } from "@/types/novachat";

interface OverviewTabProps {
  data: NovaChatData;
  onNavigateTab: (tab: TabId) => void;
  onJumpToRun: (runName: string) => void;
  onJumpToPreset: (preset: MatrixPreset) => void;
}

export function OverviewTab({
  data,
  onNavigateTab,
  onJumpToRun,
  onJumpToPreset,
}: OverviewTabProps) {
  const [chartMode, setChartMode] = useState<"human" | "auto">("human");
  const { kpis, runs_summary } = data;

  const layers = [
    {
      name: "Layer 1 · Deterministic Rules (Python lqa_checks.py)",
      key: "Python UI checker",
      count: kpis.defects_by_layer["Python UI checker"] ?? 0,
      color: "bg-sky-400",
      pill: "text-sky-300 bg-sky-500/10 border-sky-500/30",
      desc: "Mechanical checks & terminology: placeholders, glossary, Castilianisms, gendered greetings, punctuation, character limits.",
    },
    {
      name: "Layer 2 · Semantic Evaluation (Promptfoo + LLM Judge)",
      key: "Promptfoo evals",
      count: kpis.defects_by_layer["Promptfoo evals"] ?? 0,
      color: "bg-indigo-400",
      pill: "text-indigo-300 bg-indigo-500/15 border-indigo-400/30",
      desc: "Policy compliance & grounding under baseline/grounded and adversarial test conditions (captures all 3 Critical archetypes D-002, D-005, D-006 + CA code-switching D-021).",
    },
    {
      name: "Layer 3 · Bilingual Human Linguistic Review",
      key: "Human review",
      count: kpis.defects_by_layer["Human review"] ?? 0,
      color: "bg-amber-400",
      pill: "text-amber-200 bg-amber-500/10 border-amber-500/30",
      desc: "Subtle grammar, naturalness, active voice, register drift, UX clarity, and Product Owner policy escalations (QUERY).",
    },
  ];

  const maxCatCount = Math.max(
    ...kpis.category_breakdown.map((c) => c.count),
    1
  );

  return (
    <div className="space-y-6">
      {/* Thesis Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-navy-700 bg-gradient-to-br from-navy-800 via-navy-850 to-navy-900 p-6 md:p-8 shadow-xl shadow-black/20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
              <Sparkles className="h-3.5 w-3.5" />
              Core Empirical Finding · ES/CA Localization & LLM Evaluation
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
                Grounding fixes facts. It doesn't fix language.
              </h2>
              <button
                onClick={() => onNavigateTab("story")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-semibold px-3.5 py-2 text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.99] shrink-0"
              >
                <BookOpen className="h-4 w-4" />
                1-Minute Read
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Injecting an authoritative UI map, bilingual glossary, and refund
              policy into the system prompt eliminated{" "}
              <span className="font-semibold text-emerald-300">
                all Critical factual hallucinations in this test
              </span>{" "}
              — dropping from{" "}
              <span className="font-mono text-rose-300">8</span> in the
              ungrounded Flash-Lite baseline to{" "}
              <span className="font-mono text-emerald-300">0</span> across all 5
              grounded runs on 4 models (Gemini 3.5 Flash-Lite ×2, Gemini 3.8
              Flash, NVIDIA Nemotron 3 Ultra, and Baidu ERNIE 5.5 Flash). Yet
              Spanish-to-Catalan interference, pre-2016 IEC diacritics, and
              Catalan grammar defects kept slipping past grounded prompts.
            </p>
          </div>

          <div className="flex flex-row lg:flex-col gap-3 shrink-0">
            <div className="rounded-xl border border-navy-700 bg-navy-900/80 px-4 py-3 text-center min-w-[176px]">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">
                Critical Hallucinations
              </div>
              <div className="mt-1 flex items-center justify-center gap-2 font-mono">
                <span className="text-xl font-bold text-rose-400">
                  {kpis.baseline_critical_fails}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500" />
                <span className="text-xl font-bold text-emerald-400">
                  {kpis.grounded_critical_fails}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Flash-Lite baseline vs. 5 grounded runs
              </div>
            </div>

            <button
              onClick={() => onJumpToPreset("grounded_fails")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-500/40 bg-sky-500/15 hover:bg-sky-500/25 px-4 py-2.5 text-xs font-semibold text-sky-200 transition-colors"
            >
              Inspect {kpis.grounded_fails_count} grounded failures
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4 KPI Cards (explicit dataset provenance & operational definitions) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab("defects")}
          className="group text-left rounded-xl border border-navy-700 bg-navy-800/90 hover:border-sky-500/50 hover:bg-navy-800 p-5 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">
              MQM Audit Inventory
            </span>
            <FileSearch className="h-4 w-4 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-white">
            {kpis.total_defects}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-slate-300">
            <span className="text-rose-300">
              {kpis.defects_by_severity.Critical ?? 0} Critical archetypes
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-amber-300">
              {kpis.defects_by_severity.Major ?? 0} Major
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-sky-300">
              {kpis.defects_by_severity.Minor ?? 0} Minor
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            13 UI · 8 system · 4 AI · 3 onboarding ({kpis.defects_by_locale["es-ES"] ?? 0}{" "}
            es-ES · {kpis.defects_by_locale["ca-ES"] ?? 0} ca-ES)
          </div>
        </button>

        <button
          onClick={() => onNavigateTab("comparator")}
          className="group text-left rounded-xl border border-navy-700 bg-navy-800/90 hover:border-sky-500/50 hover:bg-navy-800 p-5 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">
              Live Model Eval Runs
            </span>
            <Cpu className="h-4 w-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-white">
            {kpis.total_answers}
          </div>
          <div className="mt-2 text-xs text-slate-300">
            {kpis.total_cases} ES/CA cases × {kpis.total_runs} runs (1 baseline
            + 5 grounded)
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            4 distinct models · 100% human-audited
          </div>
        </button>

        <button
          onClick={() => onJumpToPreset("disagreements")}
          className="group text-left rounded-xl border border-navy-700 bg-navy-800/90 hover:border-amber-500/50 hover:bg-navy-800 p-5 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">
              Auto vs. Human Agree
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-white">
            {kpis.auto_human_agreement}
            <span className="text-lg text-slate-400">
              /{kpis.total_answers}
            </span>
          </div>
          <div className="mt-2 text-xs text-amber-300">
            FAIL vs. non-FAIL · {kpis.disagreements_count} auto-PASS / human-FAIL
          </div>
          <div className="mt-1 text-[11px] text-violet-300">
            64/66 excl. {kpis.query_count} QUERY (PO escalations)
          </div>
        </button>

        <button
          onClick={() => onNavigateTab("calibration")}
          className="group text-left rounded-xl border border-navy-700 bg-navy-800/90 hover:border-emerald-500/50 hover:bg-navy-800 p-5 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">
              Judge Calibration Set
            </span>
            <Scale className="h-4 w-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-white">
            {kpis.calibration_judge_agree}
            <span className="text-lg text-slate-400">
              /{kpis.calibration_total}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-300">
            Refund-policy judge only (calibration set)
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            vs.{" "}
            <span className="text-rose-300 font-mono">
              {kpis.calibration_legacy_regex_agree}/{kpis.calibration_total}
            </span>{" "}
            old regex ·{" "}
            <span className="text-amber-200 font-mono">
              {kpis.calibration_current_regex_agree}/{kpis.calibration_total}
            </span>{" "}
            broadened
          </div>
        </button>
      </section>

      {/* Dataset Provenance Strip (explicitly separates the 4 collections) */}
      <section className="rounded-xl border border-navy-700/80 bg-navy-900/60 px-4 py-3">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-sky-300 mb-2">
          <Database className="h-3.5 w-3.5" />
          Dataset Provenance · Four Data Collections with Distinct Purposes
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px] text-slate-400 leading-relaxed">
          <div>
            <strong className="text-slate-200">1. MQM Inventory (28):</strong>{" "}
            Audit logged in <code>defect_log.csv</code>: 13 UI strings, 8 system
            messages, 4 AI responses & 3 onboarding items (defines 3
            Critical archetypes: D-002, D-005, D-006).
          </div>
          <div>
            <strong className="text-slate-200">2. Model Evals (72):</strong>{" "}
            Real LLM outputs across 12 Promptfoo cases × 6 runs (8 Critical
            occurrences in Flash-Lite baseline → 0 in all 5 grounded runs).
          </div>
          <div>
            <strong className="text-slate-200">3. Judge Calibration (20):</strong>{" "}
            6 mock fixtures + 8 recorded Gemini replies + 6 adversarial traps
            used to calibrate the refund-policy judge (EC-005/EC-006) only — not
            the optional live semantic/grammar check (no held-out set yet).
          </div>
          <div>
            <strong className="text-slate-200">4. Checker Batch (20):</strong>{" "}
            Synthetic UI regression sample (<code>sample_strings.csv</code>: 12
            seeded defective strings with 14 issues + 8 clean controls).
          </div>
        </div>
      </section>

      {/* Main Charts Row */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Chart 1: 6-Run Model Performance */}
        <div className="xl:col-span-7 rounded-2xl border border-navy-700 bg-navy-800/90 p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Model Performance: 4 Models Across 6 Runs (n = 12 cases/run)
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Evaluated on the same 12 cases: within-model baseline vs.
                  grounded comparison is available for{" "}
                  <strong className="text-slate-200">
                    Gemini 3.5 Flash-Lite
                  </strong>{" "}
                  (1 ungrounded baseline + 2 grounded runs using the same prompt
                  at temperature 0 to check run-to-run consistency); Gemini 3.8
                  Flash, Nemotron 3 Ultra, and ERNIE 5.5 Flash ran grounded
                  only. Click any run to inspect its 12 replies.
                </p>
              </div>
              <div className="inline-flex rounded-lg border border-navy-700 bg-navy-900 p-0.5 self-start shrink-0">
                <button
                  onClick={() => setChartMode("human")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    chartMode === "human"
                      ? "bg-sky-500/20 text-sky-200 border border-sky-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Human Audit
                </button>
                <button
                  onClick={() => setChartMode("auto")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    chartMode === "auto"
                      ? "bg-sky-500/20 text-sky-200 border border-sky-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Automated Suite
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {runs_summary.map((run) => {
                const isBaseline = run.prompt_type === "baseline";
                const passCount =
                  chartMode === "human" ? run.human_pass : run.auto_pass;
                const queryCount = chartMode === "human" ? run.human_query : 0;
                const failCount =
                  chartMode === "human" ? run.human_fail : run.auto_fail;

                const passPct = (passCount / run.total) * 100;
                const queryPct = (queryCount / run.total) * 100;
                const failPct = (failCount / run.total) * 100;

                return (
                  <button
                    key={run.run}
                    onClick={() => onJumpToRun(run.run)}
                    className="w-full text-left group rounded-xl border border-navy-700/70 bg-navy-900/50 hover:border-sky-500/40 hover:bg-navy-900 p-3.5 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium group-hover:text-sky-300 transition-colors ${
                            isBaseline ? "text-rose-200" : "text-slate-100"
                          }`}
                        >
                          {run.short_label}
                        </span>
                        <span
                          className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                            isBaseline
                              ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                              : "bg-navy-800 text-slate-400 border-navy-700"
                          }`}
                        >
                          {run.run_tag}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-emerald-300">
                          {passCount} PASS
                        </span>
                        {queryCount > 0 ? (
                          <span className="text-violet-300">
                            {queryCount} QUERY
                          </span>
                        ) : null}
                        <span
                          className={
                            failCount > 0 ? "text-rose-300" : "text-slate-500"
                          }
                        >
                          {failCount} FAIL
                        </span>
                      </div>
                    </div>

                    {/* Stacked Bar */}
                    <div className="h-3 w-full rounded-full bg-navy-800 overflow-hidden flex border border-navy-700/60">
                      {passPct > 0 && (
                        <div
                          style={{ width: `${passPct}%` }}
                          className="bg-emerald-500/80 transition-all duration-300"
                          title={`PASS: ${passCount}`}
                        />
                      )}
                      {queryPct > 0 && (
                        <div
                          style={{ width: `${queryPct}%` }}
                          className="bg-violet-500/80 transition-all duration-300"
                          title={`QUERY (policy extrapolation escalated to Product Owner): ${queryCount}`}
                        />
                      )}
                      {failPct > 0 && (
                        <div
                          style={{ width: `${failPct}%` }}
                          className="bg-rose-500/80 transition-all duration-300"
                          title={`FAIL: ${failCount}`}
                        />
                      )}
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 gap-2">
                      <span className="truncate">
                        {run.vendor} ·{" "}
                        <code className="text-[10px] text-slate-500">
                          {run.model}
                        </code>
                      </span>
                      <span className="shrink-0">
                        {run.critical_fails > 0 ? (
                          <span className="text-rose-300">
                            {run.critical_fails} Critical · {run.major_fails}{" "}
                            Major · {run.minor_fails} Minor
                          </span>
                        ) : run.human_fail > 0 ? (
                          <span className="text-amber-200">
                            0 Critical · {run.major_fails} Major ·{" "}
                            {run.minor_fails} Minor
                          </span>
                        ) : (
                          <span className="text-emerald-300/90">
                            Passed all 12 cases (0 defects in this set)
                          </span>
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-navy-700/70 space-y-2.5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/80" />{" "}
                PASS
              </span>
              {chartMode === "human" && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-violet-500/80" />{" "}
                  <strong className="text-violet-200 font-mono font-medium">
                    QUERY
                  </strong>
                  : accurate, but extrapolated a policy rule beyond the source
                  text — escalated to Product Owner (PO)
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-rose-500/80" /> FAIL
              </span>
            </div>

            <div className="rounded-xl border border-navy-700/80 bg-navy-900/70 p-3 flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
              <Info className="h-3.5 w-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-200">
                  Agreement & 12/12 context:
                </strong>{" "}
                <span className="font-mono text-slate-200">70/72</span> compares
                automated suite vs. human verdicts on{" "}
                <strong className="text-slate-200">FAIL vs. non-FAIL</strong>{" "}
                (counting the 6 auto-PASS / human-
                <span className="font-mono text-violet-300">QUERY</span> PO
                escalations as non-fail;{" "}
                <span className="font-mono text-slate-200">64/66</span> on
                decisive pass/fail verdicts excluding QUERY). Both disagreements
                were auto-PASS / human-FAIL Catalan grammar errors. Gemini 3.8
                Flash and ERNIE 5.5 Flash scored 12/12 on a single grounded
                run—not a claim of zero errors under broader adversarial load.
              </span>
            </div>
          </div>
        </div>

        {/* Chart 2: 3-Layer QA Architecture + MQM Categories */}
        <div className="xl:col-span-5 space-y-6">
          <div className="rounded-2xl border border-navy-700 bg-navy-800/90 p-6">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="h-4 w-4 text-sky-400" />
              <h3 className="text-base font-semibold text-white">
                3-Layer QA Architecture (28-Defect MQM Split)
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">
              Primary detection layer assigned to each of the 28 MQM audit
              defects (mutually exclusive: Layer 1 rules → Layer 2 semantic
              evals → Layer 3 human review).
            </p>

            {/* Segmented proportion bar */}
            <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-navy-900 border border-navy-700 mb-5">
              {layers.map((layer) => (
                <div
                  key={layer.key}
                  style={{
                    width: `${(layer.count / kpis.total_defects) * 100}%`,
                  }}
                  className={`${layer.color} opacity-85`}
                  title={`${layer.name}: ${layer.count}`}
                />
              ))}
            </div>

            <div className="space-y-3">
              {layers.map((layer) => {
                const pct = Math.round(
                  (layer.count / kpis.total_defects) * 100
                );
                return (
                  <div
                    key={layer.key}
                    className="rounded-xl border border-navy-700/70 bg-navy-900/50 p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-100">
                        {layer.name}
                      </span>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded border shrink-0 ${layer.pill}`}
                      >
                        {layer.count}/{kpis.total_defects} ({pct}%)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {layer.desc}
                    </p>
                    {layer.key === "Python UI checker" && (
                      <button
                        onClick={() => onNavigateTab("checker")}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-sky-300 hover:text-sky-200 transition-colors"
                      >
                        Try lqa_checks.py live in browser
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                    {layer.key === "Promptfoo evals" && (
                      <button
                        onClick={() => onNavigateTab("sandbox")}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-violet-300 hover:text-violet-200 transition-colors"
                      >
                        Test Baseline vs. Grounded chatbot live
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-navy-700 bg-navy-800/90 p-6">
            <h3 className="text-sm font-semibold text-white mb-4">
              Defects by MQM-Adapted Category (n = 28)
            </h3>
            <div className="space-y-2.5">
              {kpis.category_breakdown.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 truncate pr-2">
                      {item.category}
                    </span>
                    <span className="font-mono text-slate-400">
                      {item.count}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-navy-900 overflow-hidden">
                    <div
                      style={{
                        width: `${(item.count / maxCatCount) * 100}%`,
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom 3 Spotlight Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-navy-700 bg-navy-800/80 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <AlertTriangle className="h-4 w-4" />
              Where Automation Still Fails
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Auto–human agreement was{" "}
              <span className="font-mono text-white">70/72</span> on FAIL vs.
              non-FAIL (<span className="font-mono text-white">64/66</span>{" "}
              excluding 6 PO QUERY escalations). Both misses were auto-PASS /
              human-FAIL Catalan grammar errors:{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-900 text-amber-200 text-xs">
                se'te cobrarà
              </code>{" "}
              →{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-900 text-emerald-200 text-xs">
                se't cobrarà
              </code>{" "}
              (broken clitic) and{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-900 text-amber-200 text-xs">
                escrivim
              </code>{" "}
              →{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-900 text-emerald-200 text-xs">
                escriu
              </code>{" "}
              (1st-person plural instead of imperative).
            </p>
          </div>
          <button
            onClick={() => onJumpToPreset("disagreements")}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-sky-200"
          >
            Jump to the 2 blind spots <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="rounded-2xl border border-navy-700 bg-navy-800/80 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Cpu className="h-4 w-4" />
              Why Cross-Vendor Testing Matters
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Running NVIDIA Nemotron 3 Ultra exposed suite blind spots four
              Gemini runs never triggered: narrow no-break spaces (
              <code className="text-xs text-sky-200">U+202F</code>) inside{" "}
              <em>14 días</em>, the Castilianism{" "}
              <code className="text-xs text-sky-200">reembolsen</code>, and a
              real-world policy loophole (<em>"(si procede)"</em>)
              caught by the calibrated LLM judge.
            </p>
          </div>
          <button
            onClick={() => onJumpToRun("grounded / nemotron-3-ultra")}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-sky-200"
          >
            Inspect Nemotron 3 Ultra run <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="rounded-2xl border border-navy-700 bg-navy-800/80 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldAlert className="h-4 w-4 text-violet-400" />
              Why 12 Cases? Scope & Authorship
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              This is a reproducible{" "}
              <span className="text-white font-medium">
                method demonstration
              </span>
              , not a market benchmark. I designed the MQM audit, 12 ES/CA
              cases, traps, glossary, judge rubric, and Python rules, and
              audited 100% of the 72 replies; AI coding assistance helped
              accelerate the Next.js web interface scaffolding.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("calibration")}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-sky-200"
          >
            Review judge calibration limits{" "}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}