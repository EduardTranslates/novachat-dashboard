import { NextRequest, NextResponse } from "next/server";
import rawData from "@/data/novachat_data.json";
import {
  callLlmWithRotation,
  checkRateLimit,
  getClientIp,
  parseModelList,
} from "@/lib/geminiClient";
import type { NovaChatData } from "@/types/novachat";

const DATA = rawData as unknown as NovaChatData;

const DEFAULT_CHAT_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
];

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,:;"'()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findRecordedReplay(
  question: string,
  mode: "baseline" | "grounded"
): { answer: string; case_id: string; run: string } | null {
  const normQ = normalizeText(question);
  const matchedCase = DATA.cases.find(
    (c) => normalizeText(c.question) === normQ
  );
  if (!matchedCase) return null;

  const targetRun =
    mode === "baseline"
      ? "baseline / gemini-3.5-flash-lite"
      : "grounded / gemini-3.5-flash-lite";

  const ev = DATA.evaluations.find(
    (e) => e.case_id === matchedCase.case_id && e.run === targetRun
  );
  if (!ev) return null;
  return {
    answer: ev.answer,
    case_id: matchedCase.case_id,
    run: ev.run,
  };
}

export async function GET() {
  const liveConfigured = Boolean(
    process.env.GEMINI_API_KEY?.trim() || process.env.OPENROUTER_API_KEY?.trim()
  );
  return NextResponse.json({
    ok: true,
    live_configured: liveConfigured,
    primary_model: parseModelList(
      process.env.GEMINI_CHAT_MODELS,
      DEFAULT_CHAT_MODELS
    )[0],
  });
}

export async function POST(req: NextRequest) {
  let body: { question?: string; mode?: string };
  try {
    body = (await req.json()) as { question?: string; mode?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const question = (body.question ?? "").trim();
  const mode = body.mode === "baseline" ? "baseline" : "grounded";

  if (!question) {
    return NextResponse.json(
      { ok: false, error: "Please enter a question in Spanish or Catalan." },
      { status: 400 }
    );
  }
  if (question.length > 400) {
    return NextResponse.json(
      { ok: false, error: "Question must be 400 characters or fewer." },
      { status: 400 }
    );
  }

  const clientIp = getClientIp(req.headers);
  const limit = checkRateLimit(`chat:${clientIp}`);

  if (!limit.allowed) {
    const replay = findRecordedReplay(question, mode);
    if (replay) {
      return NextResponse.json({
        ok: true,
        mode,
        answer: replay.answer,
        source: "recorded-replay",
        model: replay.run,
        elapsed_ms: 0,
        replay_notice:
          "Session rate limit reached — showing recorded NovaChat replay for this test case.",
      });
    }
    return NextResponse.json(
      {
        ok: false,
        reason: "rate_limited",
        error:
          "Rate limit reached (24 requests / 10 min) to protect the free-tier API quota. Try one of the preset test prompts for instant recorded replay, or retry shortly.",
      },
      { status: 429 }
    );
  }

  const systemPrompt =
    mode === "baseline" ? DATA.prompts.baseline : DATA.prompts.grounded;
  const models = parseModelList(
    process.env.GEMINI_CHAT_MODELS,
    DEFAULT_CHAT_MODELS
  );

  const llmRes = await callLlmWithRotation({
    systemPrompt,
    userPrompt: question,
    models,
    temperature: 0,
    maxOutputTokens: 280,
  });

  if (llmRes.ok) {
    return NextResponse.json({
      ok: true,
      mode,
      answer: llmRes.text,
      source: "live-api",
      provider: llmRes.provider,
      model: llmRes.model,
      elapsed_ms: llmRes.elapsed_ms,
      remaining_requests: limit.remaining,
    });
  }

  // Graceful degradation to recorded replay when API key is unset or daily free quota is exhausted
  const replay = findRecordedReplay(question, mode);
  if (replay) {
    const notice =
      llmRes.reason === "no_api_key"
        ? "Live API key not yet configured — serving authentic recorded NovaChat answer (add GEMINI_API_KEY in Vercel for live responses)."
        : "Daily free-tier API quota reached — gracefully switched to authentic recorded NovaChat replay.";
    return NextResponse.json({
      ok: true,
      mode,
      answer: replay.answer,
      source: "recorded-replay",
      model: replay.run,
      elapsed_ms: 0,
      replay_notice: notice,
    });
  }

  return NextResponse.json(
    {
      ok: false,
      reason: llmRes.reason,
      error:
        llmRes.reason === "no_api_key"
          ? "Live custom prompts require GEMINI_API_KEY in Vercel Environment Variables. Meanwhile, click any of the 6 preset test prompts above to replay real recorded Baseline vs. Grounded answers!"
          : `${llmRes.message} Click any of the 6 preset test prompts above to see authentic recorded Baseline vs. Grounded answers.`,
    },
    { status: llmRes.reason === "quota_exhausted" ? 429 : 503 }
  );
}
