import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion as m, useMotionValue, useReducedMotion } from "framer-motion";
import { LuArrowLeft, LuArrowRight, LuX } from "react-icons/lu";
import { watchLenis } from "../smoothScroll";
import { Keycap } from "./HeroObjects";
import { soundOn } from "../sounds";

const ease = [0.22, 1, 0.36, 1];
// A swipe this far, or this fast (px per second), moves to the next or previous shot.
const SWIPE = 80;
const FLICK = 500;
// How stiff the strip's spring is (its natural frequency, per second). At 18 a move
// settles in about half a second.
const SPRING = 18;

// The strip's spring: critically damped, so it eases to rest without overshooting. It's
// stepped here every frame instead of restarted on each press, so another press only moves
// where it's pulling: a quick run of presses speeds the strip up without a hitch, and it
// never snaps the last stretch. Each step is the exact solution over the frame's time.
function createSpring(x) {
  let target = 0;
  let velocity = 0;
  let frame = 0;
  let time = 0;

  const step = (now) => {
    const dt = Math.max(0, Math.min((now - time) / 1000, 0.05));
    time = now;
    const offset = x.get() - target;
    const decay = Math.exp(-SPRING * dt);
    const pull = velocity + SPRING * offset;
    const next = (offset + pull * dt) * decay;
    velocity = (pull - SPRING * (offset + pull * dt)) * decay;
    if (Math.abs(next) < 0.5 && Math.abs(velocity) < 10) {
      x.set(target);
      velocity = 0;
      frame = 0;
      return;
    }
    x.set(target + next);
    frame = requestAnimationFrame(step);
  };

  return {
    // Head for `to`, keeping the current speed, or taking `speed` (px/s) after a swipe.
    glide(to, speed = velocity) {
      target = to;
      velocity = speed;
      if (!frame) {
        time = performance.now();
        frame = requestAnimationFrame(step);
      }
    },
    jump(to) {
      this.stop();
      target = to;
      x.set(to);
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      velocity = 0;
    },
  };
}

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-lightAccent dark:focus-visible:ring-darkAccent";

// The arrows are the hero's keycaps and click like them. Dimmed and inert at either end.
function ArrowKey({ Icon, label, disabled, onClick, className }) {
  const sound = soundOn("key", `viewer:${label}`);
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onPointerEnter={sound.onPointerEnter}
      onClick={() => {
        sound.onClick();
        onClick();
      }}
      className={`group absolute z-10 touch-manipulation select-none rounded-[0.5em] text-[15px] text-lightModeTextT transition-opacity duration-200 disabled:pointer-events-none disabled:opacity-30 dark:text-darkModeTextT md:text-[17px] ${focusRing} ${className}`}
    >
      <Keycap Icon={Icon} />
    </button>
  );
}

// While the viewer is open the page behind it stays put: Lenis stops, and the page can't
// scroll natively either (touch screens).
function useScrollLock() {
  useEffect(() => {
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    let lenis = null;
    const stopWatching = watchLenis((instance) => {
      lenis = instance;
      instance?.stop();
    });
    return () => {
      stopWatching();
      lenis?.start();
      root.style.overflow = overflow;
    };
  }, []);
}

// The shots sit side by side in a strip as wide as the screen each, and the strip slides
// a whole shot to the next one, like a phone's photo viewer: nothing overlaps or fades, and
// a swipe drags the strip itself, so the next shot comes in from the edge under the finger.
function Viewer({ shots, title, index, onGo, onClose }) {
  const dialogRef = useRef(null);
  const stageRef = useRef(null);
  const x = useMotionValue(0);
  const spring = useRef(null);
  spring.current ??= createSpring(x);
  const width = useRef(0);
  const shownIndex = useRef(index);
  const dragged = useRef(false);
  const [stageWidth, setStageWidth] = useState(0);
  const reduceMotion = useReducedMotion();
  const hasPrevious = index > 0;
  const hasNext = index < shots.length - 1;

  useScrollLock();

  // Measured before the first paint, so it opens on the right shot; a resize jumps straight
  // to the shot's new place.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const measure = () => {
      width.current = stage.clientWidth;
      setStageWidth(stage.clientWidth);
      spring.current.jump(-shownIndex.current * stage.clientWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [x]);

  useEffect(() => {
    shownIndex.current = index;
    const target = -index * width.current;
    if (reduceMotion) spring.current.jump(target);
    else spring.current.glide(target);
  }, [index, reduceMotion]);
  useEffect(() => () => spring.current.stop(), []);

  useEffect(() => dialogRef.current?.focus(), []);
  // The neighbours load in the background, so the arrows show them at once.
  useEffect(() => {
    [index - 1, index + 1].forEach((neighbour) => {
      if (shots[neighbour]) new Image().src = shots[neighbour].url;
    });
  }, [index, shots]);

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowLeft" && hasPrevious) {
      event.preventDefault();
      onGo(-1);
    } else if (event.key === "ArrowRight" && hasNext) {
      event.preventDefault();
      onGo(1);
    } else if (event.key === "Tab") {
      // Tab stays inside the viewer.
      const stops = [...dialogRef.current.querySelectorAll("button:not([disabled])")].filter(
        (button) => button.getClientRects().length
      );
      if (!stops.length) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      const at = document.activeElement;
      if (event.shiftKey && (at === first || at === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && at === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  // The strip leaves the finger at the finger's speed and glides on to the next shot, or
  // back to this one after a short swipe.
  const onDragEnd = (_event, { offset, velocity }) => {
    let step = 0;
    if ((offset.x < -SWIPE || velocity.x < -FLICK) && hasNext) step = 1;
    else if ((offset.x > SWIPE || velocity.x > FLICK) && hasPrevious) step = -1;
    x.stop();
    if (reduceMotion) spring.current.jump(-(index + step) * width.current);
    else spring.current.glide(-(index + step) * width.current, velocity.x);
    if (step) onGo(step);
  };

  return (
    <m.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} screenshots`}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.25, ease } }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
      className="fixed inset-0 z-50 flex flex-col overscroll-contain bg-lightBG outline-none dark:bg-darkBG"
    >
      <div className="flex items-center justify-between px-5 py-4 md:px-8 md:py-5">
        <p className="text-[13px] tabular-nums text-lightModeTextP dark:text-darkModeTextP">
          {String(index + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}
        </p>
        <button
            type="button"
            onClick={onClose}
            className={`group flex items-center gap-1.5 rounded-sm text-[13px] font-medium text-lightModeTextP hover:text-lightModeTextT dark:text-darkModeTextP dark:hover:text-darkModeTextT ${focusRing}`}
          >
          Close
          <LuX
            aria-hidden="true"
            className="text-sm transition-transform duration-200 group-hover:rotate-90"
          />
        </button>
      </div>

      {/* Each shot as large as the screen allows. A click on the space around it closes. */}
      <m.div
        ref={stageRef}
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.4, ease } }}
        className="relative min-h-0 flex-1 overflow-hidden"
      >
        <m.div
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -(shots.length - 1) * stageWidth, right: 0 }}
          dragElastic={0.15}
          dragMomentum={false}
          onPointerDownCapture={() => (dragged.current = false)}
          onDragStart={() => {
            dragged.current = true;
            spring.current.stop();
          }}
          onDragEnd={onDragEnd}
          className="absolute inset-0 flex touch-pan-y"
        >
          {shots.map((shot, at) => (
            <div
              key={shot.src}
              aria-hidden={at !== index}
              onClick={(event) => {
                if (!dragged.current && event.target === event.currentTarget) onClose();
              }}
              className="flex h-full w-full shrink-0 items-center justify-center px-5 md:px-28"
            >
              <img
                src={shot.url}
                alt={shot.caption}
                draggable={false}
                loading={Math.abs(at - index) <= 1 ? "eager" : "lazy"}
                decoding="async"
                className="max-h-full max-w-full select-none border border-lightShade dark:border-darkShade"
              />
            </div>
          ))}
        </m.div>
      </m.div>

      {/* Phones put the arrows either side of the caption; wider screens beside the shot */}
      <p
        aria-live="polite"
        className="px-20 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 text-center text-[15px] font-medium text-lightModeTextT dark:text-darkModeTextT md:px-8 md:pb-7"
      >
        <m.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3, ease } }}
          className="inline-block"
        >
          {shots[index].caption}
        </m.span>
      </p>
      <ArrowKey
        Icon={LuArrowLeft}
        label="Previous screenshot"
        disabled={!hasPrevious}
        onClick={() => onGo(-1)}
        className="bottom-[max(1rem,env(safe-area-inset-bottom))] left-5 md:bottom-auto md:left-8 md:top-1/2 md:-translate-y-1/2"
      />
      <ArrowKey
        Icon={LuArrowRight}
        label="Next screenshot"
        disabled={!hasNext}
        onClick={() => onGo(1)}
        className="bottom-[max(1rem,env(safe-area-inset-bottom))] right-5 md:bottom-auto md:right-8 md:top-1/2 md:-translate-y-1/2"
      />
    </m.div>
  );
}

// A project's screenshots full screen, one at a time, over the page. `index` is the shot
// shown, or null when closed.
export default function ShotViewer({ shots, title, index, onGo, onClose }) {
  return createPortal(
    <AnimatePresence>
      {index !== null && (
        <Viewer
          key="viewer"
          shots={shots}
          title={title}
          index={index}
          onGo={onGo}
          onClose={onClose}
        />
      )}
    </AnimatePresence>,
    document.body
  );
}
