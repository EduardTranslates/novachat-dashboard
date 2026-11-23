import { NextRequest, NextResponse } from "next/server";
import {
  callLlmWithRotation,
  checkRateLimit,
  getClientIp,
  parseModelList,
} from "@/lib/geminiClient";

const DEFAULT_LQA_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
];

function extractJsonObject(raw: string): Record<string, unknown> | null {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1)) as Record<
          string,
          unknown
        >;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(req: NextRequest) {
  let body: {
    action?: string;
    locale?: string;
    source?: string;
    target?: string;
  };
  try {
    body = (await req.json()) as {
      action?: string;
      locale?: string;
      source?: string;
      target?: string;
    };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const action = body.action === "translate" ? "translate" : "audit";
  const locale = body.locale === "ca-ES" ? "ca-ES" : "es-ES";
  const source = (body.source ?? "").trim();
  const target = (body.target ?? "").trim();

  if (action === "translate" && !source) {
    return NextResponse.json(
      { ok: false, error: "Enter an English source string to translate." },
      { status: 400 }
    );
  }
  if (action === "audit" && !target) {
    return NextResponse.json(
      { ok: false, error: "Enter a target string to run the semantic LQA audit." },
      { status: 400 }
    );
  }
  if (source.length > 1000 || target.length > 1000) {
    return NextResponse.json(
      { ok: false, error: "Input strings must be 1,000 characters or fewer." },
      { status: 400 }
    );
  }

  const ip = getClientIp(req.headers);
  const limit = checkRateLimit(`lqa-ai:${ip}`);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        reason: "rate_limited",
        error:
          "Rate limit reached (24 AI checks / 10 min) to protect the free-tier API quota. Deterministic Python checks remain unlimited.",
      },
      { status: 429 }
    );
  }

  const models = parseModelList(
    process.env.GEMINI_LQA_MODELS,
    DEFAULT_LQA_MODELS
  );

  if (action === "translate") {
    const localeDesc =
      locale === "ca-ES"
        ? "Catalan (ca-ES, Central standard, IEC 2016 post-reform orthography, Softcatalà UI conventions: Configuració, Subscripció, Desa, Penja, Espai de treball, Fitxer, Compte, Contrasenya, Reemborsament, Servei d'assistència)"
        : "Peninsular Spanish (es-ES, informal 'tú' register, gender-neutral greetings, direct active voice, UI conventions: Ajustes, Suscripción, Mejorar plan, Guardar, Subir, Espacio de trabajo, Equipo de soporte)";

    const llmRes = await callLlmWithRotation({
      systemPrompt:
        `You are a senior software localization specialist translating EN UI/support strings into ${localeDesc}. ` +
        `Preserve every placeholder ({name}, {count}, %s, {date}) verbatim. Use informal register, gender-neutral greetings, and natural UI phrasing (avoid stiff English calques or unnecessary 'por favor'/'si us plau'). ` +
        `Return ONLY the translated string with no quotes or commentary.`,
      userPrompt: source,
      models,
      temperature: 0,
      maxOutputTokens: 220,
    });

    if (!llmRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          reason: llmRes.reason,
          error:
            llmRes.reason === "no_api_key"
              ? "AI translation requires GEMINI_API_KEY in Vercel Environment Variables. Deterministic Python LQA checks work offline without any key."
              : llmRes.message,
        },
        { status: llmRes.reason === "quota_exhausted" ? 429 : 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      action: "translate",
      translation: llmRes.text.replace(/^["«]|["»]$/g, "").trim(),
      model: llmRes.model,
      provider: llmRes.provider,
      elapsed_ms: llmRes.elapsed_ms,
    });
  }

  // Action: Layer 2 Semantic & Grammar Audit
  const auditSystemPrompt = `You are a senior bilingual (es-ES / ca-ES) Localization QA Lead reviewing a software UI or support string against the MQM-Core framework.
Focus strictly on what deterministic regex scripts CANNOT catch:
1. Semantic accuracy / meaning reversals (e.g., future translated as past, wrong cause, dropped nuance).
2. English calques / translationese (e.g., 'corriente de audio', stiff support verbs, passive voice).
3. Register & brand voice (NovaChat uses informal 'tú' in es-ES and 'tu' in ca-ES, active voice, concise UI style without 'por favor'/'si us plau').
4. Open-ended grammar, morphology, clitics, and dialectal consistency (e.g., Catalan 'se'te' -> 'se't', wrong verb person 'escrivim' -> 'escriu', 'de el' -> 'del', Valencian/Central mix).

Respond ONLY with valid JSON matching this exact schema:
{
  "verdict": "PASS" | "WARN" | "FAIL",
  "summary": "One concise sentence in English summarizing linguistic quality.",
  "issues": [
    {
      "category": "Accuracy | Fluency | Style / Tone | Grammar | Cultural / Dialectal",
      "severity": "Critical | Major | Minor",
      "explanation": "Concise diagnosis in English citing the exact problematic target span."
    }
  ],
  "suggested_fix": "Improved natural target string in the target locale (or repeat target verbatim if already clean)."
}`;

  const auditUserPrompt = `Locale: ${locale}
Source (EN): ${source || "(none provided)"}
Target (${locale}): ${target}`;

  const llmRes = await callLlmWithRotation({
    systemPrompt: auditSystemPrompt,
    userPrompt: auditUserPrompt,
    models,
    temperature: 0,
    maxOutputTokens: 450,
    jsonMode: true,
  });

  if (!llmRes.ok) {
    return NextResponse.json(
      {
        ok: false,
        reason: llmRes.reason,
        error:
          llmRes.reason === "no_api_key"
            ? "AI Semantic & Grammar Audit (Layer 2) requires GEMINI_API_KEY in Vercel Environment Variables. Deterministic Python checks (Layer 1) remain 100% live without any key."
            : llmRes.message,
      },
      { status: llmRes.reason === "quota_exhausted" ? 429 : 503 }
    );
  }

  const parsed = extractJsonObject(llmRes.text);
  if (!parsed) {
    return NextResponse.json({
      ok: true,
      action: "audit",
      verdict: "WARN",
      summary: llmRes.text.slice(0, 300),
      issues: [],
      suggested_fix: target,
      model: llmRes.model,
      provider: llmRes.provider,
      elapsed_ms: llmRes.elapsed_ms,
    });
  }

  return NextResponse.json({
    ok: true,
    action: "audit",
    verdict:
      parsed.verdict === "PASS" ||
      parsed.verdict === "FAIL" ||
      parsed.verdict === "WARN"
        ? parsed.verdict
        : "WARN",
    summary: typeof parsed.summary === "string" ? parsed.summary : "",
    issues: Array.isArray(parsed.issues) ? parsed.issues : [],
    suggested_fix:
      typeof parsed.suggested_fix === "string" ? parsed.suggested_fix : target,
    model: llmRes.model,
    provider: llmRes.provider,
    elapsed_ms: llmRes.elapsed_ms,
  });
}
