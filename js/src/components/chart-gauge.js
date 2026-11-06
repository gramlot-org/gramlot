import * as echarts from 'echarts/dist/echarts.js';
import {defineComponent} from './registry.js';
import {Container} from './container.js';
import {gaugeOption, gaugeValue, parseThresholds} from './chart-gauge-options.js';

const LIGHT = {accent: '#235db2', ink: '#202936', muted: '#526174', track: '#e9edf2'};
const DARK = {accent: '#6ea8fe', ink: '#e8edf3', muted: '#a3b0c0', track: '#3a4554'};

/** One value on a dial, a ring or an arc. The node value is the value; it never writes Data. */
export const Gauge = defineComponent({
    name: 'gauge', tag: 'gramlot-gauge', base: Container,
    parameters: {
        min: {dtype: 'R', default: 0, binding: 'read'}, max: {dtype: 'R', default: 100, binding: 'read'},
        mask: {dtype: 'T', default: '{}', binding: 'read'}, thresholds: {dtype: 'T', default: '', nullable: true, binding: 'read'},
        presentation: {dtype: 'T', default: 'needle', binding: 'read'}, caption: {dtype: 'T', default: '', nullable: true, binding: 'read'}
    },
    implementation: Base => class extends Base {
        #chart; #surface; #message; #resize; #text; #theme; #dark; #active = false;
        constructor() {
            super();
            const doc = this.ownerDocument;
            this.control.replaceChildren();
            const style = doc.createElement('style');
            style.textContent = ':host{height:100%;min-height:160px}.control-box{height:100%;min-height:160px;overflow:hidden}';
            this.shadowRoot.append(style);
            this.#message = doc.createElement('div');
            this.#message.setAttribute('role', 'alert'); this.#message.hidden = true;
            this.#message.style.cssText = 'padding:12px;white-space:normal';
            this.#surface = doc.createElement('div');
            this.#surface.style.cssText = 'width:100%;height:100%;min-height:160px';
            this.control.append(this.#message, this.#surface);
            const view = doc.defaultView;
            this.#resize = new view.ResizeObserver(() => this.#chart?.resize());
            this.#text = new view.MutationObserver(() => this.#render());
            this.#theme = new view.MutationObserver(() => this.#render());
            this.#dark = view.matchMedia('(prefers-color-scheme: dark)');
        }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            if (this.#active) this.#render();
            return rest;
        }
        connectedCallback() {
            this.#active = true;
            this.#chart = echarts.init(this.#surface, null, {renderer: 'svg'});
            // The node text is where the renderer writes the resolved node value.
            this.#text.observe(this, {childList: true, subtree: true, characterData: true});
            this.#theme.observe(this.ownerDocument.documentElement, {attributes: true, attributeFilter: ['data-theme', 'class']});
            this.#dark.addEventListener('change', this.#onTheme);
            this.#resize.observe(this.#surface);
            this.#render();
        }
        #onTheme = () => this.#render();
        #palette() {
            const dark = this.#isDark();
            const base = dark ? DARK : LIGHT;
            const style = this.ownerDocument.defaultView.getComputedStyle(this);
            const read = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
            return {accent: read('--gramlot-brand-blue', base.accent), ink: read('--gramlot-ink', base.ink),
                muted: read('--gramlot-text-secondary', base.muted), track: read('--gramlot-surface-subtle', base.track)};
        }
        #isDark() {
            const theme = this.ownerDocument.documentElement.getAttribute('data-theme');
            return theme ? theme === 'dark' : this.#dark.matches;
        }
        #render() {
            if (!this.#chart) return;
            try {
                const {min, max, mask, thresholds, presentation, caption} = this.parameters;
                const option = gaugeOption({value: gaugeValue(this.textContent), min, max, mask,
                    thresholds: parseThresholds(thresholds), presentation, caption, palette: this.#palette()});
                this.#message.hidden = true; this.#surface.hidden = false;
                this.#chart.setOption(option, {replaceMerge: ['series']});
            } catch (error) {
                this.#surface.hidden = true;
                this.#message.textContent = error.message; this.#message.hidden = false;
            }
        }
        disconnectedCallback() {
            this.#active = false;
            this.#text.disconnect(); this.#theme.disconnect(); this.#resize.disconnect();
            this.#dark.removeEventListener('change', this.#onTheme);
            this.#chart?.dispose(); this.#chart = null;
        }
    }
});
