import React from "react";
import { FaLaptopCode, FaNetworkWired } from "react-icons/fa";
import uzaroLogo from "../assets/uzarologo.png";

// Experiences data
export const experiences = [
  {
    company: "Uzaro Technology Solutions Inc.",
    period: "November 25, 2024 - present",
    position: "Associate Developer",
    tasks: [
      "Designed and developed responsive frontend interfaces for a technology solutions application using React and TypeScript, ensuring type-safe, scalable, and user-centric UI/UX.",
      "Integrated IoT devices with a web application, enabling seamless real-time data communication and enhancing system functionality for smart technology solutions.",
      "Built a robust Learning Management System (LMS) using the MERN stack, delivering a scalable platform for efficient course management and user engagement.",
      "Collaborated with cross-functional teams in an Agile environment to ensure the development process followed Software Development Life Cycle (SDLC) best practices through iterative planning and continuous feedback.",
    ]
  },
  {
    company: "IPSolutions Inc.",
    period: "March 2024 - May 2024",
    position: "IT Intern",
    tasks: [
      "Developed static websites utilizing HTML/CSS and Bootstrap templates, following UI/UX design principles to ensure responsive and user-friendly layouts.",
    ]
  }
];

// Array of company name components with icons
export const companyComponents = [
  {
    company: "Uzaro Technology Solutions Inc.",
    component: () => (
      <div className="flex items-center gap-2">
        <img src={uzaroLogo} alt="Uzaro"  className="w-8 h-8"/>
        <h1>
          <span className="text-[#0f76bf] text-2xl">Uzaro</span>{" "}
          Technology Solutions Inc.
        </h1>
      </div>
    ),
  },
  {
    company: "IPSolutions Inc.",
    component: () => (
      <div className="flex items-center gap-2">
        <h1>
          <span className="text-green-600 dark:text-green-400">IPS</span>olutions
          Inc.
        </h1>
      </div>
    ),
  },
];