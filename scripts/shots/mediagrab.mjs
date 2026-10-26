// MediaGrab's gallery, from the app run locally: its hosted instance isn't online. Two servers
// from one copy: the hosted configuration (guardrails, the native-app promo), and the desktop
// one, which the desktop and phone shots open. The Android app shows the same frontend in a
// WebView, in the same mode as the desktop app, so the phone shot is that frontend at phone
// size, not an emulator capture. Used by scripts/capture-shots.mjs; see "Project media" in
// DESIGN.md.
//
// Each shot: `name` (the file name), `path` on the app (or a full address), `caption` for the
// gallery, optional `focus` (0 left to 1 right: where the preview crops it to portrait; 0.5
// when left out) and `prepare`, which gets the page into the shot's state.
//
// The shots really fetch and download the link below (Big Buck Bunny, the Blender Foundation's
// CC BY film) into the copy, so they need the network, uv, ffmpeg and deno.

export const local = {
  // The local clone of ZenDevvv/MediaGrab, as committed (its folder also holds a 6 GB Android
  // toolchain).
  app: "/home/machenike/Projects/MediaGrab",
  ref: "main",
  install: "uv venv -q .venv && uv pip install -q --python .venv/bin/python -r requirements.txt",
  // HOME is the copy's own, so the desktop server's log stays out of the real ~/.mediagrab.
  devCommand: [
    "mkdir -p home",
    "export HOME=$PWD/home MEDIA_GRAB_OS_OPEN=false",
    "MEDIAGRAB_MODE=desktop MEDIA_GRAB_DOWNLOADS_DIR=$PWD/saved \\",
    "  .venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 4174 &",
    "MEDIAGRAB_MODE=hosted .venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 4173",
  ].join("\n"),
};

const DESKTOP = "http://127.0.0.1:4174/";
const LINK = "https://www.youtube.com/watch?v=aqz-KE-bpKQ";

// Pastes the link and waits for the choose screen.
async function grab(page) {
  await page.fill("#input-url", LINK);
  await page.click("#btn-grab");
  await page.waitForSelector("#view-choose.active", { timeout: 60000 });
  await page.waitForTimeout(1200);
}

// Starts a 1080p download and waits until it's under way.
async function download(page) {
  await page.click('#video-qualities-grid [data-resolution="1080p"]');
  await page.click("#btn-start-download");
  await page.waitForSelector("#view-working.active", { timeout: 30000 });
  await page.waitForTimeout(3000);
}

// Downloads the MP3 and waits for the ready screen.
async function saveMp3(page) {
  await page.click("#btn-fmt-audio");
  await page.click("#btn-start-download");
  await page.waitForSelector("#view-ready.active", { timeout: 120000 });
  await page.waitForTimeout(1500);
}

// Three phone-size screens side by side, on the app's own background.
async function phones({ page }, context) {
  const phone = await context.newPage();
  await phone.setViewportSize({ width: 390, height: 844 });
  await phone.goto(DESKTOP, { waitUntil: "networkidle" });
  await phone.waitForTimeout(1000);
  const screens = [await phone.screenshot()];
  await grab(phone);
  screens.push(await phone.screenshot());
  await download(phone);
  screens.push(await phone.screenshot());
  await phone.close();
  const images = screens.map((png) => `<img src="data:image/png;base64,${png.toString("base64")}">`);
  await page.setContent(`<style>
    body { margin: 0; height: 100vh; display: flex; gap: 56px; align-items: center;
      justify-content: center; background: #f5f7f8; }
    img { height: 810px; border-radius: 28px; border: 1px solid rgb(0 0 0 / 0.08);
      box-shadow: 0 24px 60px -24px rgb(0 0 0 / 0.35); }
  </style>${images.join("")}`);
}

export const shots = [
  {
    name: "paste",
    path: "/",
    caption: "The hosted web app: paste a link",
    focus: 0.1,
  },
  {
    name: "choose-video",
    path: "/",
    caption: "Choosing a quality; the hosted server keeps 4K for the apps",
    focus: 1,
    prepare: ({ page }) => grab(page),
  },
  {
    name: "choose-audio",
    path: "/",
    caption: "MP3 at a chosen bitrate, tagged, with the thumbnail as cover art",
    focus: 1,
    prepare: async ({ page }) => {
      await grab(page);
      await page.click("#btn-fmt-audio");
      await page.waitForTimeout(800);
    },
  },
  {
    name: "working",
    path: "/",
    caption: "Live progress over Server-Sent Events: speed, time left and each stage",
    focus: 0.2,
    prepare: async ({ page }) => {
      await grab(page);
      await download(page);
    },
  },
  {
    name: "ready",
    path: "/",
    caption: "Ready to save; the hosted server deletes it 60 seconds later",
    focus: 0.15,
    prepare: async ({ page }) => {
      await grab(page);
      await saveMp3(page);
    },
  },
  {
    name: "dark",
    path: "/",
    caption: "Dark mode",
    cover: true,
    focus: 0,
    prepare: async ({ page }) => {
      await grab(page);
      await page.click("#btn-theme-flip");
      await page.waitForTimeout(800);
    },
  },
  {
    name: "desktop",
    path: DESKTOP,
    caption: "The desktop app for Windows and Linux saves straight to Downloads",
    focus: 0.15,
    prepare: async ({ page }) => {
      await grab(page);
      await saveMp3(page);
    },
  },
  {
    name: "phone",
    path: DESKTOP,
    caption: "On a phone: the screens the Android app shows",
    prepare: phones,
  },
];
