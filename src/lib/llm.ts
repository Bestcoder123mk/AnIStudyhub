/**
 * Thin wrapper around the Google Gemini API (generateContent), used by
 * every AI-powered route in the app (AI Tutor, Sanskrit Translator).
 * Swapping providers later means editing this one file — every route
 * calls `callLLM`, not a specific SDK.
 *
 * Requires MY_LLM_API_KEY to be set in the environment (Vercel: Settings ->
 * Environment Variables). Get a key at https://aistudio.google.com/apikey.
 *
 * NOTE ON MODEL NAME: "gemini-3.6-flash" below was verified live against
 * https://ai.google.dev/gemini-api/docs/deprecations on 2026-09-08 — it's
 * Google's own listed "recommended replacement" target for the prior
 * (2.5/2.0-era) flash preview lines, with no shutdown date announced as of
 * that check. Google ships new flash point-releases roughly monthly, so
 * this will drift out of date again eventually — if it 404s, re-check that
 * page and set MY_LLM_MODEL to override, no code change needed.
 */

const GEMINI_API_KEY = process.env.MY_LLM_API_KEY;
// Fast + inexpensive by default, since this is a chat-style tutor used a lot.
// Bump to "gemini-2.5-pro" (env: MY_LLM_MODEL) for stronger reasoning on
// math solving / essay review if you'd rather trade cost for quality.
const GEMINI_MODEL = process.env.MY_LLM_MODEL || "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface LlmTurn {
  role: "user" | "assistant";
  content: string;
}

/**
 * Gemini (like Anthropic) wants strict user/model alternation starting on
 * "user". Frontends here sometimes send a history that already ends with
 * the newest user turn duplicated as a separate field — this merges any
 * accidental consecutive same-role turns instead of erroring, and drops a
 * leading assistant turn if present. Provider-agnostic — unchanged from
 * the Anthropic version of this file.
 */
function normalizeTurns(turns: LlmTurn[]): LlmTurn[] {
  const out: LlmTurn[] = [];
  for (const t of turns) {
    if (!t.content || !t.content.trim()) continue;
    const role: LlmTurn["role"] = t.role === "assistant" ? "assistant" : "user";
    const last = out[out.length - 1];
    if (last && last.role === role) {
      last.content += "\n\n" + t.content;
    } else {
      out.push({ role, content: t.content });
    }
  }
  while (out.length && out[0].role !== "user") out.shift();
  return out;
}

interface GeminiResponse {
  candidates?: {
    content?: { parts?: { text?: string }[]; role?: string };
    finishReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
}

export async function callLLM(
  system: string,
  turns: LlmTurn[],
  opts: { maxTokens?: number; temperature?: number } = {}
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("MY_LLM_API_KEY is not set on the server");
  }

  const messages = normalizeTurns(turns);
  if (messages.length === 0) {
    throw new Error("No message content to send");
  }

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: opts.maxTokens ?? 1400,
        temperature: opts.temperature ?? 0.6,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data: GeminiResponse = await res.json();

  if (data.promptFeedback?.blockReason) {
    return "I can't respond to that one — it was flagged by the safety filter. Try rephrasing?";
  }

  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((p) => p.text ?? "")
    .join("\n")
    .trim();

  if (!text) {
    const finishReason = data.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== "STOP") {
      // MAX_TOKENS, SAFETY, RECITATION, etc. — surface something more
      // useful than a silent empty reply.
      console.error("Gemini finished without text, reason:", finishReason);
    }
  }

  return text || "I'm sorry, I couldn't generate a response. Please try rephrasing your question.";
}
