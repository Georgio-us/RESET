import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {renderSiteUI,contactForm,arrow} from '../site-ui.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const origin='https://resetdigital.agency';
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=x=>x.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
const files=(await readdir(resolve(root,'content/services'))).filter(f=>f.endsWith('.json')).sort();
const content=Object.fromEntries(await Promise.all(files.map(async f=>[f.replace('.json',''),JSON.parse(await readFile(resolve(root,'content/services',f),'utf8'))])));
const locales=Object.keys(content);
const button=(label)=>`<a class="reset-button" href="#service-enquiry">${esc(label)}${arrow}</a>`;
const section=(id,title,body,caption='')=>`<section class="svc-section" id="${id}"><div class="svc-shell"><div class="svc-section-head"><h2>${esc(title)}</h2>${caption?`<span>${esc(caption)}</span>`:''}</div>${body}</div></section>`;
const outputs=[];
for(const [locale,data] of Object.entries(content)){
 const l=data.labels,base=`/${locale}/services/`;
 const related=(current)=>`<nav class="svc-related" aria-label="${esc(l.other)}">${data.services.filter(s=>s.slug!==current).map(s=>`<a href="${base}${s.slug}/">${esc(s.name)}</a>`).join('')}</nav>`;
 const contact=(source)=>`<section class="svc-section svc-contact" id="service-enquiry"><div class="svc-shell svc-contact-grid"><div><h2>${esc(l.contact)}</h2><p>${esc(l.contactText)}</p></div>${contactForm(locale,source)}</div></section>`;
 const render=(s,body)=>{
  const path=base+(s?s.slug+'/':'');const title=s?s.title:l.indexTitle;const intro=s?s.intro:l.indexIntro;
  const breadcrumbs=[{name:l.home,item:`${origin}/${locale}/`},{name:l.services,item:origin+base},...(s?[{name:s.name,item:origin+path}]:[])];
  const graph=[{'@type':'BreadcrumbList',itemListElement:breadcrumbs.map((x,i)=>({'@type':'ListItem',position:i+1,...x}))},s?{'@type':'Service',name:title,description:intro,url:origin+path,inLanguage:locale,provider:{'@type':'Organization',name:'RESET',url:origin}}:{'@type':'CollectionPage',name:title,description:intro,url:origin+path,inLanguage:locale}];
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} — RESET</title><meta name="description" content="${esc(intro)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${origin}${path}">${locales.map(lang=>`<link rel="alternate" hreflang="${lang}" href="${origin}/${lang}/services/${s?s.slug+'/':''}">`).join('')}<link rel="alternate" hreflang="x-default" href="${origin}/en/services/${s?s.slug+'/':''}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)} — RESET"><meta property="og:description" content="${esc(intro)}"><meta property="og:url" content="${origin}${path}"><meta property="og:site_name" content="RESET"><link rel="stylesheet" href="/service-pages.css?v=20260926-s1"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')}</script></head><body class="service-page"><main><section class="svc-hero"><div class="svc-shell"><nav class="svc-breadcrumb" aria-label="${esc(l.home)}"><a href="/${locale}/">${esc(l.home)}</a>${s?`<a href="${base}">${esc(l.services)}</a><span aria-current="page">${esc(s.name)}</span>`:`<span aria-current="page">${esc(l.services)}</span>`}</nav><p class="svc-kicker">${esc(l.eyebrow)}</p><div class="${s?'svc-hero-grid':''}"><div><h1>${esc(title)}</h1><p class="svc-intro">${esc(intro)}</p>${s?`<div class="svc-actions">${button(l.cta)}<a href="#cases">${esc(l.cases)} ↓</a></div>`:''}</div>${s?`<aside class="svc-fit"><h2>${esc(l.fit)}</h2><p>${esc(s.fit)}</p></aside>`:''}</div></div></section>${body}</main></body></html>`;
 };
 const hub=section('directions',l.services,`<div class="svc-grid">${data.services.map((s,i)=>`<a class="svc-card svc-card-link" href="${base}${s.slug}/"><span class="svc-number">0${i+1}</span><h2>${esc(s.name)}</h2><p>${esc(s.intro)}</p><span class="svc-more">${esc(l.details)} ↗</span></a>`).join('')}</div>`)+contact('services-index');
 outputs.push({locale,path:base,html:render(null,hub)});
 for(const s of data.services){
  const cases=await Promise.all(s.cases.map(async slug=>{
   const path=`/${locale}/cases/${slug}.html`;const html=await readFile(resolve(root,'.'+path),'utf8');
   if(/name="robots"[^>]*noindex/.test(html))throw Error('Non-indexable related case: '+path);
   const title=plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||html.match(/<title>(.*?)<\/title>/)?.[1]||slug);
   const description=html.match(/<meta name="description" content="([^"]*)"/)?.[1]||'';
   return `<a class="svc-case" href="${path}"><h3>${title}</h3><p>${description}</p><span>${esc(l.caseLink)} ↗</span></a>`;
  }));
  let body=section('includes',l.includes,`<div class="svc-grid">${s.includes.map(([h,p],i)=>`<article class="svc-card"><span class="svc-number">0${i+1}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div>`,l.scope);
  body+=section('process',l.process,`<ol class="svc-steps">${s.steps.map(([h,p],i)=>`<li><span class="svc-number">0${i+1}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('')}</ol>`,l.steps);
  body+=section('cases',l.cases,`<div class="svc-case-grid">${cases.join('')}</div>`);
  body+=`<section class="svc-section" id="pricing"><div class="svc-shell svc-cost"><h2>${esc(l.cost)}</h2><div><p>${esc(s.price)}</p><p class="svc-note">${esc(s.priceNote)}</p>${button(l.estimate)}</div></div></section>`;
  body+=section('faq',l.faq,`<div class="svc-faq">${s.faq.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`);
  body+=contact('service-'+s.slug)+section('other-services',l.other,related(s.slug));
  outputs.push({locale,path:base+s.slug+'/',html:render(s,body)});
 }
}
const available=new Set(outputs.map(o=>o.path));
for(const o of outputs){
 const file=resolve(root,'.'+o.path,'index.html');await mkdir(resolve(file,'..'),{recursive:true});
 const html=renderSiteUI(o.html,{locale:o.locale,path:o.path,exists:p=>available.has(p)||existsSync(resolve(root,'.'+p+(p.endsWith('/')?'index.html':'')))});
 await writeFile(file,html+'\n');
}
console.log(`Built ${outputs.length} service pages in ${locales.join(', ')}.`);
