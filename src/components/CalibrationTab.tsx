"use client";

import React, { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Info, Scale, ShieldCheck } from "lucide-react";
import { LocaleBadge, VerdictBadge } from "./Badges";
import type { CalibrationRow, NovaChatData } from "@/types/novachat";

interface CalibrationTabProps {
  calibration: CalibrationRow[];
  kpis: NovaChatData["kpis"];
  judgeModel: string;
}

type CalFilter =
  | "ALL"
  | "TRAPS"
  | "REGEX_FAIL"
  | "REAL_GEMINI"
  | "MOCKS"
  | "ES"
  | "CA";

export function CalibrationTab({
  calibration,
  kpis,
  judgeModel,
}: CalibrationTabProps) {
  const [filter, setFilter] = useState<CalFilter>("ALL");

  const filtered = useMemo(() => {
    return calibration.filter((row) => {
      if (filter === "TRAPS") return row.is_trap;
      if (filter === "REGEX_FAIL")
        return !row.legacy_regex_agree || !row.current_regex_agree;
      if (filter === "REAL_GEMINI") return row.source.startsWith("gemini:");
      if (filter === "MOCKS") return row.source.startsWith("mock-");
      if (filter === "ES") return row.locale === "es-ES";
      if (filter === "CA") return row.locale === "ca-ES";
      return true;
    });
  }, [calibration, filter]);

  const total = kpis.calibration_total;
  const methods = [
    {
      name: "Replaced Regex Pair (Pre-Judge)",
      score: kpis.calibration_legacy_regex_agree,
      fp: calibration.filter(
        (c) => c.legacy_regex === "PASS" && c.human_label === "FAIL"
      ).length,
      fn: calibration.filter(
        (c) => c.legacy_regex === "FAIL" && c.human_label === "PASS"
      ).length,
      barColor: "bg-rose-500/80",
      textColor: "text-rose-300",
      note: "Fails 4 adversarial negation/exception traps (JC-15–JC-18) + 2 paraphrase variants without 'periodo de facturación' (JC-19–JC-20).",
    },
    {
      name: "Current Access Regex Alone",
      score: kpis.calibration_current_regex_agree,
      fp: calibration.filter(
        (c) => c.current_regex === "PASS" && c.human_label === "FAIL"
      ).length,
      fn: calibration.filter(
        (c) => c.current_regex === "FAIL" && c.human_label === "PASS"
      ).length,
      barColor: "bg-amber-500/80",
      textColor: "text-amber-300",
      note: "Broadened with 'fecha/data de renovación' (fixes JC-19–JC-20), but still passes 4 policy-violating answers.",
    },
    {
      name: `Calibrated LLM Judge (${judgeModel})`,
      score: kpis.calibration_judge_agree,
      fp: 0,
      fn: 0,
      barColor: "bg-emerald-500/85",
      textColor: "text-emerald-300",
      note: "Versioned rubric at temperature 0. Catches hidden credits, open exceptions, and self-contradictions in ES & CA.",
    },
    {
      name: "Production Suite (Access Regex + Judge)",
      score: kpis.calibration_suite_agree,
      fp: 0,
      fn: 0,
      barColor: "bg-sky-400/90",
      textColor: "text-sky-300",
      note: "Combined deterministic billing-period check + semantic LLM judge deployed in eval_cases.jsonl.",
    },
  ];

  const filterButtons: { id: CalFilter; label: string; count: number }[] = [
    { id: "ALL", label: "All Answers", count: calibration.length },
    {
      id: "TRAPS",
      label: "Adversarial Traps",
      count: calibration.filter((c) => c.is_trap).length,
    },
    {
      id: "REGEX_FAIL",
      label: "Regex Misses",
      count: calibration.filter(
        (c) => !c.legacy_regex_agree || !c.current_regex_agree
      ).length,
    },
    {
      id: "REAL_GEMINI",
      label: "Real Gemini Outputs",
      count: calibration.filter((c) => c.source.startsWith("gemini:")).length,
    },
    {
      id: "MOCKS",
      label: "Mock Fixtures",
      count: calibration.filter((c) => c.source.startsWith("mock-")).length,
    },
    {
      id: "ES",
      label: "es-ES",
      count: calibration.filter((c) => c.locale === "es-ES").length,
    },
    {
      id: "CA",
      label: "ca-ES",
      count: calibration.filter((c) => c.locale === "ca-ES").length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4-Method Comparison Card */}
      <section className="rounded-2xl border border-navy-700 bg-navy-800/90 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-sky-400" />
              <h2 className="text-base font-semibold text-white">
                Partial-Month Refund Policy Judge Calibration (EC-005 &amp;
                EC-006)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Evaluated against 20 human-labelled ES/CA answers (6 mock
              fixtures, 8 real Gemini runs, 6 synthetic adversarial traps).
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-300 self-start">
            <ShieldCheck className="h-3.5 w-3.5" />
            20/20 Agreement · 0 FP / 0 FN
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {methods.map((m) => (
            <div
              key={m.name}
              className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-100">
                  {m.name}
                </span>
                <span className={`font-mono text-sm font-bold ${m.textColor}`}>
                  {m.score}/{total} ({Math.round((m.score / total) * 100)}%)
                </span>
              </div>

              <div className="h-2.5 w-full rounded-full bg-navy-800 overflow-hidden">
                <div
                  style={{ width: `${(m.score / total) * 100}%` }}
                  className={`h-full rounded-full ${m.barColor}`}
                />
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span
                  className={m.fp > 0 ? "text-rose-300" : "text-slate-400"}
                >
                  False positives (passes bad): {m.fp}
                </span>
                <span className="text-slate-600">·</span>
                <span
                  className={m.fn > 0 ? "text-amber-300" : "text-slate-400"}
                >
                  False negatives (fails good): {m.fn}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{m.note}</p>
            </div>
          ))}
        </div>

        {/* Methodological Transparency Note */}
        <div className="mt-4 rounded-xl border border-sky-500/25 bg-sky-500/[0.06] p-3.5 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
          <Info className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-sky-200">
              Methodological note on 14/20 vs. 16/20 &amp; reviewer bias:{" "}
            </span>
            The original replaced regex pair scored{" "}
            <span className="font-mono text-white">14/20</span> (failing both
            traps JC-15–JC-18 and wording variants JC-19–JC-20). After
            broadening the access regex in{" "}
            <code className="text-sky-200">eval_cases.jsonl</code> to accept{" "}
            <em>fecha/data de renovación</em>, the remaining regex alone scores{" "}
            <span className="font-mono text-white">16/20</span> (still passing
            all 4 deceptive traps). Because the same author designed the rubric
            and traps, 20/20 validates rubric sanity rather than providing an
            independent population accuracy estimate.
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                filter === btn.id
                  ? "bg-sky-500/20 text-sky-200 border-sky-500/45"
                  : "bg-navy-800/80 text-slate-300 border-navy-700 hover:border-navy-600"
              }`}
            >
              {btn.label}{" "}
              <span className="font-mono opacity-70 ml-1">({btn.count})</span>
            </button>
          ))}
        </div>
        <div className="text-xs font-mono text-slate-400">
          Showing <span className="text-white">{filtered.length}</span> of{" "}
          {calibration.length} items
        </div>
      </div>

      {/* Calibration Items */}
      <div className="space-y-3.5">
        {filtered.map((item) => {
          const regexDisagreed = !item.legacy_regex_agree;
          return (
            <article
              key={item.id}
              className={`rounded-2xl border p-5 transition-colors ${
                item.is_trap
                  ? "border-indigo-400/40 bg-indigo-500/[0.06]"
                  : "border-navy-700 bg-navy-800/90"
              }`}
            >
              {/* Top Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-navy-700/70">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white bg-navy-900 border border-navy-700 px-2.5 py-0.5 rounded-lg">
                    {item.id}
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {item.case_id}
                  </span>
                  <LocaleBadge locale={item.locale} />
                  {item.is_trap ? (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/20 text-amber-200 border border-amber-500/40">
                      Adversarial Trap
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">
                      {item.source}
                    </span>
                  )}
                </div>

                {/* Method Verdicts Strip */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <VerdictBadge verdict={item.human_label} prefix="Human:" />
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono border ${
                      item.legacy_regex_agree
                        ? "bg-navy-900 text-slate-300 border-navy-700"
                        : "bg-rose-500/15 text-rose-200 border-rose-500/40"
                    }`}
                  >
                    <span className="font-sans opacity-70">Old Regex:</span>
                    {item.legacy_regex}
                    {!item.legacy_regex_agree && (
                      <AlertCircle className="h-3 w-3 text-rose-400" />
                    )}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono border ${
                      item.current_regex_agree
                        ? "bg-navy-900 text-slate-300 border-navy-700"
                        : "bg-amber-500/15 text-amber-200 border-amber-500/40"
                    }`}
                  >
                    <span className="font-sans opacity-70">Cur Regex:</span>
                    {item.current_regex}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono border bg-emerald-500/15 text-emerald-200 border-emerald-500/35">
                    <span className="font-sans opacity-70">Judge:</span>
                    {item.judge}
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  </span>
                </div>
              </div>

              {/* Answer Text */}
              <div className="mt-3 rounded-xl border border-navy-700/80 bg-navy-900/90 p-3.5 text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
                {item.answer}
              </div>

              {/* Author Trap Note + Judge Reasoning */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                <div
                  className={`rounded-xl border p-3 ${
                    regexDisagreed
                      ? "border-amber-500/30 bg-amber-500/[0.06]"
                      : "border-navy-700/60 bg-navy-900/50"
                  }`}
                >
                  <span className="font-semibold text-amber-200 block mb-0.5">
                    Human Design Note
                  </span>
                  <span className="text-slate-300">{item.note}</span>
                </div>

                <div className="rounded-xl border border-indigo-400/25 bg-indigo-500/[0.08] p-3">
                  <span className="font-semibold text-indigo-300 block mb-0.5">
                    Cached Judge Rationale ({judgeModel})
                  </span>
                  <span className="text-slate-300">{item.judge_reason}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
