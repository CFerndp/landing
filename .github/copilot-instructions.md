# GitHub Copilot Instructions — Personal Landing + Blog

## Language

The web is **100% in English**. All UI text, labels, error messages, ARIA attributes, comments in components, and content must be written in English. Developer-facing comments in TypeScript/Astro files may also be in English.

---

## Tech Stack

- **Astro 6** (static output)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **@tailwindcss/typography** for blog prose styles
- **TypeScript** — strict mode, always typed props and data
- **Content Collections** (Astro) for the blog

---

## Project Structure

```
astro/src/
├── components/
│   ├── atoms/          # Smallest reusable UI primitives
│   ├── molecules/      # Combinations of atoms
│   └── organisms/      # Full, self-contained UI sections
├── content/
│   └── blog/           # Markdown blog posts
├── data/               # Single source of truth for typed site data
├── layouts/
│   └── BaseLayout/     # Root HTML shell, used by every page
├── pages/
│   ├── _partials/      # Page-specific sections (not globally reusable)
│   └── blog/           # Blog routes
└── styles/
    └── global.css      # @theme, global utilities, keyframes
```

Every component lives in its own folder with an `index.astro` file:

```
components/atoms/NeonButton/
└── index.astro          ✅ correct

components/atoms/NeonButton.astro  ❌ wrong
```

---

## Atomic Design — Component Hierarchy

### Atoms (`src/components/atoms/`)
The smallest, most reusable primitives. They have no dependencies on other components.

| Component     | Purpose                                      |
|---------------|----------------------------------------------|
| `NeonBadge`   | Colored pill/square tag (tech, category, etc)|
| `NeonButton`  | CTA button — renders `<a>` or `<button>`     |
| `SectionTitle`| Section heading with decorative neon line    |

### Molecules (`src/components/molecules/`)
Combinations of atoms that represent a distinct piece of UI. They may import atoms but not organisms.

| Component       | Purpose                              |
|-----------------|--------------------------------------|
| `TimelineItem`  | Single experience entry              |
| `EducationCard` | Single education entry               |
| `SkillCategory` | Skill group with tag cloud           |
| `ContactCard`   | Contact link card with icon          |
| `PostCard`      | Blog post preview card               |

### Organisms (`src/components/organisms/`)
Self-contained, globally reused UI sections. They may import atoms and molecules.

| Component   | Purpose                                |
|-------------|----------------------------------------|
| `Navbar`    | Fixed navigation with scroll-spy       |
| `Footer`    | Site footer                            |
| `Particles` | Animated background particles          |

### Page Partials (`src/pages/_partials/`)
Page-level sections that are **not globally reusable** — they belong to a specific page. Each partial may import atoms and molecules.

```
_partials/
├── Hero/
├── About/
├── Experience/
├── Education/
├── Skills/
└── Contact/
```

**Rule:** if a component is used in more than one page, it belongs in `components/`. If it is specific to one page, it belongs in `_partials/`.

---

## CSS Architecture

### Rule: No separate CSS files

Never create a `styles.css` file alongside a component. All component styles live in a `<style>` block inside the `.astro` file. Astro automatically scopes these styles via a hash attribute — no class collisions.

```astro
<!-- ✅ correct -->
<div class="card">...</div>

<style>
  .card {
    background: var(--card-bg);
    border-radius: 8px;
  }
</style>
```

```astro
<!-- ❌ wrong -->
---
import "./styles.css";
---
```

### Rule: Hybrid CSS strategy

Use **Astro scoped `<style>`** for component-specific visual styles (neon glows, animations, layout unique to that component).

Use **Tailwind utility classes** for structural, spacing, and layout rules that are generic (`flex`, `grid`, `gap-*`, `p-*`, `max-w-*`, etc.).

```astro
<!-- ✅ Tailwind for structure, scoped <style> for neon effects -->
<div class="flex flex-col gap-4 p-6">
  <span class="glow-label">...</span>
</div>

<style>
  .glow-label {
    color: #00e5ff;
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  }
</style>
```

### Rule: Global CSS only for truly global things

`src/styles/global.css` contains only:
- `@import "tailwindcss"` and `@plugin "@tailwindcss/typography"`
- `@theme` — neon color palette and font tokens
- `:root` — CSS custom properties (`--card-bg`, `--glass`)
- Base reset and `body`/`html` styles
- Animated background grid
- `@keyframes` declarations
- `.reveal` / `.stagger-*` scroll animation utilities
- `.typewriter` animation utility
- `.neon-card` utility (glass card base)
- `.neon-list` utility (arrow bullet list)
- `.prose` typography overrides for the blog
- Easter egg styles

Do **not** add component-specific styles to `global.css`.

### Design tokens (`@theme`)

All neon colors and fonts are registered as Tailwind tokens:

```css
@theme {
  --color-neon-blue:   #00e5ff;
  --color-neon-green:  #39ff14;
  --color-neon-pink:   #ff2d95;
  --color-neon-purple: #bf5fff;
  --color-dark-bg:     #0a0a0f;

  --font-orbitron: 'Orbitron', sans-serif;
  --font-rajdhani: 'Rajdhani', sans-serif;
  --font-mono:     'Share Tech Mono', monospace;
}
```

Use these via Tailwind classes (`text-neon-blue`, `bg-dark-bg`, `font-orbitron`) instead of hardcoding hex values in templates.

---

## Data Layer (`src/data/`)

All typed site content lives here. Components never hardcode data — they always import from `src/data/`.

| File               | Contains                                      |
|--------------------|-----------------------------------------------|
| `profile.ts`       | Name, bio, stats, details, interests          |
| `experience.ts`    | Work history entries                          |
| `education.ts`     | Education entries                             |
| `skills.ts`        | Skill categories and tags                     |
| `contact.ts`       | Contact links                                 |
| `categories.ts`    | Blog categories — **single source of truth**  |

### Single source of truth principle

When a concept (like blog categories) is used in multiple places, define it **once** in a data file and import it everywhere else. Never duplicate enums, labels, or color maps across files.

```typescript
// ✅ src/data/categories.ts — defined once
export const CATEGORIES = [
  { value: "tech",       label: "Tech",       color: "blue"   },
  { value: "personal",   label: "Personal",   color: "purple" },
  { value: "adventures", label: "Adventures", color: "green"  },
] as const;

export type Category = (typeof CATEGORIES)[number]["value"];
export const CATEGORY_VALUES = CATEGORIES.map(c => c.value) as unknown as [Category, ...Category[]];
export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.value, c])) as Record<Category, (typeof CATEGORIES)[number]>;
```

```typescript
// ✅ Consumed in content schema
import { CATEGORY_VALUES, DEFAULT_CATEGORY } from "./data/categories";
category: z.enum(CATEGORY_VALUES).optional().default(DEFAULT_CATEGORY),

// ✅ Consumed in a component
import { CATEGORY_MAP, type Category } from "../../../data/categories";
const cat = CATEGORY_MAP[category];
// → cat.label, cat.color
```

---

## Component Props

Always define an explicit `Props` interface in the frontmatter. Use TypeScript types imported from `src/data/` when applicable.

```astro
---
import type { ExperienceItem } from "../../../data/experience";

interface Props {
  item: ExperienceItem;
  class?: string;
}

const { item, class: className = "" } = Astro.props;
---
```

For polymorphic components (e.g., heading level), use a string union and a dynamic tag:

```astro
---
type HeadingLevel = "h1" | "h2" | "h3";
interface Props { as?: HeadingLevel; }
const { as: Tag = "h2" } = Astro.props;
---
<Tag>...</Tag>
```

For optional animations, expose a `reveal` boolean prop:

```astro
interface Props { reveal?: boolean; }
const { reveal = true } = Astro.props;
---
<Tag class={reveal ? "reveal" : ""}>...</Tag>
```

---

## Blog — Content Collections

Posts live in `src/content/blog/*.md`. The schema is defined in `src/content.config.ts`.

### Frontmatter schema

```yaml
---
title: "Post title"
description: "One-sentence summary for SEO and post cards."
pubDate: 2026-05-01
category: tech          # tech | personal | adventures
tags: ["React", "TypeScript"]
minutesRead: 8           # optional
draft: false             # optional, defaults to false
---
```

### Adding a new category

Edit **only** `src/data/categories.ts`. Add a new entry to the `CATEGORIES` array. Everything else (schema validation, filter buttons, badge colors) updates automatically.

---

## BaseLayout

`src/layouts/BaseLayout/index.astro` is the root shell used by every page. It includes:

- Global CSS import
- Font preloads (Orbitron, Rajdhani, Share Tech Mono)
- `<Particles />` organism — background animation on every page
- Konami code easter egg script

When creating a new page, always wrap it with `BaseLayout`:

```astro
---
import BaseLayout from "../layouts/BaseLayout/index.astro";
import Navbar from "../components/organisms/Navbar/index.astro";
import Footer from "../components/organisms/Footer/index.astro";
---
<BaseLayout title="Page Title" description="Page description">
  <Navbar />
  <main>...</main>
  <Footer />
</BaseLayout>
```

Do **not** add `<Particles />` manually to pages — it is already included in `BaseLayout`.

---

## Scroll Reveal Animations

Elements that should animate in on scroll get the `reveal` class. Stagger delays are available via `stagger-1` through `stagger-5`.

```astro
<div class="reveal stagger-2">...</div>
```

The `IntersectionObserver` that triggers these is registered in `BaseLayout`, so it runs on every page automatically.

The `SectionTitle` atom includes `reveal` by default. Pass `reveal={false}` for titles that must be visible immediately (e.g., the first element above the fold on a page that doesn't scroll to reveal it).

---

## Naming Conventions

| Thing              | Convention            | Example                  |
|--------------------|-----------------------|--------------------------|
| Component folders  | PascalCase            | `NeonButton/`            |
| Component files    | always `index.astro`  | `NeonButton/index.astro` |
| Data files         | camelCase             | `categories.ts`          |
| Exported types     | PascalCase            | `type Category`          |
| Exported constants | SCREAMING_SNAKE_CASE  | `CATEGORY_MAP`           |
| CSS classes        | kebab-case BEM-lite   | `.post-card__title`      |
| Tailwind classes   | inline in template    | `class="flex gap-4"`     |

---

## What NOT to do

- ❌ Create `styles.css` files alongside components
- ❌ Hardcode colors like `#00e5ff` in component templates — use `var(--color-neon-blue)` or Tailwind tokens
- ❌ Duplicate type definitions or label/color maps across files — extract to `src/data/`
- ❌ Add component-specific styles to `global.css`
- ❌ Use Spanish (or any non-English) text in the UI, ARIA attributes, or component code
- ❌ Add `<Particles />` manually to a page — it lives in `BaseLayout`
- ❌ Skip the `Props` interface in component frontmatter
- ❌ Place globally reusable components inside `pages/_partials/`
- ❌ Place page-specific sections inside `src/components/`
