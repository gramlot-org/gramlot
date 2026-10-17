/** One stable label/control composition for single controls and groups. */
const POSITIONS = ['TL', 'TC', 'TR', 'L', 'R', 'BL', 'BC', 'BR'];
function project(element, attrs, adapt, previous) {
    const next = adapt(attrs);
    for (const key of new Set([...Object.keys(previous), ...Object.keys(next)])) {
        if (next[key] == null) element.removeAttribute(key);
        else element.setAttribute(key, String(next[key]));
    }
    return next;
}
export function Labelbox(Base) {
    return class extends Base {
        #previous = {box: {}, label: {}, labelBox: {}, controlBox: {}};
        constructor() {
            super();
            this.box = this.ownerDocument.createElement('div');
            this.box.className = 'labelbox';
            this.labelBox = this.ownerDocument.createElement('div');
            this.labelBox.className = 'label-box';
            this.fieldLabel = this.ownerDocument.createElement('label');
            this.fieldLabel.id = 'field-label';
            this.fieldLabel.htmlFor = 'control';
            this.labelBox.append(this.fieldLabel);
            this.box.append(this.labelBox, this.controlBox);
            const style = this.ownerDocument.createElement('style');
            style.textContent = `.labelbox{--gramlot-label-width:initial;--gramlot-formlet-label-width:initial;display:grid;gap:var(--gramlot-label-gap,.25em);grid-template-areas:'label' 'control'}
                .label-box{grid-area:label;color:var(--gramlot-label-color,var(--gramlot-text-secondary,inherit));font-size:var(--gramlot-label-size,1em)} .control-box{grid-area:control}
                .labelbox[data-position='L']{grid-template-areas:'label control';align-items:center}
                .labelbox[data-position='R']{grid-template-areas:'control label';align-items:center}
                .labelbox[data-position^='B']{grid-template-areas:'control' 'label'}
                .labelbox[data-position$='C']>.label-box{text-align:center}
                .labelbox[data-position$='R']>.label-box{text-align:right}
                .label-box[hidden]{display:none} .label-box label{display:block}
                .labelbox[data-position='L']>.label-box{text-align:right;padding-right:2px}
                .labelbox[data-formlet-aligned]>.label-box>label{width:max-content;margin-left:auto}
                .labelbox[data-position='L']{grid-template-columns:var(--gramlot-label-width,var(--gramlot-formlet-label-width,max-content)) minmax(0,1fr)}`;
            this.shadowRoot.append(style, this.box);
        }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            const {lbl, lbl_position = 'TL'} = this.parameters;
            if (!POSITIONS.includes(lbl_position)) throw new TypeError(`Invalid lbl_position: ${lbl_position}`);
            const groups = {box: {}, label: {}, labelBox: {}, controlBox: {}};
            const prefixes = [['box_l_', 'labelBox'], ['box_c_', 'controlBox'], ['lbl_', 'label'], ['box_', 'box']];
            for (const [name, value] of Object.entries(rest)) {
                const match = prefixes.find(([prefix]) => name.startsWith(prefix));
                if (match) { groups[match[1]][name.slice(match[0].length)] = value; delete rest[name]; }
            }
            const elements = {box: this.box, label: this.fieldLabel, labelBox: this.labelBox, controlBox: this.controlBox};
            for (const [name, element] of Object.entries(elements)) {
                this.#previous[name] = project(element, groups[name], adapt, this.#previous[name]);
            }
            if (attrs.lbl_width == null) this.box.style.removeProperty('--gramlot-label-width');
            else this.box.style.setProperty('--gramlot-label-width', attrs.lbl_width);
            this.box.classList.add('labelbox');
            this.labelBox.classList.add('label-box');
            this.controlBox.classList.add('control-box');
            this.box.dataset.position = lbl_position;
            this.fieldLabel.textContent = lbl ?? '';
            this.labelBox.hidden = lbl == null || lbl === '';
            // Native label association applies to input; a group uses aria-labelledby.
            if (this.control.localName !== 'input') {
                if (this.labelBox.hidden) this.control.removeAttribute('aria-labelledby');
                else this.control.setAttribute('aria-labelledby', 'field-label');
            }
            this.dispatchEvent(new this.ownerDocument.defaultView.Event('gramlot-label-layout', {bubbles:true}));
            return rest;
        }
    };
}
Labelbox.parameters = {
    lbl: {dtype: 'T', qualification: 'intl_str', nullable: true, binding: 'read'},
    lbl_position: {dtype: 'T', default: 'TL', binding: 'read', enum: POSITIONS}
};
