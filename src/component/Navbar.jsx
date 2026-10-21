import { useEffect, useState } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import {
  LuBriefcase,
  LuFileText,
  LuFolderGit2,
  LuLayers,
  LuMail,
  LuMoon,
  LuSun,
  LuUser,
} from "react-icons/lu";
import resume from "../assets/Zen Obrero RESUME.pdf";

const navItems = [
  { id: "about", name: "About me", Icon: LuUser },
  { id: "skills", name: "Skills", Icon: LuLayers },
  { id: "experience", name: "Experience", Icon: LuBriefcase },
  { id: "projects", name: "Projects", Icon: LuFolderGit2 },
  { id: "contact", name: "Contact", Icon: LuMail },
];

const ease = [0.22, 1, 0.36, 1];
const indicatorSpring = { type: "spring", stiffness: 500, damping: 40 };

// The section crossing the middle of the screen is the active one ("home" = hero).
function useActiveSection() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = ["home", ...navItems.map((item) => item.id)]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

// A run of letters that opens to its natural width and fades its letters in one by
// one, or closes back to nothing. Opening waits `delay` seconds.
const lettersWidth = {
  open: (delay) => ({ width: "auto", transition: { duration: 0.55, ease, delay } }),
  closed: { width: 0, transition: { duration: 0.45, ease } },
};
const letter = {
  open: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.3, ease, delay: 0.05 + i * 0.035 } }),
  closed: { opacity: 0, y: 4, transition: { duration: 0.15, ease: "easeIn" } },
};

function Letters({ show, text, delay = 0 }) {
  return (
    <m.span
      initial={false}
      animate={show ? "open" : "closed"}
      variants={lettersWidth}
      custom={delay}
      className="inline-flex overflow-hidden whitespace-nowrap"
    >
      {[...text].map((char, index) => (
        <m.span key={index} variants={letter} custom={index} className="inline-block">
          {char}
        </m.span>
      ))}
    </m.span>
  );
}

// "<Zd/>" spells itself out to "<ZenDevvv/>" while `expanded`: the "d" fades out as
// "enDevvv" cascades in, and the brackets glide apart with the growing width.
export function Wordmark({ expanded = false, className = "" }) {
  return (
    <a
      href="#home"
      aria-label="Zen Andrei Obrero, back to top"
      className={`group relative flex items-center text-sm font-semibold tracking-tight text-lightModeTextT dark:text-darkModeTextT ${className}`}
    >
      <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
        {"<"}
      </span>
      <span>Z</span>
      <Letters show={!expanded} text="d" delay={0.15} />
      <Letters show={expanded} text="enDevvv" />
      <span className="transition-transform duration-200 group-hover:translate-x-0.5">
        {"/>"}
      </span>
    </a>
  );
}

// Labels are hidden while the rail is narrow and slide in when it expands.
function RailLabel({ index, children }) {
  return (
    <span
      style={{ transitionDelay: `${index * 15}ms` }}
      className="-translate-x-1 whitespace-nowrap opacity-0 transition duration-200 ease-out group-hover/rail:translate-x-0 group-hover/rail:opacity-100 group-has-[:focus-visible]/rail:translate-x-0 group-has-[:focus-visible]/rail:opacity-100"
    >
      {children}
    </span>
  );
}

const railItemClass =
  "mx-2 flex h-9 items-center gap-3 rounded-lg px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-lightAccent dark:focus-visible:ring-darkAccent";
const railIdle =
  "text-lightModeTextP hover:text-lightModeTextT dark:text-darkModeTextP dark:hover:text-darkModeTextT";
const railActive = "text-lightAccent dark:text-darkAccent";

const dockItemClass =
  "relative grid h-10 w-10 place-items-center rounded-full text-lightBG/70 outline-none focus-visible:ring-2 focus-visible:ring-lightAccent dark:text-darkModeTextP dark:focus-visible:ring-darkAccent";

function ThemeIcon({ isDarkMode, className }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.span
        key={isDarkMode ? "sun" : "moon"}
        initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative grid shrink-0 place-items-center"
      >
        {isDarkMode ? <LuSun className={className} /> : <LuMoon className={className} />}
      </m.span>
    </AnimatePresence>
  );
}

export default function Navbar({ isDarkMode, setIsDarkMode }) {
  const active = useActiveSection();
  const themeLabel = isDarkMode ? "Light mode" : "Dark mode";
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <>
      {/* Desktop: the wordmark pinned top-left */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="fixed left-6 top-6 z-30 hidden md:block"
      >
        <Wordmark expanded={active !== "home"} />
      </m.div>

      {/* Desktop: a compact icon menu on the left edge, only as tall as its items,
          that reveals its labels on hover or keyboard focus */}
      <div className="pointer-events-none fixed inset-y-0 left-0 z-30 hidden items-center md:flex">
        <m.nav
          aria-label="Sections"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.15 }}
          className="group/rail pointer-events-auto flex w-16 flex-col overflow-hidden py-2 transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] has-[:focus-visible]:w-52 hover:w-52"
        >
          {navItems.map(({ id, name, Icon }, index) => (
            <a
              key={id}
              href={`#${id}`}
              aria-label={name}
              aria-current={active === id ? "location" : undefined}
              className={`${railItemClass} ${active === id ? railActive : railIdle}`}
            >
              <Icon className="shrink-0 text-base" />
              <RailLabel index={index}>{name}</RailLabel>
            </a>
          ))}

          <span aria-hidden="true" className="mx-4 my-3 h-px bg-lightShade dark:bg-darkShade" />

          <a
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Résumé (PDF)"
            className={`${railItemClass} ${railIdle}`}
          >
            <LuFileText className="shrink-0 text-base" />
            <RailLabel index={navItems.length}>Résumé</RailLabel>
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={themeLabel}
            className={`${railItemClass} ${railIdle}`}
          >
            <ThemeIcon isDarkMode={isDarkMode} className="text-base" />
            <RailLabel index={navItems.length + 1}>{themeLabel}</RailLabel>
          </button>
        </m.nav>
      </div>

      {/* Phone: the same icons as a dock at the bottom of the screen */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
        <m.nav
          aria-label="Sections"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          className="pointer-events-auto flex items-center gap-0.5 rounded-full bg-lightModeTextT p-1 shadow-[0_10px_30px_-10px_rgba(28,27,24,0.45)] dark:bg-secondaryDarkBG"
        >
          {navItems.map(({ id, name, Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-label={name}
              aria-current={active === id ? "location" : undefined}
              className={`${dockItemClass} ${
                active === id ? "!text-lightModeTextT dark:!text-darkModeTextT" : ""
              }`}
            >
              {active === id && (
                <m.span
                  layoutId="dock-active"
                  transition={indicatorSpring}
                  className="absolute inset-0 rounded-full bg-lightBG dark:bg-darkShade"
                />
              )}
              <Icon className="relative text-[17px]" />
            </a>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={themeLabel}
            className={dockItemClass}
          >
            <ThemeIcon isDarkMode={isDarkMode} className="text-[17px]" />
          </button>
        </m.nav>
      </div>
    </>
  );
}
