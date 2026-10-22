# Design decisions

The basis for edits to this portfolio. Read it before changing anything visual. Update it when a decision changes, and add a line to "Decided against" when something is tried and rejected.

## Status

Redesigned so far: **Hero, side nav, Industries strip, Experience, Selected works (Projects), About**. Everything else (Skills, Contact, Footer) still has the old look: grey pill headings, emerald accents, shadowed cards. Bring each in line with the rules below as it is redesigned, and don't copy its current style into new work.

Section order: Hero, Industries, Experience, Selected works (`#projects`), About, Skills, Contact, Footer. The nav order and the hero's scroll cue follow it.

## Principles

- **Minimal and warm.** Paper and ink with one green accent. Few lines, no shadows on things at rest, no gradients, no glass.
- **Walk away from cards.** Sections are laid out with type, space and thin lines, not boxed panels. The user rejected the card layout for Experience; treat that as site-wide.
- **Line-art is the personality.** The hero drawings (ink strokes, flat fills from the theme) are the one illustrative language. Reuse them, or draw new ones in the same language, rather than adding icons or stock imagery. The exceptions are the tech logos on the project slides, kept monochrome in ink, and the one photograph, in About, printed as an ink halftone.
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
- Content width: `max-w-[66rem]`, `px-5` on phones, `md:px-10`. Section padding is generous (`py-28 md:py-36 lg:py-44` for Experience); the gap between sections is clearly bigger than gaps inside one.
- Two-column pattern for content sections (Experience): sticky heading and a short line on the left (4 of 12 columns), content on the right (8 of 12). On phones it stacks. A sticky heading eases in and out of its pin with `useEasedSticky` (see "Scroll curve").
- Headings name their section; each `<section>` has `aria-labelledby` or `aria-label`.
- Phone navigation is a bottom icon dock; keep `pb-24` room at the bottom of `<main>`.

## Navigation

- Desktop: a compact left icon rail that reveals labels on hover or keyboard focus; the wordmark is pinned top-left and spells out from `<Zd/>` to `<ZenDevvv/>` once past the hero.
- The rail is only as tall as its items and sits at the vertical middle of the screen; it never runs the full height of the window. It has no background and no shadow, at rest or expanded: the labels simply appear next to the icons over the page.
- Phone: bottom dock with the same icons and a theme toggle.
- Adding a section means adding it to `navItems` in `Navbar.jsx`, in page order.

## Hero

- Centred intro framed by floating line-art objects, one per industry (IoT, manufacturing, finance, education, healthcare, hospitality), with pointer and scroll parallax.
- An object's label is the industry name alone ("IoT", "Healthcare"); never a project or client name. ERP is a kind of system, not an industry, so it has no hero object.
- Pointer parallax is by depth, not in unison. Each object's `depth` (0 far to 1 near) sets how far it drifts against the pointer (up to `POINTER_REACH`, 56px) and its own spring. Near objects settle in about 0.2 s; far ones trail to about 0.5 s with a little float. Depths alternate near and far around the ring, with the large gears nearest. The intro text follows the pointer slightly the other way, on its own spring.
- Hover and click play each object's animation and a synthesized sound (`src/sounds.js`, Web Audio, no audio files). Sound is a hero, Industries, project-stack and About feature only; it starts only after the visitor's first click, tap or keypress.
- The 300 ms hover cooldown belongs to the element, not the sound (`source` in `playSound` / `soundOn`). Elements that share a sound, like the three keycaps, each play when the mouse sweeps across them.
- The drawings and shared pieces live in `HeroObjects.jsx`, including `Toy` (a drawing that plays on hover and click, with its bob, ripple and label); Industries and About import them. The pointer parallax (`usePointer`, `useDrift`, `POINTER_REACH`) is in `src/pointer.js`.

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

- Only the home page's picks; a separate all-projects page is planned. Heading "Selected works", with no subtitle under it.
- Below the heading, a full-screen frame pins and the page's vertical scroll moves the projects sideways, one project per screen-wide slide. Entering and leaving, the turn from down to sideways follows the scroll curve (see "Scroll curve"), and the first and last projects come to rest exactly where the frame lands and lifts.
- Each slide matches the user's mockup, three columns split by thin `lightShade` lines: title and description; a 4:5 image; role at the top and stack icons at the bottom. The title links to the live site with a ↗ arrow; source links are left for the all-projects page. Tablets put the image beside the other two; phones stack all three and clamp the description to 5 lines.
- A 1.5px ink line along the frame's bottom fills as you move through the projects.
- Images: a project's optional `cover` (vertical image) fills the 4:5 slot. Without one, the square `imageSrc` logo sits contained on a dark mat in both modes, because RYDE's logo is white.
- Stack icons are `react-icons/si` logos on the hero's keycaps (`Keycap`, exported from `HeroObjects.jsx`), about 37px (`text-[13px]`). They sit straight in a row, not tossed like the hero's three. They click like the hero's keys: the `key` sound on mouse hover and on every click or tap, each key with its own cooldown (`project:name` as the `source`). Hovering one presses it and shows its name beside the "Stack" label, because a label above each key would land on the heading or the row above. Each key also carries its name as screen-reader text. The names a project can list are the keys of `tech` in `Projects.jsx`. TanStack has no logo there, so it uses the React Query one. Tags without a logo (RBAC, SEO, GS1, Xendit) don't appear on slides.
- Data in `src/assets/json/projects.js`: `selected` (shown here, in file order), `role`, `stack`, optional `cover`, plus the older `title`, `description`, `imageSrc`, `skills`, `demo`, `source`.
- Snapping, with Lenis: about 90 ms after the last wheel or trackpad event (Lenis `virtual-scroll`), it snaps to a project, judged by where the scroll is heading (`targetScroll`). A quarter of the way toward the next project in the scroll's direction carries on to it. The glide starts at the page's current speed and eases to rest (a cubic Hermite easing), so it never jolts. It snaps only while the frame is pinned.
- Touch screens: no Lenis, so the browser snaps (`html:not(.lenis)` gets `scroll-snap-type: y proximity`, with one marker per project in the runway), and the frame pins without the slowed landing, which would trail the finger off the main thread.
- Reduced motion: no pinning; the slides sit in a plain strip scrolled sideways by hand, with its scrollbar showing.
- Tabbing to a slide's link scrolls that slide into the frame. The frame is `overflow-clip`, not `hidden`, so focus can't scroll it sideways.

## About

- Text on the left (heading, three short paragraphs, a "Say hello" link to Contact), the photo on the right; phones stack the text, then the photo. Keep it this short. The copy comes from the résumé and the user's old About: BS Computer Science with honors (2024), Algolympics in second year, owning features end to end, AI tools with every line reviewed, heading for a senior fullstack or tech lead role.
- The photo (`src/assets/profile.jpg`, the graduation portrait) is a print: a paper frame with an ink line, taped at the top, resting at -3° and straightening on hover like the keycaps. Its caption reads "Class of 2024" with a hint ("Click to develop", "Tap to develop" without hover, "Back to ink").
- The filter is an ink halftone in CSS (`.halftone` in `src/index.css`): the photo in grey, a screen of soft dots over it at half opacity, then `contrast(14)` turns every pixel to ink or paper. Two blended layers (`mix-blend-lighten` with the ink token, `mix-blend-darken` with the paper token) tint it. Dark mode inverts before and after, so the dots are light on a dark sheet. The dot cell is 4.5px, and the photo is toned down (`contrast(0.8)`) so its dark backdrop stays dotted instead of solid ink.
- Over the photo the mouse holds a line-art magnifier (`Magnifier`) that shows the true colours at 1.25×; the cursor hides while it's out. A click, tap or Enter takes a shot: a flash, the `shutter` sound, and the colour spreads from that point over the whole photo (`aria-pressed`). The next one, or the mouse leaving, prints it back in ink. Touch has no lens; a tap develops from where it lands.
- Entering, the print drops in and the photo develops: it fades in under the dot screen, so the dots grow out of blank paper.
- Two keepsakes float by the print like the hero's objects (`Toy`, depth parallax, a little scroll rise): a mortarboard ("BS Computer Science", 1.5× the trophy's size) and a trophy ("Algolympics champion", a wiggle and sparkle, `trophy` sound). Keep them over the frame or the page, never the dark photo, where ink lines vanish; the cap sits above the photo's top-left corner for this. Object labels have a paper backing for the same reason.
- The mortarboard is a keep-it-up game (`GradCap.jsx`). Hovering it only swings the tassel, silently. A click throws it; from then it is drawn over the page (fixed, z-40, above the nav), falls under gravity and is lost off the bottom of the screen unless it's hit again. Every hit (pointer down, so taps feel instant) throws it up about 30% of the screen's height. Where it's hit sets the sideways kick, away from the hit and growing with the square of the distance from the middle: a hit a third of the way out barely moves it sideways, one on the very edge sends it hard the other way and spins it. The sides and the top of the screen bounce it back, so the only way out is the bottom; then it pops back into its place. Sounds: `toss` on each hit, `bump` off an edge, `fall` as it drops out of sight. All the tuning is at the top of `GradCap.jsx`. With reduced motion there is no game; a click only swings the tassel.
- The game keeps score: every hit counts, the throw included. Every `MILESTONE` hits (intended 10; **set to 3 for testing**, so change it back) is a milestone with a rising chord (`milestone`), and the first five each turn the game up a stage (`STAGES` at the top of `GradCap.jsx`):
  1. The score appears: a huge, faint number (`ScoreBoard`) centred on the screen behind the section's content (it is fixed inside About at z-0, with the content at `relative z-10`). Gravity ×1.1.
  2. Bigger; afterimages trail the cap. Gravity ×1.2, harder edge kicks.
  3. Bigger; a burst of line-art confetti (ink dashes, green dots, shaded chips) from the cap at each milestone.
  4. Bigger; the score jolts sideways on every hit, and the hit ring turns into a green outline.
  5. Biggest and green; it beats like a heart with the `heartbeat` sound every 0.9 s. Gravity ×1.6. Losing here is still a party: instead of the falling whistle, a `popper` and a last chord, and 80 bits of confetti shoot up from where the cap dropped out.
  Each stage's sounds are pitched a little higher. The score grows by scale (the text is set at the top size), springing to each new size; every milestone also slams it and flashes it darker. Later milestones keep celebrating at stage 5. Confetti lives in its own layer (`Confetti` in `GradCap.jsx`), not in the flight, so a burst plays out after the cap is gone. When the cap is lost, the final score holds for 1.2 s, then fades. On phones the print covers the middle of the screen, so the score shows around it.
- `profile.jpg` is only 389×519, so the colour view is soft once enlarged; a larger original would sharpen it.

## Motion

- Easing `[0.22, 1, 0.36, 1]` (strong ease-out) for entrances; the Experience line uses ease-in-out `[0.77, 0, 0.175, 1]` because it travels on screen.
- Entrances play **once** (`whileInView`, `once: true`, margin about -12%), in order: heading, then text, then details, staggered 60 to 90 ms, rising about 20px with opacity. The role title slides up out of a mask like the hero name.
- Animate `transform` and `opacity` only. No layout properties.
- `MotionConfig reducedMotion="user"` wraps the app, so reduced motion keeps fades and drops movement. Anything animated with CSS also needs `motion-reduce:` handling, and any scroll-driven state must be fully drawn when motion is off.
- Experience has **no hover, click or sound**. Its only motion is the entrances and the eased sticky heading.

## Scroll curve

- Wherever scrolling hands over between moving and holding still, the hand-off follows one curve, in `src/scrollCurve.js`. The new speed builds from nothing to 1:1 with the scroll along a smoothstep, so the stop and the start are both gentle. On the projects the sideways speed takes over exactly the speed the frame gives up, so the path bends round a corner.
- `CURVE` (0.7 of the screen height) is half the scroll distance of each hand-off. It is shared, so changing it changes the projects and the Experience heading together. Where something is pinned for less than two hand-offs, the curve shrinks to half the pinned distance.
- `useEasedSticky(ref)` gives any `position: sticky` element the curve by measuring where it pins and unpins and shifting it with `transform` from Lenis's scroll event. Only while Lenis runs: updating in Lenis's own frame keeps the shift in step with the pin, which native touch scrolling can't promise.

## Smooth scroll

- Lenis, pinned to an exact version in `package.json`. It is deliberately subtle: wheel and trackpad ticks ease to where they land; the page still scrolls natively underneath, so sticky, `useScroll` and the nav's section observer keep working.
- All the tuning is at the top of `src/smoothScroll.js`: `LERP` (feel; lower is floatier, 1 turns it off) and `WHEEL_MULTIPLIER` (distance per tick). Nav links glide to their section through Lenis (`anchors: true`).
- Loaded with a dynamic `import()` after first paint, as its own chunk, and only for `(pointer: fine)` with no reduced-motion preference. Touch screens and reduced motion scroll natively and never download it. Keep it that way.
- Scroll-linked code that must land in the same frame as the scroll reads the running instance through `watchLenis` (it is `null` when Lenis isn't running, so always handle that).

## Decided against

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

## Checking changes

- Look at a change at 1440, 768 and 390 px, in light and dark, and with reduced motion, before calling it done. For entrances, capture frames over time rather than one still.
- For scroll-linked motion (the pin curves, snapping), screenshots aren't enough: record positions every frame while sending real wheel input, and check speeds change smoothly. A single double-length step followed by a normal one is a frame the headless sampler skipped, not a jolt.
- `npm run build` must pass. `npm run lint` already reports `react/prop-types` errors across the components; don't add other kinds.
- Commit messages in this repo are a short subject plus a bulleted body.
