/** Pointer gestures for bound translation, rotation and zoom; child presentation remains in Source/Data. */
import {defineComponent} from './registry.js';
import {Container} from './container.js';

export const TransformPane = defineComponent({
    name: 'transformPane', tag: 'gramlot-transform-pane', base: Container, subTags: '*', sourceContext: true,
    parameters: {
        x: {dtype: 'R', default: 0, binding: 'read'},
        y: {dtype: 'R', default: 0, binding: 'read'},
        rotate: {dtype: 'R', default: 0, binding: 'read'},
        zoom: {dtype: 'R', default: 1, binding: 'read'},
        min: {dtype: 'R', default: 0.5, binding: 'read'},
        max: {dtype: 'R', default: 3, binding: 'read'},
        step: {dtype: 'R', default: 0.01, binding: 'read'},
        onEnd: {dtype: 'T', nullable: true}
    },
    implementation: Base => class extends Base {
        #context;
        #events;
        #points = new Map();
        #gesture = null;
        #writing = false;
        #range;
        constructor() {
            super();
            const style = this.ownerDocument.createElement('style');
            style.textContent = ':host{touch-action:none;user-select:none;-webkit-user-select:none}.control-box{height:100%}';
            this.shadowRoot.append(style);
            this.#range = this.ownerDocument.createElement('input');
            this.#range.type = 'range';
        }
        setSourceContext(context) { this.#context = context; }
        projectAttributes(attrs, adapt) {
            const previous = this.parameters;
            const rest = super.projectAttributes(attrs, adapt);
            const {x, y, rotate, zoom, min, max, step} = this.parameters;
            if (![x, y, rotate, zoom, min, max, step].every(Number.isFinite) || min <= 0 || max < min || step <= 0) {
                throw new TypeError('transformPane requires finite x/y/rotate/zoom, positive min/step and max >= min');
            }
            if (!this.#writing && previous && ['x','y','rotate','zoom','min','max','step'].some(key => previous[key] !== this.parameters[key])) this.#cancel();
            this.#range.min = String(min); this.#range.max = String(max); this.#range.step = String(step);
            this.#range.value = String(zoom);
            const corrected = this.#range.valueAsNumber;
            if (!this.#writing && corrected !== zoom) this.#write({zoom: corrected});
            return rest;
        }
        connectedCallback() {
            this.#events = new this.ownerDocument.defaultView.AbortController();
            const options = {signal: this.#events.signal};
            this.addEventListener('pointerdown', event => this.#down(event), options);
            this.addEventListener('pointermove', event => this.#move(event), options);
            this.addEventListener('pointerup', event => this.#up(event), options);
            for (const type of ['pointercancel', 'lostpointercapture']) {
                this.addEventListener(type, event => { if (this.#points.has(event.pointerId)) this.#cancel(); }, options);
            }
            this.addEventListener('dragstart', event => event.preventDefault(), options);
            this.ownerDocument.addEventListener('visibilitychange', () => { if (this.ownerDocument.hidden) this.#cancel(); }, options);
            this.ownerDocument.defaultView.addEventListener('blur', () => this.#cancel(), options);
        }
        disconnectedCallback() {
            this.#events?.abort(); this.#events = null; this.#cancel();
        }
        #write(values) {
            this.#writing = true;
            try {
                for (const [name, value] of Object.entries(values)) {
                    if (value !== this.parameters[name]) this.#context.writeParameter(name, value);
                }
            }
            finally { this.#writing = false; }
        }
        #values() {
            const {x, y, rotate, zoom} = this.parameters;
            return {x, y, rotate, zoom};
        }
        #geometry() {
            const [a, b] = this.#points.values();
            if (!b) return {x: a.x, y: a.y, distance: 0, angle: 0};
            return {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2,
                distance: Math.hypot(b.x - a.x, b.y - a.y), angle: Math.atan2(b.y - a.y, b.x - a.x)};
        }
        #rebase() {
            const geometry = this.#geometry();
            if (this.#points.size === 2 && geometry.distance === 0) { this.#cancel(); return; }
            const values = this.#values();
            this.#gesture = {initial: this.#gesture?.initial ?? values, base: values, geometry,
                lastAngle: geometry.angle, rotation: 0};
        }
        #down(event) {
            if (event.button !== 0 || !this.isConnected) return;
            // Two-pointer transformations are touch gestures; mouse/pen still translate.
            if (this.#points.size && (event.pointerType !== 'touch' || [...this.#points.values()].some(p => p.type !== 'touch'))) return;
            if (this.#points.size === 2) { this.#cancel(); return; }
            this.#points.set(event.pointerId, {x: event.clientX, y: event.clientY, type: event.pointerType});
            this.setPointerCapture(event.pointerId);
            this.#rebase();
        }
        #move(event) {
            const point = this.#points.get(event.pointerId);
            if (!point || !this.#gesture) return;
            point.x = event.clientX; point.y = event.clientY;
            const current = this.#geometry();
            const gesture = this.#gesture;
            const values = {x: gesture.base.x + current.x - gesture.geometry.x,
                y: gesture.base.y + current.y - gesture.geometry.y};
            if (this.#points.size === 2) {
                if (current.distance > 0) {
                    const delta = current.angle - gesture.lastAngle;
                    gesture.rotation += Math.atan2(Math.sin(delta), Math.cos(delta)) * 180 / Math.PI;
                    gesture.lastAngle = current.angle;
                }
                values.rotate = gesture.base.rotate + gesture.rotation;
                this.#range.value = String(gesture.base.zoom * current.distance / gesture.geometry.distance);
                values.zoom = this.#range.valueAsNumber;
            }
            this.#write(values);
        }
        #up(event) {
            if (!this.#points.has(event.pointerId)) return;
            this.#move(event);
            this.#points.delete(event.pointerId);
            if (this.hasPointerCapture(event.pointerId)) this.releasePointerCapture(event.pointerId);
            if (this.#points.size) { this.#rebase(); return; }
            const gesture = this.#gesture;
            const values = this.#values();
            this.#cancel();
            if (gesture && Object.keys(values).some(key => values[key] !== gesture.initial[key]) && this.parameters.onEnd) {
                const context = this.#context;
                const report = error => context.reportError(error, 'Transform completion failed');
                try { Promise.resolve(context.callLogic(this.parameters.onEnd, values)).catch(report); }
                catch (error) { report(error); }
            }
        }
        #cancel() {
            const ids = [...this.#points.keys()];
            this.#points.clear(); this.#gesture = null;
            for (const id of ids) if (this.hasPointerCapture(id)) this.releasePointerCapture(id);
        }
    }
});
