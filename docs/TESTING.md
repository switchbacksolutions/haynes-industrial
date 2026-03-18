# Testing Guide

This project uses two complementary testing tools:

| Tool | Purpose | Command |
|------|---------|---------|
| **Vitest** | Unit tests for utility functions and pure logic | `npm test` |
| **Playwright** | E2E browser tests for pages and user flows | `npm run test:e2e` |

---

## Unit Tests (Vitest)

### Running

```bash
# Run once
npm test

# Watch mode (re-runs on file change)
npm run test:watch

# With coverage report
npm test -- --coverage
```

### Configuration

`vitest.config.ts` at the project root. Key settings:

- **Environment**: `node` (no DOM by default — suitable for utility functions)
- **Include**: `tests/unit/**/*.{test,spec}.{ts,js}`
- **Globals**: `true` — `describe`, `it`, `expect` are available without imports (though explicit imports are preferred for clarity)

### Writing unit tests

Place test files in `tests/unit/`. Follow this structure:

```typescript
import { describe, it, expect } from 'vitest';
import { myUtil } from '../../src/lib/myUtil';

describe('myUtil', () => {
  it('does the expected thing', () => {
    expect(myUtil('input')).toBe('expected output');
  });
});
```

**What to unit test:**

- Utility functions in `src/lib/`
- Data transformation helpers
- Pure functions with no side effects
- Zod schema validation logic

**What NOT to unit test at this level:**

- Astro components (use E2E tests)
- Layout rendering
- Route generation

---

## E2E Tests (Playwright)

### Running

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Run a specific test file
npx playwright test tests/e2e/home.spec.ts

# Run in a specific browser
npx playwright test --project=chromium

# Show the HTML report from the last run
npx playwright show-report
```

### Configuration

`playwright.config.ts` at the project root. Key settings:

- **Base URL**: `http://localhost:4321` (Astro's default dev port)
- **Web server**: Playwright automatically starts `npm run dev` before tests
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retries**: 2 on CI, 0 locally
- **Traces**: Captured on first retry (open with `npx playwright show-trace`)
- **Screenshots**: Captured on failure only

### Writing E2E tests

Place test files in `tests/e2e/`. Follow this structure:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/path');
  });

  test('should do something', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
```

**Locator strategy (in order of preference):**

1. `getByRole` — most accessible and resilient
2. `getByLabel` — for form inputs
3. `getByText` — for text content
4. `getByTestId` — using `data-testid` attributes for complex cases
5. CSS selectors — last resort only

**Adding `data-testid` attributes:**

When a semantic role isn't enough, add `data-testid` to the component:

```astro
<ul data-testid="blog-post-list">
  ...
</ul>
```

Then in the test:

```typescript
const list = page.getByTestId('blog-post-list');
```

---

## CI Integration

On every push/PR, GitHub Actions (or your CI system) should run:

```bash
npm run check          # TypeScript / Astro check
npm test               # Vitest unit tests
npm run build          # Ensure the build succeeds
npm run test:e2e       # Playwright E2E (against the built output or dev server)
```

Playwright in CI mode:
- Sets `CI=true` which enables retries (2) and uses the `github` reporter
- Workers are limited to 1 to avoid resource contention
- `reuseExistingServer` is disabled — a fresh dev server is started

---

## Debugging Failed Tests

### Vitest

```bash
# Run a specific test file
npx vitest tests/unit/example.test.ts

# Run tests matching a name pattern
npx vitest -t "slugify"
```

### Playwright

```bash
# Run with headed browser (see what's happening)
npx playwright test --headed

# Pause on failure for inspection
npx playwright test --debug

# Step through a test interactively
npx playwright codegen http://localhost:4321
```

Trace files are saved to `test-results/` on failure. Open with:

```bash
npx playwright show-trace test-results/<path-to-trace.zip>
```
