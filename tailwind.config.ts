import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

// NOTE: This project is on Tailwind CSS v4, which is configured natively in
// CSS via the `@theme inline` block in `src/app/globals.css` — that's the
// single source of truth for colors, radii, and fonts now (all in `oklch()`
// with no `hsl()` wrapping). This file is NOT loaded by the v4 PostCSS
// plugin unless referenced with an `@config` directive in globals.css
// (it isn't), so it previously carried a dead, mismatched `theme.extend`
// block — real `hsl(var(--background))` color definitions pointed at CSS
// variables that were actually `oklch(...)` values, which would have been
// invalid declarations had this file ever been wired up. Left in place
// only for the one thing v4 still reads a JS config for: plugins.
const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [tailwindcssAnimate],
};
export default config;
