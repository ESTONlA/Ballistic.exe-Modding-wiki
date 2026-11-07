import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
const prefix='/UnOfficial-Ballistic.exe-modding-wiki';
const server=http.createServer(async(req,res)=>{
 try{
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname===prefix||pathname.startsWith(prefix+'/'))pathname=pathname.slice(prefix.length)||'/';
  let file=path.resolve(root,'.'+pathname);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  let info=await stat(file);
  if(info.isDirectory()){file=path.join(file,'index.html');info=await stat(file);}
  if(!info.isFile())throw Error('Not a file');
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  res.end(await readFile(file));
 }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Page not found. Open /docs/introduction.html to return to the documentation.');}
});
let port=Number(process.env.PORT)||4185;
server.on('error',err=>{if(err.code==='EADDRINUSE'&&port<4195){port++;server.listen(port,'127.0.0.1');}else{console.error(err.message);process.exitCode=1;}});
server.on('listening',()=>{
 const url=`http://127.0.0.1:${port}/docs/introduction.html`;
 console.log(`Ballistic Modding Wiki: ${url}\nPress Ctrl+C to stop.`);
 if(process.argv.includes('--open')){
  const args=process.platform==='win32'?['/c','start','',url]:[url];
  const child=spawn(process.platform==='win32'?'cmd.exe':'xdg-open',args,{windowsHide:true,stdio:'ignore'});child.on('error',()=>console.log('Open the URL above in your browser.'));
 }
});
server.listen(port,'127.0.0.1');
