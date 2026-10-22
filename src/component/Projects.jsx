import { useLayoutEffect, useRef, useState } from "react";
import { motion as m, useReducedMotion } from "framer-motion";
import { LuArrowUpRight } from "react-icons/lu";
import {
  SiCloudinary,
  SiCss3,
  SiExpress,
  SiFramer,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiPrisma,
  SiReact,
  SiReacthookform,
  SiReactquery,
  SiSocketdotio,
  SiTypescript,
  SiZod,
} from "react-icons/si";
import projects from "../assets/json/projects.js";
import { getImageUrl } from "../utils";
import { watchLenis } from "../smoothScroll";
import { CURVE, handedOver, lift } from "../scrollCurve";
import { Keycap } from "./HeroObjects";
import { soundOn } from "../sounds";
import { brandColors } from "../brandColor";

// The names a project's `stack` can use, each shown as its logo. `color` is the logo's brand
// colour (the hex on its simpleicons.org page), which it lights up in while its key is down.
const tech = {
  typescript: { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  javascript: { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  react: { name: "React", Icon: SiReact, color: "#61DAFB" },
  tanstack: { name: "TanStack Query", Icon: SiReactquery, color: "#FF4154" },
  hookform: { name: "React Hook Form", Icon: SiReacthookform, color: "#EC5990" },
  zod: { name: "Zod", Icon: SiZod, color: "#408AFF" },
  framer: { name: "Framer Motion", Icon: SiFramer, color: "#0055FF" },
  html: { name: "HTML", Icon: SiHtml5, color: "#E34F26" },
  css: { name: "CSS", Icon: SiCss3, color: "#1572B6" },
  node: { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
  express: { name: "Express", Icon: SiExpress, color: "#0A0A0A" },
  socketio: { name: "Socket.IO", Icon: SiSocketdotio, color: "#010101" },
  jwt: { name: "JWT", Icon: SiJsonwebtokens, color: "#000000" },
  mongodb: { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
  prisma: { name: "Prisma", Icon: SiPrisma, color: "#2D3748" },
  mysql: { name: "MySQL", Icon: SiMysql, color: "#4479A1" },
  cloudinary: { name: "Cloudinary", Icon: SiCloudinary, color: "#3448C5" },
};
// Each logo's lit colour in both themes, by stack name.
const lit = Object.fromEntries(
  Object.entries(tech).map(([key, { color }]) => [key, brandColors(color)])
);

const ease = [0.22, 1, 0.36, 1];

// Once your wheel or trackpad has been still this long inside the section, the page
// glides to a project.
const INPUT_IDLE = 90;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// The snap glide picks up at the speed the page is already moving and eases to rest, so
// taking over mid-scroll never jolts: a cubic Hermite curve, as progress from 0 to 1.
// `lead` is the starting speed relative to an even glide; capped at 3 it never overshoots,
// and below 0 (still moving away) it carries on briefly before turning back.
const glide = (lead) => (t) => lead * (t ** 3 - 2 * t ** 2 + t) + 3 * t ** 2 - 2 * t ** 3;
// Seconds for a snap: longer for longer distances.
const glideTime = (distance) => clamp(0.4 + distance / 1800, 0.45, 0.85);

// How far the slides have moved sideways once the page is `u` px past the top of the
// runway: 1:1 in the middle, and around each end exactly the speed `lift` takes off the
// frame, so the motion bends round a corner instead of turning on the spot.
function travel(u, length, curve) {
  if (u <= -curve) return 0;
  if (u < curve) return handedOver((u + curve) / (2 * curve), curve);
  if (u <= length - curve) return u;
  if (u < length + curve) {
    const t = (u - length + curve) / (2 * curve);
    return length - curve + 2 * curve * t - handedOver(t, curve);
  }
  return length;
}

const line = "border-lightShade dark:border-darkShade";
const label = "text-sm font-medium text-lightModeTextT dark:text-darkModeTextT";

// The stack as keycaps, the same keys as the hero's links, set straight in a row. Hovering
// one presses it, lights its logo, clicks like the hero's keys and names it beside the
// "Stack" label; a label above each key, as in the hero, would land on the heading or on
// the row above.
// `project` keeps each key's sound cooldown its own, so a quick sweep clicks every key.
function Stack({ names, project }) {
  const [hovered, setHovered] = useState({ title: "", shown: false });
  const keys = names.filter((name) => tech[name]);
  if (!keys.length) return null;

  return (
    <div>
      <p className={`${label} mb-3`}>
        Stack
        {/* Keeps the last name while it fades out */}
        <span
          aria-hidden="true"
          className={`ml-2 font-normal text-lightModeTextP transition-opacity duration-150 dark:text-darkModeTextP ${hovered.shown ? "opacity-100" : "opacity-0"}`}
        >
          {hovered.title}
        </span>
      </p>
      <ul className="flex flex-wrap gap-1.5 text-[13px] text-lightModeTextT dark:text-darkModeTextT">
        {keys.map((name) => {
          const { name: title, Icon } = tech[name];
          const sound = soundOn("key", `${project}:${name}`);
          return (
            <li
              key={name}
              onPointerEnter={(event) => {
                sound.onPointerEnter(event);
                if (event.pointerType === "mouse") setHovered({ title, shown: true });
              }}
              onPointerLeave={() => setHovered((last) => ({ ...last, shown: false }))}
              onClick={sound.onClick}
              className="group cursor-pointer touch-manipulation select-none"
            >
              <Keycap Icon={Icon} color={lit[name]} />
              <span className="sr-only">{title}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// One project across the frame: title and description, the image, then role and stack.
// Phones stack the three; tablets put the image beside the other two.
function Slide({ project, onFocus }) {
  const { title, description, demo, role, stack = [], cover, imageSrc } = project;

  return (
    <article
      onFocus={onFocus}
      className={`grid h-full w-full shrink-0 grid-rows-[auto_minmax(0,1fr)_auto] border-r ${line} md:grid-cols-2 md:grid-rows-[minmax(0,1fr)_auto] lg:grid-cols-[34fr_37fr_29fr] lg:grid-rows-1`}
    >
      <div className="min-h-0 px-5 pt-10 md:px-10 md:pt-[clamp(4.5rem,11svh,7rem)] lg:px-[clamp(2.5rem,3.5vw,3.5rem)]">
        <h3 className="text-[clamp(1.5rem,1.1rem+1vw,2rem)] font-semibold leading-tight tracking-[-0.03em] text-lightModeTextT dark:text-darkModeTextT">
          {demo ? (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-lightAccent dark:focus-visible:ring-darkAccent"
            >
              {title}
              <LuArrowUpRight
                aria-hidden="true"
                className="ml-1 inline-block align-[-0.08em] text-[0.7em] text-lightModeTextP transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 dark:text-darkModeTextP"
              />
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="mt-4 line-clamp-5 max-w-[30rem] text-pretty text-[15px] leading-relaxed text-lightModeTextP dark:text-darkModeTextP md:mt-5 md:line-clamp-none md:text-base">
          {description}
        </p>
      </div>

      {/* The image keeps 4:5 at the largest size the cell allows */}
      <div
        className={`flex min-h-0 items-center justify-center px-5 py-6 [container-type:size] md:col-start-2 md:row-span-2 md:row-start-1 md:border-l md:px-10 md:py-[clamp(3rem,9svh,5.5rem)] lg:px-[clamp(2rem,3.5vw,3.5rem)] ${line}`}
      >
        {/* Until a project has a vertical cover its logo sits on a dark mat, which keeps
            the white ones (RYDE) visible in light mode */}
        <div
          className={`aspect-[4/5] w-[min(100cqw,80cqh)] overflow-hidden ${cover ? "bg-secondaryLightBG" : "bg-lightModeTextT"} dark:bg-secondaryDarkBG`}
        >
          <img
            src={getImageUrl(cover ?? imageSrc)}
            alt=""
            decoding="async"
            className={`h-full w-full ${cover ? "object-cover" : "object-contain"}`}
          />
        </div>
      </div>

      <div
        className={`flex flex-col gap-6 px-5 pb-28 md:col-start-1 md:row-start-2 md:border-t md:px-10 md:py-8 lg:col-start-3 lg:row-start-1 lg:justify-between lg:border-l lg:border-t-0 lg:px-[clamp(2rem,3vw,3rem)] lg:pb-[clamp(3rem,9svh,5.5rem)] lg:pt-[clamp(4.5rem,11svh,7rem)] ${line}`}
      >
        <div>
          <p className={label}>Role</p>
          <p className="mt-1.5 text-[15px] text-lightModeTextP dark:text-darkModeTextP">{role}</p>
        </div>
        <Stack names={stack} project={title} />
      </div>
    </article>
  );
}

// The page scrolls down a tall runway while a full-screen frame stays pinned and the
// slides move sideways. On the way in the frame slows to a stop as the slides pick up
// speed, and on the way out it does the reverse, so the scroll curves round the corner.
function Runway({ projects }) {
  const runwayRef = useRef(null);
  const frameRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const goToRef = useRef(() => {});
  const count = projects.length;

  useLayoutEffect(() => {
    const runway = runwayRef.current;
    const frame = frameRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    // top: the runway's top on the page. length: how far the frame stays pinned, which is
    // also how far the slides travel. slide: one slide's width. curve: see CURVE.
    const geometry = { top: 0, slide: 0, curve: 0, length: 0 };
    const shown = { x: NaN, y: NaN, progress: NaN };
    // How fast Lenis is moving the page, so a snap can pick up at the same speed.
    const motion = { at: 0, time: 0, speed: 0 };
    let lenis = null;
    let stopLenis = null;
    let settleTimer = 0;
    let measureRequest = 0;

    const update = () => {
      const { top, slide, curve, length } = geometry;
      const u = window.scrollY - top;
      const moved = travel(u, length, curve);
      const x = curve - moved;
      // Touch screens scroll off the main thread, where an eased pin would trail behind
      // the finger, so only scrolling run by Lenis gets the slow landing.
      const y = lenis ? lift(u, length, curve) : 0;
      const progress = count > 1 ? clamp((moved - curve) / ((count - 1) * slide), 0, 1) : 1;

      if (x !== shown.x) track.style.transform = `translate3d(${x}px, 0, 0)`;
      if (y !== shown.y) frame.style.transform = y ? `translate3d(0, ${y}px, 0)` : "";
      if (progress !== shown.progress) bar.style.transform = `scaleX(${progress})`;
      Object.assign(shown, { x, y, progress });
    };

    const measure = () => {
      const height = frame.clientHeight;
      const slide = frame.clientWidth;
      const curve = Math.min(CURVE * height, slide / 2);
      const length = (count - 1) * slide + 2 * curve;
      runway.style.height = `${length + height}px`;
      runway.style.setProperty("--curve", `${curve}px`);
      runway.style.setProperty("--slide", `${slide}px`);
      const top = runway.getBoundingClientRect().top + window.scrollY;
      Object.assign(geometry, { top, slide, curve, length });
      update();
    };

    // Where the page rests with slide `index` square in the frame.
    const restingPlace = (index) => geometry.top + geometry.curve + index * geometry.slide;

    const glideTo = (target) => {
      if (!lenis) {
        if (Math.abs(target - window.scrollY) >= 1) window.scrollTo({ top: target, behavior: "smooth" });
        return;
      }
      const distance = target - lenis.animatedScroll;
      if (Math.abs(distance) < 1 || Math.abs(target - lenis.targetScroll) < 1) return;
      const duration = glideTime(Math.abs(distance));
      // px per second, and only if the page moved within the last couple of frames
      const speed = performance.now() - motion.time < 50 ? motion.speed : 0;
      const lead = clamp((speed * duration) / distance, -3, 3);
      lenis.scrollTo(target, { duration, easing: glide(lead) });
    };

    // Snaps only while the frame is pinned; above or below it the page scrolls freely.
    // It judges by where the scroll is heading, so it can take over before the page has
    // coasted to a stop. A quarter of the way toward the next project in the direction
    // you were scrolling is enough to carry on to it; anything less springs back.
    const settle = () => {
      if (!lenis || !geometry.slide) return;
      const u = lenis.targetScroll - geometry.top;
      if (u < 0 || u > geometry.length) return;
      const position = (u - geometry.curve) / geometry.slide;
      const passed = Math.floor(position);
      const toward = lenis.direction < 0 ? 0.75 : 0.25;
      const index = clamp(position - passed > toward ? passed + 1 : passed, 0, count - 1);
      glideTo(restingPlace(index));
    };
    const settleSoon = () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, INPUT_IDLE);
    };

    goToRef.current = (index) => glideTo(restingPlace(index));

    // Lenis moves the page inside its own animation frame; updating from its event puts
    // the frame and the slides on screen in the same frame as the scroll. Scrolling it
    // doesn't smooth (keys, the scrollbar) settles once Lenis reports it has stopped.
    const onLenisScroll = () => {
      const now = performance.now();
      const elapsed = now - motion.time;
      if (elapsed > 0) motion.speed = ((lenis.animatedScroll - motion.at) / elapsed) * 1000;
      Object.assign(motion, { at: lenis.animatedScroll, time: now });
      update();
      if (!lenis.isScrolling) settleSoon();
    };
    const onScroll = () => {
      if (!lenis) update();
    };

    // Anything above that changes height moves the runway; measuring a frame later keeps
    // the runway's own new height from looping back into the observer.
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(measureRequest);
      measureRequest = requestAnimationFrame(measure);
    });
    observer.observe(document.body);
    observer.observe(frame);
    measure();

    window.addEventListener("scroll", onScroll, { passive: true });
    const stopWatching = watchLenis((instance) => {
      stopLenis?.();
      stopLenis = null;
      lenis = instance;
      if (lenis) {
        const stopScroll = lenis.on("scroll", onLenisScroll);
        // Every wheel or trackpad event restarts the wait, so it snaps once they stop.
        const stopInput = lenis.on("virtual-scroll", settleSoon);
        stopLenis = () => {
          stopScroll();
          stopInput();
        };
      }
      update();
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(measureRequest);
      clearTimeout(settleTimer);
      window.removeEventListener("scroll", onScroll);
      stopWatching();
      stopLenis?.();
    };
  }, [count]);

  return (
    <div ref={runwayRef} className="relative">
      <div
        ref={frameRef}
        className={`sticky top-0 h-svh overflow-clip border-y will-change-transform ${line}`}
      >
        <div ref={trackRef} className="flex h-full will-change-transform">
          {projects.map((project, index) => (
            <Slide
              key={project.title}
              project={project}
              // Tabbing to a slide's link scrolls that slide into the frame.
              onFocus={(event) => {
                if (event.target.matches(":focus-visible")) goToRef.current(index);
              }}
            />
          ))}
        </div>
        <span
          ref={barRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[1.5px] origin-left scale-x-0 bg-lightModeTextT dark:bg-darkModeTextT"
        />
      </div>

      {/* Snap points for touch screens, where the browser snaps natively (see index.css) */}
      {projects.map((project, index) => (
        <span
          key={project.title}
          aria-hidden="true"
          style={{ top: `calc(var(--curve) + ${index} * var(--slide))` }}
          className="absolute left-0 h-px w-px [scroll-snap-align:start]"
        />
      ))}
    </div>
  );
}

// With reduced motion the projects sit in a plain strip that scrolls sideways by hand.
function StillStrip({ projects }) {
  return (
    <div
      role="region"
      aria-label="Selected works"
      tabIndex={0}
      className={`flex h-svh snap-x snap-mandatory overflow-x-auto border-y outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lightAccent dark:focus-visible:ring-darkAccent ${line} [&>*]:snap-start`}
    >
      {projects.map((project) => (
        <Slide key={project.title} project={project} />
      ))}
    </div>
  );
}

export default function Projects() {
  const reduceMotion = useReducedMotion();
  const selected = projects.filter((project) => project.selected);
  if (!selected.length) return null;

  return (
    <section id="projects" aria-labelledby="projects-title" className="bg-lightBG dark:bg-darkBG">
      <m.header
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        className="mx-auto max-w-[66rem] px-5 pb-14 md:px-10 md:pb-20"
      >
        <h2
          id="projects-title"
          className="text-[clamp(2rem,1rem+2.2vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-lightModeTextT dark:text-darkModeTextT"
        >
          <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
            <m.span
              variants={{
                hidden: { y: "110%" },
                shown: { y: "0%", transition: { duration: 0.8, ease } },
              }}
              className="inline-block"
            >
              Selected works
            </m.span>
          </span>
        </h2>
      </m.header>

      {reduceMotion ? <StillStrip projects={selected} /> : <Runway projects={selected} />}
    </section>
  );
}
