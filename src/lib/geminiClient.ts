export interface LlmCallOptions {
  systemPrompt: string;
  userPrompt: string;
  models: string[];
  maxOutputTokens?: number;
  temperature?: number;
  jsonMode?: boolean;
}

export type LlmCallResult =
  | {
      ok: true;
      text: string;
      model: string;
      provider: "gemini" | "openrouter";
      elapsed_ms: number;
    }
  | {
      ok: false;
      reason: "no_api_key" | "quota_exhausted" | "upstream_error";
      message: string;
    };

// Lightweight per-instance sliding-window rate limiter to protect free-tier quota
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX_REQUESTS = 24;
const rateBuckets = new Map<string, number[]>();

export function checkRateLimit(clientKey: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const prev = rateBuckets.get(clientKey) ?? [];
  const fresh = prev.filter((ts) => now - ts < RATE_WINDOW_MS);
  if (fresh.length >= RATE_MAX_REQUESTS) {
    rateBuckets.set(clientKey, fresh);
    return { allowed: false, remaining: 0 };
  }
  fresh.push(now);
  rateBuckets.set(clientKey, fresh);
  // Prevent unbounded memory growth
  if (rateBuckets.size > 500) {
    const firstKey = rateBuckets.keys().next().value;
    if (firstKey) rateBuckets.delete(firstKey);
  }
  return { allowed: true, remaining: RATE_MAX_REQUESTS - fresh.length };
}

export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "anonymous";
}

export function parseModelList(envValue: string | undefined, fallback: string[]): string[] {
  if (!envValue || !envValue.trim()) return fallback;
  const parsed = envValue
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parsed.length > 0 ? parsed : fallback;
}

async function tryGeminiModel(
  apiKey: string,
  model: string,
  opts: LlmCallOptions
): Promise<
  | { ok: true; text: string }
  | { ok: false; status: number; detail: string }
> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const generationConfig: Record<string, unknown> = {
    temperature: opts.temperature ?? 0,
    maxOutputTokens: opts.maxOutputTokens ?? 280,
  };
  if (opts.jsonMode) {
    generationConfig.responseMimeType = "application/json";
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: opts.systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: opts.userPrompt }],
          },
        ],
        generationConfig,
      }),
    });

    const bodyText = await res.text();
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        detail: bodyText.slice(0, 240),
      };
    }

    const parsed = JSON.parse(bodyText) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const text =
      parsed.candidates?.[0]?.content?.parts
        ?.map((p) => p.text ?? "")
        .join("")
        .trim() ?? "";

    if (!text) {
      return {
        ok: false,
        status: 502,
        detail: "Empty completion returned by Gemini API.",
      };
    }
    return { ok: true, text };
  } catch (err) {
    return {
      ok: false,
      status: 504,
      detail: err instanceof Error ? err.message : "Network timeout",
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function tryOpenRouterModel(
  apiKey: string,
  model: string,
  opts: LlmCallOptions
): Promise<
  | { ok: true; text: string }
  | { ok: false; status: number; detail: string }
> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://novachat-dashboard-eight.vercel.app",
        "X-Title": "NovaChat ES/CA LQA Dashboard",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: opts.temperature ?? 0,
        max_tokens: opts.maxOutputTokens ?? 280,
        messages: [
          { role: "system", content: opts.systemPrompt },
          { role: "user", content: opts.userPrompt },
        ],
      }),
    });

    const bodyText = await res.text();
    if (!res.ok) {
      return { ok: false, status: res.status, detail: bodyText.slice(0, 240) };
    }
    const parsed = JSON.parse(bodyText) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = parsed.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) {
      return { ok: false, status: 502, detail: "Empty OpenRouter completion." };
    }
    return { ok: true, text };
  } catch (err) {
    return {
      ok: false,
      status: 504,
      detail: err instanceof Error ? err.message : "Network timeout",
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function callLlmWithRotation(
  opts: LlmCallOptions
): Promise<LlmCallResult> {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!geminiKey && !openRouterKey) {
    return {
      ok: false,
      reason: "no_api_key",
      message:
        "No GEMINI_API_KEY configured in Vercel Environment Variables yet.",
    };
  }

  const t0 = Date.now();
  let sawQuota = false;
  let lastDetail = "";

  if (geminiKey) {
    for (const model of opts.models) {
      const attempt = await tryGeminiModel(geminiKey, model, opts);
      if (attempt.ok) {
        return {
          ok: true,
          text: attempt.text,
          model,
          provider: "gemini",
          elapsed_ms: Date.now() - t0,
        };
      }
      if (attempt.status === 429) sawQuota = true;
      lastDetail = `${model} (${attempt.status})`;
    }
  }

  if (openRouterKey) {
    const orModels = parseModelList(process.env.OPENROUTER_FALLBACK_MODELS, [
      "nvidia/nemotron-3-ultra-550b-a55b:free",
      "baidu/ernie-5.5-flash-preview:free",
    ]);
    for (const model of orModels) {
      const attempt = await tryOpenRouterModel(openRouterKey, model, opts);
      if (attempt.ok) {
        return {
          ok: true,
          text: attempt.text,
          model,
          provider: "openrouter",
          elapsed_ms: Date.now() - t0,
        };
      }
      if (attempt.status === 429) sawQuota = true;
      lastDetail = `${model} (${attempt.status})`;
    }
  }

  return {
    ok: false,
    reason: sawQuota ? "quota_exhausted" : "upstream_error",
    message: sawQuota
      ? "Daily free-tier API quota reached across configured models."
      : `All upstream models failed (${lastDetail}).`,
  };
}
