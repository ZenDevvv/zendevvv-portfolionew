import { useEffect, useRef, useState } from "react";
import {
  motion as m,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  useVelocity,
} from "framer-motion";
import { Bell, Books, Coins, FirstAidKit, Gears, Sensor } from "./HeroObjects";
import { playSound } from "../sounds";

// The hero's industries again, each with a phrase and a line on what was built there.
const industries = [
  {
    title: "Real-time IoT",
    description: "Connected devices to web apps so readings stream in live, not on refresh.",
    Drawing: Sensor,
    sound: "sensor",
  },
  {
    title: "Manufacturing ERP",
    description: "Modeled stock, staff and production so operations run from one system.",
    Drawing: Gears,
    sound: "gears",
  },
  {
    title: "Payroll & payments",
    description: "Shipped payroll, timekeeping and Xendit checkouts where every peso adds up.",
    Drawing: Coins,
    sound: "coins",
  },
  {
    title: "Multi-tenant learning",
    description: "Developed the frontend of an LMS many schools share, each with its own courses.",
    Drawing: Books,
    sound: "books",
  },
  {
    title: "Healthcare inventory",
    description: "Built GS1 inventory that follows each batch from delivery order to patient use.",
    Drawing: FirstAidKit,
    sound: "heartbeat",
  },
  {
    title: "Hospitality bookings",
    description: "Launched luxury car and chauffeur booking with pickup, meetup or delivery.",
    Drawing: Bell,
    sound: "bell",
  },
];

// Drift at rest, in px per second.
const DRIFT = 32;
// While the page scrolls the strip also travels this share of the scroll speed, so a
// flick of the wheel spins it fast. Capped so a hard fling never smears the text.
const SCROLL_GEAR = 0.35;
const MAX_BOOST = 1400;
// Seconds to catch up: it spins up almost at once and coasts down like a flywheel.
const SPIN_UP = 0.08;
const SPIN_DOWN = 0.5;
// Seconds to ease to a stop under the mouse, and back up once it leaves.
const HOVER_EASE = 0.25;
// Enough copies of the list to cover a screen twice as wide as one copy.
const COPIES = 3;

// Moves `current` toward `target`, most of the way within `tau` seconds at any frame rate.
const approach = (current, target, tau, dt) =>
  current + (target - current) * (1 - Math.exp(-dt / tau));

const cardClass =
  "flex w-[18rem] shrink-0 snap-start items-start gap-3 border-r border-lightShade px-4 py-5 dark:border-darkShade md:w-[22.5rem] md:gap-3.5 md:px-6 md:py-6";
const stripClass = "border-y border-lightShade dark:border-darkShade";

// Hovering plays the drawing like its twin in the hero; a click or tap plays its sound too.
function IndustryCard({ title, description, Drawing, sound }) {
  const [plays, setPlays] = useState(0);
  const play = () => setPlays((count) => count + 1);

  return (
    <li
      onPointerEnter={(event) => event.pointerType === "mouse" && play()}
      onClick={() => {
        playSound(sound, { force: true });
        play();
      }}
      className={cardClass}
    >
      <span
        aria-hidden="true"
        className="mini-drawing grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-secondaryLightBG text-lightModeTextT dark:bg-secondaryDarkBG dark:text-darkModeTextT md:h-11 md:w-11"
      >
        <span className="block h-7 w-7 md:h-8 md:w-8 [&>svg]:!h-full [&>svg]:!w-full">
          <Drawing play={plays} />
        </span>
      </span>
      <div className="min-w-0">
        <p className="text-[14px] font-medium leading-snug tracking-[-0.01em] text-lightModeTextT dark:text-darkModeTextT">
          {title}
        </p>
        <p className="mt-1 text-[13px] leading-normal text-lightModeTextP dark:text-darkModeTextP">
          {description}
        </p>
      </div>
    </li>
  );
}

function IndustryList({ listRef, hidden }) {
  return (
    <ul ref={listRef} aria-hidden={hidden || undefined} className="flex shrink-0">
      {industries.map((industry) => (
        <IndustryCard key={industry.title} {...industry} />
      ))}
    </ul>
  );
}

// An endless strip that drifts slowly left, spins faster while the page is scrolling
// (either way), and eases to a stop under the mouse so a card can be read.
function Marquee() {
  const viewportRef = useRef(null);
  const listRef = useRef(null);
  const listWidth = useRef(0);
  const speed = useRef({ boost: 0, hover: 1, hoverTarget: 1 });
  const inView = useInView(viewportRef, { margin: "200px 0px" });

  const offset = useMotionValue(0);
  const transform = useTransform(offset, (x) => `translate3d(${x}px, 0, 0)`);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // One copy's width is the loop length; it changes with the screen size and the font.
  useEffect(() => {
    const list = listRef.current;
    const observer = new ResizeObserver(() => {
      listWidth.current = list.getBoundingClientRect().width;
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    const width = listWidth.current;
    if (!inView || !width) return;

    const dt = delta / 1000;
    const state = speed.current;
    const target = Math.min(Math.abs(scrollVelocity.get()) * SCROLL_GEAR, MAX_BOOST);
    state.boost = approach(state.boost, target, target > state.boost ? SPIN_UP : SPIN_DOWN, dt);
    state.hover = approach(state.hover, state.hoverTarget, HOVER_EASE, dt);

    // Wrapping by one copy's width lands on an identical frame, so the loop never shows.
    const moveBy = (DRIFT * state.hover + state.boost) * dt;
    offset.set((offset.get() - moveBy) % width);
  });

  return (
    <div
      ref={viewportRef}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") speed.current.hoverTarget = 0;
      }}
      onPointerLeave={() => {
        speed.current.hoverTarget = 1;
      }}
      className={`overflow-hidden ${stripClass} [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]`}
    >
      <m.div style={{ transform }} className="flex w-max will-change-transform">
        {Array.from({ length: COPIES }, (_, copy) => (
          <IndustryList
            key={copy}
            listRef={copy === 0 ? listRef : undefined}
            hidden={copy > 0}
          />
        ))}
      </m.div>
    </div>
  );
}

// With reduced motion the strip holds still and scrolls sideways by hand instead.
function StillStrip() {
  return (
    <div
      className={`snap-x overflow-x-auto ${stripClass} [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
    >
      <IndustryList />
    </div>
  );
}

export default function Industries() {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-label="Industries I've built for" className="bg-lightBG dark:bg-darkBG">
      {reduceMotion ? <StillStrip /> : <Marquee />}
    </section>
  );
}
