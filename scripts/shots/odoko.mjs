// Odoko's gallery, from its design screens (docs/screens/png in the Odoko repo): the sample
// screens the app is built to, 390×844 at 2×. Odoko is an Android app with an on-device model
// and only an arm64 build, so there is no browser or emulator here to shoot it with; these are
// the designs, not captures of the built app, and the captions say so. Three screens go to a
// shot, side by side on the app's paper colour (captureFromStills in capture-e2e.mjs). Used by
// scripts/capture-shots.mjs; see "Project media" in DESIGN.md. The screens carry sample data
// only (a Honda CB500X, ₱ figures made up for the mock-ups).

export const stills = {
  // The local clone of the Odoko repo (ZenDevvv/odoko).
  dir: "/home/machenike/Projects/odoko/docs/screens/png",
};

export const shots = [
  {
    name: "visor",
    phones: ["OnbWelcome", "OnbSetup", "MainFirst"],
    caption: "Design: Visor introduces itself and downloads its model once, then works offline",
  },
  {
    name: "chat",
    phones: ["Chat", "ReceiptChat", "Voice"],
    caption: "Design: ask Visor, snap a receipt or tell it by voice, answered on the phone",
  },
  {
    name: "home",
    phones: ["Main", "AddFuel", "Service"],
    caption: "Design: Home with Visor's note, logging a fill-up and the service list",
  },
  {
    name: "numbers",
    phones: ["Stats", "Expenses", "Bikes"],
    caption: "Design: km per liter and cost per km, spending, and your bikes",
  },
  {
    name: "entries",
    phones: ["AddService", "AddExpense", "Settings"],
    caption: "Design: adding a service and an expense by hand, and Settings",
  },
];
