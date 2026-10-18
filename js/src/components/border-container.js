/** Parent-owned regions. Layout changes never move or recreate slotted content. */
import {defineComponent} from './registry.js';
import {Container} from './container.js';

const SIDES = ['top', 'bottom', 'left', 'right'];
const REGIONS = [...SIDES, 'center'];
const borderRegions = new WeakMap();
const horizontal = side => side === 'top' || side === 'bottom';

/** Resolved Source attributes, not DOM scraping, supply the parent's region contract. */
function projectBorderChild(element, attrs, {adapt, invoke, publish, publishParent, writeParameter}) {
    const rest = {...attrs}, splitter = {}, drawer = {};
    for (const [name, value] of Object.entries(rest)) {
        for (const [prefix, group] of [['splitter_', splitter], ['drawer_', drawer]]) {
            if (name.startsWith(prefix)) { group[name.slice(prefix.length)] = value; delete rest[name]; }
        }
    }
    const region = rest.region;
    if (!REGIONS.includes(region)) throw new TypeError(`Invalid border region: ${region}`);
    const min = rest.minSize ?? 0, max = rest.maxSize ?? Infinity;
    if (typeof min !== 'number' || typeof max !== 'number' || !Number.isFinite(min) || min < 0 || max < min || Number.isNaN(max)) {
        throw new TypeError('Border minSize/maxSize must be nonnegative pixel limits, with maxSize >= minSize');
    }
    if (![undefined, null, false, true, 'close'].includes(rest.drawer)) throw new TypeError('drawer must be true, false or close');
    const probe = element.ownerDocument.createElement('div');
    probe.style.cssText = rest.style ?? '';
    const dimension = horizontal(region) ? 'height' : 'width';
    const numeric = typeof rest[dimension] === 'number';
    if (numeric) {
        if (!Number.isFinite(rest[dimension]) || rest[dimension] < 0) throw new TypeError('Border numeric dimensions must be finite nonnegative pixels');
        probe.style[dimension] = `${rest[dimension]}px`;
    }
    const size = probe.style[dimension];
    delete rest.width; delete rest.height;
    // The region owns its authored size; its child fills the allotted viewport.
    probe.style.width = '100%'; probe.style.height = '100%';
    rest.style = probe.style.cssText;
    const {label, icon, minimize = true, onclick, ...drawerStyle} = drawer;
    if (typeof minimize !== 'boolean') throw new TypeError('drawer_minimize must be a boolean');
    const drawerAttrs = adapt(drawerStyle);
    const drawerProbe = element.ownerDocument.createElement('div');
    drawerProbe.style.cssText = drawerAttrs.style ?? '';
    const background = drawerProbe.style.backgroundColor;
    if (background) drawerProbe.style.setProperty('--gramlot-drawer-background', background);
    if (drawerAttrs.style != null) drawerAttrs.style = drawerProbe.style.cssText;
    borderRegions.set(element, {region, size, min, max, splitter: rest.splitter === true,
        drawer: rest.drawer, hidden: rest.hidden === true,
        splitterAttrs: adapt(splitter), drawerAttrs, label, icon, minimize,
        writeParameter: size => { if (numeric) writeParameter(dimension, size); }, notifications: {
            closableChange: payload => publish('closable_change', payload),
            splitterResize: payload => publishParent('splitter_resize', payload),
        },
        onToggle: onclick ? (evt, show) => invoke('drawer_onclick', onclick, {evt, show}) : null});
    for (const key of ['region', 'splitter', 'drawer', 'minSize', 'maxSize']) delete rest[key];
    rest.slot = region;
    if (element.parentElement?.constructor.gramlotComponent?.name === 'borderContainer') element.parentElement.projectRegion(element);
    return rest;
}

function applyAttributes(element, attrs, previous) {
    for (const key of new Set([...Object.keys(previous), ...Object.keys(attrs)])) {
        if (attrs[key] == null) element.removeAttribute(key);
        else element.setAttribute(key, String(attrs[key]));
    }
    return attrs;
}

export const ContentPane = defineComponent({
    name: 'contentPane', tag: 'gramlot-content-pane', base: Container, subTags: '*',
    implementation: Base => class extends Base {
        constructor() {
            super();
            const style = this.ownerDocument.createElement('style');
            style.textContent = ':host{min-height:0;overflow:auto}.control-box{height:100%;min-height:0}';
            this.shadowRoot.append(style);
        }
    }
});

export const BorderContainer = defineComponent({
    name: 'borderContainer', tag: 'gramlot-border-container', base: Container, subTags: '*',
    childParameters: {region: {required: true, enum: REGIONS, unique: true}, width: {}, height: {}, drawer_onclick: {inline: ['evt', 'show']}},
    parameters: {
        design: {dtype: 'T', default: 'headline', binding: 'read', enum: ['headline', 'sidebar']},
        persist: {dtype: 'B', default: false, binding: 'read'},
    },
    implementation: Base => class extends Base {
        static projectChild(element, attrs, context) {
            return projectBorderChild(element, attrs, context);
        }
        #regions = new Map();
        #observer;
        #contentObserver;
        #drag;
        constructor() {
            super();
            this.control.replaceChildren();
            const doc = this.ownerDocument;
            this.#contentObserver = new doc.defaultView.ResizeObserver(entries => {
                for (const {target} of entries) {
                    const region = target.closest('.region');
                    region.style.setProperty('--drawer-content-width', `${target.offsetWidth}px`);
                    region.style.setProperty('--drawer-content-height', `${target.offsetHeight}px`);
                }
            });
            const style = doc.createElement('style');
            style.textContent = `:host{min-height:0;overflow:hidden}
                .control-box{height:100%;min-height:0;display:grid;
                    grid-template-columns:var(--left,0px) minmax(0,1fr) var(--right,0px);
                    grid-template-rows:var(--top,0px) minmax(0,1fr) var(--bottom,0px);
                    grid-template-areas:'top top top' 'left center right' 'bottom bottom bottom'}
                .control-box[data-design=sidebar]{grid-template-areas:'left top right' 'left center right' 'left bottom right'}
                .region{position:relative;min-width:0;min-height:0;overflow:visible}
                .viewport{height:100%;min-width:0;min-height:0;overflow:auto}
                .region[data-side=left]>.viewport{padding-right:var(--region-splitter,0px)}
                .region[data-side=right]>.viewport{padding-left:var(--region-splitter,0px)}
                .region[data-side=top]>.viewport{padding-bottom:var(--region-splitter,0px)}
                .region[data-side=bottom]>.viewport{padding-top:var(--region-splitter,0px)}
                .viewport[hidden]{display:none}::slotted(*){min-height:0}
                .separator{position:absolute;z-index:2;touch-action:none;user-select:none;background:var(--gramlot-splitter-background,var(--gramlot-border-control,#aaa))}
                .separator[data-axis=x]{top:0;bottom:0;width:var(--gramlot-splitter-size,1px);cursor:col-resize}
                .separator[data-axis=y]{left:0;right:0;height:var(--gramlot-splitter-size,1px);cursor:row-resize}
                .separator[data-side=left]{right:0}.separator[data-side=right]{left:0}
                .separator[data-side=top]{bottom:0}.separator[data-side=bottom]{top:0}
                .separator:hover{background:var(--gramlot-splitter-hover,#91a4bd)}
                .separator::before{content:'';position:absolute;inset:0}
                .separator[data-axis=x]::before{left:calc((100% - max(100%,var(--gramlot-touch-target,12px))) / 2);width:max(100%,var(--gramlot-touch-target,12px))}
                .separator[data-axis=y]::before{top:calc((100% - max(100%,var(--gramlot-touch-target,12px))) / 2);height:max(100%,var(--gramlot-touch-target,12px))}
                .separator[data-draggable=false]{cursor:default;background:transparent}
                .separator[data-draggable=false]::before{display:none}
                .separator[data-axis=x][data-draggable=false]{width:0!important}
                .separator[data-axis=y][data-draggable=false]{height:0!important}
                .separator:focus-visible{outline:2px solid var(--gramlot-focus-ring,Highlight);outline-offset:1px}
                .drawer{position:absolute;z-index:3;cursor:pointer;appearance:none;font:inherit;
                    font-size:var(--gramlot-drawer-font-size,11px);line-height:1.2;white-space:nowrap;
                    --drawer-background:var(--gramlot-drawer-background,#777);
                    color:var(--gramlot-drawer-color,hsl(from var(--drawer-background) 0 0 clamp(20,calc((60 - l) * 1000),100)));
                    background:var(--drawer-background);outline:none;
                    border:0;border-radius:0;box-shadow:none;
                    min-width:0;min-height:0;padding:0;
                    opacity:var(--gramlot-drawer-opacity,.45);
                    transition:opacity var(--gramlot-drawer-duration,.16s) var(--gramlot-drawer-easing,ease-out),
                        transform var(--gramlot-drawer-duration,.16s) var(--gramlot-drawer-easing,ease-out),
                        width var(--gramlot-drawer-duration,.16s) var(--gramlot-drawer-easing,ease-out),
                        height var(--gramlot-drawer-duration,.16s) var(--gramlot-drawer-easing,ease-out),
                        max-width var(--gramlot-drawer-duration,.16s) var(--gramlot-drawer-easing,ease-out),
                        max-height var(--gramlot-drawer-duration,.16s) var(--gramlot-drawer-easing,ease-out),
                        margin var(--gramlot-drawer-duration,.16s) var(--gramlot-drawer-easing,ease-out)}
                .drawer:hover,.drawer:focus-visible{opacity:var(--gramlot-drawer-active-opacity,1)}
                [data-axis=x]>.drawer[data-resizable]{cursor:col-resize}
                [data-axis=y]>.drawer[data-resizable]{cursor:row-resize}
                @media (hover:hover){
                    [data-axis=x]>.drawer:hover{transform:scale(var(--gramlot-drawer-hover-cross-scale,1.75),var(--gramlot-drawer-hover-length-scale,1.12))}
                    [data-axis=y]>.drawer:hover{transform:scale(var(--gramlot-drawer-hover-length-scale,1.12),var(--gramlot-drawer-hover-cross-scale,1.75))}
                    .separator>.drawer:is([data-labelled],[data-icon]):hover{transform:scale(var(--gramlot-drawer-label-hover-scale,1.04))}
                }
                
                [data-axis=x]>.drawer{--drawer-closed-width:var(--gramlot-drawer-thickness,4px);--drawer-closed-height:var(--gramlot-drawer-length,28px);
                    top:50%;margin-top:calc(var(--gramlot-drawer-length,28px) / -2);width:var(--drawer-closed-width);height:var(--drawer-closed-height)}
                [data-axis=y]>.drawer{--drawer-closed-width:var(--gramlot-drawer-length,28px);--drawer-closed-height:var(--gramlot-drawer-thickness,4px);
                    left:50%;margin-left:calc(var(--gramlot-drawer-length,28px) / -2);width:var(--drawer-closed-width);height:var(--drawer-closed-height)}
                .drawer::after{content:'';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
                    width:max(100%,var(--gramlot-touch-target,var(--gramlot-drawer-hit-target,12px)));height:max(100%,var(--gramlot-touch-target,var(--gramlot-drawer-hit-target,12px)))}
                .drawer{--drawer-reveal-width:var(--gramlot-drawer-reveal-width,var(--drawer-content-width,0px));--drawer-reveal-height:var(--gramlot-drawer-reveal-height,var(--drawer-content-height,0px))}
                .drawer[data-labelled]{opacity:var(--gramlot-drawer-active-opacity,1)}
                [data-side=left]>.drawer{transform-origin:left center;left:100%;border-left:0;border-radius:0 var(--gramlot-radius-sm,4px) var(--gramlot-radius-sm,4px) 0}
                [data-side=right]>.drawer{transform-origin:right center;right:100%;border-right:0;border-radius:var(--gramlot-radius-sm,4px) 0 0 var(--gramlot-radius-sm,4px)}
                [data-side=top]>.drawer{transform-origin:center top;top:100%;border-top:0;border-radius:0 0 var(--gramlot-radius-sm,4px) var(--gramlot-radius-sm,4px)}
                [data-side=bottom]>.drawer{transform-origin:center bottom;bottom:100%;border-bottom:0;border-radius:var(--gramlot-radius-sm,4px) var(--gramlot-radius-sm,4px) 0 0}
                .drawer:is([data-labelled],[data-icon]){width:max-content;height:max-content;padding:0}
                .drawer-viewport{display:block;overflow:hidden;min-width:0;min-height:0;max-width:inherit;max-height:inherit}
                .drawer-content{display:flex;width:max-content;height:max-content;align-items:center;gap:var(--gramlot-drawer-content-gap,4px);box-sizing:border-box;
                    padding:var(--gramlot-drawer-padding,2px 8px);overflow:hidden;pointer-events:none;
                    min-width:0;min-height:0}
                .drawer-icon{display:block;flex:none;font-size:var(--gramlot-drawer-icon-size,1em);line-height:1}
                .drawer-icon[hidden],.drawer-label:empty{display:none}
                .drawer-label{display:block;flex:none;pointer-events:none}
                .drawer-rotated .drawer-content{flex-direction:column;padding:var(--gramlot-drawer-padding,8px 2px)}
                .drawer-rotated .drawer-label{writing-mode:vertical-rl;text-orientation:mixed}
                .separator[data-axis=x]>.drawer.drawer-rotated{margin-top:0;translate:0 -50%}
                /* Icon and caption reveal as one unit; the resting grip stays thin. */
                .separator>.drawer.drawer-reveal:is([data-labelled],[data-icon]){--drawer-open:var(--gramlot-drawer-reveal,0);
                    opacity:calc(var(--gramlot-drawer-opacity,.45) + (var(--gramlot-drawer-active-opacity,1) - var(--gramlot-drawer-opacity,.45)) * var(--drawer-open));
                    display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);
                    min-width:0;min-height:0;
                    max-width:calc(var(--drawer-closed-width) + (var(--drawer-reveal-width) - var(--drawer-closed-width)) * var(--drawer-open));
                    max-height:calc(var(--drawer-closed-height) + (var(--drawer-reveal-height) - var(--drawer-closed-height)) * var(--drawer-open))}
                .separator[data-axis=x]>.drawer.drawer-reveal{margin-top:0;translate:0 -50%}
                [data-axis=y]>.drawer:is([data-labelled],[data-icon]){margin-left:0;translate:-50% 0}
                .drawer-reveal .drawer-content{opacity:var(--drawer-open);
                    transition:opacity var(--gramlot-drawer-duration,.16s) var(--gramlot-drawer-easing,ease-out)}
                @media (hover:none),(pointer:coarse){.separator>.drawer.drawer-reveal:is([data-labelled],[data-icon]){--drawer-open:1}}
                @media (hover:hover){.separator>.drawer.drawer-reveal:is([data-labelled],[data-icon]):hover{--drawer-open:1;transform:scale(var(--gramlot-drawer-label-hover-scale,1.04))}}
                .separator>.drawer:is([data-labelled],[data-icon]):is(:active,[data-active]){transform:scale(var(--gramlot-drawer-label-hover-scale,1.04))}
                .separator>.drawer.drawer-reveal:is([data-labelled],[data-icon]):is(:focus-visible,:active,[data-active]){--drawer-open:1;transform:scale(var(--gramlot-drawer-label-hover-scale,1.04))}
                @media (prefers-reduced-motion:reduce){.drawer,.drawer-reveal .drawer-content{transition:none}}
                .drawer[hidden],.separator[hidden]{display:none}
                .drag-cover{position:absolute;inset:0;z-index:4;display:none}
                :host{position:relative}.drag-cover[data-active]{display:block}`;
            for (const side of REGIONS) {
                const cell = doc.createElement('div'); cell.className = 'region'; cell.style.gridArea = side;
                const viewport = doc.createElement('div'); viewport.className = 'viewport'; cell.dataset.side = side; viewport.id = `region-${side}`;
                const slot = doc.createElement('slot'); slot.name = side; viewport.append(slot); cell.append(viewport);
                const state = {cell, viewport, child:null, config:null, visibility:null, closed:false, suppressDrawerClick:false, size:null, splitterAttrs:{}, drawerAttrs:{}};
                if (side !== 'center') {
                    const separator = doc.createElement('div'); separator.className = 'separator';
                    separator.dataset.side = side; separator.dataset.axis = horizontal(side) ? 'y' : 'x';
                    separator.setAttribute('role', 'separator'); separator.setAttribute('aria-label', `Resize ${side} region`);
                    separator.setAttribute('aria-orientation', horizontal(side) ? 'horizontal' : 'vertical');
                    separator.setAttribute('aria-controls', viewport.id);
                    const drawer = doc.createElement('button'); drawer.type = 'button'; drawer.className = 'drawer';
                    drawer.setAttribute('aria-controls', viewport.id);
                    const drawerIcon = doc.createElement('span'); drawerIcon.className = 'drawer-icon'; drawerIcon.setAttribute('aria-hidden', 'true');
                    const drawerLabel = doc.createElement('span'); drawerLabel.className = 'drawer-label';
                    const drawerContent = doc.createElement('span'); drawerContent.className = 'drawer-content';
                    const drawerViewport = doc.createElement('span'); drawerViewport.className = 'drawer-viewport';
                    drawerContent.append(drawerIcon, drawerLabel); drawerViewport.append(drawerContent);
                    drawer.append(drawerViewport); separator.append(drawer); cell.append(separator);
                    // Touch pointer capture can clear :active before release; keep only the pressed presentation.
                    drawer.addEventListener('pointerdown', evt => { if (evt.button === 0) drawer.setAttribute('data-active', ''); });
                    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture', 'pointerleave']) {
                        drawer.addEventListener(event, evt => {
                            if (event !== 'pointerleave' || !drawer.hasPointerCapture(evt.pointerId)) drawer.removeAttribute('data-active');
                        });
                    }
                    Object.assign(state, {separator, drawer, drawerIcon, drawerLabel, drawerContent});
                    separator.addEventListener('pointerdown', evt => this.#startDrag(side, evt));
                    separator.addEventListener('keydown', evt => this.#keyResize(side, evt));
                    drawer.addEventListener('click', evt => {
                        evt.stopPropagation();
                        if (state.suppressDrawerClick && evt.detail !== 0) { state.suppressDrawerClick = false; return; }
                        state.closed = !state.closed; this.#render(side);
                        state.config.onToggle?.(evt, !state.closed);
                    });
                }
                this.#regions.set(side, state); this.control.append(cell);
                slot.addEventListener('slotchange', () => this.#sync());
            }
            this.cover = doc.createElement('div'); this.cover.className = 'drag-cover';
            this.shadowRoot.append(style, this.cover);
            this.#observer = new doc.defaultView.MutationObserver(() => this.#sync());
        }
        connectedCallback() {
            this.#observer.observe(this, {childList:true});
            for (const state of this.#regions.values()) if (state.drawerContent) this.#contentObserver.observe(state.drawerContent);
            this.#sync();
        }
        disconnectedCallback() { this.#observer.disconnect(); this.#contentObserver.disconnect(); this.#stopDrag(); }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            if (!['headline', 'sidebar'].includes(this.parameters.design)) throw new TypeError('Invalid border design');
            if (Object.hasOwn(attrs, 'liveSplitters')) throw new TypeError('Border splitters are always live; omit liveSplitters');
            if (this.parameters.persist && !attrs.id) throw new TypeError('Persistent borderContainer requires a stable id');
            this.control.dataset.design = this.parameters.design;
            return rest;
        }
        #sync() {
            const children = new Map();
            for (const child of this.children) {
                const config = borderRegions.get(child);
                if (!config) continue;
                if (children.has(config.region)) throw new Error(`Duplicate border region: ${config.region}`);
                children.set(config.region, child);
            }
            for (const [side, state] of this.#regions) {
                const child = children.get(side) ?? null;
                if (state.child !== child) {
                    if (this.#drag?.side === side) this.#stopDrag();
                    state.child = child; state.config = null; state.visibility = null; state.size = null; state.closed = false;
                }
                if (child) this.projectRegion(child);
                else { state.config = null; this.#render(side); }
            }
        }
        projectRegion(child) {
            const config = borderRegions.get(child), side = config.region, state = this.#regions.get(side);
            if (state.child !== child) { this.#sync(); return; }
            const before = state.config;
            if (!before || before.size !== config.size) {
                state.size = config.size || 'auto';
                if (!before && this.parameters.persist) {
                    const saved = this.ownerDocument.cookie.split('; ').find(item => item.startsWith(`${this.#cookie(side)}=`));
                    if (saved) state.size = decodeURIComponent(saved.split('=').slice(1).join('='));
                }
            }
            if (!before || before.drawer !== config.drawer) state.closed = config.drawer === 'close';
            state.config = config;
            if (side !== 'center') {
                state.splitterAttrs = applyAttributes(state.separator, config.splitterAttrs, state.splitterAttrs);
                state.drawerAttrs = applyAttributes(state.drawer, config.drawerAttrs, state.drawerAttrs);
                state.separator.classList.add('separator'); state.drawer.classList.add('drawer');
                state.drawer.classList.toggle('drawer-reveal', config.minimize);
                state.drawer.classList.toggle('drawer-rotated', !horizontal(side));
                state.drawerLabel.innerHTML = config.label ?? '';
                state.drawerIcon.textContent = config.icon ?? '';
                state.drawerIcon.hidden = !config.icon;
                state.drawer.toggleAttribute('data-icon', !!config.icon);
                state.drawer.toggleAttribute('data-labelled', !!config.label);
            }
            this.#render(side);
        }
        #render(side) {
            const state = this.#regions.get(side), c = state.config;
            const visible = !!c && !c.hidden && !state.closed;
            const previous = state.visibility;
            state.visibility = c ? {open: visible, drawer: !!c.drawer} : null;
            state.viewport.hidden = !visible;
            if (side === 'center') return;
            this.control.style.setProperty(`--${side}`, visible ? state.size : '0px');
            state.separator.hidden = !c || c.hidden || (!c.splitter && !c.drawer);
            const draggable = visible && c.splitter;
            state.cell.style.setProperty('--region-splitter', draggable ? (state.separator.style[horizontal(side) ? 'height' : 'width'] || 'var(--gramlot-splitter-size,1px)') : '0px');
            state.separator.dataset.draggable = String(!!draggable);
            state.separator.setAttribute('role', draggable ? 'separator' : 'presentation');
            state.separator.tabIndex = draggable ? 0 : -1;
            state.drawer.hidden = !c?.drawer;
            state.drawer.toggleAttribute('data-resizable', !!c?.splitter);
            state.drawer.setAttribute('aria-expanded', String(visible));
            state.drawer.setAttribute('aria-label', `${visible ? 'Close' : 'Open'} ${side} region`);
            state.drawer.title = c?.drawerAttrs.title ?? state.drawer.getAttribute('aria-label');
            state.separator.setAttribute('aria-valuemin', String(c?.min ?? 0));
            state.separator.setAttribute('aria-valuenow', String(Math.round(this.#extent(side))));
            if (c && Number.isFinite(c.max)) state.separator.setAttribute('aria-valuemax', String(c.max));
            else state.separator.removeAttribute('aria-valuemax');
            if (c && previous && (previous.drawer || c.drawer) && previous.open !== visible) {
                c.notifications.closableChange({open: visible, region: side});
            }
        }
        #extent(side) { const box = this.#regions.get(side).cell.getBoundingClientRect(); return horizontal(side) ? box.height : box.width; }
        #resize(side, desired) {
            const state = this.#regions.get(side), c = state.config;
            const opposite = {left:'right',right:'left',top:'bottom',bottom:'top'}[side];
            const box = this.control.getBoundingClientRect();
            const available = Math.max(0, (horizontal(side) ? box.height : box.width) - this.#extent(opposite));
            const size = Math.max(Math.min(c.min, available), Math.min(desired, c.max, available));
            state.size = `${size}px`; this.#render(side);
            c.writeParameter(size);
        }
        #keyResize(side, evt) {
            const state = this.#regions.get(side);
            if (evt.target !== state.separator || !state.config?.splitter || state.closed) return;
            const keys = horizontal(side) ? ['ArrowUp','ArrowDown'] : ['ArrowLeft','ArrowRight'];
            if (!keys.includes(evt.key)) return;
            evt.preventDefault();
            const sign = ['left','top'].includes(side) ? 1 : -1;
            const previousSize = this.#extent(side);
            this.#resize(side, previousSize + (evt.key === keys[0] ? -1 : 1) * sign);
            this.#commitResize(side, previousSize);
        }
        #startDrag(side, evt) {
            const state = this.#regions.get(side);
            if (evt.button !== 0) return;
            state.suppressDrawerClick = false;
            if (!state.config?.splitter) return;
            const fromDrawer = state.drawer.contains(evt.target);
            if (!fromDrawer) evt.preventDefault();
            this.#stopDrag();
            const axis = horizontal(side) ? 'clientY' : 'clientX', start = evt[axis], size = this.#extent(side);
            const sign = ['left','top'].includes(side) ? 1 : -1;
            const controller = new this.ownerDocument.defaultView.AbortController();
            const captureTarget = fromDrawer ? state.drawer : state.separator, pointerId = evt.pointerId;
            let resizing = !fromDrawer;
            this.#drag = {side, controller, captureTarget, pointerId};
            captureTarget.setPointerCapture(pointerId);
            if (resizing) this.cover.setAttribute('data-active', '');
            const options = {signal:controller.signal};
            captureTarget.addEventListener('pointermove', event => {
                if (event.pointerId !== pointerId) return;
                const distance = event[axis] - start;
                // Allow small click jitter before treating a drawer press as a drag.
                if (!resizing && Math.abs(distance) < 4) return;
                state.suppressDrawerClick = fromDrawer;
                // A closed drawer opens only when pulled towards the content.
                if (state.closed && sign * distance <= 0) return;
                const opening = state.closed;
                state.closed = false;
                resizing = true;
                this.cover.setAttribute('data-active', '');
                this.#resize(side, size + sign * distance);
                if (opening) state.config.onToggle?.(event, true);
            }, options);
            const finish = event => {
                if (event.pointerId !== pointerId) return;
                this.#stopDrag();
                if (resizing) this.#commitResize(side, size);
            };
            captureTarget.addEventListener('pointerup', finish, options);
            captureTarget.addEventListener('pointercancel', finish, options);
            captureTarget.addEventListener('lostpointercapture', finish, options);
        }
        #stopDrag() {
            if (!this.#drag) return;
            const {controller, captureTarget, pointerId} = this.#drag; this.#drag = null;
            controller.abort(); this.cover.removeAttribute('data-active');
            if (captureTarget.hasPointerCapture(pointerId)) captureTarget.releasePointerCapture(pointerId);
        }
        #commitResize(side, previousSize) {
            const state = this.#regions.get(side), size = this.#extent(side);
            if (size === previousSize) return;
            this.#save(side);
            state.config.notifications.splitterResize({region: side, size: `${size}px`, previousSize: `${previousSize}px`});
        }
        #cookie(side) { return encodeURIComponent(`gramlot-border-${this.id}-${side}`); }
        #save(side) {
            if (this.parameters.persist) this.ownerDocument.cookie = `${this.#cookie(side)}=${encodeURIComponent(this.#regions.get(side).size)}; Path=/; SameSite=Lax`;
        }
    }
});
