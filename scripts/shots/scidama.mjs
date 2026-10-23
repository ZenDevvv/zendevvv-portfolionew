// Scidama Online's gallery, from the rewrite run locally: it lives on the `scidama-v2` branch of
// the Cyclic repo, and the live site (scidama.onrender.com) still serves the original app until
// that branch is merged. Used by scripts/capture-shots.mjs; see "Project media" in DESIGN.md.
//
// Each shot: `name` (the file name), `path` on the app (or a full address), `caption` for the
// gallery, optional `focus` (0 left to 1 right: where the preview crops it to portrait; 0.5
// when left out) and `prepare`, which gets the page into the shot's state.
//
// The app has no login: every browser context is its own guest. The dev command builds the
// client, starts the server on a fresh database and fills it with the repo's own demo data
// (`npm run seed`: eight made-up players, nine finished games, two live games, two open rooms),
// then opens a gate on 5501 once the seed is done, so shooting waits for it. The room shots play
// two guests against each other through the UI, with the moves of the repo's own e2e test.

export const local = {
  app: "/home/machenike/Projects/Cyclic",
  ref: "scidama-v2",
  devCommand: [
    "npm run build",
    "export PORT=5500 DATABASE_PATH=$PWD/data/shots.db NODE_ENV=production",
    "node server/index.ts &",
    "until curl -sf localhost:5500/api/leaderboard >/dev/null; do sleep 0.5; done",
    "node scripts/seed-demo.ts http://localhost:5500 > seed.log &",
    "until grep -q Seeded seed.log; do sleep 0.5; done",
    `node -e "require('node:http').createServer((q, r) => r.end()).listen(5501, '127.0.0.1')"`,
  ].join("\n"),
  url: "http://127.0.0.1:5501/",
};

const APP = "http://localhost:5500";

// The board square at (x, y), by its accessible name.
const square = (page, x, y) => page.locator(`button[aria-label^="(${x},${y}),"]`);
const move = async (page, [fx, fy], [tx, ty]) => {
  await square(page, fx, fy).click();
  await square(page, tx, ty).click();
};

// Two guests in a private room: the host (desktop) plays red with no move clock, the friend
// joins by the invite link from a phone. Returns both pages and the friend's phone shots.
async function room({ page }, context) {
  const browser = context.browser();
  const host = page;
  const phone = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const phoneShots = [];

  await host.goto(`${APP}/play`, { waitUntil: "networkidle" });
  await host.getByRole("button", { name: "Create a room" }).first().click();
  await host.getByRole("radio", { name: "Red", exact: true }).click();
  await host.getByRole("radio", { name: "None" }).last().click();
  await host.getByRole("button", { name: "Create room" }).click();
  await host.waitForURL(/\/room\/[A-Z0-9]{6}$/);
  const code = host.url().split("/").pop();
  await host.getByText("Invite a friend").waitFor();

  await phone.goto(`${APP}/room/${code}`, { waitUntil: "networkidle" });
  await phone.getByText("Waiting for").first().waitFor();
  await phone.waitForTimeout(800);
  phoneShots.push(await phone.screenshot());

  await host.getByRole("button", { name: "Start game" }).click();
  await host.getByRole("group", { name: /Board, red to move/ }).waitFor();
  await phone.getByRole("group", { name: /Board, red to move/ }).waitFor();

  // Red ₱2 forward, blue ₱2 forward, then both captures are forced.
  await move(host, [5, 2], [4, 3]);
  await phone.getByRole("group", { name: /blue to move/ }).waitFor();
  await move(phone, [2, 5], [3, 4]);
  await host.getByRole("group", { name: /red to move/ }).waitFor();
  return { host, phone, phoneShots, code };
}

// Plays on from the forced captures to a resignation, and returns the phone's game and result.
async function finish({ host, phone, phoneShots }) {
  await move(host, [4, 3], [2, 5]); // ₱2 + ₱2 on a + square
  await phone.getByRole("group", { name: /blue to move/ }).waitFor();
  await move(phone, [1, 6], [3, 4]); // ₱8 − ₱2 on a − square
  await phone.getByRole("log", { name: "Moves and captures" }).getByText("+₱6").waitFor();
  await phone.waitForTimeout(800);
  phoneShots.push(await phone.screenshot());
  await host.getByRole("button", { name: "Resign" }).click();
  await host.getByRole("dialog").getByRole("button", { name: "Resign" }).click();
  await phone.getByRole("heading", { name: "You win" }).waitFor();
  await phone.waitForTimeout(2000);
  phoneShots.push(await phone.screenshot());
}

// Three phone screens side by side, on the app's own background.
async function phones({ page }, context) {
  const state = await room({ page }, context);
  await finish(state);
  const background = await state.phone.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const images = state.phoneShots.map((png) => `<img src="data:image/png;base64,${png.toString("base64")}">`);
  await page.setContent(`<style>
    body { margin: 0; height: 100vh; display: flex; gap: 56px; align-items: center;
      justify-content: center; background: ${background}; }
    img { height: 810px; border-radius: 28px; border: 1px solid rgb(255 255 255 / 0.12);
      box-shadow: 0 24px 60px -24px rgb(0 0 0 / 0.6); }
  </style>${images.join("")}`);
}

export const shots = [
  {
    name: "title",
    path: `${APP}/`,
    caption: "The title screen plays itself: a bot-vs-bot game on a giant chip, with a game-style menu",
    focus: 0.85,
    prepare: ({ page }) => page.waitForTimeout(5000),
  },
  {
    name: "lobby",
    path: `${APP}/play`,
    caption: "Quick match by rating, private rooms by invite link, open rooms and the top players",
    focus: 0.1,
  },
  {
    name: "bot",
    path: `${APP}/`,
    caption: "Against the bot, taken over from the demo game; the ledger writes each capture as its sum",
    focus: 0.1,
    prepare: async ({ page }) => {
      await page.waitForTimeout(7000);
      await page.getByRole("button", { name: "Play from here" }).click();
      await page.getByRole("log", { name: "Moves and captures" }).waitFor();
      await page.waitForTimeout(1200);
    },
  },
  {
    name: "capture-preview",
    path: "/",
    caption: "Picking a chip shows what each landing square would score, before you commit",
    focus: 0.1,
    prepare: async ({ page }, context) => {
      // The friend's page stays open: closing it would show them as disconnected.
      const { host } = await room({ page }, context);
      await square(host, 4, 3).click();
      await host.waitForTimeout(800);
      return host;
    },
  },
  {
    name: "spectate",
    path: `${APP}/watch`,
    caption: "Watching a live game, with the ledger and room chat",
    focus: 0.1,
    prepare: async ({ page }) => {
      await page.getByRole("link", { name: /against/ }).first().click();
      await page.getByText(/You're watching/).waitFor();
      await page.waitForTimeout(800);
    },
  },
  {
    name: "replay",
    path: `${APP}/play`,
    caption: "Every finished game has a replay, stepped through the ledger",
    focus: 0.1,
    prepare: async ({ page }) => {
      await page.getByRole("link", { name: "Replay" }).first().click();
      await page.waitForURL(/\/game\//);
      await page.waitForTimeout(1200);
    },
  },
  {
    name: "leaderboard",
    path: `${APP}/leaderboard`,
    caption: "Elo ratings and the leaderboard",
    focus: 0.3,
  },
  {
    name: "profile",
    path: `${APP}/leaderboard`,
    caption: "A player's rating history, record and recent games",
    focus: 0.2,
    prepare: async ({ page }) => {
      await page.getByRole("link", { name: /Paolo Garcia/ }).first().click();
      await page.waitForURL(/\/player\//);
      await page.waitForTimeout(1200);
    },
  },
  {
    name: "learn",
    path: `${APP}/learn`,
    caption: "The Learn page, with live boards that run the real rules engine",
    focus: 0.9,
  },
  {
    name: "phone",
    path: "/",
    caption: "On a phone: joining a friend's invite, the game and the result",
    prepare: phones,
  },
];
