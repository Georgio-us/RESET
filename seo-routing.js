import {stat} from 'node:fs/promises';
import {resolve} from 'node:path';
// Redirect only known public documents; nonexistent routes still return 404.
export async function canonicalRedirect(pathname,root){
 let target=pathname;
 if(target==='/index.html')return '/ru/';
 if(/^\/(materials|cases)\//.test(target))target='/ru'+target;
 if(target.endsWith('/index.html'))target=target.slice(0,-10);
 if(/^\/(ru|uk|en|es)(?:\/|$)/.test(target)&&!target.endsWith('/')&&!target.split('/').at(-1).includes('.'))target+='/';
 if(target===pathname)return null;
 const file=resolve(root,'.'+target+(target.endsWith('/')?'index.html':''));
 if(!file.startsWith(root+'/'))return null;
 try{return (await stat(file)).isFile()?target:null}catch{return null}
}
