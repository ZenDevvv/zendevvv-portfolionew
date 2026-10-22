import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  animate,
  motion as m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Mortarboard, Toy } from "./HeroObjects";
import { playSound } from "../sounds";

// Keep the cap up. A click throws it off its spot by the photo; from then on it falls and
// is lost off the bottom of the screen unless it's hit again, and every hit throws it up
// afresh. Where it's hit decides the sideways kick: near the middle it goes up almost
// straight, on the very edge it flies hard the other way, spinning. The sides and top of
// the screen bounce it back. Once it drops out of sight it pops back into its spot.
//
// Every hit scores, the throw included. Every MILESTONE hits the game goes up a stage: the
// first brings up a huge, faint count behind the page, and each of the first five makes
// the game faster, louder and busier, and the count bigger. Later milestones still
// celebrate, and losing on the last stage throws a burst of confetti up from the bottom.

// Hits between milestones. 10 is the intended setting; 3 while the stages are tried out.
const MILESTONE = 1;

// What each stage turns up. Stage 0 is before the first milestone.
// gravity, kick: multiply the physics, so the cap falls faster and flies wider.
// size: the count's height, in vmin. ink: its opacity. accent: it turns green.
// trail: afterimages behind the cap. confetti: a burst from the cap at each milestone.
// shake: the count jolts on every hit. heartbeat: it beats, and you hear it.
const STAGES = [
  { gravity: 1, kick: 1 },
  { gravity: 1.1, kick: 1, size: 30, ink: 0.06 },
  { gravity: 1.2, kick: 1.08, size: 42, ink: 0.07, trail: true },
  { gravity: 1.32, kick: 1.16, size: 56, ink: 0.08, trail: true, confetti: true },
  { gravity: 1.45, kick: 1.24, size: 72, ink: 0.09, trail: true, confetti: true, shake: true },
  {
    gravity: 1.6,
    kick: 1.32,
    size: 90,
    ink: 0.11,
    trail: true,
    confetti: true,
    shake: true,
    heartbeat: true,
    accent: true,
  },
];
const stageOf = (score) => Math.min(Math.floor(score / MILESTONE), STAGES.length - 1);
const isMilestone = (score) => score > 0 && score % MILESTONE === 0;
// Each stage's sounds a little higher than the last.
const rateOf = (stage) => 1 + stage * 0.06;

// In px per second squared, before the stage's multiplier.
const GRAVITY = 2400;
// Each hit throws it up this share of the screen's height, at any stage.
const LIFT = 0.3;
// Sideways speed from a hit on the very edge: a share of the screen's width per second,
// capped in px per second.
const KICK = 0.9;
const MAX_KICK = 950;
// Spin from a hit on the very edge, in degrees per second. It slows in the air.
const SPIN = 540;
const SPIN_DRAG = 1.2;
// Share of the speed kept off a side of the screen, and off the top.
const WALL_BOUNCE = 0.7;
const CEILING_BOUNCE = 0.4;
// Hits land a little outside the drawing too, as a share of its size, since it's moving.
const REACH = "p-[0.6em]";

// Afterimages: how many frames each trails the cap, and how strongly it shows.
const TRAIL = [
  { behind: 3, ink: 0.22 },
  { behind: 6, ink: 0.13 },
  { behind: 9, ink: 0.06 },
];
// Confetti from the line-art palette: ink dashes, green dots, shaded chips.
const BITS = [
  "h-[2px] w-[0.6em] rounded-full bg-lightModeTextT dark:bg-darkModeTextT",
  "h-[0.35em] w-[0.35em] rounded-full bg-lightAccent dark:bg-darkAccent",
  "h-[0.4em] w-[0.4em] rounded-[1px] border border-lightModeTextT bg-lightShade dark:border-darkModeTextT dark:bg-darkShade",
];
const BITS_PER_BURST = 18;
const BIT_GRAVITY = 1400;
// Losing on the last stage still ends in a party: this many bits shoot up from where the
// cap dropped out, each to between 35% and 80% of the screen's height.
const FINALE_BITS = 80;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const place = (x, y, angle = 0) => `translate(${x}px, ${y}px) rotate(${angle}deg)`;

let burstCount = 0;
// A burst of confetti from (x, y): `count` bits, each thrown by `throwBit()` as [vx, vy]
// in px per second, fading out over the last of its `life` (in seconds, give or take).
function makeBurst(x, y, count, throwBit, life) {
  const id = ++burstCount;
  const bits = Array.from({ length: count }, (_, i) => {
    const [vx, vy] = throwBit();
    const angle = Math.random() * 360;
    return {
      key: `${id}-${i}`,
      look: BITS[i % BITS.length],
      x,
      y,
      vx,
      vy,
      angle,
      spin: (Math.random() - 0.5) * 900,
      age: 0,
      life: life * (1 + Math.random() * 0.4),
      from: place(x, y, angle),
      node: null,
    };
  });
  return { id, bits, duration: life * 1400 + 100 };
}

// A milestone's fan, thrown up and out from the cap, carried a little by its speed.
const fanFrom = (body) =>
  makeBurst(
    body.x,
    body.y,
    BITS_PER_BURST,
    () => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
      const speed = 350 + Math.random() * 450;
      return [Math.cos(angle) * speed + body.vx * 0.3, Math.sin(angle) * speed];
    },
    1
  );

// The finale, shot up from just below the bottom of the screen at `x`.
const finaleAt = (x) =>
  makeBurst(
    clamp(x, 0, window.innerWidth),
    window.innerHeight + 10,
    FINALE_BITS,
    () => {
      const height = window.innerHeight * (0.35 + Math.random() * 0.45);
      const rise = Math.sqrt(2 * BIT_GRAVITY * height);
      return [(Math.random() - 0.5) * window.innerWidth * 0.5, -rise];
    },
    1.6
  );

// Confetti over the page, burst by burst. Each bit falls, spins and fades on its own;
// a burst leaves the list (and the page) once its bits are done.
function Confetti({ bursts, fontSize }) {
  useAnimationFrame((_, delta) => {
    const dt = Math.min(delta / 1000, 1 / 30);
    for (const { bits } of bursts) {
      for (const bit of bits) {
        bit.vy += BIT_GRAVITY * dt;
        bit.x += bit.vx * dt;
        bit.y += bit.vy * dt;
        bit.angle += bit.spin * dt;
        bit.age += dt;
        if (!bit.node) continue;
        bit.node.style.transform = place(bit.x, bit.y, bit.angle);
        bit.node.style.opacity = String(clamp((bit.life - bit.age) / (bit.life * 0.4), 0, 1));
      }
    }
  });

  return createPortal(
    <div
      aria-hidden="true"
      style={{ fontSize }}
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      {bursts.map(({ bits }) =>
        bits.map((bit) => (
          <span
            key={bit.key}
            ref={(node) => (bit.node = node)}
            style={{ transform: bit.from }}
            className={`absolute left-0 top-0 ${bit.look}`}
          />
        ))
      )}
    </div>,
    document.body
  );
}

// A hit `offset` across the cap: -1 its left edge, 0 the middle, 1 its right edge. The
// kick away from the hit grows with the square of the offset, so the middle half of the
// cap sends it barely sideways and only the edges send it flying.
function hit(body, offset) {
  const { gravity, kick } = STAGES[stageOf(body.score)];
  const side = Math.sign(offset) * offset * offset;
  const lift = Math.sqrt(2 * GRAVITY * gravity * LIFT * window.innerHeight);
  body.vy = -lift * (1 - 0.15 * Math.abs(offset));
  body.vx = body.vx * 0.2 - side * kick * Math.min(KICK * window.innerWidth, MAX_KICK);
  body.spin = body.spin * 0.3 - offset * SPIN * kick;
}

// The cap in the air, drawn over the page (fixed, so scrolling doesn't carry it off),
// with its afterimages. Its confetti goes to `throwConfetti`, so it outlives the flight.
function Flight({ start, onScore, onGone, throwConfetti }) {
  const body = useRef(start.body);
  const done = useRef(false);
  // Where the cap has been, newest first, for the afterimages.
  const history = useRef([]);
  const ghosts = useRef([]);
  const [score, setScore] = useState(start.body.score);
  const stage = STAGES[stageOf(score)];
  const x = useMotionValue(start.body.x);
  const y = useMotionValue(start.body.y);
  const rotate = useMotionValue(start.body.angle);
  // Squashed flat by each hit, and springing back.
  const squash = useMotionValue(1);
  const stretch = useTransform(squash, (value) => 1 + (1 - value) * 0.6);
  const halfWidth = start.width / 2;
  const halfHeight = start.height / 2;
  // Where afterimages first render; the frame loop moves them from there.
  const origin = useRef(place(start.body.x, start.body.y)).current;

  useAnimationFrame((_, delta) => {
    if (done.current) return;
    const b = body.current;
    // A long gap (a hidden tab) shouldn't fling it across the screen.
    const dt = Math.min(delta / 1000, 1 / 30);
    b.vy += GRAVITY * STAGES[stageOf(b.score)].gravity * dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.angle += b.spin * dt;
    b.spin *= Math.exp(-SPIN_DRAG * dt);

    const left = halfWidth;
    const right = window.innerWidth - halfWidth;
    if (b.x < left || b.x > right) {
      b.x = clamp(b.x, left, right);
      if (Math.abs(b.vx) > 120) playSound("bump", { force: true });
      b.vx = (b.x === left ? 1 : -1) * Math.abs(b.vx) * WALL_BOUNCE;
      b.spin *= -0.5;
    }
    // The top bounces it back down too, so it's never out of reach above the screen.
    if (b.y < halfHeight && b.vy < 0) {
      b.y = halfHeight;
      if (b.vy < -120) playSound("bump", { force: true });
      b.vy = -b.vy * CEILING_BOUNCE;
    }

    if (b.y - halfHeight > window.innerHeight) {
      done.current = true;
      if (stageOf(b.score) === STAGES.length - 1) {
        playSound("popper", { force: true });
        playSound("milestone", { force: true, rate: rateOf(STAGES.length - 1) });
        throwConfetti(finaleAt(b.x));
      } else {
        playSound("fall", { force: true });
      }
      onGone(b.score);
      return;
    }
    x.set(b.x);
    y.set(b.y);
    rotate.set(b.angle);

    const path = history.current;
    path.unshift([b.x, b.y, b.angle]);
    if (path.length > 10) path.pop();
    ghosts.current.forEach((node, i) => {
      const point = path[TRAIL[i].behind] ?? path[path.length - 1];
      if (node) node.style.transform = place(...point);
    });
  });

  const onPointerDown = (event) => {
    if (done.current) return;
    event.preventDefault();
    const b = body.current;
    b.score += 1;
    const level = stageOf(b.score);
    hit(b, clamp((event.clientX - b.x) / halfWidth, -1, 1));
    playSound("toss", { force: true, rate: rateOf(level) });
    if (isMilestone(b.score)) {
      playSound("milestone", { force: true, rate: rateOf(level) });
      if (STAGES[level].confetti) throwConfetti(fanFrom(b));
    }
    setScore(b.score);
    onScore(b.score);
    squash.set(0.8);
    animate(squash, 1, { type: "spring", stiffness: 600, damping: 12 });
  };

  return createPortal(
    <div
      aria-hidden="true"
      style={{ fontSize: start.fontSize }}
      className="pointer-events-none fixed inset-0 z-40 text-lightModeTextT dark:text-darkModeTextT"
    >
      {stage.trail &&
        TRAIL.map(({ ink }, i) => (
          <div
            key={i}
            ref={(node) => (ghosts.current[i] = node)}
            style={{ transform: origin, opacity: ink }}
            className="absolute left-0 top-0"
          >
            <div className={`absolute -translate-x-1/2 -translate-y-1/2 ${REACH}`}>
              <Mortarboard play={0} />
            </div>
          </div>
        ))}

      <m.div style={{ x, y }} className="absolute left-0 top-0">
        <div className="absolute -translate-x-1/2 -translate-y-1/2">
          <span
            key={score}
            className={`pointer-events-none absolute inset-0 m-auto h-[5.5em] w-[5.5em] animate-ripple rounded-full ${stage.shake
                ? "border-[1.5px] border-lightAccent dark:border-darkAccent"
                : "bg-lightShade dark:bg-darkShade"
              }`}
          />
          <m.div
            onPointerDown={onPointerDown}
            style={{ rotate, scaleX: stretch, scaleY: squash }}
            className={`pointer-events-auto relative cursor-pointer touch-none select-none ${REACH}`}
          >
            <Mortarboard play={score} />
          </m.div>
        </div>
      </m.div>
    </div>,
    document.body
  );
}

// The count, huge and faint behind the page, from the first milestone. Each stage makes it
// bigger: it springs to its new size, and every milestone slams it and flashes it darker.
// Every hit nudges it; from the shaking stage it jolts sideways, and at the top stage it
// beats like a heart, in time with the sound. When the cap is lost it holds the final
// count a moment, then fades. Place it straight inside a section whose content sits
// above it (`relative z-10`), so it shows over the section's background but under its
// text.
export function ScoreBoard({ score, playing }) {
  const level = stageOf(score);
  const stage = STAGES[level];
  const largest = STAGES[STAGES.length - 1].size;
  // Its size as a share of the largest, which the text is set at, so growing is a scale.
  const size = useSpring(STAGES[1].size / largest, { stiffness: 260, damping: 14 });
  const slam = useMotionValue(1);
  const shakeX = useMotionValue(0);
  const beat = useMotionValue(1);
  const ink = useMotionValue(STAGES[1].ink);

  useEffect(() => {
    // A new game starts small again rather than shrinking in from the last one.
    if (!level) size.jump(STAGES[1].size / largest);
    else size.set(stage.size / largest);
  }, [level, stage.size, largest, size]);

  useEffect(() => {
    if (!playing || !level) return;
    if (isMilestone(score)) {
      animate(slam, [1.25, 1], { type: "spring", stiffness: 300, damping: 12 });
      animate(ink, [Math.min(stage.ink * 2.5, 0.3), stage.ink], { duration: 0.8, ease: "easeOut" });
    } else {
      animate(slam, [1.05, 1], { duration: 0.25, ease: "easeOut" });
    }
    if (stage.shake) {
      animate(shakeX, [0, -14, 12, -7, 4, 0], { duration: 0.32, ease: "easeOut" });
    }
  }, [score, playing, level, stage, slam, ink, shakeX]);

  useEffect(() => {
    if (!playing || !stage.heartbeat) return;
    // lub-dub, matching the two beats in the heartbeat sound
    const pulse = () => {
      playSound("heartbeat", { force: true });
      animate(beat, [1, 1.06, 1, 1.035, 1], { duration: 0.9, times: [0, 0.15, 0.3, 0.45, 1] });
    };
    pulse();
    const id = setInterval(pulse, 900);
    return () => clearInterval(id);
  }, [playing, stage.heartbeat, beat]);

  return (
    <AnimatePresence>
      {playing && level > 0 && (
        <m.div
          key="score"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 1.2, duration: 0.6 } }}
          className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden md:left-16"
        >
          <m.div style={{ scale: size }}>
            <m.div style={{ scale: slam, x: shakeX }}>
              <m.span
                style={{ scale: beat, opacity: ink }}
                className={`block text-[90vmin] font-semibold leading-none tracking-[-0.06em] tabular-nums ${stage.accent
                    ? "text-lightAccent dark:text-darkAccent"
                    : "text-lightModeTextT dark:text-darkModeTextT"
                  }`}
              >
                {score}
              </m.span>
            </m.div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

// The cap by the photo. At rest it bobs and swings its tassel like any `Toy`; a click
// starts the game, except with reduced motion, where it only swings the tassel.
// `onGame` hears the score and whether the cap is still up, for the `ScoreBoard`.
export default function GradCap({ label, bob, order, tilt, onGame }) {
  const reduceMotion = useReducedMotion();
  const [flight, setFlight] = useState(null);
  const [returns, setReturns] = useState(0);
  const [bursts, setBursts] = useState([]);
  const timers = useRef([]);
  // The cap's size, which confetti is measured in; it stays after the flight ends.
  const lastSize = useRef("16px");

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const throwConfetti = (burst) => {
    setBursts((list) => [...list, burst]);
    const timer = setTimeout(() => {
      timers.current = timers.current.filter((item) => item !== timer);
      setBursts((list) => list.filter((item) => item !== burst));
    }, burst.duration);
    timers.current.push(timer);
  };

  const launch = (event) => {
    const drawing = event.currentTarget.querySelector("svg");
    const box = drawing.getBoundingClientRect();
    const body = {
      x: box.left + box.width / 2,
      y: box.top + box.height / 2,
      vx: 0,
      vy: 0,
      angle: tilt,
      spin: 0,
      score: 1,
    };
    const width = drawing.clientWidth || box.width;
    hit(body, clamp((event.clientX - body.x) / (width / 2), -1, 1));
    playSound("toss", { force: true });
    lastSize.current = getComputedStyle(drawing).fontSize;
    setFlight({
      body,
      width,
      height: drawing.clientHeight || box.height,
      fontSize: lastSize.current,
    });
    onGame({ score: 1, playing: true });
  };

  const land = (score) => {
    setFlight(null);
    setReturns((count) => count + 1);
    onGame({ score, playing: false });
  };

  return (
    <>
      <m.div
        key={returns}
        initial={returns ? { opacity: 0, scale: 0.6 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.45, duration: 0.7, delay: 0.4 }}
        className={flight ? "invisible" : undefined}
      >
        <Toy
          Drawing={Mortarboard}
          label={label}
          bob={bob}
          order={order}
          rotate={tilt}
          onTap={reduceMotion ? undefined : launch}
        />
      </m.div>
      {flight && (
        <Flight
          start={flight}
          onScore={(score) => onGame({ score, playing: true })}
          onGone={land}
          throwConfetti={throwConfetti}
        />
      )}
      {bursts.length > 0 && <Confetti bursts={bursts} fontSize={lastSize.current} />}
    </>
  );
}
