import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const apiAnchor=path=>'symbol-'+createHash('sha256').update(path).digest('hex').slice(0,12);
export async function loadGameApi(root) {
  const data=JSON.parse(await readFile(path.join(root,'assets/data/game-api.json'),'utf8'));
  if(data.schemaVersion!==1||!/^\d{4}-\d{2}-\d{2}$/.test(data.snapshotDate))throw Error('Invalid game API metadata');
  const seen=new Set();
  for(const entry of [...data.classes,...data.structs,...data.enums]){
    if(seen.has(entry.path)||!/^\/(Game|Script)\//.test(entry.path))throw Error('Invalid/duplicate API entry');
    seen.add(entry.path);
    for(const field of entry.fields||[])if(!field.path.startsWith(entry.path+':')||!field.type)throw Error('Invalid API field');
    for(const method of entry.methods||[])if(!method.path.startsWith(entry.path+':')||!Array.isArray(method.fields))throw Error('Invalid API method');
  }
  return data;
}
const table=(heads,rows)=>`<div class="table-scroll"><table><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
const fieldsTable=fields=>table(['Reflected field','Recorded type'],fields.map(field=>`<tr id="${apiAnchor(field.path)}"><td><code>${esc(field.name)}</code></td><td><code>${esc(field.type)}</code></td></tr>`));
function classHtml(entry){
  const fields=entry.fields;
  const methods=entry.methods.filter(method=>!method.generated);
  const generated=entry.methods.filter(method=>method.generated);
  const methodTable=items=>table(['Function / event','Recorded fields (not a verified call signature)'],items.map(method=>`<tr id="${apiAnchor(method.path)}"><td><code>${esc(method.name)}</code><details><summary>Full path</summary><code>${esc(method.path)}</code></details></td><td>${method.fields.length?`<details><summary>${method.fields.length} reflected ${method.fields.length===1?'field':'fields'}</summary><ul>${method.fields.map(field=>`<li><code>${esc(field.name)}</code>: <code>${esc(field.type)}</code></li>`).join('')}</ul></details>`:'No function fields recorded.'}</td></tr>`));
  return `<h2 id="${apiAnchor(entry.path)}">${esc(entry.name)}</h2>
<pre data-title="Class path" data-language="text"><code>${esc(entry.path)}</code></pre>
<p>${esc(entry.kind)}. Parent: <code>${esc(entry.parent||'not resolved in this snapshot')}</code>. ${entry.fields.length} directly declared fields; ${entry.methods.length} directly declared functions. Inherited members are listed on their declaring class.</p>
${fields.length?`<details class="api-details"><summary>Declared fields (${fields.length})</summary>${fieldsTable(fields)}</details>`:'<p>No directly declared fields recorded.</p>'}
${methods.length?`<details class="api-details"><summary>Functions and events (${methods.length})</summary>${methodTable(methods)}</details>`:'<p>No directly declared named functions recorded.</p>'}
${generated.length?`<details class="api-details"><summary>Compiler-generated event functions (${generated.length})</summary><p>Compiler names are especially unstable. Their reflected fields include Blueprint graph locals; do not turn this list into positional Lua arguments.</p>${methodTable(generated)}</details>`:''}`;
}
export async function renderGameApi(root){
  const data=await loadGameApi(root), fragments={};
  for(const group of new Set(data.classes.map(c=>c.group)))fragments[group]=data.classes.filter(c=>c.group===group).sort((a,b)=>a.name.localeCompare(b.name)).map(classHtml).join('\n');
  fragments['api-structs']=data.structs.sort((a,b)=>a.name.localeCompare(b.name)).map(entry=>`<h2 id="${apiAnchor(entry.path)}">${esc(entry.name)}</h2><pre data-title="Struct path" data-language="text"><code>${esc(entry.path)}</code></pre>${entry.fields.length?fieldsTable(entry.fields):'<p>No fields recorded in the snapshot.</p>'}`).join('\n');
  fragments['api-enums']=data.enums.sort((a,b)=>a.name.localeCompare(b.name)).map(entry=>`<h2 id="${apiAnchor(entry.path)}">${esc(entry.name)}</h2><pre data-title="Enum path" data-language="text"><code>${esc(entry.path)}</code></pre><p>Recorded numeric entries; generated names are not translated display labels. MAX entries are sentinels, not gameplay choices.</p>${table(['Recorded name','Value'],entry.values.map(value=>`<tr><td><code>${esc(value.name)}</code></td><td>${value.value}</td></tr>`))}`).join('\n');
  return {data,fragments};
}
