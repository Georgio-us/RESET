import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderSiteUI } from '../site-ui.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const excluded = new Set(['.git','docs','node_modules','cases_21.09','temporary_assets']);
const walk = async dir => {
  const entries = await readdir(dir, {withFileTypes:true});
  return (await Promise.all(entries.filter(e => !excluded.has(e.name)).map(e => e.isDirectory() ? walk(resolve(dir,e.name)) : e.name.endsWith('.html') ? [resolve(dir,e.name)] : []))).flat();
};
let changed = 0;
for (const file of await walk(root)) {
  const path = '/' + relative(root,file);
  const before = await readFile(file,'utf8');
  const locale = path.match(/^\/(ru|uk|en|es)\//)?.[1] || before.match(/<html[^>]*lang="(ru|uk|en|es)"/)?.[1] || 'ru';
  const after = renderSiteUI(before, {locale,path,exists:target => existsSync(resolve(root,'.' + (target.endsWith('/') ? target+'index.html' : target)))}).replace(/^[\t ]+$/gm,'');
  if (before !== after) { await writeFile(file,after); changed++; }
}
console.log(`Shared UI: updated ${changed} pages.`);
