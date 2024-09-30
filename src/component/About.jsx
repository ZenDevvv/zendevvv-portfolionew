import React from "react";
import { GoGoal } from "react-icons/go";
import { motion as m } from "framer-motion";

export default function About() {
  return (
    <section
      id="#about"
      className="bg-secondaryLightBG dark:bg-secondaryDarkBG overflow-hidden py-12"
    >
      <div className="grid place-items-center pb-12">
        <h1 className="inline-block text-xs px-3  py-1.5 rounded-full bg-gray-300 text-center text-lightModeTextP dark:text-darkModeTextP dark:bg-gray-600 dark:bg-[#374151">
          About me
        </h1>
      </div>

      <div className="flex flex-col md:flex-row justify-center px-8  gap-6 max-w-[1000px] mx-auto">
        <div className="relative overflow-hidden">
          <div className="flex items-center gap-2 ">
            <GoGoal className="text-lightModeTextT dark:text-darkModeTextP" />
            <h1 className="text-lightModeTextT dark:text-darkModeTextP">
              Self Introduction
            </h1>
          </div>
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
            }}
            className="text-lightModeTextP dark:text-darkModeTextP"
          >
            I’m a recent graduate passionate about web development, aiming to
            grow as a junior front-end developer. With a focus on React and
            modern web technologies, my goal is to build dynamic, user-friendly
            websites while continuously learning and improving my skills.
          </m.p>
          <m.div
            whileInView={{
              x: "100%",
            }}
            transition={{
              duration: 0.7,
              ease: "easeInOut",
            }}
            className="absolute h-full w-full bg-secondaryLightBG dark:bg-darkBG top-0 left-0"
          />
        </div>
        <div className="relative overflow-hidden">
          <div className="flex items-center gap-2">
            <GoGoal className="text-lightModeTextT dark:text-darkModeTextP" />
            <h1 className="text-lightModeTextT dark:text-darkModeTextP">
              Self Introduction
            </h1>
          </div>
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
            }}
            className="text-lightModeTextP dark:text-darkModeTextP"
          >
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Consequatur omnis a facere voluptatem quod accusantium fuga nesciunt
            eius ea corporis ipsum pariatur, quaerat optio vero eum repudiandae
            nihil. Consequatur animi provident aperiam, dolores quam quae
            inventore minima impedit, ratione sunt soluta veniam atque tempora
          </m.p>
          <m.div
            whileInView={{
              x: "100%",
            }}
            transition={{
              duration: 0.7,
              ease: "easeInOut",
            }}
            className="absolute h-full w-full bg-secondaryLightBG dark:bg-darkBG top-0 left-0"
          />
        </div>
        <div className="relative overflow-hidden">
          <div className="flex items-center gap-2">
            <GoGoal className="text-lightModeTextT dark:text-darkModeTextP" />
            <h1 className="text-lightModeTextT dark:text-darkModeTextP">
              Self Introduction
            </h1>
          </div>
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
            }}
            className="text-lightModeTextP dark:text-darkModeTextP"
          >
            I’m a recent graduate passionate about web development, aiming to
            grow as a junior front-end developer. With a focus on React and
            modern web technologies, my goal is to build dynamic, user-friendly
            websites while continuously learning and improving my skills.
          </m.p>
          <m.div
            whileInView={{
              x: "100%",
            }}
            transition={{
              duration: 0.7,
              ease: "easeInOut",
            }}
            className="absolute h-full w-full bg-secondaryLightBG dark:bg-darkBG top-0 left-0"
          />
        </div>
      </div>
    </section>
  );
}
