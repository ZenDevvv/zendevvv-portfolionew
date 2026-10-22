import { useRef, useState } from "react";
import {
  motion as m,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { LuArrowRight } from "react-icons/lu";
import profile from "../assets/profile.jpg";
import { Keepsake, Magnifier, Tape, Toy, Trophy } from "./HeroObjects";
import GradCap, { ScoreBoard } from "./GradCap";
import { usePointer } from "../pointer";
import { playSound } from "../sounds";

const ease = [0.22, 1, 0.36, 1];
// Radius of the magnifier in px, and how much it enlarges what it shows.
const LENS = 46;
const ZOOM = 1.25;
// The lens trails the pointer just enough to feel held; its circle grows and shrinks softer.
const followLens = { stiffness: 700, damping: 45 };
const growLens = { stiffness: 220, damping: 28 };

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const cascade = (gap) => ({ hidden: {}, shown: { transition: { staggerChildren: gap } } });
const slideUp = {
  hidden: { y: "110%" },
  shown: { y: "0%", transition: { duration: 0.8, ease } },
};
// The print drops onto the page a little more crooked than it rests, then the photo
// develops: its dots grow out of blank paper.
const placePrint = {
  hidden: { opacity: 0, y: 28, rotate: -5 },
  shown: { opacity: 1, y: 0, rotate: 0, transition: { type: "spring", bounce: 0.3, duration: 0.9 } },
};
const develop = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 1.6, ease: "easeOut", delay: 0.35 } },
};

function Ink({ children }) {
  return (
    <span className="font-medium text-lightModeTextT dark:text-darkModeTextT">{children}</span>
  );
}

// The photo as a print in the theme's ink, taped up a little crooked; it straightens under
// the mouse. Over the photo a magnifier shows it in true colour, a little enlarged. A click
// or tap takes a shot: a flash, the shutter, and the colour spreads from that point over the
// whole photo. The next one, or the mouse leaving, puts it back in ink.
function Print() {
  const photoRef = useRef(null);
  const reduceMotion = useReducedMotion();
  // `looking`: the mouse is over the photo, holding the magnifier.
  const [looking, setLooking] = useState(false);
  const [developed, setDeveloped] = useState(false);
  const [shots, setShots] = useState(0);

  const x = useSpring(0, followLens);
  const y = useSpring(0, followLens);
  const radius = useSpring(0, growLens);
  const zoom = useSpring(ZOOM, growLens);
  const to = (value, target) => (reduceMotion ? value.jump(target) : value.set(target));

  const clipPath = useMotionTemplate`circle(${radius}px at ${x}px ${y}px)`;
  const origin = useMotionTemplate`${x}px ${y}px`;
  // The magnifier grows in with the lens and fades once the colour spreads past its rim.
  const lensScale = useTransform(radius, (r) => clamp(r / LENS, 0, 1));
  const lensOpacity = useTransform(radius, [LENS, LENS + 40], [1, 0]);

  // Where an event falls on the photo, kept inside it.
  const locate = (event) => {
    const box = photoRef.current.getBoundingClientRect();
    return [
      clamp(event.clientX - box.left, 0, box.width),
      clamp(event.clientY - box.top, 0, box.height),
    ];
  };

  const onPointerEnter = (event) => {
    if (event.pointerType !== "mouse") return;
    const [px, py] = locate(event);
    x.jump(px);
    y.jump(py);
    setLooking(true);
    if (!developed) to(radius, LENS);
  };
  const onPointerMove = (event) => {
    if (event.pointerType !== "mouse") return;
    const [px, py] = locate(event);
    to(x, px);
    to(y, py);
  };
  const onPointerLeave = (event) => {
    if (event.pointerType !== "mouse") return;
    setLooking(false);
    setDeveloped(false);
    to(radius, 0);
    to(zoom, ZOOM);
  };

  const onClick = (event) => {
    const box = photoRef.current.getBoundingClientRect();
    // A tap, a key, or a click on the white border: the colour spreads from there
    // (the middle, for a key) rather than from wherever the lens last was.
    if (!looking) {
      const [px, py] = event.detail === 0 ? [box.width / 2, box.height / 2] : locate(event);
      x.jump(px);
      y.jump(py);
    }
    const next = !developed;
    setDeveloped(next);
    setShots((count) => count + 1);
    playSound("shutter", { force: true });
    // The whole diagonal, so the colour still covers the photo wherever the lens goes.
    to(radius, next ? Math.hypot(box.width, box.height) : looking ? LENS : 0);
    to(zoom, next ? 1 : ZOOM);
  };

  return (
    <m.div variants={placePrint} className="relative">
      <button
        type="button"
        aria-pressed={developed}
        aria-label="Show my graduation photo in colour"
        onClick={onClick}
        className="relative block w-full rotate-[-3deg] touch-manipulation select-none rounded-[4px] border-[1.5px] border-lightModeTextT bg-lightBG p-2.5 pb-0 text-left outline-none transition-transform duration-300 ease-out hover:rotate-0 focus-visible:ring-2 focus-visible:ring-lightAccent focus-visible:ring-offset-4 focus-visible:ring-offset-lightBG motion-reduce:transition-none dark:border-darkModeTextT dark:bg-darkBG dark:focus-visible:ring-darkAccent dark:focus-visible:ring-offset-darkBG"
      >
        <span
          ref={photoRef}
          onPointerEnter={onPointerEnter}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className={`relative block aspect-[389/519] ${looking && !developed ? "cursor-none" : ""}`}
        >
          <span className="absolute inset-0 isolate overflow-hidden">
            <span className="halftone">
              <m.img variants={develop} src={profile} alt="" draggable="false" />
            </span>
            {/* tint the print's ink and paper with the theme */}
            <span className="absolute inset-0 bg-lightModeTextT mix-blend-lighten dark:bg-darkBG" />
            <span className="absolute inset-0 bg-lightBG mix-blend-darken dark:bg-darkModeTextT" />
            <m.span style={{ clipPath }} className="absolute inset-0">
              <m.img
                src={profile}
                alt=""
                draggable="false"
                style={{ scale: zoom, transformOrigin: origin }}
                className="h-full w-full object-cover"
              />
            </m.span>
          </span>
          <m.span
            aria-hidden="true"
            style={{
              x,
              y,
              scale: lensScale,
              opacity: lensOpacity,
              left: -LENS,
              top: -LENS,
              transformOrigin: `${LENS}px ${LENS}px`,
            }}
            className="pointer-events-none absolute z-10 text-lightModeTextT dark:text-darkModeTextT"
          >
            <Magnifier radius={LENS} />
          </m.span>
        </span>

        <span className="flex h-11 items-center justify-between gap-3 px-1 text-[12px]">
          <span className="font-medium text-lightModeTextT dark:text-darkModeTextT">
            Class of 2024
          </span>
          <span className="text-lightModeTextP dark:text-darkModeTextP">
            {developed ? (
              "Back to ink"
            ) : (
              <>
                <span className="hidden [@media(hover:hover)]:inline">Click to develop</span>
                <span className="[@media(hover:hover)]:hidden">Tap to develop</span>
              </>
            )}
          </span>
        </span>

        {shots > 0 && (
          <span
            key={shots}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-snap rounded-[3px] bg-white opacity-0 motion-reduce:hidden"
          />
        )}
      </button>

      <span className="pointer-events-none absolute -top-3.5 left-1/2 w-[5.25rem] -translate-x-1/2 rotate-[4deg] text-lightModeTextT dark:text-darkModeTextT">
        <Tape />
      </span>
    </m.div>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const pointer = usePointer(reduceMotion);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const drift = { pointer, progress: scrollYProgress, reduceMotion };
  // The cap game's score, shown huge behind the section's content.
  const [game, setGame] = useState({ score: 0, playing: false });

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-title"
      className="bg-lightBG py-28 dark:bg-darkBG md:py-36 lg:py-44"
    >
      <ScoreBoard {...game} />
      <div className="relative z-10 mx-auto grid max-w-[66rem] items-center gap-y-20 px-5 md:grid-cols-12 md:gap-x-10 md:px-10">
        <m.div
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          variants={cascade(0.08)}
          className="md:col-span-7 lg:col-span-6"
        >
          <h2
            id="about-title"
            className="text-[clamp(2rem,1rem+2.2vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-lightModeTextT dark:text-darkModeTextT"
          >
            <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              <m.span variants={slideUp} className="inline-block">
                About me
              </m.span>
            </span>
          </h2>

          <div className="mt-6 max-w-[34rem] space-y-4 text-pretty text-[15px] leading-relaxed text-lightModeTextP dark:text-darkModeTextP md:mt-7 md:text-base">
            <m.p variants={fadeUp}>
              I&apos;m Zen. I studied Computer Science at Biliran Province State University and
              graduated <Ink>with honors</Ink> in 2024. In second year I won <Ink>Algolympics</Ink>,
              our campus algorithm contest.
            </m.p>
            <m.p variants={fadeUp}>
              I like owning a feature <Ink>end to end</Ink>, from the data model to the last hover
              state. AI tools like Claude, Codex and Gemini speed up the scaffolding, and I still
              review every line.
            </m.p>
            <m.p variants={fadeUp}>
              Next, I&apos;m working toward a senior fullstack or <Ink>tech lead</Ink> role.
            </m.p>
          </div>

          <m.a
            variants={fadeUp}
            href="#contact"
            className="group mt-7 inline-flex items-center gap-1 rounded-sm text-[13px] font-medium text-lightModeTextT outline-none focus-visible:ring-2 focus-visible:ring-lightAccent dark:text-darkModeTextT dark:focus-visible:ring-darkAccent"
          >
            Say hello
            <LuArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </m.a>
        </m.div>

        <m.div
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          className="relative mx-auto w-[15rem] md:col-span-5 md:col-start-8 md:w-[13.5rem] lg:w-[17.5rem]"
        >
          <Print />
          <div className="pointer-events-none absolute inset-0 text-[11px] text-lightModeTextT dark:text-darkModeTextT lg:text-[13px]">
            {/* The cap sits above the photo's corner rather than over it: ink vanishes on
                the dark photo. */}
            <Keepsake
              {...drift}
              order={0}
              place="left-[-6%] top-[-5%] lg:left-[-12%] lg:top-[3%]"
              depth={0.5}
              rise={70}
              size={1.5}
            >
              <GradCap
                label="BS Computer Science"
                tilt={-12}
                bob={6.4}
                order={0}
                onGame={setGame}
              />
            </Keepsake>
            <Keepsake {...drift} order={1} place="left-[107%] top-[72%]" depth={0.35} rise={40}>
              <Toy
                Drawing={Trophy}
                sound="trophy"
                label="Algolympics champion"
                rotate={7}
                bob={7.2}
                order={1}
              />
            </Keepsake>
          </div>
        </m.div>
      </div>
    </section>
  );
}
