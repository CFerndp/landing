import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { CATEGORY_VALUES, DEFAULT_CATEGORY } from "./data/categories";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()),
    category: z.enum(CATEGORY_VALUES).optional().default(DEFAULT_CATEGORY),
    draft: z.boolean().optional().default(false),
    minutesRead: z.number().optional(),
  }),
});

export const collections = { blog };
