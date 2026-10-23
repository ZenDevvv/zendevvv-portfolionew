// Astronomy of the Day (Skypost)'s gallery, from the live demo, which builds from the repo's
// `main` (GitHub Pages serves the same build at zendevvv.github.io/APOD-project). It needs no
// login or key; the pictures come from NASA's public endpoints. Used by
// scripts/capture-shots.mjs; see "Project media" in DESIGN.md.
//
// Each shot: `name` (the file name), `path` on the app, `caption` for the gallery, optional
// `focus` (0 left to 1 right: where the preview crops it to portrait; 0.5 when left out) and
// `prepare`, which gets the page into the shot's state with the helpers in capture-shots.mjs.
// Days are fixed so the pictures stay the same; the game's round, the ISS and tonight's sky are
// live. The album shot adds eight days to the album first (S on a day). The Live shots save a
// place in the browser first, as the app's own city search would: Manila for the ISS passes,
// Tromsø for a night with an aurora chance. Launch Library allows 15 requests an hour per
// address, so shoot Tonight at most a few times an hour or its countdown shows the limit message.

export const base = "https://zendevvv-apod.netlify.app";

const places = {
  manila: { name: "Manila", lat: 14.6042, lon: 120.9822, timezone: "Asia/Manila", source: "search" },
  tromso: { name: "Tromsø", lat: 69.6496, lon: 18.956, timezone: "Europe/Oslo", source: "search" },
};

// Saves a place the way the app's city search does, then reopens the page with it.
const from = (place, wait = 3500) => async ({ page }) => {
  await page.evaluate((value) => localStorage.setItem("skypost:v1:place", JSON.stringify(value)), places[place]);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(wait);
};

// The day view takes a letter for each tool (see Viewer.tsx).
const press = (key) => async ({ page }) => {
  await page.keyboard.press(key);
  await page.waitForTimeout(1200);
};

export const shots = [
  {
    name: "day",
    path: "/?d=2024-04-16",
    caption: "A day's picture, printed as a stamp",
    focus: 0.9,
  },
  {
    name: "catalogue",
    path: "/?d=2026-10-07",
    caption: "The catalogue entry, with the astronomer's explanation",
    focus: 1,
    prepare: press("i"),
  },
  {
    name: "loupe",
    path: "/?d=2024-04-19",
    caption: "The loupe, with the hint that explains it",
    prepare: async ({ page }) => {
      await page.keyboard.press("l");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1500);
    },
  },
  {
    name: "date",
    path: "/?d=2024-04-02",
    caption: "Re-setting the postmark to any day since 1995",
    focus: 0.9,
    prepare: press("d"),
  },
  {
    name: "film",
    path: "/?d=2026-10-18",
    caption: "A film day, played in place",
  },
  {
    name: "birthday",
    path: "/?d=2024-04-08&b=1",
    caption: "The picture published on your birthday",
    focus: 0,
  },
  {
    name: "birthday-sheet",
    path: "/?view=birthday&on=03-14",
    caption: "One birthday in every year since 1995",
    focus: 0.1,
  },
  {
    name: "archive",
    path: "/?view=archive&m=2024-04",
    caption: "A month of the archive as a sheet of stamps",
    focus: 0.1,
  },
  {
    name: "album",
    path: "/?view=album",
    caption: "The album of kept stamps",
    focus: 0.15,
    prepare: async ({ page, visit }) => {
      const days = ["2024-04-16", "2026-10-07", "2024-04-02", "2024-04-19", "2026-10-14", "2024-04-01"];
      for (const day of [...days, "2026-10-18", "2026-10-11"]) {
        await visit(`/?d=${day}`);
        await page.keyboard.press("s");
        await page.waitForTimeout(400);
      }
      await visit("/?view=album");
      await page.waitForTimeout(1500);
    },
  },
  {
    name: "earth",
    path: "/?view=live&tab=earth&d=2025-10-22",
    caption: "Live: the whole Earth from NASA's EPIC camera, as a round stamp",
    focus: 0.35,
    prepare: async ({ page }) => {
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2500);
    },
  },
  {
    name: "iss",
    path: "/?view=live&tab=iss",
    caption: "Live: the space station on a route chart, with its passes over you",
    focus: 1,
    prepare: from("manila"),
  },
  {
    name: "tonight",
    path: "/?view=live&tab=tonight",
    caption: "Live: tonight's clouds hour by hour, the aurora chance and the next launch",
    focus: 0.1,
    prepare: from("tromso", 5000),
  },
  {
    name: "game",
    path: "/?view=game",
    caption: "Smudged postmark: guess the year a picture was issued",
    focus: 0.9,
    prepare: async ({ page, clickButton }) => {
      await clickButton("Start a round");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
      await clickButton("Postmark it");
      await page.waitForTimeout(1500);
    },
  },
];
