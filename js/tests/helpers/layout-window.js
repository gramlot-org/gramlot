/** JSDOM has no layout engine. Supply its missing browser scheduling surfaces;
 * actual intrinsic geometry is qualified separately in real browsers. */
export function layoutWindow(window) {
    const frames = new Map();
    let next = 0;
    const observers = [];
    window.requestAnimationFrame = callback => { frames.set(++next, callback); return next; };
    window.cancelAnimationFrame = id => frames.delete(id);
    window.ResizeObserver = class {
        targets = new Set();
        constructor(callback) { this.callback = callback; observers.push(this); }
        observe(target) { this.targets.add(target); }
        unobserve(target) { this.targets.delete(target); }
        disconnect() { this.targets.clear(); }
    };
    Object.defineProperty(window.document, 'fonts', {value:new window.EventTarget()});
    return {observers, frames, flush() {
        const callbacks = [...frames.values()]; frames.clear();
        for (const callback of callbacks) callback();
    }};
}
