// Tech logos on keycaps (the Skills keyboard, the project stacks) are ink at rest and light
// up in their brand colour while their key is hovered or pressed. A brand colour is first
// made readable on each theme's paper.

// The paper in each theme (lightBG and darkBG in tailwind.config.js), and how far a lit logo
// must stand out from it, as a WCAG contrast ratio.
const PAPER = { light: "#f4f3ef", dark: "#121211" };
const MIN_CONTRAST = 1.8;

const channels = (hex) => [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16));
const toHex = (rgb) => `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
function luminance(rgb) {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// A logo's brand colour as it lights up on one theme's paper. A colour too faint to read
// there is darkened (or, on the dark paper, lightened) until it reads, like React's pale cyan
// and JavaScript's yellow on the light paper. A grey one, like Next.js's black on the dark
// paper, stays ink: those logos are black or white anyway.
function lit(color, theme) {
  if (!color) return "currentColor";
  const paper = channels(PAPER[theme]);
  let rgb = channels(color);
  if (contrast(rgb, paper) >= MIN_CONTRAST) return color;
  if (Math.max(...rgb) - Math.min(...rgb) < 48) return "currentColor";
  const toward = theme === "light" ? 0 : 255;
  while (contrast(rgb, paper) < MIN_CONTRAST) rgb = rgb.map((c) => c + (toward - c) * 0.08);
  return toHex(rgb);
}

// A brand colour (a hex like "#61DAFB", or nothing) as it lights up in each theme.
export const brandColors = (color) => ({ light: lit(color, "light"), dark: lit(color, "dark") });

// The CSS variables a lit logo reads, `--light` and `--dark`; the logo's classes pick one by
// theme (`[--brand:var(--light)] dark:[--brand:var(--dark)]`).
export const brandVars = ({ light, dark }) => ({ "--light": light, "--dark": dark });
