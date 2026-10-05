import {readFile,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
// Real assets already published in each case. Keep the artwork separate from copy.
const covers={
 'factor-seo':['FACTOR<br>SEO','/cases/factor_seo_assets/search-performance.png','landscape'],
 'kommo-crm':['KOMMO<br>CRM','/cases/kommo_crm_assets/pipeline.png','landscape'],
 'estyle-spain':['ESTYLE<br>SEO','/assets/estyle-search-LOCALE.svg','landscape'],
 'an-factor':['FACTOR<br>META ADS','/cases/factor_assets/Factor1_creo_2.webp','creative'],
 'shepit-website':['','/cases/shepit_assets/website.png','full'],
 'shepit-meta-ads':['SHEPIT<br>META ADS','/cases/shepit_assets/Shepit_creo_3.webp','creative'],
 'shepit-google-ads':['SHEPIT<br>GOOGLE ADS','/cases/shepit_assets/shepit_google.webp','landscape'],
 'telegram-ai-crm':['VIA<br>TELEGRAM AI','/cases/ai_assets/3.png','phone'],
 'nivellux':['NIVELLUX<br>WEB','/cases/nivellux_assets/nivellux_hero_LOCALE.webp','landscape'],
 'dominanta-spain':['DOMINANTA<br>NOTION','/cases/notion_assets/developers_database.webp','landscape'],
 'delmar-meta-ads':['DELMAR<br>META ADS','/cases/delmar_meta_assets/delmar_creo1.webp','creative'],
 'delmar-custom-crm':['DELMAR<br>ESTATE CRM','/cases/estate_crm_assets/dashboard4.webp','landscape'],
 'via-ai-widget':['VIA.AI<br>WEB WIDGET','/cases/via_widget_assets/unit_LOCALE.png','phone'],
 'bulgaria-masterplan':['','/cases/architecture_assets/masterplan-title.webp','full'],
 'bulgaria-villa-3d':['','/cases/villa_3d_assets/villa-render.webp','full'],
};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
for(const locale of ['ru','uk','en','es']){
 const files=[`${locale}/index.html`,...(locale==='ru'?['index.html']:[])];
 for(const file of files){
  let html=await readFile(resolve(root,file),'utf8');let count=0;
  html=html.replace(/<article class="dev-work-card\b[\s\S]*?<\/article>/g,card=>{
   const match=card.match(/<a class="dev-work-image[^>]*href="([^"]+\/cases\/([^/]+)\.html)"[^>]*>[\s\S]*?<\/a>/);
   if(!match||!covers[match[2]])return card;
   const [title,asset,kind]=covers[match[2]]; let src=asset.replace('LOCALE',locale);
   if(!existsSync(resolve(root,'.'+src)))src=asset.replace('LOCALE','ru');
   if(!existsSync(resolve(root,'.'+src)))throw new Error(`Missing cover asset: ${src}`);
   const label=card.match(/<p class="dev-label">([\s\S]*?)<\/p>/)?.[1].replace(/<[^>]+>/g,'')||title.replace('<br>',' ');
   const subtitle=card.match(/<\/h3><p>([\s\S]*?)<\/p>/)?.[1]||'';
   count++;
   const inner=kind==='full'?`<img src="${src}" alt="${esc(label)}" loading="lazy" decoding="async">`:`<small class="case-cover-index">${String(count).padStart(2,'0')} / CASE STUDY</small><div class="case-cover-fragment"><img src="${src}" alt="${esc(label)}" loading="lazy" decoding="async"></div><b class="case-cover-title">${title}</b><em class="case-cover-caption">${subtitle}</em>`;
   const arrow='<span class="case-cover-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14"/></svg></span>';
   const cover=`<a class="dev-work-image case-cover case-cover-${kind}${title.replaceAll('<br>','|').split('|').some(line=>line.length>9)?' case-cover-long-title':''}" href="${match[1]}" data-work-link="${match[2]}" aria-label="${esc(label)}">${inner}${arrow}</a>`;
   return card.replace(match[0],cover);
  });
  if(count!==15)throw new Error(`${file}: expected 15 covers, got ${count}`);
  html=html.replace(/home-case-covers\.css\?v=[^"']+/g,'home-case-covers.css?v=20261005-covers');
  await writeFile(resolve(root,file),html);
 }
}
console.log('Updated 15 case covers in all four locales and the root homepage.');
