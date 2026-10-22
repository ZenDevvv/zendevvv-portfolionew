// Screenshots from a project's own mocked end-to-end tests, for apps that only work behind a
// login and a backend: used by capture-shots.mjs when a shot list exports `e2e`.
//
// Copies the app (without node_modules) to a scratch folder, so the project's repo is never
// touched, installs it with install scripts off, and runs only the tests the shots name with
// Playwright, at 1440×900, against the app's dev server with the tests' own mocked API
// responses (fake data, no database), with the browser cut off from every server but this
// machine. The screenshot taken as each test finishes is the shot.
// Scan the repo for security problems before pointing this at it (see "Project media" in
// DESIGN.md).
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

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

// Returns each shot's PNG path, by shot name.
export function captureFromE2e({ e2e, shots, scratch, chromePath }) {
  const {
    app,
    testDir = "./e2e",
    ignore = [],
    devCommand = "npm run dev -- --host 127.0.0.1 --port 4173",
    url = "http://127.0.0.1:4173",
    env = {},
  } = e2e;
  if (!existsSync(join(app, "package-lock.json"))) throw new Error(`No package-lock.json in ${app}`);

  const work = join(scratch, "app");
  const skip = ["node_modules", "dist", "build", ".react-router", "test-results", "shots-results"];
  execFileSync("rsync", ["-a", ...skip.flatMap((dir) => ["--exclude", dir]), `${app}/`, `${work}/`]);
  console.log(`installing ${app} in a scratch copy (install scripts off)…`);
  execFileSync("npm", ["ci", "--ignore-scripts", "--no-audit", "--no-fund"], { cwd: work, stdio: "inherit" });
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
