import uzaroLogo from "../assets/uzarologo.png";

// Array of company name components with icons
export const companyComponents = [
  {
    company: "Uzaro Solutions Technology Inc.",
    component: () => (
      <div className="flex items-center gap-2">
        <img src={uzaroLogo} alt="Uzaro" className="w-8 h-8" />
        <h1>
          <span className="text-[#0f76bf] text-2xl">Uzaro</span> Solutions
          Technology Inc.
        </h1>
      </div>
    ),
  },
  {
    company: "IPSolutions Inc.",
    component: () => (
      <div className="flex items-center gap-2">
        <h1>
          <span className="text-green-600 dark:text-green-400">IPS</span>
          olutions Inc.
        </h1>
      </div>
    ),
  },
];
