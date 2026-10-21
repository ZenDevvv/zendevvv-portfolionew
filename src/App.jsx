import { useEffect, useState } from 'react'
import React from 'react'
import { MotionConfig } from 'framer-motion'
import Navbar from './component/Navbar'
import Hero from './component/Hero'
import Industries from './component/Industries'
import About from './component/About'
import Skills from './component/Skills'
import Experience from './component/Experience'
import Projects from './component/Projects'
import Contact from './component/Contact'
import Footer from './component/Footer'

export default function App() {
  // Light by default; index.html restores a saved dark choice before first paint.
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

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
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <Hero />
        <Industries />
        <About />
        <Skills isDarkMode={isDarkMode} />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </MotionConfig>
  )
}
