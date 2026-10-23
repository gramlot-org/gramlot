/* @ts-self-types="./gramlot.d.ts" */
/**
 * One Gramlot page in the browser.
 *
 * @module
 */
import {CommandRegistry} from './commands.js';
import {ServerAdapter} from './server-adapter.js';
import {NAME_SYNTAX, NameSyntax} from './builder/name-syntax.js';
import {SourceHandler} from './handlers/source-handler.js';
import {RpcHandler} from './handlers/rpc-handler.js';
import {DomHandler} from './handlers/dom-handler.js';
import {SubscriptionsHandler} from './handlers/subscriptions-handler.js';
import {UtilitiesHandler} from './handlers/utilities-handler.js';
import buttons from './components/buttons.js';
import {ComponentCollection} from './components/registry.js';
import {formatValue} from './format.js';

/**
 * One Gramlot page: lifecycle, Data and the four proxies `src`, `rpc`, `dom`, `utl`.
 * `SourceHandler` creates the builder, the binding runtime and the renderer in the order of source plan §4.3.
 * `serverAdapter` is the server-dependent behaviour the core consults (the transport); `nameSyntax` is the
 * name syntax the server declared in the bootstrap, `{kind: 'regex', pattern, flags}`, null for the core default.
 */
export class Gramlot {
    constructor({pageId, rpcUrl = '/gramlot/rpc', closeUrl = '/gramlot/close', rootId = 'gramlot-root', capabilities = [],
                 element = null, document = element?.ownerDocument ?? globalThis.document, transport = null, collections = [],
                 locale = null, timeZone = null, devices = [], serverAdapter = new ServerAdapter(), nameSyntax = null} = {}) {
        buttons.register(document.defaultView);
        for (const collection of collections) {
            if (collection instanceof ComponentCollection) collection.register(document.defaultView);
        }
        this.commands = new CommandRegistry();
        this.pageId = pageId;
        const browserContext = locale == null || timeZone == null
            ? document.defaultView.Intl.DateTimeFormat().resolvedOptions() : null;
        this.devices = Object.freeze([...devices]);
        this.locale = locale ?? browserContext.locale;
        this.timeZone = timeZone ?? browserContext.timeZone;
        Object.defineProperty(this, '_subscriptions', {value: new SubscriptionsHandler(this)});
        this.capabilities = Object.freeze([...capabilities]);
        this.serverAdapter = serverAdapter;
        this.src = new SourceHandler(this, {collections, destination: element ?? document.getElementById(rootId),
            subscriptions: this._subscriptions, nameSyntax: nameSyntax === null ? NAME_SYNTAX : NameSyntax.fromJSON(nameSyntax)});
        this.data = this.src.builder.data;
        this.rpc = new RpcHandler(this, {rpcUrl, closeUrl, document, transport});
        this.dom = new DomHandler(this);
        this.utl = new UtilitiesHandler(this, document);
        this.state = 'ready';
        this._subscriptions.attach(document);
        this.abort = new AbortController();
        // A page with a transport closes its server page when the browser leaves it (a beacon over HTTP).
        if (this.rpc.transport) {
            this.pagehide = event => { if (!event.persisted) this.dispose({beacon: true}); };
            document.defaultView.addEventListener('pagehide', this.pagehide);
            this.window = document.defaultView;
        }
    }
    publish(topic, payload = {}) { return this._subscriptions.publish(topic, payload); }
    subscribe(topic, callback) { return this._subscriptions.subscribe(topic, callback); }
    unsubscribe(registration) { this._subscriptions.unsubscribe(registration); }
    format(value, options) { return formatValue(value, options, {locale: this.locale, timeZone: this.timeZone}); }

    start() {
        if (this.state === 'disposed') return Promise.reject(new Error('Gramlot is disposed'));
        if (!this.rpc.transport) return Promise.reject(new Error('This Gramlot instance has no server transport'));
        if (this.loading) return this.loading;
        if (this.state === 'started') return Promise.resolve(this);
        this.state = 'loading';
        this.loading = this.loadMain().finally(() => { this.loading = null; });
        return this.loading;
    }
    async loadMain() {
        let wire;
        try {
            wire = await this.rpc.call('source', 'main');
        } catch (error) {
            // The dispose aborts the call at once (RpcHandler.call): the start rejects naming the dispose.
            if (this.state === 'disposed') throw new Error('Gramlot was disposed during main', {cause: error});
            this.state = 'failed';
            throw error;
        }
        if (this.state === 'disposed') throw new Error('Gramlot was disposed during main');
        try {
            return this.src.mountMainSource(wire);
        } catch (error) {
            if (this.state !== 'disposed') this.state = 'failed';
            throw error;
        }
    }
    dispose({beacon = false} = {}) {
        if (this.state === 'disposed') return;
        this.state = 'disposed';
        this._subscriptions.dispose();
        if (this.pagehide) this.window.removeEventListener('pagehide', this.pagehide);
        // Every call in flight is aborted: RpcHandler.call follows this signal.
        this.abort.abort();
        try {
            try { this.src.binding.dispose(); }
            finally { this.src.renderer.dispose(); }
        } finally {
            if (this.rpc.transport) {
                this.rpc.transport.close(this.pageId, {beacon});
                this.rpc.transport.dispose();
            }
        }
    }
}
