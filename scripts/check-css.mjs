#!/usr/bin/env node
/**
 * Build guard: fail the build if the COMPILED css has lost a standard
 * `backdrop-filter`.
 *
 * Why this exists. Next's CSS pipeline (lightningcss) collapses a hand-written
 * pair like
 *     backdrop-filter: blur(20px);
 *     -webkit-backdrop-filter: blur(20px);
 * into ONLY the -webkit- line. Chrome, Edge and Firefox ignore that prefix, so
 * every glass panel silently lost all of its blur and refraction — in dev and in
 * production — and nothing complained. (Write the standard property on its own
 * and the compiler adds the Safari prefix itself.) This check reads what was
 * actually emitted, so it catches that whole class of bug, whatever caused it.
 *
 * Runs automatically after `npm run build` (the "postbuild" hook), which is also
 * what Vercel runs — so a regression fails the deploy instead of shipping.
 *
 *   node scripts/check-css.mjs [dir]     dir defaults to .next/static
 *   SKIP_CSS_GUARD=1 npm run build       bypass in an emergency
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

if (process.env.SKIP_CSS_GUARD === "1") {
  console.log("check-css: skipped (SKIP_CSS_GUARD=1)");
  process.exit(0);
}

const root = process.argv[2] || ".next/static";

function* cssFiles(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* cssFiles(p);
    else if (name.endsWith(".css")) yield p;
  }
}

const files = [...cssFiles(root)];
if (files.length === 0) {
  // A guard that can't find its input shouldn't take a deploy down — but it must not pass silently either.
  console.warn(`check-css: no compiled CSS found under ${root} — guard NOT run. (If Next's output layout changed, update scripts/check-css.mjs.)`);
  process.exit(0);
}

// The tiers every glass surface is built from. Each must keep a standard backdrop-filter.
const REQUIRED = [".glass", ".glass-strong", ".card-premium"];

const STANDARD = /(?:^|[;{\s])backdrop-filter\s*:/; // the leading class excludes "-webkit-backdrop-filter"
const PREFIXED = /-webkit-backdrop-filter\s*:/;

const problems = [];
const seen = new Set();
let blocks = 0;

for (const file of files) {
  const css = readFileSync(file, "utf8");
  // every innermost rule: `selector{declarations}` (nested @media/@supports contents included)
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].trim();
    const body = m[2];
    const std = STANDARD.test(body);
    if (PREFIXED.test(body) && !std) {
      problems.push(`${selector.slice(0, 90)}  — has -webkit-backdrop-filter but no standard backdrop-filter  (${file})`);
    }
    if (std) {
      blocks++;
      for (const sel of selector.split(",").map((x) => x.trim())) if (REQUIRED.includes(sel)) seen.add(sel);
    }
  }
}

for (const sel of REQUIRED) {
  if (!seen.has(sel)) problems.push(`${sel}  — no rule with a standard backdrop-filter was emitted for this glass tier`);
}

if (problems.length) {
  console.error("\ncheck-css: FAILED — the compiled CSS would ship glass without its blur on Chrome/Edge/Firefox:\n");
  for (const p of problems) console.error("  ✗ " + p);
  console.error(
    "\nThe usual cause is a hand-written `-webkit-backdrop-filter` next to `backdrop-filter` in globals.css." +
      "\nWrite ONLY the standard property; the compiler adds the Safari prefix. (SKIP_CSS_GUARD=1 bypasses this check.)\n"
  );
  process.exit(1);
}
console.log(`check-css: OK — ${blocks} compiled rules use backdrop-filter, all with the standard property; ${REQUIRED.join(", ")} present (${files.length} CSS files scanned).`);
