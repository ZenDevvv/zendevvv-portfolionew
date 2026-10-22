import { useEffect, useRef, useState } from "react";
import { motion as m, useReducedMotion, useScroll } from "framer-motion";
import { LuArrowUpRight, LuCheck, LuCopy } from "react-icons/lu";
import resume from "../assets/Zen Andrei Obrero resume.pdf";
import { Keepsake, PaperPlane, Postmark, Toy } from "./HeroObjects";
import { usePointer } from "../pointer";
import { playSound } from "../sounds";

// As on the résumé.
const EMAIL = "zenandreiobrero777@gmail.com";
const PHONE = "+63 906 857 5015";
// The Philippines keeps UTC+8 all year, with no daylight saving.
const PH_OFFSET = 8 * 60;
const TIME_ZONE = "Asia/Manila";
// How long a postmark stays on the email after a copy, in ms.
const STAMP_FOR = 2600;

const links = [
  { label: "GitHub", href: "https://github.com/ZenDevvv" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/zen-andrei-obrero-6b37762b5" },
  { label: "Résumé", href: resume },
];

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const cascade = (gap) => ({ hidden: {}, shown: { transition: { staggerChildren: gap } } });
const slideUp = {
  hidden: { y: "110%" },
  shown: { y: "0%", transition: { duration: 0.8, ease } },
};
// Each row's rule draws across as the row comes in; ease-in-out, like the Experience line,
// because it travels on screen.
const ruleIn = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: 1.1, ease: [0.77, 0, 0.175, 1] } },
};

const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
});
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
});

// The time now, updated as each minute turns over.
function useMinute() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer;
    const next = () => {
      timer = setTimeout(() => {
        setNow(new Date());
        next();
      }, 60000 - (Date.now() % 60000) + 20);
    };
    next();
    return () => clearTimeout(timer);
  }, []);

  return now;
}

// How far the Philippines is ahead of or behind the visitor: "6 hours ahead of you".
function timeDifference(now) {
  const minutes = PH_OFFSET + now.getTimezoneOffset();
  if (!minutes) return "Same time as you";
  const hours = Math.abs(minutes) / 60;
  const span = Number.isInteger(hours)
    ? `${hours} ${hours === 1 ? "hour" : "hours"}`
    : `${Math.floor(hours)}h ${Math.abs(minutes) % 60}m`;
  return `${span} ${minutes > 0 ? "ahead of" : "behind"} you`;
}

// A small line-art clock showing the time in the Philippines.
function Clock({ now }) {
  const minutes = (now.getUTCHours() * 60 + now.getUTCMinutes() + PH_OFFSET) % 1440;
  const hand = (degrees) => ({ transform: `rotate(${degrees}deg)` });
  const handLine = {
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    className: "origin-[10px_10px] [transform-box:view-box]",
  };

  return (
    <svg viewBox="0 0 20 20" className="h-[0.9em] w-[0.9em] shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="8.7" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 10 V5.6" {...handLine} style={hand((minutes % 720) / 2)} />
      <path d="M10 10 V3.8" {...handLine} style={hand((minutes % 60) * 6)} />
    </svg>
  );
}

const arrowLink =
  "group inline-flex items-center gap-1 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-lightAccent dark:focus-visible:ring-darkAccent";

function Arrow() {
  return (
    <LuArrowUpRight className="shrink-0 text-[0.8em] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  );
}

// One line of the list: its name, the value, and an optional note or action to the right.
// Phones stack the three. A rule draws across the top of each row, and under the last.
function Row({ label, aside, last = false, rowRef, children }) {
  const rule = "absolute inset-x-0 h-px origin-left bg-lightShade dark:bg-darkShade";
  return (
    <m.li ref={rowRef} variants={cascade(0.1)} className="relative">
      <m.span aria-hidden="true" variants={ruleIn} className={`${rule} top-0`} />
      <m.div
        variants={fadeUp}
        className="grid gap-y-1.5 py-5 sm:grid-cols-[7.5rem_1fr_auto] sm:items-baseline sm:gap-x-6 md:py-6"
      >
        <p className="text-[13px] text-lightModeTextP dark:text-darkModeTextP">{label}</p>
        <div className="min-w-0 text-lg font-medium tracking-[-0.015em] text-lightModeTextT dark:text-darkModeTextT lg:text-xl">
          {children}
        </div>
        {aside && (
          <div className="text-[13px] text-lightModeTextP dark:text-darkModeTextP sm:text-right">
            {aside}
          </div>
        )}
      </m.div>
      {last && <m.span aria-hidden="true" variants={ruleIn} className={`${rule} bottom-0`} />}
    </m.li>
  );
}

// The email: a mail link, and a button that copies it. A copy stamps a postmark just past the
// end of the address, its ring over the arrow so the address stays readable, at a slight
// random tilt, and every copy stamps again. Without a clipboard
// (an insecure page) the button opens a mail draft instead.
function EmailRow() {
  const rowRef = useRef(null);
  const linkRef = useRef(null);
  const timers = useRef([]);
  const [stamp, setStamp] = useState(null);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
      return;
    }
    const row = rowRef.current.getBoundingClientRect();
    const link = linkRef.current.getBoundingClientRect();
    const id = performance.now();
    setStamp({
      id,
      x: link.right - row.left + 24 + Math.random() * 12,
      y: link.top + link.height / 2 - row.top,
      tilt: Math.random() * 22 - 14,
    });
    // the thud lands with the stamp, a beat after the click
    timers.current.push(
      setTimeout(() => playSound("stamp", { force: true }), 90),
      setTimeout(() => setStamp((current) => (current?.id === id ? null : current)), STAMP_FOR)
    );
  };

  return (
    <Row
      rowRef={rowRef}
      label="Email"
      aside={
        <>
          {/* on paper, above the postmark's wavy lines */}
          <button
            type="button"
            onClick={copy}
            className="group relative z-20 -ml-2 inline-flex items-center gap-1.5 rounded-sm bg-lightBG pl-2 font-medium outline-none hover:text-lightModeTextT focus-visible:ring-2 focus-visible:ring-lightAccent dark:bg-darkBG dark:hover:text-darkModeTextT dark:focus-visible:ring-darkAccent"
          >
            {stamp ? (
              <>
                <LuCheck className="text-lightAccent dark:text-darkAccent" />
                Copied
              </>
            ) : (
              <>
                <LuCopy />
                Copy
              </>
            )}
          </button>
          <span role="status" className="sr-only">
            {stamp ? "Email address copied" : ""}
          </span>
        </>
      }
    >
      <a ref={linkRef} href={`mailto:${EMAIL}`} className={`${arrowLink} max-w-full`}>
        <span className="truncate">{EMAIL}</span>
        <Arrow />
      </a>

      {stamp && (
        <m.span
          key={stamp.id}
          aria-hidden="true"
          initial={{ opacity: 0, scale: 1.6 }}
          animate={{ opacity: [0, 0.9, 0.9, 0], scale: [1.6, 1, 1, 1] }}
          transition={{
            duration: STAMP_FOR / 1000,
            times: [0, 0.04, 0.8, 1],
            ease: ["easeIn", "linear", "easeOut"],
          }}
          style={{ left: stamp.x, top: stamp.y, x: "-25%", y: "-50%", rotate: stamp.tilt }}
          className="pointer-events-none absolute z-10 w-[9rem] text-lightModeTextT dark:text-darkModeTextT md:w-[10rem]"
        >
          <Postmark date={dateFormat.format(new Date()).toUpperCase()} />
        </m.span>
      )}
    </Row>
  );
}

export default function Contact() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const pointer = usePointer(reduceMotion);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const now = useMinute();

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-title"
      className="bg-lightBG pb-24 pt-28 dark:bg-darkBG md:pb-28 md:pt-36 lg:pb-32 lg:pt-44"
    >
      <div className="mx-auto grid max-w-[66rem] gap-y-12 px-5 md:gap-y-14 md:px-10 lg:grid-cols-12 lg:gap-x-10">
        <m.div
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          variants={cascade(0.08)}
          className="relative lg:col-span-4"
        >
          <h2
            id="contact-title"
            className="text-[clamp(2rem,1rem+2.2vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-lightModeTextT dark:text-darkModeTextT"
          >
            <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              <m.span variants={slideUp} className="inline-block">
                Get in touch
              </m.span>
            </span>
          </h2>
          <m.p
            variants={fadeUp}
            className="mt-4 max-w-[17rem] text-balance text-[15px] leading-relaxed text-lightModeTextP dark:text-darkModeTextP sm:max-w-[21rem] md:text-base"
          >
            Hiring, or have something to build? Write to me.
          </m.p>
          <m.p
            variants={fadeUp}
            className="mt-5 flex items-center gap-2 text-[13px] text-lightModeTextP dark:text-darkModeTextP"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-lightAccent dark:bg-darkAccent" />
            Open to work
          </m.p>

          {/* beside the heading until the list moves up beside it, then under the text */}
          <div className="pointer-events-none absolute inset-0 text-[10px] text-lightModeTextT dark:text-darkModeTextT md:text-[12px] lg:text-[13px]">
            <Keepsake
              pointer={pointer}
              progress={scrollYProgress}
              reduceMotion={reduceMotion}
              order={0}
              delay={0.5}
              place="left-[84%] top-[30%] md:left-[80%] md:top-[42%] lg:left-[32%] lg:top-[78%]"
              depth={0.6}
              rise={60}
              size={1.35}
            >
              <Toy
                Drawing={PaperPlane}
                sound="whoosh"
                label="Say hello"
                rotate={-4}
                bob={6.6}
                order={0}
              />
            </Keepsake>
          </div>
        </m.div>

        <m.ul
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          variants={cascade(0.09)}
          className="lg:col-span-8 lg:pt-2"
        >
          <EmailRow />
          <Row label="Phone">
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} className={arrowLink}>
              {PHONE}
            </a>
          </Row>
          <Row label="Local time" aside={timeDifference(now)}>
            <span className="flex items-center gap-2.5">
              <Clock now={now} />
              {timeFormat.format(now)} in Dasmariñas
            </span>
          </Row>
          <Row label="Elsewhere" last>
            <span className="flex flex-wrap gap-x-6 gap-y-1">
              {links.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={arrowLink}>
                  {label}
                  <Arrow />
                </a>
              ))}
            </span>
          </Row>
        </m.ul>
      </div>
    </section>
  );
}
