import {defineComponent} from './registry.js';
import {Container} from './container.js';
import {gridSearch, searchColumns} from './grid-search.js';
import {SVG_NS} from '../renderer/attributes.js';
import {positionPopup} from './popup.js';
import {gridSearchStyles} from './grid-search-styles.js';

/** FrameGrid's search slot. The collection view owns the accepted filter. */
export const SearchBox = defineComponent({
    name:'searchBox', tag:'gramlot-search-box', base:Container, sourceContext:true,
    parameters:{searchOn:{dtype:['B','T'], default:true, binding:'read'}},
    implementation:Base => class extends Base {
        #context; #grid; #release; #releaseView; #view; #timer = null;
        #field; #input; #error; #helpText; #filterSignature; #bag;
        constructor() {
            super();
            const doc = this.ownerDocument;
            const style = doc.createElement('style');
            style.textContent = gridSearchStyles;
            const icon = path => {
                const svg = doc.createElementNS(SVG_NS,'svg'); svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('aria-hidden','true');
                const shape = doc.createElementNS(SVG_NS,'path'); shape.setAttribute('d',path); svg.append(shape); return svg;
            };
            this.#field = doc.createElement('select'); this.#field.setAttribute('aria-label','Search column');
            this.#input = doc.createElement('input'); this.#input.type = 'text'; this.#input.setAttribute('role','searchbox'); this.#input.setAttribute('aria-label','Filter rows');
            this.#input.setAttribute('aria-describedby','search-error');
            this.#input.placeholder = ' ';
            const clear = doc.createElement('button'); clear.type = 'button'; clear.title = 'Clear filter'; clear.setAttribute('aria-label','Clear filter'); clear.append(icon('M6 6L18 18M18 6L6 18'));
            this.#error = doc.createElement('span'); this.#error.id = 'search-error'; this.#error.className = 'error'; this.#error.setAttribute('role','alert');
            const choice = doc.createElement('span'); choice.className = 'column-choice';
            choice.append(this.#field,icon('M7 10L12 15L17 10'));
            const entry = doc.createElement('span'); entry.className = 'search-entry';
            const lens = icon('M21 21L16 16M18 10A8 8 0 1 1 2 10A8 8 0 0 1 18 10'); lens.classList.add('search-lens');
            clear.className = 'clear';
            const info = doc.createElement('button'); info.type = 'button'; info.className = 'info';
            info.setAttribute('aria-label','Search instructions'); info.title = 'Search instructions';
            info.setAttribute('aria-haspopup','dialog'); info.setAttribute('aria-expanded','false'); info.setAttribute('aria-controls','search-help');
            info.append(icon('M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12M12 11V17M12 7V7.1'));
            const help = doc.createElement('div'); help.id = 'search-help'; help.className = 'search-help';
            help.setAttribute('popover','auto'); help.setAttribute('role','dialog'); help.setAttribute('aria-label','Search instructions');
            const heading = doc.createElement('strong'); heading.textContent = 'Search instructions';
            this.#helpText = doc.createElement('p');
            const common = doc.createElement('p'); common.textContent = 'Clear with × or Escape. Changing column clears the query. An incomplete expression keeps the last valid result.';
            help.append(heading,this.#helpText,common); this.shadowRoot.append(help);
            info.addEventListener('click', () => {
                if (help.matches(':popover-open')) help.hidePopover();
                else {help.showPopover(); positionPopup(help,info,{align:'end'});}
            });
            help.addEventListener('toggle', () => info.setAttribute('aria-expanded',String(help.matches(':popover-open'))));
            entry.append(lens,this.#input,clear,info);
            this.control.replaceChildren(choice,entry,this.#error);
            this.shadowRoot.append(style);
            this.#input.addEventListener('input', () => {
                this.#cancel(); this.#timer = doc.defaultView.setTimeout(() => { this.#timer = null; this.#apply(); },100);
            });
            this.#input.addEventListener('keydown', event => {
                if (event.isComposing) return;
                if (event.key === 'Enter') { event.preventDefault(); this.#cancel(); this.#apply(); }
                if (event.key === 'Escape') { event.preventDefault(); this.#clear(); }
            });
            this.#field.addEventListener('change', () => this.#clear());
            clear.addEventListener('click', () => {this.#clear(); this.#input.focus();});
        }
        setSourceContext(context) {
            this.#context = context;
            const target = context.frameRecipient();
            if (target?.nodeTag !== 'grid') throw new TypeError('searchBox requires a FrameGrid target');
            this.#grid = gridSearch(target);
        }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            if (this.isConnected) this.#configure();
            return rest;
        }
        connectedCallback() {
            this.#release = this.#grid.subscribe(() => this.#configure());
            this.#configure();
        }
        disconnectedCallback() {
            this.#cancel(); this.#release?.(); this.#releaseView?.(); this.#release = this.#releaseView = null;
        }
        #cancel() { if (this.#timer !== null) this.ownerDocument.defaultView.clearTimeout(this.#timer); this.#timer = null; }
        #configure() {
            try { this.#update(); }
            catch (error) { this.#input.disabled = true; this.#error.textContent = error.message; }
        }
        #update() {
            if (!this.#grid.view) return;
            if (this.#view !== this.#grid.view || this.#bag !== this.#grid.view.bag || !this.#releaseView) {
                this.#cancel(); this.#releaseView?.(); this.#view = this.#grid.view; this.#bag = this.#view.bag;
                this.#filterSignature = undefined;
                this.#releaseView = this.#view.subscribe(() => this.#sync());
            }
            const previous = this.#field.value;
            const options = searchColumns(this.parameters.searchOn,this.#grid.columns);
            this.#field.replaceChildren(...options.map(({field,name}) => {
                const option = this.ownerDocument.createElement('option'); option.value = field; option.textContent = name; return option;
            }));
            if (options.some(option => option.field === previous)) this.#field.value = previous;
            this.#input.disabled = !options.length;
            this.#sync(); this.#hint();
        }
        #sync() {
            const filter = this.#view.filter;
            // Uncommitted drafts (including errors) survive unrelated row notifications.
            const signature = JSON.stringify(filter);
            if (this.#filterSignature === signature) return;
            this.#filterSignature = signature;
            this.#cancel(); this.#input.value = filter?.value ?? '';
            if (filter) this.#field.value = filter.columns.join('+');
            this.#error.textContent = ''; this.#input.removeAttribute('aria-invalid'); this.#hint();
        }
        #dtype() {
            const column = this.#grid.columns.find(column => column.field === this.#field.value);
            return ['L','R','N','D'].includes(column?.dtype) ? column.dtype : 'T';
        }
        #hint() {
            const dtype = this.#dtype();
            this.#helpText.textContent = dtype === 'T'
                ? 'Type a word to find it anywhere. Text is case-insensitive. You can also use expressions: lamp|desk matches either word; ^lamp matches the start.'
                : dtype === 'D'
                    ? 'Compare dates: = 2026-10-15, >= 2026-10-15 or < 2026-10-15. ISO dates and your browser’s local date notation are accepted.'
                    : 'Compare numbers: = 12, > 100, <= 50 or ! 0 (not equal). Decimal punctuation follows your browser locale.';
        }
        #clear() { this.#cancel(); this.#input.value = ''; this.#apply(); this.#hint(); }
        #apply() {
            if (!this.#view) return;
            try {
                const value = this.#input.value;
                this.#view.applyFilter(value.trim() ? {value, columns:this.#field.value.split('+'), dtype:this.#dtype(),
                    locale:this.#context.locale,
                    timeZone:this.#context.timeZone} : null);
                this.#error.textContent = ''; this.#input.removeAttribute('aria-invalid');
            } catch (error) {
                this.#error.textContent = error.message; this.#input.setAttribute('aria-invalid','true');
            }
        }
    }
});
