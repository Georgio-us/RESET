import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const walk = async (dir) => (await Promise.all((await readdir(dir, { withFileTypes: true })).map(async (entry) => {
  const file = join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : (entry.name.endsWith('.html') ? [file] : []);
}))).flat();
for (const locale of ['ru', 'uk', 'en', 'es']) for (const file of await walk(join(root, locale))) {
  let html = await readFile(file, 'utf8');
  html = html.replace(/>U\.A\.</g, '>UA<');
  if (locale === 'en') html = html.replace('Setting it up<br />', 'Setting up<br />');
  if (locale === 'es') html = html.replace('Configurarlo<br />', 'Configurar<br />')
    .replace(/RE<span([^>]*)>CONJUNTO<\/span>/g, 'RE<span$1>SET</span>')
    .replace(/>CONJUNTO INMOBILIARIO</g, '>REAL ESTATE SET<')
    .replace(/>CONJUNTO</g, '>SET<').replaceAll('REINICIAR', 'RESET');
  await writeFile(file, html);
}
