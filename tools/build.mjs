import {readFile,writeFile,readdir,mkdir,cp,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';
import {packageExample} from './package-example.mjs';
import {renderHookReference} from './reference.mjs';
import {renderGameApi} from './game-api.mjs';
import {syncWiki} from './sync-wiki.mjs';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const context={window:{}};
runInNewContext(await readFile(path.join(root,'assets/js/navigation.js'),'utf8'),context);
const navigation=context.window.WIKI_PAGES;
if(!Array.isArray(navigation)||!navigation.length)throw Error('Missing page navigation');
const listed=new Set();
for(const row of navigation){
 if(!Array.isArray(row)||row.length!==3||row.some(s=>typeof s!=='string'||!s.trim())||!/^[-a-z0-9]+$/.test(row[0]))throw Error('Invalid navigation entry');
 if(listed.has(row[0]))throw Error(`Duplicate navigation entry: ${row[0]}`);
 listed.add(row[0]);
}
const pages=await readdir(path.join(root,'docs'));
await packageExample(root);
const hookReference=await renderHookReference(root);
const gameApi=await renderGameApi(root);
const metrics=await syncWiki(root,navigation,gameApi.data);
for(const[id,fragment]of Object.entries(gameApi.fragments)){
 const file=path.join(root,'docs',id+'.html'),html=await readFile(file,'utf8');
 if(!html.includes('<!-- game-api:start -->')||!html.includes('<!-- game-api:end -->'))throw Error('Missing game API markers: '+id);
 const rendered=html.replace(/<!-- game-api:start -->[\s\S]*?<!-- game-api:end -->/,()=>'<!-- game-api:start -->\n'+fragment+'\n<!-- game-api:end -->');
 if(rendered!==html)await writeFile(file,rendered);
}
const entries=[];
const decode=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
for(const name of pages.filter(f=>f.endsWith('.html'))){
 const filename=path.join(root,'docs',name);const originalHtml=await readFile(filename,'utf8');let html=originalHtml;
 if(name==='hook-reference.html'){
  if(!html.includes('<!-- hook-reference:start -->')||!html.includes('<!-- hook-reference:end -->'))throw Error('Hook reference markers missing');
  html=html.replace(/<!-- hook-reference:start -->[\s\S]*?<!-- hook-reference:end -->/,()=>'<!-- hook-reference:start -->\n'+hookReference+'\n<!-- hook-reference:end -->');
 }
 let synced=html;
 for(const match of html.matchAll(/<pre\b[^>]*\bdata-example="([^"]+)"[^>]*><code>[\s\S]*?<\/code><\/pre>/g)){
  if(!/^[A-Za-z0-9_/-]+\.lua$/.test(match[1]))throw Error('Invalid example path');
  const source=await readFile(path.join(root,'assets/examples',match[1]),'utf8');
  const block=match[0].replace(/<code>[\s\S]*?<\/code>/,()=>'<code>'+escape(source)+'</code>');
  synced=synced.replace(match[0],()=>block);
 }
 if(synced!==originalHtml)await writeFile(filename,synced);
 html=synced;
 const id=html.match(/data-page="([^"]+)"/)?.[1];
 const title=decode(html.match(/<h1>([\s\S]*?)<\/h1>/)?.[1]||'');
 const body=html.match(/<article>([\s\S]*?)<\/article>/)?.[1];
 if(!id||!title||!body)throw Error(`Missing metadata/article: ${name}`);
 if(id!==name.slice(0,-5)||!listed.has(id))throw Error(`Unlisted or mismatched page: ${name}`);
 if(!html.includes('../assets/js/navigation.js'))throw Error(`Missing shared navigation: ${name}`);
 if(html.indexOf('../assets/js/outline.js') < 0 || html.indexOf('../assets/js/outline.js') > html.indexOf('../assets/js/site.js'))throw Error(`Missing article outline or incorrect script order: ${name}`);
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
 const headings=[...body.matchAll(/<h([23])\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g)];
 const sections=headings.map((match,index)=>({
  id:match[2],title:decode(match[3].replace(/<[^>]+>/g,' ')).trim(),
  text:decode(body.slice(match.index+match[0].length,headings[index+1]?.index??body.length).replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim()
 }));
 entries.push({id,title,text,sections});
}
if(entries.length!==navigation.length)throw Error('Every navigation entry needs a matching HTML guide');
entries.sort((a,b)=>navigation.findIndex(p=>p[0]===a.id)-navigation.findIndex(p=>p[0]===b.id));
await writeFile(path.join(root,'assets/js/search-index.js'),`// Generated from docs/*.html by tools/build.mjs.\nwindow.WIKI_SEARCH = ${JSON.stringify(entries).replaceAll('<','\\u003c')};\n`);
const dist=path.join(root,'dist');await mkdir(dist,{recursive:true});
for(const item of ['index.html','.nojekyll','docs','assets'])await cp(path.join(root,item),path.join(dist,item),{recursive:true});
console.log(`Validated ${entries.length} HTML pages, local links and section anchors. Built dist/.`);
console.log(`Updated README/coverage: ${metrics.guides} guides and references; ${metrics.classes} classes; ${metrics.methods} functions.`);
