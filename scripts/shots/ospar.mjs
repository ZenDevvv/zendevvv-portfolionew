// OSPAR's gallery, from the app's own mocked end-to-end tests: the app only works behind a
// login with its API and database, and the repo's data dumps hold real records, so the shots
// come from the tests' fake data instead (see capture-e2e.mjs). Used by
// scripts/capture-shots.mjs; see "Project media" in DESIGN.md.
//
// Each shot: `name` (the file name), `test` (the exact title of the test whose final screen it
// is), `caption` for the gallery, and optional `focus` (0 left to 1 right: where the preview
// crops it to portrait; 0.5 when left out). Pick tests that end on loaded content: one that
// ends mid-navigation or mid-export leaves a skeleton or a blank page.

export const e2e = {
  // The frontend in the local clone of the OSPAR repo (ospar-inventory/ospar-inventory-system).
  app: "/home/machenike/Projects/UZARO/ospar-inventory-system/ims-app",
  // The API calls are mocked by the tests; the app only needs a base path for them.
  env: { VITE_BASE_URL: "/api" },
  // Tests that need a live server or real files.
  ignore: ["**/*.live.spec.ts", "**/pwa-offline*.spec.ts", "**/data-migration.spec.ts"],
};

export const shots = [
  {
    name: "dashboard",
    test: "renders the RSG admin dashboard with real data and updates the selected period",
    caption: "Management dashboard",
    cover: true,
    focus: 0,
  },
  {
    name: "product",
    test: "back from product detail after closing edit modal does not reopen edit state",
    caption: "A product's stock overview and batches",
    focus: 0.25,
  },
  {
    name: "stock-movements",
    test: "shows combined type and subtype labels on inventory movement rows",
    caption: "Stock movement history",
    focus: 0.25,
  },
  {
    name: "transaction",
    test: "requests paginated product movement history, supports next page, and opens transaction details",
    caption: "A stock movement's transaction details",
    focus: 0.1,
  },
  {
    name: "delivery-requests",
    test: "shows incoming and outgoing tabs on delivery requests",
    caption: "Delivery requests between departments",
    focus: 0.25,
  },
  {
    name: "delivery-orders",
    test: "shows with-request and without-request tabs on delivery orders",
    caption: "Delivery orders",
    focus: 0.25,
  },
  {
    name: "stock-in",
    test: "stock-in create keeps one active item form and shows committed items in newest-first rows",
    caption: "Receiving stock from a supplier",
    focus: 0.25,
  },
  {
    name: "report",
    test: "uses billing parity rows/count in inventory movement by product when parity data is available",
    caption: "Inventory movement report by product",
    focus: 0.25,
  },
  {
    name: "variance",
    test: "renders the cleaned variance header, compact stats, and no resolve-lots action",
    caption: "Reconciling a stock count",
    focus: 0.25,
  },
  {
    name: "patients",
    test: "keeps patient stats based on the full dataset on page 2",
    caption: "Patient management",
    focus: 0.25,
  },
  {
    name: "billing",
    test: "shows DRE and return receipt links on billing credit details",
    caption: "A billing record and its reference trail",
    focus: 0.25,
  },
  {
    name: "receipt",
    test: "shows PRS DRE detail parity actions and document routes",
    caption: "A printable return receipt",
    focus: 0.65,
  },
  {
    name: "statement",
    test: "opens soa transactions from detail and uploads an or payment",
    caption: "A statement of account and its payments",
    focus: 0.25,
  },
];
