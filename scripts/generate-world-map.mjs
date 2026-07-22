/**
 * Pre-generates the dotted world map as a STATIC SVG (public/world-dots.svg).
 *
 * Why: `dotted-map` was previously instantiated in the browser by both
 * GlobalPresence and Contact. That shipped ~407 KB of JS (map data + proj4) to
 * every route, cost ~635 ms of blocked main thread per `new DottedMap()`, and
 * inlined the resulting 964 KB SVG into the HTML twice — making the home page
 * document 2.07 MB (vs ~60 KB for every other page).
 *
 * Generating it once at build time turns that into a single cacheable file.
 *
 * Usage:  node scripts/generate-world-map.mjs [outFile] [color] [radius]
 */
import DottedMap from "dotted-map";
import { writeFileSync } from "node:fs";

const [, , out = "public/world-dots.svg", color = "#FFFFFF26", radius = "0.22"] =
  process.argv;

const svg = new DottedMap({ height: 100, grid: "diagonal" }).getSVG({
  radius: Number.parseFloat(radius),
  color,
  shape: "circle",
  backgroundColor: "transparent",
});

writeFileSync(out, svg);
console.log(`${out} — ${svg.length} chars, color ${color}, radius ${radius}`);
