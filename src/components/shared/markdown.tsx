"use client";

import React from "react";

/**
 * Markdown — a small, dependency-free renderer for the light markdown
 * subset every AI prompt in this app is told to produce (headings, bullet/
 * numbered lists, **bold**, *italic*, `code`, fenced ``` code blocks, ---
 * rules, [links](url)) plus plain paragraphs.
 *
 * Why not `react-markdown` (already a devDependency)? This is intentionally
 * a small in-house component matching the app's existing visual language
 * (subject-colour bullets, glass code chips) rather than pulling in a full
 * AST pipeline + remark/rehype plugins for a fixed, known-small syntax
 * subset. It started as `skt-translator.tsx`'s local `MarkdownLite` and is
 * now the one shared implementation — every place that renders AI or
 * long-form authored text (AI Tutor, Sanskrit Translator, quiz/flashcard/
 * short-and-long-answer explanations) should use THIS component instead of
 * dumping raw text into a `whitespace-pre-wrap` div, which is what caused
 * literal, unrendered "**asterisks**" to show up before.
 *
 * Color: by default every accent (bullet dots, numbered-list index, code
 * chip, bold-on-hover, blockquote bar) reads `var(--sc, var(--primary))` —
 * the same subject-colour cascade the rest of the app uses (see
 * `.subj-*` in globals.css) — so wrapping a <Markdown> in a `.subj-chem`
 * div re-tints it for free, and outside any subject wrapper it falls back
 * to the user's customizable accent colour (Settings → Accent Colour).
 * Pass `accent="#hex"` to force a specific colour instead (e.g. the
 * Sanskrit Translator's gold, independent of the subject-colour cascade).
 */

function escapeForKey(s: string, i: number) {
  return `${i}-${s.slice(0, 6)}`;
}

// Inline pass 2: `code` spans (highest precedence — its contents are never
// parsed further) and [text](url) links.
function InlineCodeAndLinks({ text, accent }: { text: string; accent?: string }) {
  const segments = text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {segments.map((seg, i) => {
        if (/^`[^`]+`$/.test(seg)) {
          return (
            <code
              key={escapeForKey(seg, i)}
              className="rounded px-1.5 py-0.5 text-[0.85em] font-mono whitespace-pre-wrap break-words"
              style={{ backgroundColor: `color-mix(in oklch, ${accent ?? "var(--sc, var(--primary))"} 14%, transparent)`, color: accent ?? "var(--sc, var(--primary))" }}
            >
              {seg.slice(1, -1)}
            </code>
          );
        }
        const linkMatch = seg.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          return (
            <a
              key={escapeForKey(seg, i)}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 decoration-dotted hover:decoration-solid"
              style={{ color: accent ?? "var(--sc, var(--primary))" }}
            >
              {linkMatch[1]}
            </a>
          );
        }
        return <InlineEmphasis key={escapeForKey(seg, i)} text={seg} accent={accent} />;
      })}
    </>
  );
}

// Inline pass 1 (outermost): **bold** / __bold__
function InlineEmphasis({ text, accent }: { text: string; accent?: string }) {
  const segments = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
  return (
    <>
      {segments.map((seg, i) => {
        if (/^(\*\*[^*]+\*\*|__[^_]+__)$/.test(seg)) {
          return (
            <strong key={escapeForKey(seg, i)} className="font-semibold text-foreground">
              <InlineItalic text={seg.slice(2, -2)} accent={accent} />
            </strong>
          );
        }
        return <InlineItalic key={escapeForKey(seg, i)} text={seg} accent={accent} />;
      })}
    </>
  );
}

// Inline pass 1b: *italic* / _italic_ — deliberately requires a non-space
// character immediately inside the asterisks so a lone "3 * 4 = 12" or a
// stray trailing "*" (both of which show up in maths/AI output) is left as
// plain text instead of being swallowed as broken italics.
function InlineItalic({ text, accent }: { text: string; accent?: string }) {
  const segments = text.split(/(\*[^\s*][^*]*\*|_[^\s_][^_]*_)/g);
  return (
    <>
      {segments.map((seg, i) => {
        if (/^(\*[^\s*][^*]*\*|_[^\s_][^_]*_)$/.test(seg)) {
          return (
            <em key={escapeForKey(seg, i)} className="italic text-foreground/90">
              {seg.slice(1, -1)}
            </em>
          );
        }
        return <InlineCodeLeaf key={escapeForKey(seg, i)} text={seg} accent={accent} />;
      })}
    </>
  );
}

// Leaf: only `code` left to find once bold/italic are resolved.
function InlineCodeLeaf({ text, accent }: { text: string; accent?: string }) {
  const segments = text.split(/(`[^`]+`)/g);
  return (
    <>
      {segments.map((seg, i) =>
        /^`[^`]+`$/.test(seg) ? (
          <code
            key={escapeForKey(seg, i)}
            className="rounded px-1.5 py-0.5 text-[0.85em] font-mono whitespace-pre-wrap break-words"
            style={{ backgroundColor: `color-mix(in oklch, ${accent ?? "var(--sc, var(--primary))"} 14%, transparent)`, color: accent ?? "var(--sc, var(--primary))" }}
          >
            {seg.slice(1, -1)}
          </code>
        ) : (
          <React.Fragment key={escapeForKey(seg, i)}>{seg}</React.Fragment>
        )
      )}
    </>
  );
}

interface MarkdownProps {
  text: string | undefined | null;
  /** Force a specific accent instead of the ambient subject/user colour. */
  accent?: string;
  className?: string;
  /** Compact = tighter spacing, for short-answer cards / flashcard backs. */
  compact?: boolean;
}

export function Markdown({ text, accent, className, compact }: MarkdownProps) {
  if (!text) return null;

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let listItems: { text: string; ordered: boolean; n?: string }[] = [];
  let codeBuf: string[] | null = null;

  const pGap = compact ? "my-1" : "my-1.5";
  const listGap = compact ? "my-1 space-y-1" : "my-2 space-y-1.5";

  const flushList = (key: string) => {
    if (listItems.length === 0) return;
    const ordered = listItems[0].ordered;
    blocks.push(
      <ul key={`l-${key}`} className={`${listGap} pl-1 list-none`}>
        {listItems.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed flex items-start gap-2">
            {ordered ? (
              <span className="font-semibold shrink-0 tabular-nums" style={{ color: accent ?? "var(--sc, var(--primary))" }}>
                {item.n}.
              </span>
            ) : (
              <span className="mt-[0.5em] size-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent ?? "var(--sc, var(--primary))" }} />
            )}
            <span>
              <InlineCodeAndLinks text={item.text} accent={accent} />
            </span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  const flushCode = (key: string) => {
    if (codeBuf === null) return;
    blocks.push(
      <pre
        key={`c-${key}`}
        className="my-2 overflow-x-auto rounded-lg border p-3 text-xs font-mono leading-relaxed"
        style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in oklch, var(--muted) 70%, transparent)" }}
      >
        <code>{codeBuf.join("\n")}</code>
      </pre>
    );
    codeBuf = null;
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();

    // Fenced code blocks — ``` toggles capture mode.
    if (/^```/.test(line.trim())) {
      if (codeBuf === null) {
        flushList(`pre-${i}`);
        codeBuf = [];
      } else {
        flushCode(String(i));
      }
      return;
    }
    if (codeBuf !== null) {
      codeBuf.push(raw);
      return;
    }

    if (!line.trim()) {
      flushList(`blank-${i}`);
      return;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      flushList(`hr-${i}`);
      blocks.push(<hr key={`hr-${i}`} className="my-3 border-border/60" />);
      return;
    }

    // Headings
    const hMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (hMatch) {
      flushList(`h-${i}`);
      const level = hMatch[1].length;
      const cls =
        level === 1 ? "text-base font-bold mt-2.5 mb-1" : level === 2 ? "text-sm font-bold mt-2 mb-1" : "text-sm font-semibold mt-1.5 mb-0.5";
      blocks.push(
        <div key={`h-${i}`} className={cls}>
          <InlineCodeAndLinks text={hMatch[2]} accent={accent} />
        </div>
      );
      return;
    }

    // Blockquote
    const qMatch = line.match(/^>\s?(.*)$/);
    if (qMatch) {
      flushList(`q-${i}`);
      blocks.push(
        <div
          key={`q-${i}`}
          className={`${pGap} pl-3 border-l-2 text-sm text-muted-foreground italic`}
          style={{ borderColor: accent ?? "var(--sc, var(--primary))" }}
        >
          <InlineCodeAndLinks text={qMatch[1]} accent={accent} />
        </div>
      );
      return;
    }

    // Bullet list items
    const bMatch = line.match(/^\s*[-*•]\s+(.*)$/);
    if (bMatch) {
      listItems.push({ text: bMatch[1], ordered: false });
      return;
    }

    // Numbered list items
    const nMatch = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
    if (nMatch) {
      listItems.push({ text: nMatch[2], ordered: true, n: nMatch[1] });
      return;
    }

    // Regular paragraph
    flushList(`p-${i}`);
    blocks.push(
      <p key={`p-${i}`} className={`text-sm leading-relaxed ${pGap}`} style={{ lineHeight: 1.7 }}>
        <InlineCodeAndLinks text={line} accent={accent} />
      </p>
    );
  });
  flushList("end");
  flushCode("end");

  return <div className={`space-y-0.5 ${className ?? ""}`}>{blocks}</div>;
}
