/**
 * src/pages/rss.xml.ts — RSS feed endpoint
 *
 * Generates /rss.xml containing all published blog posts sorted by
 * publication date (newest first).
 *
 * Docs: https://docs.astro.build/en/guides/rss/
 */

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Astro Template Blog',
    description: 'Articles, tutorials, and notes on web development with Astro.',
    site: context.site!,
    items: posts.map((post) => ({
      title:       post.data.title,
      pubDate:     post.data.pubDate,
      description: post.data.description,
      link:        `/blog/${post.slug}/`,
      categories:  post.data.tags,
    })),
    customData: `<language>en-us</language>`,
    stylesheet: false,
  });
}
