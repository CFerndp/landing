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
      'Teaching "Telematic Applications Programming" — HTML, CSS, JS, Spring Boot',
      "Guiding students through Scrum methodologies and Git version control",
    ],
  },
  {
    date: "2024 — 2026",
    role: "Senior Fullstack Developer & Frontend Tech Lead",
    company: "Alira Health",
    items: [
      "Tech Lead for frontend team: defined architecture standards, coordinated development, and aligned technical decisions with product goals",
      "Led development of mobile apps with React Native and web apps with React (Vite) & Next.js",
      "Established TDD practices and comprehensive testing workflows, reducing production bugs",
      "Implemented backend solutions in Django with BFF architecture using Django Ninja",
      "Mentored team members on React best practices, TypeScript patterns, and modern tooling",
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
      "Led complete technology department restructuring, defining IT strategy and budget allocation",
      "Resolved organizational issues between engineering and product teams via tailored Agile methodologies",
      "Designed career paths and mentorship programs for engineering team",
      "Established Scrum framework: daily standups, sprint planning, retrospectives",
      "Hands-on IoT programming (ESP8266) and custom hardware troubleshooting",
    ],
  },
  {
    date: "2022",
    role: "Lead Mobile Developer",
    company: "TaxDown",
    items: [
      "Led mobile development team for tax management app serving thousands of users",
      "Defined mobile architecture strategy and coding standards for React Native codebase",
      "Coordinated with backend team to design API contracts and data sync strategies",
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
    role: "Senior Fullstack Developer & Team Leader",
    company: "Delonia Software",
    items: [
      "Team Leader: coordinated sprint planning, task distribution, and acted as client liaison",
      "Architected web apps with React, Angular, .NET; mobile apps with Xamarin, Ionic",
      "Designed and implemented microservice architectures with .NET Core",
      "Established TDD practices (Karma, Jasmine, Jest) and code quality monitoring with SonarQube",
      "Developed IoT access control systems with .NET and biometric devices",
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
