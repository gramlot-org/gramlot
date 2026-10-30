/** Measure shipped JS, separating static entry closures from deferred module files. */
import {readFile,readdir} from 'node:fs/promises';
import {resolve,dirname,relative} from 'node:path';
import {gzipSync,brotliCompressSync,constants} from 'node:zlib';
const root=new URL('../dist',import.meta.url).pathname;
const sizes=b=>({bytes:b.length,gzip:gzipSync(b,{level:6}).length,brotli:brotliCompressSync(b,{params:{[constants.BROTLI_PARAM_QUALITY]:5}}).length});
const names=['inputs','layout','tree','grid','grouplets','chat','editors','typst'];
const result={method:'Bytes of prepared artifacts; gzip level 6, Brotli quality 5; no HTTP or parse-time claim',runtime:sizes(await readFile(root+'/gramlot.min.js')),collections:{}};
async function graph(file,seen=new Set()){
 if(seen.has(file))return seen;seen.add(file);
 const text=await readFile(file,'utf8');
 for(const match of text.matchAll(/(?:\bfrom|\bimport)\s*["'](\.[^"']+)["']/g)) await graph(resolve(dirname(file),match[1]),seen);
 return seen;
}
async function sum(files){const out={bytes:0,gzip:0,brotli:0};for(const file of files){const s=sizes(await readFile(file));for(const key in out)out[key]+=s[key];}return out;}
for(const name of names){const dir=root+'/components/'+name+'/assets',initial=await graph(dir+'/index.js');const all=(await readdir(dir,{recursive:true})).filter(p=>p.endsWith('.js')).map(p=>dir+'/'+p);
 result.collections[name]={initial:await sum(initial),deferred:await sum(all.filter(p=>!initial.has(p))),initialFiles:[...initial].map(p=>relative(dir,p)),deferredFiles:all.filter(p=>!initial.has(p)).map(p=>relative(dir,p))};
}
console.log(JSON.stringify(result,null,2));
