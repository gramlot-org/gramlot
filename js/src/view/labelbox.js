/** Shared DOM presentation; instance-owned projection cache, no application state. */
export const labelboxPositions = ['TL', 'TC', 'TR', 'L', 'R', 'BL', 'BC', 'BR'];
export const labelboxStyle = `.gramlot-labelbox[hidden]{display:none!important}
.gramlot-labelbox{box-sizing:border-box;min-width:0;min-height:0;--gramlot-label-width:initial;--gramlot-formlet-label-width:initial;display:grid;gap:var(--gramlot-label-gap,.25em);grid-template-areas:'label' 'control';grid-template-columns:minmax(0,1fr);grid-template-rows:max-content minmax(0,1fr)}
                .gramlot-labelbox>.label-box{grid-area:label;color:var(--gramlot-label-color,var(--gramlot-text-secondary,inherit));font-size:var(--gramlot-label-size,1em)} .gramlot-labelbox>.control-box{box-sizing:border-box;grid-area:control;min-width:0;min-height:0;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}
.gramlot-labelbox>.control-box>*{max-width:100%;box-sizing:border-box}
                .gramlot-labelbox[data-position='L']{grid-template-areas:'label control';grid-template-rows:minmax(0,1fr)}
                .gramlot-labelbox[data-position='R']{grid-template-areas:'control label';grid-template-columns:minmax(0,1fr) max-content;grid-template-rows:minmax(0,1fr)}
                .gramlot-labelbox[data-position='L']>.label-box,.gramlot-labelbox[data-position='R']>.label-box{align-self:center}
                .gramlot-labelbox[data-position^='B']{grid-template-areas:'control' 'label';grid-template-rows:minmax(0,1fr) max-content}
                .gramlot-labelbox[data-position$='C']>.label-box{text-align:center}
                .gramlot-labelbox[data-position$='R']>.label-box{text-align:right}
                .gramlot-labelbox>.label-box[hidden]{display:none} .gramlot-labelbox>.label-box label{display:block}
                .gramlot-labelbox[data-position='L']>.label-box{text-align:right;padding-right:2px}
                .gramlot-labelbox[data-formlet-aligned]>.label-box>label{width:max-content;margin-left:auto}
                .gramlot-labelbox[data-position='L']{grid-template-columns:var(--gramlot-label-width,var(--gramlot-formlet-label-width,max-content)) minmax(0,1fr)}
.gramlot-labelbox:has(>.label-box[hidden]){gap:0;grid-template-areas:'control';grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}
.gramlot-labelbox[data-variant='card']{gap:0;border:1px solid var(--gramlot-border-control,#b9c2ce);border-radius:var(--gramlot-window-radius,9px);background:var(--gramlot-surface,#fff);color:var(--gramlot-ink,CanvasText);box-shadow:0 3px 10px #0002}
.gramlot-labelbox[data-variant='card']>.label-box{background:var(--gramlot-card-header-background,var(--gramlot-header-background,#303946));color:var(--gramlot-card-header-color,var(--gramlot-header-color,#fff));box-sizing:border-box;min-height:28px;padding:3px 10px;border-radius:calc(var(--gramlot-window-radius,9px) - 1px) calc(var(--gramlot-window-radius,9px) - 1px) 0 0;font-weight:600}
.gramlot-labelbox[data-variant='card']>.label-box>label{color:inherit;font:inherit;line-height:20px;margin:0}
.gramlot-labelbox[data-variant='card']>.control-box{padding:12px}
.gramlot-labelbox[data-movable]>.label-box{cursor:grab;touch-action:none;user-select:none}
.gramlot-labelbox[data-movable]>.label-box>label{cursor:inherit;user-select:none;-webkit-user-select:none}
.gramlot-labelbox[data-selected]{outline:2px solid var(--gramlot-focus-ring,var(--gramlot-brand-blue,#3766b5));outline-offset:-2px}
.gramlot-labelbox[data-tray-block]>.label-box{position:relative;padding-inline:88px 32px}
.gramlot-labelbox>.label-box>.tray-settings-button{position:absolute;left:31px;top:50%;transform:translateY(-50%);display:grid;place-items:center;width:26px;height:26px;padding:4px;border:0;border-radius:4px;background:transparent;color:inherit;cursor:pointer}
.gramlot-labelbox>.label-box>button[hidden]{display:none}
.gramlot-labelbox>.label-box>.tray-settings-button[data-kind=layer]{left:59px}
.gramlot-labelbox>.label-box>.tray-close{position:absolute;right:3px;top:50%;transform:translateY(-50%);width:26px;height:26px;display:grid;place-items:center;padding:4px;border:0;border-radius:4px;background:transparent;color:inherit;cursor:pointer;opacity:.65}
.tray-close svg{width:18px;height:18px;pointer-events:none}
.gramlot-labelbox>.label-box>.tray-close:hover{opacity:1;background:color-mix(in srgb,currentColor 12%,transparent)}
.tray-close:focus-visible{opacity:1;outline:2px solid var(--gramlot-focus-ring,Highlight);outline-offset:-2px}
.tray-settings-button{opacity:.65}
.tray-settings-button:hover,.tray-settings-button:focus-visible{opacity:1}
.tray-settings-button svg{width:18px;height:18px;pointer-events:none}
.gramlot-labelbox>.label-box>.tray-settings-button:hover{background:color-mix(in srgb,currentColor 12%,transparent)}
.tray-settings-button:focus-visible{outline:2px solid var(--gramlot-focus-ring,Highlight);outline-offset:-2px}

 .gramlot-labelbox>.label-box>.tray-rotate{position:absolute;left:3px;top:50%;transform:translateY(-50%);display:grid;place-items:center;width:26px;height:26px;padding:4px;border:0;border-radius:4px;background:transparent;color:inherit;cursor:grab;touch-action:none;opacity:.7}
.tray-rotate svg{width:18px;height:18px;pointer-events:none}
.gramlot-labelbox>.label-box>.tray-rotate:hover{opacity:1;background:color-mix(in srgb,currentColor 12%,transparent)}
.tray-rotate:focus-visible{opacity:1;outline:2px solid var(--gramlot-focus-ring,Highlight);outline-offset:-2px}
.gramlot-labelbox[data-rotating]>.label-box>.tray-rotate{cursor:grabbing}
.gramlot-labelbox[data-moving]>.label-box{cursor:grabbing}
.gramlot-labelbox[data-resizable]>.control-box{overflow:auto}
.gramlot-labelbox>.tray-resize{position:absolute;right:1px;bottom:1px;width:22px;height:22px;padding:2px;display:grid;place-items:end;border:0;background:transparent;color:inherit;cursor:nwse-resize;touch-action:none;border-radius:3px;opacity:.65}
.gramlot-labelbox>.tray-resize[hidden]{display:none}
.gramlot-labelbox>.tray-resize svg{width:16px;height:16px;pointer-events:none}
.gramlot-labelbox>.tray-resize:hover,.gramlot-labelbox>.tray-resize:focus-visible{opacity:1}
.gramlot-labelbox>.tray-resize:focus-visible{outline:2px solid var(--gramlot-focus-ring,Highlight);outline-offset:-2px}`;

export function createLabelbox(document, controlBox) {
    const box = document.createElement('div'), labelBox = document.createElement('div');
    const fieldLabel = document.createElement('label');
    labelBox.append(fieldLabel); box.append(labelBox, controlBox);
    const layout = {box, labelBox, fieldLabel, controlBox, previous: {box:{},label:{},labelBox:{},controlBox:{}}};
    box.labelbox = layout;
    return layout;
}

export function projectLabelbox(layout, attrs, adapt) {
    const {lbl, lbl_variant, lbl_position = lbl_variant === 'card' ? 'TC' : 'TL', ...rest} = attrs;
    if (!labelboxPositions.includes(lbl_position)) throw new TypeError(`Invalid lbl_position: ${lbl_position}`);
    const groups = {box:{},label:{},labelBox:{},controlBox:{}};
    const prefixes = [['box_l_','labelBox'],['box_c_','controlBox'],['lbl_','label'],['box_','box']];
    for (const [name,value] of Object.entries(rest)) {
        const match = prefixes.find(([prefix]) => name.startsWith(prefix));
        if (match) { groups[match[1]][name.slice(match[0].length)] = value; delete rest[name]; }
    }
    const elements = {box:layout.box,label:layout.fieldLabel,labelBox:layout.labelBox,controlBox:layout.controlBox};
    for (const [name,element] of Object.entries(elements)) {
        const next = adapt(groups[name]), previous = layout.previous[name];
        for (const key of new Set([...Object.keys(previous),...Object.keys(next)])) {
            if (next[key] == null) element.removeAttribute(key);
            else element.setAttribute(key,String(next[key]));
        }
        layout.previous[name] = next;
    }
    if (attrs.lbl_width == null) layout.box.style.removeProperty('--gramlot-label-width');
    else layout.box.style.setProperty('--gramlot-label-width',attrs.lbl_width);
    layout.box.classList.add('labelbox','gramlot-labelbox');
    layout.labelBox.classList.add('label-box'); layout.controlBox.classList.add('control-box');
    layout.box.dataset.position = lbl_position;
    if (lbl_variant == null) delete layout.box.dataset.variant;
    else layout.box.dataset.variant = lbl_variant;
    layout.fieldLabel.textContent = lbl ?? '';
    layout.labelBox.hidden = lbl == null || lbl === '';
    layout.box.dispatchEvent(new layout.box.ownerDocument.defaultView.Event('gramlot-label-layout', {bubbles:true}));
    return rest;
}

/** Content identity behind an optional renderer-created Labelbox presentation. */
export function labelboxContent(presentation) {
    return presentation?.labelbox ? presentation.labelbox.controlBox.firstElementChild : presentation;
}

/** Layout surface of content; ordinary unwrapped DOM remains its own surface. */
export function labelboxPresentation(content) {
    const box = content?.parentElement?.parentElement;
    return box?.labelbox && labelboxContent(box) === content ? box : content;
}
