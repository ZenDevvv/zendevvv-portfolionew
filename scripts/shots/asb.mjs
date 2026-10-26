// AppSite Builder's gallery, from the live demo's public pages (the admin area needs a login;
// the login page shows a "Dev quick login" panel, so it's left out). Used by
// scripts/capture-shots.mjs; see "Project media" in DESIGN.md.
//
// Each shot: `name` (the file name), `path` on `base`, `caption` for the gallery, optional
// `focus` (0 left to 1 right: where the preview crops it to portrait; 0.5 when left out) and
// `prepare`, which gets the page into the shot's state with the helpers in capture-shots.mjs.

export const base = "https://appsite-builder-cms.web.app";

// The editor opens on its last section; selecting the hero brings the canvas to the top.
const openHero = ({ clickText }) => clickText("Hero Section");

export const shots = [
  {
    name: "landing",
    path: "/",
    caption: "Landing page",
    prepare: ({ playEntrances }) => playEntrances(),
  },
  {
    name: "editor-section",
    path: "/editor",
    caption: "Editor, with a section's layout and background",
    cover: true,
    focus: 0,
    prepare: openHero,
  },
  {
    name: "editor-block",
    path: "/editor",
    caption: "Editing a heading block",
    focus: 0.3,
    prepare: async (helpers) => {
      await openHero(helpers);
      await helpers.page.locator("h2", { hasText: "Build Faster" }).first().click();
    },
  },
  {
    name: "editor-group",
    path: "/editor",
    caption: "A group's columns and its blocks",
    focus: 1,
    prepare: async (helpers) => {
      await openHero(helpers);
      await helpers.clickText("Main Group");
    },
  },
  {
    name: "editor-add-section",
    path: "/editor",
    caption: "Adding a section from presets",
    prepare: async (helpers) => {
      await openHero(helpers);
      await helpers.clickButton("Add Section");
    },
  },
  {
    name: "editor-mobile",
    path: "/editor",
    caption: "Phone view and global page styles",
    prepare: async (helpers) => {
      await openHero(helpers);
      // Deselecting shows the page's global settings.
      await helpers.page.keyboard.press("Escape");
      await helpers.clickButton("smartphone");
    },
  },
  {
    name: "preview",
    path: "/editor",
    caption: "Live preview of the page",
    focus: 0,
    // Preview opens in a new tab; that tab is the shot.
    prepare: async ({ clickButton }, context) => {
      const [tab] = await Promise.all([context.waitForEvent("page"), clickButton("Preview")]);
      await tab.waitForLoadState("networkidle");
      return tab;
    },
  },
  {
    name: "features",
    path: "/",
    caption: "Features",
    prepare: async ({ playEntrances, scrollToSection }) => {
      await playEntrances();
      await scrollToSection("Everything you need", { offset: 65 });
    },
  },
  {
    name: "cms-studio",
    path: "/",
    caption: "CMS Studio",
    focus: 0.05,
    prepare: async ({ playEntrances, scrollToSection }) => {
      await playEntrances();
      await scrollToSection("Pixel-perfect displays", { center: true });
    },
  },
  {
    name: "templates",
    path: "/",
    caption: "Website templates",
    prepare: async ({ playEntrances, scrollToSection }) => {
      await playEntrances();
      await scrollToSection("Start with something", { offset: 65 });
    },
  },
  {
    name: "register",
    path: "/register",
    caption: "Sign-up",
  },
];
