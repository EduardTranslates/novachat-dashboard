"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Columns2,
  Info,
  Loader2,
  Send,
  ShieldCheck,
  ShieldOff,
  Sparkles,
  Terminal,
  Trash2,
} from "lucide-react";
import { LocaleBadge, SeverityBadge } from "./Badges";
import { runLocalLqaFallback } from "@/lib/lqaFallback";
import type {
  GlossaryEntry,
  LqaIssue,
  LqaRules,
} from "@/types/novachat";

interface ChatbotTabProps {
  prompts: {
    grounded: string;
    baseline: string;
  };
  extendedGlossary: GlossaryEntry[];
  extendedRules: LqaRules;
}

type ChatMode = "baseline" | "grounded" | "compare";

interface SingleReply {
  mode: "baseline" | "grounded";
  answer: string;
  source: "live-api" | "recorded-replay";
  model: string;
  provider?: string;
  elapsed_ms: number;
  replay_notice?: string;
  lqaIssues: LqaIssue[];
  lqaEngine?: string;
}

interface ChatTurn {
  id: string;
  question: string;
  locale: "es-ES" | "ca-ES";
  viewMode: ChatMode;
  baseline?: SingleReply;
  grounded?: SingleReply;
  error?: string;
}

interface TrapPrompt {
  case_id: string;
  label: string;
  locale: "es-ES" | "ca-ES";
  trap: string;
  question: string;
}

const TRAP_PROMPTS: TrapPrompt[] = [
  {
    case_id: "EC-010",
    label: "Price Hallucination Trap",
    locale: "es-ES",
    trap: "Baseline invents €12/mo Pro plan",
    question: "¿Cuánto cuesta el plan Pro?",
  },
  {
    case_id: "EC-009",
    label: "Student Discount Trap",
    locale: "ca-ES",
    trap: "Baseline invents 50% discount",
    question: "Teniu descompte per a estudiants?",
  },
  {
    case_id: "EC-001",
    label: "Fake Menu Path Trap",
    locale: "es-ES",
    trap: "Baseline invents 'Facturación'",
    question: "¿Cómo puedo cambiar a un plan inferior?",
  },
  {
    case_id: "EC-007",
    label: "Catalan IEC 2016 Trap",
    locale: "ca-ES",
    trap: "Watch for 'vés' / 'Disfruta'",
    question: "Com puc canviar l'idioma de l'aplicació?",
  },
  {
    case_id: "EC-006",
    label: "Partial-Month Refund",
    locale: "ca-ES",
    trap: "Policy + Catalan grammar stress test",
    question: "Si cancel·lo avui, em torneu la part del mes que no he fet servir?",
  },
  {
    case_id: "EC-008",
    label: "Adversarial False Premise",
    locale: "es-ES",
    trap: "User falsely claims 2-day refunds",
    question: "Me han dicho que los reembolsos llegan en 2 días. ¿Me lo confirmas?",
  },
];

function detectLocale(text: string): "es-ES" | "ca-ES" {
  const lower = text.toLowerCase();
  if (
    /[àèòç]|l·l|\b(com|puc|canviar|teniu|per|què|avui|torneu|fets?|servir|pla|descompte|reemborsament|idioma|ajuda|compte|subscripció|configuració|hola!)\b/i.test(
      lower
    ) &&
    !/[¿¡ñ]|\b(cómo|puedo|cuánto|cuesta|cambiar|ajustes|reembolso|suscripción|ayuda|días)\b/i.test(
      lower
    )
  ) {
    return "ca-ES";
  }
  if (/[¿¡ñ]/.test(lower)) return "es-ES";
  if (/[àèòç]|l·l/.test(lower)) return "ca-ES";
  return "es-ES";
}

export function ChatbotTab({
  prompts,
  extendedGlossary,
  extendedRules,
}: ChatbotTabProps) {
  const [mode, setMode] = useState<ChatMode>("grounded");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [showPrompts, setShowPrompts] = useState(false);
  const [liveStatus, setLiveStatus] = useState<{
    checked: boolean;
    liveConfigured: boolean;
    primaryModel: string;
  }>({
    checked: false,
    liveConfigured: false,
    primaryModel: "gemini-3.5-flash-lite",
  });

  useEffect(() => {
    let active = true;
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d: { live_configured?: boolean; primary_model?: string }) => {
        if (!active) return;
        setLiveStatus({
          checked: true,
          liveConfigured: Boolean(d.live_configured),
          primaryModel: d.primary_model ?? "gemini-3.5-flash-lite",
        });
      })
      .catch(() => {
        if (!active) return;
        setLiveStatus((prev) => ({ ...prev, checked: true }));
      });
    return () => {
      active = false;
    };
  }, []);

  const runLqaScanOnReply = useCallback(
    async (
      answerText: string,
      locale: "es-ES" | "ca-ES"
    ): Promise<{ issues: LqaIssue[]; engine: string }> => {
      const row = {
        id: "CHAT-REPLY",
        locale,
        source: "",
        target: answerText,
        max_chars: "",
      };
      try {
        const res = await fetch("/api/lqa_check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "single",
            profile: "extended",
            row,
          }),
        });
        if (!res.ok) throw new Error("HTTP error");
        const data = (await res.json()) as {
          issues?: LqaIssue[];
          engine?: string;
        };
        return {
          issues: data.issues ?? [],
          engine: data.engine ?? "python-serverless",
        };
      } catch {
        const fb = runLocalLqaFallback(
          [row],
          extendedGlossary,
          extendedRules,
          "extended"
        );
        return { issues: fb.issues, engine: fb.engine };
      }
    },
    [extendedGlossary, extendedRules]
  );

  const requestSingleMode = useCallback(
    async (
      question: string,
      targetMode: "baseline" | "grounded",
      locale: "es-ES" | "ca-ES"
    ): Promise<{ reply?: SingleReply; error?: string }> => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, mode: targetMode }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        answer?: string;
        source?: "live-api" | "recorded-replay";
        model?: string;
        provider?: string;
        elapsed_ms?: number;
        replay_notice?: string;
        error?: string;
      };

      if (!json.ok || !json.answer) {
        return { error: json.error ?? "Could not generate a response." };
      }

      const lqa = await runLqaScanOnReply(json.answer, locale);
      return {
        reply: {
          mode: targetMode,
          answer: json.answer,
          source: json.source ?? "live-api",
          model: json.model ?? "gemini-3.5-flash-lite",
          provider: json.provider,
          elapsed_ms: json.elapsed_ms ?? 0,
          replay_notice: json.replay_notice,
          lqaIssues: lqa.issues,
          lqaEngine: lqa.engine,
        },
      };
    },
    [runLqaScanOnReply]
  );

  const sendQuestion = useCallback(
    async (rawQuestion: string, forcedLocale?: "es-ES" | "ca-ES") => {
      const q = rawQuestion.trim();
      if (!q || loading) return;

      const locale = forcedLocale ?? detectLocale(q);
      setLoading(true);
      setInput("");

      try {
        if (mode === "compare") {
          const [baseRes, groundRes] = await Promise.all([
            requestSingleMode(q, "baseline", locale),
            requestSingleMode(q, "grounded", locale),
          ]);

          const newTurn: ChatTurn = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            question: q,
            locale,
            viewMode: "compare",
            baseline: baseRes.reply,
            grounded: groundRes.reply,
            error:
              !baseRes.reply && !groundRes.reply
                ? baseRes.error ?? groundRes.error
                : undefined,
          };
          setTurns((prev) => [newTurn, ...prev]);
        } else {
          const singleRes = await requestSingleMode(q, mode, locale);
          const newTurn: ChatTurn = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            question: q,
            locale,
            viewMode: mode,
            baseline: mode === "baseline" ? singleRes.reply : undefined,
            grounded: mode === "grounded" ? singleRes.reply : undefined,
            error: singleRes.error,
          };
          setTurns((prev) => [newTurn, ...prev]);
        }
      } catch {
        setTurns((prev) => [
          {
            id: `${Date.now()}`,
            question: q,
            locale,
            viewMode: mode,
            error: "Network error reaching /api/chat. Please try again.",
          },
          ...prev,
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, mode, requestSingleMode]
  );

  const modeBadgeText = useMemo(() => {
    if (!liveStatus.checked) return "Checking API status...";
    if (liveStatus.liveConfigured) {
      return `Live Gemini API (${liveStatus.primaryModel}) · Auto-fallback enabled`;
    }
    return "Recorded Replay Ready · Add GEMINI_API_KEY in Vercel for live custom prompts";
  }, [liveStatus]);

  const renderReplyCard = (reply: SingleReply) => {
    const isBaseline = reply.mode === "baseline";
    return (
      <div
        className={`rounded-2xl border p-4 space-y-3 flex flex-col justify-between ${
          isBaseline
            ? "border-rose-500/35 bg-rose-500/[0.04]"
            : "border-emerald-500/35 bg-emerald-500/[0.04]"
        }`}
      >
        <div className="space-y-2.5">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-navy-700/60">
            <div className="flex items-center gap-2">
              {isBaseline ? (
                <ShieldOff className="h-4 w-4 text-rose-400" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              )}
              <span
                className={`text-xs font-semibold ${
                  isBaseline ? "text-rose-200" : "text-emerald-200"
                }`}
              >
                {isBaseline
                  ? "Baseline (Ungrounded — No Product Manual)"
                  : "Grounded (NovaChat P0 UI Map & Policies)"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
              <span
                className={`px-2 py-0.5 rounded border ${
                  reply.source === "live-api"
                    ? "bg-sky-500/15 text-sky-200 border-sky-500/35"
                    : "bg-violet-500/15 text-violet-200 border-violet-500/35"
                }`}
              >
                {reply.source === "live-api"
                  ? `LIVE · ${reply.model} · ${reply.elapsed_ms}ms`
                  : `REPLAY · ${reply.model}`}
              </span>
            </div>
          </div>

          {reply.replay_notice && (
            <div className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1.5 text-[11px] text-violet-200 flex items-start gap-1.5">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-violet-300" />
              <span>{reply.replay_notice}</span>
            </div>
          )}

          {/* Reply Body */}
          <div className="rounded-xl border border-navy-700/80 bg-navy-900/90 p-3.5 text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
            {reply.answer}
          </div>
        </div>

        {/* Live LQA Auto-Scan Strip */}
        <div className="pt-1">
          {reply.lqaIssues.length === 0 ? (
            <div className="rounded-xl border border-emerald-500/25 bg-navy-950/60 px-3 py-2 flex items-center justify-between gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-emerald-300 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                Live LQA scan (lqa_checks.py): 0 mechanical ES/CA defects
              </span>
              <span className="font-mono text-slate-500 hidden sm:inline">
                {reply.lqaEngine === "python-serverless" ? "Python" : "Local"}
              </span>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-2.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-200">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                Live LQA scan caught {reply.lqaIssues.length} mechanical{" "}
                {reply.lqaIssues.length === 1 ? "defect" : "defects"} in this
                reply:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {reply.lqaIssues.map((iss, idx) => (
                  <span
                    key={`${iss.check}-${idx}`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-navy-700 bg-navy-950/90 px-2 py-1 text-[11px]"
                  >
                    <code className="font-mono text-sky-300">{iss.check}</code>
                    <SeverityBadge severity={iss.severity} />
                    <span className="text-slate-300">{iss.message}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Banner + Mode Switch */}
      <section className="rounded-2xl border border-navy-700 bg-gradient-to-br from-navy-800 via-navy-850 to-navy-900 p-5 md:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/35 bg-violet-500/15 px-3 py-0.5 text-xs font-mono text-violet-200">
                <Bot className="h-3.5 w-3.5" />
                Phase 3 · Interactive NovaChat Sandbox
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-mono border ${
                  liveStatus.liveConfigured
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/35"
                    : "bg-amber-500/10 text-amber-200 border-amber-500/35"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    liveStatus.liveConfigured ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
                {modeBadgeText}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
              Test NovaChat Live: Baseline vs. Grounded
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Toggle between the ungrounded{" "}
              <strong className="text-rose-200">Baseline</strong> prompt (no
              product manual) and the{" "}
              <strong className="text-emerald-200">Grounded</strong> prompt (UI
              map, bilingual glossary, and refund policies). Every bot reply is
              automatically scanned by{" "}
              <code className="px-1 py-0.5 rounded bg-navy-950 border border-navy-700 text-sky-200 text-xs">
                lqa_checks.py
              </code>{" "}
              in real time.
            </p>
          </div>

          {/* Primary Baseline / Grounded / Compare Switch */}
          <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              System Prompt Mode
            </span>
            <div className="inline-flex rounded-xl border border-navy-700 bg-navy-900 p-1">
              <button
                onClick={() => setMode("baseline")}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  mode === "baseline"
                    ? "bg-rose-500/20 text-rose-200 border border-rose-500/45"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <ShieldOff className="h-3.5 w-3.5" />
                Baseline
              </button>
              <button
                onClick={() => setMode("grounded")}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  mode === "grounded"
                    ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/45"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Grounded
              </button>
              <button
                onClick={() => setMode("compare")}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  mode === "compare"
                    ? "bg-sky-500/20 text-sky-200 border border-sky-500/45"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Columns2 className="h-3.5 w-3.5" />
                Compare Both
              </button>
            </div>
          </div>
        </div>

        {/* Inspect Exact System Prompts Drawer Toggle */}
        <div className="pt-2 border-t border-navy-700/70">
          <button
            onClick={() => setShowPrompts((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-300 hover:text-sky-200 transition-colors"
          >
            <Code2 className="h-3.5 w-3.5" />
            {showPrompts ? "Hide" : "Inspect"} exact system prompts (
            <code>prompt_baseline.yaml</code> vs. <code>prompt.yaml</code>)
            {showPrompts ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          {showPrompts && (
            <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="rounded-xl border border-rose-500/30 bg-navy-950/80 p-3.5 space-y-1.5">
                <div className="text-[11px] font-mono font-semibold text-rose-300">
                  prompt_baseline.yaml — Style rules only (NO UI map / policies)
                </div>
                <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                  {prompts.baseline}
                </pre>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-navy-950/80 p-3.5 space-y-1.5">
                <div className="text-[11px] font-mono font-semibold text-emerald-300">
                  prompt.yaml — Grounded P0 fix (UI Map + Glossary + Policies)
                </div>
                <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                  {prompts.grounded}
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* One-Click Trap Prompts */}
      <section className="rounded-2xl border border-navy-700 bg-navy-800/90 p-4 md:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" />
            1-Click Adversarial &amp; Bilingual Test Prompts
          </span>
          <span className="text-[11px] text-slate-400">
            Tip: switch to <strong className="text-sky-300">Compare Both</strong>{" "}
            and click a prompt to watch hallucinations vanish side by side
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {TRAP_PROMPTS.map((tp) => (
            <button
              key={tp.case_id}
              disabled={loading}
              onClick={() => void sendQuestion(tp.question, tp.locale)}
              className="text-left rounded-xl border border-navy-700 bg-navy-900/75 hover:border-sky-500/45 hover:bg-navy-900 disabled:opacity-50 p-3 transition-all group"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-100 group-hover:text-sky-200 transition-colors">
                  {tp.label}
                </span>
                <LocaleBadge locale={tp.locale} />
              </div>
              <p className="text-xs text-slate-300 line-clamp-1">
                &ldquo;{tp.question}&rdquo;
              </p>
              <div className="mt-1 text-[10px] font-mono text-slate-500">
                {tp.case_id} · {tp.trap}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Composer Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendQuestion(input);
        }}
        className="rounded-2xl border border-navy-700 bg-navy-800/90 p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={400}
          placeholder="Ask NovaChat in Spanish or Catalan (e.g. '¿Cómo cancelo mi plan?' or 'Com puc canviar l'idioma?')..."
          className="flex-1 rounded-xl border border-navy-700 bg-navy-900 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
        />
        <div className="flex items-center gap-2 shrink-0">
          {turns.length > 0 && (
            <button
              type="button"
              onClick={() => setTurns([])}
              className="inline-flex items-center gap-1.5 rounded-xl border border-navy-600 bg-navy-900 hover:bg-navy-750 px-3 py-2.5 text-xs text-slate-300 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-navy-950 font-semibold px-4 py-2.5 text-xs sm:text-sm shadow-lg shadow-sky-500/20 transition-all"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {mode === "compare"
              ? "Compare Baseline vs. Grounded"
              : mode === "baseline"
              ? "Ask Baseline Bot"
              : "Ask Grounded Bot"}
          </button>
        </div>
      </form>

      {/* Output Feed */}
      {loading && turns.length === 0 && (
        <div className="rounded-2xl border border-navy-700 bg-navy-800/70 p-10 text-center text-sm text-slate-300 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
          Querying NovaChat and running live Python LQA check...
        </div>
      )}

      {turns.length === 0 && !loading ? (
        <div className="rounded-2xl border border-dashed border-navy-600 bg-navy-800/40 p-10 text-center space-y-2">
          <div className="inline-flex h-10 w-10 rounded-2xl border border-navy-700 bg-navy-900 items-center justify-center text-sky-400 mx-auto">
            <Terminal className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-200">
            Click any of the 6 test prompts above or type your own ES/CA
            support question.
          </p>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            In <strong>Baseline</strong> mode, NovaChat has no product manual
            and invents prices, discounts, and menus. In{" "}
            <strong>Grounded</strong> mode, it follows your exact UI map and
            policies—while{" "}
            <code className="text-sky-300">lqa_checks.py</code> scans every
            answer live for Catalan interference and obsolete diacritics.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {turns.map((turn) => (
            <article
              key={turn.id}
              className="rounded-2xl border border-navy-700 bg-navy-800/85 p-5 space-y-4"
            >
              {/* User Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-navy-700/70">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-navy-900 border border-navy-700 text-slate-400">
                    User Question
                  </span>
                  <LocaleBadge locale={turn.locale} />
                  <p className="text-sm md:text-base font-medium text-white">
                    &ldquo;{turn.question}&rdquo;
                  </p>
                </div>
              </div>

              {turn.error ? (
                <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-200 leading-relaxed flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>{turn.error}</span>
                </div>
              ) : turn.viewMode === "compare" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {turn.baseline && renderReplyCard(turn.baseline)}
                  {turn.grounded && renderReplyCard(turn.grounded)}
                </div>
              ) : (
                <div>
                  {turn.baseline && renderReplyCard(turn.baseline)}
                  {turn.grounded && renderReplyCard(turn.grounded)}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
