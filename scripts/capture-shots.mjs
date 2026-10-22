// Captures a project's gallery screenshots: `npm run shots -- <slug>`.
//
// Reads the shot list in scripts/shots/<slug>.mjs and takes each shot at 1440×900 in the
// cached Chromium, in one of two ways:
// - from a site: opens each page on `base` and gets it into the shot's state (asb.mjs);
// - from the project's own mocked end-to-end tests, when the list exports `e2e`: runs the
//   tests the shots name and keeps each one's final screen (capture-e2e.mjs, ospar.mjs).
// Saves every shot as a WebP (quality 82) in src/assets/projects/<slug>/, then prints the
// `gallery` entries to paste into src/assets/json/projects.js. See "Project media" in
// DESIGN.md for the whole routine.
//
// Needs the Chromium that Playwright caches (~/.cache/ms-playwright/chromium-*), ImageMagick
// (`magick`), and for the e2e way rsync and npm.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { captureFromE2e } from "./capture-e2e.mjs";

const WIDTH = 1440;
const HEIGHT = 900;
const QUALITY = 82;

const root = fileURLToPath(new URL("..", import.meta.url));
const slug = process.argv[2];
if (!slug) {
  console.error("Usage: npm run shots -- <slug>   (with a shot list in scripts/shots/<slug>.mjs)");
  process.exit(1);
}
const { base, shots, e2e } = await import(join(root, "scripts/shots", `${slug}.mjs`));

const cache = join(homedir(), ".cache/ms-playwright");
const chromiumDir = readdirSync(cache).find((dir) => /^chromium-\d+$/.test(dir));
if (!chromiumDir) throw new Error(`No cached Chromium in ${cache}`);
const chromePath = join(cache, chromiumDir, "chrome-linux64/chrome");

const out = join(root, "src/assets/projects", slug);
mkdirSync(out, { recursive: true });
const scratch = mkdtempSync(join(tmpdir(), `shots-${slug}-`));

// Small helpers for the shot lists, so each shot only says what makes it different.
function helpers(page) {
  return {
    page,
    // Scrolls the whole page once, so scroll-triggered entrances have played.
    async playEntrances() {
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += 300) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(120);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(600);
    },
    // Scrolls so the section containing `text` sits `offset` px from the top, or is centred.
    async scrollToSection(text, { offset = 0, center = false } = {}) {
      await page.evaluate(
        ({ text, offset, center }) => {
          const section = [...document.querySelectorAll("section")].find((element) =>
            element.innerText.replace(/\s+/g, " ").includes(text)
          );
          if (!section) throw new Error(`No section containing "${text}"`);
          const box = section.getBoundingClientRect();
          const top = center
            ? box.top + window.scrollY - (window.innerHeight - box.height) / 2
            : box.top + window.scrollY - offset;
          window.scrollTo(0, top);
        },
        { text, offset, center }
      );
      await page.waitForTimeout(900);
    },
    // Clicks the element whose own text is exactly `text`.
    clickText: (text) => page.getByText(text, { exact: true }).first().click({ timeout: 5000 }),
    // Clicks the first button containing `text` (icon fonts add their names to a button's text).
    clickButton: (text) => page.locator("button", { hasText: text }).first().click({ timeout: 5000 }),
  };
}

// Opens each shot's page on `base`, gets it into the shot's state and screenshots it.
async function captureFromSite() {
  const browser = await chromium.launch({ executablePath: chromePath });
  const pngs = {};
  try {
    for (const shot of shots) {
      const context = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT } });
      const page = await context.newPage();
      await page.goto(base + shot.path, { waitUntil: "networkidle" });
      await page.waitForTimeout(1200);
      // A shot can return another page to capture, such as a preview that opens in a new tab.
      const target = (await shot.prepare?.(helpers(page), context)) ?? page;
      await target.waitForTimeout(1000);
      pngs[shot.name] = join(scratch, `${shot.name}.png`);
      await target.screenshot({ path: pngs[shot.name] });
      await context.close();
    }
  } finally {
    await browser.close();
  }
  return pngs;
}

try {
  const pngs = e2e ? captureFromE2e({ e2e, shots, scratch, chromePath }) : await captureFromSite();
  for (const { name } of shots) {
    execFileSync("magick", [pngs[name], "-strip", "-quality", String(QUALITY), "-define", "webp:method=6", join(out, `${name}.webp`)]);
    console.log(`saved ${slug}/${name}.webp`);
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
}

console.log("\nPaste into the project in src/assets/json/projects.js:\n");
console.log("    gallery: [");
for (const { name, caption, focus } of shots) {
  const crop = focus === undefined ? "" : `, focus: ${focus}`;
  console.log(`      { src: "projects/${slug}/${name}.webp", caption: ${JSON.stringify(caption)}${crop} },`);
}
console.log("    ],");
