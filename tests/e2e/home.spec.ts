/**
 * tests/e2e/home.spec.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Playwright E2E tests for the home page (/).
 *
 * Run: npm run test:e2e
 * Run in UI mode: npm run test:e2e:ui
 */

import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads successfully with status 200', async ({ page }) => {
    const response = await page.request.get('/');
    expect(response.status()).toBe(200);
  });

  test('displays the site name in the header', async ({ page }) => {
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Haynes Industrial' }).first()).toBeVisible();
  });

  test('has a visible main navigation', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Services' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Get In Touch' })).toBeVisible();
  });

  test('has a page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Haynes Industrial/);
  });

  test('has a meta description', async ({ page }) => {
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
  });

  test('has canonical and OG meta tags', async ({ page }) => {
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
  });

  test('has an RSS autodiscovery link', async ({ page }) => {
    const rssLink = page.locator('link[type="application/rss+xml"]');
    await expect(rssLink).toHaveCount(1);
    await expect(rssLink).toHaveAttribute('href', '/rss.xml');
  });

  test('shows a hero section with call-to-action links', async ({ page }) => {
    const hero = page.locator('section').first();
    await expect(hero.getByRole('link', { name: /get in touch/i })).toBeVisible();
    await expect(hero.getByRole('link', { name: /our services/i })).toBeVisible();
  });

  test('shows the core services section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /core services/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /metal recycling/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /e-waste/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /industrial surplus/i })).toBeVisible();
  });

  test('has a footer with brand name', async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Haynes Industrial');
  });

  test('dark mode toggle is present and functional', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /toggle dark mode/i });
    await expect(toggle).toBeVisible();

    // Toggle on
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Toggle off
    await toggle.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('is accessible — no obvious ARIA violations', async ({ page }) => {
    // Ensure key landmark roles are present
    await expect(page.getByRole('banner')).toBeVisible();      // <header>
    await expect(page.getByRole('main')).toBeVisible();        // <main>
    await expect(page.getByRole('contentinfo')).toBeVisible(); // <footer>
  });

  test('navigation links point to correct paths', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Main navigation' });

    const aboutLink = nav.getByRole('link', { name: 'About' });
    await expect(aboutLink).toHaveAttribute('href', '/about');

    const servicesLink = nav.getByRole('link', { name: 'Services' });
    await expect(servicesLink).toHaveAttribute('href', '/services');

    const ctaLink = nav.getByRole('link', { name: 'Get In Touch' });
    await expect(ctaLink).toHaveAttribute('href', '/contact');
  });

  test('shows the Instagram feed section or fallback CTA', async ({ page }) => {
    const igSection = page.getByRole('heading', { name: /from our instagram/i });
    await expect(igSection).toBeVisible();

    // Either posts grid or fallback CTA link must be present
    const hasGrid = await page.locator('.ig-feed__grid').count() > 0;
    const hasFallback = await page.locator('.ig-feed__fallback').count() > 0;
    expect(hasGrid || hasFallback).toBeTruthy();

    // Any external Instagram links must have correct attributes
    const igLinks = page.locator('a[href*="instagram.com"]');
    const count = await igLinks.count();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        await expect(igLinks.nth(i)).toHaveAttribute('rel', 'noopener noreferrer');
        await expect(igLinks.nth(i)).toHaveAttribute('target', '_blank');
      }
    }
  });
});
