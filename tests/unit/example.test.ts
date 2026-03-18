/**
 * tests/unit/example.test.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Example unit test using Vitest. Replace or extend this with tests for your
 * own utility functions, helpers, and pure logic modules.
 *
 * Run: npm test
 */

import { describe, it, expect } from 'vitest';

// ─── Utility helpers (inline for the example) ─────────────────────────────────

/**
 * Returns a human-readable relative time string.
 * In production, extract this to src/lib/formatDate.ts and import it.
 */
function formatRelativeDate(date: Date, now = new Date()): string {
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Slugifies a string — replaces spaces with hyphens, lowercases, strips
 * characters that are not alphanumeric or hyphens.
 */
function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncates a string to `maxLength` characters and appends an ellipsis.
 */
function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1).trimEnd() + '…';
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('formatRelativeDate', () => {
  const now = new Date('2024-06-15T12:00:00Z');

  it('returns "Today" for the same day', () => {
    expect(formatRelativeDate(now, now)).toBe('Today');
  });

  it('returns "Yesterday" for one day ago', () => {
    const yesterday = new Date('2024-06-14T12:00:00Z');
    expect(formatRelativeDate(yesterday, now)).toBe('Yesterday');
  });

  it('returns days ago for < 7 days', () => {
    const threeDaysAgo = new Date('2024-06-12T12:00:00Z');
    expect(formatRelativeDate(threeDaysAgo, now)).toBe('3 days ago');
  });

  it('returns weeks ago for 7–29 days', () => {
    const twoWeeksAgo = new Date('2024-06-01T12:00:00Z');
    expect(formatRelativeDate(twoWeeksAgo, now)).toBe('2 weeks ago');
  });

  it('returns months ago for 30–364 days', () => {
    const threeMonthsAgo = new Date('2024-03-15T12:00:00Z');
    expect(formatRelativeDate(threeMonthsAgo, now)).toBe('3 months ago');
  });

  it('returns years ago for >= 365 days', () => {
    const oneYearAgo = new Date('2023-06-15T12:00:00Z');
    expect(formatRelativeDate(oneYearAgo, now)).toBe('1 years ago');
  });
});

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('Astro & Tailwind!')).toBe('astro-tailwind');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('one   two---three')).toBe('one-two-three');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  --hello--  ')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });
});

describe('truncate', () => {
  it('returns the original string if within limit', () => {
    expect(truncate('Short text', 20)).toBe('Short text');
  });

  it('truncates and appends ellipsis when too long', () => {
    const result = truncate('This is a long description that exceeds the limit', 20);
    expect(result.length).toBeLessThanOrEqual(20);
    expect(result.endsWith('…')).toBe(true);
  });

  it('returns exact-length string unchanged', () => {
    expect(truncate('exactly ten!', 12)).toBe('exactly ten!');
  });
});
