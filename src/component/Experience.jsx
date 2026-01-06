import React from "react";
import { motion as m } from "framer-motion";
import { experiences, companyComponents } from "./CompanyComponents";

export default function Experience() {
  return (
    <section
      className="bg-secondaryLightBG dark:bg-secondaryDarkBG overflow-hidden py-12"
      id="experience"
    >
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="grid place-items-center pb-6">
          <h1 className="inline-block text-xs px-3 py-1.5 rounded-full bg-gray-300 text-center text-lightModeTextP dark:text-darkModeTextP dark:bg-gray-600">
            Experience
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {experiences.map((exp, index) => {
              // Find the matching company component
              const CompanyComponent =
                companyComponents.find((comp) => comp.company === exp.company)
                  ?.component || (() => <h1>{exp.company}</h1>); // Fallback if no match

              return (
                <m.div
                  initial={{
                    opacity: 0,
                    x: "50%",
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeInOut",
                  }}
                  viewport={{ once: true }}
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-lightBG shadow-lg dark:bg-gray-800 rounded-2xl p-8"
                >
                  {/* Company */}
                  <div className="flex flex-col gap-2 md:col-span-1">
                    <h1 className="text-xl font-bold text-lightModeTextT dark:text-darkModeTextT">
                      <CompanyComponent />
                    </h1>
                    <p className="text-xs text-lightModeTextP dark:text-darkModeTextP md:hidden">
                      {exp.period}
                    </p>
                  </div>

                  {/* Position and Tasks */}
                  <div className="flex flex-col gap-4 md:col-span-2 md:order-2">
                    <h2 className="font-bold text-lightModeTextT dark:text-darkModeTextT text-xl">
                      {exp.position}
                    </h2>
                    <ul className="list-disc text-lightModeTextP dark:text-darkModeTextP pl-6 space-y-2">
                      {exp.tasks.map((task, i) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Period - Hidden on mobile */}
                  <p className="hidden md:block text-xs text-lightModeTextP dark:text-darkModeTextP text-center md:order-3">
                    {exp.period}
                  </p>
                </m.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
