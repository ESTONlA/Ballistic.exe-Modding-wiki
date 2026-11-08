import {readFile,writeFile,readdir} from 'node:fs/promises';
import path from 'node:path';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export async function syncWiki(root,navigation,api){
  const coverage=JSON.parse(await readFile(path.join(root,'assets/data/coverage.json'),'utf8'));
  if(!Number.isFinite(coverage.estimatedGameCoveragePercent)||coverage.estimatedGameCoveragePercent<0||coverage.estimatedGameCoveragePercent>100||!coverage.basis)throw Error('Invalid coverage estimate');
  const pages=navigation.length,guides=pages-navigation.filter(p=>p[0]==='changelog').length;
  const methods=api.classes.reduce((n,c)=>n+c.methods.length,0),fields=api.classes.reduce((n,c)=>n+c.fields.length,0);
  const badges=`[![Game coverage: approximately ${coverage.estimatedGameCoveragePercent}%](https://img.shields.io/badge/Game_coverage-~${coverage.estimatedGameCoveragePercent}%25-5b8def?style=for-the-badge&labelColor=20232a)](docs/coverage.html)
[![${guides} guides and reference chapters](https://img.shields.io/badge/Guides_%26_references-${guides}-5b8def?style=for-the-badge&labelColor=20232a)](docs/introduction.html#guide-index)
[![${pages} pages](https://img.shields.io/badge/Pages-${pages}-5b8def?style=for-the-badge&labelColor=20232a)](docs/introduction.html#guide-index)`;
  const readmePath=path.join(root,'README.md');let readme=await readFile(readmePath,'utf8');
  if(!readme.includes('<!-- wiki-badges:start -->')||!readme.includes('<!-- wiki-count:start -->'))throw Error('README metrics markers missing');
  readme=readme.replace(/<!-- wiki-badges:start -->[\s\S]*?<!-- wiki-badges:end -->/,()=>`<!-- wiki-badges:start -->\n${badges}\n<!-- wiki-badges:end -->`);
  readme=readme.replace(/<!-- wiki-count:start -->[\s\S]*?<!-- wiki-count:end -->/,()=>`<!-- wiki-count:start -->\nThere are ${guides} guides and reference chapters across ${pages} pages, including the changelog. The game API reference indexes ${api.classes.length} observed classes, ${methods.toLocaleString('en-US')} functions, ${fields.toLocaleString('en-US')} directly declared class fields, ${api.structs.length} structs and ${api.enums.length} enums. The [coverage page](docs/coverage.html) explains the snapshot's scope and remaining research gaps. The game-coverage percentage is a rough estimate, not an audited count of the whole game.\n<!-- wiki-count:end -->`);
  await writeFile(readmePath,readme);
  const fallback='<noscript><p>JavaScript adds navigation and search. '+navigation.map(row=>`<a href="${row[0]}.html">${esc(row[1])}</a>`).join(' &middot; ')+'</p></noscript>';
  const index='<h2 id="guide-index">Guide index</h2>\n'+[...new Set(navigation.map(row=>row[2]))].map((group,i)=>`<h3 id="index-group-${i}">${esc(group)}</h3><ul>${navigation.filter(row=>row[2]===group).map(row=>`<li><a href="${row[0]}.html">${esc(row[1])}</a></li>`).join('')}</ul>`).join('\n');
  const report=`<p>The wiki has <strong>${guides} guides and reference chapters across ${pages} pages</strong>. Counts are rebuilt from the navigation manifest; the changelog is a page but is excluded from the guide count.</p>
<div class="table-scroll"><table><thead><tr><th>Measured reference scope</th><th>Count</th></tr></thead><tbody><tr><td>Observed class declarations indexed</td><td>${api.classes.length}</td></tr><tr><td>Directly declared functions, including generated events</td><td>${methods}</td></tr><tr><td>Directly declared class fields</td><td>${fields}</td></tr><tr><td>Game structs</td><td>${api.structs.length}</td></tr><tr><td>Game enums</td><td>${api.enums.length}</td></tr></tbody></table></div>
<p>The snapshot file is dated ${api.snapshotDate}; its Steam build was not recorded. Only loaded game objects in that snapshot are indexed. This is not a complete inventory of the full game or an execution test of each function.</p>
<p>The README's approximately <strong>${coverage.estimatedGameCoveragePercent}%</strong> game-coverage figure remains an editorial estimate, reviewed ${coverage.reviewedOn}. ${esc(coverage.basis)} Reference lookup has expanded substantially; no percentage of working gameplay features is inferred from those declaration counts.</p>`;
  for(const name of (await readdir(path.join(root,'docs'))).filter(n=>n.endsWith('.html'))){
    const file=path.join(root,'docs',name);let html=await readFile(file,'utf8');
    html=html.replace(/<noscript>[\s\S]*?<\/noscript>/,()=>fallback);
    if(name==='introduction.html')html=html.replace(/<h2 id="guide-index">[\s\S]*?(?=\s*<\/article>)/,()=>index+'\n');
    if(name==='coverage.html'){
      if(!html.includes('<!-- coverage-report:start -->'))throw Error('Coverage report markers missing');
      html=html.replace(/<!-- coverage-report:start -->[\s\S]*?<!-- coverage-report:end -->/,()=>'<!-- coverage-report:start -->\n'+report+'\n<!-- coverage-report:end -->');
    }
    await writeFile(file,html);
  }
  return {pages,guides,classes:api.classes.length,methods,fields,structs:api.structs.length,enums:api.enums.length,estimatedGameCoveragePercent:coverage.estimatedGameCoveragePercent};
}
