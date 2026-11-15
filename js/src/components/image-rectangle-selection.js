/**
 * Private rectangle selection of the image crop dialog (its Crop view): the whole image fits the element and a
 * dashed rectangle with eight handles selects the area. The rectangle keeps the frame aspect ratio (width/height)
 * and stays inside the image. It reads and returns the frame transform: the area a width x height frame shows
 * with x, y and zoom, rotation 0.
 */
const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
const MIN_SIDE = 16;

export const RECTANGLE_SELECTION_STYLE = `
    .gramlot-crop-rectangle{position:relative;width:100%;height:100%;background:#1d2733;border-radius:8px;overflow:hidden}
    .gramlot-crop-rectangle .crop-stage{position:absolute;touch-action:none;user-select:none}
    .gramlot-crop-rectangle .crop-stage img{display:block;width:100%;height:100%;pointer-events:none}
    .gramlot-crop-rectangle .crop-selection{position:absolute;border:2px dashed #fff;outline:1px solid #0009;box-shadow:0 0 0 9999px #0008;cursor:move}
    .gramlot-crop-rectangle .crop-selection:focus-visible{outline:2px solid var(--gramlot-focus-ring,#3766b5)}
    .gramlot-crop-rectangle .crop-selection span{position:absolute;width:12px;height:12px;margin:-6px;background:#fff;border:1px solid #1d2733;border-radius:2px}
    .gramlot-crop-rectangle [data-handle=nw],.gramlot-crop-rectangle [data-handle=se]{cursor:nwse-resize}
    .gramlot-crop-rectangle [data-handle=ne],.gramlot-crop-rectangle [data-handle=sw]{cursor:nesw-resize}
    .gramlot-crop-rectangle [data-handle=n],.gramlot-crop-rectangle [data-handle=s]{cursor:ns-resize}
    .gramlot-crop-rectangle [data-handle=e],.gramlot-crop-rectangle [data-handle=w]{cursor:ew-resize}`;

export class ImageRectangleSelection {
    #options; #stage; #selection; #rect; #initial; #scale = 1; #drag = null; #observer = null;
    constructor({document, image, sourceWidth, sourceHeight, width, height, signal}) {
        this.#options = {width, height, sourceWidth, sourceHeight};
        const element = this.element = document.createElement('div');
        element.className = 'gramlot-crop-rectangle';
        const stage = this.#stage = document.createElement('div'); stage.className = 'crop-stage';
        const picture = document.createElement('img'); picture.src = image.src; picture.alt = ''; picture.draggable = false;
        const selection = this.#selection = document.createElement('div'); selection.className = 'crop-selection';
        selection.tabIndex = 0; selection.setAttribute('role', 'group'); selection.setAttribute('aria-label', 'Crop area');
        selection.setAttribute('aria-description', 'Drag to move, drag a handle to resize. Arrow keys move the area.');
        for (const name of HANDLES) {
            const handle = document.createElement('span'); handle.dataset.handle = name;
            Object.assign(handle.style, {left: name.includes('w') ? '0' : name.includes('e') ? '100%' : '50%',
                top: name.includes('n') ? '0' : name.includes('s') ? '100%' : '50%'});
            selection.append(handle);
        }
        stage.append(picture, selection); element.append(stage);
        const listen = {signal};
        selection.addEventListener('pointerdown', event => this.#down(event), listen);
        selection.addEventListener('pointermove', event => this.#move(event), listen);
        for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) selection.addEventListener(type, event => this.#up(event), listen);
        selection.addEventListener('keydown', event => {
            const delta = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]}[event.key];
            if (!delta) return;
            event.preventDefault();
            const step = (event.shiftKey ? 10 : 1) / this.#scale;
            this.#setRect({...this.#rect, x: this.#rect.x + delta[0] * step, y: this.#rect.y + delta[1] * step});
        }, listen);
        this.#observer = new document.defaultView.ResizeObserver(() => this.layout());
        this.#observer.observe(element);
        signal.addEventListener('abort', () => this.#observer.disconnect());
    }
    /** Show the area of a frame transform; Reset returns to it. */
    show(transform) {
        this.#rect = this.#initial = this.#fit(this.#rectFromTransform(transform));
        this.layout();
    }
    reset() { this.#setRect(this.#initial); }
    /** The frame transform (rotation 0) that shows the selected area in the width x height frame. */
    get transform() {
        const {x, y, w} = this.#rect, {width, height, sourceWidth, sourceHeight} = this.#options;
        const zoom = width / w, h = w * height / width;
        return {x: -zoom * (x + w / 2 - sourceWidth / 2), y: -zoom * (y + h / 2 - sourceHeight / 2), zoom, rotate: 0};
    }
    #rectFromTransform({x, y, zoom}) {
        const {width, height, sourceWidth, sourceHeight} = this.#options;
        const w = width / zoom, h = height / zoom;
        return {x: sourceWidth / 2 - x / zoom - w / 2, y: sourceHeight / 2 - y / zoom - h / 2, w, h};
    }
    /** Keep the rectangle inside the image with the frame aspect ratio and at least MIN_SIDE source pixels. */
    #fit({x, y, w}) {
        const {width, height, sourceWidth, sourceHeight} = this.#options, ratio = width / height;
        w = Math.max(MIN_SIDE, Math.min(w, sourceWidth, sourceHeight * ratio));
        const h = w / ratio;
        return {x: Math.max(0, Math.min(x, sourceWidth - w)), y: Math.max(0, Math.min(y, sourceHeight - h)), w, h};
    }
    #setRect(rect) { this.#rect = this.#fit(rect); this.#paint(); }
    /** Fit the whole image in the element, centered. */
    layout() {
        const box = this.element.getBoundingClientRect(), {sourceWidth, sourceHeight} = this.#options;
        if (!box.width || !box.height || !this.#rect) return;
        this.#scale = Math.min(box.width / sourceWidth, box.height / sourceHeight);
        const w = sourceWidth * this.#scale, h = sourceHeight * this.#scale;
        Object.assign(this.#stage.style, {width: `${w}px`, height: `${h}px`, left: `${(box.width - w) / 2}px`, top: `${(box.height - h) / 2}px`});
        this.#paint();
    }
    #paint() {
        const {x, y, w, h} = this.#rect, s = this.#scale;
        Object.assign(this.#selection.style, {left: `${x * s}px`, top: `${y * s}px`, width: `${w * s}px`, height: `${h * s}px`});
    }
    #down(event) {
        if (event.button !== 0 || this.#drag) return;
        event.preventDefault();
        this.#selection.setPointerCapture(event.pointerId);
        this.#drag = {id: event.pointerId, handle: event.target.dataset.handle ?? null, x: event.clientX, y: event.clientY, rect: {...this.#rect}};
    }
    #move(event) {
        const drag = this.#drag;
        if (!drag || drag.id !== event.pointerId) return;
        event.preventDefault();
        const dx = (event.clientX - drag.x) / this.#scale, dy = (event.clientY - drag.y) / this.#scale, base = drag.rect;
        if (!drag.handle) { this.#setRect({...base, x: base.x + dx, y: base.y + dy}); return; }
        const {width, height, sourceWidth, sourceHeight} = this.#options, ratio = width / height, handle = drag.handle;
        // The new width from the dragged side; the height follows the ratio; the opposite side or corner stays.
        let w = base.w;
        if (handle.includes('e')) w = base.w + dx;
        else if (handle.includes('w')) w = base.w - dx;
        if (handle === 'n' || handle === 's') w = (base.h + (handle === 's' ? dy : -dy)) * ratio;
        else if (handle.length === 2) {
            // A corner follows the direction moved further.
            const vertical = (base.h + (handle.includes('s') ? dy : -dy)) * ratio;
            if (Math.abs(vertical - base.w) > Math.abs(w - base.w)) w = vertical;
        }
        w = Math.max(MIN_SIDE, Math.min(w, sourceWidth, sourceHeight * ratio));
        const h = w / ratio;
        const x = handle.includes('w') ? base.x + base.w - w : handle.includes('e') ? base.x : base.x + (base.w - w) / 2;
        const y = handle.includes('n') ? base.y + base.h - h : handle.includes('s') ? base.y : base.y + (base.h - h) / 2;
        this.#setRect({x, y, w});
    }
    #up(event) {
        if (!this.#drag || this.#drag.id !== event.pointerId) return;
        if (event.type === 'pointerup') this.#move(event);
        if (this.#selection.hasPointerCapture(event.pointerId)) this.#selection.releasePointerCapture(event.pointerId);
        this.#drag = null;
    }
}
