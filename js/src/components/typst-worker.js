/** One serial compiler owns a virtual filesystem; no network/file provider. */
import {createTypstCompiler,createTypstRenderer,loadFonts,MemoryAccessModel,initOptions} from '@myriaddreamin/typst.ts';
import {TypstSnippet} from '@myriaddreamin/typst.ts/contrib/snippet';
import compilerWasm from '@myriaddreamin/typst-ts-web-compiler/wasm';
import rendererWasm from '@myriaddreamin/typst-ts-renderer/wasm';
import serif from '../../../assets/typst-fonts/LibertinusSerif-Regular.otf';
import bold from '../../../assets/typst-fonts/LibertinusSerif-Bold.otf';
import italic from '../../../assets/typst-fonts/LibertinusSerif-Italic.otf';
import mono from '../../../assets/typst-fonts/DejaVuSansMono.ttf';
import math from '../../../assets/typst-fonts/NewCMMath-Regular.otf';

const typst=new TypstSnippet({
    compiler:async()=>{
        const compiler=createTypstCompiler();
        await compiler.init({getModule:()=>compilerWasm,beforeBuild:[initOptions.withAccessModel(new MemoryAccessModel()),
            initOptions.withPackageRegistry({resolve(){throw new Error('External Typst packages are not included in this offline document');}}),loadFonts([serif,bold,italic,mono,math],{assets:false})]});
        return compiler;
    },
    renderer:async()=>{
        const renderer=createTypstRenderer();
        await renderer.init({getModule:()=>rendererWasm});
        return renderer;
    }
});
const pending=new Map();
let running=false;
async function drain(){
    if(running)return;
    running=true;
    while(pending.size){
        const [id,value]=pending.entries().next().value;
        pending.delete(id);
        try{
            const compiler=await typst.getCompiler();
            compiler.resetShadow();
            await compiler.reset();
            compiler.addSource('/main.typ',value);
            const options={mainFilePath:'/main.typ',root:'/',inputs:{},diagnostics:'unix'};
            const vector=await compiler.compile(options);
            if(!vector.result)throw new Error(vector.diagnostics?.join('\n') || 'Typst compilation failed');
            const svg=await typst.svg({vectorData:vector.result,data_selection:{body:true,defs:true,css:true,js:false}});
            const pdf=await compiler.compile({...options,format:1});
            if(!pdf.result)throw new Error(pdf.diagnostics?.join('\n') || 'PDF compilation failed');
            self.postMessage({id,svg,pdf:pdf.result,diagnostics:vector.diagnostics || []});
        }catch(error){self.postMessage({id,error:error.message});}
    }
    running=false;
}
self.onmessage=({data:{id,value}})=>{pending.set(id,value);void drain();};
