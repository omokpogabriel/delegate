import katex from "katex";
import "katex/dist/katex.min.css";

const cache = new Map<string, string>();
const DISPLAY = /\\\[([\s\S]+?)\\\]/g;
const INLINE = /\\\(([\s\S]+?)\\\)/g;

/** Render \( inline \) and \[ display \] maths in trusted author HTML with KaTeX. */
export function withMath(html: string): string {
  if (!html.includes("\\(") && !html.includes("\\[")) return html;
  const hit = cache.get(html);
  if (hit) return hit;
  const out = html
    .replace(DISPLAY, (_, tex: string) => katex.renderToString(tex, { displayMode: true, throwOnError: false }))
    .replace(INLINE, (_, tex: string) => katex.renderToString(tex, { throwOnError: false }));
  cache.set(html, out);
  return out;
}
