import {Bag} from '@genrojs/bag';
import {defineComponent} from './registry.js';
import {Container} from './container.js';
import {SVG_NS} from '../renderer/attributes.js';
import {positionPopup} from './popup.js';
import {editingStatusStyles} from './editing-status-styles.js';

/** Presentation of the nearest shared session. Registers and validation stay in EditingSession. */
export const EditingStatus = defineComponent({
    name:'editingStatus', tag:'gramlot-editing-status', base:Container, sourceContext:true,
    parameters:{},
    implementation:Base => class extends Base {
        #session; #release; #buttons = new Map(); #popup; #title; #list; #notice; #kind;
        constructor() {
            super();
            const doc = this.ownerDocument;
            const style = doc.createElement('style'); style.textContent = editingStatusStyles;
            this.shadowRoot.append(style);
            this.control.replaceChildren();
            this.control.setAttribute('role','group'); this.control.setAttribute('aria-label','Editing reports');
            for (const [kind,caption,path] of [
                ['errors','Errors','M12 3L22 21H2ZM12 9V14M12 17V17.1'],
                ['changes','Changes','M4 5H14M4 10H10M4 15H8M13 20L20 13L17 10L10 17L9 21Z']
            ]) {
                const button = doc.createElement('button'); button.type = 'button'; button.dataset.kind = kind;
                button.setAttribute('aria-haspopup','dialog'); button.setAttribute('aria-expanded','false'); button.setAttribute('aria-controls','editing-report');
                const svg = doc.createElementNS(SVG_NS,'svg'); svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('aria-hidden','true');
                const shape = doc.createElementNS(SVG_NS,'path'); shape.setAttribute('d',path); svg.append(shape);
                const label = doc.createElement('span'); label.textContent = caption;
                const count = doc.createElement('span'); count.className = 'count'; count.textContent = '0';
                button.append(svg,label,count); this.control.append(button);
                this.#buttons.set(kind,{button,count});
                button.addEventListener('click',() => {
                    const open = this.#popup.matches(':popover-open');
                    if (open && this.#kind === kind) { this.#popup.hidePopover(); return; }
                    this.#kind = kind; this.#renderList();
                    if (!open) this.#popup.showPopover();
                    this.#expanded(); positionPopup(this.#popup,button,{align:'end'});
                });
            }
            this.#popup = doc.createElement('section'); this.#popup.id = 'editing-report';
            this.#popup.className = 'report'; this.#popup.setAttribute('popover','auto');
            this.#popup.setAttribute('role','dialog'); this.#popup.setAttribute('aria-labelledby','report-title');
            const heading = doc.createElement('header');
            this.#title = doc.createElement('strong'); this.#title.id = 'report-title';
            const close = doc.createElement('button'); close.type = 'button'; close.textContent = '×'; close.setAttribute('aria-label','Close report');
            close.addEventListener('click',() => this.#popup.hidePopover()); heading.append(this.#title,close);
            this.#list = doc.createElement('ul');
            this.#notice = doc.createElement('p'); this.#notice.className = 'notice'; this.#notice.setAttribute('role','status');
            this.#popup.append(heading,this.#list,this.#notice); this.shadowRoot.append(this.#popup);
            this.#popup.addEventListener('toggle',() => this.#expanded());
        }
        setSourceContext(context) {
            this.#release?.(); this.#release = null;
            this.#session = context.sourceNode.formState;
            if (!this.#session) throw new Error('editingStatus requires a shared editing session.');
            this.#connect();
        }
        connectedCallback() { this.#connect(); }
        disconnectedCallback() {
            this.#release?.(); this.#release = null;
            if (this.#popup.matches(':popover-open')) this.#popup.hidePopover();
        }
        #connect() {
            if (!this.#session || this.#release || !this.isConnected) return;
            this.#release = this.#session.subscribe(() => this.#refresh()); this.#refresh();
        }
        #expanded() {
            const open = this.#popup.matches(':popover-open');
            for (const [kind,{button}] of this.#buttons) button.setAttribute('aria-expanded',String(open && kind === this.#kind));
        }
        #refresh() {
            this.#buttons.get('errors').count.textContent = String(this.#session.errorEntries.length);
            this.#buttons.get('changes').count.textContent = String(this.#session.changeEntries.length);
            this.#buttons.get('errors').button.classList.toggle('invalid',this.#session.errorEntries.length > 0);
            if (this.#popup.matches(':popover-open')) this.#renderList();
        }
        #value(value,exists) {
            if (!exists) return 'Not present';
            if (value == null) return '∅';
            if (value instanceof Bag) return `${value.length} fields`;
            if (value instanceof Date) return value.toLocaleString();
            return String(value);
        }
        #renderList() {
            const errors = this.#kind === 'errors';
            const entries = errors ? this.#session.errorEntries : this.#session.changeEntries;
            this.#title.textContent = errors ? 'Validation errors' : 'Unsaved changes';
            this.#notice.textContent = entries.length ? 'Select an entry to return to its field.' : (errors ? 'No validation errors.' : 'No changes since the accepted snapshot.');
            // Preserve list focus when asynchronous validation updates another entry.
            const focusedPath = this.shadowRoot.activeElement?.dataset.path;
            this.#list.replaceChildren();
            for (const entry of entries) {
                const doc = this.ownerDocument, item = doc.createElement('li'), button = doc.createElement('button');
                button.type = 'button'; button.dataset.path = entry.path;
                const field = doc.createElement('span'); field.className = 'field';
                field.textContent = entry.path.slice(this.#session.path ? this.#session.path.length+1 : 0);
                const detail = doc.createElement('span'); detail.className = 'detail';
                if (errors) detail.textContent = entry.message;
                else {
                    const before = doc.createElement('span'); before.className = 'previous'; before.textContent = this.#value(entry.previous,entry.existed);
                    const arrow = doc.createElement('span'); arrow.className = 'arrow'; arrow.textContent = '→';
                    const after = doc.createElement('span'); after.className = 'current'; after.textContent = this.#value(entry.current,entry.exists);
                    detail.append(before,arrow,after);
                }
                button.append(field,detail); item.append(button); this.#list.append(item);
                button.addEventListener('click',() => {
                    if (this.#session.focusField(entry.path)) this.#popup.hidePopover();
                    else this.#notice.textContent = 'This field is not visible. Check the grid filter or whether the row still exists.';
                });
                if (entry.path === focusedPath) button.focus({preventScroll:true});
            }
        }
    }
});
