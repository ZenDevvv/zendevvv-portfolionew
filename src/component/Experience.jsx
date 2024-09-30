import React from "react";
import { motion as m } from "framer-motion";


const IPSolutions = () => {
  return (
    <h1>
      <span className="text-green-600">IPS</span>olutions Inc.
    </h1>
  );
};

export default function Experience() {
  const experiences = [
    {
      company: "Hire me? 👉🏻👈🏻",
      period: "present",
      position: "Junior frontend developer",
      tasks: [
        "Waiting for your offer letter",
      ],
    },
    {
      company: "IPSolutions Inc.",
      period: "March 2024 - May 2024",
      position: "IT Intern",
      tasks: [
        "Developed static websites utilizing HTML/CSS and Bootstrap templates, following UI/UX design principles to ensure responsive and user-friendly layouts.",
        "Collaborated with cross-functional teams to ensure the development process adhered to Software Development Life Cycle (SDLC) practices.",
      ],
    },
  ];

  return (
    <section className="bg-secondaryLightBG dark:bg-secondaryDarkBG overflow-hidden py-12">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="grid place-items-center pb-6">
          <h1 className="inline-block text-xs px-3 py-1.5 rounded-full bg-gray-300 text-center text-lightModeTextP dark:text-darkModeTextP dark:bg-gray-600">
            Experience
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          {experiences.map((exp, index) => (
            <m.div
              initial={{
                opacity: 0,
                x: '50%',
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
              key={index}
              className="flex flex-col gap-2 justify-between bg-lightBG shadow-lg dark:bg-gray-800 rounded-2xl p-8"
            >
              <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <h1 className="text-xl font-bold text-lightModeTextT dark:text-darkModeTextT md:w-1/4 md:flex-initial">
                  {exp.company === "IPSolutions Inc." ? <IPSolutions /> : exp.company}
                </h1>
                <p className="text-xs md:text-right text-lightModeTextP dark:text-darkModeTextP md:order-2 md:w-1/4 md:flex-initial">
                  {exp.period}
                </p>
                <h2 className="font-bold text-lightModeTextT md:order-1 dark:text-darkModeTextT md:text-xl md:w-1/2 md:flex-1">
                  {exp.position}
                </h2>
              </div>

              <ul className="list-disc text-lightModeTextP dark:text-darkModeTextP pl-6 space-y-2 md:w-1/2 max-w-[400px] mx-auto">
                {exp.tasks.map((task, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
