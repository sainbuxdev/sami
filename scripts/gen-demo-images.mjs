// Generates premium iPhone-mockup SVG placeholders for demo/seed data.
// Run once: `node scripts/gen-demo-images.mjs`
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "demo");
mkdirSync(outDir, { recursive: true });

const models = [
  { slug: "iphone-11", name: "iPhone 11", c1: "#c4b5fd", c2: "#6d28d9" },
  { slug: "iphone-12", name: "iPhone 12", c1: "#93c5fd", c2: "#1e40af" },
  { slug: "iphone-13", name: "iPhone 13", c1: "#f9a8d4", c2: "#be185d" },
  { slug: "iphone-13-pro", name: "iPhone 13 Pro", c1: "#a5c8e4", c2: "#2b4a6b" },
  { slug: "iphone-14", name: "iPhone 14", c1: "#a7f3d0", c2: "#0f766e" },
  { slug: "iphone-15", name: "iPhone 15", c1: "#fca5a5", c2: "#b91c1c" },
];

const svg = ({ name, c1, c2 }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f7f7fa"/>
      <stop offset="1" stop-color="#e6e6ec"/>
    </linearGradient>
    <linearGradient id="wall" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="frame" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#48484a"/>
      <stop offset="0.5" stop-color="#1c1c1e"/>
      <stop offset="1" stop-color="#3a3a3c"/>
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="34" stdDeviation="38" flood-color="#0b0b0f" flood-opacity="0.24"/>
    </filter>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <ellipse cx="400" cy="500" rx="230" ry="360" fill="${c1}" opacity="0.18"/>
  <g filter="url(#shadow)">
    <rect x="252" y="150" width="296" height="700" rx="56" fill="url(#frame)"/>
    <rect x="266" y="164" width="268" height="672" rx="46" fill="url(#wall)"/>
    <rect x="356" y="188" width="88" height="26" rx="13" fill="#0b0b0f" opacity="0.9"/>
    <path d="M266 210 Q400 300 534 210 L534 164 L266 164 Z" fill="#ffffff" opacity="0.12"/>
  </g>
  <text x="400" y="920" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="42" font-weight="600" fill="#1c1c1e">${name}</text>
</svg>
`;

for (const m of models) {
  writeFileSync(join(outDir, `${m.slug}.svg`), svg(m), "utf8");
  console.log("wrote", `public/demo/${m.slug}.svg`);
}
