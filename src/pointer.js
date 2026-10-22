import { useEffect } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

// Pointer parallax for the line-art objects in the hero and About.

// How far the nearest object drifts against the pointer at the edge of the screen, in px.
const POINTER_REACH = 56;

// The pointer's position on the window, from -1 to 1 on each axis. It stays at 0 on touch
// screens and with reduced motion, so nothing drifts there.
export function usePointer(reduceMotion) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (event) => {
      x.set((event.clientX / window.innerWidth) * 2 - 1);
      y.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion, x, y]);

  return { x, y };
}

// Pointer parallax: `depth` runs from 0 (far) to 1 (near). Near objects drift further and
// follow the pointer quickly (settling in about 0.2 s); far ones drift less and trail
// behind on a looser spring (about 0.5 s, with a touch of float), so a group of them
// never moves as one block.
function followSpring(depth) {
  const speed = 3 + 15 * depth;
  const settle = 0.8 + 0.2 * depth;
  return { stiffness: speed ** 2, damping: 2 * settle * speed, mass: 1 };
}

// How far an object at `depth` has drifted against `pointer` (from `usePointer`), in px.
export function useDrift(pointer, depth) {
  const reach = depth * POINTER_REACH;
  const spring = followSpring(depth);
  const x = useSpring(
    useTransform(pointer.x, (value) => -value * reach),
    spring
  );
  const y = useSpring(
    useTransform(pointer.y, (value) => -value * reach * 0.6),
    spring
  );
  return { x, y };
}
