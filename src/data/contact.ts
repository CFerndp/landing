export type ContactColor = "blue" | "green" | "pink";

export interface ContactItem {
  label: string;
  value: string;
  displayValue: string;
  iconColor: ContactColor;
  icon: string;
  isExternal: boolean;
}

export const contact: ContactItem[] = [
  {
    label: "Email",
    value: "mailto:hello@cferndp.com",
    displayValue: "hello@cferndp.com",
    iconColor: "blue",
    icon: "✉",
    isExternal: false,
  },
  {
    label: "LinkedIn",
    value: "https://www.linkedin.com/in/cferndp/",
    displayValue: "linkedin.com/in/cferndp",
    iconColor: "blue",
    icon: "in",
    isExternal: true,
  },
  {
    label: "GitHub",
    value: "https://github.com/CFerndp",
    displayValue: "github.com/CFerndp",
    iconColor: "green",
    icon: "⌥",
    isExternal: true,
  },
];
