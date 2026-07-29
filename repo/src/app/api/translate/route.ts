import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/llm";

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
- Keep it concise and scannable. Use Markdown.`;

export async function POST(req: NextRequest) {
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

    const reply = await callClaude(
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
