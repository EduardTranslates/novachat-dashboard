"use client";

import React, { useMemo, useState } from "react";
import { ArrowRight, RotateCcw, Search } from "lucide-react";
import { LayerBadge, LocaleBadge, SeverityBadge } from "./Badges";
import type { DefectItem } from "@/types/novachat";

interface DefectsTabProps {
  defects: DefectItem[];
  highlightedDefectId: string | null;
  onClearHighlight: () => void;
  onJumpToCase: (caseId: string) => void;
}

export function DefectsTab({
  defects,
  highlightedDefectId,
  onClearHighlight,
  onJumpToCase,
}: DefectsTabProps) {
  const [search, setSearch] = useState("");
  const [locale, setLocale] = useState<string>("ALL");
  const [severity, setSeverity] = useState<string>("ALL");
  const [layer, setLayer] = useState<string>("ALL");
  const [category, setCategory] = useState<string>("ALL");

  const categories = useMemo(
    () => Array.from(new Set(defects.map((d) => d.mqm_category))).sort(),
    [defects]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return defects.filter((d) => {
      if (highlightedDefectId && d.id !== highlightedDefectId) return false;
      if (locale !== "ALL" && d.locale !== locale) return false;
      if (severity !== "ALL" && d.severity !== severity) return false;
      if (layer !== "ALL" && d.detection_layer !== layer) return false;
      if (category !== "ALL" && d.mqm_category !== category) return false;
      if (!q) return true;
      return (
        d.id.toLowerCase().includes(q) ||
        (d.string_id ?? "").toLowerCase().includes(q) ||
        d.source_or_reference.toLowerCase().includes(q) ||
        d.target_current.toLowerCase().includes(q) ||
        d.recommended_fix.toLowerCase().includes(q) ||
        d.explanation.toLowerCase().includes(q) ||
        d.rationale.toLowerCase().includes(q) ||
        d.auto_check.toLowerCase().includes(q)
      );
    });
  }, [defects, search, locale, severity, layer, category, highlightedDefectId]);

  const hasActiveFilters =
    Boolean(highlightedDefectId) ||
    search.trim() !== "" ||
    locale !== "ALL" ||
    severity !== "ALL" ||
    layer !== "ALL" ||
    category !== "ALL";

  const resetAll = () => {
    setSearch("");
    setLocale("ALL");
    setSeverity("ALL");
    setLayer("ALL");
    setCategory("ALL");
    onClearHighlight();
  };

  return (
    <div className="space-y-5">
      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-navy-700 bg-navy-800/90 p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                if (highlightedDefectId) onClearHighlight();
                setSearch(e.target.value);
              }}
              placeholder="Search ID, string, castilianism, rule, rationale..."
              className="w-full rounded-xl border border-navy-700 bg-navy-900 pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={category}
              onChange={(e) => {
                if (highlightedDefectId) onClearHighlight();
                setCategory(e.target.value);
              }}
              className="rounded-xl border border-navy-700 bg-navy-900 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All MQM Categories (9)</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={layer}
              onChange={(e) => {
                if (highlightedDefectId) onClearHighlight();
                setLayer(e.target.value);
              }}
              className="rounded-xl border border-navy-700 bg-navy-900 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Detection Layers</option>
              <option value="Python UI checker">Python UI checker (17)</option>
              <option value="Promptfoo evals">Promptfoo evals (4)</option>
              <option value="Human review">Human review (7)</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 rounded-xl border border-navy-600 bg-navy-900 hover:bg-navy-750 px-3 py-2 text-xs font-medium text-slate-200 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Pill Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-navy-700/70">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 mr-1">
                Locale:
              </span>
              {["ALL", "es-ES", "ca-ES"].map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    if (highlightedDefectId) onClearHighlight();
                    setLocale(loc);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors border ${
                    locale === loc
                      ? "bg-sky-500/20 text-sky-200 border-sky-500/40"
                      : "bg-navy-900/60 text-slate-400 border-navy-700 hover:text-slate-200"
                  }`}
                >
                  {loc === "ALL" ? "All" : loc}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 mr-1">
                Severity:
              </span>
              {["ALL", "Critical", "Major", "Minor"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => {
                    if (highlightedDefectId) onClearHighlight();
                    setSeverity(sev);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                    severity === sev
                      ? "bg-sky-500/20 text-sky-200 border-sky-500/40"
                      : "bg-navy-900/60 text-slate-400 border-navy-700 hover:text-slate-200"
                  }`}
                >
                  {sev === "ALL" ? "All" : sev}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Showing <span className="text-white font-semibold">{filtered.length}</span>{" "}
            of {defects.length} defects
            {highlightedDefectId ? (
              <span className="ml-2 text-sky-300">
                (Filtered to {highlightedDefectId})
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Defect Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-navy-700 bg-navy-800/60 p-10 text-center">
          <p className="text-sm text-slate-300">
            No defects match your current filters.
          </p>
          <button
            onClick={resetAll}
            className="mt-3 text-xs font-semibold text-sky-300 hover:text-sky-200"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((d) => (
            <article
              key={d.id}
              className="rounded-2xl border border-navy-700 bg-navy-800/90 hover:border-navy-600 p-5 transition-colors"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-navy-700/70">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white bg-navy-900 border border-navy-700 px-2.5 py-0.5 rounded-lg">
                    {d.id}
                  </span>
                  <LocaleBadge locale={d.locale} />
                  <SeverityBadge severity={d.severity} />
                  <span className="text-xs font-medium text-slate-200 bg-navy-900/80 border border-navy-700 px-2.5 py-0.5 rounded-md">
                    {d.mqm_category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {d.content_type}
                    {d.string_id ? (
                      <span className="font-mono text-slate-300 ml-1">
                        ({d.string_id})
                      </span>
                    ) : null}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <LayerBadge layer={d.detection_layer} />
                  <code className="text-[11px] font-mono text-slate-400 bg-navy-900 px-2 py-0.5 rounded border border-navy-700/80">
                    {d.auto_check}
                  </code>
                </div>
              </div>

              {/* Source / Reference */}
              <div className="mt-3 text-xs text-slate-400">
                <span className="uppercase tracking-wider text-[10px] font-semibold text-slate-500 mr-2">
                  Source / Reference (EN)
                </span>
                <span className="text-slate-200 font-mono text-[12px]">
                  {d.source_or_reference}
                </span>
              </div>

              {/* Before vs After */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-rose-500/25 bg-rose-500/[0.06] p-3.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-300/90 mb-1">
                    Current Defective Target ({d.locale})
                  </div>
                  <p className="text-sm text-rose-100 leading-relaxed">
                    {d.target_current}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-3.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300/90 mb-1">
                    Recommended Fix
                  </div>
                  <p className="text-sm text-emerald-100 leading-relaxed">
                    {d.recommended_fix}
                  </p>
                </div>
              </div>

              {/* Explanation & Rationale */}
              <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                <div>
                  <span className="font-semibold text-slate-300">
                    Issue diagnosis:{" "}
                  </span>
                  <span className="text-slate-400">{d.explanation}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-300">
                    LQA rationale:{" "}
                  </span>
                  <span className="text-slate-400">{d.rationale}</span>
                </div>
              </div>

              {/* Linked Eval Cases */}
              {d.linked_cases.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-navy-700/60 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-400">
                    Covered in live Promptfoo evaluation:
                  </span>
                  {d.linked_cases.map((cid) => (
                    <button
                      key={cid}
                      onClick={() => onJumpToCase(cid)}
                      className="inline-flex items-center gap-1 rounded-md border border-sky-500/35 bg-sky-500/10 hover:bg-sky-500/20 px-2 py-0.5 text-xs font-mono text-sky-300 transition-colors"
                    >
                      {cid}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
