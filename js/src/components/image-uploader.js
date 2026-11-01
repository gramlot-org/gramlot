/** Editable image value backed by the shared upload engine when an operation is supplied. */
import {Bag} from '@gramlot/gramlot';
import {defineComponent} from './registry.js';
import {controlElement} from './bases.js';
import {UploadEngine, readUploadContext} from './upload-engine.js';
import {ImageCropDialog} from './image-crop-dialog.js';
import {randomId} from '../random-id.js';
import {captureScreen} from './screen-capture.js';

export const ImageUploader = defineComponent({
    name:'imageUploader', tag:'gramlot-image-uploader', base:controlElement, sourceContext:true, bagStore:true,
    parameters:{value:{dtype:'T', nullable:true, default:null, binding:'twoWay'},
        storepath:{dtype:'T'}, contextPath:{dtype:'T',nullable:true,default:null}, operation:{dtype:'T', nullable:true, default:null},
        cropWidth:{dtype:'L', default:256}, cropHeight:{dtype:'L', default:256},
        outputWidth:{dtype:'L', default:512}, outputHeight:{dtype:'L', default:512},
        disabled:{dtype:'B', default:false, binding:'read'}, onComplete:{dtype:'T', nullable:true, default:null}},
    implementation: Base => class extends Base {
        #context; #store; #engine; #original; #dialog; #pending; #generation = 0; #projected; #written;
        #cameraSubscription; #cameraToken = null; #cameraPending = false; #cameraAvailable = false; #cameraStatus; #screenRequest = null;
        constructor() {
            super();
            const doc = this.ownerDocument;
            this.control = doc.createElement('div'); this.controlBox.append(this.control);
            const style = doc.createElement('style');
            style.textContent = ':host{display:block} .image-uploader{display:grid;gap:.5em;justify-items:start} img{max-width:100%;max-height:240px} .actions{display:flex;gap:.5em;flex-wrap:wrap} button{font:inherit} .image-uploader[data-drag-over]{outline:2px dashed var(--gramlot-action,#3766b5);outline-offset:4px}';
            const box = doc.createElement('div'); box.className = 'image-uploader';
            this.preview = doc.createElement('img'); this.preview.alt = 'Selected image';
            this.input = doc.createElement('input'); this.input.type = 'file'; this.input.accept = 'image/png,image/jpeg,image/webp'; this.input.hidden = true;
            const actions = doc.createElement('div'); actions.className = 'actions';
            const button = caption => { const el = doc.createElement('button'); el.type = 'button'; el.textContent = caption; actions.append(el); return el; };
            this.chooseButton = button('Choose image'); this.cameraButton = button('Take photo'); this.screenButton = button('Capture screen'); this.editButton = button('Edit'); this.clearButton = button('Clear');
            this.cancelScreenButton = button('Cancel capture'); this.cancelButton = button('Cancel upload'); this.checkButton = button('Check status');
            this.message = doc.createElement('div'); this.message.setAttribute('role','status');
            box.append(this.preview,this.input,actions,this.message); this.control.append(box); this.shadowRoot.append(style);
            this.chooseButton.addEventListener('click', () => this.input.click());
            box.addEventListener('dragover', event => {
                if (!this.parameters?.disabled && !this.#pending && this.#cameraToken === null && !this.#screenRequest && [...event.dataTransfer.types].includes('Files')) {
                    event.preventDefault(); event.stopPropagation(); event.dataTransfer.dropEffect = 'copy'; box.setAttribute('data-drag-over','');
                }
            });
            box.addEventListener('dragleave', () => box.removeAttribute('data-drag-over'));
            box.addEventListener('drop', event => {
                box.removeAttribute('data-drag-over');
                if (this.parameters?.disabled || this.#pending || this.#cameraToken !== null || this.#screenRequest || ![...event.dataTransfer.types].includes('Files')) return;
                event.preventDefault(); event.stopPropagation();
                const files = [...event.dataTransfer.files];
                if (files.length !== 1) { this.message.textContent = 'Select one image'; return; }
                void this.#choose(files[0]);
            });
            this.cameraButton.addEventListener('click', () => this.#capture());
            this.screenButton.addEventListener('click', () => this.#captureScreen());
            this.cancelScreenButton.addEventListener('click', () => this.#screenRequest?.abort());
            this.input.addEventListener('change', event => { event.stopPropagation(); const file = this.input.files[0]; this.input.value = ''; if (file) void this.#choose(file); });
            this.editButton.addEventListener('click', () => void this.#edit());
            this.clearButton.addEventListener('click', () => { this.#invalidate(); this.#write(null); });
            this.cancelButton.addEventListener('click', () => { if (this.#pending) this.#engine.cancel(this.#pending.id); });
            this.checkButton.addEventListener('click', () => void this.#check());
        }
        setSourceContext(context) {
            this.#context = context;
            if (!context.sourceNode.imageCropState) Object.defineProperty(context.sourceNode,
                'imageCropState', {value:new Bag(), configurable:true});
        }
        readControlValue() { return this.parameters?.value ?? null; }
        writeControlValue(value) { if (this.parameters) { this.parameters.value = value; this.#render(); } }
        setStoreBag(store) {
            if (!(store instanceof Bag)) throw new TypeError('imageUploader storepath must resolve to a Bag');
            if (this.#store && this.#store !== store) { this.#invalidate(); this.#engine?.dispose(); this.#engine = null; }
            this.#store = store;
        }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            const p = this.parameters;
            for (const key of ['cropWidth','cropHeight','outputWidth','outputHeight']) {
                if (!Number.isSafeInteger(p[key]) || p[key] <= 0) throw new RangeError(`${key} must be a positive integer`);
            }
            if (p.cropWidth * p.outputHeight !== p.cropHeight * p.outputWidth) throw new RangeError('Crop and output aspect ratios must match');
            if (this.#projected !== undefined && p.value !== this.#projected && p.value !== this.#written) this.#invalidate();
            this.#projected = p.value; this.#written = undefined;
            this.#ensureEngine(); if (this.#engine) this.#engine.operation = p.operation;
            this.#render(); return rest;
        }
        connectedCallback() { this.#ensureEngine(); this.#observeCamera(); }
        disconnectedCallback() {
            // DOM relocation into a floating keeps the same Source owner and resources.
            this.ownerDocument.defaultView.queueMicrotask(() => {
                if (this.isConnected) return;
                if (this.#cameraSubscription) {
                    this.#context.upload().gramlot.data.unsubscribe(this.#cameraSubscription,{any:true}); this.#cameraSubscription = null;
                }
                this.#invalidate(); this.#engine?.dispose(); this.#engine = null;
            });
        }
        #observeCamera() {
            if (this.#cameraSubscription || !this.#context) return;
            const {gramlot} = this.#context.upload();
            this.#cameraSubscription = `image-uploader-camera-${randomId()}`;
            gramlot.data.subscribe(this.#cameraSubscription,{any:event => this.#syncCamera(event)});
            this.#syncCamera();
        }
        #syncCamera(event = null) {
            const {gramlot} = this.#context.upload();
            const available = Boolean(gramlot.dvc.provider && gramlot.dvc.provider.capabilities.includes('camera'));
            const camera = gramlot.data.getNode('gramlot.device.camera');
            const status = camera?.attr.status;
            if (available !== this.#cameraAvailable || status !== this.#cameraStatus) {
                this.#cameraAvailable = available; this.#cameraStatus = status; this.#render();
            }
            if (this.#cameraToken === null || event?.node !== camera) return;
            if (status === 'pending') { this.#cameraPending = true; return; }
            if (!this.#cameraPending || !['success','cancelled','denied','unavailable','error'].includes(status)) return;
            const token = this.#cameraToken; this.#cameraToken = null; this.#cameraPending = false; this.#render();
            if (status === 'success') void this.#usePhoto(camera.staticValue.getItem('url'),token);
            else if (status !== 'cancelled') this.message.textContent = camera.attr.error?.message || 'Camera is unavailable';
        }
        #capture() {
            if (!this.#cameraAvailable || this.#cameraStatus === 'pending' || this.parameters.disabled || this.#pending || this.#cameraToken !== null || this.#screenRequest) return;
            this.#cameraToken = ++this.#generation; this.#cameraPending = false;
            try { this.#context.sourceNode.FIRE('gramlot.device.camera?capture'); }
            catch (error) { this.#cameraToken = null; this.message.textContent = `Camera failed: ${error.message}`; this.#render(); }
        }
        #captureScreen() {
            if (this.parameters.disabled || this.#pending || this.#cameraToken !== null || this.#screenRequest || this.#dialog) return;
            const win=this.ownerDocument.defaultView, controller=new win.AbortController(), token=++this.#generation;
            this.#screenRequest=controller; this.message.textContent=''; this.#render();
            const request=captureScreen({document:this.ownerDocument,signal:controller.signal});
            void request.then(blob=>{
                if (token !== this.#generation) return;
                this.#screenRequest=null; this.#render();
                return this.#choose(new win.File([blob],'screen.png',{type:'image/png'}));
            }).catch(error=>{
                if (token !== this.#generation) return;
                this.#screenRequest=null; this.#render();
                if (error.name !== 'AbortError') this.message.textContent = error.name === 'NotAllowedError' ?
                    'Screen capture was cancelled or not permitted' : `Screen capture failed: ${error.message}`;
            });
        }
        async #usePhoto(url,token) {
            try {
                const candidate = await this.#load(url);
                if (token !== this.#generation) { this.#release(candidate); return; }
                await this.#crop(candidate,token);
            } catch (error) { if (token === this.#generation) this.message.textContent = `Image failed: ${error.message}`; }
        }
        #ensureEngine() {
            if (!this.#engine && this.#context && this.#store && this.parameters) {
                const {gramlot,window} = this.#context.upload();
                this.#engine = new UploadEngine({gramlot,window,store:this.#store,operation:this.parameters.operation,
                    onChange:() => this.#render(), getContext:() => readUploadContext(this.#context.sourceNode,this.parameters.contextPath), onComplete:(item,result) => this.#complete(item,result)});
            }
        }
        #release(candidate) { if (candidate?.objectUrl) this.ownerDocument.defaultView.URL.revokeObjectURL(candidate.objectUrl); }
        #invalidate() {
            this.#generation++; this.#screenRequest?.abort(); this.#screenRequest=null; this.#cameraToken = null; this.#cameraPending = false; this.#dialog?.cancel(); this.#dialog = null;
            if (this.#pending) { this.#engine?.cancel(this.#pending.id); if (this.#pending.candidate !== this.#original) this.#release(this.#pending.candidate); this.#pending = null; }
            this.#release(this.#original); this.#original = null;
        }
        #write(value) { this.#written = value; this.#context.writeParameter('value', value); }
        #render() {
            if (!this.parameters) return;
            const value = this.parameters.value;
            if (value) { this.preview.src = value; this.preview.hidden = false; } else { this.preview.removeAttribute('src'); this.preview.hidden = true; }
            const state = this.#pending && this.#store.getItem(this.#pending.id)?.getItem('status');
            const busy = Boolean(this.#pending || this.#cameraToken !== null || this.#screenRequest);
            this.screenButton.hidden = !this.ownerDocument.defaultView.navigator.mediaDevices?.getDisplayMedia;
            this.screenButton.disabled = Boolean(this.parameters.disabled || busy);
            this.cancelScreenButton.hidden = !this.#screenRequest;
            this.cameraButton.hidden = !this.#cameraAvailable;
            this.cameraButton.disabled = Boolean(this.parameters.disabled || busy || this.#cameraStatus === 'pending');
            this.chooseButton.disabled = this.editButton.disabled = this.clearButton.disabled = Boolean(this.parameters.disabled || busy);
            this.editButton.disabled ||= !value && !this.#original;
            this.clearButton.disabled ||= !value;
            this.cancelButton.hidden = !['preparing','uploading'].includes(state);
            this.checkButton.hidden = state !== 'uncertain';
            if (state) this.message.textContent = `Upload: ${state}${this.#store.getItem(this.#pending.id).getItem('error') ? ' — ' + this.#store.getItem(this.#pending.id).getItem('error') : ''}`;
        }
        async #load(source, objectUrl = null) {
            const win = this.ownerDocument.defaultView, image = new win.Image();
            if (!objectUrl) image.crossOrigin = 'anonymous';
            image.src = objectUrl || source;
            try { await image.decode(); }
            catch (error) { if (objectUrl) win.URL.revokeObjectURL(objectUrl); throw error; }
            if (!image.naturalWidth || !image.naturalHeight) { if (objectUrl) win.URL.revokeObjectURL(objectUrl); throw new Error('Image has no dimensions'); }
            const {cropWidth,cropHeight} = this.parameters;
            return {image, original:source, objectUrl, transform:{x:0,y:0,zoom:Math.max(cropWidth/image.naturalWidth,cropHeight/image.naturalHeight),rotate:0}};
        }
        async #choose(file) {
            if (this.parameters.disabled || this.#pending || this.#screenRequest) return;
            if (!['image/png','image/jpeg','image/webp'].includes(file.type)) { this.message.textContent = 'Choose a PNG, JPEG or WebP image'; return; }
            const token = ++this.#generation;
            try {
                const candidate = await this.#load(file, this.ownerDocument.defaultView.URL.createObjectURL(file));
                if (token !== this.#generation) { this.#release(candidate); return; }
                await this.#crop(candidate,token);
            } catch (error) { if (token === this.#generation) this.message.textContent = `Image failed: ${error.message}`; }
        }
        async #edit() {
            if (this.parameters.disabled || this.#pending || this.#screenRequest) return;
            const token = ++this.#generation;
            try {
                const candidate = this.#original || await this.#load(this.parameters.value);
                if (token !== this.#generation) { if (candidate !== this.#original) this.#release(candidate); return; }
                await this.#crop(candidate,token);
            } catch (error) { if (token === this.#generation) this.message.textContent = `Image failed: ${error.message}`; }
        }
        async #crop(candidate,token) {
            const p = this.parameters;
            const dialog = this.#dialog = new ImageCropDialog({state:this.#context.sourceNode.imageCropState,document:this.ownerDocument, original:candidate.original, image:candidate.image,
                sourceWidth:candidate.image.naturalWidth, sourceHeight:candidate.image.naturalHeight,
                width:p.cropWidth,height:p.cropHeight,outputWidth:p.outputWidth,outputHeight:p.outputHeight,type:'image/png',...candidate.transform});
            let result;
            try { result = await dialog.open(); } catch (error) { if (candidate !== this.#original) this.#release(candidate); throw error; }
            if (this.#dialog === dialog) this.#dialog = null;
            if (!result || token !== this.#generation) { if (candidate !== this.#original) this.#release(candidate); return; }
            if (p.operation === null) {
                try {
                    const data = await new Promise((resolve,reject) => { const reader = new this.ownerDocument.defaultView.FileReader();
                        reader.onload = () => resolve(reader.result); reader.onerror = () => reject(reader.error); reader.readAsDataURL(result.blob); });
                    if (token !== this.#generation) { if (candidate !== this.#original) this.#release(candidate); return; }
                    this.#commit(candidate,result.transform,data); this.message.textContent = 'Image updated';
                } catch (error) { if (candidate !== this.#original) this.#release(candidate); throw error; }
            } else {
                const name = typeof candidate.original === 'string' ? 'image.png' : candidate.original.name.replace(/\.[^.]*$/, '') + '.png';
                const file = new this.ownerDocument.defaultView.File([result.blob], name, {type:'image/png'});
                const id = this.#engine.add(file); this.#pending = {id,candidate,transform:result.transform,token};
                await this.#engine.start(id); this.#settle(id);
            }
        }
        #commit(candidate,transform,value) {
            if (this.#original !== candidate) this.#release(this.#original);
            candidate.transform = transform; this.#original = candidate; this.#write(value);
        }
        async #complete(item,result) {
            const pending = this.#pending;
            if (!pending || pending.id !== item.label || pending.token !== this.#generation) return;
            if (typeof result !== 'string' || !result) throw new TypeError('Image upload must return a displayable URL');
            this.#commit(pending.candidate,pending.transform,result);
            this.#pending = null; this.#render();
            if (this.parameters.onComplete) await this.#context.callLogic(this.parameters.onComplete,{item,result});
        }
        #settle(id) {
            if (!this.#pending || this.#pending.id !== id) return;
            const row = this.#store.getItem(id), state = row.getItem('status');
            if (['failed','cancelled','completed'].includes(state)) {
                const error = row.getItem('error');
                if (this.#pending.candidate !== this.#original) this.#release(this.#pending.candidate);
                this.#pending = null; this.#render(); this.message.textContent = error || `Upload: ${state}`;
            } else this.#render();
        }
        async #check() { if (!this.#pending) return; const id = this.#pending.id; await this.#engine.reconcile(id); this.#settle(id); }
    }
});
