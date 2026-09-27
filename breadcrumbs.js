import {uiCopy} from './ui-copy.js';
const origin='https://resetdigital.agency';
const labels={
 ru:{home:'Главная',nav:'Хлебные крошки',categories:{marketing:'Маркетинг недвижимости',development:'Разработка сайтов',ai:'CRM и AI-автоматизация',design:'Дизайн',market:'Рынок недвижимости'}},
 uk:{home:'Головна',nav:'Навігаційний шлях',categories:{marketing:'Маркетинг нерухомості',development:'Розробка сайтів',ai:'CRM та AI-автоматизація',design:'Дизайн',market:'Ринок нерухомості'}},
 en:{home:'Home',nav:'Breadcrumbs',categories:{marketing:'Real estate marketing',development:'Website development',ai:'CRM and AI automation',design:'Design',market:'Real estate market'}},
 es:{home:'Inicio',nav:'Ruta de navegación',categories:{marketing:'Marketing inmobiliario',development:'Desarrollo web',ai:'CRM y automatización con IA',design:'Diseño',market:'Mercado inmobiliario'}}
};
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=value=>value.replace(/<[^>]*>/g,' ').replace(/&(?:amp|lt|gt|quot|apos|nbsp);|&#(?:x[\da-f]+|\d+);/gi,s=>{const named={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&nbsp;':' '};if(named[s])return named[s];const n=s.startsWith('&#x')?parseInt(s.slice(3),16):parseInt(s.slice(2),10);return n>0&&n<=0x10ffff?String.fromCodePoint(n):s}).replace(/\s+/g,' ').trim();
export function breadcrumbItems(html,{locale='ru',path='/',exists=()=>true}={}){
 if(/presentation|(?:^|\/)404\.html/.test(path)||!exists(path))return [];
 const l=labels[locale]||labels.ru,c=uiCopy[locale]||uiCopy.ru;
 const canonical=html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
 let current=path;
 if(canonical){try{const url=new URL(canonical);if(url.origin===origin)current=url.pathname}catch{}}
 current=current.replace(/index\.html$/,'');
 const route=current.replace(/^\/(ru|uk|en|es)(?=\/|$)/,'');
 if(route==='/'||route===''||!html.match(/<h1\b/i))return [];
 const title=plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||'');
 if(!title)return [];
 const home=`/${locale}/`,items=[{name:l.home,item:home}];
 if(route.startsWith('/cases/'))items.push({name:c.cases,item:home+'#case-index'});
 if(route.startsWith('/services/')&&route!=='/services/')items.push({name:c.services,item:home+'services/'});
 if(route.startsWith('/materials/')&&route!=='/materials/'){
  items.push({name:'Journal',item:home+'materials/'});
  const parts=route.split('/').filter(Boolean);
  if(parts.length>2&&l.categories[parts[1]])items.push({name:l.categories[parts[1]],item:home+'materials/'+parts[1]+'/'});
 }
 items.push({name:route==='/services/'?c.services:route==='/materials/'?'Journal':title,item:current});
 return items;
}
export function renderBreadcrumbs(html,options){
 const items=breadcrumbItems(html,options);
 if(!items.length)return html;
 // Replace legacy visual trails, keeping the page body and its headings intact.
 html=html.replace(/<(nav|div)\b[^>]*class="[^"]*\b(?:reset-breadcrumbs|ed-breadcrumbs|svc-breadcrumb|breadcrumbs)\b[^"]*"[^>]*>[\s\S]*?<\/\1>/gi,'');
 // Remove only BreadcrumbList nodes; preserve Article, Service and other metadata.
 function clean(data){
  if(Array.isArray(data))return data.map(clean).filter(x=>x!==null);
  if(!data||typeof data!=='object')return data;
  if(data['@type']==='BreadcrumbList'||Array.isArray(data['@type'])&&data['@type'].includes('BreadcrumbList'))return null;
  return Object.fromEntries(Object.entries(data).map(([k,v])=>[k,clean(v)]));
 }
 html=html.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,(tag,json)=>{
  try{const data=clean(JSON.parse(json));if(data===null)return '';return tag.replace(json,JSON.stringify(data).replace(/</g,'\\u003c'))}catch{return tag}
 });
 const schema={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((x,i)=>({'@type':'ListItem',position:i+1,name:x.name,item:origin+x.item}))};
 const nav=`<nav class="reset-breadcrumbs" aria-label="${labels[options.locale||'ru'].nav}"><ol>${items.map((x,i)=>`<li>${i===items.length-1?`<span aria-current="page">${escape(x.name)}</span>`:`<a href="${escape(x.item)}">${escape(x.name)}</a>`}</li>`).join('')}</ol></nav>`;
 html=html.replace('</header>','</header>'+nav);
 return html.replace('</head>',`<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head>`);
}
