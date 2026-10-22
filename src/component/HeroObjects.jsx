import { useEffect, useId, useState } from "react";
import { motion as m, useTransform } from "framer-motion";
import { LuGithub, LuLinkedin, LuMail } from "react-icons/lu";
import { useDrift } from "../pointer";
import { playSound, soundOn } from "../sounds";
import { brandVars } from "../brandColor";

// One line-art language for every object: ink strokes, flat fills from the theme.
const line = {
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
const paper = "fill-lightBG dark:fill-darkBG";
const shade = "fill-lightShade dark:fill-darkShade";
const ink = "fill-lightModeTextT dark:fill-darkModeTextT";
const accent = "fill-lightAccent dark:fill-darkAccent";
const accentLine = "stroke-lightAccent dark:stroke-darkAccent";
// SVG transforms pivot on a point in the drawing's own coordinates.
const pivot = "[transform-box:view-box]";
// Each drawing gets `play`, a count of hovers and clicks. An animated part is keyed by it,
// so every new play remounts that part and restarts its animation from the beginning,
// even if the last one has not finished.
const replay = (play, animation) => (play ? animation : "");
const crankTransition = "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)";

const socials = [
  { label: "GitHub", href: "https://github.com/ZenDevvv", Icon: LuGithub, tilt: -7, lift: 0 },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/zen-andrei-obrero-6b37762b5",
    Icon: LuLinkedin,
    tilt: 4,
    lift: 7,
  },
  { label: "Email", href: "mailto:zenandreiobrero@gmail.com", Icon: LuMail, tilt: -3, lift: 2 },
];

// A gear outline around (cx, cy): `teeth` flat-topped teeth between radius `root`
// and `outer`, turned by `phase` degrees so a pair can be set to mesh.
function gearPath(cx, cy, teeth, outer, root, phase) {
  const step = (Math.PI * 2) / teeth;
  const points = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step + (phase * Math.PI) / 180;
    points.push(
      [root, a - step * 0.27],
      [outer, a - step * 0.14],
      [outer, a + step * 0.14],
      [root, a + step * 0.27]
    );
  }
  const d = points.map(([r, t], i) => {
    const x = (cx + r * Math.cos(t)).toFixed(2);
    const y = (cy + r * Math.sin(t)).toFixed(2);
    return `${i ? "L" : "M"}${x} ${y}`;
  });
  return `${d.join(" ")} Z`;
}

// Same tooth size on both, centres one pitch-radius sum apart, phased so a tooth
// of the small gear sits in a gap of the large one where they meet.
const largeGear = gearPath(30, 50, 10, 22, 17, 14);
const smallGear = gearPath(55.4, 28.7, 7, 16.15, 11.15, -14.29);

// A slow random walk around a Cavite afternoon, shown on the sensor's screen.
const nextReading = (value, spread) =>
  Math.min(31.5, Math.max(27.5, value + (Math.random() - 0.5) * spread));

// Drifts on its own, and takes a fresh, livelier reading every time it is played.
function useReading(play) {
  const [reading, setReading] = useState(29.4);

  useEffect(() => {
    const id = setInterval(() => setReading((value) => nextReading(value, 0.6)), 2600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (play) setReading((value) => nextReading(value, 2.4));
  }, [play]);

  return reading.toFixed(1);
}

export function Sensor({ play }) {
  const reading = useReading(play);
  return (
    <svg viewBox="0 0 76 92" className="block w-[4.75em]" aria-hidden="true">
      {/* playing sends a burst of signal out of the antenna */}
      <g
        key={play}
        className={`${pivot} origin-[20px_27px] ${replay(play, "animate-transmit")} motion-reduce:!animate-none`}
      >
        <g {...line} fill="none">
          <path
            d="M13.1 23 A8 8 0 0 1 26.9 23"
            className="animate-signal motion-reduce:animate-none"
          />
          <path
            d="M7.9 20 A14 14 0 0 1 32.1 20"
            className="animate-signal [animation-delay:200ms] motion-reduce:animate-none"
          />
          <path
            d="M2.7 17 A20 20 0 0 1 37.3 17"
            className="animate-signal [animation-delay:400ms] motion-reduce:animate-none"
          />
        </g>
      </g>
      <path d="M20 53 V30" {...line} fill="none" />
      <circle cx="20" cy="27" r="3.5" className={ink} />
      <rect x="4" y="52" width="68" height="39" rx="9" className={paper} {...line} />
      <rect x="12" y="60" width="38" height="23" rx="4" className={ink} />
      <text
        x="31"
        y="75.5"
        textAnchor="middle"
        fontSize="11"
        className={`${paper} font-semibold`}
      >
        {reading}°
      </text>
      <circle
        cx="61"
        cy="64"
        r="3"
        className={`${accent} animate-blink motion-reduce:animate-none`}
      />
      <path d="M56 73 H66 M56 78 H66" {...line} fill="none" />
    </svg>
  );
}

export function Books({ play }) {
  return (
    <svg viewBox="0 0 104 76" className="block w-[6.5em]" aria-hidden="true">
      <rect x="2" y="58" width="96" height="17" rx="3" className={shade} {...line} />
      <path d="M14 58 V75 M86 58 V75" {...line} fill="none" />
      <rect x="38" y="62.5" width="24" height="8" rx="1.5" className={paper} {...line} />

      <rect x="9" y="41" width="84" height="17" rx="3" className={paper} {...line} />
      <path d="M22 49.5 H52" {...line} fill="none" />

      {/* mortarboard */}
      <path d="M35 32 V39 Q51 45 67 39 V32" className={ink} {...line} />
      <path d="M51 21 L83 29.5 L51 38 L19 29.5 Z" className={ink} {...line} />
      <g
        key={play}
        className={`${pivot} origin-[51px_29.5px] ${replay(play, "animate-swing")} motion-reduce:!animate-none`}
      >
        <path d="M51 29.5 L74 33.5 V45" {...line} fill="none" className={accentLine} />
        <path d="M74 44 V51" {...line} strokeWidth="4" className={accentLine} />
      </g>
      <circle cx="51" cy="29.5" r="2.2" className={accent} />
    </svg>
  );
}

export function Bell({ play }) {
  return (
    <svg viewBox="0 0 72 60" className="block w-[4.5em]" aria-hidden="true">
      <g
        key={play}
        className={`${pivot} origin-[36px_50px] ${replay(play, "animate-ding")} motion-reduce:!animate-none`}
      >
        <path d="M10 49 C10 21 62 21 62 49 Z" className={paper} {...line} />
        <path d="M19 43 C19 37 23 33 29 31" {...line} fill="none" opacity="0.45" />
        <rect x="33.5" y="18" width="5" height="11" rx="1" className={ink} />
        <ellipse cx="36" cy="16.5" rx="7" ry="3" className={ink} />
      </g>
      <g key={`ding-${play}`} {...line} fill="none" className={`opacity-0 ${replay(play, "animate-flash")}`}>
        <path d="M50 12 L55 8 M53 19 L59 18" />
        <path d="M22 12 L17 8 M19 19 L13 18" />
      </g>
      <rect x="5" y="47" width="62" height="5" rx="2.5" className={shade} {...line} />
      <rect x="2" y="52" width="68" height="7" rx="3" className={ink} {...line} />
    </svg>
  );
}

export function FirstAidKit({ play }) {
  return (
    <svg viewBox="0 0 76 64" className="block w-[4.75em]" aria-hidden="true">
      <path d="M27 14 V9 Q27 5 31 5 H45 Q49 5 49 9 V14" {...line} fill="none" />
      <rect x="4" y="14" width="68" height="46" rx="7" className={paper} {...line} />
      <path d="M4 25 H72" {...line} fill="none" />
      <rect x="13" y="22" width="7" height="6" rx="1.5" className={shade} {...line} />
      <rect x="56" y="22" width="7" height="6" rx="1.5" className={shade} {...line} />
      <g
        key={play}
        className={`${pivot} origin-[38px_43px] ${replay(play, "animate-beat")} motion-reduce:!animate-none`}
      >
        <path
          d="M34 33 H42 V39 H48 V47 H42 V53 H34 V47 H28 V39 H34 Z"
          className={accent}
        />
      </g>
    </svg>
  );
}

// The gears turn at speeds in the ratio of their teeth, so they stay meshed. Each play
// cranks both two teeth further; the crank is a transition rather than a restarted
// animation, so rapid plays add up smoothly instead of jumping back.
export function Gears({ play }) {
  return (
    <svg viewBox="0 0 76 76" className="block w-[4.75em]" aria-hidden="true">
      <g
        className={`${pivot} origin-[30px_50px] animate-spin-slow motion-reduce:animate-none`}
      >
        <g
          className={`${pivot} origin-[30px_50px] motion-reduce:!transition-none`}
          style={{ transform: `rotate(${play * 72}deg)`, transition: crankTransition }}
        >
          <path d={largeGear} className={shade} {...line} />
          <circle cx="30" cy="50" r="6" className={paper} {...line} />
          <circle cx="30" cy="50" r="1.8" className={ink} />
        </g>
      </g>
      <g
        className={`${pivot} origin-[55.4px_28.7px] animate-spin-slow-reverse motion-reduce:animate-none`}
      >
        <g
          className={`${pivot} origin-[55.4px_28.7px] motion-reduce:!transition-none`}
          style={{ transform: `rotate(${(play * -720) / 7}deg)`, transition: crankTransition }}
        >
          <path d={smallGear} className={paper} {...line} />
          <circle cx="55.4" cy="28.7" r="4.5" className={shade} {...line} />
        </g>
      </g>
    </svg>
  );
}

export function Coins({ play }) {
  return (
    <svg viewBox="0 0 84 76" className="block w-[5.25em]" aria-hidden="true">
      {/* a stack of four coins seen slightly from above */}
      <path d="M4 42 V64 A22 6 0 0 0 48 64 V42" className={shade} {...line} />
      <path d="M4 49.3 A22 6 0 0 0 48 49.3 M4 56.6 A22 6 0 0 0 48 56.6" {...line} fill="none" />
      <ellipse cx="26" cy="42" rx="22" ry="6" className={paper} {...line} />
      <g transform="rotate(8 60 48)">
        <g
          key={play}
          className={`origin-center [transform-box:fill-box] ${replay(play, "animate-flip")} motion-reduce:!animate-none`}
        >
          <circle cx="60" cy="48" r="19" className={paper} {...line} />
          <circle cx="60" cy="48" r="14.5" {...line} fill="none" />
          {/* ₱ */}
          <path
            d="M57 55.5 V40.5 H61 C64.5 40.5 66 42.5 66 44.75 C66 47 64.5 49 61 49 H57 M54 43.5 H67.5 M54 46.2 H67.5"
            {...line}
            fill="none"
          />
        </g>
      </g>
    </svg>
  );
}

// The About drawings. Playing the cap swings its tassel; being thrown is the About
// section's own game (`GradCap.jsx`).
export function Mortarboard({ play }) {
  return (
    <svg viewBox="0 0 72 52" className="block w-[4.5em]" aria-hidden="true">
      <path d="M20 22 V33 Q36 40 52 33 V22" className={ink} {...line} />
      <path d="M36 7 L68 17.5 L36 28 L4 17.5 Z" className={ink} {...line} />
      <path
        d="M15 17.5 L34 11.3"
        {...line}
        fill="none"
        opacity="0.45"
        className="stroke-lightBG dark:stroke-darkBG"
      />
      <g
        key={play}
        className={`${pivot} origin-[36px_17.5px] ${replay(play, "animate-swing")} motion-reduce:!animate-none`}
      >
        <path d="M36 17.5 L60 23 V35" {...line} fill="none" className={accentLine} />
        <path d="M60 34 V41" {...line} strokeWidth="4" className={accentLine} />
      </g>
      <circle cx="36" cy="17.5" r="2.2" className={accent} />
    </svg>
  );
}

export function Trophy({ play }) {
  return (
    <svg viewBox="0 0 68 76" className="block w-[4.25em]" aria-hidden="true">
      <g key={`shine-${play}`} {...line} fill="none" className={`opacity-0 ${replay(play, "animate-flash")}`}>
        <path d="M11 8 L6 3 M9 16 L2 15" />
        <path d="M57 8 L62 3 M59 16 L66 15" />
      </g>
      <g
        key={play}
        className={`${pivot} origin-[34px_74px] ${replay(play, "animate-ding")} motion-reduce:!animate-none`}
      >
        <path d="M18 15 H11 Q6 15 6 20 Q6 30 20 32 M50 15 H57 Q62 15 62 20 Q62 30 48 32" {...line} fill="none" />
        <path d="M17 8 H51 V23 C51 35 43 43 34 43 C25 43 17 35 17 23 Z" className={paper} {...line} />
        <path
          d="M34 17.5 L35.6 21.8 L40.2 22 L36.6 24.8 L37.8 29.3 L34 26.7 L30.2 29.3 L31.4 24.8 L27.8 22 L32.4 21.8 Z"
          className={`${accent} ${accentLine}`}
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <rect x="30" y="43" width="8" height="9" className={ink} {...line} />
        <rect x="22" y="52" width="24" height="8" rx="2" className={shade} {...line} />
        <rect x="17" y="60" width="34" height="13" rx="3" className={ink} {...line} />
      </g>
    </svg>
  );
}

// A strip of tape with torn ends, holding the About photo up.
export function Tape() {
  return (
    <svg viewBox="0 0 84 26" className="block w-full" aria-hidden="true">
      <path
        d="M4 3 H80 L78 7.5 L81 12 L78 16.5 L81 21 L79 23 H4 L6 19 L3 14.5 L6 10 L3 6 Z"
        className={shade}
        {...line}
      />
    </svg>
  );
}

// A magnifying glass, ring of `radius` px, its handle down and to the right. Its box
// starts at the ring's top-left, so the ring's centre is (radius, radius).
export function Magnifier({ radius }) {
  const size = radius * 2 + 34;
  const along = (distance) => radius + distance * Math.SQRT1_2;
  const glint = radius - 9;
  const onGlint = (degrees) => {
    const angle = (degrees * Math.PI) / 180;
    return `${radius + glint * Math.cos(angle)} ${radius + glint * Math.sin(angle)}`;
  };
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="block overflow-visible"
      aria-hidden="true"
    >
      <circle cx={radius} cy={radius} r={radius - 0.8} {...line} fill="none" />
      {/* a glint on the glass */}
      <path
        d={`M${onGlint(195)} A${glint} ${glint} 0 0 1 ${onGlint(245)}`}
        {...line}
        fill="none"
        className="stroke-white opacity-70"
      />
      <path d={`M${along(radius)} ${along(radius)} L${along(radius + 8)} ${along(radius + 8)}`} {...line} fill="none" />
      <path
        d={`M${along(radius + 10)} ${along(radius + 10)} L${along(radius + 30)} ${along(radius + 30)}`}
        {...line}
        strokeWidth="9"
      />
      <path
        d={`M${along(radius + 10)} ${along(radius + 10)} L${along(radius + 30)} ${along(radius + 30)}`}
        {...line}
        strokeWidth="5.8"
        className="stroke-lightShade dark:stroke-darkShade"
      />
    </svg>
  );
}

// Contact's drawing: a paper plane with a dashed line where it has flown. Playing it loops
// the loop: it swings once round a point above itself, nose first, and comes back to rest.
export function PaperPlane({ play }) {
  return (
    <svg viewBox="0 0 110 60" className="block w-[6.25em] overflow-visible" aria-hidden="true">
      <path
        d="M50 40 C41 48 30 50 23 44 C16 38 22 29 28 35 C34 42 20 54 4 51"
        {...line}
        fill="none"
        strokeDasharray="2.5 4.5"
        opacity="0.5"
      />
      <g
        key={play}
        className={`${pivot} origin-[70px_-10px] ${replay(play, "animate-loop")} motion-reduce:!animate-none`}
      >
        <path d="M106 7 L58 31 L64 45 Z" className={shade} {...line} />
        <path d="M106 7 L32 25 L58 31 Z" className={paper} {...line} />
        <path d="M106 7 L45 28" {...line} fill="none" opacity="0.45" />
      </g>
    </svg>
  );
}

// Four wavy cancellation lines off the right of the postmark's ring, starting under it.
const cancelLines = [33, 43.5, 54, 64.5]
  .map((y) => `M88 ${y} q4 -4.5 8 0${" t8 0".repeat(12)}`)
  .join(" ");

// A rubber-stamped postmark in the drawings' ink line: the town round the ring, `date` in the
// middle, and wavy lines trailing off to the right. Contact stamps one when the email is
// copied. The ring's centre is a quarter of the way across and halfway down. Its waves are
// drawn before the ring, so they run out from under it.
export function Postmark({ date }) {
  const ring = `postmark-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 200 100" className="block w-full overflow-visible" aria-hidden="true">
      <path id={ring} d="M17 50 A33 33 0 1 1 83 50 A33 33 0 1 1 17 50" fill="none" />
      <path d={cancelLines} {...line} fill="none" />
      {/* on paper, so it reads over the email's ink; only the wavy lines cross the letters */}
      <circle cx="50" cy="50" r="46" className={paper} {...line} />
      <circle cx="50" cy="50" r="27" {...line} fill="none" />
      <text fontSize="8" fontWeight="600" fill="currentColor">
        <textPath href={`#${ring}`} textLength="205" lengthAdjust="spacing">
          DASMARIÑAS · CAVITE · PHILIPPINES ·
        </textPath>
      </text>
      <text x="50" y="52" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">
        COPIED
      </text>
      <text x="50" y="63" textAnchor="middle" fontSize="6.5" fontWeight="500" fill="currentColor">
        {date}
      </text>
    </svg>
  );
}

// A lit logo's colour, by state: ink at rest, its brand colour (for the theme) while the key
// is hovered or pressed. It lights quickly and fades out slowly, so a quick tap still shows it.
const brandText =
  "transition-colors duration-500 ease-out [--brand:var(--light)] dark:[--brand:var(--dark)] group-active:text-[color:var(--brand)] group-active:duration-75 [@media(hover:hover)]:group-hover:text-[color:var(--brand)] [@media(hover:hover)]:group-hover:duration-100";

// A keycap with an icon on it, sized in em. It presses down while its nearest `group`
// ancestor is hovered or pressed. Also used for the stack on the project slides, where
// `color` (from `brandColors`) lights the logo in its brand colour as the key goes down.
export function Keycap({ Icon, color }) {
  return (
    <svg viewBox="0 0 46 46" className="block w-[2.875em]" aria-hidden="true">
      <rect x="1.5" y="3" width="43" height="42" rx="8" className={shade} {...line} />
      <g className="transition-transform duration-150 ease-out group-hover:translate-y-[2.5px] group-active:translate-y-[4px]">
        <rect x="6.5" y="5" width="33" height="29" rx="6" className={paper} {...line} />
        <g style={color && brandVars(color)} className={color ? brandText : undefined}>
          <Icon x="15" y="11.5" size={16} />
        </g>
      </g>
    </svg>
  );
}

// On paper, so it still reads where it lands over something, like the About photo.
function ObjectLabel({ children }) {
  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-sm bg-lightBG px-1.5 py-0.5 text-[12px] font-medium text-lightModeTextT opacity-0 transition duration-200 ease-out group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-darkBG dark:text-darkModeTextT">
      {children}
    </span>
  );
}

// A drawing to play with. Hovering plays its animation and sound; every click plays them
// again (even mid-play, so they can be spammed), squashes it and pulses a circle out
// behind it, then calls `onTap` with the click. It bobs over its shadow while idle, tipped
// by `rotate`. Without a `sound` it plays silently.
export function Toy({ Drawing, sound, label, bob, order, rotate, onTap }) {
  const bobTiming = { animationDuration: `${bob}s`, animationDelay: `-${order * 1.7}s` };
  const [plays, setPlays] = useState(0);
  const [clicks, setClicks] = useState(0);

  const onPointerEnter = (event) => {
    if (event.pointerType !== "mouse") return;
    if (sound) playSound(sound);
    setPlays((count) => count + 1);
  };
  const onClick = (event) => {
    if (sound) playSound(sound, { force: true });
    setPlays((count) => count + 1);
    setClicks((count) => count + 1);
    onTap?.(event);
  };

  return (
    <m.div
      whileTap={{ scale: 0.86 }}
      transition={{ type: "spring", stiffness: 700, damping: 14 }}
      onPointerEnter={onPointerEnter}
      onClick={onClick}
      className="group relative flex cursor-pointer touch-manipulation select-none flex-col items-center"
    >
      {clicks > 0 && (
        <span
          key={clicks}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 m-auto h-[5.5em] w-[5.5em] animate-ripple rounded-full bg-lightShade motion-reduce:hidden dark:bg-darkShade"
        />
      )}
      {/* above the label, so a drawing that travels while it plays (the paper plane's loop)
          passes in front of it rather than behind its paper */}
      <m.div style={{ rotate }} className="relative z-10">
        <div className="animate-float motion-reduce:animate-none" style={bobTiming}>
          <Drawing play={plays} />
        </div>
      </m.div>
      <span
        aria-hidden="true"
        style={bobTiming}
        className="mt-[0.7em] h-[0.4em] w-[62%] animate-float-shadow rounded-[50%] bg-lightShade motion-reduce:animate-none dark:bg-darkShade"
      />
      <ObjectLabel>{label}</ObjectLabel>
    </m.div>
  );
}

// Something kept beside a section's content, at its own depth: it drifts against the pointer
// like the hero's objects, rises a little as the section scrolls past (`progress`), and pops
// in, `delay` seconds after its parent's `shown` variant starts, the first time it's seen.
// About's cap and trophy, and Contact's paper plane.
export function Keepsake({ pointer, progress, reduceMotion, place, depth, rise, size = 1, order, delay = 0.8, children }) {
  const drift = useDrift(pointer, depth);
  const scrollY = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [rise / 2, -rise / 2]);
  const y = useTransform([drift.y, scrollY], ([a, b]) => a + b);

  return (
    <div className={`pointer-events-auto absolute z-10 -translate-x-1/2 -translate-y-1/2 ${place}`}>
      <m.div style={{ x: drift.x, y }}>
        <m.div
          variants={{
            hidden: { opacity: 0, scale: 0.6 },
            shown: {
              opacity: 1,
              scale: 1,
              transition: { type: "spring", bounce: 0.45, duration: 0.8, delay: delay + order * 0.12 },
            },
          }}
          style={{ fontSize: `${size}em` }}
        >
          {children}
        </m.div>
      </m.div>
    </div>
  );
}

// One object floating at its own depth: it drifts against the pointer (see `followSpring`),
// rises `rise` px and tips further as the hero scrolls away, and plays like any `Toy`.
function Floater({ motion, place, depth, rise, tilt, size, order, ...toy }) {
  const { pointer, progress, reduceMotion } = motion;
  const drift = useDrift(pointer, depth);
  const scrollY = useTransform(progress, [0, 1], [0, reduceMotion ? 0 : rise]);
  const y = useTransform([drift.y, scrollY], ([a, b]) => a + b);
  const rotate = useTransform(progress, [0, 1], [tilt, reduceMotion ? tilt : tilt * 3]);
  const opacity = useTransform(progress, [0.15, 0.6], [1, 0]);

  return (
    <div className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 ${place}`}>
      <m.div style={{ x: drift.x, y, opacity }}>
        <m.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.45, duration: 0.8, delay: 0.6 + order * 0.1 }}
          style={{ fontSize: `${size}em` }}
        >
          <Toy order={order} rotate={rotate} {...toy} />
        </m.div>
      </m.div>
    </div>
  );
}

// The industries Zen builds for, floating around the intro. The frame is
// centred on the intro and grows with it, so the objects circle the text at
// every screen size; positions are percentages of that frame. Depths alternate
// near and far around the ring, with the large gears nearest.
const floaters = [
  {
    label: "IoT",
    Drawing: Sensor,
    sound: "sensor",
    place: "left-[15%] top-[9%] md:left-[9%] md:top-[12%] lg:left-[12%] lg:top-[15%]",
    depth: 0.55,
    rise: -280,
    tilt: -8,
    size: 0.95,
    bob: 6.5,
  },
  {
    label: "Manufacturing",
    Drawing: Gears,
    sound: "gears",
    place: "left-[50%] top-[0%] md:left-[74%] md:top-[3%] lg:left-[71%] lg:top-[4%]",
    depth: 1,
    rise: -300,
    tilt: 0,
    size: 1.2,
    bob: 7.6,
  },
  {
    label: "Finance",
    Drawing: Coins,
    sound: "coins",
    place: "left-[84%] top-[12%] md:left-[91%] md:top-[45%] lg:left-[90%] lg:top-[47%]",
    depth: 0.7,
    rise: -200,
    tilt: 6,
    size: 1.15,
    bob: 6.1,
  },
  {
    label: "Education",
    Drawing: Books,
    sound: "books",
    place: "left-[18%] top-[90%] md:left-[8%] md:top-[70%] lg:left-[6%] lg:top-[63%]",
    depth: 0.4,
    rise: -140,
    tilt: -4,
    size: 1,
    bob: 5.8,
  },
  {
    label: "Healthcare",
    Drawing: FirstAidKit,
    sound: "heartbeat",
    place: "left-[50%] top-[102%] md:left-[30%] md:top-[98%] lg:left-[31%] lg:top-[95%]",
    depth: 0.85,
    rise: -90,
    tilt: -6,
    size: 0.95,
    bob: 7,
  },
  {
    label: "Hospitality",
    Drawing: Bell,
    sound: "bell",
    place: "left-[83%] top-[91%] md:left-[85%] md:top-[95%] lg:left-[79%] lg:top-[92%]",
    depth: 0.3,
    rise: -70,
    tilt: 5,
    size: 1,
    bob: 6.8,
  },
];

export function FloatingObjects({ motion }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[calc(100%+15rem)] w-[min(56rem,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 text-[10.5px] text-lightModeTextT dark:text-darkModeTextT md:w-[min(56rem,calc(100vw-64px-3rem))] md:text-[12px] lg:h-[calc(100%+17rem)] lg:text-[14px]"
    >
      {floaters.map((floater, order) => (
        <Floater key={floater.label} motion={motion} order={order} {...floater} />
      ))}
    </div>
  );
}

// Social links as keycaps, tossed at slight angles; hovering straightens and presses one.
export function Keycaps() {
  return (
    <ul className="flex items-end gap-2.5 text-[14px] text-lightModeTextT dark:text-darkModeTextT">
      {socials.map(({ label, href, Icon, tilt, lift }, index) => (
        <m.li
          key={label}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.7, delay: 0.7 + index * 0.08 }}
          style={{ marginBottom: lift, "--tilt": `${tilt}deg` }}
          className="group relative"
          {...soundOn("key", label)}
        >
          <a
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={label}
            className="block rounded-[0.6em] outline-none transition-transform duration-300 ease-out [transform:rotate(var(--tilt))] focus-visible:ring-2 focus-visible:ring-lightAccent group-hover:[transform:rotate(0deg)] dark:focus-visible:ring-darkAccent"
          >
            <Keycap Icon={Icon} />
          </a>
          <ObjectLabel>{label}</ObjectLabel>
        </m.li>
      ))}
    </ul>
  );
}
