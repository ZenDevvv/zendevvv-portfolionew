import { useLayoutEffect } from "react";
import { watchLenis } from "./smoothScroll";

// The curve the page takes wherever scrolling hands over between moving and holding
// still: where the projects turn sideways, and where the Experience heading pins.

// How round the turn is, as a share of the screen's height: half the scroll distance
// over which one speed hands over to the other.
export const CURVE = 0.7;

// Across a hand-off, the new speed builds from nothing to 1:1 with the scroll along a
// smoothstep, so it starts and finishes changing gently. This is how far it has carried
// things `t` of the way (0 to 1) through a hand-off 2 × `curve` px long.
export const handedOver = (t, curve) => curve * (2 * t ** 3 - t ** 4);

// How far to shift a pinned element from where sticky positioning puts it, `u` px of
// scroll after it would pin and `length` px before it would let go, so it slows into
// place instead of stopping dead, and starts moving off slowly at the end.
export function lift(u, length, curve) {
  if (Math.abs(u) < curve) {
    const t = (u + curve) / (2 * curve);
    return handedOver(t, curve) - u - Math.max(-u, 0);
  }
  const w = u - length;
  if (Math.abs(w) < curve) return Math.max(w, 0) - handedOver((w + curve) / (2 * curve), curve);
  return 0;
}

// Gives a `position: sticky` element that curve. When it only stays pinned briefly, the
// curve shrinks to fit, so it glides to a standstill and straight off again. Only while
// Lenis runs the scroll: updating from Lenis's own frame keeps the shift in step with the
// pin, which scrolling off the main thread (touch screens) can't promise.
export function useEasedSticky(ref) {
  useLayoutEffect(() => {
    const element = ref.current;
    const parent = element.parentElement;
    // start: the scroll position where it pins. length: how long it stays pinned.
    const range = { start: 0, length: 0, curve: 0 };
    let lenis = null;
    let stopLenis = null;
    let shown = 0;
    let measureRequest = 0;

    const update = () => {
      const offset =
        lenis && range.length > 0
          ? lift(window.scrollY - range.start, range.length, range.curve)
          : 0;
      if (offset === shown) return;
      element.style.transform = offset ? `translate3d(0, ${offset}px, 0)` : "";
      shown = offset;
    };

    // Where the element sits before it pins, and how far sticky carries it, which ends
    // where its bottom meets the bottom of its parent. Not sticky (small screens): nothing.
    const measure = () => {
      range.length = 0;
      const style = getComputedStyle(element);
      if (style.position === "sticky") {
        element.style.transform = "";
        element.style.position = "static";
        const natural = element.getBoundingClientRect().top + window.scrollY;
        element.style.position = "";
        const parentBottom =
          parent.getBoundingClientRect().bottom +
          window.scrollY -
          parseFloat(getComputedStyle(parent).paddingBottom);
        const length = Math.max(parentBottom - natural - element.offsetHeight, 0);
        const curve = Math.min(CURVE * window.innerHeight, length / 2);
        Object.assign(range, { start: natural - parseFloat(style.top), length, curve });
      }
      shown = NaN;
      update();
    };

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(measureRequest);
      measureRequest = requestAnimationFrame(measure);
    });
    observer.observe(document.body);
    measure();

    const stopWatching = watchLenis((instance) => {
      stopLenis?.();
      lenis = instance;
      stopLenis = lenis ? lenis.on("scroll", update) : null;
      update();
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(measureRequest);
      stopWatching();
      stopLenis?.();
      element.style.transform = "";
    };
  }, [ref]);
}
