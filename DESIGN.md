# Design decisions

The basis for edits to this portfolio. Read it before changing anything visual. Update it when a decision changes, and add a line to "Decided against" when something is tried and rejected.

## Status

Redesigned: **Hero, side nav, Industries strip, Experience, Selected works (Projects), About, Skills, Contact, Footer**, so every section now follows the rules below. The old look (grey pill headings, emerald accents, shadowed cards) is gone; don't bring it back.

Section order: Hero, Industries, Experience, Selected works (`#projects`), About, Skills, Contact, Footer. The nav order and the hero's scroll cue follow it.

A second page, **All projects** (`/projects/`), lists every project, professional and personal, and each project has its own **project page** (`/projects/<slug>/`). See "Pages", "All projects" and "Project page".

## Principles

- **Minimal and warm.** Paper and ink with one green accent. Few lines, no shadows on things at rest, no gradients, no glass.
- **Walk away from cards.** Sections are laid out with type, space and thin lines, not boxed panels. The user rejected the card layout for Experience; treat that as site-wide.
- **Line-art is the personality.** The hero drawings (ink strokes, flat fills from the theme) are the one illustrative language. Reuse them, or draw new ones in the same language, rather than adding icons or stock imagery. The exceptions are the tech logos on the project slides and the Skills keyboard, kept monochrome in ink (a logo shows its brand colour only while its key is hovered or pressed, or found by typing on the Skills keyboard), and the one photograph, in About, printed as an ink halftone.
- **Real content only.** Copy comes from the résumé, paraphrased and shortened. No invented numbers or claims. The project `role` values are placeholders the user hasn't confirmed yet (Full-stack Developer for the Uzaro projects, Frontend Developer for ALMA, "Personal project" for the rest).

## Tokens (`tailwind.config.js`)

| Role | Light | Dark |
| --- | --- | --- |
| Page background | `lightBG` #f4f3ef | `darkBG` #121211 |
| Secondary surface | `secondaryLightBG` #eae8e2 | `secondaryDarkBG` #1c1c1a |
| Lines, tracks | `lightShade` #dcd9cf | `darkShade` #2e2d2a |
| Body / secondary text | `lightModeTextP` #5a5852 | `darkModeTextP` #b1afa7 |
| Headings / emphasis | `lightModeTextT` #1c1b18 | `darkModeTextT` #edece7 |
| Accent (only one) | `lightAccent` #1f7a4d | `darkAccent` #5fcf92 |

- Always write both modes (`dark:` variants). Light is the default; `index.html` restores a saved dark choice before first paint, and the choice is stored in `localStorage` under `theme`.
- The accent is for small things: the "Open to work" dot, the active nav item, focus rings. Never a large fill, except the cap game's top-stage score (see About), which is a faint tint that only lasts while someone is playing well.

## Type

- **Geist** only (Google Fonts, `font-sans`). No second typeface, no monospace.
- Display: semibold, tight tracking (about -0.035em), leading near 1.05. Hero name and section titles use `clamp()` sizes.
- Body: 15px on phones, 16px from `md`, relaxed leading, in the muted text colour. Small meta text is 13px.
- Emphasis inside body copy is `font-medium` in the heading colour (for example "fullstack developer" in the hero, the highlighted phrases in Experience), never bold colour or italics.

## Layout

- Desktop has a fixed 64px left rail, so every top-level `<section>` gets `padding-left: 64px` from `md` (`src/index.css`). Keep sections as direct children of `<main>`.
- Content width: `max-w-[66rem]`, `px-5` on phones, `md:px-10`. Section padding is generous (`py-28 md:py-36 lg:py-44` for Experience); the gap between sections is clearly bigger than gaps inside one. The gap between two sections is one padding (112px on phones, 144px from `md`, 176px from `lg`), never two stacked: Skills, between About and Contact, has no vertical padding of its own, and a matching `scroll-mt` so its nav link still lands the heading where padding would.
- Two-column pattern for content sections (Experience): sticky heading and a short line on the left (4 of 12 columns), content on the right (8 of 12). On phones it stacks. A sticky heading eases in and out of its pin with `useEasedSticky` (see "Scroll curve").
- Headings name their section; each `<section>` has `aria-labelledby` or `aria-label`.
- Phone navigation is a bottom icon dock; keep `pb-24` room at the bottom of `<main>`.

## Pages

- Real pages, not a client-side router: `index.html` (home, `src/main.jsx`), `projects/index.html` (all projects, `src/projects.jsx`) and `projects/detail/index.html` (one project, `src/project.jsx`), all listed in `build.rollupOptions.input` in `vite.config.js`. Netlify serves `/projects/` as a static page. Link to it as `/projects/`, with the slash; the dev server serves the home page for `/projects`.
- Every project's address, `/projects/<slug>/` (`projectPath` in `src/utils.js`), shows the one project page, which reads the slug from the address. A rewrite in `netlify.toml` does this in production and a small middleware in `vite.config.js` (`toProjectPage`) in `vite` and `vite preview`; change both together.
- `src/Layout.jsx` is what every page shares: the theme, Lenis and the nav. A page passes `page` (`"home"`, `"projects"` or `"project"`).
- The first render is synchronous (`flushSync` in both entry files), so the sections exist before the page finishes loading. Without it the browser can't jump to a `/#about` address or restore the scroll position on a reload, and both landed at the top.
- CSS smooth scrolling (`html.glide` in `index.css`, for touch screens where Lenis doesn't run) starts only after the page has loaded, so arriving at `/#about` jumps straight there instead of scrolling past the whole page.

## Navigation

- Desktop: a compact left icon rail that reveals labels on hover or keyboard focus; the wordmark is pinned top-left and spells out from `<Zd/>` to `<ZenDevvv/>` once past the hero.
- The rail is only as tall as its items and sits at the vertical middle of the screen; it never runs the full height of the window. It has no background and no shadow, at rest or expanded: the labels simply appear next to the icons over the page.
- Phone: bottom dock with the same icons and a theme toggle.
- Adding a section means adding it to `navItems` in `Navbar.jsx`, in page order.
- On the all-projects and project pages the same rail and dock link to the home page's sections (`/#about`), "Projects" stays marked and leads to the all-projects page (its top, when you're on it), and the wordmark is spelled out from the start (there's no hero showing the name) and links home.

## Hero

- Centred intro framed by floating line-art objects, one per industry (IoT, manufacturing, finance, education, healthcare, hospitality), with pointer and scroll parallax.
- An object's label is the industry name alone ("IoT", "Healthcare"); never a project or client name. ERP is a kind of system, not an industry, so it has no hero object.
- Pointer parallax is by depth, not in unison. Each object's `depth` (0 far to 1 near) sets how far it drifts against the pointer (up to `POINTER_REACH`, 56px) and its own spring. Near objects settle in about 0.2 s; far ones trail to about 0.5 s with a little float. Depths alternate near and far around the ring, with the large gears nearest. The intro text follows the pointer slightly the other way, on its own spring.
- Hover and click play each object's animation and a synthesized sound (`src/sounds.js`, Web Audio, no audio files). Sound is a hero, Industries, project-stack, About, Skills, Contact and footer-wordmark feature only; it starts only after the visitor's first click, tap or keypress, and the footer's switch turns it all off (`setMuted` in `sounds.js`, kept in `localStorage` under `sound`).
- The 300 ms hover cooldown belongs to the element, not the sound (`source` in `playSound` / `soundOn`). Elements that share a sound, like the three keycaps, each play when the mouse sweeps across them.
- The drawings and shared pieces live in `HeroObjects.jsx`, including `Toy` (a drawing that plays on hover and click, with its bob, ripple and label; the drawing sits above its label, so one that travels while it plays passes in front of it) and `Keepsake` (a drawing beside a section's content with depth parallax, a scroll rise and a pop-in); Industries, About and Contact import them. The pointer parallax (`usePointer`, `useDrift`, `POINTER_REACH`) is in `src/pointer.js`.

## Industries strip

- A marquee of the six industries. It drifts slowly, speeds up with scroll velocity, and eases to a stop under the mouse.
- Cards are icon tiles reusing the hero drawings, with a title and a one-line description. With reduced motion it is a static, horizontally scrollable strip.

## Experience

- A timeline, not cards: a dot per job joined by a thin vertical line.
- Per stop: dates and computed duration, role (largest), company with logo and city, then short dash bullets.
- The dot is aligned to the vertical middle of the **role** line, not the date. It is positioned from the date's line height, the gap and half the role's line height (`--dot-y`, `--role` on the `<li>`). If the role's size, leading or the date's gap changes, update that calculation.
- Data lives in `src/assets/json/experiences.json`: `start` and `end` as `"YYYY-MM"` (`end: null` renders "Present"), `position`, `company`, `location`, `highlights` (phrases set in heading colour inside the bullets) and `tasks`. Duration is computed, counting both end months. Uzaro ends **Sept 2026** (the user no longer works there).
- Bullets are paraphrased and shortened from the résumé. Keep numbers that appear in the résumé; do not add new ones.
- The "Full résumé" link and the hero and nav résumé links all use `src/assets/Zen Andrei Obrero resume.pdf`. Replace that one file to update the résumé everywhere. (`src/assets/CV.pdf` is an old, unused file.)
- The heading block (title, line, résumé link) is sticky from `lg` and eases into and out of the pin on the scroll curve. It is pinned for only about 640px, so the curve shrinks to half of that: it glides to a brief standstill and eases straight off.

## Selected works (Projects)

- Only the home page's picks. Heading "Selected works", with no subtitle under it. On the heading's right, on its baseline, "See all projects", the total count in the muted colour and a → arrow lead to the all-projects page (body size, medium, ink; it rises in after the heading). Phones put it under the heading.
- Below the heading, a full-screen frame pins and the page's vertical scroll moves the projects sideways, one project per screen-wide slide. Entering and leaving, the turn from down to sideways follows the scroll curve (see "Scroll curve"), and the first and last projects come to rest exactly where the frame lands and lifts.
- The slides move sideways the whole time any of the frame is on screen: from the first pixel of its top at the bottom of the window to the last of its bottom leaving the top, they drift at `DRIFT` (0.35) of the scroll, and the turn adds the rest, so the sideways speed rises smoothly from 0.35 to 1:1 as the frame pins, and falls back to 0.35 as it lifts. The drift starts and stops only where none of the frame is visible. The first slide starts up to `ENTRY_OFFSET` (¾ of a slide) to the right of its place, so the drift is slower where that would be exceeded: on tall, narrow screens, about 0.17 on a portrait tablet and 0.12 on a phone. The resting places, snapping and touch snap points are unchanged: in the pinned stretch the drift and the turn add up to exactly 1:1.
- Each slide matches the user's mockup, three columns split by thin `lightShade` lines: title and description; a 4:5 image; role at the top and stack icons at the bottom. The title opens the project's page, with a → arrow that nudges right on hover; the image links there too, for the mouse only (`tabIndex -1`, hidden from screen readers). The live site and source are linked from the project page. Tablets put the image beside the other two; phones stack all three and clamp the description to 5 lines.
- A 1.5px ink line along the frame's bottom fills as you move through the projects.
- Images: a project with gallery screenshots shows a preview of them in the 4:5 slot (`ProjectCover.jsx`, shared with the all-projects list): the shots stacked, each cropped to portrait by `object-position` at its `focus`, cutting to the next every 0.8 s (`SECONDS_PER_SHOT`), only while on screen and only through shots that have loaded; under reduced motion it holds on the first. Each cut waits for the next shot's `decode()`, and the outgoing shot stays visible underneath the incoming one: a browser doesn't keep hidden (opacity 0) images decoded, and switching one on cold showed the empty box between shots for a moment. It plays the gallery's own files (`galleryOf` in `src/gallery.js`), so there's nothing to rebuild when a shot is removed. Without screenshots, the square `imageSrc` logo sits contained on a dark mat in both modes, because RYDE's logo is white.
- A slide's picture fills the whole middle column, edge to edge, until its cell comes on screen, then scales down into its 4:5 frame, tied to the scroll like a parallax rather than played on a timer (`zoomAt` and the cover loop in `Runway`'s `update`, in `Projects.jsx`; the cell clips it meanwhile). It starts moving on the first pixel of the cell to show and lands exactly as the slide comes to rest: progress is how far the cell has come from the frame's right edge to its place, times how far it has risen from the bottom of the window to its pin (the first slide does both round the corner, and multiplying keeps it moving while either moves). An ease-out cubic front-loads it, so most of the zoom happens while the cell is still sliding in. Slides further along wait at the filled size; past its place (off to the left, or lifted away) a picture stays at rest, and scrolling back re-fills one as it leaves to the right. It's a transform set in the same frame as the track's, and with reduced motion the picture is simply at rest.
- The section has no top padding of its own, so it has a `scroll-mt` (64px, 96px from `md`, 112px from `lg`): links to `#projects` stop above the heading instead of on it.
- Stack icons are `react-icons/si` logos on the hero's keycaps (`Keycap`, exported from `HeroObjects.jsx`), about 37px (`text-[13px]`). They sit straight in a row, not tossed like the hero's three. They click like the hero's keys, and light their logo in its brand colour the same way the Skills keys do (`color` in `tech`, passed to `Keycap`): the `key` sound on mouse hover and on every click or tap, each key with its own cooldown (`project:name` as the `source`). Hovering one presses it and shows its name beside the "Stack" label, because a label above each key would land on the heading or the row above. Each key also carries its name as screen-reader text. The names a project can list are the keys of `tech` in `ProjectStack.jsx`; the keys (`Stack`) are shared with the all-projects page. TanStack has no logo there, so it uses the React Query one. Tags without a logo (RBAC, SEO, GS1, Xendit) don't appear on slides.
- Data in `src/assets/json/projects.js`: `slug` (the project page's address), `kind` (`"professional"` or `"personal"`, for the all-projects page), `selected` (shown here, in file order), `role`, `stack`, optional `gallery` (the project page's screenshots and the preview's frames, each with an optional `focus` for the preview's crop), plus the older `title`, `description`, `imageSrc`, `skills`, `demo`, `source`.
- Snapping, with Lenis: about 90 ms after the last wheel or trackpad event (Lenis `virtual-scroll`), it snaps to a project, judged by where the scroll is heading (`targetScroll`). A quarter of the way toward the next project in the scroll's direction carries on to it. The glide starts at the page's current speed and eases to rest (a cubic Hermite easing), so it never jolts. It snaps only while the frame is pinned.
- Touch screens: no Lenis, so the browser snaps (`html:not(.lenis)` gets `scroll-snap-type: y proximity`, with one marker per project in the runway), and the frame pins without the slowed landing, which would trail the finger off the main thread.
- Reduced motion: no pinning; the slides sit in a plain strip scrolled sideways by hand, with its scrollbar showing.
- Tabbing to a slide's link scrolls that slide into the frame. The frame is `overflow-clip`, not `hidden`, so focus can't scroll it sideways.

## All projects

- The page at `/projects/`: every project in `projects.js`, in file order, in two groups by `kind`, professional then personal.
- Intro: a quiet "← Home" link (13px), the title "All projects" (larger than a section title, `clamp(2.75rem, …, 4.5rem)`, sliding up out of a mask), one line ("What I've built, at work and on my own."), and a jump link per group with its count and a ↓ arrow. "Home" always goes to the home page's Selected works (`/#projects`), where "See all projects" lives.
- Each group uses the two-column pattern: the heading (with its count set small and muted beside it, and one line under it) pins on the left from `lg` with `useEasedSticky`; the list fills the right. A jump link lands the group with its top at the pin line; the heading then eases into its pin on the curve, as Experience's does.
- An entry is a ruled row like Contact's (the rule draws across as it enters, and under the last one). From `sm` it is two equal columns: the project's picture on the left (4:5, the same screenshot preview or logo-on-a-dark-mat as the slides; about 300×380px on desktop), and on the right the title opening the project's page (no arrow), the role, "Source ↗" when `source` isn't empty, the first five lines of the description (the project page has it all) and the stack keycaps. The text rows are `auto` and `1fr`, so the tall picture doesn't push a gap under the role. Phones put the picture full width above the rest.
- The group lines ("Products I've built at work." and "Side projects from my own time.") are placeholders the user hasn't confirmed.
- Entrances play once in view, like the rest of the site; the intro plays on load.
- The picture links to the project's page too, for the mouse only, as on the slides.

## Project page

- `/projects/<slug>/` (`ProjectDetail.jsx`). Top to bottom: a quiet "← All projects" link (coming from the all-projects page it goes back in history, so the list opens where it was left); the logo and title; the description and links; the gallery when the project has one; "Next project"; the footer. The tab title is the project's name.
- The logo (`imageSrc`) is a square tile on the same dark mat as the slides (5rem, 6rem from `md`), beside the title from `sm` and above it on phones. The title is `clamp(2.25rem, …, 3.5rem)` and slides up out of a mask.
- Under them, the full description, then "Visit site ↗" (`demo`) and "Source ↗" (`source`) as body-size ink links, each only when set. From `lg` the right four columns hold the facts: ruled rows like Contact's (13px muted name, 15px medium ink value) for Role and Type, then the stack keycaps.
- **Gallery**: every screenshot at once in a grid, three across from `lg`, two from `sm`, one on phones, under a "Gallery" heading with the count set small beside it (like the all-projects groups). Each is a 16:10 shot in a thin `lightShade` frame with a numbered caption under it ("01  Landing page"), 13px muted. Shots rise in as they come into view, a beat apart across a row. Hovering one zooms it slightly inside its frame (1.03, with a zoom-in cursor).
- Clicking a shot opens it full screen (`ShotViewer.jsx`, a dialog in a portal at z-50): the page's paper (or dark) background, solid, no blur; "03 / 11" top left and "Close ×" top right (13px); the shot as large as the screen allows in its thin frame; the caption under it (15px, medium, ink). The previous and next arrows are the hero's `Keycap`s with the `key` sound, beside the shot from `md` and either side of the caption on phones; dimmed and inert at the first and last shot (no wrapping round).
- In the viewer: ← and → move, Esc closes, Tab stays inside, a swipe (80px, or a flick) moves on touch, and a click on the space around the shot closes. The page behind doesn't scroll (Lenis stops, and the root's overflow is hidden). The shots sit side by side in a strip, each as wide as the screen, and the strip slides a whole shot to the next, like a phone's photo viewer: nothing overlaps or fades, and a swipe drags the strip itself, so the next shot follows the finger in from the edge and the strip leaves the finger at its speed. The strip runs on a critically damped spring (`SPRING` 18, settling in about half a second, no overshoot) that `ShotViewer.jsx` steps itself each frame (`createSpring`), so another press only moves its target: a quick run of presses speeds it up without a hitch, and it never snaps the last stretch. The caption fades to the new one. Opening fades the screen in and settles the shot from 0.98 scale. Closing returns focus to the shot you ended on, without scrolling. The neighbouring shots preload.
- Screenshots are 1440×900 WebP (quality 82) in `src/assets/projects/<slug>/`, listed in the project's `gallery` as `{ src, caption, focus }`, made by the routine in "Project media". ASB, OSPAR and the HRIS have them so far; the rest show no gallery.
- ASB's come from the live demo (appsite-builder-cms.web.app), public pages only: the landing page, the editor in several states, its live preview and sign-up. Not the login page, which shows a "Dev quick login" panel, and not the admin area behind login. The GitHub repo is older than the live site.
- "Next project" is a ruled link to the next project in `projects.js`, wrapping round to the first: a 13px muted label over the title, set large, with →.
- An unknown slug shows "Project not found" with the back link.

## Project media

Every project gets the same steps; ASB (from its live site) and OSPAR (from its own tests) are the worked examples. The capture script drives the Chromium that Playwright caches (`playwright-core`, a pinned dev dependency) and uses ImageMagick (`magick`) for the WebPs.

0. **Security check, before running any of another repo's code.** Scan it the way this repo was cleaned: config files with lines over about 1000 characters or long whitespace runs before code, `eval(`, obfuscated `_0x…` names or `global.i=` (the loader found in this repo and in OSPAR's ESLint configs), `config.bat` in `.gitignore`; then lifecycle scripts (`preinstall`, `postinstall`, `prepare`), git and husky hooks, CI workflows and agent settings (`.claude`, `.codex`). Note committed secrets and data dumps, and never restore or screenshot real data: use the live demo's public pages or the app's own mocked tests. Report what you find to the user before going on.
1. **Screenshots.** Write the project's shot list in `scripts/shots/<slug>.mjs` (copy `asb.mjs`): the site's `base` address, and per shot a file `name`, a `path`, the gallery `caption`, an optional `focus` (see step 3) and an optional `prepare` that clicks and scrolls the page into the shot's state with the helpers in `scripts/capture-shots.mjs` (`playEntrances`, `scrollToSection`, `clickText`, `clickButton`; it can return a new tab to shoot instead). Prefer the live demo's public pages; without a live site, run the project's repo locally and point `base` at it. Don't log in or shoot admin areas unless the user says so, and leave out anything showing credentials or dev-only panels (ASB's login page has a "Dev quick login" panel). Run `npm run shots -- <slug>`: it saves each shot as a 1440×900 WebP in `src/assets/projects/<slug>/` and prints the `gallery` entries. Look at every shot before using it.
   - **Apps behind a login** (no public demo, a backend and database to run): if the app has mocked end-to-end tests, as OSPAR does, the shot list exports `e2e` (the app folder, its env, tests to ignore, and if they differ from the defaults its `testDir` and `devCommand`) and each shot names a `test` by its exact title instead of a `path` (copy `ospar.mjs`, or `hris.mjs` for a suite in `tests/smoke`). `capture-e2e.mjs` copies the app to a scratch folder (the repo is never touched), installs it with `--ignore-scripts`, runs just those tests at 1440×900 against the dev server with the tests' own fake API data, and keeps each test's final screen, retrying a failed test up to twice. The test browser gets a dead proxy for everything but this machine, so no test can reach a real server; still exclude tests that sign in to real environments (the HRIS suite has one that logs in to dev, UAT and production). A test that fails at sign-in for want of a backend ends on the sign-in page, which can make a shot of it. Pick tests whose last step checks loaded content; one that ends mid-navigation or mid-export leaves a skeleton or a blank page. To choose, run the whole suite once the same way and look at every final screen.
2. **Gallery.** Paste the printed entries into the project's `gallery` in `src/assets/json/projects.js`. The project page shows them in its grid and full-screen viewer.
3. **Preview.** Nothing to build: the slide and the all-projects list play the gallery's shots, cropped to portrait. Look at them there, and where a crop cuts what matters, change that shot's `focus` in `projects.js` (0 left, 1 right, 0.5 centre when left out) and in the shot list.

**Removing a shot: delete its image file** in `src/assets/projects/<slug>/`. `galleryOf` (`src/gallery.js`) only lists shots whose files exist, so it drops out of the project page's grid and viewer and out of the preview at once (the dev server updates on its own). Its line in `projects.js` can stay or go. If you capture again with `npm run shots`, take it out of the shot list too, or it comes back.

The preview replaces the logo on the home slide and in the all-projects list; the project page keeps the logo beside the title. Previews are cropped to portrait to keep the 4:5 boxes, rather than kept landscape or two shots stacked per frame; the user chose this.

## About

- Text on the left (heading, three short paragraphs, a "Say hello" link to Contact), the photo on the right; phones stack the text, then the photo. Keep it this short. The copy comes from the résumé and the user's old About: BS Computer Science with honors (2024), Algolympics in second year, owning features end to end, AI tools with every line reviewed, heading for a senior fullstack or tech lead role.
- The photo (`src/assets/profile.jpg`, the graduation portrait) is a print: a paper frame with an ink line, taped at the top, resting at -3° and straightening on hover like the keycaps. Its caption reads "Class of 2024" with a hint ("Click to develop", "Tap to develop" without hover, "Back to ink").
- The filter is an ink halftone in CSS (`.halftone` in `src/index.css`): the photo in grey, a screen of soft dots over it at half opacity, then `contrast(14)` turns every pixel to ink or paper. Two blended layers (`mix-blend-lighten` with the ink token, `mix-blend-darken` with the paper token) tint it. Dark mode inverts before and after, so the dots are light on a dark sheet. The dot cell is 4.5px, and the photo is toned down (`contrast(0.8)`) so its dark backdrop stays dotted instead of solid ink.
- Over the photo the mouse holds a line-art magnifier (`Magnifier`) that shows the true colours at 1.25×; the cursor hides while it's out. A click, tap or Enter takes a shot: a flash, the `shutter` sound, and the colour spreads from that point over the whole photo (`aria-pressed`). The next one, or the mouse leaving, prints it back in ink. Touch has no lens; a tap develops from where it lands.
- Entering, the print drops in and the photo develops: it fades in under the dot screen, so the dots grow out of blank paper.
- Two keepsakes float by the print like the hero's objects (`Toy`, depth parallax, a little scroll rise): a mortarboard ("BS Computer Science", 1.5× the trophy's size) and a trophy ("Algolympics champion", a wiggle and sparkle, `trophy` sound). Keep them over the frame or the page, never the dark photo, where ink lines vanish; the cap sits above the photo's top-left corner for this. Object labels have a paper backing for the same reason.
- The mortarboard is a keep-it-up game (`GradCap.jsx`). Hovering it only swings the tassel, silently. A click throws it; from then it is drawn over the page (fixed, z-40, above the nav), falls under gravity and is lost off the bottom of the screen unless it's hit again. Every hit (pointer down, so taps feel instant) throws it up about 30% of the screen's height. Where it's hit sets the sideways kick, away from the hit and growing with the square of the distance from the middle: a hit a third of the way out barely moves it sideways, one on the very edge sends it hard the other way and spins it. The sides and the top of the screen bounce it back, so the only way out is the bottom; then it pops back into its place. Sounds: `toss` on each hit, `bump` off an edge, `fall` as it drops out of sight. All the tuning is at the top of `GradCap.jsx`. With reduced motion there is no game; a click only swings the tassel.
- The game keeps score: every hit counts, the throw included. Every `MILESTONE` hits (10) is a milestone with a rising chord (`milestone`), and the first five each turn the game up a stage (`STAGES` at the top of `GradCap.jsx`):
  1. The score appears: a huge, faint number (`ScoreBoard`) centred on the screen behind the section's content (it is fixed inside About at z-0, with the content at `relative z-10`). Gravity ×1.1.
  2. Bigger; afterimages trail the cap. Gravity ×1.2, harder edge kicks.
  3. Bigger; a burst of line-art confetti (ink dashes, green dots, shaded chips) from the cap at each milestone.
  4. Bigger; the score jolts sideways on every hit, and the hit ring turns into a green outline.
  5. Biggest and green; it beats like a heart with the `heartbeat` sound every 0.9 s. Gravity ×1.6. Losing here is still a party: instead of the falling whistle, a `popper` and a last chord, and 80 bits of confetti shoot up from where the cap dropped out.
  Each stage's sounds are pitched a little higher. The score grows by scale (the text is set at the top size), springing to each new size; every milestone also slams it and flashes it darker. Later milestones keep celebrating at stage 5. Confetti lives in its own layer (`Confetti` in `GradCap.jsx`), not in the flight, so a burst plays out after the cap is gone. When the cap is lost, the final score holds for 1.2 s, then fades. On phones the print covers the middle of the screen, so the score shows around it.
- `profile.jpg` is only 389×519, so the colour view is soft once enlarged; a larger original would sharpen it.

## Skills

- A keyboard. Each résumé group (Technical Skills, in the résumé's order) is a row: the group's name on a wide key, then a key per skill. Domain Experience is left out; the Industries strip covers it. Legends are shortened from the résumé ("JWT auth", "Cloud Run"), and model versions are dropped so they don't date.
- No copy under the heading: the keys explain themselves. From `lg`, two columns: the heading and the typing readout on the left (4 of 12), the keyboard on the right (8 of 12), where long rows wrap under their own keys. Below `lg` the heading block sits above the keyboard; on phones each group key sits above its keys.
- The keys are the hero's `Keycap` redrawn in HTML so they can be any width: ink-lined sides in the shade, a face set in from them (deepest at the front, about 0.8em, like the hero's 11 of 42). Every key carries its name as a legend, bottom left, so the board reads without hovering; the logo sits top left. Group keys are the other colour of a two-tone set, like modifiers: the secondary surface instead of paper.
- Logos are [Simple Icons](https://simpleicons.org) from jsDelivr, pinned to one release (`ICONS` in `Skills.jsx`), used as a CSS mask over `currentColor`, so they are ink in both modes with no dark-mode filter. They load only once the board is within about a screen of view. No image files ship for this section.
- Each logo has its brand colour (`color` in the data, from Simple Icons) and lights up in it while its key is hovered, pressed or found by typing: in about 0.1 s, out over 0.5 s, so a quick tap still shows it. A colour too faint on a theme's paper (under 1.8:1) is darkened, or lightened on dark, until it reads (React's cyan, JavaScript's yellow on light). Grey brands (Next.js, GitHub, Express, Prisma on dark; TanStack's beige on light) stay ink. `brandColors` in `src/brandColor.js` does this, shared with the project stacks, so a new logo only needs its brand hex.
- Press feedback matches the project keycaps: hover dips the face, a click or tap bottoms it out (about 0.2em and 0.34em). The hover dip is inside `@media (hover: hover)`, which Tailwind emits after plain `:active`, so the press is repeated inside the same query; without it a mouse click never goes deeper than the hover. Adding a skill is one line in `src/assets/json/skills.js` (the header comment explains the fields); a skill with no Simple Icons logo (Zustand, Playwright, Codex, Grok, Stitch, REST, Custom PMS, Agile) gets a text-only key.
- Sound: a key clicks (`key`) on mouse hover and on press, a little lower the longer the key, the way wide keys sound deeper. A mouse sounds on pointer down so the click lands as the key bottoms out; touch waits for the tap, so a scroll that starts on a key stays silent. Group keys `thock`.
- Pressing a group key runs its row: each key presses and clicks in turn, 45 ms apart, rising in pitch, and each logo flashes its colour, so a wave of colour crosses the row.
- Typing on the visitor's own keyboard finds a skill while the board is on screen: the matching key is held down with a small accent LED, and the readout completes the name (typed part in ink, the rest faint) with the group above it. Names match from their start or a word's start, ignoring spaces and punctuation ("nextjs", "query"); pressing one letter repeatedly steps through the names that start with it. A miss plays `miss`. Escape clears. Backspace works as in a text field: holding it repeats, Ctrl+Backspace (Alt on a Mac) deletes the last word, Cmd+Backspace everything. Deleting sounds too: the press `thock`s like the board's wide keys, and while Backspace is held each character that goes plays a light `erase` tick, pitched lower as the word shrinks; with nothing to delete it's silent. It all clears 1.6 s after the last key. Other keys with Ctrl, Cmd or Alt are left to the browser, held letters don't repeat, and form fields are left alone. The readout shows only where there is hover (so likely a keyboard).
- Entering, the keys drop onto the board row by row with the hero keycaps' bounce. Reduced motion keeps the fades, and presses change without the slide.

## Contact

- The two-column pattern, like Experience and Skills. Left (4 of 12): heading ("Get in touch"), one line ("Hiring, or have something to build? Write to me.", balanced so it breaks after the question), the "Open to work" dot, and the paper plane under them. Right (8 of 12): a ruled list, one row each for Email, Phone, Local time and Elsewhere. Below `lg` the heading block sits above the list with the plane to its right.
- A row is its name (13px, muted, a 7.5rem column), the value (18px, 20px from `lg`, medium, ink) and an optional note or action on the right (13px). Phones stack the three. Every value is the same size; nothing is set large. A thin rule draws across the top of each row as it enters (and under the last).
- Contact details are the résumé's: `zenandreiobrero777@gmail.com` and `+63 906 857 5015` (`EMAIL` and `PHONE` at the top of `Contact.jsx`). The hero's email keycap still points at `zenandreiobrero@gmail.com` (no 777); the user hasn't said which is right.
- Email: the address is a `mailto:` link; "Copy" on the right copies it. A copy stamps a postmark (`Postmark` in `HeroObjects.jsx`: "DASMARIÑAS · CAVITE · PHILIPPINES" round the ring, COPIED and the day in the middle, wavy cancellation lines) just past the end of the address, its ring over the arrow so the address stays readable, at a random tilt, with the `stamp` sound a beat after the click as it lands. The ring has a paper backing; so does the button, which reads "✓ Copied" above the wavy lines. It holds 2.6 s and fades; every copy stamps again. Without a clipboard (an insecure page) Copy opens a mail draft instead.
- Phone is a `tel:` link. Local time is a line-art clock with real hands and "12:28 PM in Dasmariñas", updated each minute, with how far ahead of or behind the visitor that is on the right (the Philippines is UTC+8 all year). Elsewhere: GitHub, LinkedIn, Résumé.
- The one drawing is a paper plane (`PaperPlane`, a `Toy` labelled "Say hello" in a `Keepsake`). Hovering or clicking loops the loop with the `whoosh` sound: it swings once round a point above itself (`animate-loop`).

## Footer

- The page signs off with the nav's wordmark, `<ZenDevvv/>`, written across the content width between two thin lines, then a quiet row: © year and name, the sound switch ("Sound on" / "Sound off"), "Back to top".
- The wordmark is drawn in a 1.5px ink outline and fills with ink letter by letter as the page reaches its end: from the wordmark's top coming into view to just before the bottom (`fill` in `Footer.jsx`, `.ink-fill` in `index.css`). Each letter fills bottom-up over 4 of 14 steps, so a few fill at once. With reduced motion it is filled. A letter lifts 0.06em under the mouse and plays `miss` (the Skills finder's no-match knock) on mouse hover and on click or tap, each letter with its own cooldown (`wordmark:<index>` as the `source`), so a sweep across the word plays every letter.
- The footer is a `<footer>`, not a `<section>`, so `index.css` gives `main > footer` the rail's padding too.

## Motion

- Easing `[0.22, 1, 0.36, 1]` (strong ease-out) for entrances; the Experience line uses ease-in-out `[0.77, 0, 0.175, 1]` because it travels on screen.
- Entrances play **once** (`whileInView`, `once: true`, margin about -12%), in order: heading, then text, then details, staggered 60 to 90 ms, rising about 20px with opacity. The role title slides up out of a mask like the hero name.
- Animate `transform` and `opacity` only. No layout properties.
- `MotionConfig reducedMotion="user"` wraps the app, so reduced motion keeps fades and drops movement. Anything animated with CSS also needs `motion-reduce:` handling, and any scroll-driven state must be fully drawn when motion is off.
- Experience has **no hover, click or sound**. Its only motion is the entrances and the eased sticky heading.

## Scroll curve

- Wherever scrolling hands over between moving and holding still, the hand-off follows one curve, in `src/scrollCurve.js`. The new speed builds from nothing to 1:1 with the scroll along a smoothstep, so the stop and the start are both gentle. On the projects the sideways speed takes over exactly the speed the frame gives up, so the path bends round a corner; a steady sideways drift sits underneath it while the frame is on screen but not pinned (see "Selected works").
- `CURVE` (0.7 of the screen height) is half the scroll distance of each hand-off. It is shared, so changing it changes the projects and the Experience heading together. Where something is pinned for less than two hand-offs, the curve shrinks to half the pinned distance.
- `useEasedSticky(ref)` gives any `position: sticky` element the curve by measuring where it pins and unpins and shifting it with `transform` from Lenis's scroll event. Only while Lenis runs: updating in Lenis's own frame keeps the shift in step with the pin, which native touch scrolling can't promise.

## Smooth scroll

- Lenis, pinned to an exact version in `package.json`. It is deliberately subtle: wheel and trackpad ticks ease to where they land; the page still scrolls natively underneath, so sticky, `useScroll` and the nav's section observer keep working.
- All the tuning is at the top of `src/smoothScroll.js`: `LERP` (feel; lower is floatier, 1 turns it off) and `WHEEL_MULTIPLIER` (distance per tick). Nav links glide to their section through Lenis (`anchors: true`).
- Loaded with a dynamic `import()` after first paint, as its own chunk, and only for `(pointer: fine)` with no reduced-motion preference. Touch screens and reduced motion scroll natively and never download it. Keep it that way.
- Scroll-linked code that must land in the same frame as the scroll reads the running instance through `watchLenis` (it is `null` when Lenis isn't running, so always handle that).

## Decided against

- **Contact's email written huge across the full width** (sized to fill it, click to copy, details in three columns under it). The user disliked the huge email; Contact became a ruled list beside the heading, every value the same size.
- **A canned toss for the mortarboard** (up 1.6em with one turn, back onto its spot, on hover and click). The user wanted a game instead: it falls off the screen unless you keep hitting it.
- **About as three columns** ("Who I am", "Where I'm headed", "The bigger picture") with icons and check marks. The user discarded it for a short bio beside a photo.

- **A full-height side rail** that widened on hover with a background and a drop shadow. Replaced by the item-height rail with no background or shadow.
- **Project names in hero object labels** ("IoT · real-time devices", "ERP · OSPAR & HRIS", "Education · ALMA", "Hospitality · RYDE"), and an ERP crate object. Labels are the industry only; the industry list grew to six (healthcare, manufacturing, finance added, ERP dropped).
- **Experience as cards** (the original). Replaced by the timeline.
- **Milestone posts** (kilometre-post drawings, scroll-lit with a ripple, knock sound, hover rocking). Built, then rejected as too much. The user wants Experience minimal, with no sound and no interactions.
- **Showing "Present" for Uzaro.** It ends Sept 2026.
- **Original résumé bullets copied verbatim.** They are paraphrased and shortened.
- **Projects as alternating image-and-text cards** (the original). Replaced by the pinned sideways slides.
- **A subtitle under "Selected works"**, and the title "Selected projects". The user removed the line and renamed the title.
- **A tighter projects turn** (`CURVE` 0.4 with the speed changing at a steady rate). It read as abrupt; replaced by 0.7 with a smoothstep.
- **Snapping only after the scroll coasted to a stop**, then a 0.8 s ease-in-out. It felt late and weak.
- **A lerp snap that pulls toward the project.** It jolted from about 7 to 33 px per frame when it took over mid-scroll; replaced by the speed-matched glide.
- **Logos on the light secondary surface.** RYDE's white logo vanished in light mode.
- **Hero objects on one shared pointer spring** with reach of only 16 to 32px. They moved as one block; replaced by per-object depth.
- **A sound cooldown per sound name.** Sweeping across the keycaps played one click instead of three.
- **Stack icons as flat tiles with an ink tooltip pill.** Replaced by the hero's keycaps.
- **Skill logos as local image files** (mixed colour PNGs and SVGs in `src/assets/skills`, inverted by a filter in dark mode). Replaced by Simple Icons from the CDN, masked in ink.
- **A line and a hint under the Skills heading** ("The tools behind the work above, grouped the way my résumé groups them." and "Hover to press a key. Click a row's name to run it."). The user removed them as unnecessary.
- **The Skills keyboard across the full width under its heading.** The Frontend row ran the whole width and the other rows trailed off; replaced by the two-column layout from `lg`.
- **The project gallery as a carousel** (three shots at a time, keycap arrows paging through, "1–3 of 11", a progress line under it). The user wanted every screenshot visible at once in a grid.
- **Viewer shots crossfading with a 48px slide.** For about 200 ms the old and new shots overlapped half-transparent (two busy UIs over each other), the old one flashed back to full opacity for a frame, and a frame went blank. Replaced by the sliding strip.
- **framer-motion's `animate` spring for the viewer strip.** Each press restarted it, stalling it for a frame, and its duration-based spring snapped the last stretch after quick presses. Replaced by the spring stepped in `ShotViewer.jsx`.
- **"Home" on the all-projects page going back in history** when you came from this site. Coming from a project page, it went back to that project instead of home.
- **The preview at 2 s per shot.** Too slow; it runs at 0.8 s.
- **The slide pictures' zoom-out as a one-off 1.2 s entrance** (`useInView` at 40% of the image cell). Until 40% was on screen the picture sat at its filled size and looked stuck, and 1.2 s felt slow. Replaced by the scroll-linked zoom. Taking the lesser of the sideways and upward progress also stalled the first slide mid-zoom while the frame rose; they're multiplied instead.
- **Sideways motion only inside the turn.** The slides held still until the frame was about 30% on screen (70 to 80% on phones and tablets, where the turn is capped at half a slide), then started from nothing, and stopped the same way while the frame lifted away, so a partly shown frame looked stuck. Replaced by the drift under the turn.
- **The preview as a generated animated WebP** (`npm run cover`, built from the gallery with ImageMagick; chosen over a GIF, which was 3× the size and banded the dark gradients). Deleting a screenshot left it in the preview until it was rebuilt; the preview now plays the gallery's files.
- **A "Remove" button on dev builds and a removal command** for gallery shots. The user only wants to delete the image file.
- **All-projects pictures beside the text at 8.5rem, then 12rem wide.** Still too small; the picture now takes half the entry.
- **Skills with its own section padding** (`py-28 md:py-36 lg:py-44`). Stacked on About's and Contact's padding it doubled the gap on both sides (352px from `lg`), and the section came out about a screen tall. The user wanted the usual gap; the padding was removed.

## Checking changes

- Look at a change at 1440, 768 and 390 px, in light and dark, and with reduced motion, before calling it done. For entrances, capture frames over time rather than one still.
- For scroll-linked motion (the pin curves, snapping), screenshots aren't enough: record positions every frame while sending real wheel input, and check speeds change smoothly. A single double-length step followed by a normal one is a frame the headless sampler skipped, not a jolt.
- `npm run build` must pass. `npm run lint` already reports `react/prop-types` errors across the components; don't add other kinds.
- Commit messages in this repo are a short subject plus a bulleted body.
