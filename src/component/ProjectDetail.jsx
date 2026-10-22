import { useEffect, useRef, useState } from "react";
import { motion as m } from "framer-motion";
import { LuArrowLeft, LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import projects from "../assets/json/projects.js";
import { getImageUrl, projectPath } from "../utils";
import { galleryOf } from "../gallery";
import Stack from "./ProjectStack";
import Footer from "./Footer";
import ShotViewer from "./ShotViewer";

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
// ease-in-out, like Contact's rows, because the rule travels on screen
const ruleIn = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: 1.1, ease: [0.77, 0, 0.175, 1] } },
};
const inView = {
  initial: "hidden",
  whileInView: "shown",
  viewport: { once: true, margin: "0px 0px -12% 0px" },
};

const focusRing =
  "rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-lightAccent dark:focus-visible:ring-darkAccent";
const sectionTitle =
  "text-[clamp(2rem,1rem+2.2vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-lightModeTextT dark:text-darkModeTextT";
const muted = "text-lightModeTextP dark:text-darkModeTextP";
const ink = "text-lightModeTextT dark:text-darkModeTextT";
const line = "border-lightShade dark:border-darkShade";

// The page serves every /projects/<slug>/ address (see vite.config.js and netlify.toml).
const slug = window.location.pathname.split("/").filter(Boolean)[1];
const index = projects.findIndex((project) => project.slug === slug);
const project = projects[index];

// Coming from the all-projects page, "All projects" goes back in history instead, so the
// list opens where it was left rather than at the top.
function backToProjects(event) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  let from = null;
  try {
    from = new URL(document.referrer);
  } catch {
    // no referrer
  }
  if (from?.origin === window.location.origin && from.pathname === "/projects/" && window.history.length > 1) {
    event.preventDefault();
    window.history.back();
  }
}

function BackLink() {
  return (
    <m.a
      variants={rise}
      href="/projects/"
      onClick={backToProjects}
      className={`group inline-flex items-center gap-1.5 text-[13px] font-medium ${muted} hover:text-lightModeTextT dark:hover:text-darkModeTextT ${focusRing}`}
    >
      <LuArrowLeft
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:-translate-x-0.5"
      />
      All projects
    </m.a>
  );
}

function OutLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`group inline-flex items-center gap-1 text-[15px] font-medium md:text-base ${ink} ${focusRing}`}
    >
      {children}
      <LuArrowUpRight
        aria-hidden="true"
        className="text-[0.85em] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}

// The logo and title, the description and links, and beside them the project's facts.
function Intro() {
  const { title, description, demo, source, role, kind, stack = [], imageSrc } = project;

  return (
    <section
      id="home"
      aria-labelledby="project-title"
      className="bg-lightBG pb-20 pt-10 dark:bg-darkBG md:pb-28 md:pt-32 lg:pb-32 lg:pt-36"
    >
      <m.div
        initial="hidden"
        animate="shown"
        variants={cascade(0.08)}
        className="mx-auto max-w-[66rem] px-5 md:px-10"
      >
        <BackLink />

        <div className="mt-10 grid gap-y-12 md:mt-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-7">
              {/* The logo sits on a dark mat in both modes, which keeps the white ones (RYDE)
                  visible in light mode, as on the slides */}
              <m.div
                variants={rise}
                className="aspect-square w-20 shrink-0 overflow-hidden bg-lightModeTextT dark:bg-secondaryDarkBG md:w-24"
              >
                <img src={getImageUrl(imageSrc)} alt="" className="h-full w-full object-contain" />
              </m.div>
              <h1
                id="project-title"
                className={`text-[clamp(2.25rem,1.3rem+2.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] ${ink}`}
              >
                <span className="block overflow-hidden pb-[0.06em]">
                  <m.span variants={slideUp} className="block text-balance">
                    {title}
                  </m.span>
                </span>
              </h1>
            </div>

            <m.p
              variants={rise}
              className={`mt-8 max-w-[40rem] text-pretty text-[15px] leading-relaxed md:mt-10 md:text-base ${muted}`}
            >
              {description}
            </m.p>

            {(demo || source) && (
              <m.div variants={rise} className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
                {demo && (
                  <OutLink href={demo} label={`Visit the ${title} site`}>
                    Visit site
                  </OutLink>
                )}
                {source && (
                  <OutLink href={source} label={`Source code for ${title}`}>
                    Source
                  </OutLink>
                )}
              </m.div>
            )}
          </div>

          {/* Ruled facts like Contact's rows, then the stack keys */}
          <m.div variants={rise} className="lg:col-span-4">
            <dl className={`border-b ${line}`}>
              {[
                ["Role", role],
                ["Type", kind === "professional" ? "Professional" : "Personal"],
              ].map(([label, value]) => (
                <div key={label} className={`grid grid-cols-[5rem_1fr] gap-x-4 border-t py-4 ${line}`}>
                  <dt className={`text-[13px] leading-6 ${muted}`}>{label}</dt>
                  <dd className={`text-[15px] font-medium leading-6 ${ink}`}>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              <Stack names={stack} project={title} />
            </div>
          </m.div>
        </div>
      </m.div>
    </section>
  );
}

// Every screenshot at once, in a grid: three across from `lg`, two from `sm`, one on phones.
// Each rises in as it comes into view, a beat after the one before it in its row. A click
// opens it full screen (ShotViewer); closing returns focus to the shot you ended on.
function Gallery({ shots, title }) {
  const [viewing, setViewing] = useState(null);
  const buttons = useRef([]);

  const go = (step) =>
    setViewing((index) => Math.min(Math.max(index + step, 0), shots.length - 1));
  const close = () => {
    buttons.current[viewing]?.focus({ preventScroll: true });
    setViewing(null);
  };

  return (
    <section
      aria-labelledby="gallery-title"
      className="bg-lightBG pb-28 dark:bg-darkBG md:pb-36 lg:pb-44"
    >
      <div className="mx-auto max-w-[66rem] px-5 md:px-10">
        <m.h2
          {...inView}
          variants={cascade(0.08)}
          id="gallery-title"
          className={`mb-8 md:mb-10 ${sectionTitle}`}
        >
          <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
            <m.span variants={slideUp} className="inline-block">
              Gallery
            </m.span>
          </span>
          <m.span
            variants={rise}
            className={`ml-2 inline-block align-top text-[13px] font-medium tabular-nums tracking-normal ${muted}`}
          >
            {shots.length}
            <span className="sr-only"> screenshots</span>
          </m.span>
        </m.h2>

        <ul
          aria-label={`${title} screenshots`}
          className="grid gap-x-5 gap-y-10 sm:grid-cols-2 md:gap-y-12 lg:grid-cols-3"
        >
          {shots.map(({ src, url, caption }, shot) => (
            <m.li
              key={src}
              {...inView}
              variants={{
                hidden: rise.hidden,
                shown: { ...rise.shown, transition: { ...rise.shown.transition, delay: (shot % 3) * 0.06 } },
              }}
            >
              <figure>
                <button
                  ref={(button) => (buttons.current[shot] = button)}
                  type="button"
                  onClick={() => setViewing(shot)}
                  aria-label={`${caption}, open full screen`}
                  className={`group block aspect-[16/10] w-full cursor-zoom-in overflow-hidden border bg-secondaryLightBG outline-none focus-visible:ring-2 focus-visible:ring-lightAccent dark:bg-secondaryDarkBG dark:focus-visible:ring-darkAccent ${line}`}
                >
                  <img
                    src={url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </button>
                <figcaption className={`mt-3 flex gap-3 text-[13px] leading-snug ${muted}`}>
                  <span aria-hidden="true" className="tabular-nums">
                    {String(shot + 1).padStart(2, "0")}
                  </span>
                  <span>{caption}</span>
                </figcaption>
              </figure>
            </m.li>
          ))}
        </ul>
      </div>

      <ShotViewer
        shots={shots}
        title={title}
        index={viewing}
        onGo={go}
        onClose={close}
      />
    </section>
  );
}

// The next project in projects.js order, wrapping round to the first.
function NextProject({ next }) {
  return (
    <section aria-label="Next project" className="bg-lightBG pb-28 dark:bg-darkBG md:pb-36 lg:pb-44">
      <div className="mx-auto max-w-[66rem] px-5 md:px-10">
        <m.a
          {...inView}
          variants={cascade(0.08)}
          href={projectPath(next)}
          className={`group relative block pt-8 md:pt-10 ${focusRing}`}
        >
          <m.span
            aria-hidden="true"
            variants={ruleIn}
            className="absolute inset-x-0 top-0 h-px origin-left bg-lightShade dark:bg-darkShade"
          />
          <m.span variants={rise} className={`block text-[13px] ${muted}`}>
            Next project
          </m.span>
          <m.span
            variants={rise}
            className={`mt-3 block text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] font-semibold leading-tight tracking-[-0.03em] ${ink}`}
          >
            {next.title}
            <LuArrowRight
              aria-hidden="true"
              className="ml-2 inline-block align-[-0.08em] text-[0.7em] transition-transform duration-200 group-hover:translate-x-1"
            />
          </m.span>
        </m.a>
      </div>
    </section>
  );
}

function NotFound() {
  return (
    <section
      id="home"
      aria-labelledby="project-title"
      className="bg-lightBG pb-28 pt-10 dark:bg-darkBG md:pb-36 md:pt-32 lg:pb-44 lg:pt-36"
    >
      <m.div
        initial="hidden"
        animate="shown"
        variants={cascade(0.08)}
        className="mx-auto max-w-[66rem] px-5 md:px-10"
      >
        <BackLink />
        <h1
          id="project-title"
          className={`mt-10 text-[clamp(2.25rem,1.3rem+2.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] md:mt-12 ${ink}`}
        >
          <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
            <m.span variants={slideUp} className="inline-block">
              Project not found
            </m.span>
          </span>
        </h1>
        <m.p variants={rise} className={`mt-5 text-[15px] leading-relaxed md:text-base ${muted}`}>
          There&apos;s no project at this address. Every project is on the all-projects page.
        </m.p>
      </m.div>
    </section>
  );
}

// A project's own page (/projects/<slug>/): its logo, title, description and facts, the
// screenshot gallery when it has one, and a link on to the next project.
export default function ProjectDetail() {
  useEffect(() => {
    document.title = `${project ? project.title : "Project not found"} · ZenDev Portfolio`;
  }, []);

  if (!project) {
    return (
      <>
        <NotFound />
        <Footer />
      </>
    );
  }

  // The shots whose image files exist; deleting a file drops its shot (src/gallery.js).
  const shots = galleryOf(project);

  return (
    <>
      <Intro />
      {shots.length > 0 && <Gallery shots={shots} title={project.title} />}
      <NextProject next={projects[(index + 1) % projects.length]} />
      <Footer />
    </>
  );
}
