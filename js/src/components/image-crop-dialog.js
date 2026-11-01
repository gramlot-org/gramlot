/** Private, reusable framing dialog. It returns a Blob and never replaces the source. */
import {ImageCropSession} from './image-crop.js';

export class ImageCropDialog {
    #document; #image; #session; #options; #dialog; #frameImage; #minZoom; #maxZoom;
    #resolve; #settled = false; #events; #frame; #points = new Map(); #gesture; #trackpadGesture;
    constructor({state, document, original, image, sourceWidth, sourceHeight, width, height,
        x = 0, y = 0, zoom = 1, rotate = 0, outputWidth, outputHeight, type, quality}) {
        this.#document = document;
        this.#image = image;
        this.#options = {width,height,sourceWidth,sourceHeight,outputWidth,outputHeight,type,quality};
        this.#minZoom = zoom/5; this.#maxZoom = zoom*5;
        this.#session = new ImageCropSession({state,document,original,image,sourceWidth,sourceHeight,width,height,x,y,zoom,rotate});
        const dialog = this.#dialog = document.createElement('dialog');
        dialog.setAttribute('aria-label', 'Edit image');
        dialog.className = 'gramlot-image-crop-dialog';
        const style = document.createElement('style');
        style.textContent = `
            .gramlot-image-crop-dialog{box-sizing:border-box;width:min(100% - 2rem, 510px);max-width:calc(100vw - 2rem);max-height:calc(100vh - 2rem);
                border:1px solid var(--gramlot-border,#d5dde6);border-radius:18px;padding:0;
                color:var(--gramlot-ink,#202a35);background:var(--gramlot-surface,#fff);
                box-shadow:0 24px 64px #14243a42;font:14px/1.4 system-ui,sans-serif}
            .gramlot-image-crop-dialog::backdrop{background:#152335a6}
            .gramlot-image-crop-dialog *{box-sizing:border-box}
            .gramlot-image-crop-dialog .crop-heading{padding:22px 24px 16px}
            .gramlot-image-crop-dialog h2{font-size:1.18rem;line-height:1.2;margin:0 0 4px;letter-spacing:-.02em}
            .gramlot-image-crop-dialog .crop-subtitle{margin:0;color:var(--gramlot-text-secondary,#62748a);font-size:.9em}
            .gramlot-image-crop-dialog .crop-body{padding:0 24px 20px}
            .gramlot-image-crop-dialog .crop-position{display:grid;grid-template-columns:minmax(0,1fr) 34px;gap:8px;align-items:stretch;margin:0 auto;max-width:100%}
            .gramlot-image-crop-dialog .crop-viewport{position:relative;overflow:auto;max-width:100%;border-radius:10px;background:#e8edf3;
                box-shadow:0 0 0 1px #1f38511a}
            .gramlot-image-crop-dialog .crop-viewport [aria-label="Crop preview"]:focus-visible{outline:2px solid var(--gramlot-focus-ring,#3766b5);outline-offset:-2px}
            .gramlot-image-crop-dialog .crop-handles{display:flex;flex-direction:column;align-items:center;justify-content:space-between}
            .gramlot-image-crop-dialog .crop-handle{width:32px;height:32px;padding:0;display:grid;place-items:center;
                border:1px solid transparent;border-radius:8px;background:transparent;color:var(--gramlot-text-secondary,#62748a);
                opacity:.7;font-size:21px;line-height:1;touch-action:none}
            .gramlot-image-crop-dialog .crop-handle:hover,.gramlot-image-crop-dialog .crop-handle:focus-visible{
                opacity:1;background:var(--gramlot-field-background,#f2f5f9);color:var(--gramlot-action,#3766b5)}
            .gramlot-image-crop-dialog .crop-handle:focus-visible{outline:2px solid var(--gramlot-focus-ring,#3766b5);outline-offset:2px}
            .gramlot-image-crop-dialog .crop-rotate-handle{cursor:grab}
            .gramlot-image-crop-dialog .crop-zoom-handle{cursor:nwse-resize}
            .gramlot-image-crop-dialog .crop-help{margin:0 auto 0 0;flex:1 1 125px;color:var(--gramlot-text-secondary,#7c8793);
                font-size:11px;font-style:italic;font-weight:400;line-height:1.35}
            .gramlot-image-crop-dialog .crop-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px;padding:12px 24px;
                border-top:1px solid var(--gramlot-border,#e2e8ef)}
            .gramlot-image-crop-dialog .crop-action-buttons{display:flex;gap:6px;margin-left:auto}
            .gramlot-image-crop-dialog button{font:inherit;font-size:12px;line-height:1.2;font-weight:500;cursor:pointer;padding:.32rem .6rem;border-radius:6px;
                border:1px solid var(--gramlot-border-control,#c3cdd9);background:var(--gramlot-button-background,#fff);color:var(--gramlot-button-color,#27384b)}
            .gramlot-image-crop-dialog button.primary{background:var(--gramlot-action,#3766b5);border-color:var(--gramlot-action,#3766b5);color:#fff}
            .gramlot-image-crop-dialog button:disabled{opacity:.55;cursor:default}
            .gramlot-image-crop-dialog [role=alert]:not(:empty){color:var(--gramlot-error,#ae2020);margin-top:.75rem}
            @media(max-width:380px){.gramlot-image-crop-dialog{width:calc(100vw - 8px);max-width:calc(100vw - 8px)}
                .gramlot-image-crop-dialog .crop-heading,.gramlot-image-crop-dialog .crop-body{padding-left:8px;padding-right:8px}
                .gramlot-image-crop-dialog .crop-actions{padding:12px 8px}}
        `;
        const heading = document.createElement('header'); heading.className = 'crop-heading';
        const title = document.createElement('h2'); title.textContent = 'Edit image';
        const subtitle = document.createElement('p'); subtitle.className = 'crop-subtitle'; subtitle.textContent = 'Move and adjust the image within the frame.';
        heading.append(title,subtitle);
        const frame = this.#frame = document.createElement('div');
        frame.setAttribute('aria-label', 'Crop preview'); frame.setAttribute('role','group'); frame.tabIndex = 0;
        frame.setAttribute('aria-description','Use arrow keys to move the image. Use the adjacent controls to zoom or rotate.');
        Object.assign(frame.style, {position:'relative',overflow:'hidden',width:`${width}px`,height:`${height}px`,
            maxWidth:'none',background:'#ddd',margin:'auto',touchAction:'none',userSelect:'none',cursor:'grab'});
        this.#frameImage = document.createElement('img');
        this.#frameImage.src = image.src;
        this.#frameImage.alt = ''; this.#frameImage.draggable = false;
        Object.assign(this.#frameImage.style, {position:'absolute',left:'50%',top:'50%',maxWidth:'none',
            width:`${sourceWidth}px`,height:`${sourceHeight}px`,transformOrigin:'center center'});
        frame.append(this.#frameImage);
        const handle = (mode,caption,glyph) => {
            const button = document.createElement('button'); button.type = 'button'; button.className = `crop-handle crop-${mode}-handle`;
            button.dataset.cropHandle = mode; button.setAttribute('aria-label',caption); button.title = caption; button.textContent = glyph;
            return button;
        };
        const rotateHandle = handle('rotate','Rotate image','↻');
        const zoomHandle = handle('zoom','Zoom image','↘');
        const viewport = document.createElement('div'); viewport.className = 'crop-viewport'; viewport.append(frame);
        const position = document.createElement('div'); position.className = 'crop-position';
        position.style.width = `${width + 42}px`;
        const handles = document.createElement('div'); handles.className = 'crop-handles';
        handles.append(rotateHandle,zoomHandle); position.append(viewport,handles);
        const hint = document.createElement('p'); hint.className = 'crop-help';
        hint.textContent = 'Drag to move · pinch to zoom';
        const body = document.createElement('div'); body.className = 'crop-body'; body.append(position);
        const error = document.createElement('div'); error.setAttribute('role','alert');
        const actions = document.createElement('div'); actions.className = 'crop-actions';
        const reset = document.createElement('button'); reset.type = 'button'; reset.textContent = 'Reset';
        const cancel = document.createElement('button'); cancel.type = 'button'; cancel.textContent = 'Cancel';
        const confirm = document.createElement('button'); confirm.type = 'button'; confirm.textContent = 'Confirm'; confirm.className = 'primary';
        const buttons = document.createElement('div'); buttons.className = 'crop-action-buttons'; buttons.append(reset,cancel,confirm);
        actions.append(hint,buttons); body.append(error); dialog.append(style,heading,body,actions);
        this.#events = new document.defaultView.AbortController();
        const listen = {signal:this.#events.signal};
        frame.addEventListener('pointerdown', event => this.#down(event), listen);
        for (const handle of [rotateHandle,zoomHandle]) handle.addEventListener('pointerdown', event => this.#down(event), listen);
        frame.addEventListener('pointermove', event => this.#move(event), listen);
        frame.addEventListener('pointerup', event => this.#up(event), listen);
        for (const type of ['pointercancel','lostpointercapture']) frame.addEventListener(type, event => {
            if (this.#points.has(event.pointerId)) this.#cancelGesture();
        }, listen);
        frame.addEventListener('dragstart', event => event.preventDefault(), listen);
        frame.addEventListener('wheel', event => this.#wheel(event), {...listen,passive:false});
        frame.addEventListener('gesturestart', event => this.#trackpadStart(event), {...listen,passive:false});
        frame.addEventListener('gesturechange', event => this.#trackpadChange(event), {...listen,passive:false});
        frame.addEventListener('gestureend', event => this.#trackpadEnd(event), {...listen,passive:false});
        document.defaultView.addEventListener('blur', () => this.#cancelGesture(), listen);
        document.addEventListener('visibilitychange', () => { if (document.hidden) this.#cancelGesture(); }, listen);
        frame.addEventListener('keydown', event => {
            const delta = {ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
            if (!delta) return;
            event.preventDefault(); this.#cancelGesture();
            const value = this.#session.transform, step = event.shiftKey ? 10 : 1;
            value.x += delta[0]*step; value.y += delta[1]*step;
            this.#session.setTransform(value); this.#paint();
        }, listen);
        for (const [button,mode] of [[rotateHandle,'rotate'],[zoomHandle,'zoom']]) button.addEventListener('keydown', event => {
            if (!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) return;
            event.preventDefault(); this.#cancelGesture();
            const positive = event.key === 'ArrowUp' || event.key === 'ArrowRight';
            const value = this.#session.transform;
            if (mode === 'rotate') value.rotate += positive ? 5 : -5;
            else value.zoom = this.#boundedZoom(value.zoom * (positive ? 1.05 : 1/1.05));
            this.#session.setTransform(value); this.#paint();
        }, listen);
        reset.addEventListener('click', () => { this.#cancelGesture(); this.#session.reset(); this.#paint(); }, listen);
        cancel.addEventListener('click', () => this.cancel(), listen);
        dialog.addEventListener('cancel', event => { event.preventDefault(); this.cancel(); }, listen);
        dialog.addEventListener('close', () => { if (!this.#settled) this.cancel(); }, listen);
        confirm.addEventListener('click', async () => {
            this.#cancelGesture(); confirm.disabled = true; error.textContent = '';
            try {
                const transform = this.#session.transform;
                const {outputWidth,outputHeight,type,quality} = this.#options;
                const blob = await this.#session.confirm({outputWidth,outputHeight,type,quality});
                this.#finish({blob,transform});
            } catch (failure) {
                if (!this.#settled) { error.textContent = failure.message; confirm.disabled = false; }
            }
        }, listen);
        this.#paint();
    }
    #geometry() {
        const [a,b] = this.#points.values();
        if (!b) return {x:a.x,y:a.y,distance:0,angle:0};
        return {x:(a.x+b.x)/2,y:(a.y+b.y)/2,distance:Math.hypot(b.x-a.x,b.y-a.y),angle:Math.atan2(b.y-a.y,b.x-a.x)};
    }
    #rebase(mode = 'move') {
        const geometry = this.#geometry();
        if (this.#points.size === 2 && geometry.distance === 0) { this.#cancelGesture(); return; }
        const rect = this.#frame.getBoundingClientRect();
        const center = {x:rect.left+rect.width/2,y:rect.top+rect.height/2};
        const angle = Math.atan2(geometry.y-center.y,geometry.x-center.x);
        const distance = Math.hypot(geometry.x-center.x,geometry.y-center.y);
        this.#gesture = {base:this.#session.transform,geometry,mode,center,distance,lastAngle:geometry.angle,handleAngle:angle,rotation:0};
    }
    #down(event) {
        if (event.button !== 0 || this.#settled || this.#trackpadGesture) return;
        if (this.#points.size && (event.pointerType !== 'touch' || [...this.#points.values()].some(point => point.type !== 'touch'))) return;
        if (this.#points.size === 2) { this.#cancelGesture(); return; }
        const handleMode = event.target.closest('[data-crop-handle]')?.dataset.cropHandle;
        const mode = handleMode ? `handle-${handleMode}` : event.pointerType === 'touch' ? 'move' :
            event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey ? 'zoom' :
            event.altKey && !event.shiftKey && !event.ctrlKey && !event.metaKey ? 'rotate' :
            !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey ? 'move' : null;
        if (!mode) return;
        event.preventDefault();
        this.#points.set(event.pointerId,{x:event.clientX,y:event.clientY,type:event.pointerType});
        this.#frame.setPointerCapture(event.pointerId);
        this.#frame.style.cursor = 'grabbing';
        this.#rebase(mode);
    }
    #move(event) {
        const point = this.#points.get(event.pointerId);
        if (!point || !this.#gesture) return;
        event.preventDefault(); point.x = event.clientX; point.y = event.clientY;
        const current = this.#geometry(), gesture = this.#gesture;
        const dx = current.x-gesture.geometry.x, dy = current.y-gesture.geometry.y;
        const value = {...gesture.base};
        if (this.#points.size === 2) {
            value.x += dx; value.y += dy;
            if (current.distance > 0) {
                const delta = current.angle-gesture.lastAngle;
                gesture.rotation += Math.atan2(Math.sin(delta),Math.cos(delta))*180/Math.PI;
                gesture.lastAngle = current.angle;
            }
            value.rotate += gesture.rotation;
            value.zoom = gesture.base.zoom * current.distance / gesture.geometry.distance;
        } else if (gesture.mode === 'handle-zoom') {
            const distance = Math.hypot(current.x-gesture.center.x,current.y-gesture.center.y);
            if (gesture.distance > 0) value.zoom = gesture.base.zoom * distance/gesture.distance;
        } else if (gesture.mode === 'handle-rotate') {
            const angle = Math.atan2(current.y-gesture.center.y,current.x-gesture.center.x);
            const delta = angle-gesture.handleAngle;
            gesture.rotation += Math.atan2(Math.sin(delta),Math.cos(delta))*180/Math.PI;
            gesture.handleAngle = angle; value.rotate += gesture.rotation;
        } else if (gesture.mode === 'zoom') value.zoom = gesture.base.zoom * Math.exp(dy/100);
        else if (gesture.mode === 'rotate') value.rotate -= dy;
        else { value.x += dx; value.y += dy; }
        value.zoom = this.#boundedZoom(value.zoom);
        this.#session.setTransform(value); this.#paint();
    }
    #up(event) {
        if (!this.#points.has(event.pointerId)) return;
        this.#move(event); this.#points.delete(event.pointerId);
        if (this.#frame.hasPointerCapture(event.pointerId)) this.#frame.releasePointerCapture(event.pointerId);
        if (this.#points.size) this.#rebase(); else this.#cancelGesture();
    }
    #cancelGesture() {
        const ids = [...this.#points.keys()]; this.#points.clear(); this.#gesture = null; this.#trackpadGesture = null;
        for (const id of ids) if (this.#frame.hasPointerCapture(id)) this.#frame.releasePointerCapture(id);
        if (this.#frame) this.#frame.style.cursor = 'grab';
    }
    #boundedZoom(zoom) {
        return Math.max(this.#minZoom,Math.min(this.#maxZoom,zoom));
    }
    #wheel(event) {
        if (this.#settled || this.#points.size || (!event.ctrlKey && !event.altKey)) return;
        event.preventDefault();
        if (this.#trackpadGesture) return;
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? this.#options.height : 1;
        const value = this.#session.transform;
        if (event.ctrlKey) value.zoom = this.#boundedZoom(value.zoom * Math.exp(-event.deltaY * unit / 100));
        else value.rotate -= event.deltaY * unit / 4;
        this.#session.setTransform(value); this.#paint();
    }
    #trackpadStart(event) {
        if (this.#settled || this.#points.size) return;
        event.preventDefault();
        this.#trackpadGesture = this.#session.transform;
    }
    #trackpadChange(event) {
        if (!this.#trackpadGesture || this.#settled) return;
        event.preventDefault();
        if (!Number.isFinite(event.scale) || event.scale <= 0 || !Number.isFinite(event.rotation)) return;
        const value = {...this.#trackpadGesture};
        value.zoom = this.#boundedZoom(value.zoom * event.scale);
        value.rotate += event.rotation;
        this.#session.setTransform(value); this.#paint();
    }
    #trackpadEnd(event) {
        if (!this.#trackpadGesture) return;
        event.preventDefault(); this.#trackpadGesture = null;
    }
    #paint() {
        const {x,y,zoom,rotate} = this.#session.transform;
        this.#frameImage.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${zoom})`;
    }
    open() {
        if (this.#resolve || this.#settled) throw new Error('Image crop dialog has already opened');
        return new Promise((resolve, reject) => {
            this.#resolve = resolve;
            this.#document.body.append(this.#dialog);
            try { this.#dialog.showModal(); }
            catch (error) { this.#settled = true; this.#events.abort(); this.#dialog.remove(); reject(error); }
        });
    }
    cancel() {
        if (this.#settled) return;
        this.#cancelGesture(); this.#session.cancel();
        if (!this.#resolve) { this.#settled = true; this.#events.abort(); return; }
        this.#finish(null);
    }
    #finish(value) {
        if (this.#settled) return;
        this.#settled = true;
        this.#cancelGesture(); this.#events.abort();
        if (this.#dialog.open) this.#dialog.close();
        this.#dialog.remove();
        this.#resolve(value);
    }
}
