"use client";

import React, { useState } from "react";
import {
  BarChart3,
  BookOpen,
  Cpu,
  ExternalLink,
  FileSearch,
  Github,
  Scale,
  Terminal,
} from "lucide-react";
import { OverviewTab } from "./OverviewTab";
import { ProjectStoryTab } from "./ProjectStoryTab";
import { DefectsTab } from "./DefectsTab";
import { ComparatorTab } from "./ComparatorTab";
import { CalibrationTab } from "./CalibrationTab";
import type { MatrixPreset, NovaChatData, TabId } from "@/types/novachat";

export function DashboardClient({ data }: { data: NovaChatData }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // Cross-tab navigation states
  const [highlightedDefectId, setHighlightedDefectId] = useState<string | null>(
    null
  );
  const [comparatorMode, setComparatorMode] = useState<"case" | "matrix">(
    "case"
  );
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    data.cases[0]?.case_id ?? "EC-001"
  );
  const [matrixPreset, setMatrixPreset] = useState<MatrixPreset>("all");
  const [selectedRunFilter, setSelectedRunFilter] = useState<string>("ALL");

  const handleJumpToRun = (runName: string) => {
    setSelectedRunFilter(runName);
    setMatrixPreset("all");
    setComparatorMode("matrix");
    setActiveTab("comparator");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJumpToPreset = (preset: MatrixPreset) => {
    setSelectedRunFilter("ALL");
    setMatrixPreset(preset);
    setComparatorMode("matrix");
    setActiveTab("comparator");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJumpToCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setComparatorMode("case");
    setActiveTab("comparator");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJumpToDefect = (defectId: string) => {
    setHighlightedDefectId(defectId);
    setActiveTab("defects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabs: {
    id: TabId;
    label: string;
    badge?: string;
    badgeAccent?: "emerald" | "default";
    icon: React.ReactNode;
  }[] = [
    {
      id: "overview",
      label: "Executive Overview",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      id: "story",
      label: "Project Story",
      badge: "30s",
      badgeAccent: "emerald",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: "defects",
      label: "MQM Defect Explorer",
      badge: String(data.kpis.total_defects),
      icon: <FileSearch className="h-4 w-4" />,
    },
    {
      id: "comparator",
      label: "4-Model Eval Comparator",
      badge: String(data.kpis.total_answers),
      icon: <Cpu className="h-4 w-4" />,
    },
    {
      id: "calibration",
      label: "LLM Judge Calibration",
      badge: `${data.kpis.calibration_judge_agree}/${data.kpis.calibration_total}`,
      icon: <Scale className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 border-b border-navy-700/80 bg-navy-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-navy-950 font-mono font-bold text-sm shadow-lg shadow-sky-500/20 shrink-0">
                NC
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white">
                    NovaChat ES/CA
                  </h1>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md border border-sky-500/30 bg-sky-500/10 text-sky-300">
                    LQA &amp; LLM Eval Dashboard
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Synthetic portfolio case study · 4 models across 6 runs ·
                  Offline static replay (zero API calls)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={data.meta.results_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-navy-700 bg-navy-800 hover:border-sky-500/40 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-sky-400" />
                RESULTS.md
              </a>
              <a
                href={data.meta.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-500/15 hover:bg-sky-500/25 px-3.5 py-1.5 text-xs font-semibold text-sky-200 transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                View Source Repo
              </a>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav
            aria-label="Dashboard sections"
            className="flex items-center gap-1 overflow-x-auto -mb-px pb-0.5"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === "defects" && highlightedDefectId) {
                      setHighlightedDefectId(null);
                    }
                    setActiveTab(tab.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`inline-flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? tab.id === "story"
                        ? "border-emerald-400 text-white"
                        : "border-sky-400 text-white"
                      : "border-transparent text-slate-400 hover:text-slate-200 hover:border-navy-600"
                  }`}
                >
                  <span
                    className={
                      isActive
                        ? tab.id === "story"
                          ? "text-emerald-400"
                          : "text-sky-400"
                        : "text-slate-500"
                    }
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                  {tab.badge && (
                    <span
                      className={`font-mono text-[11px] px-1.5 py-0.5 rounded-md ${
                        tab.badgeAccent === "emerald"
                          ? isActive
                            ? "bg-emerald-500/25 text-emerald-200 border border-emerald-500/40"
                            : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : isActive
                          ? "bg-sky-500/20 text-sky-200"
                          : "bg-navy-800 text-slate-400"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "overview" && (
          <OverviewTab
            data={data}
            onNavigateTab={(t) => {
              setActiveTab(t);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onJumpToRun={handleJumpToRun}
            onJumpToPreset={handleJumpToPreset}
          />
        )}

        {activeTab === "story" && (
          <ProjectStoryTab
            onNavigateTab={(t) => {
              setActiveTab(t);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {activeTab === "defects" && (
          <DefectsTab
            defects={data.defects}
            highlightedDefectId={highlightedDefectId}
            onClearHighlight={() => setHighlightedDefectId(null)}
            onJumpToCase={handleJumpToCase}
          />
        )}

        {activeTab === "comparator" && (
          <ComparatorTab
            cases={data.cases}
            evaluations={data.evaluations}
            runsSummary={data.runs_summary}
            mode={comparatorMode}
            onModeChange={setComparatorMode}
            selectedCaseId={selectedCaseId}
            onSelectCaseId={setSelectedCaseId}
            matrixPreset={matrixPreset}
            onMatrixPresetChange={setMatrixPreset}
            selectedRunFilter={selectedRunFilter}
            onSelectedRunFilterChange={setSelectedRunFilter}
            onJumpToDefect={handleJumpToDefect}
          />
        )}

        {activeTab === "calibration" && (
          <CalibrationTab
            calibration={data.calibration}
            kpis={data.kpis}
            judgeModel={data.meta.judge_model}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-700/80 bg-navy-950/60 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="space-y-1 max-w-2xl">
            <div className="font-medium text-slate-200">
              Built by {data.meta.author} · Localization Specialist &amp; AI QA
              Reviewer (ES / CA / EN)
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {data.meta.recording_note}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-navy-700 bg-navy-900 px-2.5 py-1 text-[11px] text-slate-400">
              <Terminal className="h-3 w-3 text-sky-400" />
              Next: Live Python LQA Checker &amp; Vercel AI SDK Sandbox
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
