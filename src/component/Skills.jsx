import React from "react";
import skills from "../assets/skills/skills.json";
import { getImageUrl } from "../utils";
import { motion as m } from "framer-motion";

export default function Skills({ isDarkMode }) {
  return (
    <section className="bg-lightBG dark:bg-darkBG py-12 px-4 md:px-24 text-lightModeTextP dark:text-darkModeTextP" id="skills">
      <div className="grid place-items-center pb-12 max-w-screen-md mx-auto">
        <h1 className="inline-block text-xs px-4 py-1.5 rounded-full bg-gray-300 text-center text-lightModeTextP dark:text-darkModeTextP dark:bg-gray-600 mb-6">
          Skills
        </h1>

        <div className="flex flex-wrap gap-x-12 gap-y-6 justify-center items-baseline">
          {skills.map((skill, id) => {
            const isSvg = skill.imageSrc.endsWith('.svg');
            return (
              <m.div
                initial={{
                  opacity: 0,
                  x: 30,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.7,
                  ease: "easeInOut",
                  delay: id * 0.125,
                }}
                key={id} className="flex flex-col items-center justify-center gap-2">
                <img
                  className={`w-10 ${isDarkMode && isSvg ? 'dark-mode-filter' : ''}`}
                  src={getImageUrl(skill.imageSrc)}
                  alt={skill.title}
                />
                <h1 className="text-center text-sm font-semibold">{skill.title}</h1>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
