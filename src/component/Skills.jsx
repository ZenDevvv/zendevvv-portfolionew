import { useEffect, useMemo, useRef, useState } from "react";
import { motion as m, useInView, useReducedMotion } from "framer-motion";
import skills from "../assets/json/skills.js";
import { playSound } from "../sounds";
import { useEasedSticky } from "../scrollCurve";
import { brandColors, brandVars } from "../brandColor";

// The logos are Simple Icons from a CDN, pinned to one release so a logo never changes or
// disappears under the page. Each is a mask over the text colour, so it's ink in both themes.
const ICONS = "https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons";

const ease = [0.22, 1, 0.36, 1];
// What was typed is forgotten this long after the last key, in ms.
const TYPING_IDLE = 1600;
// Running a row: the time between one key and the next, in ms.
const ROLL_STEP = 45;
// A key going down and back up when its row runs.
const press = [
  { transform: "translateY(0)" },
  { transform: "translateY(0.34em)", offset: 0.3 },
  { transform: "translateY(0)" },
];

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
// The keys drop onto the board row by row, with the bounce of the hero's keycaps.
const keyIn = {
  hidden: { opacity: 0, y: -14 },
  shown: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.5, duration: 0.7 } },
};

const logo = (slug) => {
  const image = `url(${ICONS}/${slug}.svg) center / contain no-repeat`;
  return { WebkitMask: image, mask: image };
};

// Each skill's lit colour in both themes, by name.
const brands = new Map(
  skills.flatMap(({ keys }) =>
    keys.map(({ name, color }) => [name, brandColors(color)])
  )
);

// Every skill once, in board order; TypeScript sits in two rows but is one name.
const names = [...new Set(skills.flatMap(({ keys }) => keys.map(({ name }) => name)))];
const groupsOf = (name) =>
  skills.filter(({ keys }) => keys.some((key) => key.name === name)).map(({ group }) => group);

const isWordChar = (char) => /[a-z0-9+#]/.test(char);

// Where `typed` matches `name`, from its start or the start of a word in it. The name's
// spaces and punctuation can be left out, so "nextjs" finds Next.js and "query" finds
// TanStack Query. Returns the matched stretch of the name as [start, end], or null.
function matchName(name, typed) {
  const text = name.toLowerCase();
  for (let start = 0; start < text.length; start++) {
    if (!isWordChar(text[start]) || (start > 0 && isWordChar(text[start - 1]))) continue;
    let at = start;
    for (const char of typed) {
      while (at < text.length && text[at] !== char && !isWordChar(text[at])) at++;
      if (text[at] !== char) {
        at = -1;
        break;
      }
      at++;
    }
    if (at !== -1) return [start, at];
  }
  return null;
}

// The skill that `typed` finds: a name starting with it before a name with a word that
// does. Typing one letter over and over steps through the names starting with it.
function find(typed) {
  const hits = names
    .map((name) => ({ name, span: matchName(name, typed) }))
    .filter(({ span }) => span)
    .sort((a, b) => (a.span[0] > 0) - (b.span[0] > 0));
  if (hits.length) return hits[0];

  if (/^(.)\1+$/.test(typed)) {
    const starting = names.filter((name) => matchName(name, typed[0])?.[0] === 0);
    if (starting.length) {
      return { name: starting[(typed.length - 1) % starting.length], span: [0, 1] };
    }
  }
  return null;
}

// The last pointer pressed: a mouse sounds a key the moment it goes down, while touch waits
// for the click, which only fires if the touch didn't turn into a scroll.
let lastPointer = "mouse";

function soundProps(play) {
  return {
    onPointerEnter: (event) => {
      if (event.pointerType === "mouse") play(false);
    },
    onPointerDown: (event) => {
      lastPointer = event.pointerType;
      if (lastPointer === "mouse") play(true);
    },
    onClick: () => {
      if (lastPointer !== "mouse") play(true);
    },
  };
}

const ink = "border-lightModeTextT dark:border-darkModeTextT";

// A keycap of any width, drawn like the hero's `Keycap`: ink-lined sides, and a face set in
// from them, deepest at the front. The face dips while the key is hovered (with a mouse),
// bottoms out while it's pressed, and stays down while `held`. `faceRef` lets a row run its
// keys. The press is repeated inside the hover media query: Tailwind writes that query after
// the plain `:active` rule, so the hover dip would otherwise win over the click.
function Cap({ held = false, faceRef, face, className = "", children }) {
  return (
    <span
      className={`flex h-[3.8em] rounded-[0.62em] border-[1.5px] bg-lightShade px-[0.26em] pb-[0.8em] pt-[0.1em] dark:bg-darkShade ${ink} ${className}`}
    >
      <span
        ref={faceRef}
        className={`relative flex flex-1 flex-col rounded-[0.5em] border-[1.5px] px-[0.5em] py-[0.38em] transition-[transform,background-color,border-color] duration-150 ease-out group-active:translate-y-[0.34em] group-active:duration-75 motion-reduce:transition-none [@media(hover:hover)]:group-hover:translate-y-[0.2em] [@media(hover:hover)]:group-active:translate-y-[0.34em] ${ink} ${face} ${held ? "translate-y-[0.34em]" : ""}`}
      >
        {children}
      </span>
    </span>
  );
}

// The logo's colour, by state: ink at rest, its brand colour (for the theme) while the key
// is hovered, pressed or held. It lights quickly and fades out slowly, so even a quick tap
// leaves a glimpse of the colour.
const logoColor =
  "transition-colors duration-500 ease-out [--brand:var(--light)] dark:[--brand:var(--dark)] group-active:bg-[var(--brand)] group-active:duration-75 [@media(hover:hover)]:group-hover:bg-[var(--brand)] [@media(hover:hover)]:group-hover:duration-100";

// One skill. Wider keys click a little lower, the way a long key sounds deeper.
function Key({ id, name, icon, held, near, faceRef }) {
  const rate = clamp(1.06 - name.length * 0.012, 0.88, 1.04);
  const sound = soundProps((force) => playSound("key", { force, source: id, rate }));
  const brand = brands.get(name);

  return (
    <m.li variants={keyIn} className="group cursor-pointer touch-manipulation select-none" {...sound}>
      <Cap held={held} faceRef={faceRef} face="bg-lightBG dark:bg-darkBG" className="min-w-[3.8em]">
        {icon && (
          <span
            data-logo
            aria-hidden="true"
            style={near ? { ...logo(icon), ...brandVars(brand) } : undefined}
            className={`block h-[1.1em] w-[1.1em] ${near ? `${logoColor} ${held ? "bg-[var(--brand)]" : "bg-current"}` : ""}`}
          />
        )}
        <span className="mt-auto whitespace-nowrap text-[0.78em] font-medium leading-none">
          {name}
        </span>
        {/* lit while typing has found it */}
        <span
          aria-hidden="true"
          className={`absolute right-[0.45em] top-[0.45em] h-[0.36em] w-[0.36em] rounded-full bg-lightAccent transition duration-200 motion-reduce:scale-100 dark:bg-darkAccent ${held ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
        />
      </Cap>
    </m.li>
  );
}

// A row's name, on a wide key in the other colour of a two-tone set, like a keyboard's
// modifiers. Pressing it runs the row.
function GroupKey({ group, onRun }) {
  const sound = soundProps((force) => {
    playSound("thock", { force, source: `skills:${group}` });
    if (force) onRun();
  });

  return (
    <m.div
      variants={keyIn}
      className="group shrink-0 cursor-pointer touch-manipulation select-none md:w-[8.75em]"
      {...sound}
    >
      <Cap face="bg-secondaryLightBG dark:bg-secondaryDarkBG">
        <h3 className="mt-auto whitespace-nowrap text-[0.78em] font-semibold leading-[1.15] md:whitespace-normal">
          {group}
        </h3>
      </Cap>
    </m.div>
  );
}

// What the visitor has typed on their own keyboard, completed to the skill it found: the
// typed part in ink, the rest faint, the caret between them.
function Readout({ typed, found }) {
  let status = "Try your keyboard";
  let text = (
    <>
      <Caret />
      <span className="text-lightModeTextP/45 dark:text-darkModeTextP/45">type a skill</span>
    </>
  );

  if (typed && found) {
    const { name, span } = found;
    status = groupsOf(name).join(" · ");
    text = (
      <>
        <span className="text-lightModeTextP/45 dark:text-darkModeTextP/45">{name.slice(0, span[0])}</span>
        {name.slice(span[0], span[1])}
        <Caret key={typed} />
        <span className="text-lightModeTextP/45 dark:text-darkModeTextP/45">{name.slice(span[1])}</span>
      </>
    );
  } else if (typed) {
    status = "No key for that one";
    text = (
      <>
        {typed}
        <Caret key={typed} />
      </>
    );
  }

  return (
    <div>
      <p role="status" className="text-[13px] text-lightModeTextP dark:text-darkModeTextP">
        {status}
      </p>
      <p
        aria-hidden="true"
        className="mt-1 overflow-hidden whitespace-nowrap text-[clamp(1.5rem,1.1rem+0.8vw,1.875rem)] font-semibold leading-[1.2] tracking-[-0.03em] text-lightModeTextT dark:text-darkModeTextT"
      >
        {text}
      </p>
    </div>
  );
}

// Blinks while waiting; keyed by what was typed, so it shows solid again after each key.
function Caret() {
  return (
    <span className="mx-[0.04em] inline-block h-[0.9em] w-[2px] translate-y-[0.12em] animate-caret bg-lightModeTextT motion-reduce:animate-none dark:bg-darkModeTextT" />
  );
}

export default function Skills() {
  const boardRef = useRef(null);
  // The heading and the typing readout pin beside the keyboard on wide screens, easing in and
  // out of the pin on the same curve as the Experience heading.
  const headerRef = useRef(null);
  useEasedSticky(headerRef);
  const faces = useRef(new Map());
  const timers = useRef([]);
  const reduceMotion = useReducedMotion();
  // The logos start loading a screen or so before the board comes into view.
  const near = useInView(boardRef, { once: true, margin: "1200px 0px" });
  // Typing only finds skills while the board is on screen.
  const onScreen = useInView(boardRef, { amount: 0.2 });
  const [typed, setTyped] = useState("");
  const found = useMemo(() => (typed ? find(typed) : null), [typed]);

  useEffect(() => {
    if (!onScreen) return;
    let current = "";
    let idle;
    const set = (next) => {
      current = next;
      setTyped(next);
    };

    const onKeyDown = (event) => {
      if (event.isComposing) return;
      if (event.target.closest?.("input, textarea, select, [contenteditable]")) return;

      // Backspace works as in a text field: held, it repeats; with Ctrl (Alt on a Mac) it
      // deletes the last word, with Cmd everything. The key going down thocks like the
      // board's wide keys; while it's held, each character that goes ticks, a little lower
      // as the word shrinks. With nothing left to delete it's silent.
      if (event.key === "Backspace") {
        if (!current) return;
        if (event.metaKey) set("");
        else if (event.ctrlKey || event.altKey) set(current.replace(/[a-z0-9]*[^a-z0-9]*$/, ""));
        else set(current.slice(0, -1));
        playSound(event.repeat ? "erase" : "thock", {
          force: true,
          rate: 0.85 + current.length * 0.02,
        });
      }
      // Other keys with a modifier are the browser's shortcuts, and a held letter doesn't repeat.
      else if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
      else if (event.key === "Escape") set("");
      else if (/^[a-z0-9+#.]$/i.test(event.key)) {
        set((current + event.key.toLowerCase()).slice(0, 16));
        playSound(find(current) ? "key" : "miss", { force: true });
      } else return;

      clearTimeout(idle);
      idle = setTimeout(() => set(""), TYPING_IDLE);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(idle);
      setTyped("");
    };
  }, [onScreen]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // Runs a finger along a row: each key presses and clicks in turn, a little higher each time,
  // and its logo flashes its colour, so a wave of colour crosses the row.
  const run = ({ group, keys }) => {
    const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    keys.forEach(({ name }, index) => {
      const id = `${group}:${name}`;
      const delay = (index + 1) * ROLL_STEP;
      const rate = 0.96 + index * 0.03;
      timers.current.push(
        setTimeout(() => playSound("key", { force: true, source: id, rate }), delay)
      );
      const face = faces.current.get(id);
      if (!face) return;
      if (!reduceMotion) face.animate(press, { duration: 220, delay, easing: "ease-out" });
      const color = brands.get(name)[theme];
      face.querySelector("[data-logo]")?.animate(
        [
          { backgroundColor: color, offset: 0.1 },
          { backgroundColor: color, offset: 0.4 },
        ],
        { duration: 700, delay, easing: "ease-out" }
      );
    });
  };

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="scroll-mt-28 bg-lightBG dark:bg-darkBG md:scroll-mt-36 lg:scroll-mt-44"
    >
      <div className="mx-auto grid max-w-[66rem] gap-y-12 px-5 md:gap-y-16 md:px-10 lg:grid-cols-12 lg:gap-x-10">
        <m.div
          ref={headerRef}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          variants={cascade(0.08)}
          className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between lg:sticky lg:top-28 lg:col-span-4 lg:flex-col lg:items-start lg:justify-start lg:self-start"
        >
          {/* Plays its own entrance, so a remount (a hot reload) can't leave it hidden in its mask. */}
          <m.h2
            id="skills-title"
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            className="text-[clamp(2rem,1rem+2.2vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-lightModeTextT dark:text-darkModeTextT"
          >
            <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              <m.span variants={slideUp} className="inline-block">
                Skills
              </m.span>
            </span>
          </m.h2>
          {/* only where there's a mouse, so most likely a keyboard too */}
          <m.div variants={fadeUp} className="hidden max-w-full [@media(hover:hover)]:block">
            <Readout typed={typed} found={found} />
          </m.div>
        </m.div>

        <m.ul
          ref={boardRef}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          variants={cascade(0.07)}
          className="space-y-[1.5em] text-[14px] text-lightModeTextT dark:text-darkModeTextT md:space-y-[0.45em] lg:col-span-8 lg:pt-2 lg:text-[15px]"
        >
          {skills.map((row) => (
            <m.li
              key={row.group}
              variants={cascade(0.025)}
              className="flex flex-col items-start gap-[0.45em] md:flex-row"
            >
              <GroupKey group={row.group} onRun={() => run(row)} />
              <ul className="flex flex-wrap gap-[0.45em]">
                {row.keys.map(({ name, icon }) => {
                  const id = `${row.group}:${name}`;
                  return (
                    <Key
                      key={id}
                      id={id}
                      name={name}
                      icon={icon}
                      near={near}
                      held={found?.name === name}
                      faceRef={(node) =>
                        node ? faces.current.set(id, node) : faces.current.delete(id)
                      }
                    />
                  );
                })}
              </ul>
            </m.li>
          ))}
        </m.ul>
      </div>
    </section>
  );
}
