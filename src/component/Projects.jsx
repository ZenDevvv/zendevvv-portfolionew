import { useLayoutEffect, useRef } from "react";
import { motion as m, useReducedMotion } from "framer-motion";
import { LuArrowRight } from "react-icons/lu";
import projects from "../assets/json/projects.js";
import { projectPath } from "../utils";
import { coverOf } from "../gallery";
import { watchLenis } from "../smoothScroll";
import { CURVE, handedOver, lift } from "../scrollCurve";
import Stack from "./ProjectStack";
import ProjectCover from "./ProjectCover";

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

// While the frame is still rising into its pin, or lifting away after it, the slides
// already drift sideways at this share of the scroll, so they move from the moment any of
// the frame shows until the last of it has gone; the turn adds the rest. It's slower where
// it would start the first slide more than ENTRY_OFFSET of a slide to the right, so some
// of it is always in view as the frame comes in (tall, narrow screens).
const DRIFT = 0.35;
const ENTRY_OFFSET = 0.75;

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

// A slide's picture fills its whole cell until the cell starts to come on screen, then
// scales down into its frame as the slide comes in, tied to the scroll. `arrived` runs from
// 0 (first pixel showing) to 1 (the slide at rest); most of the zoom happens early, so it
// moves the moment the slide appears and settles as it lands.
const zoomAt = (fill, arrived) => 1 + (fill - 1) * (1 - arrived) ** 3;

// One project across the frame: title and description, the image, then role and stack.
// Phones stack the three; tablets put the image beside the other two. The title and the
// image open the project's own page. `coverRef` gets the image's cell, for the runway's zoom.
function Slide({ project, onFocus, coverRef }) {
  const { title, description, role, stack = [], imageSrc } = project;
  const shots = coverOf(project);
  const href = projectPath(project);

  return (
    <article
      onFocus={onFocus}
      className={`grid h-full w-full shrink-0 grid-rows-[auto_minmax(0,1fr)_auto] border-r ${line} md:grid-cols-2 md:grid-rows-[minmax(0,1fr)_auto] lg:grid-cols-[34fr_37fr_29fr] lg:grid-rows-1`}
    >
      <div className="min-h-0 px-5 pt-10 md:px-10 md:pt-[clamp(4.5rem,11svh,7rem)] lg:px-[clamp(2.5rem,3.5vw,3.5rem)]">
        <h3 className="text-[clamp(1.5rem,1.1rem+1vw,2rem)] font-semibold leading-tight tracking-[-0.03em] text-lightModeTextT dark:text-darkModeTextT">
          <a
            href={href}
            className="group/link rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-lightAccent dark:focus-visible:ring-darkAccent"
          >
            {title}
            <LuArrowRight
              aria-hidden="true"
              className="ml-1.5 inline-block align-[-0.08em] text-[0.7em] text-lightModeTextP transition-transform duration-200 group-hover/link:translate-x-1 dark:text-darkModeTextP"
            />
          </a>
        </h3>
        <p className="mt-4 line-clamp-5 max-w-[30rem] text-pretty text-[15px] leading-relaxed text-lightModeTextP dark:text-darkModeTextP md:mt-5 md:line-clamp-none md:text-base">
          {description}
        </p>
      </div>

      {/* The image keeps 4:5 at the largest size the cell allows. The cell clips it while it
          zooms out from filling the column. */}
      <div
        ref={coverRef}
        className={`flex min-h-0 items-center justify-center overflow-hidden px-5 py-6 [container-type:size] md:col-start-2 md:row-span-2 md:row-start-1 md:border-l md:px-10 md:py-[clamp(3rem,9svh,5.5rem)] lg:px-[clamp(2rem,3.5vw,3.5rem)] ${line}`}
      >
        {/* Until a project has screenshots its logo sits on a dark mat, which keeps
            the white ones (RYDE) visible in light mode */}
        {/* The title's link again, for the mouse; keyboards and screen readers use the title */}
        <a
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className={`block aspect-[4/5] w-[min(100cqw,80cqh)] overflow-hidden ${shots.length ? "bg-secondaryLightBG" : "bg-lightModeTextT"} dark:bg-secondaryDarkBG`}
        >
          <ProjectCover shots={shots} imageSrc={imageSrc} />
        </a>
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
// slides move sideways. They start drifting as soon as the frame shows; then the frame
// slows to a stop as the slides pick up speed, and on the way out it does the reverse, so
// the scroll curves round the corner.
function Runway({ projects }) {
  const runwayRef = useRef(null);
  const frameRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const coversRef = useRef([]);
  const goToRef = useRef(() => {});
  const count = projects.length;

  useLayoutEffect(() => {
    const runway = runwayRef.current;
    const frame = frameRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    // top: the runway's top on the page. length: how far the frame stays pinned. slide: one
    // slide's width. height: the frame's. curve: see CURVE. drift: see DRIFT.
    const geometry = { top: 0, slide: 0, height: 0, curve: 0, length: 0, drift: 0 };
    const shown = { x: NaN, y: NaN, progress: NaN };
    // Each slide's picture: where its cell sits in the slide (left) and in the frame (top),
    // and the scale at which it fills the cell.
    let covers = [];
    // How fast Lenis is moving the page, so a snap can pick up at the same speed.
    const motion = { at: 0, time: 0, speed: 0 };
    let lenis = null;
    let stopLenis = null;
    let settleTimer = 0;
    let measureRequest = 0;

    const update = () => {
      const { top, slide, height, curve, length, drift } = geometry;
      const u = window.scrollY - top;
      const viewport = window.innerHeight;
      // The drift runs from the frame's top showing at the bottom of the window (u is minus
      // the window's height) to its bottom leaving the top. Both ends fall where none of the
      // frame is on screen, so its start and stop can't be seen. In the middle this comes to
      // curve - u, as without the drift, so the slides rest at the same places.
      const reach = Math.max(viewport, height);
      const x =
        curve -
        drift * clamp(u, -reach, length + reach) -
        (1 - drift) * travel(u, length, curve);
      // Touch screens scroll off the main thread, where an eased pin would trail behind
      // the finger, so only scrolling run by Lenis gets the slow landing.
      const y = lenis ? lift(u, length, curve) : 0;
      const progress = count > 1 ? clamp(-x / ((count - 1) * slide), 0, 1) : 1;

      if (x !== shown.x) track.style.transform = `translate3d(${x}px, 0, 0)`;
      if (y !== shown.y) frame.style.transform = y ? `translate3d(0, ${y}px, 0)` : "";
      if (progress !== shown.progress) bar.style.transform = `scaleX(${progress})`;
      Object.assign(shown, { x, y, progress });

      // Each picture zooms as its cell comes on screen: from the right edge to its place as
      // the slides move sideways, and up from the bottom of the window as the frame rises
      // into its pin. The first slide does both at once round the corner, so the two are
      // multiplied: it keeps zooming while either moves. Past its place (gone off to the
      // left, or lifted away above) it stays at rest.
      const frameTop = (u < 0 ? -u : Math.min(length - u, 0)) + y;
      covers.forEach((cover, index) => {
        const slideLeft = index * slide + x;
        const across = (slide - cover.left - slideLeft) / Math.max(slide - cover.left, 1);
        const up = (viewport - frameTop - cover.top) / Math.max(viewport - cover.top, 1);
        const scale = zoomAt(cover.fill, clamp(across, 0, 1) * clamp(up, 0, 1));
        if (scale === cover.shown) return;
        cover.picture.style.transform = scale === 1 ? "" : `scale(${scale})`;
        cover.shown = scale;
      });
    };

    const measure = () => {
      const height = frame.clientHeight;
      const slide = frame.clientWidth;
      const curve = Math.min(CURVE * height, slide / 2);
      const length = (count - 1) * slide + 2 * curve;
      // The first slide starts curve + drift × height to the right of its place.
      const drift = clamp((ENTRY_OFFSET * slide - curve) / height, 0, DRIFT);
      runway.style.height = `${length + height}px`;
      runway.style.setProperty("--curve", `${curve}px`);
      runway.style.setProperty("--slide", `${slide}px`);
      const top = runway.getBoundingClientRect().top + window.scrollY;
      Object.assign(geometry, { top, slide, height, curve, length, drift });

      // The frame's and the track's own transforms apply to the cells too, so they cancel
      // out here. The cell's padding box is the column; the picture is centred in it.
      const frameBox = frame.getBoundingClientRect();
      const trackBox = track.getBoundingClientRect();
      covers = coversRef.current.slice(0, count).map((cell, index) => {
        const picture = cell.firstElementChild;
        const box = cell.getBoundingClientRect();
        return {
          picture,
          left: box.left - trackBox.left - index * slide,
          top: box.top - frameBox.top,
          fill: picture.offsetWidth
            ? Math.max(cell.clientWidth / picture.offsetWidth, cell.clientHeight / picture.offsetHeight)
            : 1,
          shown: NaN,
        };
      });
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
              coverRef={(cell) => (coversRef.current[index] = cell)}
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
    // The section has no top padding (Experience's bottom padding is the gap), so links to
    // #projects stop a little above the heading rather than on it.
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="scroll-mt-16 bg-lightBG dark:bg-darkBG md:scroll-mt-24 lg:scroll-mt-28"
    >
      <m.header
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.08 } } }}
        className="mx-auto flex max-w-[66rem] flex-wrap items-end justify-between gap-x-8 gap-y-4 px-5 pb-14 md:px-10 md:pb-20"
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
        {/* The rest live on their own page, professional, side and personal */}
        <m.a
          href="/projects/"
          variants={{
            hidden: { opacity: 0, y: 20 },
            shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
          }}
          className="group mb-[0.35em] inline-flex items-center gap-1.5 rounded-sm text-[15px] font-medium text-lightModeTextT outline-none focus-visible:ring-2 focus-visible:ring-lightAccent dark:text-darkModeTextT dark:focus-visible:ring-darkAccent md:text-base"
        >
          See all projects
          <span className="tabular-nums text-lightModeTextP dark:text-darkModeTextP">
            {projects.length}
          </span>
          <LuArrowRight
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </m.a>
      </m.header>

      {reduceMotion ? <StillStrip projects={selected} /> : <Runway projects={selected} />}
    </section>
  );
}
