import { access, readFile, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, normalize, relative } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const locales = ['ru', 'uk', 'en', 'es'];
const failures = [];

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return walk(path);
    return entry.name.endsWith('.html') ? [path] : [];
  }))).flat();
};

const isIgnored = (href) => !href || href.startsWith('#') || /^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(href)
  || /\.(?:css|js|png|jpe?g|svg|webp|pdf)(?:[?#]|$)/i.test(href);
for (const locale of locales) {
  const localeRoot = join(root, locale);
  for (const page of await walk(localeRoot)) {
    const html = await readFile(page, 'utf8');
    for (const [, raw] of html.matchAll(/\bhref="([^"]+)"/gi)) {
      const href = raw.split('#')[0].split('?')[0];
      if (isIgnored(href)) continue;
      const path = href.startsWith('/')
        ? join(root, href.replace(/^\/(?:ru|uk|en|es)(?=\/|$)/, locale).replace(/^\//, ''))
        : join(dirname(page), href);
      const candidates = [path, join(path, 'index.html')];
      try {
        await Promise.any(candidates.map((candidate) => access(normalize(candidate), constants.F_OK)));
      } catch {
        failures.push(`${relative(root, page)} → ${raw}`);
      }
    }
  }
}

if (failures.length) {
  console.error(`Broken internal links (${failures.length}):\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('Internal-link audit passed for all localized HTML pages.');
}
