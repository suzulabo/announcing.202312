import fs from 'fs';
import path from 'path';

import { expect, test } from 'vitest';

import { validateAnnouncingJSON } from '../..';

const tests = (() => {
  const dirPath = path.join(__dirname, './AnnouncingJSON');
  const dir = fs.opendirSync(dirPath);
  try {
    const result: [string, unknown, boolean][] = [];
    const jsonRegex = new RegExp('(^valid|invalid)-(\\w+).json$');

    for (;;) {
      const f = dir.readSync();
      if (!f) {
        break;
      }
      const m = f.name.match(jsonRegex);
      if (!m) {
        continue;
      }
      const [, valid, name] = m;
      if (!name || !valid) {
        continue;
      }

      const jsonPath = path.join(dirPath, f.name);
      const s = fs.readFileSync(jsonPath, { encoding: 'utf-8' });
      result.push([name, JSON.parse(s), valid === 'valid']);
    }

    return result;
  } finally {
    dir.closeSync();
  }
})();

test.each(tests)('%s', (_, data, expected) => {
  if (expected) {
    expect(validateAnnouncingJSON(data)).toStrictEqual({ ok: true });
  } else {
    expect(validateAnnouncingJSON(data).ok).toBe(false);
  }
});
