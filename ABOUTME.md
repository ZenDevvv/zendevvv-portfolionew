# About Zen Andrei Obrero

The single source of truth about who Zen is: profile, experience, education, projects and tools. Anything on the site about Zen (copy, résumé, project entries) must agree with this file. When something new appears (a project, a job, a skill, a certificate), add it here in the same change.

Compiled 2026-10-26 from the résumé (`src/assets/Zen Andrei Obrero resume.pdf`), `src/assets/json/*` and the site's copy. Items marked **(unconfirmed)** still need Zen's confirmation.

## Profile

- **Name:** Zen Andrei Obrero ("Zen"; handle `ZenDevvv`)
- **Location:** Dasmariñas, Cavite, Philippines
- **Role:** Full-stack developer (React, TypeScript, Node), building multi-tenant platforms
- **Status:** Left Uzaro in Sept 2026 (confirmed); open to work (shown on the Hero and Contact sections)
- **Goal:** Working toward a senior full-stack or tech lead role
- **Working style:** Likes owning a feature end to end, from the data model to the last hover state. Uses AI tools (Claude, Codex, Gemini) to speed up scaffolding and reviews every line.

### Contact and links

- GitHub: https://github.com/ZenDevvv
- LinkedIn: https://www.linkedin.com/in/zen-andrei-obrero-6b37762b5
- Email: zenandreiobrero777@gmail.com (confirmed; the version without 777 is wrong, don't use it)
- Phone (résumé only): 09068575015
- Portfolio: https://zendevvv.netlify.app/ (this repo, `zendevvv-portfolionew`)

## Work experience

### Technology Developer, Uzaro Solutions Technology Inc.
Quezon City · Nov 2024 – Sept 2026 · full-time

- Built production React and TypeScript interfaces and a shared component library with type-safe contracts, adopted across 8+ company projects.
- Designed MongoDB/Prisma data models, reviewed teammates' PRs, and ran CI/CD on GitHub Actions with Firebase deployment. Jest unit and integration tests cut post-release bug reports by ~25%.
- Deployed several backend services to Google Cloud Platform (Cloud Run).
- Joined client-facing meetings across the whole project lifecycle: kickoff, requirements, sprint planning, sprint review/demo, UI/UX review, progress reports, UAT, go-live, handover and training.
- Delivered sprints on 6+ concurrent platform builds (IoT, LMS, HMS, HRIS, Inventory, Order Management) in Agile, using GitHub Projects and a custom-built PMS. Used AI-assisted prototyping and scaffolding (Claude Opus 5, Codex, Grok Build, Gemini 3.1 Pro).
- Integrated smart door locks, switch/outlet relays and IoT gateways through REST APIs into one React dashboard: real-time control and monitoring of 50+ endpoints, sub-500 ms latency.
- HRIS for Bandai Namco: admin, HR and employee surfaces for employee lifecycle, payroll/payslips, attendance with Hikvision biometric integration, leave/benefits, schedules and BIR reporting. React/TypeScript with a Node/Prisma API, delivered through GitOps (DEV/UAT/PROD).

### IT Intern, IPSolutions Inc.
Pasig City · Mar 2024 – May 2024

- Designed and delivered 3 responsive client-facing landing pages, including the company's main website, in HTML/CSS and Bootstrap. Each passed cross-browser QA on first review.
- Built features with the dev team following SDLC practices; first experience with Git and team delivery workflows.

## Education

- **Biliran Province State University**, Naval, Biliran: BS Computer Science, **with honors**, graduated May 2024.
- **Algolympics Champion:** 1st place, campus-wide algorithm programming contest (2nd year).
- Relevant coursework: Data Structures & Algorithms, Database Systems, Software Engineering, Object-Oriented Programming.

Certificates, trainings, high school: none recorded **(unconfirmed)**.

## Technical skills

Matches the Skills keyboard (`src/assets/json/skills.js`) and the résumé.

- **Frontend:** React, TypeScript, Next.js, Tailwind CSS, Bootstrap, HTML/CSS, Zustand, TanStack Query, Socket.io, Vite (also used: TanStack Router, React Hook Form, Framer Motion)
- **Backend:** Node.js, Express, Hono, Python (FastAPI), REST API design, JWT authentication, Zod, Typst (PDF generation)
- **Databases & ORM:** MongoDB, PostgreSQL, MySQL, Prisma ORM, Drizzle ORM, Supabase (Postgres, auth, row-level security) (also: SQLite)
- **Testing:** Jest, pytest, Playwright, Vitest
- **DevOps & deployment:** Git, GitHub, GitHub Actions (CI/CD), Google Cloud Platform (Cloud Run), Firebase Hosting, Docker
- **Languages:** TypeScript, JavaScript, Python, Java, C++, PHP (Kotlin on MediaGrab's Android app)
- **Project management:** GitHub Projects, custom PMS tool, Agile/Scrum
- **AI-augmented workflow:** Claude (Opus 5), Codex, Grok Build, Gemini 3.1 Pro, Google Stitch
- **Domain experience:** IoT smart devices, education/LMS, hotel management, manufacturing and production planning, ERP (HRIS, Inventory/GS1, Order Management, Supply Chain, Project Management)
- **Design tools** (not on the site): none recorded **(unconfirmed: Figma? editor? OS?)**

## Projects

Each project's page on the site lives at `/projects/<slug>/`; the fields are in `src/assets/json/projects.js`. `kind`: professional = work, side = paid work outside the job, personal = for fun and upskilling. Home page ("Selected works") shows those flagged `selected`.

### Professional (Uzaro Solutions)

| Project | Slug | Role | Home | Demo |
|---|---|---|---|---|
| HRIS: Human Resources Information System | `hris` | Full-stack | yes | https://hris-app-dev.web.app/ |
| OSPAR (Inventory Management System) | `ospar` | Full-stack | yes | https://ospar-app-dev.web.app/ |
| ALMA (Alternative Learning Management App) | `alma` | Frontend | yes | https://lms-app-test.site/ |

- **HRIS:** multi-tenant HR system: employee management, recruitment and applicant tracking, payroll, timekeeping, ABAC for role/department/organization-scoped access. Built for Bandai Namco (manufacturing); the résumé cites 6,000+ employee records. Stack: TypeScript, React, TanStack, Node, Express, MongoDB, Prisma.
- **OSPAR:** GS1-standard inventory system tracking item movement across organizations and departments, from internal transfers to patient usage. Delivery requests/orders/receipts, patient/supplier/product management, stock and batch tracking per department, reporting, billing and statements. Stack adds React Hook Form and Zod.
- **ALMA:** multi-tenant LMS: role-based access, course management, structured learning workflows, tenant isolation. Zen was the frontend developer (modular responsive UI, state management, API integration). Résumé figures: 3 tenants, 200+ students, 15+ instructors, 40+ classes, assessment engine, attendance and gradebook. Stack adds Cloudinary.
- Also on the résumé, not on the site: **Product and Assembly** (production planning for Bandai Namco), **Order Management / E-Commerce** (employee partnership store: buyer, vendor, admin roles), **Project Management System**, **Supply Chain Management**, and the **IoT dashboard** (50+ devices). **HMS Reservation System** is on the résumé only too: a multi-tenant hotel system with room types, dynamic pricing and the full reservation lifecycle.

### Side (paid, outside work)

| Project | Slug | Role | Home | Demo |
|---|---|---|---|---|
| AppSite Builder (ASB) | `asb` | Full-stack | yes | https://appsite-builder-cms.web.app/ |
| RYDE | `ryde` | Full-stack | no | https://ryde-luxury-web-dev.web.app/ |

- **ASB:** no-code website and landing-page builder: admin-curated templates or blank projects, visual drag-and-drop editor, auto-saved drafts, static HTML publishing, pages/sections/groups/reusable blocks, global styles, SEO metadata, RBAC, soft delete, non-destructive template forking.
- **RYDE:** luxury car rental and private chauffeur web app: pickup, meetup or home delivery, online payments through Xendit.
- Both: TypeScript, MERN, Prisma, TanStack. Client names and the side-project arrangement **(unconfirmed)**.

### Personal

| Project | Slug | Home | Demo | Source |
|---|---|---|---|---|
| Peck (in development) | `peck` | no | none (private repo) | none |
| Scidama Online | `scidama` | yes | https://scidama.onrender.com | github.com/ZenDevvv/Cyclic |
| Skypost | `apod` | no | https://zendevvv-apod.netlify.app | github.com/ZenDevvv/APOD-project |
| MediaGrab | `mediagrab` | no | none | github.com/ZenDevvv/MediaGrab |
| Blog App | `blog-app` | no | https://nlog-blog.netlify.app/ | github.com/ZenDevvv/nlog-blog |
| Mini Expenses Tracker | `expense-tracker` | no | none | github.com/ZenDevvv/mini-expense-tracker-backend |
| Portfolio v2 (the previous portfolio) | `portfolio-v2` | no | none | github.com/ZenDevvv/zendevvv-portfolionew |
| Portfolio v1 | `portfolio-v1` | no | https://zendevvv-portfolioreact.netlify.app/ | github.com/ZenDevvv/Frontend-project |

- **Scidama Online:** real-time two-player math checkers, a science variant of Damath (Filipino math checkers) where captures score only if the units still make a quantity. Rated quick match, private rooms, spectating, replays, practice. Server-authoritative with a shared rules engine, accountless online play. TypeScript, React, Node, Socket.IO, SQLite, Tailwind, Zod, Zustand, Playwright.
- **Skypost:** NASA's Astronomy Picture of the Day as a stamp collection (every day since June 1995), plus a Live section (EPIC Earth camera, ISS position and passes). Static and keyless; kept working through NASA's API move. TypeScript, React.
- **MediaGrab:** self-hosted media downloader for 1,750+ sites (trim, then MP4/MP3/SRT). Runs as a hosted web app on a Linux VM, a Windows/Linux desktop app and an Android app. Python/FastAPI, JavaScript, Kotlin.
- **Blog App:** full-stack blog with JWT auth and CRUD. React, Node, Express, MySQL.
- **Mini Expenses Tracker:** full-stack CRUD app on free tiers: Netlify (frontend), Render (backend), Aiven/AWS (database). MySQL, Express, React, Node.
- **Portfolio v2 / v1:** earlier portfolios (React, Tailwind, Framer Motion / HTML, CSS, React). The current site is the third.
- **Peck** (in development, private repo `ZenDevvv/Peck`, on the all-projects page with a 15-shot gallery (two are phone composites) from the app's mocked screenshot spec): job application tracker as a mobile-first PWA with an AI resume builder, for Philippine job seekers. Tracking is free; AI features cost "crumbs" (credits), and tailoring a resume is "preening". Stack: React 19, Vite, TypeScript, TanStack Router and Query, Hono, Drizzle ORM, Zod, PostgreSQL on Supabase with row-level security, Typst; tested with Vitest and Playwright (axe checks). Built so far: tracker (workspaces, pipeline, Today, agenda), job reading from pasted links or posts, onboarding with resume upload, profile of confirmed facts, Preen (fit check, gap questions, tone, length, ATS-checked PDF), crumbs ledger. Facts-only pipeline: an LLM fills fixed slots from user-confirmed facts, code assembles the document, and a custom validator rejects any line not traceable to a fact (1,630 of 1,630 injected mutants caught). Append-only credit ledger with automatic refunds, AI spend breaker and kill switch, SSRF-safe job-post fetcher, per-user envelope encryption of stored personal data, a 170 KB bundle budget in CI. Not built yet: admin console, cover letter (in progress), GCP staging deploy (parked). Demo: none yet.

## Keeping this file current

- New project, job, education, skill, certificate or link: add it here in the same change as the site edit.
- Résumé text, `experiences.json`, `skills.js`, `projects.js` and the About copy must not contradict this file. If they do, fix whichever is wrong and say which.
