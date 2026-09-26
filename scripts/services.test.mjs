import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFileSync(resolve(root,p),'utf8');
test('service destinations are discoverable, translated and attributed to the selected service',()=>{
 const sitemap=read('sitemap.xml');
 for(const locale of ['ru','uk','en']){
  const data=JSON.parse(read(`content/services/${locale}.json`));
  assert.equal(data.services.length,6);
  const home=read(`${locale}/index.html`),hub=read(`${locale}/services/index.html`);
  for(const service of data.services){
   const path=`/${locale}/services/${service.slug}/`,html=read(path.slice(1)+'index.html');
   assert.ok(home.includes(`href="${path}"`));assert.ok(hub.includes(`href="${path}"`));
   assert.ok(sitemap.includes(`<loc>https://resetdigital.agency${path}</loc>`));
   assert.equal((html.match(/<h1>/g)||[]).length,1);
   assert.ok(html.includes(`name="source" value="service-${service.slug}"`));
   assert.ok(html.includes('id="service-enquiry"'));
   for(const lang of ['ru','uk','en'])assert.ok(html.includes(`hreflang="${lang}" href="https://resetdigital.agency/${lang}/services/${service.slug}/"`));
   assert.ok(!html.includes('hreflang="es" href="https://resetdigital.agency/es/services/'));
   for(const match of html.matchAll(/href="(\/[^"?#]*)(?:[?#][^"]*)?"/g)){
    const p=match[1];assert.ok(existsSync(resolve(root,'.'+p+(p.endsWith('/')?'index.html':''))),`Missing target ${p} on ${path}`);
   }
   for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))assert.doesNotThrow(()=>JSON.parse(match[1]));
  }
 }
});
