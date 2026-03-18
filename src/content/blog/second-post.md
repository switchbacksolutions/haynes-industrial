---
title: 'Styling with Tailwind CSS in Astro'
description: >
  A practical guide to using Tailwind CSS with Astro, covering utility classes,
  the @apply directive, dark mode, and component-level styles.
pubDate: '2024-02-01'
updatedDate: '2024-02-10'
heroImage: '/images/tailwind-hero.jpg'
tags:
  - tailwind
  - css
  - astro
  - design
draft: false
---

Tailwind CSS and Astro are a natural pair. Astro's scoped styles prevent class
collisions, while Tailwind gives you a rich utility palette that works
seamlessly with Astro's component model.

## Setup

Tailwind is already configured in this template. The integration lives in
`astro.config.mjs`:

```js
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
});
```

The `tailwind.config.mjs` file at the project root controls which files
Tailwind scans for class names and lets you extend the default theme.

## Utility Classes in Astro Components

Use utility classes directly on HTML elements inside `.astro` files:

```astro
---
// src/components/Card.astro
const { title, description } = Astro.props;
---

<article class="rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
  <h2 class="text-xl font-semibold text-gray-900">{title}</h2>
  <p class="mt-2 text-gray-600">{description}</p>
</article>
```

## The @apply Directive

For reusable patterns that appear in many places, use `@apply` inside a
`<style>` block or in `src/styles/global.css`:

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2
           text-sm font-medium text-white shadow-sm
           hover:bg-brand-700 focus:outline-none focus:ring-2
           focus:ring-brand-500 focus:ring-offset-2
           transition-colors duration-150;
  }
}
```

## Dark Mode

Dark mode is enabled via the `class` strategy in `tailwind.config.mjs`.
Toggle the `dark` class on `<html>` with a small script and then use
`dark:` variants in your markup:

```astro
<p class="text-gray-800 dark:text-gray-100">
  This text adapts to dark mode automatically.
</p>
```

## Scoped vs Global Styles

| Approach            | When to use                             |
| ------------------- | --------------------------------------- |
| Tailwind utilities  | Most UI styling — fast and consistent   |
| `<style>` in .astro | Complex selectors Tailwind can't express |
| `global.css`        | CSS resets, `@layer` components, fonts  |

## Tips

- Keep utility strings readable by breaking long class lists across lines with
  template literals or a `clsx`/`cn` helper.
- Use the `@astrojs/tailwind` integration rather than `postcss` directly — it
  handles Vite integration automatically.
- Run `npm run build` and inspect `dist/` to confirm Tailwind's purge is
  removing unused classes in production.
