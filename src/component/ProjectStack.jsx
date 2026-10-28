import { useState } from "react";
import {
  SiAndroid,
  SiArgo,
  SiCloudinary,
  SiCss3,
  SiDocker,
  SiDrizzle,
  SiExpo,
  SiExpress,
  SiFastapi,
  SiFramer,
  SiGooglecloud,
  SiHono,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiKotlin,
  SiKubernetes,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiReacthookform,
  SiReactquery,
  SiRedis,
  SiSocketdotio,
  SiSqlite,
  SiSupabase,
  SiTailwindcss,
  SiTerraform,
  SiTypescript,
  SiTypst,
  SiVite,
  SiZod,
} from "react-icons/si";
import { Keycap } from "./HeroObjects";
import { soundOn } from "../sounds";
import { brandColors } from "../brandColor";
import skills from "../assets/json/skills.js";

// The names a project's `stack` can use, each shown as its logo. `color` is the logo's brand
// colour (the hex on its simpleicons.org page), which it lights up in while its key is down.
const tech = {
  typescript: { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  javascript: { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  react: { name: "React", Icon: SiReact, color: "#61DAFB" },
  tanstack: { name: "TanStack Query", Icon: SiReactquery, color: "#FF4154" },
  hookform: { name: "React Hook Form", Icon: SiReacthookform, color: "#EC5990" },
  zod: { name: "Zod", Icon: SiZod, color: "#408AFF" },
  framer: { name: "Framer Motion", Icon: SiFramer, color: "#0055FF" },
  html: { name: "HTML", Icon: SiHtml5, color: "#E34F26" },
  css: { name: "CSS", Icon: SiCss3, color: "#1572B6" },
  tailwind: { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
  node: { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
  express: { name: "Express", Icon: SiExpress, color: "#0A0A0A" },
  socketio: { name: "Socket.IO", Icon: SiSocketdotio, color: "#010101" },
  jwt: { name: "JWT", Icon: SiJsonwebtokens, color: "#000000" },
  mongodb: { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
  prisma: { name: "Prisma", Icon: SiPrisma, color: "#2D3748" },
  mysql: { name: "MySQL", Icon: SiMysql, color: "#4479A1" },
  cloudinary: { name: "Cloudinary", Icon: SiCloudinary, color: "#3448C5" },
  python: { name: "Python", Icon: SiPython, color: "#3776AB" },
  fastapi: { name: "FastAPI", Icon: SiFastapi, color: "#009688" },
  kotlin: { name: "Kotlin", Icon: SiKotlin, color: "#7F52FF" },
  android: { name: "Android", Icon: SiAndroid, color: "#34A853" },
  vite: { name: "Vite", Icon: SiVite, color: "#9135FF" },
  hono: { name: "Hono", Icon: SiHono, color: "#E36002" },
  postgres: { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
  drizzle: { name: "Drizzle ORM", Icon: SiDrizzle, color: "#C5F74F" },
  supabase: { name: "Supabase", Icon: SiSupabase, color: "#3FCF8E" },
  typst: { name: "Typst", Icon: SiTypst, color: "#239DAD" },
  expo: { name: "Expo", Icon: SiExpo, color: "#1C2024" },
  sqlite: { name: "SQLite", Icon: SiSqlite, color: "#003B57" },
  docker: { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  cloudrun: { name: "Cloud Run", Icon: SiGooglecloud, color: "#4285F4" },
  terraform: { name: "Terraform", Icon: SiTerraform, color: "#844FBA" },
  kubernetes: { name: "Kubernetes", Icon: SiKubernetes, color: "#326CE5" },
  argocd: { name: "Argo CD", Icon: SiArgo, color: "#EF7B4D" },
  redis: { name: "Redis", Icon: SiRedis, color: "#FF4438" },
};
// The rating (1-5) shown beside a tech's name comes from the Skills keyboard (`skills.js`), by
// the skill's name. `tech` names that differ from the skill's say so here; a tech with no
// skill of that name (React Hook Form, Framer Motion, Cloudinary, Android) shows no stars.
const skillName = {
  html: "HTML/CSS",
  css: "HTML/CSS",
  socketio: "Socket.io",
  jwt: "JWT auth",
  drizzle: "Drizzle",
};
const ratingByName = new Map();
for (const { keys } of skills) for (const { name, rating } of keys) if (!ratingByName.has(name)) ratingByName.set(name, rating);
const ratingOf = (key) => ratingByName.get(skillName[key] ?? tech[key].name);

// Each logo's lit colour in both themes, by stack name.
const lit = Object.fromEntries(
  Object.entries(tech).map(([key, { color }]) => [key, brandColors(color)])
);

// A project's stack as keycaps, the same keys as the hero's links, set straight in a row.
// Hovering one presses it, lights its logo, clicks like the hero's keys and names it beside
// the "Stack" label; a label above each key, as in the hero, would land on the heading or on
// the row above. Used on the home page's slides and on the all-projects page.
// `project` keeps each key's sound cooldown its own, so a quick sweep clicks every key.
export default function Stack({ names, project }) {
  const [hovered, setHovered] = useState({ title: "", rating: 0, shown: false });
  const keys = names.filter((name) => tech[name]);
  if (!keys.length) return null;

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-lightModeTextT dark:text-darkModeTextT">
        Stack
        {/* Keeps the last name while it fades out */}
        <span
          aria-hidden="true"
          className={`ml-2 font-normal text-lightModeTextP transition-opacity duration-150 dark:text-darkModeTextP ${hovered.shown ? "opacity-100" : "opacity-0"}`}
        >
          {hovered.title}
          {hovered.rating > 0 && (
            <span className="ml-2 inline-flex items-center gap-[0.12em] align-[-0.1em]">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  viewBox="0 0 24 24"
                  className={`h-[0.95em] w-[0.95em] ${star <= hovered.rating ? "fill-[#f2b01e] dark:fill-[#ffc83d]" : "fill-lightModeTextP/25 dark:fill-darkModeTextP/25"}`}
                >
                  <path d="M12 2.2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.8l1.4-6.8L2.2 9.3l6.9-.8z" />
                </svg>
              ))}
            </span>
          )}
        </span>
      </p>
      <ul className="flex flex-wrap gap-1.5 text-[13px] text-lightModeTextT dark:text-darkModeTextT">
        {keys.map((name) => {
          const { name: title, Icon } = tech[name];
          const sound = soundOn("key", `${project}:${name}`);
          return (
            <li
              key={name}
              onPointerEnter={(event) => {
                sound.onPointerEnter(event);
                if (event.pointerType === "mouse") setHovered({ title, rating: ratingOf(name) ?? 0, shown: true });
              }}
              onPointerLeave={() => setHovered((last) => ({ ...last, shown: false }))}
              onClick={sound.onClick}
              className="group cursor-pointer touch-manipulation select-none"
            >
              <Keycap Icon={Icon} color={lit[name]} />
              <span className="sr-only">{title}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
