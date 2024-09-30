import React from "react";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { FiGithub } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { motion as m, useScroll } from "framer-motion";

export default function Contact() {
  const icons = [
    { icon: FiGithub, href: "https://github.com/ZenDevvv" },
    {
      icon: FaLinkedin,
      href: "www.linkedin.com/in/zen-andrei-obrero-6b37762b5",
    },
    { icon: FiMail, href: "mailto:zenandreiobrero@gmail.com" },
  ];

  return (
    <section className="bg-secondaryLightBG dark:bg-secondaryDarkBG overflow-hidden py-12">
      <div className="grid place-items-center">
        <h1 className="inline-block text-xs px-3 py-1.5 rounded-full bg-gray-300 text-center text-lightModeTextP dark:text-darkModeTextP dark:bg-gray-600 mb-4">
          Get in touch
        </h1>

        <p className="text-sm text-lightModeTextP dark:text-darkModeTextP">
          Feel free to contact me
        </p>
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut"}}
          className="overflow-hidden text-center flex flex-row items-center gap-2 mt-6">
          <MdOutlineEmail className="text-xl text-lightModeTextT dark:text-darkModeTextT" />{" "}
          <a
            className="text-lg text-lightModeTextT dark:text-darkModeTextT"
            href="zenandreiobrero777@gmail.com"
          >
            zenandreiobrero777@gmail.com
          </a>
        </m.div>
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2}}
          className="text-center flex flex-row items-center gap-2 mb-6">
          <FiPhone className="text-xl text-lightModeTextT dark:text-darkModeTextT" />{" "}
          <p className="text-lg text-lightModeTextT dark:text-darkModeTextT">
            +63 906 857 5015
          </p>
        </m.div>

        <div className="flex flex-col items-center gap-4">
          <m.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2}}
            className="text-sm text-lightModeTextP dark:text-darkModeTextP">
            You may also find me on these platforms!
          </m.p>
          <div className="flex flex-row items-center gap-3">
            {icons.map((icon, index) => (
              <m.a
                initial={{ opacity: 0, y: 30 }}
                
                whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: index * 0.15 + 0.4}}}
                whileHover={{ scale: 1.3, transition: { duration: 0.15, ease: "easeInOut" }}}
                key={index} href={icon.href} target="_blank" rel="noopener noreferrer">
                <icon.icon className="text-lg text-lightModeTextT dark:text-darkModeTextT" />
              </m.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
