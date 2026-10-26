import source from '../../dist/typst-worker-source.js';

let worker,workerUrl,sequence=0,owners=0;
const requests=new Map();
function stop(error=new Error('Typst preview closed')){
    if(worker){
        worker.onmessage=null;worker.onerror=null;
        worker.terminate();URL.revokeObjectURL(workerUrl);worker=null;
    }
    for(const {reject} of requests.values())reject(error);
    requests.clear();
}
function start(){
    if(!worker){
        workerUrl=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
        worker=new Worker(workerUrl);
        worker.onmessage=({data})=>{
            const request=requests.get(data.id);if(!request)return;
            requests.delete(data.id);
            if(data.error)request.reject(new Error(data.error));else request.resolve(data);
        };
        worker.onerror=event=>stop(new Error(event.message));
    }
}
/** Compiler lifetime follows the previews; a failed Worker is replaced on the next compile. */
export function acquireCompiler(){
    start();
    owners++;
    let released=false;
    return {
        compile(value){
            if(released)throw new Error('Typst compiler session is closed');
            start();
            const id=++sequence;
            return new Promise((resolve,reject)=>{requests.set(id,{resolve,reject});worker.postMessage({id,value});});
        },
        release(){if(released)return;released=true;if(--owners===0)stop();}
    };
}
