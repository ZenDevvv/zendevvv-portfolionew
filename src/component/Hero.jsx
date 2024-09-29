import React from "react";
import profile from "../assets/profile.jpg";
import { GrLocation } from "react-icons/gr";
import { FiGithub } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { motion as m } from "framer-motion";

export default function Hero({ isDarkMode }) {
  const icons = [
    { icon: FiGithub, href: "https://github.com/ZenDevvv" },
    {
      icon: FaLinkedin,
      href: "www.linkedin.com/in/zen-andrei-obrero-6b37762b5",
    },
    { icon: FiMail, href: "mailto:zenandreiobrero@gmail.com" },
  ];

  return (
    <section className="h-[100svh] bg-lightBG dark:bg-darkBG grid place-items-center">
      <div className="max-w-[1000px] mx-auto h-full flex flex-col md:flex-row-reverse md:h-auto">
        {/* <div className="relative flex justify-center items-center py-20 pt-[134px] flex-none md:py-0">
          <div className="absolute w-[calc(60%+24px)] aspect-square translate-y-[12%] bg-[#d1d1d1] dark:bg-darkImageBG z-0 "/>
          <img
            className="w-3/5  z-10 border-[8px] border-lightBG dark:border-darkBG md:w-[270px]"
            src={profile}
            alt="profile"
          />
        </div> */}

        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
          className="relative flex justify-center items-center py-10 pt-[100px] flex-none md:py-0 md:flex-auto md:w-1/3"
        >
          <div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 25 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1.2 }}
            className="absolute w-[270px] h-[295px] translate-y-[25px] bg-[#d1d1d1] dark:bg-[#374151]  z-0 md:w-[220px] md:h-[295px] md:translate-x-[25px]"
          />
          <img
            className="w-[225px] outline outline-8 outline-lightBG dark:outline-darkBG z-10  dark:border md:m-6"
            src={profile}
            alt="profile"
          />
        </m.div>

        <div className="px-4 flex-1 flex flex-col justify-between md:flex-auto md:w-2/4 lg:w-3/4">
          <div className="pt-4 md:pt-12">
            <m.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
              className="text-4xl font-extrabold text-lightModeTextT dark:text-darkModeTextT py-4 md:text-5xl"
            >
              Hi, I'm Zen
            </m.h1>
            <m.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 0.3 }}
              className="text-lightModeTextP dark:text-darkModeTextP"
            >
              I am a fresh graduate and a passionate javascript developer
              focusing on building responsive and dynamic web applications using
              React.js and Node.js.
            </m.p>
          </div>

          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="flex items-center gap-2 ">
              <GrLocation
                className="text-xl font-bold"
                color={isDarkMode ? "#D1D5DB" : "#4B5563"}
              />
              <p className="text-lightModeTextP dark:text-darkModeTextP">
                Dasmariñas, Cavite
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full m-1.5"></div>
              <p className="text-lightModeTextP dark:text-darkModeTextP">
                Open to work
              </p>
            </div>
          </m.div>

          <div className="flex items-center gap-4 py-4 md:py-0">
            {icons.map((icon, id) => (
              <m.a
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0,transition: {
                  duration: 0.5,
                  ease: "easeInOut",
                  delay: 0.8 + id * 0.2,
                } }}
                
                whileHover={{ scale: 1.3, transition: { duration: 0.3, delay: 0 } }}
                href={icon.href}
                key={icon.href}
              >
                <icon.icon className="text-lightModeTextP dark:text-darkModeTextP text-xl" />
              </m.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
