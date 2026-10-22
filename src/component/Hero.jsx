import { Fragment, useRef } from "react";
import { motion as m, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { LuArrowUpRight, LuChevronsDown, LuMapPin } from "react-icons/lu";
import resume from "../assets/Zen Andrei Obrero resume.pdf";
import { FloatingObjects, Keycaps } from "./HeroObjects";
import { usePointer } from "../pointer";
import { Wordmark } from "./Navbar";

const ease = [0.22, 1, 0.36, 1];
const nameWords = ["Zen", "Andrei", "Obrero"];
const pointerSpring = { stiffness: 60, damping: 18, mass: 0.8 };

// Moves a layer `distance` px while the hero scrolls out of view.
function useScrollDepth(progress, distance, reduceMotion) {
  return useTransform(progress, [0, 1], [0, reduceMotion ? 0 : distance]);
}

export default function Hero() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Pointer position from -1 to 1 on each axis. The text follows an eased copy; each
  // floating object eases the raw position on its own spring, set by its depth.
  const pointer = usePointer(reduceMotion);
  const textPointerX = useSpring(pointer.x, pointerSpring);

  // Scroll parallax: upper layers rise faster and lower ones lag, so the
  // intro spreads apart as it leaves instead of sliding up as one block.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const greetingY = useScrollDepth(scrollYProgress, -150, reduceMotion);
  const nameY = useScrollDepth(scrollYProgress, -110, reduceMotion);
  const introY = useScrollDepth(scrollYProgress, -70, reduceMotion);
  const linksY = useScrollDepth(scrollYProgress, -35, reduceMotion);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const textX = useTransform(textPointerX, (value) => value * 5);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-lightBG dark:bg-darkBG"
    >
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 flex items-center justify-between px-5 pt-5 md:justify-end md:px-8 md:pt-6"
      >
        <Wordmark className="md:hidden" />
        <a
          href={resume}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1 rounded-sm text-[13px] font-medium text-lightModeTextP outline-none hover:text-lightModeTextT focus-visible:ring-2 focus-visible:ring-lightAccent dark:text-darkModeTextP dark:hover:text-darkModeTextT dark:focus-visible:ring-darkAccent"
        >
          Résumé
          <LuArrowUpRight className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </m.div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-5 pb-20 pt-6 text-center md:pb-16">
        <div className="relative">
          <FloatingObjects
            motion={{ pointer, progress: scrollYProgress, reduceMotion }}
          />

          <m.div style={{ x: textX }} className="relative z-10 flex flex-col items-center">
            <h1 className="flex flex-col items-center">
              <m.span style={{ y: greetingY, opacity: textOpacity }} className="block">
                <m.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.1 }}
                  className="block text-sm font-normal text-lightModeTextP dark:text-darkModeTextP md:text-[15px]"
                >
                  Kumusta! I&apos;m
                </m.span>
              </m.span>

              <m.span
                style={{ y: nameY, opacity: textOpacity }}
                className="mt-2 block text-[clamp(2.25rem,1.1rem+2.7vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-lightModeTextT dark:text-darkModeTextT"
              >
                {nameWords.map((word, index) => (
                  <Fragment key={word}>
                    <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                      <m.span
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 0.8, ease, delay: 0.2 + index * 0.08 }}
                        className="inline-block"
                      >
                        {word}
                      </m.span>
                    </span>
                    {index < nameWords.length - 1 && " "}
                  </Fragment>
                ))}
              </m.span>
            </h1>

            <m.div style={{ y: introY, opacity: textOpacity }}>
              <m.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.45 }}
                className="mx-auto mt-4 max-w-[27rem] text-[15px] leading-relaxed text-lightModeTextP dark:text-darkModeTextP md:text-base"
              >
                I&apos;m a{" "}
                <span className="font-medium text-lightModeTextT dark:text-darkModeTextT">
                  fullstack developer
                </span>{" "}
                building <span className="whitespace-nowrap">multi-tenant</span> platforms
                for IoT, healthcare, finance, education and more.
              </m.p>
            </m.div>

            <m.div style={{ y: linksY, opacity: textOpacity }} className="mt-8">
              <Keycaps />
            </m.div>

            <m.div style={{ opacity: textOpacity }}>
              <m.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[13px] text-lightModeTextP dark:text-darkModeTextP"
              >
                <li className="flex items-center gap-1.5">
                  <LuMapPin className="text-sm" />
                  Dasmariñas, Cavite, PH
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-lightAccent dark:bg-darkAccent" />
                  Open to work
                </li>
              </m.ul>
            </m.div>
          </m.div>
        </div>
      </div>

      <m.a
        href="#experience"
        aria-label="Scroll to Experience"
        style={{ opacity: cueOpacity }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 rounded-full p-1 text-lightModeTextP outline-none hover:text-lightModeTextT focus-visible:ring-2 focus-visible:ring-lightAccent dark:text-darkModeTextP dark:hover:text-darkModeTextT md:left-[calc(50%+32px)] md:block"
      >
        <m.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 5, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 1.6 },
            y: { duration: 1.8, ease: "easeInOut", repeat: Infinity, delay: 1.6 },
          }}
          className="block"
        >
          <LuChevronsDown className="text-base" />
        </m.span>
      </m.a>
    </section>
  );
}
