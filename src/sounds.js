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

  // Keycaps: a mechanical switch clicking and bottoming out
  key() {
    noise({ type: "highpass", freq: 3500, decay: 0.012, gain: 0.3 });
    tone({ type: "triangle", freq: 1900, to: 900, decay: 0.02, gain: 0.05 });
    noise({ type: "lowpass", freq: 700, at: 0.028, decay: 0.035, gain: 0.25 });
  },
};

// `force` skips the cooldown: hovering in and out quickly shouldn't stack a sound,
// but every click should play, even over the end of the last one. The cooldown belongs
// to `source`, the element making the sound, so things that share a sound (the three
// keycaps) each still play when the mouse sweeps across them.
export function playSound(name, { force = false, source = name } = {}) {
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;

  const now = performance.now();
  if (!force && now - (lastPlayed[source] ?? -Infinity) < COOLDOWN_MS) return;
  lastPlayed[source] = now;

  const ctx = getContext();
  if (!ctx || !sounds[name]) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  pitch = 1 + (Math.random() - 0.5) * 0.08;
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
