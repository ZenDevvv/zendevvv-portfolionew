# Portfolio (React + Vite + Tailwind + framer-motion)

Read `DESIGN.md` before any visual or layout change. It records the design system, which sections are already redesigned, and what was tried and rejected.

- Match the redesigned sections (Hero, Industries, Experience, Selected works), not the old ones (About, Skills, Contact, Footer).
- Both light and dark modes always: add `dark:` variants and check both.
- Résumé is one file, `src/assets/Zen Andrei Obrero resume.pdf`; all links import it.
- When a design decision changes or is rejected, update `DESIGN.md` in the same change.
- Smooth scroll (Lenis) is tuned in `src/smoothScroll.js`; keep it lazy-loaded and off for touch and reduced motion. See "Smooth scroll" in `DESIGN.md`.
- Anything that pins while the page scrolls uses the shared curve in `src/scrollCurve.js` (the projects frame, the Experience heading). See "Scroll curve" in `DESIGN.md`.
- Which projects appear on the home page is the `selected` flag in `src/assets/json/projects.js`; `kind` (professional or personal) groups them on the all-projects page. The file's header comment lists its fields.
- The site has three pages, `index.html`, `projects/index.html` (all projects) and `projects/detail/index.html` (one project, served at every `/projects/<slug>/` by a rewrite in both `netlify.toml` and `vite.config.js`), all in `vite.config.js`'s build input and sharing `src/Layout.jsx`. See "Pages" in `DESIGN.md`.
- A project's screenshots and gallery follow one routine: a security check of the project's repo first, a shot list in `scripts/shots/<slug>.mjs` (from a live site, or from the app's own mocked e2e tests), `npm run shots -- <slug>`, then paste the `gallery` into `projects.js`; the preview on the slides plays from it. To drop a shot, delete its image file. See "Project media" in `DESIGN.md`.
- Verifying scroll motion: the Playwright MCP browser fails here (it looks for Chrome at `/opt/google/chrome`). Drive the cached Chromium (`~/.cache/ms-playwright/chromium-*/chrome-linux64/chrome`) from a Playwright script instead, sampling positions each frame while sending `mouse.wheel` input so Lenis is in the loop.

## Security and repo hygiene

- On 2026-10-22 this repo's git history was rewritten to remove a malware loader that had been hidden after thousands of spaces in `tailwind.config.js` (and `config.bat` added to `.gitignore`). Commit hashes before that date no longer exist on GitHub. A clone older than that must be re-cloned, never pulled into (a pull would merge the infected history back). GitHub's read-only `refs/pull/1/head` still holds the old commits.
- Config files (`tailwind.config.js`, `postcss.config.js`, `vite.config.js`, `eslint.config.js`) run whenever Node loads them, so keep them short and readable. A config line over about 1000 characters, long whitespace runs before code, `eval(`, or `config.bat` in `.gitignore` is a red flag: inspect it, don't commit it.
- A global git hook (`~/.config/git/hooks/config-guard.py`, set by `core.hooksPath`) blocks those patterns on commit and push. Don't bypass it with `--no-verify` unless you have read the flagged line and it is a false positive. It does not scan pulls, so look at what a pull brings in. Details are in `~/system-docs/git-hooks.md`.
- Never commit `.env` files or credentials. Check both the code and the working tree before pushing.

## Local skills

`.claude/skills/` is gitignored and holds plain copies (they don't update themselves) of `design-taste-frontend` (Leonxlnx/taste-skill) and Emil Kowalski's animation and design skills (emilkowalski/skills, for example `emil-design-eng`, `animate`, `animation-performance`, `review-animations`). They are guidance only; where they disagree with `DESIGN.md`, `DESIGN.md` wins. Re-copy from those repos to update them.
