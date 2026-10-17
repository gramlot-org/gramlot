// Observational probes for the review; these report existing defects, not passing regression assertions.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../', import.meta.url)).replace(/\/$/, '');
const require=createRequire(root+'/js/package.json');
const {JSDOM}=require('jsdom');
const {Gramlot,GramlotBuilder}=await import(root+'/js/src/index.js');
const {default:inputs}=await import(root+'/js/src/components/inputs.js');
const {default:layout}=await import(root+'/js/src/components/layout.js');
function fixture(author,Logic){
 const {window}=new JSDOM('<main id="gramlot-root"></main>');
 window.HTMLElement.prototype.showPopover=function(){};window.HTMLElement.prototype.hidePopover=function(){};
 window.HTMLElement.prototype.scrollIntoView=function(){};
 const app=new Gramlot({document:window.document,transport:false,collections:[inputs,layout]});
 if(Logic)app.src.logicRegistry.register(Logic,{resource:'review'});
 const b=new GramlotBuilder(null,{collections:[inputs,layout]});author(b.root,app);app.src.startSource(b.toTytx());
 return {app,window,host:id=>window.document.getElementById(id),close(){app.dispose();window.close()}};
}
{
 const f=fixture((r,a)=>{a.data.setItem('name','Ada');a.data.setItem('position','TL');r.textbox({id:'field',value:'^name',lbl:'Name',lbl_position:'^position'});});
 const input=f.host('field').control;input.focus();input.value='Grace';input.dispatchEvent(new f.window.Event('input',{bubbles:true}));
 f.app.data.setItem('position','L');console.log('draft after own label update:',JSON.stringify({display:input.value,data:f.app.data.getItem('name')}));f.close();
}
{
 globalThis.reviewEvaluations=0;
 const f=fixture((r,a)=>{a.data.setItem('columns',2);const form=r.formlet({id:'form',node_label:'form',columns:'^columns',lbl_color:"==(globalThis.reviewEvaluations++, 'red')"});for(let i=0;i<3;i++)form.textbox({id:'f'+i,lbl:'Field',value:'A'});});
 console.log('formlet expression evaluations for 3 fields, mount:',globalThis.reviewEvaluations);
 let projections=0;for(let i=0;i<3;i++){const e=f.host('f'+i),orig=e.projectAttributes;e.projectAttributes=function(...args){projections++;return orig.apply(this,args)}}
 globalThis.reviewEvaluations=0;f.app.data.setItem('columns',1);
 console.log('columns-only change:',JSON.stringify({expressionEvaluations:globalThis.reviewEvaluations,fieldProjections:projections}));f.close();delete globalThis.reviewEvaluations;
}
{
 const f=fixture((r,a)=>{a.data.setItem('x','a');r.radioButtonText({id:'radio',value:'^x',values:'a:Alpha,b:Beta',readonly:true});});
 const host=f.host('radio');host.control.querySelector('input[value=b]').click();
 console.log('radioButtonText readonly:',JSON.stringify({declaredParameter:Object.hasOwn(host.constructor.gramlotComponent.parameters,'readonly'),internalReadonly:host.control.readOnly,data:f.app.data.getItem('x')}));f.close();
}
{
 const f=fixture((r,a)=>{a.data.setItem('x.name','Ada');r.groupBox({id:'group',datapath:'x',copy:true});});
 const host=f.host('group');Object.defineProperty(f.window.navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied')}}});
 await host.copyData();f.window.navigator.clipboard.writeText=async()=>{};await host.copyData();
 console.log('copy success after failure:',JSON.stringify({title:host.copyButton.title,status:host.status.textContent}));f.close();
}
