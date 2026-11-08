import {readFile, writeFile, stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const source = process.argv[2];
if (!source) throw Error('Usage: node tools/import-object-dump.mjs <UE4SS_ObjectDump.txt>');
const raw = await readFile(source);
const records = [], addresses = new Map();
let lastEnum;
for (const line of raw.toString('utf8').split(/\r?\n/)) {
  const value = line.match(/^\[0+\] (\S+::\S+) .*\[v: (-?\d+)\]/);
  if (value && lastEnum) { lastEnum.values.push({name:value[1], value:Number(value[2])}); continue; }
  const match = line.match(/^\[([A-Fa-f0-9]+)\] (\w+) (.*?)\s+(\[.*)$/);
  if (!match) continue;
  const record = {address:match[1], kind:match[2], path:match[3], tags:Object.fromEntries([...match[4].matchAll(/\[(\w+): ([^\]]+)\]/g)].map(m=>[m[1],m[2]]))};
  record.values = [];
  records.push(record); addresses.set(record.address, record);
  lastEnum = /^(Enum|UserDefinedEnum)$/.test(record.kind) ? record : undefined;
}
const scoped = path => path.startsWith('/Script/Ballistic.') || path.startsWith('/Game/');
const short = path => path.split('.').at(-1);
const resolve = address => addresses.get(address)?.path;
function type(record, depth=0) {
  if (!record || depth > 4) return 'unresolved';
  const target = resolve(record.tags.ss || record.tags.em || record.tags.mc || record.tags.pc);
  if (record.kind === 'ArrayProperty') return `Array<${type(addresses.get(record.tags.ai),depth+1)}>`;
  // Some dump formats omit inner metadata for maps/sets. Do not invent an element type.
  if (record.kind === 'SetProperty') return 'Set<element type not recorded>';
  if (record.kind === 'MapProperty') return 'Map<key/value types not recorded>';
  return record.kind.replace(/Property$/, '') + (target ? `<${target}>` : '');
}
function field(record) { return {name:record.path.split(':').at(-1), path:record.path, kind:record.kind, type:type(record)}; }
const properties = records.filter(record=>record.kind.endsWith('Property') && scoped(record.path));
const direct = new Map();
for (const record of properties) {
  const owner = record.path.slice(0,record.path.lastIndexOf(':'));
  if (!direct.has(owner)) direct.set(owner, []);
  direct.get(owner).push(field(record));
}
const functions = records.filter(record=>record.kind==='Function' && scoped(record.path));
const methods = new Map();
for (const record of functions) {
  const owner = record.path.slice(0,record.path.lastIndexOf(':'));
  if (!methods.has(owner)) methods.set(owner, []);
  methods.get(owner).push({name:record.path.split(':').at(-1), path:record.path, fields:direct.get(record.path)||[], generated:/:(ExecuteUbergraph_|BndEvt__|InpActEvt_|InpAxisEvt_|OnLoaded_|OnSuccess_|OnFailure_)/.test(record.path)});
}
function group(path) {
  if (path.startsWith('/Script/Ballistic.')) return /\.C_(Weapon|Barrel|Bolt|Bullet|Cartridge|Magazine|Reciever)/.test(path) ? 'api-native-weapons' : 'api-native-world';
  if (path.startsWith('/Game/UI/')) {
    if (path.includes('/Workshop/')) return 'api-workshop-ui';
    if (path.includes('/Debug/')) return 'api-debug-ui';
    if (path.includes('/HUD/')) return 'api-hud-ui';
    if (/\/(Common|Instruments|Cursors)\//.test(path)) return 'api-common-ui';
    return 'api-menu-ui';
  }
  for (const [pattern,id] of [
    ['/Weapons/Attachments/','api-attachment-classes'], ['/Ammunition/','api-ammunition-classes'], ['/Weapons/','api-weapon-classes'],
    ['/Targets/','api-target-classes'], ['/Core/Game/','api-game-classes'], ['/Core/Player/','api-player-classes'],
    ['/Core/Manipulation/','api-manipulation-classes'], ['/Core/Spotter/','api-spotter-classes'], ['/Core/Bunker/','api-bunker-classes'], ['/Quests/','api-quest-classes']
  ]) if (path.includes(pattern)) return id;
  return 'api-other-classes';
}
const classes = records.filter(record=>(record.kind==='Class'||record.kind.endsWith('GeneratedClass')) && scoped(record.path)).map(record=>({
  name:short(record.path), path:record.path, kind:record.kind, group:group(record.path),
  parent:resolve(record.tags.sps)||null, fields:direct.get(record.path)||[], methods:methods.get(record.path)||[]
}));
const structs = records.filter(record=>/^(ScriptStruct|UserDefinedStruct)$/.test(record.kind)&&scoped(record.path)).map(record=>({name:short(record.path),path:record.path,fields:direct.get(record.path)||[]}));
const enums = records.filter(record=>/^(Enum|UserDefinedEnum)$/.test(record.kind)&&scoped(record.path)).map(record=>({name:short(record.path),path:record.path,values:record.values}));
const data = {
  schemaVersion:1, snapshotDate:(await stat(source)).mtime.toISOString().slice(0,10), gameBuild:null,
  source:{name:'UE4SS_ObjectDump.txt',sha256:createHash('sha256').update(raw).digest('hex'),notes:'Local loaded-object snapshot. Date comes from the source file last-write timestamp, not verified capture/build metadata. Build provenance was not recorded. Excludes engine/plugin classes and assets that were not loaded. No runtime addresses, field offsets or executable bytes are published.'},
  classes, structs, enums
};
await writeFile(fileURLToPath(new URL('../assets/data/game-api.json',import.meta.url)), JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify({classes:classes.length,methods:classes.reduce((n,c)=>n+c.methods.length,0),fields:classes.reduce((n,c)=>n+c.fields.length,0),structs:structs.length,enums:enums.length,groups:Object.fromEntries([...new Set(classes.map(c=>c.group))].map(g=>[g,classes.filter(c=>c.group===g).length]))},null,2));
