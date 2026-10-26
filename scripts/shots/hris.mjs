// The Human Resources Information System's gallery, from the app's own mocked smoke tests:
// the app only works behind a login with its API and database, so the shots come from the
// tests' fake data instead (see capture-e2e.mjs). Used by scripts/capture-shots.mjs; see
// "Project media" in DESIGN.md.
//
// Each shot: `name` (the file name), `test` (the exact title of the test whose final screen it
// is), `caption` for the gallery, and optional `focus` (0 left to 1 right: where the preview
// crops it to portrait; 0.5 when left out). Pick tests that end on loaded content.

export const e2e = {
  // The frontend in the local clone of the bandai-infra repo
  // (hrisworkforcesystem-coder/bandai-infra). Its `app/` folder is only a health-check server.
  app: "/home/machenike/Projects/UZARO/bandai-infra/hris-app",
  testDir: "./tests/smoke",
  // The npm `dev` script already passes --host, and a second --host breaks react-router dev.
  devCommand: "npx react-router dev --host 127.0.0.1 --port 4173",
  env: { VITE_API_BASE_URL: "http://127.0.0.1:4173/api", VITE_AUTH_TOKEN_STORAGE_ENABLED: "true" },
  // Tests that sign in to real servers (dev, UAT, production) or need live devices.
  ignore: ["**/*live*.spec.ts", "**/*prove*.spec.ts", "**/*probe*.spec.ts", "**/multi-env-login-matrix.spec.ts"],
};

export const shots = [
  {
    name: "sign-in",
    // Fails at sign-in without a backend, so its last screen is the sign-in page.
    test: "agency sidebar navigates dedicated pages and dashboard charts render",
    caption: "Sign-in",
    cover: true,
    focus: 0,
  },
  {
    name: "dashboard",
    test: "employee notifications badge and dropdown route time adjustment and overtime requests to the employee request hub",
    caption: "An employee's dashboard",
    focus: 0.2,
  },
  {
    name: "notifications",
    test: "employee timesheet notifications open the attendance timesheet view from the shared feed",
    caption: "Notifications for requests and approvals",
    focus: 0.2,
  },
  {
    name: "departments",
    test: "admin departments configuration searches and filters through server query params",
    caption: "Departments, in the admin configuration",
    focus: 0.35,
  },
  {
    name: "sections",
    test: "admin sections screen shows line leaders column and edit modal chips",
    caption: "Sections and their line leaders",
    focus: 0.35,
  },
  {
    name: "devices",
    test: "devices table shows Online/Offline status from health checks",
    caption: "Biometric devices and their status",
    focus: 0.35,
  },
  {
    name: "device-events",
    test: "admin device events labels sync signals without implying person resolution",
    caption: "Events from the biometric devices",
    focus: 0.3,
  },
  {
    name: "device-event",
    test: "admin device events keeps plain device user id separate from padded employee code",
    caption: "A device event matched to an employee",
  },
  {
    name: "sync-logs",
    test: "sync logs compact table: every event is one line with short category token",
    caption: "Syncing attendance logs from a device",
    focus: 0.15,
  },
  {
    name: "csv-import",
    test: "drag-drop surface + job progress bar with weights",
    caption: "Importing device users from a CSV",
  },
  {
    name: "sync-center",
    test: "Device Users summary toolbar keeps title and Sync status aligned",
    caption: "Sync Center: device users across terminals",
  },
  {
    name: "job-application",
    test: "public jobs flow preserves existing query params and reaches the apply page",
    caption: "A public job application",
  },
];
