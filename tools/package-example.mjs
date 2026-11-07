import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';

// Store-only ZIP, with an explicit release list and deterministic metadata.
const files=['enabled.txt','README.md','Scripts/main.lua','Scripts/config.lua','Scripts/log.lua','Scripts/inspect.lua'];
const crcTable=Array.from({length:256},(_,index)=>{
  let value=index;
  for(let bit=0;bit<8;bit++)value=value&1?0xedb88320^(value>>>1):value>>>1;
  return value>>>0;
});
function crc32(bytes){let value=0xffffffff;for(const byte of bytes)value=crcTable[(value^byte)&255]^(value>>>8);return(value^0xffffffff)>>>0;}

export async function packageExample(root){
  const local=[],central=[];let offset=0;
  for(const file of files){
    const name=Buffer.from('WorkshopInspector/'+file);
    const bytes=await readFile(path.join(root,'assets/examples/WorkshopInspector',file));
    const checksum=crc32(bytes);
    const header=Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50,0);header.writeUInt16LE(20,4);header.writeUInt16LE(0x800,6);
    header.writeUInt16LE(33,12);header.writeUInt32LE(checksum,14);header.writeUInt32LE(bytes.length,18);
    header.writeUInt32LE(bytes.length,22);header.writeUInt16LE(name.length,26);
    local.push(header,name,bytes);
    const entry=Buffer.alloc(46);
    entry.writeUInt32LE(0x02014b50,0);entry.writeUInt16LE(20,4);entry.writeUInt16LE(20,6);
    entry.writeUInt16LE(0x800,8);entry.writeUInt16LE(33,14);entry.writeUInt32LE(checksum,16);
    entry.writeUInt32LE(bytes.length,20);entry.writeUInt32LE(bytes.length,24);entry.writeUInt16LE(name.length,28);
    entry.writeUInt32LE(offset,42);central.push(entry,name);
    offset+=header.length+name.length+bytes.length;
  }
  const directory=Buffer.concat(central),end=Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);
  end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
  const destination=path.join(root,'assets/downloads');await mkdir(destination,{recursive:true});
  await writeFile(path.join(destination,'WorkshopInspector-example.zip'),Buffer.concat([...local,directory,end]));
}
