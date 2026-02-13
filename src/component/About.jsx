import React from "react";
import { motion as m } from "framer-motion";
import { GoGoal } from "react-icons/go";
import { RxAvatar } from "react-icons/rx";
import { GrTrophy } from "react-icons/gr";
import { FaCheckCircle } from "react-icons/fa";

const sections = [
  {
    title: "Who I Am",
    Icon: RxAvatar,
    isCompleted: true,
    content:
      "Fullstack developer specializing in React and TypeScript with a focus on building multi-tenant enterprise systems. I've shipped 8+ production platforms across IoT, Education, Hospitality, and ERP domains — handling everything from UI architecture to backend data modeling. I work with a structured AI-augmented workflow, using tools like Claude Opus, Codex, and Gemini Pro 3 not as a crutch, but as a force multiplier — maintaining full code ownership and engineering rigor at every stage.",
  },
  {
    title: "Where I'm Headed",
    Icon: GoGoal,
    isCompleted: true,
    content:
      "I'm deepening my expertise in AI-augmented software engineering — the practice of directing AI tools with architectural intent, clear prompt systems, and human-driven quality control. My near-term focus is mastering Cloud infrastructure (AWS), and advanced CI/CD pipelines while refining how I integrate AI into every phase of the SDLC: from UI/UX prototyping to backend scaffolding to automated testing. The goal is to ship faster without sacrificing engineering discipline.",
  },
  {
    title: "The Bigger Picture",
    Icon: GrTrophy,
    content:
      "I believe the developers who will lead in the coming years aren't the ones who code the fastest — they're the ones who know how to orchestrate AI, architecture, and team workflows into reliable, scalable systems. I'm building toward a senior fullstack or tech lead role where I can shape engineering culture, mentor developers on effective AI-assisted workflows, and eventually build a product studio that ships real enterprise solutions at startup speed.",
  },
];

export default function About() {
  return (
    <section
      id="about"
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
          viewport={{ once: true }}
          className="inline-block text-xs px-3  py-1.5 rounded-full bg-gray-300 text-center text-lightModeTextP dark:text-darkModeTextP dark:bg-gray-600"
        >
          About me
        </m.h1>
      </div>

      <div className="flex flex-col md:flex-row justify-center px-8  gap-6 max-w-[1000px] mx-auto">
        {sections.map((section, index) => (
          <div
            key={index}
            className="relative overflow-hidden space-y-4 md:flex-1"
          >
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
              viewport={{ once: true }}
              className="flex items-center gap-2 relative"
            >
              <section.Icon
                className={`${
                  section.isCompleted
                    ? "text-emerald-500 dark:text-emerald-400"
                    : "text-lightModeTextT dark:text-darkModeTextP"
                } text-lg font-semibold`}
              />
              <h1
                className={`text-lg font-semibold flex items-center gap-2 ${
                  section.isCompleted
                    ? "text-emerald-500 dark:text-emerald-400"
                    : "text-lightModeTextT dark:text-darkModeTextP"
                }`}
              >
                {section.title}
                {section.isCompleted && <FaCheckCircle className="text-sm" />}
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
              viewport={{ margin: "-100px", once: true }}
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
              viewport={{ once: true }}
              className="absolute h-full w-full bg-secondaryLightBG dark:bg-darkBG top-0 left-0"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
