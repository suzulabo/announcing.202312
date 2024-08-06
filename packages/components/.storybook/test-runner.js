/* eslint-disable no-undef */
import { setTimeout } from 'node:timers/promises';

import { getStoryContext, waitForPageReady } from '@storybook/test-runner';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

/** @type {import('@storybook/test-runner').TestRunnerConfig} */
const config = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);

    if (!storyContext.tags.includes('no-snapshot')) {
      await waitForPageReady(page);

      await setTimeout(1500);

      const image = await page.screenshot();
      expect(image).toMatchImageSnapshot({
        customSnapshotsDir: './__snapshot__',
        customSnapshotIdentifier: `${context.id}_${page.context().browser().browserType().name()}`,
        failureThreshold: 0.1,
      });
    }
  },
};
export default config;
