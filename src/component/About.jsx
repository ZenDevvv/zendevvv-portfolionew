import React from "react";
import { motion as m } from "framer-motion";
import { GoGoal } from "react-icons/go";

const sections = [
  {
    title: "Self Introduction",
    content:
      "I’m a recent graduate passionate about web development, aiming to grow as a junior front-end developer. With a focus on React and modern web technologies, my goal is to build dynamic, user-friendly websites while continuously learning and improving my skills.",
  },
  {
    title: "Self Introduction",
    content:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequatur omnis a facere voluptatem quod accusantium fuga nesciunt eius ea corporis ipsum pariatur, quaerat optio vero eum repudiandae nihil. Consequatur animi provident aperiam, dolores quam quae inventore minima impedit, ratione sunt soluta veniam atque tempora",
  },
  {
    title: "Self Introduction",
    content:
      "I’m a recent graduate passionate about web development, aiming to grow as a junior front-end developer. With a focus on React and modern web technologies, my goal is to build dynamic, user-friendly websites while continuously learning and improving my skills.",
  },
];

export default function About() {
  return (
    <section
      id="#about"
      className="bg-secondaryLightBG dark:bg-secondaryDarkBG overflow-hidden py-12"
    >
      <div className="grid place-items-center pb-12">
        <m.h1
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="inline-block text-xs px-3  py-1.5 rounded-full bg-gray-300 text-center text-lightModeTextP dark:text-darkModeTextP dark:bg-gray-600"
        >
          About me
        </m.h1>
      </div>

      <div className="flex flex-col md:flex-row justify-center px-8  gap-6 max-w-[1000px] mx-auto">
        {sections.map((section, index) => (
          <div key={index} className="relative overflow-hidden space-y-4">
            <m.div
              initial={{
                opacity: 0.5,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                ease: "easeInOut",
              }}
              className="flex items-center gap-2 "
            >
              <GoGoal className="text-lightModeTextT dark:text-darkModeTextP" />
              <h1 className="text-lightModeTextT dark:text-darkModeTextP">
                {section.title}
              </h1>
            </m.div>
            <m.p
              initial={{
                opacity: 0.5,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
              viewport={{ margin: "-100px" }}
              className="text-lightModeTextP dark:text-darkModeTextP"
            >
              {section.content}
            </m.p>
            <m.div
              whileInView={{
                x: "100%",
              }}
              transition={{
                duration: 0.7,
                ease: "easeInOut",
                delay: index * 0.2,

              }}
              className="absolute h-full w-full bg-secondaryLightBG dark:bg-darkBG top-0 left-0"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
