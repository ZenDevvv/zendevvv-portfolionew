// The Skills keyboard: one row per group, in the order of the résumé's Technical Skills.
// name: the key's legend, kept short.
// icon: optional Simple Icons slug (search https://simpleicons.org; the slug is the file
//   name, e.g. "nextdotjs"). The logo loads from the CDN pinned in src/component/Skills.jsx,
//   so check the slug exists in that version. Leave it out where there is no logo; the key
//   then shows its name alone.
// color: the logo's brand colour, the hex on its simpleicons.org page. The logo is ink at
//   rest and lights up in this colour while its key is hovered, pressed or found by typing.
export default [
  {
    group: "Frontend",
    keys: [
      { name: "React", icon: "react", color: "#61DAFB" },
      { name: "TypeScript", icon: "typescript", color: "#3178C6" },
      { name: "Next.js", icon: "nextdotjs", color: "#000000" },
      { name: "Tailwind CSS", icon: "tailwindcss", color: "#06B6D4" },
      { name: "Bootstrap", icon: "bootstrap", color: "#7952B3" },
      { name: "HTML/CSS", icon: "html5", color: "#E34F26" },
      { name: "Zustand" },
      { name: "TanStack Query", icon: "tanstack", color: "#ECE8D1" },
      { name: "Socket.io", icon: "socketdotio", color: "#010101" },
      { name: "Vite", icon: "vite", color: "#9135FF" },
      { name: "React Native", icon: "react", color: "#61DAFB" },
      { name: "Expo", icon: "expo", color: "#1C2024" },
    ],
  },
  {
    group: "Backend",
    keys: [
      { name: "Node.js", icon: "nodedotjs", color: "#5FA04E" },
      { name: "Express", icon: "express", color: "#0A0A0A" },
      { name: "FastAPI", icon: "fastapi", color: "#009688" },
      { name: "REST APIs" },
      { name: "JWT auth", icon: "jsonwebtokens", color: "#000000" },
      { name: "Zod", icon: "zod", color: "#408AFF" },
      { name: "Hono", icon: "hono", color: "#E36002" },
      { name: "Typst", icon: "typst", color: "#239DAD" },
    ],
  },
  {
    group: "Databases & ORM",
    keys: [
      { name: "MongoDB", icon: "mongodb", color: "#47A248" },
      { name: "PostgreSQL", icon: "postgresql", color: "#4169E1" },
      { name: "MySQL", icon: "mysql", color: "#4479A1" },
      { name: "Prisma", icon: "prisma", color: "#2D3748" },
      { name: "Drizzle", icon: "drizzle", color: "#C5F74F" },
      { name: "Supabase", icon: "supabase", color: "#3FCF8E" },
      { name: "SQLite", icon: "sqlite", color: "#003B57" },
    ],
  },
  {
    group: "Testing",
    keys: [
      { name: "Jest", icon: "jest", color: "#C21325" },
      { name: "pytest", icon: "pytest", color: "#0A9EDC" },
      { name: "Playwright" },
      { name: "Vitest", icon: "vitest", color: "#00FF74" },
    ],
  },
  {
    group: "DevOps & Deployment",
    keys: [
      { name: "Git", icon: "git", color: "#F03C2E" },
      { name: "GitHub", icon: "github", color: "#181717" },
      { name: "GitHub Actions", icon: "githubactions", color: "#2088FF" },
      { name: "Cloud Run", icon: "googlecloud", color: "#4285F4" },
      { name: "Firebase", icon: "firebase", color: "#DD2C00" },
      { name: "Docker", icon: "docker", color: "#2496ED" },
    ],
  },
  {
    group: "Languages",
    keys: [
      { name: "TypeScript", icon: "typescript", color: "#3178C6" },
      { name: "JavaScript", icon: "javascript", color: "#F7DF1E" },
      { name: "Python", icon: "python", color: "#3776AB" },
      { name: "Java", icon: "openjdk", color: "#000000" },
      { name: "C++", icon: "cplusplus", color: "#00599C" },
      { name: "PHP", icon: "php", color: "#777BB4" },
      { name: "Kotlin", icon: "kotlin", color: "#7F52FF" },
    ],
  },
  {
    group: "Project Management",
    keys: [
      { name: "GitHub Projects", icon: "github", color: "#181717" },
      { name: "Custom PMS" },
      { name: "Agile / Scrum" },
    ],
  },
  {
    group: "AI-Augmented Workflow",
    keys: [
      { name: "Claude", icon: "claude", color: "#D97757" },
      { name: "Codex" },
      { name: "Grok" },
      { name: "Gemini", icon: "googlegemini", color: "#8E75B2" },
      { name: "Stitch" },
    ],
  },
  {
    group: "On-device AI",
    keys: [
      { name: "Gemma 3" },
      { name: "Unsloth" },
      { name: "QLoRA fine-tuning" },
      { name: "LiteRT-LM" },
      { name: "Hugging Face", icon: "huggingface", color: "#FFD21E" },
    ],
  },
];
