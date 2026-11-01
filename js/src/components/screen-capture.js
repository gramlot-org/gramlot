/** Capture one frame from a user-selected browser display surface. */
import {captureVideoFrame} from '../media-frame.js';

export function captureScreen({document, signal}) {
    if (signal.aborted) return Promise.reject(new DOMException('Screen capture cancelled','AbortError'));
    const win=document.defaultView;
    let request;
    // Invoke synchronously in the click handler: display selection requires user activation.
    try { request=win.navigator.mediaDevices.getDisplayMedia({video:true,audio:false}); }
    catch (error) { return Promise.reject(error); }
    return new Promise((resolve,reject)=>{
        let settled=false, stream=null, drawing=false;
        const events=new win.AbortController(), listen={signal:events.signal};
        const video=document.createElement('video'); video.muted=true; video.autoplay=true; video.playsInline=true;
        Object.assign(video.style,{position:'fixed',width:'1px',height:'1px',opacity:'0',pointerEvents:'none'});
        const stop=value=>{for(const track of value.getTracks())track.stop();};
        const release=()=>{if(stream){stop(stream);stream=null;}video.srcObject=null;video.remove();};
        const finish=(error,blob)=>{if(settled)return;settled=true;events.abort();signal.removeEventListener('abort',abort);release();
            if(error)reject(error);else resolve(blob);};
        const abort=()=>finish(new DOMException('Screen capture cancelled','AbortError'));
        signal.addEventListener('abort',abort,{once:true});
        const draw=()=>{
            if(settled || drawing || video.readyState < 2 || !video.videoWidth || !video.videoHeight)return;
            drawing=true;
            try {
                const canvas=captureVideoFrame(document,video);release();
                canvas.toBlob(blob=>{
                    if(!blob || blob.type!=='image/png')finish(new Error('Screen image encoding failed'));
                    else finish(null,blob);
                },'image/png');
            } catch(error) {finish(error);}
        };
        video.addEventListener('loadeddata',draw,listen);
        if(signal.aborted){abort();}
        request.then(async acquired=>{
            if(settled){stop(acquired);return;}
            stream=acquired;
            for(const track of stream.getTracks())track.addEventListener('ended',()=>{if(!drawing)finish(new Error('Screen sharing ended'));},listen);
            document.body.append(video);video.srcObject=stream;
            try{await video.play();draw();}catch(error){if(!drawing)finish(error);}
        },error=>finish(error));
    });
}
