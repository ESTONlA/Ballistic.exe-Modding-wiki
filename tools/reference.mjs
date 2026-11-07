import {readFile} from 'node:fs/promises';
import path from 'node:path';
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export async function renderHookReference(root){
  const data=JSON.parse(await readFile(path.join(root,'assets/data/observed-hooks.json'),'utf8'));
  if(data.schemaVersion!==1||!Array.isArray(data.entries))throw Error('Invalid hook reference data');
  const ids=new Set(),paths=new Set();
  return data.entries.map(entry=>{
    if(!/^[a-z0-9-]+$/.test(entry.id)||ids.has(entry.id)||paths.has(entry.path)
      ||!/^\/(Game|Script)\/[A-Za-z0-9_/.]+:[A-Za-z0-9_]+$/.test(entry.path)
      ||!['recorded','dump'].includes(entry.evidence))throw Error('Invalid/duplicate hook reference entry');
    for(const key of ['title','scope','role','signature','notes'])if(typeof entry[key]!=='string'||!entry[key].trim())throw Error('Incomplete hook reference: '+entry.id);
    ids.add(entry.id);paths.add(entry.path);
    return `<h3 id="ref-${entry.id}">${escape(entry.title)}</h3><p>${escape(entry.scope)} · ${entry.evidence==='recorded'?'Recorded local integration path':'Dump-observed; separate runtime check needed'}</p><pre data-title="Full reflected path" data-language="text"><code>${escape(entry.path)}</code></pre><p>${escape(entry.role)}</p><p><strong>Signature note:</strong> ${escape(entry.signature)}</p><p><strong>Scope:</strong> ${escape(entry.notes)}</p>`;
  }).join('\n');
}
