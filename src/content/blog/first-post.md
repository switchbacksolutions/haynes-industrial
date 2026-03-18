---
title: 'Getting Started with Astro'
description: >
  Learn how to build blazing-fast websites with Astro, the all-in-one web
  framework designed for content-driven sites.
pubDate: '2024-01-15'
heroImage: '/images/astro-hero.jpg'
tags:
  - astro
  - web-development
  - javascript
draft: false
---

Welcome to your new Astro blog! This is your first post, and it serves as a
living example of the frontmatter schema and Markdown features available in
this template.

## What is Astro?

[Astro](https://astro.build) is a modern web framework optimised for
content-heavy websites. It ships **zero JavaScript by default**, sending only
HTML and CSS to the browser unless you explicitly opt in to client-side
interactivity.

Key benefits:

- **Island Architecture** — hydrate only the components that need JS
- **Framework agnostic** — use React, Vue, Svelte, Solid, or plain HTML
- **Content Collections** — type-safe Markdown and MDX with Zod validation
- **Built-in optimisations** — automatic image optimisation, CSS scoping, and more

## Markdown Features

### Code Blocks

```typescript
import { getCollection } from 'astro:content';

const posts = await getCollection('blog', ({ data }) => {
  return !data.draft;
});
```

### Tables

| Feature        | Supported |
| -------------- | --------- |
| Markdown       | ✅        |
| MDX            | ✅        |
| TypeScript     | ✅        |
| Tailwind CSS   | ✅        |
| Sitemap        | ✅        |
| RSS Feed       | ✅        |

### Blockquotes

> The web is for everyone. Astro helps you build fast, accessible sites
> without sacrificing developer experience.

## Next Steps

1. Edit this file at `src/content/blog/first-post.md`
2. Add more posts to `src/content/blog/`
3. Customise the layout in `src/layouts/BlogPostLayout.astro`
4. Update site metadata in `astro.config.mjs`
5. Deploy to Netlify by connecting your Git repository
