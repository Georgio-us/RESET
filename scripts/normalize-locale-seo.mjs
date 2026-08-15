import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const origin = 'https://resetdigital.agency';
const locales = ['ru', 'uk', 'en', 'es'];

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : (entry.name.endsWith('.html') ? [path] : []);
  }));
  return files.flat();
};

const localizedDescription = {
  ru: 'RESET — цифровой маркетинг для недвижимости. Соединяем маркетинг, продажи, цифровые продукты и AI в единую систему для агентств недвижимости и девелоперов.',
  uk: 'RESET — цифровий маркетинг для нерухомості. Поєднуємо маркетинг, продажі, цифрові продукти й AI в єдину систему для агенцій нерухомості та девелоперів.',
  en: 'RESET provides digital marketing for real estate. We connect marketing, sales, digital products and AI for agencies and developers.',
  es: 'RESET ofrece marketing digital para el sector inmobiliario. Conectamos marketing, ventas, productos digitales e IA para agencias y promotoras.',
};

const localizedTitle = {
  ru: 'RESET — цифровой маркетинг для недвижимости',
  uk: 'RESET — цифровий маркетинг для нерухомості',
  en: 'RESET — digital marketing for real estate',
  es: 'RESET — marketing digital inmobiliario',
};

for (const locale of locales) {
  const localeRoot = join(root, locale);
  for (const file of await walk(localeRoot)) {
    const route = relative(localeRoot, file).replace(/\\/g, '/');
    if (route === '404.html') continue;
    const publicPath = route === 'index.html' ? '/' : `/${route}`;
    const urlFor = (language) => `${origin}/${language}${publicPath}`;
    const seoLinks = [
      `<link rel="canonical" href="${urlFor(locale)}" />`,
      ...locales.map((language) => `<link rel="alternate" hreflang="${language}" href="${urlFor(language)}" />`),
      `<link rel="alternate" hreflang="x-default" href="${urlFor('ru')}" />`,
    ].join('\n    ');

    let html = await readFile(file, 'utf8');
    html = html.replace(/<html lang="[^"]+">/, `<html lang="${locale}">`);
    if (/<link rel="canonical"/i.test(html)) {
      html = html.replace(/\s*<link rel="canonical"[^>]*\/?>(?:\s*<link rel="alternate"[^>]*\/?>)*/g, `\n    ${seoLinks}\n    `);
    } else {
      html = html.replace(/<head([^>]*)>/i, `<head$1>\n    ${seoLinks}`);
    }

    // EN and ES pages must never advertise a Russian document in search results.
    // Page copy is translated separately; these baseline tags make every URL valid
    // while preserving any already-localized, page-specific metadata.
    if (localizedDescription[locale] && route === 'index.html') {
      html = html.replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${localizedDescription[locale]}" />`);
      html = html.replace(/<meta property="og:(title|description)" content="[^"]*"\s*\/?>/g, (_, property) => `<meta property="og:${property}" content="${property === 'title' ? localizedTitle[locale] : localizedDescription[locale]}" />`);
      html = html.replace(/<title>[^<]*<\/title>/, `<title>${localizedTitle[locale]}</title>`);
      html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (all, json) => {
        try {
          const data = JSON.parse(json);
          data.inLanguage = locale;
          if (data.headline) data.headline = localizedTitle[locale];
          if (data.description) data.description = localizedDescription[locale];
          return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
        } catch {
          return all;
        }
      });
    }
    await writeFile(file, html);
  }
}
