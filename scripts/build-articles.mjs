import { readdir,readFile,writeFile,mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve,dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderArticle,articlePath } from '../templates/articles/render.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
async function walk(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?walk(resolve(dir,e.name)):e.name==='article.json'?[resolve(dir,e.name)]:[]))).flat()}
const files=(await walk(resolve(root,'content/articles'))).sort();
const all=await Promise.all(files.map(async f=>({...JSON.parse(await readFile(f,'utf8')),file:f})));
let changed=0,outputs=0;
for(const a of all){
 if(!/^(ru|uk|en|es)$/.test(a.locale)||![a.category,a.slug].every(s=>/^[a-z0-9-]+$/.test(s)))throw Error('Invalid article path');
 if(a.hero&&(!a.hero.alt||!existsSync(resolve(root,'.'+a.hero.src))))throw Error(`Missing image or alt: ${a.file}`);
 const body=await readFile(resolve(dirname(a.file),'body.html.inc'),'utf8');
 const html=renderArticle(a,body,all,p=>all.some(item=>articlePath(item)===p)||existsSync(resolve(root,'.'+p+(p.endsWith('/')?'index.html':''))));
 for(const p of [articlePath(a),...(a.locale==='ru'?[articlePath(a).replace('/ru/','/')]:[])]){
  const out=resolve(root,'.'+p,'index.html');outputs++;
  const old=existsSync(out)?await readFile(out,'utf8'):'';
  if(old!==html){changed++;if(!process.argv.includes('--check')){await mkdir(dirname(out),{recursive:true});await writeFile(out,html)}}
 }
}
console.log(`${all.length} article sources, ${outputs} pages, ${changed} ${process.argv.includes('--check')?'out of date':'updated'}.`);
if(process.argv.includes('--check')&&changed)process.exitCode=1;
