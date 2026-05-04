# Haynes Industrial

Website for **Haynes Industrial** — an environmental services company based in
Northern & Central California specializing in industrial waste management, recycling,
demolition, and industrial cleaning.

- **Live site**: https://www.haynesindustrial.com
- **Hosting**: Netlify (auto-deploy from `main`)
- **CMS**: CloudCannon (blog content)

## Tech stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Astro](https://astro.build) | 6.x | Static site generator |
| [TypeScript](https://typescriptlang.org) | ^5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | ^4 | Utility-first CSS |
| [@astrojs/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx/) | ^5 | MDX blog support |
| [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) | ^3 | Auto sitemap |
| [@astrojs/rss](https://docs.astro.build/en/guides/rss/) | ^4 | RSS feed |
| [Vitest](https://vitest.dev) | ^2 | Unit testing |
| [Playwright](https://playwright.dev) | ^1.49 | E2E testing |

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Scripts

```bash
npm run dev         # Start dev server at http://localhost:4321
npm run build       # Build for production → dist/
npm run preview     # Preview the production build locally
npm run check       # Run astro check + TypeScript
npm test            # Run Vitest unit tests
npm run test:e2e    # Run Playwright E2E tests
npm run test:all    # Run unit + E2E tests
```

## Project layout

```
src/
  components/     # Reusable Astro components (Header, Footer, BaseHead, FormattedDate)
  content/blog/   # Markdown / MDX blog posts
  layouts/        # Page shell layouts (BaseLayout, BlogPostLayout)
  pages/          # File-based routes (index, about, services, contact, blog/*)
  styles/         # Global CSS, Tailwind layers, brand color palette
public/
  images/         # Site images (AVIF format)
  logo.avif       # Haynes Industrial logo
tests/
  e2e/            # Playwright browser tests
  unit/           # Vitest unit tests
docs/
  TESTING.md      # Testing guide
  DEPLOYMENT.md   # Deployment guide
```

## Adding a blog post

Create a new `.md` file in `src/content/blog/`:

```markdown
---
title: 'My New Post'
description: 'A short description for SEO.'
pubDate: '2024-03-01'
tags:
  - recycling
  - compliance
draft: false
---

Post content goes here.
```

See [CLAUDE.md](CLAUDE.md) for the full frontmatter schema and content guidelines.

## Deployment

The site deploys automatically to Netlify on every push to `main`. The `netlify.toml`
configures the build command, publish directory, Node version, security headers, and
caching rules.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full instructions.
