import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const origin = 'https://resetdigital.agency';
const locales = ['ru', 'uk', 'en', 'es'];
const localeCodes = { ru: 'ru_RU', uk: 'uk_UA', en: 'en_US', es: 'es_ES' };
const defaultImage = `${origin}/assets/reset-team-architecture.png`;

const walk = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async (entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? walk(path) : (entry.name.endsWith('.html') ? [path] : []);
}))).flat();
const text = (value = '') => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const escape = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

for (const locale of locales) {
  const localeRoot = join(root, locale);
  for (const file of await walk(localeRoot)) {
    const route = relative(localeRoot, file).replace(/\\/g, '/');
    if (route === '404.html') continue;
    const urlPath = route === 'index.html' ? `/${locale}/` : `/${locale}/${route}`;
    const url = `${origin}${urlPath}`;
    let html = await readFile(file, 'utf8');
    const h1 = text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]) || 'RESET';
    const paragraphs = [...html.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)].map((match) => text(match[1]));
    const description = (paragraphs.find((item) => item.length > 70) || h1).slice(0, 155);
    const pageTitle = route === 'index.html' ? (html.match(/<title>([^<]+)<\/title>/i)?.[1] || `RESET — ${h1}`) : `${h1} — RESET`;
    const existingImage = html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1]
      || html.match(/<img[^>]+src="([^"]+)"/i)?.[1];
    const image = existingImage ? new URL(existingImage, url).href : defaultImage;
    const pageType = route.startsWith('materials/') ? (route.split('/').length > 3 ? 'article' : 'website') : 'website';
    const breadcrumb = route === 'index.html' ? [] : [
      { '@type': 'ListItem', position: 1, name: 'RESET', item: `${origin}/${locale}/` },
      ...route.split('/').filter((segment) => segment !== 'index.html').map((segment, index, parts) => ({
        '@type': 'ListItem', position: index + 2, name: segment.replace(/-/g, ' '), item: `${origin}/${locale}/${parts.slice(0, index + 1).join('/')}/` })),
    ];
    const schema = route === 'index.html'
      ? { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'RESET', url, description, image, areaServed: ['Ukraine', 'Spain', 'Europe'], availableLanguage: ['ru', 'uk', 'en', 'es'] }
      : route.startsWith('cases/')
        ? { '@context': 'https://schema.org', '@type': 'CreativeWork', name: h1, url, description, image, inLanguage: locale }
        : route.startsWith('materials/') && route.split('/').length > 3
          ? { '@context': 'https://schema.org', '@type': 'Article', headline: h1, description, image, mainEntityOfPage: url, inLanguage: locale, author: { '@type': 'Organization', name: 'RESET' }, publisher: { '@type': 'Organization', name: 'RESET' } }
          : { '@context': 'https://schema.org', '@type': 'CollectionPage', name: h1, url, description, inLanguage: locale };
    const schemas = [schema];
    if (breadcrumb.length) schemas.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumb });
    const social = [
      `<meta property="og:title" content="${escape(pageTitle)}" />`, `<meta property="og:description" content="${escape(description)}" />`,
      `<meta property="og:url" content="${url}" />`, `<meta property="og:type" content="${pageType}" />`, `<meta property="og:image" content="${image}" />`,
      `<meta property="og:locale" content="${localeCodes[locale]}" />`, '<meta name="twitter:card" content="summary_large_image" />',
      `<meta name="twitter:title" content="${escape(pageTitle)}" />`, `<meta name="twitter:description" content="${escape(description)}" />`, `<meta name="twitter:image" content="${image}" />`,
    ].join('\n    ');
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escape(pageTitle)}</title>`);
    html = html.replace(/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escape(description)}" />`);
    html = html.replace(/\s*<meta property="og:[^>]+>\s*/gi, '\n    ').replace(/\s*<meta name="twitter:[^>]+>\s*/gi, '\n    ');
    html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
    html = html.replace('</head>', `\n    ${social}\n    ${schemas.map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`).join('\n    ')}\n  </head>`);
    await writeFile(file, html);
  }
}
