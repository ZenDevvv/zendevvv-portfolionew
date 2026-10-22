// Small synthesized sound effects (Web Audio API), so no audio files ship with the site.
//
// Browsers only allow a page to make sound after the visitor has clicked, tapped or
// pressed a key on it, so until then every sound is silently skipped.

const COOLDOWN_MS = 300;
const lastPlayed = {};
let context;
let output;
let noiseBuffer;
// each play is tuned a few percent up or down, so repeated clicks don't sound robotic
let pitch = 1;

function getContext() {
  if (context) return context;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  context = new AudioContext();
  output = context.createGain();
  output.gain.value = 0.6;
  // a limiter, so many overlapping sounds from fast clicking never distort
  const limiter = context.createDynamicsCompressor();
  limiter.threshold.value = -12;
  limiter.knee.value = 6;
  limiter.ratio.value = 12;
  limiter.attack.value = 0.002;
  limiter.release.value = 0.15;
  output.connect(limiter).connect(context.destination);

  // one second of white noise, reused for clicks, rustles and strikes
  noiseBuffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
  const samples = noiseBuffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;

  return context;
}

// A short percussive envelope: rises over `attack`, dies away over `decay` (seconds).
function envelope(at, attack, decay, gain) {
  const env = context.createGain();
  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(gain, at + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
  env.connect(output);
  return env;
}

// An oscillator note, optionally gliding from `freq` to `to` Hz.
function tone({ type = "sine", freq, to, at = 0, attack = 0.004, decay, gain }) {
  const start = context.currentTime + at;
  const osc = context.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq * pitch, start);
  if (to) osc.frequency.exponentialRampToValueAtTime(to * pitch, start + attack + decay);
  osc.connect(envelope(start, attack, decay, gain));
  osc.start(start);
  osc.stop(start + attack + decay + 0.05);
}

// A burst of filtered noise, optionally sweeping the filter from `freq` to `to` Hz.
function noise({ type = "bandpass", freq, to, q = 1, at = 0, attack = 0.002, decay, gain }) {
  const start = context.currentTime + at;
  const source = context.createBufferSource();
  source.buffer = noiseBuffer;
  const filter = context.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(freq * pitch, start);
  if (to) filter.frequency.exponentialRampToValueAtTime(to * pitch, start + attack + decay);
  source.connect(filter).connect(envelope(start, attack, decay, gain));
  source.start(start);
  source.stop(start + attack + decay + 0.05);
}

const sounds = {
  // IoT sensor: two quick data pings
  sensor() {
    tone({ freq: 1760, decay: 0.06, gain: 0.12 });
    tone({ freq: 2349, at: 0.09, decay: 0.08, gain: 0.1 });
  },

  // Gears: a short ratchet of mechanical clicks
  gears() {
    for (let i = 0; i < 5; i++) {
      noise({ freq: 2600, q: 5, at: i * 0.045, decay: 0.022, gain: 0.9 });
      tone({ type: "square", freq: 190, at: i * 0.045, decay: 0.018, gain: 0.05 });
    }
  },

  // Coins: two coins clinking
  coins() {
    [
      [0, 2637],
      [0.085, 3136],
    ].forEach(([at, freq]) => {
      tone({ freq, at, decay: 0.28, gain: 0.08 });
      tone({ freq: freq * 1.5, at, decay: 0.16, gain: 0.04 });
      noise({ type: "highpass", freq: 5000, at, decay: 0.012, gain: 0.12 });
    });
  },

  // Books: a page turning
  books() {
    noise({ freq: 900, to: 3200, q: 0.8, attack: 0.03, decay: 0.16, gain: 0.22 });
    tone({ freq: 140, to: 80, at: 0.02, decay: 0.08, gain: 0.06 });
  },

  // First-aid kit: lub-dub, in time with the cross's two beats
  heartbeat() {
    [
      [0.1, 0.45],
      [0.37, 0.3],
    ].forEach(([at, gain]) => {
      tone({ freq: 160, to: 55, at, decay: 0.14, gain });
      noise({ type: "lowpass", freq: 400, at, decay: 0.03, gain: gain * 0.4 });
    });
  },

  // Service bell: a bright ding with the bell's inharmonic overtones
  bell() {
    tone({ freq: 1568, attack: 0.002, decay: 1.4, gain: 0.12 });
    tone({ freq: 1568 * 2.76, attack: 0.002, decay: 0.6, gain: 0.035 });
    tone({ freq: 1568 * 5.4, attack: 0.002, decay: 0.22, gain: 0.015 });
    noise({ type: "highpass", freq: 6000, decay: 0.01, gain: 0.15 });
  },

  // About photo: a camera shutter, the blades opening and snapping shut
  shutter() {
    noise({ type: "highpass", freq: 2500, decay: 0.018, gain: 0.35 });
    tone({ type: "triangle", freq: 1200, to: 500, decay: 0.03, gain: 0.05 });
    noise({ freq: 1500, q: 1.5, at: 0.06, decay: 0.04, gain: 0.3 });
    noise({ type: "lowpass", freq: 600, at: 0.06, decay: 0.05, gain: 0.2 });
  },

  // Mortarboard, each time it's hit: a soft knock on the board and a rush of air
  toss() {
    tone({ freq: 260, to: 140, decay: 0.05, gain: 0.12 });
    noise({ type: "lowpass", freq: 1200, decay: 0.03, gain: 0.2 });
    noise({ freq: 600, to: 2200, q: 1.2, attack: 0.04, decay: 0.16, gain: 0.16 });
  },

  // Mortarboard glancing off the side of the screen
  bump() {
    noise({ type: "lowpass", freq: 800, decay: 0.03, gain: 0.22 });
    tone({ freq: 180, to: 120, decay: 0.05, gain: 0.07 });
  },

  // Cap game milestone: a bright rising chord with a shimmer
  milestone() {
    [784, 988, 1175, 1568].forEach((freq, i) => {
      tone({ type: "triangle", freq, at: i * 0.05, decay: i === 3 ? 0.6 : 0.18, gain: 0.07 });
    });
    noise({ type: "highpass", freq: 6000, at: 0.15, attack: 0.02, decay: 0.35, gain: 0.04 });
  },

  // Cap game lost on its last stage: a party popper going off
  popper() {
    noise({ type: "highpass", freq: 1800, decay: 0.05, gain: 0.5 });
    tone({ freq: 140, to: 60, decay: 0.08, gain: 0.2 });
    noise({ type: "highpass", freq: 7000, at: 0.04, attack: 0.03, decay: 0.6, gain: 0.05 });
  },

  // Mortarboard dropping out of sight: a falling whistle
  fall() {
    tone({ type: "triangle", freq: 880, to: 220, attack: 0.01, decay: 0.45, gain: 0.07 });
  },

  // Trophy: a quick rising fanfare with a shimmer on top
  trophy() {
    [1047, 1319, 1568, 2093].forEach((freq, i) => {
      tone({ type: "triangle", freq, at: i * 0.07, decay: i === 3 ? 0.5 : 0.14, gain: 0.07 });
    });
    noise({ type: "highpass", freq: 7000, at: 0.21, attack: 0.02, decay: 0.3, gain: 0.05 });
  },

  // Keycaps: a mechanical switch clicking and bottoming out
  key() {
    noise({ type: "highpass", freq: 3500, decay: 0.012, gain: 0.3 });
    tone({ type: "triangle", freq: 1900, to: 900, decay: 0.02, gain: 0.05 });
    noise({ type: "lowpass", freq: 700, at: 0.028, decay: 0.035, gain: 0.25 });
  },

  // Wide keys (the Skills keyboard's row names): a deeper thock, with the faint tick of
  // the stabilizer wire under a long key
  thock() {
    noise({ type: "highpass", freq: 2200, decay: 0.01, gain: 0.18 });
    tone({ type: "triangle", freq: 420, to: 170, decay: 0.05, gain: 0.1 });
    noise({ type: "lowpass", freq: 420, at: 0.022, decay: 0.07, gain: 0.4 });
    noise({ freq: 3200, q: 6, at: 0.038, decay: 0.012, gain: 0.2 });
  },

  // Typing a skill that isn't on the Skills keyboard: a dull, muffled tap
  miss() {
    noise({ type: "lowpass", freq: 500, decay: 0.04, gain: 0.3 });
    tone({ freq: 120, to: 90, decay: 0.04, gain: 0.06 });
  },

  // Backspace held down in the Skills finder: a light tick for each character that goes,
  // quick enough that a long hold runs like a ratchet
  erase() {
    noise({ type: "highpass", freq: 4200, decay: 0.008, gain: 0.16 });
    tone({ type: "triangle", freq: 1400, to: 1000, decay: 0.012, gain: 0.03 });
  },

  // Contact's postmark: a rubber stamp slapped onto paper, with the thump of the desk under it
  stamp() {
    noise({ freq: 1800, q: 0.8, decay: 0.015, gain: 0.2 });
    noise({ type: "lowpass", freq: 900, decay: 0.06, gain: 0.5 });
    tone({ freq: 150, to: 65, decay: 0.1, gain: 0.22 });
  },

  // Contact's paper plane looping the loop: air rushing past, rising and falling away
  whoosh() {
    noise({ freq: 450, to: 2400, q: 0.8, attack: 0.2, decay: 0.4, gain: 0.2 });
    noise({ type: "highpass", freq: 5000, at: 0.15, attack: 0.1, decay: 0.25, gain: 0.03 });
  },
};

// The footer's switch turns every sound off; the choice is kept for later visits.
let muted = false;
try {
  muted = localStorage.getItem("sound") === "off";
} catch {
  // storage can be unavailable (private mode); sound stays on
}

export const isMuted = () => muted;

export function setMuted(value) {
  muted = value;
  try {
    localStorage.setItem("sound", value ? "off" : "on");
  } catch {
    // the switch still works for this visit
  }
}

// `force` skips the cooldown: hovering in and out quickly shouldn't stack a sound,
// but every click should play, even over the end of the last one. The cooldown belongs
// to `source`, the element making the sound, so things that share a sound (the three
// keycaps) each still play when the mouse sweeps across them. `rate` tunes it up
// (above 1) or down, the way the cap game climbs in pitch as it goes on.
export function playSound(name, { force = false, source = name, rate = 1 } = {}) {
  if (muted) return;
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;

  const now = performance.now();
  if (!force && now - (lastPlayed[source] ?? -Infinity) < COOLDOWN_MS) return;
  lastPlayed[source] = now;

  const ctx = getContext();
  if (!ctx || !sounds[name]) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  pitch = rate * (1 + (Math.random() - 0.5) * 0.08);
  sounds[name]();
}

// Event props for an element that makes a sound: on hover for a mouse,
// and on tap or click everywhere (touch screens have no hover). Elements sharing a
// sound pass their own `source` so each keeps its own hover cooldown.
export function soundOn(name, source = name) {
  return {
    onPointerEnter: (event) => {
      if (event.pointerType === "mouse") playSound(name, { source });
    },
    onClick: () => playSound(name, { force: true, source }),
  };
}
