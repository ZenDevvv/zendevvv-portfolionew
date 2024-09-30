import React from "react";
import { getImageUrl } from "../utils";
import projects from "../assets/projects/projects.json";
import { FiExternalLink } from "react-icons/fi";
import { motion as m, useScroll } from "framer-motion";

export default function Projects() {
  return (
    <section className="bg-lightBG dark:bg-darkBG py-12 overflow-x-hidden">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="grid place-items-center pb-6">
          <h1 className="inline-block text-xs px-3 py-1.5 rounded-full bg-gray-300 text-center text-lightModeTextP dark:text-darkModeTextP dark:bg-gray-600">
            Experience
          </h1>
        </div>

        <div className="flex flex-col gap-4 md:gap-8">
          {projects.map((project, id) => {
            return (
              <m.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`flex flex-col  items-center shadow-lg rounded-lg md:h-[320px] ${
                  id % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                }    `}
                key={id}
              >
                <div
                  className={`flex-1 p-6 border-b dark:border-none  h-full grid place-items-center bg-gray-100 dark:bg-gray-700 rounded-t-xl  ${
                    id % 2 === 1
                      ? "md:rounded-tl-none md:rounded-tr-xl md:rounded-br-xl"
                      : "md:rounded-tr-none md:rounded-bl-xl"
                  }`}
                >
                  <img
                    src={getImageUrl(project.imageSrc)}
                    alt={project.title}
                    className="object-contain w-5/6 md:max-w-[240px]"
                  />
                </div>
                <div
                  className={`flex-1 flex flex-col justify-between h-full p-6  dark:bg-gray-800 rounded-b-xl  ${
                    id % 2 === 1
                      ? "md:rounded-tl-xl md:rounded-tr-none md:rounded-br-none"
                      : "md:rounded-bl-none md:rounded-tr-xl"
                  }`}
                >
                  <div className="flex flex-col gap-4 mb-4">
                    <h1 className="font-bold text-lg text-lightModeTextT dark:text-darkModeTextT">
                      {project.title}
                    </h1>
                    <p className="text-lightModeTextP dark:text-darkModeTextP">
                      {project.description}
                    </p>
                    <ul className="flex flex-wrap gap-2 text-lightModeTextP dark:text-darkModeTextP">
                      {project.skills.map((skill, id) => {
                        return (
                          <li
                            className="text-sm px-3 py-1 rounded-full bg-gray-300 text-center text-lightModeTextP dark:text-darkModeTextP dark:bg-gray-600"
                            key={id}
                          >
                            {skill}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <m.a
                  
                    whileHover={{ y: -3, x: 3 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    href={project.demo} target="_blank" className="w-fit"
                    >
                    <FiExternalLink className="relative text-xl text-lightModeTextT dark:text-darkModeTextT" />
                  </m.a>
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
