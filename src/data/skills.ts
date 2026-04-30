export type SkillColor = "blue" | "pink" | "green" | "purple";

export interface SkillTag {
  label: string;
  color: SkillColor;
}

export interface SkillCategory {
  title: string;
  tags: SkillTag[];
}

export const skills: SkillCategory[] = [
  {
    title: "Leadership & Architecture",
    tags: [
      { label: "Technical Strategy", color: "purple" },
      { label: "Team Leadership", color: "purple" },
      { label: "Mentoring", color: "purple" },
      { label: "Scrum Master", color: "purple" },
      { label: "System Design", color: "purple" },
      { label: "Microservices", color: "purple" },
      { label: "Code Reviews", color: "purple" },
      { label: "Agile", color: "purple" },
    ],
  },
  {
    title: "Frontend",
    tags: [
      { label: "React", color: "blue" },
      { label: "React Native", color: "blue" },
      { label: "Next.js", color: "blue" },
      { label: "TypeScript", color: "blue" },
      { label: "JavaScript", color: "blue" },
      { label: "Redux", color: "blue" },
      { label: "Vite", color: "blue" },
      { label: "Angular", color: "blue" },
      { label: "Ionic", color: "blue" },
      { label: "HTML5 / CSS3", color: "blue" },
      { label: "SASS", color: "blue" },
      { label: "GraphQL", color: "blue" },
    ],
  },
  {
    title: "Backend",
    tags: [
      { label: "NestJS", color: "pink" },
      { label: "ExpressJS", color: "pink" },
      { label: "Django", color: "pink" },
      { label: "FastAPI", color: "pink" },
      { label: "Laravel", color: "pink" },
      { label: ".NET / .NET Core", color: "pink" },
      { label: "Python", color: "pink" },
      { label: "PHP", color: "pink" },
      { label: "Java", color: "pink" },
    ],
  },
  {
    title: "Testing & Quality",
    tags: [
      { label: "Jest", color: "green" },
      { label: "Cypress", color: "green" },
      { label: "RTL", color: "green" },
      { label: "Karma", color: "green" },
      { label: "Jasmine", color: "green" },
      { label: "SonarQube", color: "green" },
      { label: "TDD", color: "green" },
    ],
  },
  {
    title: "DevOps & Infrastructure",
    tags: [
      { label: "Docker", color: "purple" },
      { label: "GitLab CI", color: "purple" },
      { label: "Jenkins", color: "purple" },
      { label: "Kafka", color: "purple" },
      { label: "ELK Stack", color: "purple" },
      { label: "Linux", color: "purple" },
      { label: "Git", color: "purple" },
    ],
  },
  {
    title: "IoT & Emerging",
    tags: [
      { label: "ESP8266", color: "blue" },
      { label: "Atmel MCU", color: "blue" },
      { label: "RFID", color: "blue" },
      { label: "Xamarin", color: "pink" },
      { label: "Puppeteer", color: "purple" },
      { label: "Machine Learning", color: "green" },
      { label: "VR / BCIs", color: "blue" },
    ],
  },
  {
    title: "Databases & Tools",
    tags: [
      { label: "PostgreSQL", color: "purple" },
      { label: "MySQL", color: "purple" },
      { label: "REST APIs", color: "purple" },
      { label: "BFF Pattern", color: "purple" },
    ],
  },
];
