# cferndp — Personal Landing & Blog

Personal developer landing page and technical blog. Built as a static site with a neon/cyberpunk aesthetic.

---

## Stack

| Tool | Version | Role |
|---|---|---|
| [Astro](https://astro.build) | 6 | Static site framework |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling via `@tailwindcss/vite` |
| [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) | 0.5 | Blog prose styles |
| TypeScript | strict | Type safety across all components and data |

---

## Getting Started

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output → ./dist/
npm run preview   # preview the production build locally
```

---

## Project Structure

```
src/
├── components/
│   ├── atoms/              # Smallest reusable primitives
│   │   ├── NeonBadge/      # Colored pill/square tag
│   │   ├── NeonButton/     # CTA button (renders <a> or <button>)
│   │   └── SectionTitle/   # Heading with decorative neon underline
│   ├── molecules/          # Combinations of atoms
│   │   ├── ContactCard/    # Contact link with icon
│   │   ├── EducationCard/  # Education entry card
│   │   ├── PostCard/       # Blog post preview card
│   │   ├── SkillCategory/  # Skill group with tag cloud
│   │   └── TimelineItem/   # Work experience entry
│   └── organisms/          # Self-contained globally reused sections
│       ├── Footer/
│       ├── Navbar/         # Fixed nav with scroll-spy active link
│       └── Particles/      # Animated background particles
├── content/
│   └── blog/               # Markdown blog posts
├── data/                   # Single source of truth for all site content
│   ├── categories.ts       # Blog categories (value, label, color)
│   ├── contact.ts
│   ├── education.ts
│   ├── experience.ts
│   ├── profile.ts
│   └── skills.ts
├── layouts/
│   └── BaseLayout/         # Root HTML shell — used by every page
├── pages/
│   ├── _partials/          # Page-specific sections (not globally reusable)
│   │   ├── About/
│   │   ├── Contact/
│   │   ├── Education/
│   │   ├── Experience/
│   │   ├── Hero/
│   │   └── Skills/
│   ├── blog/
│   │   ├── index.astro     # Blog listing with category filters
│   │   └── [slug].astro    # Individual post page
│   └── index.astro         # Home page
├── styles/
│   └── global.css          # @theme tokens, keyframes, global utilities
└── content.config.ts       # Content Collection schema
```

Every component lives in its own folder with a single `index.astro` entry point.

---

## Writing Blog Posts

Create a Markdown file in `src/content/blog/`:

```markdown
---
title: "Post title"
description: "One-sentence summary shown in post cards and SEO."
pubDate: 2026-06-01
category: tech
tags: ["React", "TypeScript"]
minutesRead: 8
draft: false
---

Post content here...
```

### Categories

| Value | Label | Color |
|---|---|---|
| `tech` | Tech | Blue |
| `personal` | Personal | Purple |
| `adventures` | Adventures | Green |

Categories are defined **once** in `src/data/categories.ts`. Adding a new entry there automatically updates the schema validation, filter buttons, and badge colors.

### Drafts

Set `draft: true` to exclude a post from the listing and builds. Remove or set to `false` to publish.

---

## Architecture Decisions

### Atomic Design

Components follow a strict three-tier hierarchy:

- **Atoms** — no dependencies on other components, fully reusable
- **Molecules** — compose atoms, never import organisms
- **Organisms** — self-contained sections used across multiple pages
- **`_partials/`** — page-specific sections that do not belong in the global component tree

### CSS Strategy

- **Scoped `<style>`** inside each `.astro` file for component-specific visual styles (glows, animations, neon effects)
- **Tailwind utilities** inline in templates for structural rules (`flex`, `grid`, `gap-*`, `p-*`, etc.)
- **`global.css`** only for truly global rules: `@theme` tokens, `@keyframes`, base reset, scroll reveal utilities, and blog prose overrides
- No separate `styles.css` files alongside components — ever

### Data Layer

All site content is typed and centralized in `src/data/`. Components never hardcode copy or configuration — they import from data files. When a concept (categories, skill colors, contact links) is needed in more than one place, it is defined once and imported everywhere.

### BaseLayout

Every page wraps its content with `BaseLayout`. The layout automatically provides:

- Global CSS and font loading
- `<Particles />` background animation
- Konami code easter egg 🐕

---

## Copilot Instructions

Architecture conventions for AI-assisted development are documented in [`.github/copilot-instructions.md`](.github/copilot-instructions.md).