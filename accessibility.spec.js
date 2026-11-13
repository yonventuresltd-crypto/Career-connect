import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function scan(page, where) {
  await page.waitForTimeout(500); // Let the short page transition finish before measuring rendered contrast.
  const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(results.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })), where).toEqual([]);
}

test('homepage accessibility scan at desktop and mobile widths', async ({ page }) => {
  for (const width of [1365, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await scan(page, `home at ${width}px`);
  }
});

test('search page and signup dialog pass WCAG 2.1 AA automated checks', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Find Jobs', exact: true }).click();
  await scan(page, 'job search');
  await page.goto('/');
  await page.getByRole('button', { name: 'Get started', exact: true }).click();
  await scan(page, 'signup dialog');
});
