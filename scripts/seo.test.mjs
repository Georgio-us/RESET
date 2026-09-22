import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {canonicalRedirect} from '../seo-routing.js';
const root=resolve(fileURLToPath(new URL('../',import.meta.url)));
test('public aliases converge without creating redirects for missing documents',async()=>{
 for(const [from,to] of [['/ru','/ru/'],['/index.html','/ru/'],['/ru/index.html','/ru/'],['/materials/development/cms-ili-custom/index.html','/ru/materials/development/cms-ili-custom/'],['/cases/nivellux.html','/ru/cases/nivellux.html'],['/ru/materials/development','/ru/materials/development/'],['/ru/nonexistent',null],['/ru/cases/nivellux.html',null]])assert.equal(await canonicalRedirect(from,root),to,from);
});
test('sitemap contains unique self-canonical indexable pages and only published articles',async()=>{
 const xml=await readFile(resolve(root,'sitemap.xml'),'utf8');const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);assert.equal(urls.length,new Set(urls).size);
 for(const url of urls){const p=new URL(url).pathname;const s=await readFile(resolve(root,'.'+p+(p.endsWith('/')?'index.html':'')),'utf8');assert.doesNotMatch(s,/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i,url);assert.ok(s.includes(`rel="canonical" href="${url}"`),url);
 const m=p.match(/^\/(ru|uk|en|es)\/materials\/([^/]+)\/([^/]+)\/$/);if(m){const a=JSON.parse(await readFile(resolve(root,`content/articles/${m[1]}/${m[2]}/${m[3]}/article.json`),'utf8'));assert.equal(a.status,'published',url)}}
 assert.ok(urls.includes('https://resetdigital.agency/ru/materials/development/cms-ili-custom/'));
 assert.ok(!urls.some(u=>u.includes('presentation')));
});
