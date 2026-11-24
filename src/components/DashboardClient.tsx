"use client";

import React, { useState } from "react";
import {
  BarChart3,
  BookOpen,
  Bot,
  ChevronDown,
  ChevronUp,
  Cpu,
  ExternalLink,
  FileSearch,
  Github,
  Linkedin,
  Scale,
  Terminal,
} from "lucide-react";
import { OverviewTab } from "./OverviewTab";
import { ProjectStoryTab } from "./ProjectStoryTab";
import { ChatbotTab } from "./ChatbotTab";
import { LiveCheckerTab } from "./LiveCheckerTab";
import { DefectsTab } from "./DefectsTab";
import { ComparatorTab } from "./ComparatorTab";
import { CalibrationTab } from "./CalibrationTab";
import type { MatrixPreset, NovaChatData, TabId } from "@/types/novachat";

interface NavTabDef {
  id: TabId;
  label: string;
  badge?: string;
  badgeAccent?: "emerald" | "violet" | "sky" | "default";
  icon: React.ReactNode;
}

export function DashboardClient({ data }: { data: NovaChatData }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [headerCollapsed, setHeaderCollapsed] = useState(false);

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

  // Row 1: Entry points & Live Interactive Tools
  const primaryTabs: NavTabDef[] = [
    {
      id: "overview",
      label: "Executive Overview",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      id: "story",
      label: "Project Story",
      badge: "1 min",
      badgeAccent: "emerald",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: "sandbox",
      label: "Live NovaChat Sandbox",
      badge: "Live AI",
      badgeAccent: "violet",
      icon: <Bot className="h-4 w-4" />,
    },
    {
      id: "checker",
      label: "Live LQA Checker",
      badge: "Python",
      badgeAccent: "sky",
      icon: <Terminal className="h-4 w-4" />,
    },
  ];

  // Row 2: Recorded Audit Evidence & Calibration Deep-Dive
  const auditTabs: NavTabDef[] = [
    {
      id: "defects",
      label: "MQM Defect Explorer",
      badge: String(data.kpis.total_defects),
      icon: <FileSearch className="h-3.5 w-3.5" />,
    },
    {
      id: "comparator",
      label: "4-Model Eval Comparator",
      badge: String(data.kpis.total_answers),
      icon: <Cpu className="h-3.5 w-3.5" />,
    },
    {
      id: "calibration",
      label: "LLM Judge Calibration",
      badge: `${data.kpis.calibration_judge_agree}/${data.kpis.calibration_total}`,
      icon: <Scale className="h-3.5 w-3.5" />,
    },
  ];

  const allTabs = [...primaryTabs, ...auditTabs];
  const currentTabObj =
    allTabs.find((t) => t.id === activeTab) ?? primaryTabs[0];

  const renderBadgeClass = (tab: NavTabDef, isActive: boolean) => {
    if (tab.badgeAccent === "emerald") {
      return isActive
        ? "bg-emerald-500/25 text-emerald-200 border border-emerald-500/45"
        : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30";
    }
    if (tab.badgeAccent === "violet") {
      return isActive
        ? "bg-violet-500/25 text-violet-100 border border-violet-400/45"
        : "bg-violet-500/15 text-violet-200 border border-violet-400/30";
    }
    if (tab.badgeAccent === "sky") {
      return isActive
        ? "bg-sky-500/25 text-sky-100 border border-sky-400/45"
        : "bg-sky-500/15 text-sky-300 border border-sky-500/30";
    }
    return isActive
      ? "bg-sky-500/20 text-sky-200"
      : "bg-navy-800 text-slate-400";
  };

  const handleSelectTab = (id: TabId) => {
    if (id === "defects" && highlightedDefectId) {
      setHighlightedDefectId(null);
    }
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Sticky Header (Collapsible on mobile & desktop) */}
      <header className="sticky top-0 z-30 border-b border-navy-700/80 bg-navy-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {headerCollapsed ? (
            /* Compact Single-Line Collapsed Bar */
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => handleSelectTab("overview")}
                  className="h-7 w-7 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-navy-950 font-mono font-bold text-xs shadow-md shadow-sky-500/20 shrink-0"
                  title="Go to Executive Overview"
                >
                  NC
                </button>
                <span className="text-xs font-semibold text-slate-400 hidden sm:inline shrink-0">
                  NovaChat ES/CA
                </span>
                <span className="text-slate-600 hidden sm:inline">/</span>
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white truncate">
                  <span className="text-sky-400 shrink-0">
                    {currentTabObj.icon}
                  </span>
                  <span className="truncate">{currentTabObj.label}</span>
                  {currentTabObj.badge && (
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ${renderBadgeClass(
                        currentTabObj,
                        true
                      )}`}
                    >
                      {currentTabObj.badge}
                    </span>
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setHeaderCollapsed(false)}
                aria-expanded={false}
                className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-500/15 hover:bg-sky-500/25 px-3 py-1.5 text-xs font-semibold text-sky-200 transition-colors shrink-0"
              >
                Show menu
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            /* Full Expanded Header */
            <>
              {/* Brand Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 py-3">
                <div className="flex items-center justify-between gap-3">
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
                          LQA &amp; LLM Eval Suite
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        4 models · 6 runs · Live Baseline/Grounded AI Sandbox +
                        Live Python LQA Checker
                      </p>
                    </div>
                  </div>

                  {/* Mobile quick collapse button */}
                  <button
                    type="button"
                    onClick={() => setHeaderCollapsed(true)}
                    aria-expanded={true}
                    title="Collapse header for more reading space"
                    className="md:hidden inline-flex items-center gap-1 rounded-xl border border-navy-700 bg-navy-800 hover:border-sky-500/40 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors shrink-0"
                  >
                    <ChevronUp className="h-3.5 w-3.5 text-sky-400" />
                    Hide
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={data.meta.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-navy-700 bg-navy-800 hover:border-sky-500/40 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors"
                  >
                    <Linkedin className="h-3.5 w-3.5 text-sky-400" />
                    LinkedIn
                  </a>
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
                    className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-500/15 hover:bg-sky-500/25 px-3 py-1.5 text-xs font-semibold text-sky-200 transition-colors"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Source Repo
                  </a>
                  <button
                    type="button"
                    onClick={() => setHeaderCollapsed(true)}
                    aria-expanded={true}
                    title="Collapse header for more reading space"
                    className="hidden md:inline-flex items-center gap-1 rounded-xl border border-navy-700 bg-navy-800/80 hover:border-sky-500/40 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    <ChevronUp className="h-3.5 w-3.5 text-sky-400" />
                    Hide menu
                  </button>
                </div>
              </div>

              {/* Two-Row Grouped Navigation */}
              <div className="border-t border-navy-800 pt-2 pb-2 space-y-1.5">
                {/* Row 1: Start & Live Interactive Tools */}
                <nav
                  aria-label="Start and live interactive tools"
                  className="flex items-center gap-1.5 overflow-x-auto pb-0.5"
                >
                  <span className="hidden lg:inline-block text-[10px] font-mono uppercase tracking-wider text-slate-500 pr-2 shrink-0 w-28">
                    Start &amp; Live
                  </span>
                  {primaryTabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const activeClasses =
                      tab.id === "story"
                        ? "border-emerald-500/50 bg-emerald-500/15 text-white"
                        : tab.id === "sandbox"
                        ? "border-violet-400/50 bg-violet-500/15 text-white"
                        : "border-sky-400/50 bg-sky-500/15 text-white";

                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleSelectTab(tab.id)}
                        className={`inline-flex items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium border transition-colors ${
                          isActive
                            ? activeClasses
                            : "border-navy-700/70 bg-navy-800/50 text-slate-300 hover:text-white hover:border-navy-600 hover:bg-navy-800"
                        }`}
                      >
                        <span
                          className={
                            isActive
                              ? tab.id === "story"
                                ? "text-emerald-300"
                                : tab.id === "sandbox"
                                ? "text-violet-300"
                                : "text-sky-300"
                              : "text-slate-400"
                          }
                        >
                          {tab.icon}
                        </span>
                        {tab.label}
                        {tab.badge && (
                          <span
                            className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md ${renderBadgeClass(
                              tab,
                              isActive
                            )}`}
                          >
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Row 2: Recorded Audit Evidence */}
                <nav
                  aria-label="Recorded audit data"
                  className="flex items-center gap-1.5 overflow-x-auto"
                >
                  <span className="hidden lg:inline-block text-[10px] font-mono uppercase tracking-wider text-slate-500 pr-2 shrink-0 w-28">
                    Audit Data
                  </span>
                  {auditTabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleSelectTab(tab.id)}
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          isActive
                            ? "border-sky-400/50 bg-sky-500/15 text-white"
                            : "border-transparent bg-navy-900/60 text-slate-400 hover:text-slate-200 hover:bg-navy-800/80"
                        }`}
                      >
                        <span
                          className={isActive ? "text-sky-300" : "text-slate-500"}
                        >
                          {tab.icon}
                        </span>
                        {tab.label}
                        {tab.badge && (
                          <span
                            className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${renderBadgeClass(
                              tab,
                              isActive
                            )}`}
                          >
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "overview" && (
          <OverviewTab
            data={data}
            onNavigateTab={handleSelectTab}
            onJumpToRun={handleJumpToRun}
            onJumpToPreset={handleJumpToPreset}
          />
        )}

        {activeTab === "story" && (
          <ProjectStoryTab
            linkedinUrl={data.meta.linkedin_url}
            onNavigateTab={handleSelectTab}
          />
        )}

        {activeTab === "sandbox" && (
          <ChatbotTab
            prompts={data.prompts}
            extendedGlossary={data.lqa_checker.extended_glossary}
            extendedRules={data.lqa_checker.extended_rules}
          />
        )}

        {activeTab === "checker" && (
          <LiveCheckerTab
            glossary={data.lqa_checker.glossary}
            extendedGlossary={data.lqa_checker.extended_glossary}
            rules={data.lqa_checker.rules}
            extendedRules={data.lqa_checker.extended_rules}
            sampleStrings={data.lqa_checker.sample_strings}
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
            <a
              href={data.meta.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-navy-700 bg-navy-900 hover:border-sky-500/40 px-2.5 py-1.5 text-[11px] text-slate-300 hover:text-sky-200 transition-colors"
            >
              <Linkedin className="h-3 w-3 text-sky-400" />
              linkedin.com/in/eduardtranslates
            </a>
            <button
              onClick={() => handleSelectTab("sandbox")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/35 bg-violet-500/10 hover:bg-violet-500/20 px-2.5 py-1.5 text-[11px] text-violet-200 transition-colors"
            >
              <Bot className="h-3 w-3 text-violet-300" />
              Try Live AI Sandbox
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
