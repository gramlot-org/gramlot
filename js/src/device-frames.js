/** Backend-neutral DeviceProvider delegation to an explicitly trusted parent. */
const TYPE = 'gramlot:device';
const methods = {
    openDatabase:['database',1,'database',true],
    startOrientationEvents:['orientation',0,'stream',true],
    startGyroscopeUpdates:['gyroscope',0,'stream',true], startAccelerometerUpdates:['accelerometer',0,'stream',true],
    readAppInfo:['appinfo',0,'value',false], readLocation:['location',0,'value',false],
    copyText:['clipboard',1,'value',true], pasteText:['clipboard',0,'value',true],
    takePhoto:['camera',0,'value',true], choosePhoto:['camera',0,'value',true],
    scanBarcode:['barcode',0,'value',true], verifyBiometrics:['biometrics',0,'value',true],
    impact:['haptics',1,'value',true], vibrate:['haptics',1,'value',true],
    registerPush:['push',0,'value',true], scheduleNotification:['notifications',1,'value',true],
    startNetworkEvents:['network',0,'stream',true], startLifecycleEvents:['lifecycle',0,'stream',true],
    startPushEvents:['push',0,'stream',true], startNotificationEvents:['notifications',0,'stream',true],
    startLocationUpdates:['location',0,'stream',true], startAudioRecording:['audio',0,'audio',true]
};
const modal = new Set(['takePhoto','choosePhoto','scanBarcode','verifyBiometrics','pasteText','readLocation','registerPush','scheduleNotification']);
const failure = (message, code='FAILED') => Object.assign(new Error(message), {code});
const wire = value => value instanceof Error ? {deviceError:true,message:value.message,code:value.code ?? 'FAILED'} :
    Array.isArray(value) ? value.map(wire) : value && typeof value==='object' ? Object.fromEntries(Object.entries(value).map(([k,v])=>[k,wire(v)])) : value;
const unwire = value => value?.deviceError === true ? failure(value.message,value.code) :
    Array.isArray(value) ? value.map(unwire) : value && typeof value==='object' ? Object.fromEntries(Object.entries(value).map(([k,v])=>[k,unwire(v)])) : value;

/** One host, explicitly authorized Source-owned direct children, one provider per connection. */
export class DeviceFrameHost {
    constructor({window, origins, resolveFrame, createProvider}) {
        this.window=window; this.origins=new Set(origins); this.resolveFrame=resolveFrame;
        this.createProvider=createProvider; this.connections=new Set(); this.modal=null; this.audio=null;
        this.receive=event=>this.connect(event);
        window.addEventListener('message',this.receive);
        this.load=event=>{for(const c of this.connections)if(c.frame===event.target)void this.close(c);};
        window.document.addEventListener('load',this.load,true);
        this.observer=new window.MutationObserver(()=>this.prune());
        this.observer.observe(window.document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src','srcdoc','sandbox']});
        this.hide=()=>this.dispose(); window.addEventListener('pagehide',this.hide,{once:true});
    }
    valid(connection) {
        const frame=this.resolveFrame(connection.source);
        return frame===connection.frame && frame.isConnected && frame.getAttribute('src')===connection.src &&
            !frame.hasAttribute('srcdoc') && !frame.hasAttribute('sandbox') &&
            new URL(frame.getAttribute('src'),this.window.document.baseURI).origin===connection.origin;
    }
    connect(event) {
        if(event.data?.type!==TYPE || event.data.kind!=='connect' || event.ports.length!==1 || !this.origins.has(event.origin))return;
        const frame=this.resolveFrame(event.source);
        if(!frame)return;
        const c={source:event.source,frame,src:frame.getAttribute('src'),origin:event.origin,port:event.ports[0],
            provider:this.createProvider(),requests:new Map(),resources:new Map(),closed:false,sequence:0};
        if(!this.valid(c)){c.port.close();return;}
        for(const old of this.connections)if(old.source===c.source)this.close(old);
        this.connections.add(c);
        c.port.onmessage=e=>{void this.request(c,e.data);}; c.port.start();
        c.port.postMessage({kind:'ready',capabilities:c.provider.capabilities.filter(name=>name!=='links'&&name!=='shortcuts')});
    }
    send(c,message){if(!c.closed)c.port.postMessage(message);}
    prune(){for(const c of this.connections)if(!this.valid(c))this.close(c);}
    async close(c) {
        if(c.closed)return;c.closed=true;this.connections.delete(c);
        c.port.postMessage({kind:'closed'});c.port.close();
        for(const controller of c.requests.values())controller.abort();
        const resources=[...c.resources.values()];c.resources.clear();
        await Promise.allSettled(resources.map(resource=>resource.kind==='database'?resource.value.close():resource.kind==='audio'?resource.value.dispose():resource.value()));
        if(this.audio?.connection===c && !c.requests.has(this.audio.id))this.audio=null;
    }
    dispose(){this.window.removeEventListener('message',this.receive);this.window.removeEventListener('pagehide',this.hide);this.observer.disconnect();this.window.document.removeEventListener('load',this.load,true);for(const c of this.connections)void this.close(c);}
    async request(c,message) {
        if(c.closed)return;
        if(!this.valid(c)){void this.close(c);return;}
        if(message?.kind==='close'){void this.close(c);return;}
        if(message?.kind==='cancel'){c.requests.get(message.id)?.abort();return;}
        const {id,method,args,resource:resourceId}=message ?? {};
        if(message?.kind!=='call'||!Number.isSafeInteger(id)||id<1||!Array.isArray(args)||id<=c.sequence)return;
        c.sequence=id;
        const controller=new AbortController(); c.requests.set(id,controller);
        let locked=false;
        try {
            let result, kind='value';
            if(resourceId!==undefined) {
                const resource=c.resources.get(resourceId);
                if(!resource)throw failure('Unknown device resource');
                if(resource.kind==='database') {
                    if(method==='close' && args.length===0) { await resource.value.close(); c.resources.delete(resourceId); }
                    else if(['query','execute'].includes(method) && args.length===2) result=await resource.value[method](...args);
                    else throw failure('Invalid database resource operation');
                } else {
                if(args.length || !['close','stop','share','dispose'].includes(method))throw failure('Unknown device resource');
                if(resource.kind==='stream' && method==='close'){c.resources.delete(resourceId);await resource.value();}
                else if(resource.kind==='audio' && ['stop','share','dispose'].includes(method)) {
                    if(resource.busy)throw failure('Audio operation already pending');
                    resource.busy=true;
                    try {result=method==='share'?await resource.value.share(controller.signal):await resource.value[method]();}
                    finally {resource.busy=false;}
                    if(method==='dispose'){c.resources.delete(resourceId);if(this.audio?.connection===c)this.audio=null;}
                }else throw failure('Invalid device resource operation');
                }
            }else{
                if(!Object.hasOwn(methods,method))throw failure('Unknown device method');
                const [capability,count,type,signal]=methods[method];kind=type;
                if(!c.provider.capabilities.includes(capability))throw failure('Device capability unavailable','UNAVAILABLE');
                if(args.length!==count)throw failure('Invalid device arguments');
                if(modal.has(method)){
                    if(this.modal || this.audio)throw failure('Another frame is using the device');
                    this.modal={connection:c,id};locked=true;
                }
                if(type==='audio'){
                    if(this.audio || this.modal)throw failure('Another frame is using the microphone');
                    this.audio={connection:c,id};
                }
                const callArgs=[...args];
                if(type==='stream'||type==='audio')callArgs.push((...values)=>{if(!controller.signal.aborted&&this.valid(c))this.send(c,{kind:'event',id,args:wire(values)});});
                if(signal)callArgs.push(controller.signal);
                result=await c.provider[method](...callArgs);
                if(type!=='value') {
                    if(c.closed||controller.signal.aborted){await(type==='database'?result.close():type==='audio'?result.dispose():result());if(type==='audio' && this.audio?.connection===c && this.audio.id===id)this.audio=null;return;}
                    c.resources.set(id,{kind:type,value:result,busy:false});result={resource:id};
                }
            }
            if(!controller.signal.aborted)this.send(c,{kind:'result',id,value:wire(result)});
        }catch(error){
            if(method==='startAudioRecording' && this.audio?.connection===c && this.audio.id===id)this.audio=null;
            this.send(c,{kind:'error',id,error:wire(error)});
        }finally{
            c.requests.delete(id);
            if(locked&&this.modal?.connection===c&&this.modal.id===id)this.modal=null;
        }
    }
}

/** Same provider contract inside an iframe; application Data is unchanged. */
export class FrameDeviceProvider {
    static async connect({window, parentOrigin, timeout=7000}) {
        if(window.parent===window || new URL(parentOrigin).origin!==parentOrigin || parentOrigin==='null')throw new TypeError('An explicit parent origin is required');
        if(window.document.readyState!=='complete')await new Promise(resolve=>window.addEventListener('load',resolve,{once:true}));
        await new Promise(resolve=>setTimeout(resolve,0));
        return new Promise((resolve,reject)=>{
            const channel=new window.MessageChannel();
            const timer=setTimeout(()=>{channel.port1.close();reject(failure('Device host did not connect','UNAVAILABLE'));},timeout);
            channel.port1.onmessage=event=>{
                if(event.data?.kind!=='ready')return;
                clearTimeout(timer);
                resolve(new FrameDeviceProvider(window,channel.port1,event.data.capabilities));
            };
            channel.port1.start();
            window.parent.postMessage({type:TYPE,kind:'connect'},parentOrigin,[channel.port2]);
        });
    }
    constructor(window,port,capabilities) {
        this.window=window;this.port=port;this.capabilities=Object.freeze([...capabilities]);
        this.pending=new Map();this.events=new Map();this.sequence=0;this.closed=false;
        port.onmessage=event=>this.receive(event.data);
        this.hide=()=>this.dispose();window.addEventListener('pagehide',this.hide,{once:true});
    }
    receive(message) {
        if(message.kind==='closed'){this.dispose();return;}
        if(message.kind==='event'){this.events.get(message.id)?.(...unwire(message.args));return;}
        const pending=this.pending.get(message.id);if(!pending)return;
        this.pending.delete(message.id);pending.release();
        if(message.kind==='error'){this.events.delete(message.id);pending.reject(unwire(message.error));}
        else pending.resolve(unwire(message.value));
    }
    invoke(method,args=[],signal=null,callback=null,resource=undefined) {
        if(this.closed)return Promise.reject(failure('Device frame disconnected','UNAVAILABLE'));
        if(signal?.aborted)return Promise.reject(failure('Device operation cancelled','CANCELLED'));
        const id=++this.sequence;if(callback)this.events.set(id,callback);
        const promise=new Promise((resolve,reject)=>{
            const abort=()=>{
                this.port.postMessage({kind:'cancel',id});this.pending.delete(id);this.events.delete(id);
                signal.removeEventListener('abort',abort);reject(failure('Device operation cancelled','CANCELLED'));
            };
            signal?.addEventListener('abort',abort,{once:true});
            this.pending.set(id,{resolve,reject,release:()=>signal?.removeEventListener('abort',abort)});
            this.port.postMessage({kind:'call',id,method,args,resource});
        });
        return promise;
    }
    dispose() {
        if(this.closed)return;this.closed=true;
        this.window.removeEventListener('pagehide',this.hide);this.port.postMessage({kind:'close'});this.port.close();
        for(const pending of this.pending.values()){pending.release();pending.reject(failure('Device frame disconnected','CANCELLED'));}
        this.pending.clear();this.events.clear();
    }
}
for(const [method,[,count,kind,hasSignal]] of Object.entries(methods)) {
    Object.defineProperty(FrameDeviceProvider.prototype,method,{value:async function(...params){
        const args=params.slice(0,count), callback=['value','database'].includes(kind)?null:params[count];
        const signal=hasSignal?params[count+(['value','database'].includes(kind)?0:1)]:null;
        const result=await this.invoke(method,args,signal,callback);
        if(kind==='value')return result;
        const resource=result.resource;
        if(kind==='database')return {query:(sql,params=[])=>this.invoke('query',[sql,params],null,null,resource), execute:(sql,params=[])=>this.invoke('execute',[sql,params],null,null,resource),close:()=>this.invoke('close',[],null,null,resource)};
        if(kind==='stream')return async()=>{this.events.delete(resource);await this.invoke('close',[],null,null,resource);};
        return {stop:()=>this.invoke('stop',[],null,null,resource),share:s=>this.invoke('share',[],s,null,resource),
            dispose:async()=>{this.events.delete(resource);await this.invoke('dispose',[],null,null,resource);}};
    }});
}
