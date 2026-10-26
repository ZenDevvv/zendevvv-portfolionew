// Peck's gallery, from the app's own screenshot spec (apps/web/e2e/screenshots.spec.ts): the
// app needs Google sign-in, an API and a database, so the shots come from the spec's mocked API
// and its fake data instead (see captureFromPnpmSpec in capture-e2e.mjs). Peck is still being
// built, so these are the screens that exist now; retake after a slice lands. Used by
// scripts/capture-shots.mjs; see "Project media" in DESIGN.md.
//
// Each shot: `name` (the file name here), `file` (the spec's screen name), `caption` for the
// gallery, and optional `focus` (0 left to 1 right: where the preview crops it to portrait;
// 0.5 when left out). A shot with `phones` (three screen names, shot at phone size) shows them
// side by side on the app's background instead of a `file`. The spec's "S4 step 8" test is left out: it no longer matches the app.

export const pnpmSpec = {
  // The local clone of the Peck repo (ZenDevvv/Peck).
  app: "/home/machenike/Projects/Peck",
  web: "apps/web",
  spec: "e2e/screenshots.spec.ts",
  tests: ["built screens", "built S2 screens", "built S3 screens", "built S4 screens", "built S6 screens"],
  // The placeholder addresses the repo's CI builds with; the dead proxy blocks them anyway.
  buildEnv: {
    VITE_API_URL: "https://api.example.test",
    VITE_SUPABASE_URL: "https://example.supabase.co",
    VITE_SUPABASE_ANON_KEY: "test-anon-key",
  },
};

export const shots = [
  { name: "today", file: "apps-today", caption: "Today: follow-ups and interviews due", focus: 0.35 },
  { name: "pipeline", file: "apps-pipeline", caption: "The pipeline board", focus: 0.2 },
  { name: "paste-job", file: "add-paste-ai-notice", caption: "Paste a job link or post", focus: 0.5 },
  { name: "check-details", file: "add-check-details-read", caption: "Checking what Peck read from a job post", focus: 0.5 },
  { name: "fit", file: "app-overview-match", caption: "How you fit a job, from your own facts", focus: 0.5 },
  { name: "start", file: "onb-choose-start", caption: "Choosing how to start", focus: 0.5 },
  { name: "reading", file: "onb-reading", caption: "Reading an uploaded resume", focus: 0.5 },
  { name: "check-found", file: "onb-check-found", caption: "Checking what was found in the resume", focus: 0.5 },
  { name: "ready", file: "onb-ready-summary", caption: "Setup notes pinned as the profile fills in", focus: 0.5 },
  { name: "profile", file: "profile", caption: "Your profile: the facts Peck writes from", focus: 0.35 },
  { name: "tone", file: "preen-tone", caption: "Picking a tone", focus: 0.35 },
  { name: "result", file: "preen-result", caption: "A preened resume, every line traced to a fact", focus: 0.8 },
  { name: "crumbs", file: "preen-crumbs", caption: "Crumbs: free daily refill and what was spent", focus: 0.5 },
];

// The phone screens, three to a shot: Peck is mobile-first, so the phone is its main size.
shots.push(
  {
    name: "phone-track",
    phones: ["apps-today", "apps-pipeline", "app-overview-match"],
    caption: "On a phone: Today, the pipeline and how you fit a job",
  },
  {
    name: "phone-preen",
    phones: ["onb-choose-start", "onb-check-found", "preen-result"],
    caption: "On a phone: starting from a resume, checking what it found and the preened result",
  },
);
