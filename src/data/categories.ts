export const CATEGORIES = [
    { value: "tech",       label: "Tech",       color: "blue"   },
    { value: "personal",   label: "Personal",   color: "purple" },
    { value: "adventures", label: "Adventures", color: "green"  },
] as const;

export type Category      = (typeof CATEGORIES)[number]["value"];
export type CategoryColor = (typeof CATEGORIES)[number]["color"];

/** Tuple required by Zod's z.enum() */
export const CATEGORY_VALUES = CATEGORIES.map(
    (c) => c.value,
) as unknown as [Category, ...Category[]];

export const DEFAULT_CATEGORY: Category = "tech";

/** Fast lookup: value → { value, label, color } */
export const CATEGORY_MAP = Object.fromEntries(
    CATEGORIES.map((c) => [c.value, c]),
) as Record<Category, (typeof CATEGORIES)[number]>;
