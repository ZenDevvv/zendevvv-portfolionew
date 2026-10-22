import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import Navbar from "./component/Navbar";
import { useSmoothScroll } from "./smoothScroll";

// What every page shares: the theme, smooth scrolling and the navigation. `page` is "home",
// "projects" or "project"; the nav links to the home page's sections from the other pages.
export default function Layout({ page, children }) {
  // Light by default; index.html restores a saved dark choice before first paint.
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useSmoothScroll();

  // Section links glide (index.css), but not before the page has loaded: arriving at a
  // /#section address jumps straight there instead of scrolling past everything above it.
  useEffect(() => {
    const glide = () =>
      requestAnimationFrame(() => document.documentElement.classList.add("glide"));
    if (document.readyState === "complete") glide();
    else window.addEventListener("load", glide, { once: true });
    return () => window.removeEventListener("load", glide);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    try {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    } catch {
      // storage can be unavailable (private mode); the toggle still works for this visit
    }
  }, [isDarkMode]);

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-lightBG pb-24 dark:bg-darkBG md:pb-0">
        <Navbar page={page} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        {children}
      </main>
    </MotionConfig>
  );
}
