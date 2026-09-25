// Read-only characterization of legacy Data installation; DOM/RPC are not integrated.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = process.env.GNR_LEGACY_ROOT;
if (!root) throw new Error('Set GNR_LEGACY_ROOT to the inspected GenroPy checkout');
const base = root + '/gnrjs';
const testSource = fs.readFileSync(base+'/tests/native_bag_classes.test.js','utf8');
const prefix = testSource.slice(0,testSource.indexOf("test('gnrbag creates"));
const load = new Function('require','__dirname',prefix+'\nreturn loadClasses;')(require,base+'/tests');
const c = load(['gnrlang.js','gnrbag.js','gnrdomsource.js','genro_src.js','genro.js']);
c.assert = assert;
vm.runInContext(`
const proto = gnr.GenroClient.prototype;
Object.assign(genro, {
 _data: new gnr.GnrBag(), _dataroot: new gnr.GnrBag(),
 _serverstore_paths:{}, _sharedObjects_paths:{}, _debugPaths:{},
 setData:proto.setData, getDataNode:proto.getDataNode,
 getData:proto.getData, pathResolve:proto.pathResolve,
 dataTrigger:proto.dataTrigger, publishDataTrigger:proto.publishDataTrigger
});
genro._dataroot.setBackRef();
genro._dataroot.setItem('main',genro._data);
genro.src = new gnr.GnrSrcHandler(genro);
let notifications=[];
genro._dataroot.subscribe('probe',{any:kw=>notifications.push(kw)});
const source = new gnr.GnrDomSource(); source.setBackRef();
function seed(label,path,value,attrs={}) {
 const n=source.setItem(label,value,Object.assign({tag:'data',path},attrs));
 genro.src.stripDataNode(n); return n;
}
seed('first','record',42,{caption:'Old'});
assert.equal(genro.getData('record'),42);
seed('null','record',null,{caption:'New'});
assert.equal(genro.getData('record'),42);
assert.equal(genro.getDataNode('record').attr.caption,'Old');
seed('missing','missing',null,{caption:'Null'});
assert.equal(genro.getDataNode('missing').getValue(),null);
assert.equal(genro.getDataNode('missing').attr.caption,'Null');
const payload = new gnr.GnrBag(); payload.setItem('x',1);
const n=seed('bag','payload',payload);
assert.equal(n.getValue('static'),null);
assert.equal(genro.getData('payload'),payload);
assert.equal(payload.getParentNode(),genro.getDataNode('payload'));
payload.setItem('x',2);
assert.equal(notifications.at(-1).pathlist.join('.'),'main.payload.x');
const count=notifications.length;
genro.src.stripDataNode(n);
assert.equal(notifications.length,count);
seed('literal','literal','^record');
assert.equal(genro.getData('literal'),'^record');
seed('attribute','record?caption','Changed');
assert.equal(genro.getDataNode('record').attr.caption,'Changed');
seed('remoteattr','meta',7,{caption:'^record'});
assert.equal(genro.getDataNode('meta').attr.caption,'^record');
assert.ok(source.getNode('remoteattr')._dynattr.caption === null);
seed('server','mapped',3,{serverpath:'server.mapped'});
assert.equal(genro._serverstore_paths.mapped,'server.mapped');
assert.equal(genro.getDataNode('mapped').attr.serverpath,undefined);
const top = new gnr.GnrBag(); top.setItem('added',9);
seed('merge',undefined,top);
assert.equal(genro.getData('added'),9);
const reader = source.setItem('reader',null,{tag:'span',value:'^record'});
let reactions=[];
reader.updateAttrBuiltObj=function(attr,kw,reason){reactions.push({attr,reason,value:this.getAttributeFromDatasource(attr)})};
reader.registerNodeDynAttr(false); reader._setDynAttributes();
dojo.publish=()=>{};
genro._dataroot.subscribe('dataTriggers',{any:kw=>genro.dataTrigger(kw)});
genro.setData('record',43);
assert.equal(reactions.length,1);
assert.equal(reactions[0].value,43);
genro.setData('record',44,null,reader);
assert.equal(reactions.length,1);
genro.src.cleanupNodeSubscriptions(reader);
genro.setData('record',45);
assert.equal(reactions.length,1);
assert.equal(genro.getData('record'),45);
// Observe the remote alias handoff without running a network request.
let capturedMethod = 'not-called';
const stop = new Error('stop before RPC');
genro.rpc={remoteResolver(method){capturedMethod=method; throw stop}};
try {seed('remoteProbe','remoteResult',null,{remote:'fetch_example'});} catch(e){if(e!==stop) throw e;}
console.log('Observed data(remote) resolver method:',capturedMethod);
try {seed('directRemoteProbe','directRemoteResult',null,{tag:'dataRemote',method:'fetch_example'});} catch(e){if(e!==stop) throw e;}
console.log('Observed dataRemote(method) resolver method:',capturedMethod);
console.log('22 assertions passed using original legacy JS methods and native Bags: null/attributes, Bag transfer/backrefs/events, strip-once, literal values, attribute destination, raw dynamic attributes and serverpath. DOM/RPC not exercised.');
`,c);
