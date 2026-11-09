import {loadLibrary} from '../libraries.js';
import {defineComponent} from './registry.js';
import {projectParameters} from './parameters.js';

/**
 * The frames of a terminal session (#87), the same as `gramlot.server.terminal`: one binary WebSocket message,
 * first byte the channel. `INPUT` (0) carries the keys, `OUTPUT` (1) the bytes to write, `RESIZE` (4) the JSON
 * `{"Width": columns, "Height": rows}` of the Kubernetes exec protocol (1 to 65535), `ACK` (5) a 32-bit big-endian count of
 * output bytes the terminal has written. The server stops sending output while 1 MB is unacknowledged.
 */
export const INPUT = 0, OUTPUT = 1, RESIZE = 4, ACK = 5;

function frame(channel, payload) {
    const bytes = new Uint8Array(payload.length + 1);
    bytes[0] = channel; bytes.set(payload, 1);
    return bytes;
}

export function inputFrame(text) { return frame(INPUT, new TextEncoder().encode(text)); }
export function binaryInputFrame(text) { return frame(INPUT, Uint8Array.from(text, character => character.charCodeAt(0) & 255)); }
export function resizeFrame(rows, columns) {
    for (const value of [rows, columns]) if (!Number.isInteger(value) || value < 1 || value > 65535) throw new RangeError('A terminal size is 1 to 65535');
    return frame(RESIZE, new TextEncoder().encode(JSON.stringify({Width: columns, Height: rows}))); }
export function ackFrame(count) {
    if (!Number.isInteger(count) || count < 0 || count > 0xffffffff) throw new RangeError('An acknowledgement counts 0 to 2^32-1 bytes');
    const payload = new Uint8Array(4); new DataView(payload.buffer).setUint32(0, count);
    return frame(ACK, payload);
}

/** The output bytes of a server frame; a frame on another channel is an error. */
export function outputPayload(data) {
    const bytes = new Uint8Array(data);
    if (bytes.length === 0 || bytes[0] !== OUTPUT) throw new Error(`Unexpected terminal frame on channel ${bytes[0]}`);
    return bytes.subarray(1);
}

let engineModules;

/**
 * xterm.js, its fit addon and its style for a terminal of `document`, loaded once on first use. Resolves with
 * `{Terminal, FitAddon, style}`.
 */
export function loadTerminalEngine(document) {
    return engineModules ??= Promise.all([
        loadLibrary('xterm', document, () => import('@xterm/xterm/lib/xterm.mjs')),
        loadLibrary('xtermFit', document, () => import('@xterm/addon-fit/lib/addon-fit.mjs')),
        loadLibrary('xtermStyle', document, () => import('@xterm/xterm/css/xterm.css')),
    ]).then(([xterm, fit, style]) => ({Terminal: xterm.Terminal, FitAddon: fit.FitAddon, style}));
}

function TerminalElement(HTMLElement) {
    return class extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({mode: 'open'});
            this.engineStyle = this.ownerDocument.createElement('style');
            const style = this.ownerDocument.createElement('style');
            style.textContent = `:host{display:block;height:300px;min-height:0;min-width:0}
                .terminal-control{height:100%;min-height:0;padding:4px;background:#000;box-sizing:border-box}
                .terminal-status{padding:1em;color:var(--gramlot-text-secondary,GrayText)}`;
            this.control = this.ownerDocument.createElement('div');
            this.control.className = 'terminal-control';
            shadow.append(this.engineStyle, style, this.control);
        }
        projectAttributes(attrs) { return projectParameters(this, attrs); }
    };
}

export const Terminal = defineComponent({name: 'terminal', tag: 'gramlot-terminal', base: TerminalElement, sourceContext: true,
    doc: 'An interactive terminal connected to the @terminal method `session` of the page store.',
    parameters: {session: {dtype: 'T', default: '', binding: 'read'},
        fontSize: {dtype: 'L', default: 14, binding: 'read'}, fontFamily: {dtype: 'T', default: 'monospace', binding: 'read'},
        connected: {dtype: 'B', default: false, binding: 'write'},
        rows: {dtype: 'L', default: 0, binding: 'write'}, columns: {dtype: 'L', default: 0, binding: 'write'}},
    implementation: Base => class extends Base {
        #context; #generation = 0; #session = null; #socket = null; #terminal = null; #fit = null; #observer = null;
        setSourceContext(context) { this.#context = context; }
        connectedCallback() { this.#start(); }
        disconnectedCallback() { this.#stop(); }
        projectAttributes(attrs) {
            const rest = super.projectAttributes(attrs), p = this.parameters;
            if (typeof p.session !== 'string' || !p.session) throw new TypeError('terminal requires a session name');
            if (!Number.isInteger(p.fontSize) || p.fontSize < 8 || p.fontSize > 48) throw new TypeError('fontSize must be from 8 to 48');
            if (this.#terminal) {
                this.#terminal.options.fontSize = p.fontSize; this.#terminal.options.fontFamily = p.fontFamily;
                this.#fit.fit();
            }
            if (this.isConnected && this.#session !== null && this.#session !== p.session) { this.#stop(); this.#start(); }
            return rest;
        }
        /** Send keys to the session as if typed. */
        input(text) { this.#send(inputFrame(text)); }
        focus() { this.#terminal?.focus(); }
        #write(name, value) { if (this.#context) this.#context.writeParameter(name, value); }
        #send(bytes) { if (this.#socket?.readyState === 1) this.#socket.send(bytes); }
        #start() {
            const generation = ++this.#generation, document = this.ownerDocument;
            this.#session = this.parameters.session;
            this.control.textContent = 'Loading terminal…'; this.control.classList.add('terminal-status');
            this.ready = loadTerminalEngine(document).then(({Terminal, FitAddon, style}) => {
                if (generation !== this.#generation || !this.isConnected) return;
                this.control.textContent = ''; this.control.classList.remove('terminal-status');
                this.engineStyle.textContent = style;
                const p = this.parameters;
                const terminal = this.#terminal = new Terminal({fontSize: p.fontSize, fontFamily: p.fontFamily, convertEol: false});
                const fit = this.#fit = new FitAddon();
                terminal.loadAddon(fit);
                terminal.open(this.control);
                const socket = this.#socket = new document.defaultView.WebSocket(this.#context.terminalUrl(this.#session));
                socket.binaryType = 'arraybuffer';
                terminal.onData(text => this.#send(inputFrame(text)));
                terminal.onBinary(text => this.#send(binaryInputFrame(text)));
                terminal.onResize(({rows, cols}) => {
                    this.#send(resizeFrame(rows, cols));
                    this.#write('rows', rows); this.#write('columns', cols);
                });
                socket.addEventListener('open', () => {
                    if (generation !== this.#generation) return;
                    this.#write('connected', true);
                    this.#send(resizeFrame(terminal.rows, terminal.cols));
                    this.#write('rows', terminal.rows); this.#write('columns', terminal.cols);
                });
                socket.addEventListener('message', event => {
                    if (generation !== this.#generation) return;
                    let payload;
                    try { payload = outputPayload(event.data); }
                    catch (error) {
                        // A frame the terminal cannot read ends the session, as on the server side.
                        socket.close();
                        this.#context ? this.#context.reportError(error, 'Terminal') : console.error(error);
                        return;
                    }
                    // The acknowledgement follows xterm's parsing: a slow screen slows the server.
                    terminal.write(payload, () => this.#send(ackFrame(payload.length)));
                });
                socket.addEventListener('close', () => {
                    if (generation === this.#generation) this.#write('connected', false);
                });
                this.#observer = new document.defaultView.ResizeObserver(() => { if (this.#terminal === terminal) fit.fit(); });
                this.#observer.observe(this);
                fit.fit();
            }).catch(error => {
                if (generation !== this.#generation) return;
                this.control.textContent = `The terminal could not start: ${error.message}`;
                this.control.setAttribute('role', 'alert');
                throw error;
            });
            this.ready.catch(error => this.#context ? this.#context.reportError(error, 'Terminal') : console.error(error));
        }
        #stop() {
            ++this.#generation;
            this.#observer?.disconnect(); this.#observer = null;
            if (this.#socket) { this.#socket.close(1000); this.#socket = null; this.#write('connected', false); }
            this.#terminal?.dispose(); this.#terminal = null; this.#fit = null;
            this.#session = null;
        }
    }
});
