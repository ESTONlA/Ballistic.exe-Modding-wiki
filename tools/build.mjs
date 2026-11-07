import {readFile,writeFile,readdir,mkdir,cp,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const pages=await readdir(path.join(root,'docs'));
const entries=[];
const decode=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
for(const name of pages.filter(f=>f.endsWith('.html'))){
 const filename=path.join(root,'docs',name),html=await readFile(filename,'utf8');
 const id=html.match(/data-page="([^"]+)"/)?.[1];
 const title=decode(html.match(/<h1>([\s\S]*?)<\/h1>/)?.[1]||'');
 const body=html.match(/<article>([\s\S]*?)<\/article>/)?.[1];
 if(!id||!title||!body)throw Error(`Missing metadata/article: ${name}`);
 if((html.match(/<h1>/g)||[]).length!==1)throw Error(`Expected one title: ${name}`);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)throw Error(`Duplicate anchor: ${name}`);
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=decode(match[1]);if(/^(https?:|mailto:)/.test(href))continue;
  const [target,anchor]=href.split('#');
  const targetFile=path.resolve(path.dirname(filename),target||name);
  if(!targetFile.startsWith(root+path.sep))throw Error(`Escaping link: ${href}`);
  if(!(await stat(targetFile).catch(()=>null)))throw Error(`Missing link ${name}: ${href}`);
  if(anchor){const dest=target?await readFile(targetFile,'utf8'):html;if(!dest.includes(`id="${anchor}"`))throw Error(`Missing anchor: ${href}`);}
 }
 const text=decode(body.replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
 entries.push({id,title,text});
}
if(entries.length!==9)throw Error(`Expected nine documentation pages, got ${entries.length}`);
await writeFile(path.join(root,'assets/js/search-index.js'),`// Generated from docs/*.html by tools/build.mjs.\nwindow.WIKI_SEARCH = ${JSON.stringify(entries).replaceAll('<','\\u003c')};\n`);
const dist=path.join(root,'dist');await mkdir(dist,{recursive:true});
for(const item of ['index.html','.nojekyll','docs','assets'])await cp(path.join(root,item),path.join(dist,item),{recursive:true});
console.log(`Validated ${entries.length} HTML pages, local links and section anchors. Built dist/.`);
