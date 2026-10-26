import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const origin='https://resetdigital.agency';
const cohort=JSON.parse(await readFile(join(root,'content/seo-sitemap-cohort.json'),'utf8'));
const selected=new Set([...cohort.indexedBaseline,...cohort.pilot].map(path=>origin+path));
if(selected.size!==cohort.indexedBaseline.length+cohort.pilot.length)throw Error('Duplicate URL in sitemap cohort');
const walk=async dir=>(await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?walk(join(dir,e.name)):e.name.endsWith('.html')?[join(dir,e.name)]:[]))).flat();
const urls=new Set();
for(const locale of ['ru','uk','en','es']){
 for(const file of await walk(join(root,locale))){
  const html=await readFile(file,'utf8');
  if(/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html))continue;
  const canonical=html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  if(!canonical)throw Error(`Missing canonical: ${file}`);
  const url=new URL(canonical);
  if(url.origin!==origin||url.search||url.hash)throw Error(`Invalid canonical: ${canonical}`);
  const path=resolve(root,'.'+url.pathname+(url.pathname.endsWith('/')?'index.html':''));
  if(!existsSync(path))throw Error(`Missing canonical target: ${canonical}`);
  const target=await readFile(path,'utf8');
  if(/name="robots"[^>]*content="[^"]*noindex/i.test(target))throw Error(`Noindex canonical: ${canonical}`);
  if(selected.has(canonical))urls.add(canonical);
 }
}
for(const url of selected)if(!urls.has(url))throw Error(`Sitemap cohort URL missing or not indexable: ${url}`);
const entries=[...urls].sort().map(url=>`  <url><loc>${url.replace(/&/g,'&amp;')}</loc></url>`);
await writeFile(join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`);
console.log(`Sitemap: ${urls.size} unique indexable canonical URLs.`);
