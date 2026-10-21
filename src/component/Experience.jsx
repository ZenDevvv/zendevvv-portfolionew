import { motion as m } from "framer-motion";
import { LuArrowUpRight } from "react-icons/lu";
import experiences from "../assets/json/experiences.json";
import resume from "../assets/Zen Andrei Obrero resume.pdf";
import uzaroLogo from "../assets/uzarologo.png";

const ease = [0.22, 1, 0.36, 1];
const logos = { "Uzaro Solutions Technology Inc.": uzaroLogo };
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

// "2024-11" as a year and a 0-based month; no date means the role is ongoing.
function toMonth(date) {
  if (!date) {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  }
  const [year, month] = date.split("-").map(Number);
  return { year, month: month - 1 };
}

// "Nov 2024 – Sept 2026", or "Mar – May 2024" when both ends fall in the same year.
function formatPeriod(start, end, ongoing) {
  const from = `${months[start.month]} ${start.year}`;
  if (ongoing) return `${from} – Present`;
  const to = `${months[end.month]} ${end.year}`;
  return start.year === end.year ? `${months[start.month]} – ${to}` : `${from} – ${to}`;
}

// Counted the way LinkedIn counts, both end months included: March to May is 3 mos.
function formatLength(start, end) {
  const total = (end.year - start.year) * 12 + end.month - start.month + 1;
  const years = Math.floor(total / 12);
  const rest = total % 12;
  return [
    years && `${years} ${years === 1 ? "yr" : "yrs"}`,
    rest && `${rest} ${rest === 1 ? "mo" : "mos"}`,
  ]
    .filter(Boolean)
    .join(" ");
}

const escapePattern = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Sets the phrases worth skimming for in ink, the way the hero sets "fullstack developer".
function Emphasis({ text, phrases = [] }) {
  if (!phrases.length) return text;
  const parts = text.split(new RegExp(`(${phrases.map(escapePattern).join("|")})`));
  return parts.map((part, index) =>
    index % 2 ? (
      <span key={index} className="font-medium text-lightModeTextT dark:text-darkModeTextT">
        {part}
      </span>
    ) : (
      part
    )
  );
}

const rise = {
  hidden: { opacity: 0, y: 20 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const cascade = (gap) => ({ hidden: {}, shown: { transition: { staggerChildren: gap } } });

// Each stop plays once as it scrolls in: the dot appears, the role slides up out of a
// mask like the hero's name, the details follow, and the line draws down to the next stop.
// Under reduced motion MotionConfig skips the moves and keeps only the fades.
const slideUp = {
  hidden: { y: "110%" },
  shown: { y: "0%", transition: { duration: 0.8, ease } },
};
const dotIn = {
  hidden: { opacity: 0, scale: 0.5 },
  shown: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } },
};
const lineIn = {
  hidden: { scaleY: 0 },
  // ease-in-out: the line travels on screen rather than arriving, so it accelerates away
  // from the dot and settles into the next one.
  shown: { scaleY: 1, transition: { duration: 1.4, ease: [0.77, 0, 0.175, 1], delay: 0.3 } },
};
const dashIn = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: 0.6, ease } },
};

function Stop({ company, location, position, start, end, highlights, tasks, last }) {
  const from = toMonth(start);
  const to = toMonth(end);
  const logo = logos[company];

  return (
    // --dot-y is the middle of the role's first line: the date's line, the gap below it,
    // then half of the role's line height (leading-tight is 1.25).
    <m.li
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={{ hidden: {}, shown: {} }}
      className={`relative grid grid-cols-[0.5rem_1fr] gap-x-5 [--dot-y:calc(1.25rem_+_0.5rem_+_var(--role)*0.625)] [--role:clamp(1.375rem,1.1rem+0.8vw,1.75rem)] md:gap-x-7 ${last ? "" : "pb-16 md:pb-20"}`}
    >
      {/* A dot beside each role, joined to the next one by a plain line */}
      {!last && (
        <span
          aria-hidden="true"
          className="absolute bottom-[calc(var(--dot-y)*-1)] left-[calc(0.25rem_-_0.75px)] top-[var(--dot-y)] w-[1.5px]"
        >
          <m.span
            variants={lineIn}
            className="absolute inset-0 origin-top bg-lightModeTextP/30 dark:bg-darkModeTextP/30"
          />
        </span>
      )}
      <m.span
        aria-hidden="true"
        variants={dotIn}
        className="relative mt-[calc(var(--dot-y)_-_0.25rem)] h-2 w-2 rounded-full bg-lightModeTextT dark:bg-darkModeTextT"
      />

      <m.div variants={cascade(0.07)} className="min-w-0">
        <m.p
          variants={rise}
          className="flex flex-wrap items-center gap-x-2 text-[13px] leading-5 text-lightModeTextP dark:text-darkModeTextP"
        >
          <span>{formatPeriod(from, to, !end)}</span>
          <span aria-hidden="true">·</span>
          <span>{formatLength(from, to)}</span>
        </m.p>

        <h3 className="mt-2 overflow-hidden pb-[0.06em] text-[length:var(--role)] font-semibold leading-tight tracking-[-0.025em] text-lightModeTextT dark:text-darkModeTextT">
          <m.span variants={slideUp} className="block">
            {position}
          </m.span>
        </h3>
        <m.p
          variants={rise}
          className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[15px] text-lightModeTextP dark:text-darkModeTextP"
        >
          <span className="flex items-center gap-2">
            {logo && <img src={logo} alt="" className="h-4 w-4 shrink-0" />}
            {company}
          </span>
          {/* On phones the city takes its own line rather than leaving a dot at a line end */}
          <span aria-hidden="true" className="hidden sm:inline">
            ·
          </span>
          <span className="w-full sm:w-auto">{location}</span>
        </m.p>

        <m.ul variants={cascade(0.08)} className="mt-6 max-w-[36rem] space-y-3.5 md:mt-7">
          {tasks.map((task) => (
            <m.li
              key={task}
              variants={rise}
              className="flex gap-3.5 text-[15px] leading-relaxed text-lightModeTextP dark:text-darkModeTextP md:text-base"
            >
              <m.span
                aria-hidden="true"
                variants={dashIn}
                className="mt-[0.8em] h-[1.5px] w-2.5 shrink-0 origin-left rounded-full bg-lightModeTextP/50 dark:bg-darkModeTextP/50"
              />
              <span>
                <Emphasis text={task} phrases={highlights} />
              </span>
            </m.li>
          ))}
        </m.ul>
      </m.div>
    </m.li>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="bg-lightBG py-28 dark:bg-darkBG md:py-36 lg:py-44"
    >
      <div className="mx-auto grid max-w-[66rem] gap-y-14 px-5 md:px-10 lg:grid-cols-12 lg:gap-x-10">
        <m.header
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          variants={cascade(0.08)}
          className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start"
        >
          <h2
            id="experience-title"
            className="text-[clamp(2rem,1rem+2.2vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-lightModeTextT dark:text-darkModeTextT"
          >
            <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              <m.span
                variants={{
                  hidden: { y: "110%" },
                  shown: { y: "0%", transition: { duration: 0.8, ease } },
                }}
                className="inline-block"
              >
                Experience
              </m.span>
            </span>
          </h2>
          <m.p
            variants={rise}
            className="mt-4 max-w-[21rem] text-pretty text-[15px] leading-relaxed text-lightModeTextP dark:text-darkModeTextP md:text-base"
          >
            Where I&apos;ve worked, and what I built there.
          </m.p>
          <m.a
            variants={rise}
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-1 rounded-sm text-[13px] font-medium text-lightModeTextT outline-none focus-visible:ring-2 focus-visible:ring-lightAccent dark:text-darkModeTextT dark:focus-visible:ring-darkAccent"
          >
            Full résumé
            <LuArrowUpRight className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </m.a>
        </m.header>

        <ol className="lg:col-span-8">
          {experiences.map((experience, index) => (
            <Stop
              key={`${experience.company}-${experience.start}`}
              {...experience}
              last={index === experiences.length - 1}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
