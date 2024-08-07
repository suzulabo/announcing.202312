import assert from 'node:assert';

import test, { expect } from '@playwright/test';
import { type StoryIndex } from '@storybook/types';

import playwrightConfig from '../../playwright.config';

const stories = await (async () => {
  const baseURL = playwrightConfig.use?.baseURL;
  assert(baseURL);

  const res = await fetch(`${baseURL}/index.json`);
  if (!res.ok) {
    throw new Error('load index.json error');
  }

  const indexJson = (await res.json()) as StoryIndex;

  const result = [];

  for (const entry of Object.values(indexJson.entries)) {
    if (entry.type === 'docs') {
      continue;
    }

    const tags = entry.tags ?? [];

    const waitSelector = (() => {
      for (const tag of tags) {
        if (tag.startsWith('wait-')) {
          return tag.replace('wait-', '');
        }
      }

      return '#storybook-root';
    })();

    result.push({
      id: entry.id,
      waitSelector,
    });
  }

  return result;
})();

stories.forEach((v) => {
  test(v.id, async ({ page }) => {
    await page.goto(`/iframe.html?args=&id=${v.id}&viewMode=story`);
    await page.locator(v.waitSelector).last().waitFor();

    await expect(page).toHaveScreenshot();
  });
});
