import source from '../../dist/typst-worker-source.js';

let worker,workerUrl,sequence=0,owners=0,failure;
const requests=new Map();
function stop(){
    worker.terminate();URL.revokeObjectURL(workerUrl);worker=null;
    for(const {reject} of requests.values())reject(new Error('Typst preview closed'));
    requests.clear();
}
/** Compiler lifetime follows the previews, with serialized jobs in one Worker. */
export function acquireCompiler(){
    if(!worker){
        failure=null;
        workerUrl=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
        worker=new Worker(workerUrl);
        worker.onmessage=({data})=>{
            const request=requests.get(data.id);if(!request)return;
            requests.delete(data.id);
            if(data.error)request.reject(new Error(data.error));else request.resolve(data);
        };
        worker.onerror=event=>{
            failure=new Error(event.message);
            for(const {reject} of requests.values())reject(failure);
            requests.clear();
        };
    }
    owners++;
    let released=false;
    return {
        compile(value){
            if(released)throw new Error('Typst compiler session is closed');
            if(failure)return Promise.reject(failure);
            const id=++sequence;
            return new Promise((resolve,reject)=>{requests.set(id,{resolve,reject});worker.postMessage({id,value});});
        },
        release(){if(released)return;released=true;if(--owners===0)stop();}
    };
}
