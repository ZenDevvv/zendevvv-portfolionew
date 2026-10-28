// Renders a project's designed cover: `node scripts/render-cover.mjs <slug>`.
//
// The cover is a page in scripts/covers/<slug>.html, 1440×900 like the gallery shots, with
// the mascot, name and one line in the middle 720px (what the 4:5 crop keeps at focus 0.5)
// and phone screens from the project's repo on either side. The page loads those screens
// from the sibling repos (../Peck, ../odoko) and its fonts from Google Fonts. It's rendered
// at 2× in the cached Chromium, scaled down and saved as
// src/assets/projects/<slug>/cover.webp; the gallery entry in projects.js is written by hand.
import { execFileSync } from "node:child_process";
import { globSync, mkdtempSync, rmSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const QUALITY = 82;
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2];
if (!slug) throw new Error("Usage: node scripts/render-cover.mjs <slug>");

const chrome = globSync(join(homedir(), ".cache/ms-playwright/chromium-*/chrome-linux64/chrome"))[0];
const scratch = mkdtempSync(join(tmpdir(), "cover-"));
const browser = await chromium.launch({ executablePath: chrome });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await page.goto(`file://${join(root, "scripts/covers", `${slug}.html`)}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const png = join(scratch, "cover.png");
  await page.screenshot({ path: png });
  const out = join(root, "src/assets/projects", slug, "cover.webp");
  execFileSync("magick", [png, "-resize", "1440x900", "-strip", "-quality", String(QUALITY), "-define", "webp:method=6", out]);
  console.log(`saved ${slug}/cover.webp`);
} finally {
  await browser.close();
  rmSync(scratch, { recursive: true, force: true });
}
