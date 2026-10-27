import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../../themes/mela/theme.css',import.meta.url),'utf8');
const parse=text=>Object.fromEntries([...text.matchAll(/--gramlot-([\w-]+):\s*(#[\da-f]{6})\s*;/gi)].map(m=>[m[1],m[2]]));
const light=parse(css.slice(0,css.indexOf('@media (prefers-color-scheme')));
const dark={...light,...parse(css.slice(css.indexOf(':root[data-theme="dark"]'),css.indexOf('@layer gramlot.base')))};
const luminance=hex=>hex.slice(1).match(/../g).map(n=>parseInt(n,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
for(const [name,p] of Object.entries({light,dark}))test(`Mela ${name}: readable text, action and field boundaries`,()=>{
 for(const [foreground,background,min] of [['ink','surface',4.5],['text-secondary','surface',4.5],['action','background',4.5],['action','selected',4.5],['button-color','button-background',4.5],['button-color','button-hover',4.5],['border-control','field-background',3]]){
  assert.ok(p[foreground]&&p[background],`${foreground}/${background} is defined`);
  assert.ok(contrast(p[foreground],p[background])>=min,`${foreground}/${background}: ${contrast(p[foreground],p[background]).toFixed(2)} < ${min}`);
 }
});
