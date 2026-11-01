import {captureVideoFrame} from './media-frame.js';

/** Browser implementation of the existing device camera capability. */
function failure(code, message, cause) {
    return Object.assign(new Error(message, cause ? {cause} : undefined), {code});
}
function cameraError(error) {
    if (error.name === 'NotAllowedError' || error.name === 'SecurityError') return failure('PERMISSION_DENIED','Camera permission was denied',error);
    if (error.name === 'NotFoundError' || error.name === 'OverconstrainedError') return failure('UNAVAILABLE','Camera is unavailable',error);
    return failure('FAILED',error.message || 'Camera failed',error);
}
const cancelled = () => failure('CANCELLED','Photo capture cancelled');

export class BrowserCameraProvider {
    constructor({document}) {
        if (!document?.defaultView) throw new TypeError('BrowserCameraProvider requires a document');
        this.document = document;
        this.capabilities = Object.freeze(document.defaultView.navigator.mediaDevices?.getUserMedia ? ['camera'] : []);
    }
    takePhoto(signal) {
        if (signal.aborted) return Promise.reject(cancelled());
        if (!this.capabilities.includes('camera')) return Promise.reject(failure('UNAVAILABLE','Camera is unavailable'));
        const doc=this.document, win=doc.defaultView;
        return new Promise((resolve,reject) => {
            let settled=false, stream=null;
            const events=new win.AbortController(), listen={signal:events.signal};
            const dialog=doc.createElement('dialog'); dialog.className='gramlot-camera-dialog'; dialog.setAttribute('aria-label','Take photo');
            const style=doc.createElement('style'); style.textContent=`
                .gramlot-camera-dialog{max-width:calc(100vw - 2rem);max-height:calc(100vh - 2rem);border:1px solid var(--gramlot-border,#d5dde6);
                    border-radius:14px;padding:20px;color:var(--gramlot-ink,#202a35);background:var(--gramlot-surface,#fff);
                    box-shadow:0 24px 64px #14243a42;font:14px/1.4 system-ui,sans-serif}
                .gramlot-camera-dialog::backdrop{background:#152335a6}.gramlot-camera-dialog h2{margin:0 0 12px;font-size:1.15rem}
                .gramlot-camera-dialog video{display:block;width:min(480px,calc(100vw - 5rem));max-height:55vh;background:#202a35;border-radius:8px}
                .gramlot-camera-dialog [role=status]{margin:8px 0;color:var(--gramlot-text-secondary,#62748a)}
                .gramlot-camera-dialog .actions{display:flex;gap:8px;justify-content:flex-end;margin-top:14px}
                .gramlot-camera-dialog button{font:inherit;cursor:pointer;padding:.4em .8em;border:1px solid var(--gramlot-border-control,#aab4c0);border-radius:6px;background:var(--gramlot-button-background,#fff);color:var(--gramlot-button-color,#202a35)}
                .gramlot-camera-dialog button.primary{background:var(--gramlot-action,#3766b5);color:#fff}.gramlot-camera-dialog button:disabled{opacity:.55}
            `;
            const heading=doc.createElement('h2'); heading.textContent='Take photo';
            const video=doc.createElement('video'); video.muted=true; video.autoplay=true; video.playsInline=true;
            const status=doc.createElement('p'); status.setAttribute('role','status'); status.textContent='Waiting for camera…';
            const actions=doc.createElement('div'); actions.className='actions';
            const cancel=doc.createElement('button');cancel.type='button';cancel.textContent='Cancel';
            const capture=doc.createElement('button');capture.type='button';capture.textContent='Capture';capture.className='primary';capture.disabled=true;
            actions.append(cancel,capture);dialog.append(style,heading,video,status,actions);
            const stop = value => { for (const track of value.getTracks()) track.stop(); };
            const finish = (error, photo) => {
                if (settled) return; settled=true; events.abort(); signal.removeEventListener('abort',onAbort);
                if (stream) {stop(stream);stream=null;} video.srcObject=null;
                if (dialog.open) dialog.close();dialog.remove();
                if (error) reject(error); else resolve(photo);
            };
            const onAbort=()=>finish(cancelled());
            signal.addEventListener('abort',onAbort,{once:true});
            cancel.addEventListener('click',onAbort,listen);
            dialog.addEventListener('cancel',event=>{event.preventDefault();onAbort();},listen);
            dialog.addEventListener('close',()=>{if (!settled) onAbort();},listen);
            const ready=()=>{if (!settled && video.videoWidth > 0 && video.videoHeight > 0) {capture.disabled=false;status.textContent='';}};
            video.addEventListener('loadedmetadata',ready,listen);
            capture.addEventListener('click',()=>{
                try {
                    const canvas=captureVideoFrame(doc,video);
                    const url=canvas.toDataURL('image/jpeg',0.9);
                    if (!url.startsWith('data:image/jpeg;')) throw new Error('Camera image encoding failed');
                    finish(null,{url,format:'jpeg'});
                } catch (error) {finish(cameraError(error));}
            },listen);
            doc.body.append(dialog);
            try {dialog.showModal();} catch (error) {finish(cameraError(error));return;}
            if (signal.aborted) {onAbort();return;}
            Promise.resolve().then(()=>settled ? null : win.navigator.mediaDevices.getUserMedia({video:true,audio:false})).then(async acquired=>{
                if (!acquired) return;
                if (settled) {stop(acquired);return;}
                stream=acquired;video.srcObject=stream;
                for (const track of stream.getTracks()) track.addEventListener('ended',()=>finish(failure('UNAVAILABLE','Camera stopped')),listen);
                try {await video.play();ready();} catch (error) {finish(cameraError(error));}
            },error=>finish(cameraError(error)));
        });
    }
    choosePhoto(signal) {
        if (signal.aborted) return Promise.reject(cancelled());
        const doc=this.document, win=doc.defaultView;
        return new Promise((resolve,reject)=>{
            let settled=false,reader=null;
            const events=new win.AbortController(), listen={signal:events.signal};
            const input=doc.createElement('input');input.type='file';input.accept='image/png,image/jpeg,image/webp';input.hidden=true;
            const finish=(error,photo)=>{if(settled)return;settled=true;events.abort();signal.removeEventListener('abort',onAbort);
                if (reader && reader.readyState === 1) reader.abort();input.remove();if(error)reject(error);else resolve(photo);};
            const onAbort=()=>finish(cancelled());
            signal.addEventListener('abort',onAbort,{once:true});
            input.addEventListener('cancel',onAbort,listen);
            input.addEventListener('change',()=>{
                const file=input.files[0];
                if (!file || !['image/png','image/jpeg','image/webp'].includes(file.type)) {finish(failure('FAILED','Select a PNG, JPEG or WebP image'));return;}
                reader=new win.FileReader();
                reader.onload=()=>finish(null,{url:reader.result,format:file.type.slice('image/'.length)});
                reader.onerror=()=>finish(failure('FAILED','Photo could not be read',reader.error));reader.readAsDataURL(file);
            },listen);
            doc.body.append(input);
            if (signal.aborted) {onAbort();return;}
            try {input.click();} catch (error) {finish(failure('FAILED','Photo selection failed',error));}
        });
    }
}
