"use client";

import React from "react";
import { hasLatex, prettifyMath } from "@/lib/pretty-math";

/**
 * Markdown — the one shared renderer for every piece of AI or long-form
 * authored text in the app (AI Tutor, Sanskrit Translator, quiz / flashcard /
 * short-and-long-answer explanations).
 *
 * It is a small, dependency-free parser rather than react-markdown on
 * purpose: the app wants its own visual language, and a fixed, known-small
 * syntax subset doesn't justify an AST pipeline. But "small" must not mean
 * "fragile" — the first version split text with a chain of regexes, which is
 * why `**bold wrapping `code`**`, `**bold with *italic* inside**`, tables and
 * a reply cut off mid-bold all leaked raw asterisks / pipes onto the screen.
 * This version is a real two-level parser:
 *
 *   BLOCKS   fenced code, headings, rules, GFM tables, blockquotes (which
 *            nest), lists (which nest, incl. task lists), paragraphs.
 *   INLINE   one left-to-right scanner. Code spans win first (their contents
 *            are never parsed), then escapes, math, links, and emphasis with
 *            CommonMark-style flanking rules so `3 * 4`, `x**2`, `snake_case`
 *            and `2 * 3 = 6` stay plain text while `**a `b` *c***` nests
 *            properly.
 *
 * Built to survive streaming: an unclosed `**` (a reply still arriving, or
 * one cut off by a token limit) bolds the rest of its block instead of
 * showing literal asterisks, and an unclosed code fence renders as the code
 * block it is about to become.
 *
 * Math: the model is told to write Unicode maths, but LaTeX still slips
 * through (`\frac{a}{b}`, `$x^2$`, backticked `\sqrt{2}`). Those are
 * converted to readable Unicode by prettifyMath() — a student never sees a
 * raw backslash command.
 *
 * Colour: structural accents (bullets, list numbers, quote bars) are quiet
 * by default — they read the subject colour (`--sc`, set by .subj-* wrappers)
 * where there is one and a neutral grey otherwise. Pass `accent="#hex"` to
 * force a specific colour (the Sanskrit Translator's gold).
 */

interface Opts {
  accent?: string;
  compact: boolean;
}

// Built from strings so the `u` flag + property escapes compile under the
// project's ES2017 target.
const WORD_RE = new RegExp("[\\p{L}\\p{N}]", "u");
const MATHY_RE = new RegExp("[\\\\^_=+\\-*/<>()]|^[\\p{L}\\p{N}]{1,3}$", "u");
const isWord = (ch: string | undefined) => !!ch && WORD_RE.test(ch);
const isSpace = (ch: string | undefined) => ch === undefined || /\s/.test(ch);

const MATH_FONT = '"Cambria Math","STIX Two Math","Latin Modern Math","Noto Serif",Georgia,serif';

const ENTITIES: Record<string, string> = {
  nbsp: "\u00a0", amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", deg: "°", times: "×", divide: "÷",
  plusmn: "±", rarr: "→", larr: "←", le: "≤", ge: "≥", ne: "≠", hellip: "…", mdash: "—", ndash: "–",
};

// ---------------------------------------------------------------- inline ----

function softAccent(o: Opts) {
  return `color-mix(in oklch, ${o.accent ?? "var(--sc, var(--muted-foreground))"} 85%, transparent)`;
}

function MathChip({ src }: { src: string }) {
  return (
    <span className="whitespace-nowrap" style={{ fontFamily: MATH_FONT, fontSize: "1.04em" }}>
      {prettifyMath(src)}
    </span>
  );
}

function CodeChip({ code, o }: { code: string; o: Opts }) {
  const tint = o.accent;
  return (
    <code
      className="rounded-md border px-1.5 py-[0.1em] font-mono text-[0.86em] break-words"
      style={{
        backgroundColor: `color-mix(in oklch, ${tint ?? "var(--foreground)"} ${tint ? 14 : 8}%, transparent)`,
        borderColor: `color-mix(in oklch, ${tint ?? "var(--foreground)"} ${tint ? 24 : 10}%, transparent)`,
        color: tint ?? "var(--sc, var(--foreground))",
      }}
    >
      {code}
    </code>
  );
}

/** Index of the closer for an emphasis opener, or -1. Skips code spans and escapes. */
function findCloser(s: string, from: number, c: string, run: number): number {
  const limit = Math.min(s.length, from + 6000);
  const strictNext = c === "_" || run === 1; // `_x_` and `*x*` may not close mid-word
  for (let t = from; t < limit; t++) {
    const ch = s[t];
    if (ch === "\\") { t++; continue; }
    if (ch === "`") {
      let e = t;
      while (s[e] === "`") e++;
      const close = s.indexOf(s.slice(t, e), e);
      t = close !== -1 ? close + (e - t) - 1 : e - 1;
      continue;
    }
    if (ch !== c) continue;
    let e = t;
    while (s[e] === c) e++;
    const rl = e - t;
    if (!isSpace(s[t - 1]) && (!strictNext || !isWord(s[e]))) {
      if (rl === run) return t;
      if (run === 2 && rl === 3) return t + 1; // **bold *italic***
    }
    t = e - 1;
  }
  return -1;
}

function matchBracket(s: string, i: number, open: string, close: string): number {
  let depth = 0;
  for (let j = i; j < Math.min(s.length, i + 800); j++) {
    if (s[j] === "\\") { j++; continue; }
    if (s[j] === open) depth++;
    else if (s[j] === close) { depth--; if (depth === 0) return j; }
  }
  return -1;
}

function parseInline(s: string, o: Opts, kp: string, depth = 0): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  if (depth > 6) return [s];
  let buf = "";
  let i = 0;
  let n = 0;
  const key = () => `${kp}.${n++}`;
  const flush = () => { if (buf) { out.push(buf); buf = ""; } };

  while (i < s.length) {
    const c = s[i];

    // --- escapes + \( \) \[ \] math -------------------------------------
    if (c === "\\" && i + 1 < s.length) {
      const nx = s[i + 1];
      if (nx === "(" || nx === "[") {
        const end = s.indexOf(nx === "(" ? "\\)" : "\\]", i + 2);
        if (end !== -1) {
          flush();
          out.push(<MathChip key={key()} src={s.slice(i + 2, end)} />);
          i = end + 2;
          continue;
        }
      }
      if ("\\`*_{}[]()#+-.!|~$<>".includes(nx)) { buf += nx; i += 2; continue; }
      buf += c; i++;
      continue;
    }

    // --- line break -------------------------------------------------------
    if (c === "\n") { flush(); out.push(<br key={key()} />); i++; continue; }

    // --- `code` (contents never parsed further) -------------------------
    if (c === "`") {
      let j = i;
      while (s[j] === "`") j++;
      const run = s.slice(i, j);
      const end = s.indexOf(run, j);
      if (end !== -1) {
        flush();
        const raw = s.slice(j, end);
        const code = /^ [\s\S]* $/.test(raw) && raw.trim() ? raw.slice(1, -1) : raw;
        out.push(hasLatex(code) ? <MathChip key={key()} src={code} /> : <CodeChip key={key()} code={code} o={o} />);
        i = end + run.length;
        continue;
      }
      buf += run; i = j;
      continue;
    }

    // --- $math$ / $$math$$ ----------------------------------------------
    if (c === "$") {
      const dbl = s[i + 1] === "$";
      const open = i + (dbl ? 2 : 1);
      const tok = dbl ? "$$" : "$";
      let end = open;
      for (; end < s.length; end++) {
        if (s[end] === "\\") { end++; continue; }
        if (s.startsWith(tok, end)) break;
      }
      if (end < s.length) {
        const body = s.slice(open, end);
        const ok = dbl
          ? body.trim().length > 0
          : body.length > 0 && !/^\s|\s$/.test(body) && !body.includes("\n") && !/\d/.test(s[end + 1] ?? "") && MATHY_RE.test(body);
        if (ok) {
          flush();
          out.push(<MathChip key={key()} src={body} />);
          i = end + tok.length;
          continue;
        }
      }
    }

    // --- [text](url) --------------------------------------------------------
    if (c === "[") {
      const close = matchBracket(s, i, "[", "]");
      if (close !== -1 && s[close + 1] === "(") {
        const pEnd = matchBracket(s, close + 1, "(", ")");
        if (pEnd !== -1) {
          const url = s.slice(close + 2, pEnd).trim().split(/\s+/)[0].replace(/^<|>$/g, "");
          if (/^(https?:|mailto:|\/|#)/i.test(url)) {
            flush();
            out.push(
              <a
                key={key()}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 decoration-foreground/30 hover:decoration-current"
                style={{ color: o.accent ?? "var(--primary)" }}
              >
                {parseInline(s.slice(i + 1, close), o, `${kp}.a${n}`, depth + 1)}
              </a>
            );
            i = pEnd + 1;
            continue;
          }
        }
      }
    }

    // --- ~~strike~~ -----------------------------------------------------
    if (c === "~" && s[i + 1] === "~" && !isSpace(s[i + 2])) {
      const end = s.indexOf("~~", i + 2);
      if (end !== -1 && !isSpace(s[end - 1])) {
        flush();
        out.push(<del key={key()} className="opacity-70">{parseInline(s.slice(i + 2, end), o, `${kp}.s${n}`, depth + 1)}</del>);
        i = end + 2;
        continue;
      }
    }

    // --- **bold** / *italic* / ***both*** / __bold__ / _italic_ ----------
    if (c === "*" || c === "_") {
      let j = i;
      while (s[j] === c) j++;
      const run = j - i;
      const before = s[i - 1];
      const after = s[j];
      // Openers must hug the text that follows. `_`, `*x*` and `**` also may
      // not start mid-word, which is what keeps snake_case, 2*3*4 and Python's
      // x**2 as the plain text they are.
      const canOpen = run <= 3 && !isSpace(after) && !isWord(before);
      if (canOpen) {
        const k = findCloser(s, j, c, run);
        let inner: string | null = null;
        let next = 0;
        if (k !== -1) {
          inner = s.slice(j, k);
          next = k + run;
        } else if (c === "*" && run >= 2) {
          inner = s.slice(j); // unclosed **: a reply still streaming, or cut off — bold the rest
          next = s.length;
        }
        if (inner !== null && inner.length > 0) {
          flush();
          const kids = parseInline(inner, o, `${kp}.e${n}`, depth + 1);
          if (run === 1) out.push(<em key={key()} className="italic">{kids}</em>);
          else if (run === 2) out.push(<strong key={key()} className="font-semibold text-foreground">{kids}</strong>);
          else out.push(<strong key={key()} className="font-semibold text-foreground"><em className="italic">{kids}</em></strong>);
          i = next;
          continue;
        }
      }
      buf += s.slice(i, j); i = j;
      continue;
    }

    // --- tiny HTML subset: <br>, <sup>, <sub> ------------------------------
    if (c === "<") {
      const rest = s.slice(i, i + 80);
      if (/^<br\s*\/?>/i.test(rest)) {
        flush(); out.push(<br key={key()} />); i += rest.match(/^<br\s*\/?>/i)![0].length;
        continue;
      }
      const m = /^<(sup|sub)>([^<]{1,40})<\/\1>/i.exec(rest);
      if (m) {
        flush();
        const sup = m[1].toLowerCase() === "sup";
        const t = prettifyMath(`${sup ? "^" : "_"}{${m[2]}}`);
        out.push(
          /^[\u2070-\u209f\u00b2\u00b3\u00b9]+$/.test(t)
            ? t
            : sup ? <sup key={key()} className="text-[0.75em] leading-none">{m[2]}</sup> : <sub key={key()} className="text-[0.75em] leading-none">{m[2]}</sub>
        );
        i += m[0].length;
        continue;
      }
    }

    // --- &entities; -----------------------------------------------------
    if (c === "&") {
      const m = /^&(#39|[a-z]{2,8});/.exec(s.slice(i, i + 10));
      if (m && ENTITIES[m[1]]) { buf += ENTITIES[m[1]]; i += m[0].length; continue; }
    }

    buf += c; i++;
  }
  flush();
  return out;
}

// ---------------------------------------------------------------- blocks ----

const LIST_RE = /^(\s*)([-*+•]|\d+[.)])\s+([\s\S]*)$/;
const FENCE_RE = /^(`{3,}|~{3,})\s*([\w+#.-]*)/;
const HR_RE = /^([-*_])(\s*\1){2,}$/;
const HEADING_RE = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const DELIM_ROW_RE = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)*\|?\s*$/;

const isDelimRow = (l: string) => l.includes("|") && l.includes("-") && DELIM_ROW_RE.test(l);
const indentOf = (l: string) => (l.match(/^[ \t]*/)![0].replace(/\t/g, "    ")).length;

function splitRow(line: string): string[] {
  let t = line.trim();
  if (t.startsWith("|")) t = t.slice(1);
  if (t.endsWith("|") && !t.endsWith("\\|")) t = t.slice(0, -1);
  const cells: string[] = [];
  let cur = "";
  let inCode = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (ch === "\\" && t[i + 1] === "|") { cur += "|"; i++; continue; }
    if (ch === "`") inCode = !inCode;
    if (ch === "|" && !inCode) { cells.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  cells.push(cur.trim());
  return cells;
}

function startsBlock(line: string, next: string | undefined): boolean {
  const t = line.trim();
  return (
    FENCE_RE.test(t) || HR_RE.test(t) || HEADING_RE.test(t) || t.startsWith(">") || LIST_RE.test(line) ||
    (t.includes("|") && next !== undefined && isDelimRow(next))
  );
}

interface Item {
  indent: number;
  ordered: boolean;
  num: number;
  text: string;
  kids: Item[];
}

function buildList(items: Item[]): Item[] {
  const root: Item[] = [];
  const stack: { indent: number; list: Item[] }[] = [{ indent: items[0].indent, list: root }];
  for (const it of items) {
    let top = stack[stack.length - 1];
    if (it.indent - top.indent >= 2) {
      const parent = top.list[top.list.length - 1];
      if (parent) {
        const child = { indent: it.indent, list: parent.kids };
        stack.push(child);
        top = child;
      }
    } else {
      while (stack.length > 1 && it.indent < top.indent) {
        stack.pop();
        top = stack[stack.length - 1];
      }
    }
    top.list.push(it);
  }
  return root;
}

function renderList(items: Item[], o: Opts, kp: string, level: number): React.ReactNode {
  const allOrdered = items.every((it) => it.ordered);
  const Tag = allOrdered ? "ol" : "ul";
  let prevNum = -1;
  return (
    <Tag
      key={kp}
      role="list"
      className={`${level === 0 ? (o.compact ? "my-1.5" : "my-2.5") : "mt-1.5"} ${o.compact ? "space-y-1" : "space-y-1.5"} list-none p-0`}
    >
      {items.map((it, i) => {
        let marker: React.ReactNode;
        const task = /^\[( |x|X)\]\s+/.exec(it.text);
        if (task) {
          marker = <span aria-hidden className="shrink-0 leading-[inherit]">{task[1] === " " ? "☐" : "☑"}</span>;
        } else if (it.ordered) {
          const num = it.num === prevNum ? prevNum + 1 : it.num;
          prevNum = num;
          marker = (
            <span className="min-w-[1.35em] shrink-0 text-right font-semibold tabular-nums" style={{ color: softAccent(o) }}>
              {num}.
            </span>
          );
        } else {
          marker = (
            <span
              aria-hidden
              className={`mt-[0.62em] shrink-0 rounded-full ${level === 0 ? "size-[5px]" : "size-[5px] border bg-transparent"}`}
              style={level === 0 ? { backgroundColor: softAccent(o) } : { borderColor: softAccent(o) }}
            />
          );
        }
        return (
          <li key={`${kp}.${i}`} className="flex items-start gap-2.5 leading-[1.7]">
            {marker}
            <div className="min-w-0 flex-1">
              <span>{parseInline(task ? it.text.slice(task[0].length) : it.text, o, `${kp}.${i}`)}</span>
              {it.kids.length > 0 && renderList(it.kids, o, `${kp}.${i}k`, level + 1)}
            </div>
          </li>
        );
      })}
    </Tag>
  );
}

function parseBlocks(src: string, o: Opts, kp: string): React.ReactNode[] {
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;
  let n = 0;
  const key = () => `${kp}${n++}`;

  while (i < lines.length) {
    const line = lines[i].trimEnd();
    const t = line.trim();
    if (!t) { i++; continue; }

    // Fenced code (an unclosed fence — a reply still streaming — renders as code too)
    const f = FENCE_RE.exec(t);
    if (f) {
      const fenceChar = f[1][0];
      const body: string[] = [];
      i++;
      while (i < lines.length) {
        const tt = lines[i].trim();
        if (tt.startsWith(fenceChar.repeat(f[1].length)) && /^[`~]+$/.test(tt)) { i++; break; }
        body.push(lines[i]);
        i++;
      }
      out.push(
        <div key={key()} className="my-3 overflow-hidden rounded-xl border border-border/60 bg-foreground/[0.04]">
          {f[2] && <div className="border-b border-border/50 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{f[2]}</div>}
          <pre className="overflow-x-auto p-3 font-mono text-[0.8rem] leading-relaxed"><code>{body.join("\n")}</code></pre>
        </div>
      );
      continue;
    }

    if (HR_RE.test(t)) { out.push(<hr key={key()} className="my-4 border-border/60" />); i++; continue; }

    const h = HEADING_RE.exec(t);
    if (h) {
      const lvl = h[1].length;
      const cls =
        lvl === 1 ? "text-[1.2em] font-bold mt-5" :
        lvl === 2 ? "text-[1.1em] font-bold mt-4" :
        lvl === 3 ? "text-[1.02em] font-semibold mt-3.5" : "text-[0.95em] font-semibold mt-3 text-foreground/90";
      out.push(
        <div key={key()} role="heading" aria-level={Math.min(lvl + 1, 6)} className={`${cls} mb-1.5 first:mt-0 leading-snug tracking-tight`}>
          {parseInline(h[2], o, `${kp}h${n}`)}
        </div>
      );
      i++;
      continue;
    }

    // Table: header row immediately followed by a |---|---| delimiter row
    if (t.includes("|") && i + 1 < lines.length && isDelimRow(lines[i + 1])) {
      const head = splitRow(t);
      const aligns = splitRow(lines[i + 1]).map((c) => (c.startsWith(":") && c.endsWith(":") ? "center" : c.endsWith(":") ? "right" : "left"));
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].trim() && lines[i].includes("|")) {
        const cells = splitRow(lines[i]);
        while (cells.length < head.length) cells.push("");
        rows.push(cells.slice(0, head.length));
        i++;
      }
      const k0 = key();
      out.push(
        <div key={k0} className="my-3 overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full border-collapse text-[0.92em] leading-snug">
            <thead>
              <tr className="bg-foreground/[0.06]">
                {head.map((cell, ci) => (
                  <th key={ci} className="min-w-[5.5rem] px-3 py-2 text-left align-bottom font-semibold" style={{ textAlign: aligns[ci] as "left" | "center" | "right" }}>
                    {parseInline(cell, o, `${k0}.h${ci}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className="border-t border-border/50">
                  {r.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 align-top" style={{ textAlign: aligns[ci] as "left" | "center" | "right" }}>
                      {parseInline(cell, o, `${k0}.${ri}.${ci}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Blockquote — consecutive `>` lines, parsed recursively so lists/bold nest
    if (t.startsWith(">")) {
      const inner: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        inner.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      const k0 = key();
      out.push(
        <blockquote
          key={k0}
          className={`${o.compact ? "my-1.5" : "my-3"} rounded-r-lg border-l-2 bg-foreground/[0.03] py-1.5 pl-3.5 pr-3 text-foreground/85`}
          style={{ borderColor: softAccent(o) }}
        >
          {parseBlocks(inner.join("\n"), o, `${k0}q`)}
        </blockquote>
      );
      continue;
    }

    // List (with nesting + loose items separated by single blank lines)
    if (LIST_RE.test(line)) {
      const items: Item[] = [];
      while (i < lines.length) {
        const l = lines[i].trimEnd();
        const m = LIST_RE.exec(l);
        if (m) {
          items.push({
            indent: indentOf(l),
            ordered: /\d/.test(m[2]),
            num: /\d/.test(m[2]) ? parseInt(m[2], 10) : 0,
            text: m[3],
            kids: [],
          });
          i++;
          continue;
        }
        if (!l.trim()) {
          // a single blank line inside a list keeps it going if another item follows
          let j = i + 1;
          while (j < lines.length && !lines[j].trim()) j++;
          if (j < lines.length && j - i <= 2 && LIST_RE.test(lines[j])) { i = j; continue; }
          break;
        }
        const last = items[items.length - 1];
        if (last && indentOf(l) > last.indent && !startsBlock(l, lines[i + 1])) {
          last.text += "\n" + l.trim(); // wrapped continuation line of the previous item
          i++;
          continue;
        }
        break;
      }
      out.push(renderList(buildList(items), o, key(), 0));
      continue;
    }

    // Paragraph — runs until a blank line or the next block; single newlines stay line breaks
    const para: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !startsBlock(lines[i], lines[i + 1])) {
      para.push(lines[i].trimEnd());
      i++;
    }
    out.push(
      <p key={key()} className={`${o.compact ? "my-1.5" : "my-2.5"} first:mt-0 last:mb-0 leading-[1.7]`}>
        {parseInline(para.join("\n"), o, `${kp}p${n}`)}
      </p>
    );
  }
  return out;
}

// ------------------------------------------------------------------ view ----

interface MarkdownProps {
  text: string | undefined | null;
  /** Force a specific accent instead of the ambient subject colour. */
  accent?: string;
  className?: string;
  /** Compact = tighter spacing + base size, for short-answer cards / flashcard backs. */
  compact?: boolean;
}

export const Markdown = React.memo(function Markdown({ text, accent, className, compact = false }: MarkdownProps) {
  const blocks = React.useMemo(
    () => (text ? parseBlocks(text, { accent, compact }, "m") : null),
    [text, accent, compact]
  );
  if (!text) return null;
  return (
    <div className={`${compact ? "text-sm" : "text-[0.94rem]"} break-words ${className ?? ""}`}>
      {blocks}
    </div>
  );
});
