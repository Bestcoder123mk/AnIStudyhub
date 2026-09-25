import { NextRequest, NextResponse } from "next/server";
import { callLLM } from "@/lib/llm";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are an expert Sanskrit scholar and CBSE Class 10 Sanskrit (Shemushi) tutor. Your task is to translate Sanskrit text to English (and optionally Hindi) with scholarly accuracy and educational clarity.

Rules:
- Provide a literal word-by-word breakdown first (Sanskrit word → English meaning), so students learn the grammar.
- Then give a fluent English translation of the full sentence/passage.
- Optionally provide a Hindi translation if helpful (mark it "हिंदी:").
- For shlokas/verses, also give a brief 1-line explanation of the meaning/theme.
- Preserve proper nouns (names, places) as-is in transliteration.
- If the input contains grammar constructs (sandhi, samasa, shabdarupa, dhaturoopa), briefly identify them in a "Grammar note:" line.
- Use Devanagari for the Sanskrit input echo, and roman transliteration in brackets where helpful.
- Keep it concise and scannable.

Formatting rules — the app renders this as real Markdown, so they matter:
- **Bold** only the Sanskrit headword in each word-by-word line and short section labels — never whole lines.
- Bullet ("- ") the word-by-word breakdown, one word per line.
- \`code\` formatting only for the Devanagari-in-brackets transliteration, not for ordinary English words.
- No decorative asterisk/dash borders, no ALL CAPS, no stray trailing asterisks.`;

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req);
  if (limit.limited) {
    return NextResponse.json(
      {
        reply:
          limit.reason === "burst"
            ? `Slow down a little — try again in ${limit.retryAfterSeconds}s.`
            : `You've hit today's translator limit. Resets in about ${Math.ceil(limit.retryAfterSeconds / 3600)}h.`,
        error: true,
        rateLimited: true,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const { text, mode } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing 'text' field" }, { status: 400 });
    }

    const modeInstruction = mode === "word-by-word"
      ? "Focus on a detailed word-by-word breakdown with grammar analysis."
      : mode === "full"
      ? "Focus on a fluent full translation with brief meaning."
      : "Provide word-by-word breakdown, full translation, and a grammar note.";

    const reply = await callLLM(
      SYSTEM_PROMPT + "\n\n" + modeInstruction,
      [{ role: "user", content: `Translate and explain this Sanskrit:\n\n${text}` }],
      { maxTokens: 1200, temperature: 0.4 }
    );

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[translate] error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { reply: `Translation failed (${message}). Please try again.`, error: true },
      { status: 200 }
    );
  }
}
