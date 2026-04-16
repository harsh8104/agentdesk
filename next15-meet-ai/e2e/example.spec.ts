import { test, expect } from '@playwright/test';

test('has expected title and renders basic content', async ({ page }) => {
  await page.goto('/');

  // Check the title of the page
  await expect(page).toHaveTitle(/AgentDesk|Meet AI/);

  // We check for some identifiable component, such as the body.
  const body = page.locator('body');
  await expect(body).toBeVisible();
});
