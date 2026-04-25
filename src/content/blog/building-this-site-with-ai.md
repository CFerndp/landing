---
title: "Building This Site with AI: Architecture, Patterns, and the Iterative Loop"
description: "A behind-the-scenes look at how this personal landing and blog was built through an AI-assisted workflow — the design patterns, the CSS architecture, and the decisions that emerged from iteration."
pubDate: 2026-04-28
category: tech
tags: ["Astro", "AI", "Architecture", "Tailwind", "TypeScript", "Design Patterns"]
minutesRead: 12
---

Most personal sites are built in a weekend and never touched again. This one was different — not because of the technology stack, but because of *how* it was built. Instead of sitting down with a blank editor and a grand plan, this site was assembled through a tight feedback loop with an AI assistant, one decision at a time.

This post is a technical retrospective. It covers the architecture, the patterns that emerged, and what it actually feels like to iterate on a non-trivial frontend project alongside an AI.

## The Stack, and Why It Is What It Is

The site runs on **Astro 6** with static output. No server, no edge functions, no hydration by default — just HTML, CSS, and a thin layer of vanilla JavaScript for interactions.

The choice was deliberate. A personal landing page and blog have exactly zero requirements for server-side rendering. The content doesn't change per-request. There's no authenticated state. Reaching for a React SPA or a Next.js app here would be the classic case of using a sledgehammer on a finishing nail. Astro's island architecture means that any interactivity can be added surgically, without shipping a full client-side framework to every visitor.

**Tailwind CSS v4** handles structural styling — spacing, layout, grid, flexbox. For visual effects unique to this site (neon glows, `text-shadow` animations, glassmorphism cards) each component has its own scoped `<style>` block. Astro automatically applies a hash attribute to scoped styles, so there are no class name collisions and no need for CSS Modules or BEM namespacing beyond a light BEM-lite convention inside those blocks.

**TypeScript** is enabled in strict mode throughout. This ended up being more than just a preference — it became the backbone of a typed data layer that kept the AI from hallucinating prop shapes or mismatching data structures between files.

## Atomic Design as a Contract

The component tree follows **Atomic Design** — atoms, molecules, organisms, and page-level partials. What makes this worth talking about isn't the pattern itself (it's been around since Brad Frost wrote about it in 2013), but how it functions as a *contract* during AI-assisted development.

When every contribution — human or AI — is constrained to place components in a specific tier with specific rules, the codebase stays navigable. The rules are simple:

- **Atoms** (`src/components/atoms/`) are the smallest primitives. They have no dependencies on other components. `NeonBadge`, `NeonButton`, `SectionTitle`.
- **Molecules** (`src/components/molecules/`) compose atoms. They never import organisms. `PostCard`, `TimelineItem`, `SkillCategory`.
- **Organisms** (`src/components/organisms/`) are self-contained, globally reused sections. `Navbar`, `Footer`, `Particles`.
- **Page partials** (`src/pages/_partials/`) are page-specific sections that don't belong in the global component tree. `Hero`, `About`, `Experience`, `Skills`, `Contact`.

The rule that matters most in practice: *if a component is used on more than one page, it goes in `components/`. If it belongs to a single page, it goes in `_partials/`.* This sounds obvious, but without an explicit rule it's the kind of decision that creates entropy — components drift into the wrong place and the hierarchy collapses into a flat mess.

Every component lives in its own folder with a single `index.astro` entry point:

```
components/atoms/NeonButton/
└── index.astro
```

Not `NeonButton.astro` at the root of atoms. The folder-per-component convention keeps the door open for adding colocated assets or tests later without restructuring anything.

## The Data Layer: One Source of Truth

All site content — profile bio, work history, education, skills, contact links, blog categories — lives in `src/data/` as typed TypeScript modules. Components never hardcode content. They import from data files.

This pattern existed for a practical reason: during iteration, data changes frequently. If a job title, a skill tag, or a category label is hardcoded in three different components, changing it means hunting across the codebase. When it lives in one place, changing it means editing one line.

The blog category system is the clearest example:

```typescript
// src/data/categories.ts
export const CATEGORIES = [
  { value: "tech",       label: "Tech",       color: "blue"   },
  { value: "personal",   label: "Personal",   color: "purple" },
  { value: "adventures", label: "Adventures", color: "green"  },
] as const;

export type Category = (typeof CATEGORIES)[number]["value"];
export const CATEGORY_VALUES = CATEGORIES.map(c => c.value) as unknown as [Category, ...Category[]];
export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map(c => [c.value, c])
) as Record<Category, (typeof CATEGORIES)[number]>;
```

This single file drives:

1. **Schema validation** in the content collection (`z.enum(CATEGORY_VALUES)`)
2. **Filter buttons** on the blog listing page
3. **Badge colors** on every `PostCard` and blog post header

Add a new category to the array and all three update automatically. Delete one and the TypeScript compiler screams everywhere it was referenced. This is the kind of thing that sounds like over-engineering for a personal blog, but it made the AI a much more reliable collaborator — it could always find the source of truth rather than guessing.

## CSS Architecture: Hybrid Styling

The CSS strategy follows a deliberate split:

**Tailwind utility classes inline in templates** for anything structural and generic — `flex`, `grid`, `gap-*`, `p-*`, `max-w-*`, responsive prefixes. These are stateless, predictable, and don't need encapsulation.

**Scoped `<style>` blocks** inside each `.astro` file for component-specific visual styles. Neon glows, `text-shadow` animations, hover effects with `box-shadow` transitions — anything that is visually unique to that component and would look like noise in a utility class string.

```astro
<!-- Structure via Tailwind, visual effects via scoped style -->
<div class="flex flex-col gap-4 p-6">
  <span class="glow-label">HELLO WORLD</span>
</div>

<style>
  .glow-label {
    color: #00e5ff;
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
    font-family: 'Orbitron', sans-serif;
  }
</style>
```

`src/styles/global.css` is strictly for things that are truly global: the `@theme` design tokens, `@keyframes` declarations, base reset, the animated background grid, scroll reveal utilities, and the blog typography overrides. Nothing component-specific ever touches it.

The design token system uses Tailwind v4's `@theme` block:

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

These register as Tailwind tokens (`text-neon-blue`, `bg-dark-bg`, `font-orbitron`) so templates never hardcode hex values. The AI learned this rule quickly and stopped proposing inline `style="color: #00e5ff"` after the first correction.

## Scroll Reveal and the BaseLayout Contract

`BaseLayout` is the root HTML shell wrapping every page. It handles global CSS imports, font preloads, the `<Particles />` background organism, and the `IntersectionObserver` that powers scroll reveal animations. Because all of this lives in one place, pages are clean:

```astro
---
import BaseLayout from "../layouts/BaseLayout/index.astro";
import Navbar from "../components/organisms/Navbar/index.astro";
import Footer from "../components/organisms/Footer/index.astro";
---
<BaseLayout title="Cristian Fernandez">
  <Navbar />
  <main>...</main>
  <Footer />
</BaseLayout>
```

The scroll reveal system works through a single CSS class. Any element that should animate in on scroll gets `reveal`, and stagger delays from `stagger-1` to `stagger-5` offset the transitions:

```astro
<div class="reveal stagger-2">This fades in when scrolled into view</div>
```

The `IntersectionObserver` adds `.visible` when the element enters the viewport, triggering the CSS transition. Simple, zero-dependency, and composable.

## Building With AI: What the Loop Actually Looks Like

The honest version of AI-assisted development is less glamorous than the demos suggest. The AI doesn't architect things for you. What it does extremely well is *execute on a clear specification fast* — and that changes the economics of iteration significantly.

The workflow that emerged was roughly:

1. **Establish a constraint** — write it down explicitly, as an instruction or a rule. "All neon colors go through `@theme` tokens." "No styles.css files alongside components." "Data never lives in templates."

2. **Generate a first pass** — ask the AI to build the component, page, or feature against those constraints. The first pass is usually 80% right.

3. **Correct and re-specify** — the errors in the first pass often reveal an ambiguity in the constraint. Fixing the output *and* sharpening the rule means the next generation is better.

4. **Lock it in** — document the settled pattern in the `copilot-instructions.md` file so it becomes part of the AI's context on every subsequent session.

This is why the project includes a detailed `copilot-instructions.md` in `.github/`. It's not just a style guide — it's an accumulated record of every decision that was made, expressed in a form the AI can use. Component hierarchy, CSS strategy, data layer rules, naming conventions, what not to do. Every time a new pattern was established, it went into that file.

The result is that later sessions in the project are noticeably sharper than earlier ones. The AI stops proposing hardcoded colors. It starts placing components in the right tier without being told. It reaches for the data files instead of inventing inline data. The instructions file functions like a long-running pair programming context.

## The Details That Make It Feel Alive

The neon/cyberpunk aesthetic is carried through consistently at every layer. Three Google Fonts — **Orbitron** for headings and UI chrome (geometric, sci-fi feel), **Rajdhani** for body text (readable but slightly compressed and technical), **Share Tech Mono** for code and badges (CRT terminal energy).

The background is a CSS grid that moves slowly at 20-second intervals via a `@keyframes` animation — barely perceptible, but it makes the page feel less static:

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background:
    linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridMove 20s linear infinite;
}
```

The `Particles` organism floats ten small dots upward continuously — each a different neon color with a different duration and delay, so the animation never looks mechanical.

And then there's the easter egg: the classic **Konami code** (`↑ ↑ ↓ ↓ ← → ← → B A`) triggers a full-screen Matrix rain animation with katakana and Latin characters falling in neon green, accompanied by a toast notification that reads *"🐕 WOOF! You hacked the mainframe!"* The console logs a hint on page load. There's no functional reason for any of this. It's just fun, and fun belongs on a personal site.

## What Static Output Means for Deployment

Because the site is pure static output, deploying it is a solved problem. `npm run build` produces a `dist/` directory of plain HTML, CSS, and JS. No Node.js process to run, no environment variables to manage, no database to provision.

The production setup is a two-stage Docker build: a Node 22 Alpine image compiles the site, then a slim Nginx Alpine image serves the `dist/` output. The final image is around 25 MB. Astro content-hashes every JS and CSS asset at build time, so those files can be served with `Cache-Control: immutable` and a one-year `expires` header. HTML pages get `no-cache` so new deploys are visible immediately.

This deploys cleanly to Coolify with no configuration beyond pointing at the repository and mapping port 80.

## What I Would Do Differently

A few things I'd change with the benefit of hindsight:

**Start the instructions file earlier.** The `copilot-instructions.md` got its shape after about a third of the project was built. The early sessions were looser and produced more inconsistency that needed correcting later. Starting with even a rough version of the constraints document would have saved cleanup time.

**Be more explicit about component props upfront.** Several molecules went through multiple iterations because the initial `Props` interface was underspecified. A brief "here's what this component needs to receive" sentence in the prompt consistently produced better first passes than jumping straight to "build me a card that shows X."

**Lean into the type system harder.** The data layer typing is good, but some page partials still have loose types where a proper interface would have caught mismatches earlier. TypeScript in strict mode is a forcing function — it's worth using it aggressively.

## Closing Thought

The most useful reframe for AI-assisted development isn't "AI writes the code." It's "AI dramatically reduces the cost of trying things." An idea that previously required 45 minutes of scaffolding to evaluate now requires 5. That changes which ideas are worth pursuing, which patterns are worth formalizing, and how much architecture you can afford to put into a project that is, ultimately, a personal website.

The neon grid keeps moving in the background. The particles keep floating up. Somewhere in the console, there's a hint waiting for you.

*You know what to do.*
