export interface EducationItem {
  date: string;
  degree: string;
  school: string;
  details: string[];
}

export const education: EducationItem[] = [
  {
    date: "2016 — 2018",
    degree: "Master's Degree — Innovation & Investigation in TIC (I2-TIC)",
    school: "Universidad Autónoma de Madrid (UAM)",
    details: [
      "Machine Learning",
      "Neurocomputer techniques: EEG, EOG",
      "Brain-machine interface for VR based on EOG",
      "Thesis: Virtual Reality application for BCIs",
    ],
  },
  {
    date: "2011 — 2016",
    degree: "Bachelor's Degree — Computer Science",
    school: "Universidad Autónoma de Madrid (UAM)",
    details: [
      "Full Computer Science curriculum",
      "Thesis: Virtual Reality for people with motion disabilities",
    ],
  },
];
