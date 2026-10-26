import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeHeadings, normalizeTextDashes, normalizeStandaloneSentences } from '../heading-style.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const excluded = new Set(['.git', 'docs', 'node_modules', 'cases_21.09', 'temporary_assets']);

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

test('all published HTML follows the visible punctuation rules', async () => {
  const violations = [];
  for (const file of await htmlFiles(root)) {
    const html = await readFile(file, 'utf8');
    const path = relative(root, file);
    const locale = path.match(/^(ru|uk|en|es)\//)?.[1]
      || html.match(/<html[^>]*lang="(ru|uk|en|es)"/)?.[1] || 'ru';
    const normalized = normalizeStandaloneSentences(normalizeTextDashes(normalizeHeadings(html)), locale);
    if (normalized !== html) violations.push(path);
  }
  assert.deepEqual(violations, [], 'Run npm run build:ui and review the changed copy');
});
