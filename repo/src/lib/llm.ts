/**
 * Thin wrapper around the Anthropic Messages API, used by every AI-powered
 * route in the app (AI Tutor, Sanskrit Translator). Swapping providers later
 * means editing this one file — every route calls `callClaude`, not a
 * specific SDK.
 *
 * Requires MY_LLM_API_KEY to be set in the environment (Vercel: Settings ->
 * Environment Variables). Get a key at https://console.anthropic.com.
 */

const ANTHROPIC_API_KEY = process.env.MY_LLM_API_KEY;
// Fast + inexpensive by default, since this is a chat-style tutor used a lot.
// Bump to "claude-sonnet-5" (env: MY_LLM_MODEL) for stronger reasoning on
// math solving / essay review if you'd rather trade cost for quality.
const ANTHROPIC_MODEL = process.env.MY_LLM_MODEL || "claude-haiku-4-5-20251001";
const ANTHROPIC_VERSION = "2023-06-01";

export interface LlmTurn {
  role: "user" | "assistant";
  content: string;
}

/**
 * The Anthropic API requires strict user/assistant alternation starting on
 * "user". Frontends here sometimes send a history that already ends with
 * the newest user turn duplicated as a separate field — this merges any
 * accidental consecutive same-role turns instead of erroring, and drops a
 * leading assistant turn if present.
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

export async function callClaude(
  system: string,
  turns: LlmTurn[],
  opts: { maxTokens?: number; temperature?: number } = {}
): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("MY_LLM_API_KEY is not set on the server");
  }

  const messages = normalizeTurns(turns);
  if (messages.length === 0) {
    throw new Error("No message content to send");
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: opts.maxTokens ?? 1400,
      temperature: opts.temperature ?? 0.6,
      system,
      messages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Claude API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const text: string = Array.isArray(data.content)
    ? data.content
        .filter((b: { type: string }) => b.type === "text")
        .map((b: { text: string }) => b.text)
        .join("\n")
    : "";

  return text.trim() || "I'm sorry, I couldn't generate a response. Please try rephrasing your question.";
}
