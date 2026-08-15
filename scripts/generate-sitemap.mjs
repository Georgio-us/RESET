import { readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const origin = 'https://resetdigital.agency';
const locales = ['ru', 'uk', 'en', 'es'];
const walk = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async (entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? walk(path) : (entry.name.endsWith('.html') ? [path] : []);
}))).flat();

const entries = [];
for (const locale of locales) {
  for (const file of await walk(join(root, locale))) {
    const route = relative(join(root, locale), file).replace(/\\/g, '/');
    if (route === '404.html' || route === 'sitemap.html' || route === 'privacy.html') continue;
    const url = route === 'index.html' ? `${origin}/${locale}/` : `${origin}/${locale}/${route}`;
    entries.push(`  <url><loc>${url}</loc></url>`);
  }
}
await writeFile(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`);
console.log(`Generated sitemap.xml with ${entries.length} canonical URLs.`);
