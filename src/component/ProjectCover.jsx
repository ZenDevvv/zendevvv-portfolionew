import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { getImageUrl } from "../utils";
import { COVER_SECONDS_PER_SHOT } from "../gallery";

// A project's picture on the slides and in the all-projects list, from the gallery shots it
// flags as covers (`shots`, from coverOf), each cropped to the portrait box where its `focus`
// says: one is a still, several cut from one to the next. Without any, the logo, contained.
export default function ProjectCover({ shots, imageSrc }) {
  if (shots.length === 1) {
    const [{ url, focus = 0.5 }] = shots;
    return (
      <img
        src={url}
        alt=""
        loading="lazy"
        decoding="async"
        style={{ objectPosition: `${focus * 100}% 50%` }}
        className="h-full w-full object-cover"
      />
    );
  }
  if (!shots.length) {
    return (
      <img
        src={getImageUrl(imageSrc)}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-contain"
      />
    );
  }
  return <Preview shots={shots} />;
}

// The screenshots stacked in the box, one showing at a time. It plays only while on screen,
// and only through the ones that have loaded. With reduced motion it holds on the first.
//
// No blank frames between cuts: a browser doesn't keep hidden (opacity 0) images decoded, so
// a shot switched on cold showed the empty box for a moment while it decoded. Each cut now
// waits for the next shot's decode() before switching, and the outgoing shot stays visible
// underneath the incoming one until the next cut, so a late decode shows the previous shot
// instead of the box.
function Preview({ shots }) {
  const ref = useRef(null);
  const images = useRef([]);
  const loaded = useRef(new Set());
  const onScreen = useInView(ref);
  const reduceMotion = useReducedMotion();
  const [readyCount, setReadyCount] = useState(0);
  const [view, setView] = useState({ current: 0, previous: -1 });
  const frames = reduceMotion ? shots.slice(0, 1) : shots;
  const current = view.current < frames.length ? view.current : 0;
  const previous = view.previous < frames.length ? view.previous : -1;
  const showing = useRef(current);
  showing.current = current;
  const canPlay = onScreen && readyCount >= 2;

  useEffect(() => {
    if (!canPlay) return;
    let live = true;
    const timer = setInterval(() => {
      const from = showing.current;
      let next = from;
      for (let step = 1; step <= frames.length; step++) {
        const at = (from + step) % frames.length;
        if (loaded.current.has(at)) {
          next = at;
          break;
        }
      }
      const image = images.current[next];
      if (next === from || !image) return;
      image
        .decode()
        .catch(() => {})
        .then(() => live && setView({ current: next, previous: from }));
    }, COVER_SECONDS_PER_SHOT * 1000);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [canPlay, frames.length]);

  return (
    <div ref={ref} className="relative h-full w-full">
      {frames.map(({ url, focus = 0.5 }, index) => (
        <img
          key={url}
          ref={(image) => (images.current[index] = image)}
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => {
            loaded.current.add(index);
            setReadyCount(loaded.current.size);
          }}
          style={{ objectPosition: `${focus * 100}% 50%` }}
          className={`absolute inset-0 h-full w-full object-cover ${
            index === current ? "z-[1]" : index === previous ? "" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
