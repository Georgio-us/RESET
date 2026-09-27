import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {renderArticle} from '../templates/articles/render.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFileSync(resolve(root,p),'utf8');
const plan=JSON.parse(read('content/journal.json')).articles;
const locales=['ru','uk','en','es'];
test('every journal topic is published in all four languages, linked and indexable',()=>{
 const sitemap=read('sitemap.xml');
 for(const {category,slug} of plan) for(const locale of locales){
  const source=`content/articles/${locale}/${category}/${slug}/`;
  const meta=JSON.parse(read(source+'article.json'));
  const body=read(source+'body.html.inc');
  const path=`/${locale}/materials/${category}/${slug}/`;
  const html=read(path.slice(1)+'index.html');
  assert.equal(meta.status,'published',path);
  assert.ok(body.length>5000,`Incomplete body: ${path}`);
  assert.match(html,/<meta name="robots" content="index,follow/);
  assert.ok(html.includes(`<link rel="canonical" href="https://resetdigital.agency${path}">`));
  assert.ok(sitemap.includes(`<loc>https://resetdigital.agency${path}</loc>`));
  assert.ok(read(`${locale}/materials/${category}/index.html`).includes(`href="${path}"`));
  for(const lang of locales) assert.ok(html.includes(`hreflang="${lang}" href="https://resetdigital.agency/${lang}/materials/${category}/${slug}/"`),path+' '+lang);
  if(['en','es'].includes(locale)) assert.doesNotMatch(body+JSON.stringify(meta),/[А-Яа-яЁёІіЇїЄє]/,path);
  for(const [,url] of body.matchAll(/(?:href|src)="(\/[^"#]+)"/g)){
   assert.ok(existsSync(resolve(root,'.'+url+(url.endsWith('/')?'index.html':''))),`${path}: ${url}`);
   if(url.includes('/materials/'))assert.ok(url.startsWith(`/${locale}/materials/`),url);
  }
 }
});
test('article alternate links exclude drafts and unrelated topics',()=>{
 const a={locale:'ru',category:'ai',slug:'sample',status:'published',title:'Sample',description:'Sample'};
 const all=[a,{...a,locale:'en'},{...a,locale:'es',status:'draft'},{...a,locale:'uk',slug:'other'}];
 const html=renderArticle(a,'<h2>Body</h2><p>Text</p>',all,()=>true).split('</head>')[0];
 assert.match(html,/hreflang="ru"/);assert.match(html,/hreflang="en"/);assert.match(html,/hreflang="x-default"/);
 assert.doesNotMatch(html,/hreflang="es"|hreflang="uk"/);
 const draft=renderArticle({...a,status:'draft'},'<p>Draft</p>',all,()=>true).split('</head>')[0];
 assert.doesNotMatch(draft,/hreflang=/);
});
