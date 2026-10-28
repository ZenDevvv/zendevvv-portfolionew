// The Skills keyboard: one row per group, in the order of the résumé's Technical Skills.
// name: the key's legend, kept short.
// icon: optional Simple Icons slug (search https://simpleicons.org; the slug is the file
//   name, e.g. "nextdotjs"). The logo loads from the CDN pinned in src/component/Skills.jsx,
//   so check the slug exists in that version. Leave it out where there is no logo; the key
//   then shows its name alone.
// Keys in a group go from the highest rating to the lowest (the page sorts them too, so a changed
//   rating still lands in place).
// rating: 1 (lowest) to 5 (highest), how well Zen knows it from the work behind it. The key
//   shows it as stars while hovered.
// color: the logo's brand colour, the hex on its simpleicons.org page. The logo is ink at
//   rest and lights up in this colour while its key is hovered, pressed or found by typing.
export default [
  {
    group: "Frontend",
    keys: [
      { name: "React", icon: "react", color: "#61DAFB", rating: 5 },
      { name: "TypeScript", icon: "typescript", color: "#3178C6", rating: 5 },
      {
        name: "Tailwind CSS",
        icon: "tailwindcss",
        color: "#06B6D4",
        rating: 5,
      },
      { name: "HTML/CSS", icon: "html5", color: "#E34F26", rating: 5 },
      { name: "Vite", icon: "vite", color: "#9135FF", rating: 5 },
      { name: "TanStack Query", icon: "tanstack", color: "#ECE8D1", rating: 4 },
      { name: "React Native", icon: "react", color: "#61DAFB", rating: 4 },
      { name: "Expo", icon: "expo", color: "#1C2024", rating: 4 },
      { name: "Next.js", icon: "nextdotjs", color: "#000000", rating: 3 },
      { name: "Bootstrap", icon: "bootstrap", color: "#7952B3", rating: 3 },
      { name: "Zustand", rating: 3 },
      { name: "Socket.io", icon: "socketdotio", color: "#010101", rating: 3 },
    ],
  },
  {
    group: "Backend",
    keys: [
      { name: "Node.js", icon: "nodedotjs", color: "#5FA04E", rating: 5 },
      { name: "Express", icon: "express", color: "#0A0A0A", rating: 5 },
      { name: "REST APIs", rating: 5 },
      { name: "JWT auth", icon: "jsonwebtokens", color: "#000000", rating: 5 },
      { name: "Zod", icon: "zod", color: "#408AFF", rating: 5 },
      { name: "FastAPI", icon: "fastapi", color: "#009688", rating: 3 },
      { name: "Hono", icon: "hono", color: "#E36002", rating: 2 },
      { name: "Typst", icon: "typst", color: "#239DAD", rating: 2 },
    ],
  },
  {
    group: "Databases & ORM",
    keys: [
      { name: "MongoDB", icon: "mongodb", color: "#47A248", rating: 5 },
      { name: "PostgreSQL", icon: "postgresql", color: "#4169E1", rating: 5 },
      { name: "MySQL", icon: "mysql", color: "#4479A1", rating: 5 },
      { name: "Prisma", icon: "prisma", color: "#2D3748", rating: 5 },
      { name: "SQLite", icon: "sqlite", color: "#003B57", rating: 4 },
      { name: "Supabase", icon: "supabase", color: "#3FCF8E", rating: 3 },
      { name: "Drizzle", icon: "drizzle", color: "#C5F74F", rating: 1 },
    ],
  },
  {
    group: "Testing",
    keys: [
      { name: "Jest", icon: "jest", color: "#C21325", rating: 5 },
      { name: "Vitest", icon: "vitest", color: "#00FF74", rating: 5 },
      { name: "Playwright", rating: 4 },
      { name: "pytest", icon: "pytest", color: "#0A9EDC", rating: 2 },
    ],
  },
  {
    group: "DevOps & Deployment",
    keys: [
      { name: "Git", icon: "git", color: "#F03C2E", rating: 5 },
      { name: "GitHub", icon: "github", color: "#181717", rating: 5 },
      {
        name: "GitHub Actions",
        icon: "githubactions",
        color: "#2088FF",
        rating: 5,
      },
      { name: "Docker", icon: "docker", color: "#2496ED", rating: 5 },
      { name: "Cloud Run", icon: "googlecloud", color: "#4285F4", rating: 4 },
      { name: "Firebase", icon: "firebase", color: "#DD2C00", rating: 4 },
    ],
  },
  {
    group: "Languages",
    keys: [
      { name: "TypeScript", icon: "typescript", color: "#3178C6", rating: 5 },
      { name: "JavaScript", icon: "javascript", color: "#F7DF1E", rating: 5 },
      { name: "Python", icon: "python", color: "#3776AB", rating: 3 },
      { name: "Java", icon: "openjdk", color: "#000000", rating: 3 },
      { name: "C++", icon: "cplusplus", color: "#00599C", rating: 2 },
      { name: "PHP", icon: "php", color: "#777BB4", rating: 2 },
      { name: "Kotlin", icon: "kotlin", color: "#7F52FF", rating: 2 },
    ],
  },
  {
    group: "Project Management",
    keys: [
      { name: "GitHub Projects", icon: "github", color: "#181717", rating: 5 },
      { name: "Custom PMS", rating: 4 },
      { name: "Agile / Scrum", rating: 4 },
    ],
  },
  {
    group: "AI-Augmented Workflow",
    keys: [
      { name: "Claude", icon: "claude", color: "#D97757", rating: 5 },
      { name: "Codex", rating: 5 },
      { name: "Grok", rating: 4 },
      { name: "Gemini", icon: "googlegemini", color: "#8E75B2", rating: 4 },
      { name: "Stitch", rating: 4 },
    ],
  },
  {
    group: "On-device AI",
    keys: [
      { name: "Gemma 3", rating: 3 },
      { name: "Unsloth", rating: 3 },
      { name: "QLoRA fine-tuning", rating: 3 },
      { name: "LiteRT-LM", rating: 3 },
      {
        name: "Hugging Face",
        icon: "huggingface",
        color: "#FFD21E",
        rating: 2,
      },
    ],
  },
];
