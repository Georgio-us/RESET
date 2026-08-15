import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const outputLocales = ['ru', 'uk', 'en', 'es'];
const translationLocales = ['uk', 'en', 'es'];
const endpoint = 'https://translate.googleapis.com/translate_a/single';
const cache = new Map();

const walkSource = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    if (entry.name === '.git' || outputLocales.includes(entry.name)) return [];
    const file = join(directory, entry.name);
    if (entry.isDirectory()) return walkSource(file);
    return entry.name.endsWith('.html') ? [file] : [];
  }));
  return nested.flat();
};

const translateChunk = async (text, target) => {
  if (!text.trim() || !/[\p{L}]/u.test(text)) return text;
  const key = `${target}\0${text}`;
  if (cache.has(key)) return cache.get(key);
  const url = new URL(endpoint);
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'auto');
  url.searchParams.set('tl', target);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);
  let failure;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!response.ok) throw new Error(`Translation service returned ${response.status}`);
      const data = await response.json();
      const translated = data[0].map((part) => part[0]).join('');
      cache.set(key, translated);
      return translated;
    } catch (error) {
      failure = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw failure;
};

const translateStrings = async (strings, locale) => {
  const boundary = (index) => `\n[[[RESETBOUNDARY_${index}]]]\n`;
  const result = [];
  let batch = [];
  let batchLength = 0;
  const flush = async () => {
    if (!batch.length) return;
    const translated = await translateChunk(batch.map((item, index) => `${item}${index === batch.length - 1 ? '' : boundary(index)}`).join(''), locale);
    const items = translated.split(/\n\[\[\[RESETBOUNDARY_\d+\]\]\]\n/);
    if (items.length !== batch.length) throw new Error(`Translation boundary mismatch for ${locale}`);
    result.push(...items);
    batch = [];
    batchLength = 0;
  };
  for (const value of strings) {
    // Newline-separated, literal boundary markers survive the translation API.
    const addition = value.length + (batch.length ? boundary(batch.length - 1).length : 0);
    if (batch.length && batchLength + addition > 3_200) await flush();
    batch.push(value);
    batchLength += addition;
  }
  await flush();
  return result;
};

const translateHtml = async (source, locale) => {
  const values = [];
  const marker = (value) => {
    const index = values.push(value) - 1;
    return `RESETLOCALIZEDVALUE${index}END`;
  };
  const protectedParts = source.split(/(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<!--[\s\S]*?-->)/gi);
  let html = protectedParts.map((part, index) => {
    if (index % 2) return part;
    return part
      .replace(/\b(aria-label|alt|placeholder|title)="([^"]+)"/gi, (_, attribute, value) => `${attribute}="${marker(value)}"`)
      .replace(/>([^<>]+)</g, (_, value) => (/[\p{L}]/u.test(value) ? `>${marker(value)}<` : `>${value}<`));
  }).join('');

  const translations = await translateStrings(values, locale);
  html = html.replace(/RESETLOCALIZEDVALUE(\d+)END/g, (_, index) => translations[Number(index)]);

  // The source copies occasionally include the old runtime Ukrainian dictionary.
  // Locales are fully static now, so loading it would overwrite translated text.
  html = html.replace(/\s*<script[^>]+src="[^"]*i18n\.js"[^>]*><\/script>/gi, '');
  html = html.replace(/<html lang="[^"]+">/i, `<html lang="${locale}">`);
  // Product names, country labels and the hero verb are editorial strings, not
  // material for machine translation.
  html = html.replace(/>U\.A\.</g, '>UA<');
  if (locale === 'en') html = html.replace('Setting it up<br />', 'Setting up<br />');
  if (locale === 'es') {
    html = html
      .replace('Configurarlo<br />', 'Configurar<br />')
      .replace(/RE<span([^>]*)>CONJUNTO<\/span>/g, 'RE<span$1>SET</span>')
      .replace(/>CONJUNTO INMOBILIARIO</g, '>REAL ESTATE SET<')
      .replace(/>CONJUNTO</g, '>SET<')
      .replaceAll('REINICIAR', 'RESET');
  }
  return html;
};

const requestedRoutes = new Set(process.argv.slice(2));
const sourceFiles = (await walkSource(root)).filter((file) => !requestedRoutes.size || requestedRoutes.has(relative(root, file)));
if (!sourceFiles.length) throw new Error('No source HTML pages matched the requested routes.');
for (const sourceFile of sourceFiles) {
  const route = relative(root, sourceFile);
  const source = await readFile(sourceFile, 'utf8');
  for (const locale of outputLocales) {
    const destination = join(root, locale, route);
    await mkdir(dirname(destination), { recursive: true });
    const document = locale === 'ru' ? source.replace(/\s*<script[^>]+src="[^"]*i18n\.js"[^>]*><\/script>/gi, '') : await translateHtml(source, locale);
    await writeFile(destination, document);
  }
  process.stdout.write(`Built ${route}\n`);
}
