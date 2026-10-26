import { useRef, useState } from "react";
import { motion as m } from "framer-motion";
import { LuArrowDown, LuArrowLeft, LuArrowUpRight, LuLayoutGrid, LuLayoutList } from "react-icons/lu";
import projects from "../assets/json/projects.js";
import { projectPath } from "../utils";
import { coverOf } from "../gallery";
import { useEasedSticky } from "../scrollCurve";
import Stack from "./ProjectStack";
import Footer from "./Footer";
import ProjectCover from "./ProjectCover";

const ease = [0.22, 1, 0.36, 1];

const rise = {
  hidden: { opacity: 0, y: 20 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const cascade = (gap) => ({ hidden: {}, shown: { transition: { staggerChildren: gap } } });
const slideUp = {
  hidden: { y: "110%" },
  shown: { y: "0%", transition: { duration: 0.8, ease } },
};
// Each entry's rule draws across as it comes in; ease-in-out, like Contact's rows, because it
// travels on screen.
const ruleIn = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: 1.1, ease: [0.77, 0, 0.175, 1] } },
};
const inView = {
  initial: "hidden",
  whileInView: "shown",
  viewport: { once: true, margin: "0px 0px -12% 0px" },
};

// The page's three groups, in this order, from each project's `kind`.
const groups = [
  { id: "professional", title: "Professional", line: "Products I've built at work." },
  { id: "side", title: "Side projects", line: "Paid projects outside my job." },
  { id: "personal", title: "Personal", line: "For fun, and to learn something new." },
]
  .map((group) => ({ ...group, projects: projects.filter((project) => project.kind === group.id) }))
  .filter((group) => group.projects.length);

const focusRing =
  "rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-lightAccent dark:focus-visible:ring-darkAccent";
const sectionTitle =
  "text-[clamp(2rem,1rem+2.2vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-lightModeTextT dark:text-darkModeTextT";

// The two ways to show the groups: ruled rows (the default) or a grid of three across.
const views = [
  { id: "list", label: "List", Icon: LuLayoutList },
  { id: "grid", label: "Grid", Icon: LuLayoutGrid },
];

// The visitor's last choice, kept in localStorage under `projectsView`.
function useView() {
  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem("projectsView") === "grid" ? "grid" : "list";
    } catch {
      return "list";
    }
  });
  const choose = (next) => {
    setView(next);
    try {
      localStorage.setItem("projectsView", next);
    } catch {
      // Storage blocked: the choice lasts until the page is left.
    }
  };
  return [view, choose];
}

// List or grid: two quiet 13px buttons, the chosen one in ink with a short rule under it.
function ViewToggle({ view, onChange }) {
  return (
    <div role="group" aria-label="View" className="flex items-center gap-5">
      {views.map(({ id, label, Icon }) => {
        const active = view === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={`relative inline-flex items-center gap-1.5 py-1 text-[13px] font-medium transition-colors duration-200 ${
              active
                ? "text-lightModeTextT dark:text-darkModeTextT"
                : "text-lightModeTextP hover:text-lightModeTextT dark:text-darkModeTextP dark:hover:text-darkModeTextT"
            } ${focusRing}`}
          >
            <Icon aria-hidden="true" className="text-[1.05em]" />
            {label}
            {active && (
              <m.span
                layoutId="view-rule"
                aria-hidden="true"
                transition={{ duration: 0.35, ease }}
                className="absolute inset-x-0 -bottom-0.5 h-px bg-lightModeTextT dark:bg-darkModeTextT"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function Intro({ view, onViewChange }) {
  return (
    <section
      id="home"
      aria-labelledby="page-title"
      className="bg-lightBG pb-20 pt-10 dark:bg-darkBG md:pb-28 md:pt-32 lg:pb-32 lg:pt-36"
    >
      <m.div
        initial="hidden"
        animate="shown"
        variants={cascade(0.08)}
        className="mx-auto max-w-[66rem] px-5 md:px-10"
      >
        {/* Home, at the Selected works section, where "See all projects" lives */}
        <m.a
          variants={rise}
          href="/#projects"
          className={`group inline-flex items-center gap-1.5 text-[13px] font-medium text-lightModeTextP hover:text-lightModeTextT dark:text-darkModeTextP dark:hover:text-darkModeTextT ${focusRing}`}
        >
          <LuArrowLeft
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Home
        </m.a>

        <h1
          id="page-title"
          className="mt-10 text-[clamp(2.75rem,1.4rem+4vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-lightModeTextT dark:text-darkModeTextT md:mt-12"
        >
          <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
            <m.span variants={slideUp} className="inline-block">
              All projects
            </m.span>
          </span>
        </h1>

        {/* Jumps to each group, with its count, and the view toggle on the right */}
        <m.div
          variants={rise}
          className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-6 md:mt-12"
        >
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {groups.map(({ id, title, projects }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`group inline-flex items-center gap-2 text-[15px] font-medium text-lightModeTextT dark:text-darkModeTextT md:text-base ${focusRing}`}
                >
                  {title}
                  <span className="tabular-nums text-lightModeTextP dark:text-darkModeTextP">
                    {projects.length}
                  </span>
                  <LuArrowDown
                    aria-hidden="true"
                    className="text-[0.85em] text-lightModeTextP transition-transform duration-200 group-hover:translate-y-0.5 dark:text-darkModeTextP"
                  />
                </a>
              </li>
            ))}
          </ul>
          <ViewToggle view={view} onChange={onViewChange} />
        </m.div>
      </m.div>
    </section>
  );
}

// A project's picture: the preview of its screenshots, or else its square logo on a
// dark mat, which keeps the white ones (RYDE) visible in light mode. The same as on the home
// page's slides. It repeats the title's link for the mouse; keyboards and screen readers use
// the title.
function Picture({ href, shots, imageSrc }) {
  return (
    <a
      href={href}
      tabIndex={-1}
      aria-hidden="true"
      className={`block aspect-[4/5] overflow-hidden ${shots.length ? "bg-secondaryLightBG" : "bg-lightModeTextT"} dark:bg-secondaryDarkBG`}
    >
      <ProjectCover shots={shots} imageSrc={imageSrc} />
    </a>
  );
}

// One project: a rule across the top, the picture taking half the row, then title, role and
// source link, the first five lines of the description and the stack. Phones put the picture
// full width above the rest. The title and the picture open the project's own page, which
// has the whole description.
function Entry({ project, last }) {
  const { title, description, source, role, stack = [], imageSrc } = project;
  const href = projectPath(project);
  const rule = "absolute inset-x-0 h-px origin-left bg-lightShade dark:bg-darkShade";

  return (
    <m.li {...inView} variants={cascade(0.08)} className="relative">
      <m.span aria-hidden="true" variants={ruleIn} className={`${rule} top-0`} />
      <article className="grid gap-y-6 py-10 sm:grid-cols-2 sm:grid-rows-[auto_1fr] sm:gap-x-8 md:py-12">
        <m.div variants={rise} className="sm:row-span-2">
          <Picture href={href} shots={coverOf(project)} imageSrc={imageSrc} />
        </m.div>

        <m.div variants={rise} className="min-w-0">
          <h3 className="text-[clamp(1.375rem,1.1rem+0.8vw,1.75rem)] font-semibold leading-tight tracking-[-0.025em] text-lightModeTextT dark:text-darkModeTextT">
            <a href={href} className={focusRing}>
              {title}
            </a>
          </h3>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[15px] text-lightModeTextP dark:text-darkModeTextP">
            <span>{role}</span>
            {source && (
              <>
                <span aria-hidden="true">·</span>
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Source code for ${title}`}
                  className={`group inline-flex items-center gap-0.5 font-medium text-lightModeTextT dark:text-darkModeTextT ${focusRing}`}
                >
                  Source
                  <LuArrowUpRight
                    aria-hidden="true"
                    className="text-[0.85em] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </>
            )}
          </p>
        </m.div>

        <m.div variants={rise} className="min-w-0 sm:col-start-2">
          <p className="line-clamp-5 max-w-[36rem] text-pretty text-[15px] leading-relaxed text-lightModeTextP dark:text-darkModeTextP md:text-base">
            {description}
          </p>
          <div className="mt-7">
            <Stack names={stack} project={title} />
          </div>
        </m.div>
      </article>
      {last && <m.span aria-hidden="true" variants={ruleIn} className={`${rule} bottom-0`} />}
    </m.li>
  );
}

// A group in the site's two-column pattern: its heading pins beside the list on wide screens,
// easing in and out of the pin like the Experience heading.
function Group({ id, title, line, projects }) {
  const headerRef = useRef(null);
  useEasedSticky(headerRef);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-12 bg-lightBG pb-28 dark:bg-darkBG md:scroll-mt-20 md:pb-36 lg:scroll-mt-28 lg:pb-44"
    >
      <div className="mx-auto grid max-w-[66rem] gap-y-8 px-5 md:px-10 lg:grid-cols-12 lg:gap-x-10">
        <m.header
          ref={headerRef}
          {...inView}
          variants={cascade(0.08)}
          className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start"
        >
          <h2 id={`${id}-title`} className={sectionTitle}>
            <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              <m.span variants={slideUp} className="inline-block">
                {title}
              </m.span>
            </span>
            <m.span
              variants={rise}
              className="ml-2 inline-block align-top text-[13px] font-medium tabular-nums tracking-normal text-lightModeTextP dark:text-darkModeTextP"
            >
              {projects.length}
              <span className="sr-only"> projects</span>
            </m.span>
          </h2>
          <m.p
            variants={rise}
            className="mt-4 max-w-[21rem] text-pretty text-[15px] leading-relaxed text-lightModeTextP dark:text-darkModeTextP md:text-base"
          >
            {line}
          </m.p>
        </m.header>

        <ol className="lg:col-span-8">
          {projects.map((project, index) => (
            <Entry key={project.title} project={project} last={index === projects.length - 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}

// One project in the grid: the picture, then title and role under it, no frame. A row's
// tiles rise in a beat apart, like the project page's gallery.
function Tile({ project, index }) {
  const { title, role, imageSrc } = project;
  const href = projectPath(project);
  const stagger = {
    hidden: rise.hidden,
    shown: { ...rise.shown, transition: { ...rise.shown.transition, delay: (index % 3) * 0.06 } },
  };

  return (
    <m.li {...inView} variants={stagger} className="group min-w-0">
      <article>
        <Picture href={href} shots={coverOf(project)} imageSrc={imageSrc} />
        <h3 className="mt-3 text-[15px] font-semibold leading-snug tracking-[-0.02em] sm:mt-4 sm:text-[1.125rem] text-lightModeTextT dark:text-darkModeTextT md:text-[1.25rem]">
          <a href={href} className={focusRing}>
            {title}
          </a>
        </h3>
        <p className="mt-1 text-[13px] text-lightModeTextP dark:text-darkModeTextP">{role}</p>
      </article>
    </m.li>
  );
}

// A group in grid view: the heading above, not pinned, so the grid has the full width for
// three across (two on phones and small tablets).
function GridGroup({ id, title, line, projects }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-12 bg-lightBG pb-28 dark:bg-darkBG md:scroll-mt-20 md:pb-36 lg:scroll-mt-28 lg:pb-44"
    >
      <div className="mx-auto max-w-[66rem] px-5 md:px-10">
        <m.header {...inView} variants={cascade(0.08)}>
          <h2 id={`${id}-title`} className={sectionTitle}>
            <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              <m.span variants={slideUp} className="inline-block">
                {title}
              </m.span>
            </span>
            <m.span
              variants={rise}
              className="ml-2 inline-block align-top text-[13px] font-medium tabular-nums tracking-normal text-lightModeTextP dark:text-darkModeTextP"
            >
              {projects.length}
              <span className="sr-only"> projects</span>
            </m.span>
          </h2>
          <m.p
            variants={rise}
            className="mt-4 max-w-[21rem] text-pretty text-[15px] leading-relaxed text-lightModeTextP dark:text-darkModeTextP md:text-base"
          >
            {line}
          </m.p>
        </m.header>

        <ol className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:mt-12 md:grid-cols-3 md:gap-y-12">
          {projects.map((project, index) => (
            <Tile key={project.title} project={project} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}

// The all-projects page (/projects/): every project in projects.js, professional, then side
// projects, then personal, as ruled rows or as a grid.
export default function AllProjects() {
  const [view, setView] = useView();
  const GroupView = view === "grid" ? GridGroup : Group;

  return (
    <>
      <Intro view={view} onViewChange={setView} />
      {groups.map((group) => (
        <GroupView key={`${view}-${group.id}`} {...group} />
      ))}
      <Footer />
    </>
  );
}
