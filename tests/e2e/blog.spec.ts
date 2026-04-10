/**
 * tests/e2e/blog.spec.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Playwright E2E tests for the blog listing (/blog) and individual post pages.
 *
 * Run: npm run test:e2e
 */

import { test, expect } from '@playwright/test';

test.describe('Blog listing page (/blog)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('loads with status 200', async ({ page }) => {
    const response = await page.request.get('/blog');
    expect(response.status()).toBe(200);
  });

  test('has a correct <title>', async ({ page }) => {
    await expect(page).toHaveTitle(/Blog.*Astro Template|Astro Template.*Blog/i);
  });

  test('displays the Blog heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();
  });

  test('lists at least two published blog posts', async ({ page }) => {
    const list = page.getByTestId('blog-post-list');
    await expect(list).toBeVisible();

    const items = list.getByRole('listitem');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('each post card has a title link and description', async ({ page }) => {
    const list = page.getByTestId('blog-post-list');
    const firstItem = list.getByRole('listitem').first();

    // Has a heading with a link
    const titleLink = firstItem.getByRole('link');
    await expect(titleLink).toBeVisible();

    // Has a paragraph of description text
    const desc = firstItem.locator('p').first();
    await expect(desc).not.toBeEmpty();
  });

  test('shows post tags as pills', async ({ page }) => {
    // At least one tag-pill should exist in the post list
    const pills = page.locator('.tag-pill');
    await expect(pills.first()).toBeVisible();
  });

  test('clicking a post title navigates to the post page', async ({ page }) => {
    const list = page.getByTestId('blog-post-list');
    const firstItem = list.getByRole('listitem').first();
    const titleLink = firstItem.getByRole('link').first();

    const href = await titleLink.getAttribute('href');
    expect(href).toMatch(/^\/blog\/.+/);

    await titleLink.click();
    await expect(page).toHaveURL(/\/blog\/.+/);
    await expect(page.getByRole('article')).toBeVisible();
  });

  test('no draft posts appear in the listing', async ({ page }) => {
    // Draft posts should be excluded — we can only assert none of the visible
    // titles contain "(draft)" since our sample posts are not drafts.
    const items = page.getByTestId('blog-post-list').getByRole('listitem');
    const count = await items.count();
    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).innerText();
      expect(text.toLowerCase()).not.toContain('(draft)');
    }
  });
});

test.describe('Blog post page', () => {
  // Navigate to the first post from the listing page
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
    const list = page.getByTestId('blog-post-list');
    const firstLink = list.getByRole('listitem').first().getByRole('link').first();
    await firstLink.click();
    await page.waitForLoadState('networkidle');
  });

  test('displays an <article> element', async ({ page }) => {
    await expect(page.getByRole('article')).toBeVisible();
  });

  test('has a level-1 heading with the post title', async ({ page }) => {
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    const text = await h1.innerText();
    expect(text.length).toBeGreaterThan(0);
  });

  test('shows the published date', async ({ page }) => {
    const dateEl = page.locator('time').first();
    await expect(dateEl).toBeVisible();
    const datetime = await dateEl.getAttribute('datetime');
    expect(datetime).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });

  test('has a "Back to all posts" link', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /back to all posts/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/blog');
  });

  test('"Back to all posts" navigates back to /blog', async ({ page }) => {
    await page.getByRole('link', { name: /back to all posts/i }).click();
    await expect(page).toHaveURL('/blog');
  });

  test('has correct meta description', async ({ page }) => {
    const meta = page.locator('meta[name="description"]');
    const content = await meta.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(10);
  });

  test('has OG tags matching post content', async ({ page }) => {
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const h1Text = await page.getByRole('heading', { level: 1 }).innerText();
    // OG title should include the post title (may have site name appended)
    expect(ogTitle).toContain(h1Text.trim().slice(0, 20));
  });

  test('post body contains rendered content', async ({ page }) => {
    const article = page.getByRole('article');
    // Prose content should have at least one paragraph
    const paragraphs = article.locator('p');
    const count = await paragraphs.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('RSS feed (/rss.xml)', () => {
  test('returns valid XML with status 200', async ({ page }) => {
    const response = await page.request.get('/rss.xml');
    expect(response.status()).toBe(200);

    const contentType = response.headers()['content-type'];
    expect(contentType).toMatch(/xml/);

    const body = await response.text();
    expect(body).toContain('<rss');
    expect(body).toContain('<channel>');
    expect(body).toContain('<item>');
  });
});
