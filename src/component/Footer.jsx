import { useRef, useState } from "react";
import { motion as m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { LuArrowUp, LuVolume2, LuVolumeX } from "react-icons/lu";
import { isMuted, playSound, setMuted, soundOn } from "../sounds";

const WORDMARK = [..."<ZenDevvv/>"];

const quietLink =
  "group flex items-center gap-1.5 rounded-sm outline-none hover:text-lightModeTextT focus-visible:ring-2 focus-visible:ring-lightAccent dark:hover:text-darkModeTextT dark:focus-visible:ring-darkAccent";

// The page signs off with the nav's wordmark, written large in outline. It fills with ink
// letter by letter as the page reaches its end (`.ink-fill` in index.css), so the closing
// tag is the last thing drawn. Each letter knocks dully under the mouse or a tap, the Skills
// finder's `miss`, with its own cooldown so a sweep across the word sounds every letter.
export default function Footer() {
  const footerRef = useRef(null);
  const reduceMotion = useReducedMotion();
  // Over the footer's last stretch of scroll: from the wordmark's top coming into view (about
  // 0.15 of the way, past the line and space above it) to just short of the page's end, so
  // the last letter is seen filling.
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const fill = useTransform(scrollYProgress, [0.15, 0.97], reduceMotion ? [1, 1] : [0, 1]);
  const [muted, setMutedState] = useState(isMuted);

  const toggleSound = () => {
    setMuted(!muted);
    setMutedState(!muted);
    if (muted) playSound("key", { force: true });
  };

  return (
    <footer ref={footerRef} className="bg-lightBG dark:bg-darkBG">
      <div className="mx-auto max-w-[66rem] px-5 md:px-10">
        <m.p
          aria-hidden="true"
          style={{ "--fill": fill, "--steps": WORDMARK.length + 3 }}
          className="ink-fill flex select-none whitespace-nowrap border-t border-lightShade pt-8 text-[length:calc((100vw_-_40px)/6.05)] font-semibold leading-none tracking-[-0.05em] dark:border-darkShade md:pt-12 md:text-[length:calc((min(66rem,100vw_-_64px)_-_80px)/6.05)]"
        >
          {WORDMARK.map((char, index) => (
            <span
              key={index}
              data-char={char}
              style={{ "--i": index }}
              {...soundOn("miss", `wordmark:${index}`)}
            >
              {char}
            </span>
          ))}
        </m.p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-lightShade py-6 text-[13px] text-lightModeTextP dark:border-darkShade dark:text-darkModeTextP md:mt-10">
          <p>© {new Date().getFullYear()} Zen Andrei Obrero</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={toggleSound}
              aria-label="Sound"
              aria-pressed={!muted}
              className={quietLink}
            >
              {muted ? <LuVolumeX className="text-sm" /> : <LuVolume2 className="text-sm" />}
              Sound {muted ? "off" : "on"}
            </button>
            <a href="#home" className={quietLink}>
              Back to top
              <LuArrowUp className="transition-transform duration-200 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
