import { useState } from 'react'
import React from 'react'
import Navbar from './component/Navbar'
import Hero from './component/Hero'
import About from './component/About'
import Skills from './component/Skills'
import Experience from './component/Experience'
import Projects from './component/Projects'
import Contact from './component/Contact'
import Footer from './component/Footer'

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  return (
    <main className={`${isDarkMode ? "dark" : ""} h-screen bg-darkBG`}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <Hero isDarkMode={isDarkMode} />
      <About />
      <Skills isDarkMode={isDarkMode} />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </main>
  )
}
