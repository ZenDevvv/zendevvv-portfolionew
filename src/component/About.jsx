import React from "react";
import { motion as m } from "framer-motion";
import { GoGoal } from "react-icons/go";
import { RxAvatar } from "react-icons/rx";
import { GrTrophy } from "react-icons/gr";

const sections = [
  {
    title: "Self Introduction",
    icon: <RxAvatar className="text-lightModeTextT dark:text-darkModeTextP" />,
    content:
      "I’m passionate about web development, with a focus on React and modern technologies. I strive to build dynamic, user-friendly websites and spend 6 to 8 hours daily coding, taking on new challenges and exploring solutions. This dedication drives me to continuously learn and improve, bringing me closer to my goals in the ever-evolving tech landscape.",
  },
  {
    title: "Short Term Goal",
    icon: <GoGoal className="text-lightModeTextT dark:text-darkModeTextP" />,
    content:
      "My short-term goal is to secure a position as a junior front-end developer, where I can apply my knowledge and enthusiasm in a professional setting. I am eager to contribute to a collaborative team, engage in exciting projects, and gain valuable hands-on experience. This opportunity will help me further develop my skills in building responsive and engaging web applications while staying updated with industry trends and best practices.",
  },
  {
    title: "Long Term Plan",
    icon: <GrTrophy className="text-lightModeTextT dark:text-darkModeTextP" />,
    content:
      "My long-term goal is to become proficient in full-stack development, mastering both front-end and back-end technologies. I aspire to become a tech lead, guiding young developers and helping them succeed. I also dream of starting my own tech company, where I can innovate, solve real-world problems, and foster a collaborative and growth-focused culture.",
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
          <div key={index} className="relative overflow-hidden space-y-4 md:flex-1">
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
              {section.icon}
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
