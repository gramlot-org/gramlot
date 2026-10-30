/** Experimental coordinator for bounded windows delivered by a PageStore. */
import {Bag} from '@gramlot/gramlot';
import {defineComponent} from '../components/registry.js';
import {Container} from '../components/container.js';

export const WindowSelection = defineComponent({
    name: 'windowSelection', tag: 'gramlot-window-selection', base: Container, sourceContext: true,
    parameters: {
        ready: {dtype: 'B', default: false, binding: 'read'},
        inbox: {dtype: 'X', nullable: true, default: null, binding: 'read'},
        limit: {dtype: 'T', binding: 'read'},
        seed: {dtype: 'T', default: '', binding: 'read'},
        sortedBy: {dtype: 'T', default: '', binding: 'read'},
        viewport: {dtype: 'X', nullable: true, default: null, binding: 'read'},
        reload: {dtype: 'L', default: 0, binding: 'read'},
        result: {dtype: 'X', nullable: true, default: null, binding: 'write'},
        metrics: {dtype: 'X', nullable: true, default: null, binding: 'write'},
        status: {dtype: 'T', default: '', binding: 'write'}
    },
    implementation: Base => class extends Base {
        #context;
        #key;
        #viewport;
        #last;
        #request;
        #timer;
        #changingSelection = false;
        #metrics = {};

        setSourceContext(context) { this.#context = context; }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            if (this.isConnected) this.#refresh();
            return rest;
        }
        connectedCallback() { this.#refresh(); }
        disconnectedCallback() {
            clearTimeout(this.#timer);
            this.#request = null;
            this.#key = null;
            this.#changingSelection = false;
        }
        #refresh() {
            if (!this.parameters.ready) return;
            const p = this.parameters;
            const key = JSON.stringify([p.limit, p.seed, p.sortedBy, p.reload]);
            if (key !== this.#key) {
                const previous = this.#key ? JSON.parse(this.#key) : null;
                this.#key = key;
                this.#viewport = JSON.stringify(p.viewport);
                this.#last = p.inbox;
                clearTimeout(this.#timer);
                this.#request = null;
                this.#changingSelection = true;
                const kind = !previous || previous[0] !== p.limit || previous[3] !== p.reload
                    ? 'open' : previous[1] !== p.seed ? 'search' : 'sort';
                this.#context.writeParameter('status', kind === 'search' ? 'Searching…' : 'Loading…');
                const started = performance.now();
                this.#timer = setTimeout(() => this.#send(0, 200, kind, started), kind === 'search' ? 200 : 0);
            } else if (JSON.stringify(p.viewport) !== this.#viewport) {
                this.#viewport = JSON.stringify(p.viewport);
                // A viewport from the previous selection cannot cancel a new search/sort.
                // The grid resets its scroll when the new revision arrives.
                if (p.viewport && !this.#changingSelection) {
                    clearTimeout(this.#timer);
                    this.#timer = setTimeout(() => this.#send(p.viewport.start, p.viewport.count, 'scroll', performance.now()), 0);
                }
            }
            const frame = p.inbox;
            if (!frame || frame === this.#last) return;
            this.#last = frame;
            const request = this.#request;
            if (!request || frame.getItem('request_id') !== request.id) return;
            this.#request = null;
            this.#changingSelection = false;
            if (frame.getItem('error')) {
                this.#context.writeParameter('status', `Failed: ${frame.getItem('error')}`);
                return;
            }
            const source = frame.getItem('rows'), info = frame.getItem('window');
            if (!(source instanceof Bag) || !(info instanceof Bag)
                    || !Number.isSafeInteger(info.getItem('start')) || info.getItem('start') < 0
                    || !Number.isSafeInteger(info.getItem('total'))
                    || info.getItem('total') < info.getItem('start') + source.length
                    || source.length > Math.max(1000, frame.getItem('threshold'))) {
                this.#context.writeParameter('status', 'Failed: invalid window response');
                return;
            }
            // Copy the small response; never reparent the dataBinder's Bag nodes.
            const rows = new Bag();
            for (const node of source.getNodes()) rows.setItem(node.label, null, {...node.attr});
            const elapsed = performance.now() - request.started;
            if (request.kind === 'open') this.#metrics = {first_ms: elapsed};
            else this.#metrics[request.kind === 'scroll' ? 'scroll_ms' : `${request.kind}_total_ms`] = elapsed;
            for (const field of ['materialize_ms', 'count_ms', 'window_ms', 'search_ms', 'sort_ms']) {
                this.#metrics[field] = frame.getItem(field);
            }
            const window = new Bag(Object.fromEntries(['start', 'total', 'revision', 'sortedBy'].map(key => [key, info.getItem(key)])));
            this.#context.writeParameter('result', new Bag({rows, window, count: info.getItem('total'),
                resident: rows.length, mode: frame.getItem('mode'), threshold: frame.getItem('threshold')}));
            this.#context.writeParameter('metrics', new Bag(this.#metrics));
            this.#context.writeParameter('status', 'Loaded');
        }
        #send(start, count, kind, started) {
            if (!this.isConnected) return;
            const id = crypto.randomUUID();
            this.#request = {id, kind, started};
            this.#context.writeParameter('status', kind === 'scroll' ? 'Loading window…' : 'Loading…');
            const p = this.parameters, gramlot = this.#context.sourceNode.rootBuilder.binding.gramlot;
            const failed = error => {
                if (this.isConnected && this.#request?.id === id) {
                    this.#changingSelection = false;
                    this.#context.writeParameter('status', `Failed: ${error.message}`);
                }
            };
            try {
                Promise.resolve(gramlot.publish({topic: 'selection_request', server: true}, {
                    request_id: id, limit: p.limit, seed: p.seed, sorted_by: p.sortedBy,
                    start, count, refresh: kind === 'open'
                })).catch(failed);
            } catch (error) { failed(error); }
        }
    }
});
