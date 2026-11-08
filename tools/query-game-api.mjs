import {readFile} from 'node:fs/promises';
import {apiAnchor} from './game-api.mjs';
const args=process.argv.slice(2), words=[];
let kind='all', limit=20;
for(let i=0;i<args.length;i++){
  if(args[i]==='--kind')kind=args[++i];
  else if(args[i]==='--limit')limit=Number(args[++i]);
  else if(args[i].startsWith('--'))throw Error('Unknown option: '+args[i]);
  else words.push(args[i]);
}
if(!['all','class','function','field','struct','enum'].includes(kind)||!Number.isInteger(limit)||limit<1||limit>200)throw Error('Use --kind all|class|function|field|struct|enum and --limit 1..200');
if(!words.length)throw Error('Usage: node tools/query-game-api.mjs <name or path> [--kind function] [--limit 20]');
const data=JSON.parse(await readFile(new URL('../assets/data/game-api.json',import.meta.url),'utf8'));
const entries=[];
for(const c of data.classes){
  entries.push({kind:'class',path:c.path,owner:c.parent,page:c.group+'.html#'+apiAnchor(c.path)});
  for(const f of c.fields)entries.push({kind:'field',path:f.path,type:f.type,owner:c.path,page:c.group+'.html#'+apiAnchor(f.path)});
  for(const f of c.methods)entries.push({kind:'function',path:f.path,owner:c.path,recordedFields:f.fields.length,generated:f.generated,page:c.group+'.html#'+apiAnchor(f.path)});
}
for(const s of data.structs){
  entries.push({kind:'struct',path:s.path,page:'api-structs.html#'+apiAnchor(s.path)});
  for(const f of s.fields)entries.push({kind:'field',path:f.path,type:f.type,owner:s.path,page:'api-structs.html#'+apiAnchor(f.path)});
}
for(const e of data.enums)entries.push({kind:'enum',path:e.path,values:e.values,page:'api-enums.html#'+apiAnchor(e.path)});
const terms=words.join(' ').toLowerCase().split(/\s+/).filter(Boolean);
const matches=entries.filter(e=>(kind==='all'||e.kind===kind)&&terms.every(t=>e.path.toLowerCase().includes(t)));
console.log(JSON.stringify({sourceDate:data.snapshotDate,evidence:'Dump-observed declarations; not runtime validation.',total:matches.length,shown:Math.min(limit,matches.length),results:matches.slice(0,limit)},null,2));
