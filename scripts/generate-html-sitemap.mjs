import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const xml=await readFile(resolve(root,'sitemap.xml'),'utf8');
const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]));
const labels={ru:['Основные страницы','Кейсы','Журнал'],uk:['Основні сторінки','Кейси','Журнал'],en:['Main pages','Cases','Journal'],es:['Páginas principales','Casos','Revista']};
for(const locale of ['ru','uk','en','es']){
 const groups=[[],[],[]];
 for(const url of urls.filter(u=>u.pathname.startsWith(`/${locale}/`))){
  const html=await readFile(resolve(root,'.'+url.pathname+(url.pathname.endsWith('/')?'index.html':'')),'utf8');
  const title=html.match(/<title>(.*?)<\/title>/s)?.[1].replace(/\s*[—–]\s*RESET$/,'')||url.pathname;
  const group=url.pathname.includes('/cases/')?1:url.pathname.includes('/materials/')?2:0;
  groups[group].push(`<li><a href="${url.pathname}">${title}</a></li>`);
 }
 for(const prefix of locale==='ru'?['','ru']: [locale]){
  const file=resolve(root,prefix,'sitemap.html');let html=await readFile(file,'utf8');
  html=html.replace(/<section class="section-cards">[\s\S]*?<\/section>/,`<section class="section-cards">${groups.map((items,i)=>items.length?`<h2>${labels[locale][i]}</h2><ul>${items.join('')}</ul>`:'').join('')}</section>`);
  html=html.replace(/(https:\/\/resetdigital.agency\/[^" ]*\.html)\//g,'$1');
  await writeFile(file,html);
 }
}
