const origin='https://resetdigital.agency';
export function caseBreadcrumb(locale,url,title){
 const label={ru:'Кейсы',uk:'Кейси',en:'Cases',es:'Casos'}[locale];
 return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
  {'@type':'ListItem',position:1,name:'RESET',item:`${origin}/${locale}/`},
  {'@type':'ListItem',position:2,name:label,item:`${origin}/${locale}/#case-index`},
  {'@type':'ListItem',position:3,name:title,item:url},
 ]};
}
