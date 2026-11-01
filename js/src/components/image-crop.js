/** Rasterize an image transform into a new Blob without modifying the source.
 * x/y are viewport-pixel translations; zoom and rotate follow transformPane.
 * Output dimensions must preserve the viewport aspect ratio.
 */
export async function renderImageCrop({document, image, sourceWidth, sourceHeight,
    width, height, outputWidth, outputHeight, x, y, zoom, rotate, type, quality}) {
    const dimensions = [sourceWidth, sourceHeight, width, height, outputWidth, outputHeight];
    if (dimensions.some(value => !Number.isSafeInteger(value) || value <= 0)) {
        throw new TypeError('Crop dimensions must be positive safe integers');
    }
    if (BigInt(outputWidth) * BigInt(height) !== BigInt(outputHeight) * BigInt(width)) throw new RangeError('Crop output must preserve the viewport aspect ratio');
    if (![x, y, zoom, rotate].every(Number.isFinite) || zoom <= 0) throw new TypeError('Invalid image transform');
    if (typeof type !== 'string' || !type.startsWith('image/')) throw new TypeError('Crop output requires an image MIME type');
    if (quality !== undefined && (!Number.isFinite(quality) || quality < 0 || quality > 1)) {
        throw new RangeError('Crop quality must be between zero and one');
    }
    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    if (canvas.width !== outputWidth || canvas.height !== outputHeight) throw new RangeError('Crop output dimensions are unsupported');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Image crop canvas is unavailable');
    context.scale(outputWidth / width, outputHeight / height);
    context.translate(width / 2 + x, height / 2 + y);
    context.rotate(rotate * Math.PI / 180);
    context.scale(zoom, zoom);
    context.drawImage(image, -sourceWidth / 2, -sourceHeight / 2, sourceWidth, sourceHeight);
    return await new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) { reject(new Error('Image crop encoding failed')); return; }
            if (blob.type !== type) { reject(new Error(`Unsupported image format: ${type}`)); return; }
            resolve(blob);
        }, type, quality);
    });
}

/** One private editing session; the caller owns the original and decoded image. */
export class ImageCropSession {
    #document; #original; #image; #sourceWidth; #sourceHeight; #width; #height;
    #state; #generation = 0; #closed = false; #rendering = false;
    constructor({state, document, original, image, sourceWidth, sourceHeight, width, height, x = 0, y = 0, zoom = 1, rotate = 0}) {
        const transform = {x, y, zoom, rotate};
        this.#validate(transform);
        if (!original || !image) throw new TypeError('An original and decoded image are required');
        this.#document = document; this.#original = original; this.#image = image;
        this.#sourceWidth = sourceWidth; this.#sourceHeight = sourceHeight;
        this.#width = width; this.#height = height;
        this.#state = state;
        state.setItem('initial', transform); state.setItem('transform', {...transform});
    }
    #validate({x, y, zoom, rotate}) {
        if (![x, y, zoom, rotate].every(Number.isFinite) || zoom <= 0) throw new TypeError('Invalid image transform');
    }
    #open() { if (this.#closed) throw new Error('Image editing session is closed'); }
    get original() { return this.#original; }
    get transform() { return {...this.#state.getItem('transform')}; }
    setTransform(transform) {
        this.#open();
        if (!transform || Object.keys(transform).sort().join(',') !== 'rotate,x,y,zoom') throw new TypeError('Expected x, y, zoom and rotate');
        this.#validate(transform);
        this.#state.setItem('transform', {...transform}); this.#generation++;
    }
    reset() { this.#open(); this.#state.setItem('transform', {...this.#state.getItem('initial')}); this.#generation++; }
    cancel() { this.#closed = true; this.#generation++; }
    async confirm({outputWidth, outputHeight, type, quality}) {
        this.#open();
        if (this.#rendering) throw new Error('Image crop is already being generated');
        const generation = this.#generation;
        this.#rendering = true;
        try {
            const blob = await renderImageCrop({document:this.#document, image:this.#image,
                sourceWidth:this.#sourceWidth, sourceHeight:this.#sourceHeight, width:this.#width, height:this.#height,
                outputWidth, outputHeight, ...this.#state.getItem('transform'), type, quality});
            if (this.#closed || this.#generation !== generation) throw new DOMException('Image edit cancelled or changed', 'AbortError');
            this.#closed = true;
            return blob;
        } finally { this.#rendering = false; }
    }
}
