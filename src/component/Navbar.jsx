import { div, nav } from "framer-motion/client";
import React from "react";
import { useState } from "react";
import { MotionConfig, motion as m, AnimatePresence } from "framer-motion";
import "@theme-toggles/react/css/Around.css";
import { Around } from "@theme-toggles/react";

export default function Navbar({ isDarkMode, setIsDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`bg-lightBG dark:bg-darkBG z-20 fixed top-0 left-0 w-full`}>
      <div
      className="flex justify-between items-center px-4 md:py-2 max-w-[1000px] mx-auto">
        <h1 className="text-3xl font-extrabold text-lightModeTextT dark:text-darkModeTextT">
          {"<Zd/>"}
        </h1>

        <div className="hidden md:flex justify-between items-center gap-6">
          <ul className="hidden md:flex gap-4 ">
            {navItems.map((item, id) => (
              <li
                key={item.name}
                className="text-lightModeTextP dark:text-darkModeTextP"
              >
                <a href={item.href}>{item.name}</a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex gap-4">
            <m.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 1080 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 2.2 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center justify-between cursor-pointer"
            >
              <Around
                toggled={isDarkMode}
                toggle={setIsDarkMode}
                className="text-3xl text-lightModeTextP bg-lightBG rounded-full"
              />
            </m.div>
            <m.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 2}}
              className="bg-darkBG font-bold text-darkModeTextP px-4 py-2 rounded-md dark:text-lightModeTextP dark:bg-lightBG"
            >
              Download CV
            </m.button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <m.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed top-0 left-0 w-4/5 h-full bg-lightBG dark:bg-darkBG flex flex-col border-r border-gray-300 dark:border-darkBG shadow-right z-20"
            >
              <div className="flex flex-col h-full">
                <m.h1
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut", delay: 0.15 }}
                  className="text-3xl font-extrabold text-lightModeTextT dark:text-darkModeTextT px-4 py-4"
                >
                  {"<Zd/>"}
                </m.h1>
                <ul className="flex flex-col  border-b border-t border-gray-300 dark:border-gray-800">
                  {navItems.map((item, id) => (
                    <m.li
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                        delay: id * 0.1 + 0.3,
                      }}
                      key={item.name}
                      className="text-lightModeTextP dark:text-darkModeTextP px-4 py-2"
                    >
                      <a href={item.href}>{item.name}</a>
                    </m.li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4 p-4">
                <m.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut", delay: 1.3 }}
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="flex items-center justify-between"
                >
                  <p className="text-lightModeTextP dark:text-darkModeTextP">
                    Switch Theme
                  </p>
                  <m.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
                    className="grid place-items-center"
                  >
                    <Around
                      toggled={isDarkMode}
                      toggle={setIsDarkMode}
                      className="text-3xl bg-lightBG rounded-full"
                    />
                  </m.div>
                </m.div>
                <m.button
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut", delay: 1 }}
                  className="bg-darkBG font-bold text-darkModeTextP px-4 py-2 rounded-md dark:text-lightModeTextP dark:bg-lightBG"
                >
                  Download CV
                </m.button>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        <m.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          <AnimatedHamburgerButton />
        </m.div>
      </div>
    </nav>
  );
}

const AnimatedHamburgerButton = () => {
  const [active, setActive] = useState(false);
  return (
    <MotionConfig
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <m.button
        initial={false}
        animate={active ? "open" : "closed"}
        onClick={() => setActive((pv) => !pv)}
        className="relative h-12 w-10 bg-white/0 transition-colors "
      >
        <m.span
          variants={VARIANTS.top}
          className="absolute h-1 w-8 bg-black dark:bg-white"
          style={{ y: "-50%", left: "50%", x: "-50%", top: "35%" }}
        />
        <m.span
          variants={VARIANTS.middle}
          className="absolute h-1 w-8 bg-black dark:bg-white"
          style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
        />
        <m.span
          variants={VARIANTS.bottom}
          className="absolute h-1 w-4 bg-black dark:bg-white"
          style={{
            x: "-50%",
            y: "50%",
            bottom: "35%",
            left: "calc(50% + 10px)",
          }}
        />
      </m.button>
    </MotionConfig>
  );
};

const VARIANTS = {
  top: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      top: ["35%", "50%", "50%"],
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      top: ["50%", "50%", "32%"],
    },
  },
  middle: {
    open: {
      rotate: ["0deg", "0deg", "-45deg"],
    },
    closed: {
      rotate: ["-45deg", "0deg", "0deg"],
    },
  },
  bottom: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      bottom: ["35%", "50%", "50%"],
      left: "50%",
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      bottom: ["50%", "50%", "32%"],
      left: "calc(50% + 8px)",
    },
  },
};
