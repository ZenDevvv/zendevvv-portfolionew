// Portfolio v2's gallery: this repo's own `main` branch, the portfolio before the redesign, run
// locally (the live site now serves the redesign). Used by scripts/capture-shots.mjs; see
// "Project media" in DESIGN.md.
//
// Each shot: `name` (the file name), `path` on the app, `caption` for the gallery, optional
// `focus` (0 left to 1 right: where the preview crops it to portrait; 0.5 when left out) and
// `prepare`, which gets the page into the shot's state with the helpers in capture-shots.mjs.
// The page scrolls inside its <main>, not the window, so the scroll helpers don't apply here.
import { fileURLToPath } from "node:url";

export const local = {
  app: fileURLToPath(new URL("../..", import.meta.url)),
  ref: "main",
};

// The hero's entrance ends with the theme toggle's spin, about four seconds in.
const settle = ({ page }) => page.waitForTimeout(4000);

// Scrolls <main> to the section with `id`, just under the fixed navbar, and lets it rise in.
const show = (id) => async ({ page }) => {
  await page.evaluate((id) => {
    const main = document.querySelector("main");
    main.scrollTo(0, document.getElementById(id).offsetTop - 40);
  }, id);
  await page.waitForTimeout(2500);
};

const lightMode = async ({ page }) => {
  await page.locator(".theme-toggle").first().click();
  await page.waitForTimeout(800);
};

export const shots = [
  {
    name: "hero",
    path: "/",
    caption: "The hero, in dark mode",
    focus: 0.3,
    prepare: settle,
  },
  {
    name: "hero-light",
    path: "/",
    caption: "The hero, in light mode",
    focus: 0.3,
    prepare: async (helpers) => {
      await settle(helpers);
      await lightMode(helpers);
    },
  },
  {
    name: "about",
    path: "/",
    caption: "About me and skills",
    focus: 0.3,
    prepare: show("about"),
  },
  {
    name: "experience",
    path: "/",
    caption: "Experience",
    focus: 0.3,
    prepare: show("experience"),
  },
  {
    name: "projects",
    path: "/",
    caption: "Projects",
    prepare: show("projects"),
  },
  {
    name: "projects-light",
    path: "/",
    caption: "Projects, in light mode",
    prepare: async (helpers) => {
      await lightMode(helpers);
      await show("projects")(helpers);
    },
  },
  {
    name: "contact",
    path: "/",
    caption: "Contact",
    prepare: show("contact"),
  },
];
