import { access, readFile, stat } from 'node:fs/promises';

const locales = ['ru', 'uk', 'en', 'es'];
const homepagePaths = ['index.html', ...locales.map((locale) => `${locale}/index.html`)];
const failures = [];

for (const pathname of homepagePaths) {
  const html = await readFile(pathname, 'utf8');
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
  const eagerImages = images.filter((tag) => !/\bloading="lazy"/.test(tag));
  if (eagerImages.length) failures.push(`${pathname}: ${eagerImages.length} image(s) load eagerly`);
}

const optimizedAssets = [
  'assets/reset-team-architecture.webp',
  'assets/reset-architecture-valencia.webp',
  'assets/reset-valencia-renovation.webp',
  'assets/traffic-to-leads-funnel.webp',
  'assets/navigator-sales-followup.webp',
  'assets/navigator-system-integration.webp',
  'assets/navigator-start-diagnostic.webp',
  'cases/shepit_assets/shepit_title.webp',
];

let optimizedBytes = 0;
for (const pathname of optimizedAssets) {
  await access(pathname);
  optimizedBytes += (await stat(pathname)).size;
}

if (failures.length) throw new Error(failures.join('\n'));
console.log(`Home media audit passed. Optimized media payload: ${(optimizedBytes / 1024).toFixed(0)} KB.`);
