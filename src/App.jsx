import { useState } from 'react'
import React from 'react'
import Navbar from './component/Navbar'
import Hero from './component/Hero'
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  return (
    <main className={`${isDarkMode ? "dark" : ""} `}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <Hero isDarkMode={isDarkMode} />
    </main>
  )
}
