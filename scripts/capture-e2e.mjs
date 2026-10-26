// Screenshots from a project's own mocked end-to-end tests, for apps that only work behind a
// login and a backend: used by capture-shots.mjs when a shot list exports `e2e`.
//
// Copies the app to a scratch folder and installs it there (installCopy), then runs only the
// tests the shots name with
// Playwright, at 1440×900, against the app's dev server with the tests' own mocked API
// responses (fake data, no database), with the browser cut off from every server but this
// machine. The screenshot taken as each test finishes is the shot.
// Scan the repo for security problems before pointing this at it (see "Project media" in
// DESIGN.md).
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright-core";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// The Playwright config written into the copy.
const config = ({ testDir, ignore, devCommand, url, env }) => `import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: ${JSON.stringify(testDir)},
	testIgnore: ${JSON.stringify(ignore)},
	timeout: 60_000,
	expect: { timeout: 10_000 },
	retries: 2,
	workers: 3,
	reporter: [["json", { outputFile: "shots-results/report.json" }], ["dot"]],
	outputDir: "shots-results",
	use: {
		baseURL: ${JSON.stringify(url)},
		viewport: { width: 1440, height: 900 },
		screenshot: "on",
		timezoneId: "Asia/Manila",
		serviceWorkers: "block",
		launchOptions: { executablePath: process.env.CHROME_PATH },
		// A dead proxy for everything but this machine, so no test can reach a real server.
		proxy: { server: "http://127.0.0.1:9", bypass: "127.0.0.1,localhost" },
	},
	webServer: {
		command: ${JSON.stringify(devCommand)},
		url: ${JSON.stringify(url)},
		reuseExistingServer: false,
		timeout: 120_000,
		env: ${JSON.stringify(env)},
	},
	projects: [{ name: "chromium" }],
});
`;

// Every test in Playwright's JSON report, with its title and the final screenshot of its
// last attempt (a failed test is retried, and the attempt that passed is the one kept).
function results(report) {
  const found = [];
  const walk = (suite) => {
    (suite.suites || []).forEach(walk);
    for (const spec of suite.specs || []) {
      for (const test of spec.tests) {
        const result = test.results.at(-1);
        if (!result) continue;
        const shot = (result.attachments || []).find((item) => item.name === "screenshot");
        found.push({ title: spec.title, status: result.status, png: shot?.path });
      }
    }
  };
  walk(report);
  return found;
}

// How an app's dev server starts, unless its shot list says otherwise.
export const DEV_COMMAND = "npm run dev -- --host 127.0.0.1 --port 4173";
export const DEV_URL = "http://127.0.0.1:4173";

// Copies the app (without node_modules or builds) to a scratch folder, so the project's repo is
// never touched, and installs it there with install scripts off. With a git `ref` (a branch or
// commit) it copies the app as committed there instead of the folder as it is. An `install`
// command replaces `npm ci` for an app that isn't a Node one. Returns the copy's path. Also
// used by capture-shots.mjs for a site run locally.
export function installCopy(app, scratch, { ref, install } = {}) {
  const work = join(scratch, "app");
  if (ref) {
    const tar = join(scratch, "app.tar");
    execFileSync("git", ["-C", app, "archive", "-o", tar, ref]);
    mkdirSync(work);
    execFileSync("tar", ["-xf", tar, "-C", work]);
  } else {
    const skip = ["node_modules", "dist", "build", ".react-router", "test-results", "shots-results", ".venv"];
    execFileSync("rsync", ["-a", ...skip.flatMap((dir) => ["--exclude", dir]), `${app}/`, `${work}/`]);
  }
  console.log(`installing ${app} in a scratch copy…`);
  if (install) {
    execFileSync("sh", ["-c", install], { cwd: work, stdio: "inherit" });
    return work;
  }
  if (!existsSync(join(work, "package-lock.json"))) throw new Error(`No package-lock.json in ${app}`);
  execFileSync("npm", ["ci", "--ignore-scripts", "--no-audit", "--no-fund"], { cwd: work, stdio: "inherit" });
  return work;
}

// Returns each shot's PNG path, by shot name.
export function captureFromE2e({ e2e, shots, scratch, chromePath }) {
  const { app, testDir = "./e2e", ignore = [], devCommand = DEV_COMMAND, url = DEV_URL, env = {} } = e2e;
  const work = installCopy(app, scratch);
  writeFileSync(join(work, "portfolio-shots.config.ts"), config({ testDir, ignore, devCommand, url, env }));

  const grep = shots.map(({ test }) => escapeRegex(test)).join("|");
  spawnSync("npx", ["playwright", "test", "-c", "portfolio-shots.config.ts", "--grep", grep], {
    cwd: work,
    stdio: "inherit",
    env: { ...process.env, CHROME_PATH: chromePath },
  });

  const found = results(JSON.parse(readFileSync(join(work, "shots-results/report.json"), "utf8")));
  const pngs = {};
  for (const shot of shots) {
    const result = found.find(({ title }) => title === shot.test);
    if (!result?.png) throw new Error(`No screenshot for "${shot.test}"; check the title`);
    if (result.status !== "passed") console.warn(`warning: "${shot.test}" ${result.status}; check its shot`);
    pngs[shot.name] = result.png;
  }
  return pngs;
}

// For a pnpm monorepo whose web app has its own screenshot spec (Peck): copies the repo
// without node_modules, .git or any .env file, installs it with `pnpm --ignore-scripts`,
// builds the web app with the placeholder addresses the repo's CI uses, and runs only the
// spec's named tests with the spec's own mocked API (fake data), twice: at 1440×900 for the
// desktop screens, and at phone size, sharp at 2×, for the screens a `phones` shot is made of.
// The spec writes each screen as <name>-<size>.png into a folder in the scratch.
// Returns the PNG paths by shot name; a shot with `phones` (three screen names) gets those
// screens side by side on the app's own background, like Scidama's phone shot.
const SIZES = [
  { name: "desktop", width: 1440, height: 900, scale: 1 },
  { name: "phone", width: 400, height: 860, scale: 2 },
];

export async function captureFromPnpmSpec({ pnpmSpec, shots, scratch, chromePath }) {
  const { app, web = "apps/web", spec, tests, buildEnv = {}, serverEnv = {} } = pnpmSpec;
  const work = join(scratch, "app");
  const shotsDir = join(scratch, "pngs");
  mkdirSync(shotsDir);
  const skip = ["node_modules", "dist", ".git", "test-results", ".env", ".env.*", "!.env.example", "supabase/.temp"];
  execFileSync("rsync", ["-a", ...skip.flatMap((item) => ["--exclude", item]), `${app}/`, `${work}/`]);
  console.log(`installing ${app} in a scratch copy…`);
  execFileSync("pnpm", ["install", "--frozen-lockfile", "--ignore-scripts"], { cwd: work, stdio: "inherit" });
  const webDir = join(work, web);
  execFileSync("pnpm", ["build"], { cwd: webDir, stdio: "inherit", env: { ...process.env, ...buildEnv } });

  const specPath = join(webDir, spec);
  const original = readFileSync(specPath, "utf8");
  const wanted = (size) => shots.some((shot) => (shot.phones ? size.name === "phone" : size.name === "desktop"));
  for (const size of SIZES.filter(wanted)) {
    // The spec saves to a fixed folder in the repo, in two sizes: point it at the scratch, one size.
    let source = original;
    const edits = [
      [/const OUT = '[^']*'/, `const OUT = '${shotsDir}'`],
      [/for \(const size of \[.*\]\) \{/, `for (const size of [{ name: '${size.name}', width: ${size.width}, height: ${size.height} }]) {`],
    ];
    for (const [from, to] of edits) {
      if (!from.test(source)) throw new Error(`${spec} no longer matches ${from}; update captureFromPnpmSpec`);
      source = source.replace(from, to);
    }
    writeFileSync(specPath, source);
    writeFileSync(
      join(webDir, "portfolio-shots.config.ts"),
      `import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: 'e2e', testMatch: ${JSON.stringify(spec.split("/").pop())}, timeout: 120000, workers: 1,
  webServer: { command: 'pnpm preview --host 127.0.0.1 --port 4173 --strictPort', url: 'http://127.0.0.1:4173/welcome', reuseExistingServer: false, env: ${JSON.stringify(serverEnv)} },
  use: { baseURL: 'http://127.0.0.1:4173', serviceWorkers: 'block', timezoneId: 'Asia/Manila', deviceScaleFactor: ${size.scale},
    launchOptions: { executablePath: process.env.CHROME_PATH },
    // A dead proxy for everything but this machine, so no test can reach a real server.
    proxy: { server: 'http://127.0.0.1:9', bypass: '127.0.0.1,localhost' } },
  projects: [{ name: 'chromium' }],
})
`,
    );
    spawnSync("npx", ["playwright", "test", "-c", "portfolio-shots.config.ts", "--grep", tests.map(escapeRegex).join("|")], {
      cwd: webDir,
      stdio: "inherit",
      env: { ...process.env, SHOTS: "1", CHROME_PATH: chromePath },
    });
  }

  const find = (file, size) => {
    const png = join(shotsDir, `${file}-${size}.png`);
    if (!existsSync(png)) throw new Error(`No screenshot "${file}" at ${size} size; check the spec`);
    return png;
  };
  const pngs = {};
  const browser = shots.some((shot) => shot.phones) ? await chromium.launch({ executablePath: chromePath }) : null;
  try {
    for (const { name, file, phones } of shots) {
      if (!phones) {
        pngs[name] = find(file, "desktop");
        continue;
      }
      const images = phones.map((screen) => readFileSync(find(screen, "phone")).toString("base64"));
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await page.setContent(`<style>
        body { margin: 0; height: 100vh; display: flex; gap: 56px; align-items: center;
          justify-content: center; background: ${phones.background ?? "#dfeaf0"}; }
        img { height: 810px; border-radius: 28px; border: 1px solid rgb(0 0 0 / 0.14);
          box-shadow: 0 24px 60px -24px rgb(0 0 0 / 0.35); }
      </style>${images.map((data) => `<img src="data:image/png;base64,${data}">`).join("")}`);
      pngs[name] = join(shotsDir, `${name}-phones.png`);
      await page.screenshot({ path: pngs[name] });
      await page.close();
    }
  } finally {
    await browser?.close();
  }
  return pngs;
}
