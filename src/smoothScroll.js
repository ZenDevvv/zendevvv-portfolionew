import { useEffect } from "react";
import "lenis/dist/lenis.css";

// Smooth wheel and trackpad scrolling (Lenis). The page still scrolls natively
// underneath, so sticky elements, scroll-linked animations and the section
// observer all keep working; Lenis only eases where each wheel tick lands.

// Share of the remaining distance the page covers each frame, from 0 to 1. Lower
// glides longer and feels floatier; 1 turns the smoothing off. Lenis's default is 0.1.
const LERP = 0.10;
// Distance per wheel tick, as a multiple of the browser's own step.
const WHEEL_MULTIPLIER = 1;

// The running Lenis, for scroll-linked motion that has to land in the same frame as the
// scroll itself. Stays null on touch screens, under reduced motion and until Lenis loads.
let current = null;
const watchers = new Set();

function setCurrent(lenis) {
  current = lenis;
  watchers.forEach((watch) => watch(lenis));
}

// Calls `watch` with the running Lenis now and whenever it starts or stops.
// Returns a function that stops watching.
export function watchLenis(watch) {
  watchers.add(watch);
  watch(current);
  return () => watchers.delete(watch);
}

// Phones and tablets keep their native touch scrolling, and visitors who ask for
// reduced motion get plain scrolling, so neither downloads Lenis at all.
export function useSmoothScroll() {
  useEffect(() => {
    const wantsSmooth = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)"
    ).matches;
    if (!wantsSmooth) return;

    let lenis;
    let cancelled = false;
    // Loaded after first paint, in its own small chunk, so it never delays the page.
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        lerp: LERP,
        wheelMultiplier: WHEEL_MULTIPLIER,
        // section links glide to their section with the same easing
        anchors: true,
        autoRaf: true,
      });
      setCurrent(lenis);
    });

    return () => {
      cancelled = true;
      if (!lenis) return;
      lenis.destroy();
      if (current === lenis) setCurrent(null);
    };
  }, []);
}
