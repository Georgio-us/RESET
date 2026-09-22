import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {renderSiteUI} from '../site-ui.js';
import {escape as e} from '../templates/articles/blocks.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const plan=JSON.parse(await readFile(resolve(root,'content/journal.json'),'utf8'));
const texts={ru:['Материалы о маркетинге, сайтах и автоматизации для недвижимости','Все материалы','Открыть раздел','В подготовке','Читать статью'],uk:['Матеріали про маркетинг, сайти та автоматизацію для нерухомості','Усі матеріали','Відкрити розділ','Готується','Читати статтю'],en:['Real estate marketing, websites and automation','All articles','Explore section','Coming soon','Read article'],es:['Marketing, webs y automatización para inmobiliarias','Todos los artículos','Ver sección','En preparación','Leer artículo']};
for(const locale of Object.keys(texts)){
 const c=texts[locale],articles=await Promise.all(plan.articles.map(async a=>JSON.parse(await readFile(resolve(root,`content/articles/${locale}/${a.category}/${a.slug}/article.json`),'utf8'))));
 const url=a=>`/${locale}/materials/${a.category}/${a.slug}/`;
 const card=a=>`<${a.status==='published'?'a':'article'} class="material-card material-card--plain" ${a.status==='published'?`href="${url(a)}"`:''}><span class="material-card__meta">${e(plan.labels[locale][plan.categories.indexOf(a.category)])}<span>${a.status==='published'?c[4]:c[3]}</span></span><h3>${e(a.title)}</h3></${a.status==='published'?'a':'article'}>`;
 const groups=`<div class="journal-groups" aria-label="RESET Journal">${plan.categories.map((cat,i)=>`<article class="journal-group ${i%2===0?'journal-accent':''}"><span>0${i+1} / RESET JOURNAL</span><h3>${e(plan.labels[locale][i])}</h3><ol>${articles.filter(a=>a.category===cat).map(a=>`<li>${a.status==='published'?`<a href="${url(a)}">${e(a.title)}</a>`:`<span>${e(a.title)} (${c[3]})</span>`}</li>`).join('')}</ol><a class="journal-category-link" href="/${locale}/materials/${cat}/">${c[2]} <span>→</span></a></article>`).join('')}</div>`;
 for(const home of [`${locale}/index.html`,...(locale==='ru'?['index.html']:[])]){
  const file=resolve(root,home);let html=await readFile(file,'utf8');
  html=html.replace(/<div class="journal-groups"[^>]*>[\s\S]*?<\/div>/,groups);
  await writeFile(file,html);
 }
 for(const category of [null,...plan.categories]){
  const index=plan.categories.indexOf(category),title=category?plan.labels[locale][index]:c[0],path=`/${locale}/materials/${category?category+'/':''}`;
  const main=category?`<main><div class="journal-container breadcrumbs"><a href="/${locale}/materials/">${c[1]}</a> / ${e(title)}</div><section class="journal-section-head"><div class="journal-container"><p class="journal-meta">RESET JOURNAL</p><h1>${e(title)}</h1><p>${e(plan.intros[locale][index])}</p></div></section><section class="journal-container section-cards"><div class="article-grid">${articles.filter(a=>a.category===category).map(card).join('')}</div></section></main>`:`<main><section class="journal-hero"><div class="journal-container"><p class="journal-meta">RESET JOURNAL</p><h1>${e(title)}</h1></div></section><section class="journal-container materials-index section-catalog">${plan.categories.map((cat,i)=>`<article class="section-catalog-card" id="${cat}"><div><p class="journal-meta">0${i+1} / RESET JOURNAL</p><h2>${e(plan.labels[locale][i])}</h2><p>${e(plan.intros[locale][i])}</p><a class="journal-button" href="/${locale}/materials/${cat}/">${c[2]} <span>→</span></a></div><ol>${articles.filter(a=>a.category===cat).map(a=>`<li>${a.status==='published'?`<a href="${url(a)}">${e(a.title)}</a>`:`<span>${e(a.title)}</span><small class="journal-draft-label">${c[3]}</small>`}</li>`).join('')}</ol></article>`).join('')}</section></main>`;
  const html=renderSiteUI(`<!doctype html><html lang="${locale}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)} | RESET</title><meta name="description" content="${e(category?plan.intros[locale][index]:c[0])}"><link rel="canonical" href="https://resetdigital.agency${path}"><link rel="stylesheet" href="/materials/materials.css"></head><body><header class="reset-header"></header>${main}<footer class="reset-footer"></footer></body></html>`,{locale,path,exists:p=>existsSync(resolve(root,'.'+p+(p.endsWith('/')?'index.html':'')))});
  for(const out of [path,...(locale==='ru'?[path.replace('/ru/','/')]:[])]){await mkdir(resolve(root,'.'+out),{recursive:true});await writeFile(resolve(root,'.'+out,'index.html'),html)}
 }
}
console.log('Journal built: 3 sections, 9 topics per locale.');
