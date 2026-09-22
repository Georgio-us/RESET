import {readFile,writeFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {existsSync} from 'node:fs';
const root=fileURLToPath(new URL('../',import.meta.url));
function robots(html,value){const tag=`<meta name="robots" content="${value}">`;return /<meta[^>]*name="robots"[^>]*>/i.test(html)?html.replace(/<meta[^>]*name="robots"[^>]*>/i,tag):html.replace('</head>',tag+'</head>')}
let count=0;
for(const prefix of ['', 'ru/','uk/','en/','es/']){
 const locale=prefix.replace('/','')||'ru';
 const cats={};
 for(const category of await readdir(resolve(root,'content/articles',locale))){
  if(category.includes('.'))continue;
  const dir=resolve(root,'content/articles',locale,category);
  for(const slug of await readdir(dir)){
   const a=JSON.parse(await readFile(resolve(dir,slug,'article.json'),'utf8'));
   if(a.status==='published')cats[category]=(cats[category]||0)+1;
  }
 }
 const targets=[['materials/index.html',Object.keys(cats).length>0],...['marketing','development','ai','design','market'].map(cat=>[`materials/${cat}/index.html`,!!cats[cat]]),['cases/shepit-house-presentation.html',false],['cases/shepit-house-presentation-ua.html',false],['presentation.html',false]];
 for(const [route,index] of targets){
  const path=resolve(root,prefix+route);if(!existsSync(path))continue;
  const old=await readFile(path,'utf8'),html=robots(old,index?'index,follow,max-image-preview:large':'noindex,follow');
  if(html!==old){await writeFile(path,html);count++}
 }
}
console.log(`Indexing policy: ${count} pages updated.`);
await import('./generate-sitemap.mjs');
