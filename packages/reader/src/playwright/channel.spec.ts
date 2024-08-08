import test, { expect } from '@playwright/test';

test('channel-page', async ({ page }) => {
  await page.goto('/9901');
  await page.locator('.main').waitFor();

  await expect(page).toHaveScreenshot({ fullPage: true });
});
