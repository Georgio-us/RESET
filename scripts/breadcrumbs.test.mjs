import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {renderSiteUI} from '../site-ui.js';
const root=resolve(import.meta.dirname,'..');
const read=p=>readFileSync(resolve(root,'.'+p+(p.endsWith('/')?'index.html':'')),'utf8');
const exists=p=>existsSync(resolve(root,'.'+p.split('#')[0]+(p.split('#')[0].endsWith('/')?'index.html':'')));
function schemas(html){return [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(([,s])=>{const d=JSON.parse(s);return [d,...(d['@graph']||[])]}).filter(d=>d['@type']==='BreadcrumbList')}
test('every canonical internal page has one matching visible and structured breadcrumb trail',()=>{
 const urls=[...read('/sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(([,u])=>u);
 for(const url of urls){const p=new URL(url).pathname,h=read(p);if(/^\/(ru|uk|en|es)\/$/.test(p)){assert.ok(!h.includes('class="reset-breadcrumbs"'));continue;}
 const nav=h.match(/<nav class="reset-breadcrumbs"[\s\S]*?<\/nav>/)?.[0];assert.ok(nav,p);
 assert.equal((h.match(/class="reset-breadcrumbs"/g)||[]).length,1,p);
 const data=schemas(h);assert.equal(data.length,1,p);const items=data[0].itemListElement;
 assert.equal(items[0].item,`https://resetdigital.agency/${p.split('/')[1]}/`);
 assert.equal(items.at(-1).item,url);assert.ok(nav.includes('aria-current="page"'));
 for(const [i,item] of items.entries()){assert.equal(item.position,i+1);const u=new URL(item.item);assert.ok(exists(u.pathname),item.item);if(u.hash)assert.ok(read(u.pathname).includes(`id="${u.hash.slice(1)}"`),item.item);if(i<items.length-1)assert.ok(nav.includes(`href="${u.pathname+u.hash}"`),item.item);}
 assert.equal(renderSiteUI(h,{locale:p.split('/')[1],path:p,exists}),h,p+' renderer idempotence');
 }
});
test('normalization preserves other schema and escapes the current title',()=>{
 const h='<html><head><script type="application/ld+json">{"@graph":[{"@type":"Article","headline":"Keep me"},{"@type":"BreadcrumbList","itemListElement":[]}]}</script></head><body><main><nav class="ed-breadcrumbs">Old</nav><h1>A &amp; B &lt;test&gt;</h1></main></body></html>';
 const out=renderSiteUI(h,{locale:'en',path:'/en/materials/ai/test/',exists:()=>true});
 assert.equal(schemas(out).length,1);assert.ok(out.includes('"headline":"Keep me"'));assert.ok(out.includes('A &amp; B &lt;test&gt;</span>'));assert.ok(!out.includes('class="ed-breadcrumbs"'));
 for(const path of ['/en/','/presentation.html','/en/404.html'])assert.ok(!renderSiteUI(h,{locale:'en',path,exists:()=>true}).includes('class="reset-breadcrumbs"'));
 assert.ok(!renderSiteUI(h,{locale:'en',path:'/en/missing',exists:()=>false}).includes('class="reset-breadcrumbs"'));
});
