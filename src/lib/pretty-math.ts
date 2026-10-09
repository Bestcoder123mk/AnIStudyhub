/**
 * prettifyMath — turns the LaTeX-ish snippets an LLM tends to emit
 * (`\frac{a}{b}`, `\sqrt{2}`, `\pi r^2`, `\sin\theta`, `x^{2}`, `H_2O`)
 * into plain Unicode a Class 10 student can actually read: a/b, √2, πr²,
 * sinθ, x², H₂O.
 *
 * Why not KaTeX? Every maths answer in this app is short, inline school
 * maths — fractions, roots, powers, trig, Greek letters. A 200-line
 * converter covers that with zero bundle weight, zero layout shift and no
 * stylesheet/font fetch, and it degrades gracefully: anything it doesn't
 * recognise is shown as its bare name, never as a raw `\command`.
 *
 * Pure and dependency-free (safe on server and client).
 */

const GREEK: Record<string, string> = {
  alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", varepsilon: "ε", zeta: "ζ", eta: "η",
  theta: "θ", vartheta: "ϑ", iota: "ι", kappa: "κ", lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", pi: "π",
  rho: "ρ", sigma: "σ", tau: "τ", upsilon: "υ", phi: "φ", varphi: "φ", chi: "χ", psi: "ψ", omega: "ω",
  Gamma: "Γ", Delta: "Δ", Theta: "Θ", Lambda: "Λ", Xi: "Ξ", Pi: "Π", Sigma: "Σ", Phi: "Φ", Psi: "Ψ", Omega: "Ω",
};

const SYMBOLS: Record<string, string> = {
  times: "×", div: "÷", cdot: "·", pm: "±", mp: "∓", leq: "≤", le: "≤", geq: "≥", ge: "≥", neq: "≠", ne: "≠",
  approx: "≈", equiv: "≡", propto: "∝", infty: "∞", therefore: "∴", because: "∵", rightarrow: "→", to: "→",
  Rightarrow: "⇒", implies: "⇒", leftarrow: "←", leftrightarrow: "↔", Leftrightarrow: "⇔", iff: "⇔",
  angle: "∠", triangle: "△", perp: "⊥", parallel: "∥", sim: "∼", cong: "≅", in: "∈", notin: "∉",
  subset: "⊂", subseteq: "⊆", cup: "∪", cap: "∩", emptyset: "∅", varnothing: "∅", sum: "Σ", prod: "∏",
  int: "∫", partial: "∂", nabla: "∇", ldots: "…", dots: "…", cdots: "⋯", degree: "°", circ: "°", prime: "′",
  forall: "∀", exists: "∃", neg: "¬", lt: "<", gt: ">", langle: "⟨", rangle: "⟩", ll: "≪", gg: "≫",
  oplus: "⊕", otimes: "⊗", mid: "|", vert: "|", Vert: "‖", lfloor: "⌊", rfloor: "⌋", lceil: "⌈", rceil: "⌉",
  uparrow: "↑", downarrow: "↓", checkmark: "✓", quad: " ", qquad: "  ", enspace: " ",
};

const BLACKBOARD: Record<string, string> = { R: "ℝ", N: "ℕ", Z: "ℤ", Q: "ℚ", C: "ℂ" };

/** Commands that only affect typesetting — drop them, keep their argument. */
const PASSTHROUGH = new Set([
  "text", "mathrm", "mathbf", "textbf", "mathit", "textit", "mathsf", "mathtt", "mathcal", "operatorname",
  "mbox", "boldsymbol", "bm", "boxed", "displaystyle", "textstyle", "limits", "nolimits", "mathstrut",
  "left", "right", "big", "Big", "bigg", "Bigg", "bigl", "bigr", "hfill", "phantom", "strut",
]);

const FUNCS = new Set([
  "sin", "cos", "tan", "cot", "sec", "csc", "log", "ln", "lim", "max", "min", "exp", "sinh", "cosh", "tanh",
  "arcsin", "arccos", "arctan", "det", "gcd", "lcm", "mod", "arg", "sup", "inf",
]);

const SUP: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "+": "⁺", "-": "⁻", "−": "⁻", "=": "⁼", "(": "⁽", ")": "⁾", n: "ⁿ", i: "ⁱ",
};
const SUB: Record<string, string> = {
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
  "+": "₊", "-": "₋", "−": "₋", "=": "₌", "(": "₍", ")": "₎",
  a: "ₐ", e: "ₑ", o: "ₒ", x: "ₓ", h: "ₕ", k: "ₖ", l: "ₗ", m: "ₘ", n: "ₙ", p: "ₚ", s: "ₛ", t: "ₜ",
};

const COMBINING: Record<string, string> = {
  overline: "\u0305", bar: "\u0305", underline: "\u0332", vec: "\u20D7", hat: "\u0302", widehat: "\u0302",
  tilde: "\u0303", widetilde: "\u0303", dot: "\u0307", ddot: "\u0308",
};

// Built from strings so the `u` flag + property escapes don't trip the
// project's ES2017 compile target.
const SIMPLE = new RegExp("^[\\p{L}\\p{N}.°′²³√π]+$", "u");
// A single number, or a single letter with optional scripts — the only things
// that read unambiguously as a denominator / radicand without brackets
// ("(2a)", "√(ab)", but "1/2", "x/y", "√25").
const ATOM = new RegExp("^-?(\\d+(\\.\\d+)?|[\\p{L}π][⁰¹²³⁴⁵⁶⁷⁸⁹ⁿⁱ₀-₉]*)$", "u");
const PREFIX_SYMBOLS = new Set(["angle", "triangle", "nabla", "partial", "neg"]);
const JOINS_NEXT = new RegExp("[\\p{L}\\p{N}\\\\]", "u");

/** True if the text contains something that looks like a LaTeX command. */
export function hasLatex(s: string): boolean {
  return /\\[A-Za-z]{2,}|\\[{}%$_&#]/.test(s);
}

function readGroup(s: string, i: number): [string, number] {
  // s[i] === "{"
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    const c = s[j];
    if (c === "\\") { j++; continue; }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return [s.slice(i + 1, j), j + 1];
    }
  }
  return [s.slice(i + 1), s.length]; // unclosed (e.g. a truncated stream) — take the rest
}

function readArg(s: string, from: number): [string, number] {
  let i = from;
  while (s[i] === " ") i++;
  if (s[i] === "{") return readGroup(s, i);
  if (s[i] === "\\") {
    const m = /^\\([A-Za-z]+|[\s\S])/.exec(s.slice(i, i + 24));
    const tok = m ? m[0] : "\\";
    return [tok, i + tok.length];
  }
  return [s[i] ?? "", Math.min(i + 1, s.length)];
}

function toScript(t: string, map: Record<string, string>, caret: string): string {
  const chars = Array.from(t);
  if (chars.length > 0 && chars.every((ch) => ch in map)) return chars.map((ch) => map[ch]).join("");
  if (chars.length === 0) return "";
  return chars.length === 1 ? caret + t : `${caret}(${t})`;
}

function frac(a: string, b: string): string {
  const A = SIMPLE.test(a.replace(/^-/, "")) ? a : `(${a})`;
  const B = ATOM.test(b) ? b : `(${b})`;
  return `${A}/${B}`;
}

function conv(s: string, depth: number): string {
  if (depth > 10) return s;
  let out = "";
  let i = 0;
  while (i < s.length) {
    const c = s[i];

    if (c === "\\") {
      const m = /^\\([A-Za-z]+)/.exec(s.slice(i, i + 24));
      if (!m) {
        // \\  \,  \;  \%  \$  \_  \{  \}  \&  \#  \<space>
        const nx = s[i + 1] ?? "";
        i += 2;
        if (nx === "\\" || nx === "," || nx === ";" || nx === ":" || nx === " ") out += " ";
        else if (nx !== "!") out += nx;
        continue;
      }
      const name = m[1];
      i += m[0].length;

      if (name === "frac" || name === "dfrac" || name === "tfrac") {
        const [a, i1] = readArg(s, i);
        const [b, i2] = readArg(s, i1);
        i = i2;
        out += frac(conv(a, depth + 1), conv(b, depth + 1));
        if (JOINS_NEXT.test(s[i] ?? "")) out += "\u2009";
      } else if (name === "sqrt") {
        let idx = "";
        if (s[i] === "[") {
          const end = s.indexOf("]", i);
          if (end !== -1) { idx = s.slice(i + 1, end); i = end + 1; }
        }
        const [a, ni] = readArg(s, i);
        i = ni;
        const body = conv(a, depth + 1);
        const rad = idx === "" || idx === "2" ? "√" : idx === "3" ? "∛" : idx === "4" ? "∜" : toScript(idx, SUP, "") + "√";
        out += rad + (ATOM.test(body) ? body : `(${body})`);
        if (JOINS_NEXT.test(s[i] ?? "")) out += "\u2009";
      } else if (name in COMBINING) {
        const [a, ni] = readArg(s, i);
        i = ni;
        out += Array.from(conv(a, depth + 1)).map((ch) => ch + COMBINING[name]).join("");
      } else if (name === "mathbb") {
        const [a, ni] = readArg(s, i);
        i = ni;
        const body = conv(a, depth + 1);
        out += BLACKBOARD[body] ?? body;
      } else if (name === "begin" || name === "end") {
        const [, ni] = readArg(s, i); // \begin{cases} — drop the environment marker
        i = ni;
      } else if (PASSTHROUGH.has(name)) {
        if ((name === "left" || name === "right") && s[i] === ".") i++; // \left. \right.
        if (name === "text" || name === "mathrm" || name === "mathbf" || name === "textbf" || name === "mathit" ||
            name === "textit" || name === "mathsf" || name === "mathtt" || name === "mathcal" ||
            name === "operatorname" || name === "mbox" || name === "boldsymbol" || name === "bm" || name === "boxed") {
          const [a, ni] = readArg(s, i);
          i = ni;
          out += conv(a, depth + 1);
        }
      } else if (name in GREEK) {
        out += GREEK[name];
        // LaTeX ignores the space after a control word: "\pi r" → "πr" — but keep it before an operator.
        if (s[i] === " " && JOINS_NEXT.test(s[i + 1] ?? "")) i++;
      } else if (name in SYMBOLS) {
        out += SYMBOLS[name];
        if (PREFIX_SYMBOLS.has(name) && s[i] === " ") i++;
      } else if (FUNCS.has(name)) {
        out += name;
        if (/[\p{L}\p{N}\\]/u.test(s[i] === " " ? (s[i + 1] ?? "") : (s[i] ?? ""))) {
          out += "\u2009"; // thin space: "sin θ"
          if (s[i] === " ") i++;
        }
      } else {
        out += name; // unknown command — show its bare name, never a backslash
        if (s[i] === " ") i++;
      }
      continue;
    }

    if (c === "^" || c === "_") {
      const [arg, ni] = readArg(s, i + 1);
      i = ni;
      const inner = conv(arg, depth + 1);
      if (c === "^" && inner === "°") out += "°";
      else out += toScript(inner, c === "^" ? SUP : SUB, c);
      continue;
    }

    if (c === "{" || c === "}") { i++; continue; }
    if (c === "~") { out += " "; i++; continue; }
    out += c;
    i++;
  }
  return out;
}

export function prettifyMath(src: string): string {
  if (!src) return "";
  const body = src.length > 3000 ? src.slice(0, 3000) : src;
  return conv(body, 0).replace(/[ \t]{2,}/g, " ").trim();
}
