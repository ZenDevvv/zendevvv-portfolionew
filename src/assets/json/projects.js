// Every project is listed on the all-projects page (/projects/), in the order listed here,
// and has its own page at /projects/<slug>/.
// slug: the project's address; lowercase letters, digits and dashes.
// kind: "professional" (work projects), "side" (paid projects outside work) or "personal" (for
//   fun and upskilling); the all-projects page groups them by it, in that order.
// selected: true also shows the project in the home page's Selected works section.
// role: your part in the project, shown on its slide and its entry.
// stack: technologies shown as icons. Each name must be a key of `tech`
//   in src/component/ProjectStack.jsx (typescript, react, tanstack, node, mongodb, ...).
// demo: the live site. source: the code; each is linked when it isn't "".
// highlights: optional, what you did in the project, as bullets: { title, text }, a short lead
//   and a sentence or two. The project page lists them under the description, behind a
//   "Show more" button. Facts from the project's own repo and docs only.
// gallery: optional screenshots, in order: { src, caption, focus, cover }, with src relative to
//   src/assets like imageSrc (1440×900 WebP, in projects/<slug>/), made by
//   `npm run shots -- <slug>`. They fill the project page's gallery. cover: true marks the
//   shots shown on the slide and in the all-projects list in place of the logo: one is a
//   still, several play in turn (COVER_SECONDS_PER_SHOT in src/gallery.js); with none flagged
//   the logo stays. focus (0 left to 1 right, 0.5 if left out) is where a cover is cropped to
//   portrait. Deleting a shot's image
//   file takes it out of the site; its line here can stay. See "Project media" in DESIGN.md.
export default [
  {
    title: "AppSite Builder",
    slug: "asb",
    kind: "side",
    selected: true,
    role: "Full-stack Developer",
    stack: ["typescript", "react", "tanstack", "node", "express", "mongodb", "prisma"],
    imageSrc: "projects/asb.png",
    // From the live demo (scripts/shots/asb.mjs); the admin area behind login isn't shown.
    gallery: [
      { src: "projects/asb/landing.webp", caption: "Landing page" },
      { src: "projects/asb/editor-section.webp", caption: "Editor, with a section's layout and background", focus: 0, cover: true },
      { src: "projects/asb/editor-block.webp", caption: "Editing a heading block", focus: 0.3 },
      { src: "projects/asb/editor-group.webp", caption: "A group's columns and its blocks", focus: 1 },
      { src: "projects/asb/editor-add-section.webp", caption: "Adding a section from presets" },
      { src: "projects/asb/editor-mobile.webp", caption: "Phone view and global page styles" },
      { src: "projects/asb/preview.webp", caption: "Live preview of the page", focus: 0 },
      { src: "projects/asb/features.webp", caption: "Features" },
      { src: "projects/asb/cms-studio.webp", caption: "CMS Studio", focus: 0.05 },
      { src: "projects/asb/templates.webp", caption: "Website templates" },
      { src: "projects/asb/register.webp", caption: "Sign-up" },
    ],
    description:
      "AppSite Builder (ASB) is a no-code website and landing page builder where users can start from admin-curated templates or blank projects, edit pages through a visual drag-and-drop editor, auto-save drafts, and publish static HTML sites. It supports structured content using pages, sections, groups, and reusable blocks, plus global style settings, SEO metadata, role-based access, soft-delete protection, and non-destructive template forking.",
    skills: [
      "TypeScript",
      "MERN",
      "Prisma",
      "TanStack",
      "No-Code Builder",
      "RBAC",
      "SEO",
      "Static Site Rendering",
    ],
    demo: "https://appsite-builder-cms.web.app/",
    source: "",
  },
  {
    title: "Human Resources Information System",
    slug: "hris",
    kind: "professional",
    selected: true,
    role: "Full-stack Developer",
    stack: ["typescript", "react", "tanstack", "node", "express", "mongodb", "prisma"],
    imageSrc: "projects/hris.png",
    // From the app's own mocked smoke tests (scripts/shots/hris.mjs): fake data only.
    gallery: [
      { src: "projects/hris/sign-in.webp", caption: "Sign-in", focus: 0, cover: true },
      { src: "projects/hris/dashboard.webp", caption: "An employee's dashboard", focus: 0.2 },
      { src: "projects/hris/notifications.webp", caption: "Notifications for requests and approvals", focus: 0.2 },
      { src: "projects/hris/departments.webp", caption: "Departments, in the admin configuration", focus: 0.35 },
      { src: "projects/hris/sections.webp", caption: "Sections and their line leaders", focus: 0.35 },
      { src: "projects/hris/devices.webp", caption: "Biometric devices and their status", focus: 0.35 },
      { src: "projects/hris/device-events.webp", caption: "Events from the biometric devices", focus: 0.3 },
      { src: "projects/hris/device-event.webp", caption: "A device event matched to an employee" },
      { src: "projects/hris/sync-logs.webp", caption: "Syncing attendance logs from a device", focus: 0.15 },
      { src: "projects/hris/csv-import.webp", caption: "Importing device users from a CSV" },
      { src: "projects/hris/sync-center.webp", caption: "Sync Center: device users across terminals" },
      { src: "projects/hris/job-application.webp", caption: "A public job application" },
    ],
    description:
      "A multi-tenant Human Resource Information System built to centralize and automate core HR operations. The platform offers end-to-end employee management, recruitment and applicant tracking, payroll processing, and timekeeping management, enabling HR teams to efficiently manage the entire employee lifecycle. It supports multiple organizations within a single system while maintaining secure and structured access through Attribute-Based Access Control (ABAC), ensuring that HR data visibility and actions align with user roles, departments, and organizational policies.",
    skills: ["TypeScript", "MERN", "Prisma", "TanStack"],
    demo: "https://hris-app-dev.web.app/",
    source: "",
  },
  {
    title: "RYDE",
    slug: "ryde",
    kind: "side",
    selected: false,
    role: "Full-stack Developer",
    stack: ["typescript", "react", "tanstack", "node", "express", "mongodb", "prisma"],
    imageSrc: "projects/ryde.png",
    description:
      "RYDE is a luxury car rental and private chauffeur web application that allows users to seamlessly reserve premium vehicles and optionally book professional chauffeurs. The platform supports flexible vehicle turnover options, including pickup, meetup, or home delivery, and integrates secure online payments through Xendit. RYDE is designed to deliver a smooth, high-end booking experience with a focus on convenience, reliability, and modern web usability.",
    skills: [
      "TypeScript",
      "MERN",
      "Prisma",
      "TanStack",
      "Payment Integration",
      "Xendit",
    ],
    demo: "https://ryde-luxury-web-dev.web.app/",
    source: "",
  },
  {
    title: "OSPAR (Inventory Management System)",
    slug: "ospar",
    kind: "professional",
    selected: true,
    role: "Full-stack Developer",
    stack: ["typescript", "react", "tanstack", "hookform", "zod", "node", "express", "mongodb", "prisma"],
    imageSrc: "projects/ospar.png",
    // From the app's own mocked end-to-end tests (scripts/shots/ospar.mjs): fake data only.
    gallery: [
      { src: "projects/ospar/dashboard.webp", caption: "Management dashboard", focus: 0, cover: true },
      { src: "projects/ospar/product.webp", caption: "A product's stock overview and batches", focus: 0.25 },
      { src: "projects/ospar/stock-movements.webp", caption: "Stock movement history", focus: 0.25 },
      { src: "projects/ospar/transaction.webp", caption: "A stock movement's transaction details", focus: 0.1 },
      { src: "projects/ospar/delivery-requests.webp", caption: "Delivery requests between departments", focus: 0.25 },
      { src: "projects/ospar/delivery-orders.webp", caption: "Delivery orders", focus: 0.25 },
      { src: "projects/ospar/stock-in.webp", caption: "Receiving stock from a supplier", focus: 0.25 },
      { src: "projects/ospar/report.webp", caption: "Inventory movement report by product", focus: 0.25 },
      { src: "projects/ospar/variance.webp", caption: "Reconciling a stock count", focus: 0.25 },
      { src: "projects/ospar/patients.webp", caption: "Patient management", focus: 0.25 },
      { src: "projects/ospar/billing.webp", caption: "A billing record and its reference trail", focus: 0.25 },
      { src: "projects/ospar/receipt.webp", caption: "A printable return receipt", focus: 0.65 },
      { src: "projects/ospar/statement.webp", caption: "A statement of account and its payments", focus: 0.25 },
    ],
    description:
      "OSPAR is an inventory management system built on GS1 standards that tracks item movement across multiple organizations and departments, from internal transfers to final patient usage. It supports delivery requests, delivery orders, and delivery receipts, along with patient, supplier, and product management, while providing stock and batch-level tracking per department for accurate inventory control. Built-in reporting and analytics offer visibility and insights to support informed, data-driven decisions.",
    skills: [
      "TypeScript",
      "MERN",
      "Prisma",
      "TanStack",
      "React Hook Form",
      "Zod",
      "RBAC",
      "GS1",
    ],
    demo: "https://ospar-app-dev.web.app/",
    source: "",
  },
  {
    title: "ALMA (Alternative Learning Management App)",
    slug: "alma",
    kind: "professional",
    selected: true,
    role: "Frontend Developer",
    stack: ["typescript", "react", "tanstack", "hookform", "zod", "node", "express", "mongodb", "cloudinary"],
    imageSrc: "projects/alma.png",
    description:
      "ALMA is a scalable, multi-tenant learning management platform designed to support multiple organizations, instructors, and learners within a unified system. The application enables role-based access, course management, and structured learning workflows while maintaining tenant isolation and performance. I worked as the Frontend Developer, responsible for building modular, responsive UI components, implementing state management, and integrating frontend features with backend APIs to deliver a seamless and efficient learning experience.",
    skills: [
      "TypeScript",
      "MERN",
      "TanStack",
      "React Hook Form",
      "Zod",
      "RBAC",
      "Cloudinary",
    ],
    demo: "https://lms-app-test.site/",
    source: "",
  },
  {
    title: "Odoko",
    slug: "odoko",
    kind: "personal",
    selected: true,
    role: "Personal project (in development)",
    stack: ["typescript", "react", "expo", "sqlite", "drizzle", "kotlin", "android", "python"],
    imageSrc: "projects/odoko.png",
    // The app's design screens (docs/screens in its repo), not captures of the built app: it is
    // an Android app with an on-device model and only an arm64 build (scripts/shots/odoko.mjs).
    gallery: [
      { src: "projects/odoko/visor.webp", caption: "Design: Visor introduces itself and downloads its model once, then works offline" },
      { src: "projects/odoko/chat.webp", caption: "Design: ask Visor, snap a receipt or tell it by voice, answered on the phone" },
      { src: "projects/odoko/home.webp", caption: "Design: Home with Visor's note, logging a fill-up and the service list", cover: true },
      { src: "projects/odoko/numbers.webp", caption: "Design: km per liter and cost per km, spending, and your bikes" },
      { src: "projects/odoko/entries.webp", caption: "Design: adding a service and an expense by hand, and Settings" },
    ],
    description:
      "Odoko is an offline AI for the phone: an Android logbook for Filipino motorcycle riders, with Visor, an assistant that runs a small Gemma 3 language model entirely on the device. Log a fill-up from words, a voice note or a receipt photo, and ask Visor about your own fuel, service and spending; the model reads and words everything on the phone, so no log, photo or question ever leaves it. Manual logging works with no model and no signal. Still in development.",
    skills: [
      "TypeScript",
      "React Native",
      "Expo",
      "On-device AI",
      "Gemma 3",
      "Unsloth",
      "QLoRA fine-tuning",
      "LiteRT-LM",
      "Kotlin",
      "SQLite",
      "Drizzle ORM",
      "Offline-first",
      "Jest",
    ],
    demo: "",
    source: "",
    highlights: [
      {
        title: "An AI that works with no signal",
        text: "The language model runs on the phone through LiteRT-LM, wrapped in a Kotlin module for Expo. It downloads once, resumes if the connection drops, and is only kept once its size and SHA-256 match; answers stream as they are generated, and the model unloads itself after a quiet spell to give the memory back.",
      },
      {
        title: "A Gemma I fine-tuned with Unsloth",
        text: "To read what a rider means in English and Taglish, I fine-tuned Gemma 3 1B with Unsloth (QLoRA, rank 16, on all seven projections) on thousands of generated and hand-typed rider questions, on my own laptop's 4 GB GPU. It learns to answer with one short line that code then checks against an allowed list, and I converted the result to an 8-bit LiteRT-LM file for the phone.",
      },
      {
        title: "The model words it, the code does the maths",
        text: "Visor never calculates and never writes. Every number comes from pure TypeScript rules into a fact sheet, and the model only puts it into words. Every figure, date and peso amount in a reply is checked against that sheet, retried once, and replaced by the plain facts if it doesn't match.",
      },
      {
        title: "Log by talking, or by photo",
        text: "Words, a voice note (Android's on-device recognizer, never the online one) or a receipt photo (ML Kit text recognition, offline) become a confirm card, and nothing is saved until the rider taps Save. The photo is deleted after it is read.",
      },
      {
        title: "Private by construction",
        text: "Logs, photos, voice and questions never leave the phone, and a config plugin keeps the data out of Google's backup. Anonymous stats and crash reports are opt-in, drop IP addresses and never carry a log value.",
      },
      {
        title: "Rules first, in plain integers",
        text: "Pesos are kept as centavos, liters as milliliters and distance as whole kilometers, never floats. The rules and the spec's worked examples are written as Jest tests before the code, and ESLint enforces which folder may import which.",
      },
      {
        title: "Built spec-first, solo",
        text: "A PRD, a TRD, a milestone plan, 22 designed screens and a numbered decision log came before and alongside the code, and the build is measured on a budget Android phone rather than only an emulator.",
      },
    ],
  },
  {
    title: "Peck",
    slug: "peck",
    kind: "personal",
    selected: true,
    role: "Personal project (in development)",
    stack: ["typescript", "react", "tanstack", "vite", "hono", "drizzle", "postgres", "supabase", "typst", "zod"],
    imageSrc: "projects/peck.png",
    // From the app's own screenshot spec with its mocked API and fake data (scripts/shots/peck.mjs).
    // Peck is still being built, so these are the screens that exist so far.
    gallery: [
      { src: "projects/peck/today.webp", caption: "Today: follow-ups and interviews due", focus: 0.35 },
      { src: "projects/peck/pipeline.webp", caption: "The pipeline board", focus: 0.2 },
      { src: "projects/peck/paste-job.webp", caption: "Paste a job link or post", focus: 0.5 },
      { src: "projects/peck/check-details.webp", caption: "Checking what Peck read from a job post", focus: 0.5 },
      { src: "projects/peck/fit.webp", caption: "How you fit a job, from your own facts", focus: 0.5 },
      { src: "projects/peck/start.webp", caption: "Choosing how to start", focus: 0.5 },
      { src: "projects/peck/reading.webp", caption: "Reading an uploaded resume", focus: 0.5 },
      { src: "projects/peck/check-found.webp", caption: "Checking what was found in the resume", focus: 0.5 },
      { src: "projects/peck/ready.webp", caption: "Setup notes pinned as the profile fills in", focus: 0.5, cover: true },
      { src: "projects/peck/profile.webp", caption: "Your profile: the facts Peck writes from", focus: 0.35 },
      { src: "projects/peck/tone.webp", caption: "Picking a tone", focus: 0.35 },
      { src: "projects/peck/result.webp", caption: "A preened resume, every line traced to a fact", focus: 0.8 },
      { src: "projects/peck/crumbs.webp", caption: "Crumbs: free daily refill and what was spent", focus: 0.5 },
      { src: "projects/peck/phone-track.webp", caption: "On a phone: Today, the pipeline and how you fit a job" },
      { src: "projects/peck/phone-preen.webp", caption: "On a phone: starting from a resume, checking what it found and the preened result" },
    ],
    description:
      "Peck is a job application tracker for phone and desktop, with an AI resume builder that only writes what you have actually done. Track every application across separate job hunts, paste a job post and have it read for you, then \"preen\" a one-page resume for that job from facts you confirmed: every line traces back to one, and anything the job asks for that you have no fact for is left out and shown as a gap. Tracking is free; the AI features are paid per use in crumbs. Built for job seekers in the Philippines, and still in development.",
    skills: [
      "TypeScript",
      "React 19",
      "TanStack Router & Query",
      "Hono",
      "Drizzle ORM",
      "PostgreSQL",
      "Supabase",
      "Row-level Security",
      "Typst",
      "Zod",
      "PWA",
      "Vitest",
      "Playwright",
    ],
    demo: "",
    source: "",
    highlights: [
      {
        title: "Facts only, checked by code",
        text: "The model fills fixed slots from facts the user confirmed and code assembles the document. A custom validator rejects any line it can't trace to a stored fact, and it caught all 1,630 of 1,630 injected mutants in mutation testing.",
      },
      {
        title: "Credits that always add up",
        text: "Crumbs live in an append-only ledger: spend, refund and daily refill happen in single transactions, a failed or stopped AI job refunds automatically, and a spend breaker and kill switch cap what the AI can cost.",
      },
      {
        title: "Reading job posts safely",
        text: "A pasted link goes through an SSRF-safe fetcher that respects robots.txt, with its own test suite. Sites that block it (most do) fall back to pasting the post, and the user checks every field Peck read before anything is saved.",
      },
      {
        title: "Resume upload with a safety suite",
        text: "An uploaded resume is checked before it is read: renamed executables, HTML, SVG, oversized or encrypted files, zip and image bombs and lying DOCX headers are all refused, and text inside a file can't change what the draft says.",
      },
      {
        title: "Private by construction",
        text: "Every table has row-level security in Postgres on Supabase, checked in CI, and each person's stored facts and contact details are encrypted with their own key.",
      },
      {
        title: "ATS-safe PDFs",
        text: "Resumes render as one-page PDFs with Typst, then two independent text extractors confirm every line reads back in order, with fonts embedded and no images.",
      },
      {
        title: "Built to a budget",
        text: "A mobile-first installable PWA with a 170 KB first-load JavaScript budget enforced in CI, Playwright suites at phone and desktop widths with axe accessibility checks, and a mocked API so the tests need no backend.",
      },
    ],
  },
  {
    title: "MediaGrab",
    slug: "mediagrab",
    kind: "personal",
    selected: false,
    role: "Personal project",
    stack: ["python", "fastapi", "javascript", "kotlin", "android"],
    imageSrc: "projects/mediagrab.png",
    description:
      "A self-hosted media downloader for over 1,750 sites, from YouTube and TikTok to SoundCloud: trim a clip and save it as an MP4, an MP3 or SRT captions. It runs as a hosted web app, a desktop app for Windows and Linux, and an Android app.",
    skills: ["Python", "FastAPI", "yt-dlp", "FFmpeg", "Kotlin", "Android"],
    demo: "",
    source: "https://github.com/ZenDevvv/MediaGrab",
    highlights: [
      {
        title: "One frontend, four ways to run it",
        text: "A single web frontend in plain JavaScript runs as the hosted site, the desktop app, the Android app and an installable PWA, all against one API, kept in an OpenAPI contract that the Android tests check against.",
      },
      {
        title: "Hosted on a Linux VM",
        text: "A FastAPI server on a Freestyle VM, running as a systemd service, set up by a re-runnable provisioning script and deployed by pushing the working tree. It also ships as a Docker image.",
      },
      {
        title: "Guardrails for the hosted server",
        text: "Hosted mode caps quality at 1080p, length at 60 minutes and size at 1 GB, checked against the server's own metadata so they can't be spoofed. Files are deleted 60 seconds after they're saved, and a signed session cookie plus a per-IP limit share the download slots fairly.",
      },
      {
        title: "Desktop app for Windows and Linux",
        text: "Packaged with PyInstaller, with FFmpeg and Deno bundled so there's nothing to install. It opens in a native window, falls back to a Chromium or Edge app window or the browser, and saves straight to Downloads. A run on a real Windows machine found five bugs no Linux test could reach, and CI now checks for them.",
      },
      {
        title: "Android app",
        text: "A Kotlin (Ktor) server inside the app serves the same frontend to a WebView, and downloads run on the phone with youtubedl-android, so YouTube sees the phone's own connection. Links can be shared to MediaGrab from any app, and downloads carry on in the background with a progress notification.",
      },
      {
        title: "The download pipeline",
        text: "yt-dlp and FFmpeg: MP4 by copying the streams rather than re-encoding them where the formats allow, trimming that fetches only the chosen clip, MP3 at a chosen bitrate with tags and the thumbnail as cover art, and captions as SRT without downloading the media. Progress streams live over Server-Sent Events.",
      },
      {
        title: "Tests and releases",
        text: "pytest in both the hosted and desktop modes, with a headless-Chromium run through the UI. GitHub Actions builds the Windows, Linux and signed Android releases together on each version tag, and smoke-tests a real download on Windows and Linux.",
      },
    ],
    // From the app run locally (scripts/shots/mediagrab.mjs); its hosted instance is offline.
    gallery: [
      { src: "projects/mediagrab/paste.webp", caption: "The hosted web app: paste a link", focus: 0.1 },
      { src: "projects/mediagrab/choose-video.webp", caption: "Choosing a quality; the hosted server keeps 4K for the apps", focus: 1 },
      { src: "projects/mediagrab/choose-audio.webp", caption: "MP3 at a chosen bitrate, tagged, with the thumbnail as cover art", focus: 1 },
      { src: "projects/mediagrab/working.webp", caption: "Live progress over Server-Sent Events: speed, time left and each stage", focus: 0.2 },
      { src: "projects/mediagrab/ready.webp", caption: "Ready to save; the hosted server deletes it 60 seconds later", focus: 0.15 },
      { src: "projects/mediagrab/dark.webp", caption: "Dark mode", focus: 0, cover: true },
      { src: "projects/mediagrab/desktop.webp", caption: "The desktop app for Windows and Linux saves straight to Downloads", focus: 0.15 },
      { src: "projects/mediagrab/phone.webp", caption: "On a phone: the screens the Android app shows" },
    ],
  },
  {
    title: "Blog App",
    slug: "blog-app",
    kind: "personal",
    selected: false,
    role: "Personal project",
    stack: ["react", "framer", "node", "express", "mysql", "jwt"],
    imageSrc: "projects/Blog.png",
    description:
      "The Fullstack Blog Application lets users create, read, update, and delete blog posts with secure JWT-based authentication. Built with React, Node.js, Express, and MySQL, it features a responsive interface, efficient CRUD operations, and RESTful APIs for seamless blog and user management. This project showcases secure, scalable, and reliable frontend-backend integration.",
    skills: ["React", "Express.js", "Node.js", "MySQL", "Framer Motion", "JWT"],
    demo: "https://nlog-blog.netlify.app/",
    source: "https://github.com/ZenDevvv/nlog-blog",
  },
  {
    title: "Skypost",
    slug: "apod",
    kind: "personal",
    selected: false,
    role: "Personal project",
    stack: ["typescript", "react", "html", "css"],
    imageSrc: "projects/skypost.png",
    description:
      "Skypost is NASA's Astronomy Picture of the Day as a stamp collection: every day since June 1995 is a perforated stamp whose postmark is the date control. Travel day by day, open any date or your birthday, browse a month as a sheet of stamps, keep an album, and guess the year a picture was published. A Live section adds the whole Earth from NASA's EPIC camera, the space station's position and passes over you, and tonight's sky.",
    skills: ["TypeScript", "React", "Vite", "REST APIs", "SVG", "d3-geo", "satellite.js", "GitHub Actions"],
    demo: "https://zendevvv-apod.netlify.app",
    source: "https://github.com/ZenDevvv/APOD-project",
    highlights: [
      {
        title: "Kept working through NASA's API move",
        text: "When NASA moved APOD to science.nasa.gov in September 2026, the old API started answering every date with a placeholder. The app now reads NASA's new endpoint, recovers the pictures and videos the migration left inside each record's HTML, and caches what it fetches.",
      },
      {
        title: "Every day as a stamp",
        text: "About 11,400 days, each printed as a perforated stamp with a postmark that strikes when the day loads and rolls its date wheels. The same stamp works at every size: one day full screen, a month as a sheet, a birthday in every year, and an album held under glassine strips.",
      },
      {
        title: "A loupe on the full-resolution file",
        text: "A magnifier reads the full-resolution image (up to 4,096 px) under the pointer, steered by mouse, touch or arrow keys. Its power stops at the detail the file really holds, and a hint explains it the moment it's picked up.",
      },
      {
        title: "Live sky",
        text: "The whole Earth from NASA's EPIC camera as a round stamp; the ISS on a d3-geo route chart, its position and passes computed in the browser from its orbit with satellite.js; and tonight's clouds hour by hour (Open-Meteo), an aurora estimate from NOAA's Kp index and a countdown to the next launch (Launch Library 2).",
      },
      {
        title: "Static and keyless",
        text: "No backend and no API keys: every source is public, readable from the browser and cached within its free limits. Location is asked for only on request and stays in the browser. GitHub Actions lints, builds and deploys it to GitHub Pages.",
      },
    ],
    // From the live demo (scripts/shots/apod.mjs); the Live shots save a place first.
    gallery: [
      { src: "projects/apod/day.webp", caption: "A day's picture, printed as a stamp", focus: 0.9, cover: true },
      { src: "projects/apod/catalogue.webp", caption: "The catalogue entry, with the astronomer's explanation", focus: 1 },
      { src: "projects/apod/loupe.webp", caption: "The loupe, with the hint that explains it" },
      { src: "projects/apod/date.webp", caption: "Re-setting the postmark to any day since 1995", focus: 0.9 },
      { src: "projects/apod/film.webp", caption: "A film day, played in place" },
      { src: "projects/apod/birthday.webp", caption: "The picture published on your birthday", focus: 0 },
      { src: "projects/apod/birthday-sheet.webp", caption: "One birthday in every year since 1995", focus: 0.1 },
      { src: "projects/apod/archive.webp", caption: "A month of the archive as a sheet of stamps", focus: 0.1 },
      { src: "projects/apod/album.webp", caption: "The album of kept stamps", focus: 0.15 },
      { src: "projects/apod/earth.webp", caption: "Live: the whole Earth from NASA's EPIC camera, as a round stamp", focus: 0.35 },
      { src: "projects/apod/iss.webp", caption: "Live: the space station on a route chart, with its passes over you", focus: 1 },
      { src: "projects/apod/tonight.webp", caption: "Live: tonight's clouds hour by hour, the aurora chance and the next launch", focus: 0.1 },
      { src: "projects/apod/game.webp", caption: "Smudged postmark: guess the year a picture was issued", focus: 0.9 },
    ],
  },
  {
    title: "Scidama Online",
    slug: "scidama",
    kind: "personal",
    selected: true,
    role: "Personal project",
    stack: ["typescript", "react", "tailwind", "node", "express", "socketio", "zod"],
    imageSrc: "projects/scidama.png",
    // From the rewrite on the repo's scidama-v2 branch, run locally with its own demo data
    // (scripts/shots/scidama.mjs); the live site still serves the original until it's merged.
    gallery: [
      { src: "projects/scidama/title.webp", caption: "The title screen plays itself: a bot-vs-bot game on a giant chip, with a game-style menu", focus: 0.85, cover: true },
      { src: "projects/scidama/lobby.webp", caption: "Quick match by rating, private rooms by invite link, open rooms and the top players", focus: 0.1 },
      { src: "projects/scidama/bot.webp", caption: "Against the bot, taken over from the demo game; the ledger writes each capture as its sum", focus: 0.1 },
      { src: "projects/scidama/capture-preview.webp", caption: "Picking a chip shows what each landing square would score, before you commit", focus: 0.1 },
      { src: "projects/scidama/spectate.webp", caption: "Watching a live game, with the ledger and room chat", focus: 0.1 },
      { src: "projects/scidama/replay.webp", caption: "Every finished game has a replay, stepped through the ledger", focus: 0.1 },
      { src: "projects/scidama/leaderboard.webp", caption: "Elo ratings and the leaderboard", focus: 0.3 },
      { src: "projects/scidama/profile.webp", caption: "A player's rating history, record and recent games", focus: 0.2 },
      { src: "projects/scidama/learn.webp", caption: "The Learn page, with live boards that run the real rules engine", focus: 0.9 },
      { src: "projects/scidama/phone.webp", caption: "On a phone: joining a friend's invite, the game and the result" },
    ],
    description:
      "Scidama Online is a real-time, two-player math checkers game: a science variant of Damath, the Filipino math checkers, where every chip is a quantity in pesos or kilowatt-hours and a capture scores only when the arithmetic still makes a quantity (₱8 + ₱4 scores; ₱8 × ₱4 and ₱8 + 3 kWh don't). Play a rated quick match, invite a friend to a private room, watch live games, replay finished ones, or practise against a bot, all without signing up.",
    skills: [
      "TypeScript",
      "React",
      "Node.js",
      "Socket.IO",
      "SQLite",
      "Tailwind CSS",
      "Zod",
      "Zustand",
      "Real-time Multiplayer",
      "Playwright",
    ],
    demo: "https://scidama.onrender.com",
    source: "https://github.com/ZenDevvv/Cyclic",
    highlights: [
      {
        title: "Rebuilt so the server decides",
        text: "The original relayed whatever a client sent, so any player could move any piece, award themselves points or declare a win from the console. The rewrite is server-authoritative: clients send intents, the server validates them, applies them and broadcasts the state, and owns the clocks and results. Every inbound payload is checked with a zod schema.",
      },
      {
        title: "One rules engine, shared",
        text: "The rules live in a single pure-TypeScript engine used by the server, the browser, the bot and the Learn page's live boards: unit-aware scoring, mandatory and backward captures, a flying dama that doubles the result. It has its own tests, and the server and two real browsers are tested on top of it.",
      },
      {
        title: "Online play without an account",
        text: "A guest is created on the first visit, and a password can be set later to sign in elsewhere. Quick matches pair players by Elo rating in three time controls; rooms are private by invite link and six-character code, or listed in the lobby, with spectators and chat. Resign, draw offers and rematches with the sides swapped are built in, and a dropped connection has 90 seconds to return.",
      },
      {
        title: "The capture ledger",
        text: "The move list is written as the equations each capture scored, with the reason when one doesn't (\"Not pesos\", \"Units differ\"). While you choose a capture, each landing square previews its score before you commit. Every finished game keeps a replay that steps through the same ledger.",
      },
      {
        title: "A title screen that plays itself",
        text: "A giant chip carries a bot-vs-bot demo game, with a menu you drive by arrow keys and Enter, and \"Play from here\" takes over the demo position against the bot. The bot has three levels and runs in a Web Worker, so thinking never freezes the page.",
      },
    ],
  },
  {
    title: "Mini Expenses Tracker",
    slug: "expense-tracker",
    kind: "personal",
    selected: false,
    role: "Personal project",
    stack: ["react", "node", "express", "mysql"],
    imageSrc: "projects/expense tracker.png",
    description:
      "A full-stack development and deployment project using MySQL, Express, React, and Node.js with CRUD functionalities. The frontend is hosted on Netlify, the backend on Render, and the database on Aiven using AWS services, all utilizing free-tier hosting solutions.",
    skills: ["Fullstack", "React", "MySQL", "Node", "Express", "RESTful API"],
    demo: "",
    source: "https://github.com/ZenDevvv/mini-expense-tracker-backend",
  },
  {
    title: "Portfolio v2",
    slug: "portfolio-v2",
    kind: "personal",
    selected: false,
    role: "Personal project",
    stack: ["react", "tailwind", "framer"],
    imageSrc: "profile.jpg",
    description:
      "My second portfolio, the one before this redesign: a single page built with React, Tailwind CSS and Framer Motion, with a dark and a light mode, an about section, skills, experience and project cards.",
    skills: ["React", "Tailwind CSS", "Framer Motion"],
    demo: "",
    source: "https://github.com/ZenDevvv/zendevvv-portfolionew",
    gallery: [
      { src: "projects/portfolio-v2/hero.webp", caption: "The hero, in dark mode", focus: 0.3, cover: true },
      { src: "projects/portfolio-v2/hero-light.webp", caption: "The hero, in light mode", focus: 0.3 },
      { src: "projects/portfolio-v2/about.webp", caption: "About me and skills", focus: 0.3 },
      { src: "projects/portfolio-v2/experience.webp", caption: "Experience", focus: 0.3 },
      { src: "projects/portfolio-v2/projects.webp", caption: "Projects" },
      { src: "projects/portfolio-v2/projects-light.webp", caption: "Projects, in light mode" },
      { src: "projects/portfolio-v2/contact.webp", caption: "Contact" },
    ],
  },
  {
    title: "Portfolio v1",
    slug: "portfolio-v1",
    kind: "personal",
    selected: false,
    role: "Personal project",
    stack: ["html", "css", "react"],
    imageSrc: "projects/oldport.jpg",
    description:
      "My first React portfolio, built using HTML, CSS, and React to showcase my projects and skills.",
    skills: ["HTML", "CSS", "ReactJS", "JSON"],
    demo: "https://zendevvv-portfolioreact.netlify.app/",
    source: "https://github.com/ZenDevvv/Frontend-project",
  },
];
