export interface ExperienceItem {
  date: string;
  role: string;
  company: string;
  items: string[];
}

export const experience: ExperienceItem[] = [
  {
    date: "2025 — Present",
    role: "Associate Professor",
    company: "Comillas University",
    items: [
      'Teaching "Development of Applications and Services" — HTML, CSS, JS, React, Django REST',
      "Guiding students through Scrum methodologies and Git version control",
    ],
  },
  {
    date: "2024 — Present",
    role: "Senior Frontend Developer",
    company: "Alira Health",
    items: [
      "Led mobile app development with React Native, optimizing performance and UX",
      "Built scalable web apps with React (Vite) & Next.js",
      "Implemented TDD approach, enhancing code reliability in production",
      "Tech lead for frontend: translated complex business requirements into efficient solutions",
    ],
  },
  {
    date: "2023 — 2024",
    role: "Senior Frontend Developer",
    company: "AltoVita",
    items: [
      "B2B responsive web apps with React, solving travel booking flows for companies",
      "TypeScript, Redux Toolkit, Cypress E2E & Jest unit testing",
      "CI/CD with GitLab and Jenkins",
    ],
  },
  {
    date: "2022 — 2023",
    role: "CTO",
    company: "Ekonoke",
    items: [
      "Analyzed business structure and resolved trust issues via agile methodologies",
      "Mentoring, career paths, budget definition, and team organization via SCRUM",
      "IoT programming (ESP8266), custom hardware troubleshooting",
    ],
  },
  {
    date: "2022",
    role: "Lead Mobile Developer",
    company: "TaxDown",
    items: [
      "Led mobile development for Spain's leading tax management app",
      "React Native cross-platform solutions for iOS & Android",
    ],
  },
  {
    date: "2019 — Present",
    role: "Software Developer (Freelance)",
    company: "Digital Nomad",
    items: [
      "Scalable solutions with Kafka, ELK Stack, and Puppeteer for data streaming & automation",
      "High-performance web apps with React & TypeScript",
      "Hybrid app development with Ionic; backend with NestJS, FastAPI, Django, Laravel",
    ],
  },
  {
    date: "2019 — 2020",
    role: "Senior Frontend Developer",
    company: "Axel Springer Spain",
    items: [
      "Web apps with React (hooks, contexts), TypeScript, and Next.js for SEO",
      "Docker containerization and GitLab CI",
    ],
  },
  {
    date: "2018 — 2019",
    role: "Mobile Hybrid Developer",
    company: "Verisure Securitas Direct",
    items: [
      "Web apps with React (Redux) and GraphQL",
      "Native Android wrapper modules for web apps (Cordova-like architecture)",
    ],
  },
  {
    date: "2015 — 2018",
    role: "Senior FullStack Developer & Team Leader",
    company: "Delonia Software",
    items: [
      "React, Angular, Xamarin, Ionic for web & mobile apps",
      "IoT biometric systems with .NET; Microservice architectures with .NET Core",
      "TDD with Karma, Jasmine, Jest; code quality with SonarQube",
    ],
  },
  {
    date: "2012 — 2015",
    role: "Junior FullStack Developer",
    company: "Partec Solutions",
    items: [
      "Low-level C programming (Atmel microprocessors), IoT with RFID & Manchester Code",
      "Android apps, REST APIs in Java, PHP web apps",
      "Linux system administration and network setup",
    ],
  },
];
