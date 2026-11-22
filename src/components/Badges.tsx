import React from "react";

export function SeverityBadge({ severity }: { severity: string | null }) {
  if (!severity) return null;
  const styles: Record<string, string> = {
    Critical: "bg-rose-500/15 text-rose-300 border-rose-500/35",
    Major: "bg-amber-500/15 text-amber-300 border-amber-500/35",
    Minor: "bg-sky-500/15 text-sky-300 border-sky-500/35",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
        styles[severity] ?? "bg-slate-700/40 text-slate-300 border-slate-600/40"
      }`}
    >
      {severity}
    </span>
  );
}

export function VerdictBadge({
  verdict,
  prefix,
}: {
  verdict: string;
  prefix?: string;
}) {
  const styles: Record<string, string> = {
    PASS: "bg-emerald-500/15 text-emerald-300 border-emerald-500/35",
    FAIL: "bg-rose-500/15 text-rose-300 border-rose-500/35",
    QUERY: "bg-violet-500/15 text-violet-300 border-violet-500/35",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-medium border ${
        styles[verdict] ?? "bg-slate-700/40 text-slate-300 border-slate-600/40"
      }`}
    >
      {prefix ? <span className="opacity-70 font-sans">{prefix}</span> : null}
      {verdict}
    </span>
  );
}

export function LocaleBadge({ locale }: { locale: string }) {
  const isCa = locale === "ca-ES";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium border ${
        isCa
          ? "bg-indigo-500/15 text-indigo-300 border-indigo-400/30"
          : "bg-cyan-500/15 text-cyan-300 border-cyan-400/30"
      }`}
    >
      {locale}
    </span>
  );
}

export function LayerBadge({ layer }: { layer: string }) {
  const styles: Record<string, string> = {
    "Python UI checker": "bg-sky-500/10 text-sky-300 border-sky-500/30",
    "Promptfoo evals": "bg-indigo-500/15 text-indigo-300 border-indigo-400/35",
    "Human review": "bg-amber-500/10 text-amber-200 border-amber-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
        styles[layer] ?? "bg-slate-700/40 text-slate-300 border-slate-600/40"
      }`}
    >
      {layer}
    </span>
  );
}
