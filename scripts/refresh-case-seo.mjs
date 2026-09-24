import {readFile, writeFile, readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {caseBreadcrumb} from '../seo-metadata.js';
const root=fileURLToPath(new URL('../',import.meta.url));
for(const locale of ['','ru','uk','en','es']) {
 const dir=resolve(root,locale,'cases');
 for(const name of await readdir(dir)) {
  if(!name.endsWith('.html'))continue;
  const file=resolve(dir,name);let html=await readFile(file,'utf8');const old=html;
  // The old product page was replaced by the current Telegram case.
  html=html.replaceAll('ai-sales-assistant.html','telegram-ai-crm.html');
  const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  const title=html.match(/<title>(.*?)<\/title>/s)?.[1]?.replace(/\s*[—–]\s*RESET$/,'');
  if(canonical&&title)html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(tag,json)=>{
   const data=JSON.parse(json);return data['@type']==='BreadcrumbList'?`<script type="application/ld+json">${JSON.stringify(caseBreadcrumb(locale||'ru',canonical,title))}</script>`:tag;
  });
  if(html!==old)await writeFile(file,html);
 }
}
