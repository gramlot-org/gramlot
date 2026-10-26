/* @ts-self-types="./device-handler.d.ts" */
import {Bag} from '@genrojs/bag';
import {Handler} from './handler.js';
import {DeviceResolver} from '../binding/device-resolver.js';

const NAMES = ['appinfo', 'location'];
const ERROR_STATUS = {UNAVAILABLE: 'unavailable', PERMISSION_DENIED: 'denied',
    TIMEOUT: 'error', FAILED: 'error', CANCELLED: 'cancelled'};

function failureAttributes(error) {
    const code = Object.hasOwn(ERROR_STATUS, error?.code) ? error.code : 'FAILED';
    return {status: ERROR_STATUS[code],
        error: code === 'CANCELLED' ? null : {code, message: String(error?.message ?? 'Device operation failed')}};
}

/** Device values, desired updates and effective state in one page's Data Bag. */
export class DeviceHandler extends Handler {
    #database = null;
    #clipboardRequest = null;
    #captureRequest = null;
    #audio = null;
    #barcodeRequest = null;
    #hapticRequest = null;
    #stateEvents = new Map();
    #sensors = new Map();
    #biometricsRequest = null;
    #notificationRequest = null;
    #notificationEvents = null;
    #pushRequest = null;
    #pushEvents = null;
    #shortcutEvents = null;
    #linkEvents = null;

    constructor(gramlot) {
        super(gramlot);
        this.provider = null;
        this.disposed = false;
        this.monitor = null;
        this.retiring = null;
        this.resolvers = new Map();
        this.cleanup = Promise.resolve();
    }

    installData() {
        const {gramlot} = this;
        gramlot.data.setItem('gramlot.device.database', null, {status: 'idle', error: null});
        gramlot.data.setItem('gramlot.device.orientation', null, {status: 'idle', error: null, listening: false});
        for (const name of ['gyroscope', 'accelerometer']) {
            gramlot.data.setItem(`gramlot.device.${name}`, null,
                {enabled: false, watching: false, status: 'idle', error: null});
            gramlot.data.getNode(`gramlot.device.${name}`).setAttr({error: null}, false, true, false);
            this.#sensors.set(name, {node: gramlot.data.getNode(`gramlot.device.${name}`),
                stream: null, cleanup: Promise.resolve()});
        }
        for (const name of NAMES) {
            const path = `gramlot.device.${name}`;
            const attrs = {status: 'idle', error: null, cacheTime: name === 'appinfo' ? -1 : 5};
            if (name === 'location') Object.assign(attrs, {enabled: false, watching: false});
            gramlot.data.setItem(path, null);
            const node = gramlot.data.getNode(path);
            node.setAttr(attrs, false, true, false);
            const resolver = new DeviceResolver(this, name, attrs.cacheTime);
            node.resolver = resolver;
            this.resolvers.set(name, resolver);
        }
        gramlot.data.setItem('gramlot.device.clipboard', null,
            {status: 'idle', error: null, text: '', copy: null, paste: null, operation: null});
        const clipboard = gramlot.data.getNode('gramlot.device.clipboard');
        gramlot.data.setItem('gramlot.device.camera', null, {status: 'idle', error: null, capture: null, choose: null});
        const camera = gramlot.data.getNode('gramlot.device.camera');
        gramlot.data.setItem('gramlot.device.barcode', null, {status: 'idle', error: null, scan: null});
        const barcode = gramlot.data.getNode('gramlot.device.barcode');
        gramlot.data.setItem('gramlot.device.biometrics', null, {status: 'idle', error: null, verify: null});
        const biometrics = gramlot.data.getNode('gramlot.device.biometrics');
        const notifications = new Bag();
        notifications.setItem('request', new Bag());
        for (const name of ['scheduled', 'received', 'action']) notifications.setItem(name, null);
        gramlot.data.setItem('gramlot.device.notifications', notifications,
            {status: 'idle', error: null, schedule: null, listening: false, listenerError: null});
        const notificationNode = gramlot.data.getNode('gramlot.device.notifications');
        const push = new Bag();
        for (const name of ['registration', 'received', 'action']) push.setItem(name, null);
        gramlot.data.setItem('gramlot.device.push', push,
            {status: 'idle', error: null, register: null, listening: false, listenerError: null});
        const pushNode = gramlot.data.getNode('gramlot.device.push');
        const links = new Bag();
        links.setItem('request', null);
        gramlot.data.setItem('gramlot.device.links', links, {listening: false, listenerError: null});
        const shortcuts = new Bag();
        shortcuts.setItem('request', null);
        gramlot.data.setItem('gramlot.device.shortcuts', shortcuts, {listening: false, listenerError: null});
        gramlot.data.setItem('gramlot.device.network', null, {status: 'idle', error: null, listening: false});
        const lifecycle = new Bag();
        lifecycle.setItem('active', null);
        lifecycle.setItem('event', null);
        lifecycle.setItem('sequence', 0);
        gramlot.data.setItem('gramlot.device.lifecycle', lifecycle, {status: 'idle', error: null, listening: false});
        gramlot.data.setItem('gramlot.device.haptics', null,
            {status: 'idle', error: null, impact: null, style: 'medium', vibrate: null, duration: 600});
        const haptics = gramlot.data.getNode('gramlot.device.haptics');
        gramlot.data.setItem('gramlot.device.audio', null,
            {status: 'idle', error: null, recording: false, start: null, stop: null, cancel: null,
                share: null, shareStatus: 'idle', shareError: null, shareActivity: null});
        const audio = gramlot.data.getNode('gramlot.device.audio');
        gramlot.data.subscribe('gramlot.device', {update: event => {
            if (this.disposed) return;
            for (const [name, sensor] of this.#sensors) {
                if (event.node === sensor.node && event.attrs_diff?.enabled) {
                    if (typeof sensor.node.attr.enabled !== 'boolean') throw new TypeError('Device enabled must be boolean');
                    this.#reconcileSensor(name, sensor);
                }
            }
            if (event.node === clipboard && event.fired) {
                if (event.attrs_diff?.copy?.new === true) this.#clipboardCommand(clipboard, 'copy');
                if (event.attrs_diff?.paste?.new === true) this.#clipboardCommand(clipboard, 'paste');
            }
            if (event.node === audio && event.fired) {
                if (event.attrs_diff?.start?.new === true) this.#startAudio(audio);
                if (event.attrs_diff?.stop?.new === true) this.#stopAudio(audio);
                if (event.attrs_diff?.cancel?.new === true) this.#cancelAudio(audio);
                if (event.attrs_diff?.share?.new === true) this.#shareAudio(audio);
            }
            if (event.node === haptics && event.fired && event.attrs_diff?.impact?.new === true) {
                this.#impact(haptics);
            }
            if (event.node === haptics && event.fired && event.attrs_diff?.vibrate?.new === true) {
                this.#vibrate(haptics);
            }
            if (event.node === barcode && event.fired && event.attrs_diff?.scan?.new === true) {
                this.#scanBarcode(barcode);
            }
            if (event.node === camera && event.fired && event.attrs_diff?.choose?.new === true) {
                this.#photo(camera, 'choose');
            }
            if (event.node === camera && event.fired && event.attrs_diff?.capture?.new === true) {
                this.#photo(camera, 'capture');
            }
            if (event.node === biometrics && event.fired && event.attrs_diff?.verify?.new === true) {
                this.#verifyBiometrics(biometrics);
            }
            if (event.node === notificationNode && event.fired && event.attrs_diff?.schedule?.new === true) {
                this.#scheduleNotification(notificationNode);
            }
            if (event.node === pushNode && event.fired && event.attrs_diff?.register?.new === true) {
                this.#registerPush(pushNode);
            }
            for (const resolver of this.resolvers.values()) {
                if (event.node !== resolver._node) continue;
                const {cacheTime} = event.node.attr;
                if (typeof cacheTime !== 'number' || !Number.isFinite(cacheTime) || (cacheTime < 0 && cacheTime !== -1)) {
                    throw new TypeError('Device cacheTime must be -1 or a nonnegative number of seconds');
                }
                resolver.cacheTime = cacheTime;
                if (resolver.name === 'location') {
                    if (typeof event.node.attr.enabled !== 'boolean') throw new TypeError('Device enabled must be boolean');
                    this.reconcile();
                }
            }
        }});
    }

    /** Attach the explicitly selected provider once, before the page reads device values. */
    attach(provider, {dispose = null} = {}) {
        this.assertLive();
        if (this.provider) throw new Error('A device provider is already attached');
        if (!Array.isArray(provider.capabilities) || provider.capabilities.some(name => ![...NAMES, 'camera', 'biometrics', 'notifications', 'push', 'shortcuts', 'barcode', 'network', 'lifecycle', 'haptics', 'audio', 'clipboard', 'links', 'orientation', 'gyroscope', 'accelerometer', 'database'].includes(name))) {
            throw new TypeError('Unknown device provider capability');
        }
        if(dispose !== null && typeof dispose !== 'function')throw new TypeError('Device attachment dispose must be a function');
        this.releaseProvider = dispose;
        this.provider = provider;
        this.installData();
        this.reconcile();
        this.#startStateEvents('orientation', (callback, signal) => provider.startOrientationEvents(callback, signal), (node, state) => {
            if (!['portrait', 'landscape'].includes(state?.type) || !['primary', 'secondary'].includes(state.direction) ||
                !Number.isFinite(state.timestamp)) throw new TypeError('Invalid screen orientation from device provider');
            const value = new Bag();
            for (const key of ['type', 'direction', 'timestamp']) value.setItem(key, state[key]);
            node.setValue(value, true, {status: 'success', error: null}, true, false);
        });
        this.#startStateEvents('network', (callback, signal) => provider.startNetworkEvents(callback, signal), (node, state) => {
            if (typeof state?.connected !== 'boolean' || !['none', 'unknown', 'wifi', 'cellular'].includes(state.type)) {
                throw new TypeError('Invalid network state from device provider');
            }
            const value = new Bag();
            value.setItem('connected', state.connected);
            value.setItem('type', state.type);
            node.setValue(value, true, {status: 'success', error: null}, true, false);
        });
        this.#startStateEvents('lifecycle', (callback, signal) => provider.startLifecycleEvents(callback, signal), (node, event) => {
            if (event?.kind === 'state' && typeof event.active === 'boolean') {
                node.staticValue.setItem('active', event.active);
            } else if (event?.kind === 'pause' || event?.kind === 'resume') {
                node.staticValue.setItem('event', event.kind);
                node.staticValue.setItem('sequence', node.staticValue.getItem('sequence') + 1);
            } else {
                throw new TypeError('Invalid lifecycle event from device provider');
            }
            node.setAttr({status: 'success', error: null}, true, true, false);
        });
        if (provider.capabilities.includes('links')) {
            this.#startLinkEvents(this.gramlot.data.getNode('gramlot.device.links'));
        }
        if (provider.capabilities.includes('shortcuts')) {
            this.#startShortcutEvents(this.gramlot.data.getNode('gramlot.device.shortcuts'));
        }
        if (provider.capabilities.includes('push')) {
            this.#startPushEvents(this.gramlot.data.getNode('gramlot.device.push'));
        }
        if (provider.capabilities.includes('notifications')) {
            this.#startNotificationEvents(this.gramlot.data.getNode('gramlot.device.notifications'));
        }
    }

    assertLive() {
        if (this.disposed) throw new Error('DeviceHandler is disposed');
    }

    resolver(name) {
        this.assertLive();
        if (!this.resolvers.has(name)) throw new TypeError(`Unknown device value: ${name}`);
        return this.resolvers.get(name);
    }

    invalidate(name) { this.resolver(name).reset(); }

    /** Command only. Success/failure is delivered through Data, never a public Promise. */
    refresh(name) {
        const resolver = this.resolver(name);
        if (resolver.request) return;
        const request = {revision: resolver.revision, received: resolver.received};
        resolver.request = request;
        this.attributes(resolver, {status: 'pending', error: null});
        Promise.resolve().then(() => {
            if (this.disposed || resolver.request !== request) return;
            this.requireCapability(name);
            return name === 'appinfo' ? this.provider.readAppInfo() : this.provider.readLocation();
        }).then(value => {
            if (this.disposed || resolver.request !== request) return;
            this.accept(resolver, value);
            // Invalidation while pending retains the arriving result, but leaves it stale.
            if (resolver.revision !== request.revision) resolver._lastUpdate = null;
        }).catch(error => {
            if (!this.disposed && resolver.request === request && resolver.received === request.received) {
                this.failure(resolver, error);
            }
        }).finally(() => {
            if (resolver.request === request) resolver.request = null;
        });
    }

    // Page-owned state streams share lifetime/error handling, never public dispatch.
    #startStateEvents(name, start, accept) {
        const node = this.gramlot.data.getNode(`gramlot.device.${name}`);
        if (!this.provider.capabilities.includes(name)) {
            node.setAttr(failureAttributes({code: 'UNAVAILABLE', message: `${name} is unavailable`}), true, true, false);
            return;
        }
        const events = {controller: new AbortController()};
        this.#stateEvents.set(name, events);
        node.setAttr({status: 'pending', error: null}, true, true, false);
        events.start = Promise.resolve().then(() => {
            if (events.controller.signal.aborted) return async () => {};
            return start(value => {
                if (events.controller.signal.aborted) return;
                try { accept(node, value); }
                catch (error) { node.setAttr(failureAttributes(error), true, true, false); }
            }, events.controller.signal);
        }).then(stop => {
            if (!events.controller.signal.aborted) node.setAttr({listening: true}, true, true, false);
            return stop;
        });
        events.start.catch(error => {
            const aborted = events.controller.signal.aborted;
            events.controller.abort();
            if (!aborted) node.setAttr({...failureAttributes(error), listening: false}, true, true, false);
        });
    }

    #reconcileSensor(name, sensor) {
        const {node} = sensor;
        if (!node.attr.enabled) {
            const stream = sensor.stream;
            if (!stream) return;
            sensor.stream = null;
            stream.controller.abort();
            sensor.cleanup = stream.start.then(stop => stop(), () => undefined).then(() => {
                if (!this.disposed && !sensor.stream) node.setAttr({watching: false, status: 'idle', error: null}, true, true, false);
            });
            sensor.cleanup.catch(error => {
                if (!this.disposed) node.setAttr(failureAttributes(error), true, true, false);
            });
            return;
        }
        if (sensor.stream) return;
        const stream = {controller: new AbortController()};
        sensor.stream = stream;
        stream.start = sensor.cleanup.then(() => {
            if (stream.controller.signal.aborted) return async () => {};
            this.requireCapability(name);
            const accept = event => {
                if (this.disposed || stream.controller.signal.aborted) return;
                try {
                    if (event?.kind === 'state' && typeof event.watching === 'boolean') {
                        node.setAttr({watching: event.watching, status: event.watching ? 'pending' : 'idle', error: null}, true, true, false);
                    } else if (event?.kind === 'sample') {
                        for (const field of ['x', 'y', 'z', 'timestamp']) {
                            if (!Number.isFinite(event[field])) throw new TypeError(`Invalid ${name}.${field}`);
                        }
                        if (!node.attr.watching) return;
                        if (node.staticValue && event.timestamp < node.staticValue.getItem('timestamp')) return;
                        const value = new Bag();
                        for (const field of ['x', 'y', 'z', 'timestamp']) value.setItem(field, event[field]);
                        node.setValue(value, true, {status: 'success', error: null}, true, false);
                    } else if (event?.kind === 'error' && event.error instanceof Error) {
                        node.setAttr({...failureAttributes(event.error), watching: false}, true, true, false);
                    } else throw new TypeError(`Invalid ${name} event`);
                } catch (error) { node.setAttr(failureAttributes(error), true, true, false); }
            };
            return name === 'gyroscope' ? this.provider.startGyroscopeUpdates(accept, stream.controller.signal)
                : this.provider.startAccelerometerUpdates(accept, stream.controller.signal);
        });
        stream.start.catch(error => {
            if (!this.disposed && !stream.controller.signal.aborted) {
                node.setAttr({...failureAttributes(error), watching: false}, true, true, false);
            }
        });
        node.setAttr({status: 'pending', error: null}, true, true, false);
    }

    #startAudio(node) {
        const previous = this.#audio;
        if (previous) {
            if (previous.phase !== 'complete') return;
            previous.phase = 'replacing';
            node.setValue(null, true, {status: 'pending', error: null, recording: false,
                shareStatus: 'idle', shareError: null, shareActivity: null}, true, false);
            previous.close = previous.start.then(session => session.dispose()).then(() => {
                if (this.disposed || previous.controller.signal.aborted || this.#audio !== previous) return;
                this.#audio = null;
                this.#startAudio(node);
            }).catch(error => {
                if (!this.disposed && this.#audio === previous) {
                    previous.phase = 'failed';
                    node.setAttr(failureAttributes(error), true, true, false);
                }
            });
            return;
        }
        const audio = {controller: new AbortController(), phase: 'starting'};
        this.#audio = audio;
        node.setValue(null, true, {status: 'pending', error: null, recording: false,
                shareStatus: 'idle', shareError: null, shareActivity: null}, true, false);
        audio.start = Promise.resolve().then(async () => {
            if (audio.controller.signal.aborted) return null;
            this.requireCapability('audio');
            return this.provider.startAudioRecording(error => {
                if (this.#audio === audio && !audio.controller.signal.aborted) this.#cancelAudio(node, error);
            }, audio.controller.signal);
        });
        audio.start.then(session => {
            if (!session || audio.controller.signal.aborted || this.disposed) return;
            audio.phase = 'recording';
            node.setAttr({status: 'recording', error: null, recording: true}, true, true, false);
        }).catch(error => {
            if (audio.controller.signal.aborted || this.disposed) return;
            if (this.#audio === audio) this.#audio = null;
            node.setAttr({...failureAttributes(error), recording: false}, true, true, false);
        });
    }

    #stopAudio(node) {
        const audio = this.#audio;
        if (!audio || audio.phase !== 'recording') return;
        audio.phase = 'stopping';
        node.setAttr({status: 'pending', error: null}, true, true, false);
        audio.stop = audio.start.then(session => session.stop()).then(result => {
            if (audio.controller.signal.aborted || this.disposed) return;
            if (typeof result?.url !== 'string' || !result.url || typeof result.mimeType !== 'string' ||
                !result.mimeType.startsWith('audio/') || !Number.isFinite(result.duration) || result.duration < 0) {
                throw new TypeError('Invalid audio result from device provider');
            }
            const value = new Bag();
            for (const key of ['url', 'mimeType', 'duration']) value.setItem(key, result[key]);
            audio.phase = 'complete';
            node.setValue(value, true, {status: 'success', error: null, recording: false}, true, false);
        }).catch(error => {
            if (!audio.controller.signal.aborted && !this.disposed) this.#cancelAudio(node, error);
        });
    }

    #shareAudio(node) {
        const audio = this.#audio;
        if (audio?.phase === 'sharing') return;
        if (!audio || audio.phase !== 'complete') {
            const failure = failureAttributes(new Error('Record and stop audio before sharing'));
            node.setAttr({shareStatus: failure.status, shareError: failure.error, shareActivity: null}, true, true, false);
            return;
        }
        audio.phase = 'sharing';
        node.setAttr({shareStatus: 'pending', shareError: null, shareActivity: null}, true, true, false);
        audio.share = audio.start.then(session => session.share(audio.controller.signal)).then(result => {
            if (audio.controller.signal.aborted || this.disposed) return;
            if (typeof result?.activity !== 'string') throw new TypeError('Invalid audio share result from device provider');
            node.setAttr({shareStatus: 'success', shareError: null, shareActivity: result.activity}, true, true, false);
        }).catch(error => {
            if (audio.controller.signal.aborted || this.disposed) return;
            const failure = failureAttributes(error);
            node.setAttr({shareStatus: failure.status, shareError: failure.error, shareActivity: null}, true, true, false);
        }).finally(() => {
            if (this.#audio === audio && !audio.controller.signal.aborted) audio.phase = 'complete';
        });
    }

    #cancelAudio(node, error = {code: 'CANCELLED', message: 'Audio recording cancelled'}) {
        const audio = this.#audio;
        if (!audio || audio.phase === 'closing' || audio.phase === 'sharing') return;
        audio.phase = 'closing';
        audio.controller.abort();
        node.setValue(null, true, {status: 'pending', error: null,
            shareStatus: 'idle', shareError: null, shareActivity: null}, true, false);
        audio.close = audio.start.then(session => session === null ? undefined : session.dispose(), error => { if (error?.code !== 'CANCELLED') throw error; }).then(() => {
            if (this.disposed || this.#audio !== audio) return;
            this.#audio = null;
            node.setAttr({...failureAttributes(error), recording: false}, true, true, false);
        }).catch(cleanupError => {
            if (!this.disposed && this.#audio === audio) {
                // Keep ownership when cleanup failed; the page may retry cancellation.
                audio.phase = 'failed';
                node.setAttr(failureAttributes(cleanupError), true, true, false);
            }
        });
    }

    #clipboardCommand(node, operation) {
        if (this.#clipboardRequest) return;
        const request = new AbortController();
        this.#clipboardRequest = request;
        const text = node.attr.text;
        node.setValue(null, true, {status: 'pending', error: null, operation}, true, false);
        Promise.resolve().then(async () => {
            if (request.signal.aborted) return;
            this.requireCapability('clipboard');
            let result;
            if (operation === 'copy') {
                if (typeof text !== 'string') throw new TypeError('Clipboard text must be a string');
                await this.provider.copyText(text, request.signal);
                result = {text};
            } else {
                result = await this.provider.pasteText(request.signal);
            }
            if (request.signal.aborted) return;
            if (typeof result?.text !== 'string') throw new TypeError('Invalid clipboard text from device provider');
            const value = new Bag();
            value.setItem('text', result.text);
            node.setValue(value, true, {status: 'success', error: null}, true, false);
        }).catch(error => {
            if (!request.signal.aborted) node.setAttr(failureAttributes(error), true, true, false);
        }).finally(() => {
            if (this.#clipboardRequest === request) this.#clipboardRequest = null;
        });
    }

    #vibrate(node) {
        if (this.#hapticRequest) return;
        const request = new AbortController();
        this.#hapticRequest = request;
        const {duration} = node.attr;
        node.setValue(null, true, {status: 'pending', error: null}, true, false);
        Promise.resolve().then(async () => {
            if (request.signal.aborted) return;
            this.requireCapability('haptics');
            if (!Number.isInteger(duration) || duration < 1 || duration > 5000) {
                throw new TypeError('Vibration duration must be an integer from 1 to 5000 milliseconds');
            }
            await this.provider.vibrate(duration, request.signal);
            if (request.signal.aborted) return;
            const value = new Bag();
            value.setItem('duration', duration);
            value.setItem('acknowledged', true);
            node.setValue(value, true, {status: 'success', error: null}, true, false);
        }).catch(error => {
            if (!request.signal.aborted) node.setAttr(failureAttributes(error), true, true, false);
        }).finally(() => {
            if (this.#hapticRequest === request) this.#hapticRequest = null;
        });
    }

    #impact(node) {
        if (this.#hapticRequest) return;
        const request = new AbortController();
        this.#hapticRequest = request;
        const {style} = node.attr;
        node.setValue(null, true, {status: 'pending', error: null}, true, false);
        Promise.resolve().then(async () => {
            if (request.signal.aborted) return;
            this.requireCapability('haptics');
            if (!['light', 'medium', 'heavy'].includes(style)) throw new TypeError('Invalid haptic style');
            await this.provider.impact(style, request.signal);
            if (request.signal.aborted) return;
            const value = new Bag();
            value.setItem('style', style);
            value.setItem('acknowledged', true);
            node.setValue(value, true, {status: 'success', error: null}, true, false);
        }).catch(error => {
            if (!request.signal.aborted) node.setAttr(failureAttributes(error), true, true, false);
        }).finally(() => {
            if (this.#hapticRequest === request) this.#hapticRequest = null;
        });
    }

    #scanBarcode(node) {
        if (this.#barcodeRequest) return;
        const request = new AbortController();
        this.#barcodeRequest = request;
        node.setValue(null, true, {status: 'pending', error: null}, true, false);
        Promise.resolve().then(() => {
            if (request.signal.aborted) return;
            this.requireCapability('barcode');
            return this.provider.scanBarcode(request.signal);
        }).then(result => {
            if (request.signal.aborted) return;
            if (typeof result?.text !== 'string' || !result.text || typeof result.format !== 'string' || !result.format) {
                throw new TypeError('Invalid barcode result from device provider');
            }
            const value = new Bag();
            value.setItem('text', result.text);
            value.setItem('format', result.format);
            node.setValue(value, true, {status: 'success', error: null}, true, false);
        }).catch(error => {
            if (!request.signal.aborted) node.setAttr(failureAttributes(error), true, true, false);
        }).finally(() => {
            if (this.#barcodeRequest === request) this.#barcodeRequest = null;
        });
    }

    // Camera is an explicit Data event, never a resolver read with a UI side effect.
    #photo(node, operation) {
        if (this.#captureRequest) return;
        const request = new AbortController();
        this.#captureRequest = request;
        node.setAttr({status: 'pending', error: null}, true, true, false);
        Promise.resolve().then(() => {
            if (request.signal.aborted) return;
            this.requireCapability('camera');
            return operation === 'choose'
                ? this.provider.choosePhoto(request.signal)
                : this.provider.takePhoto(request.signal);
        }).then(photo => {
            if (request.signal.aborted) return;
            if (typeof photo?.url !== 'string' || !photo.url || typeof photo.format !== 'string' || !photo.format) {
                throw new TypeError('Invalid camera photo from device provider');
            }
            const value = new Bag();
            value.setItem('url', photo.url);
            value.setItem('format', photo.format);
            node.setValue(value, true, {status: 'success', error: null}, true, false);
        }).catch(error => {
            if (!request.signal.aborted) node.setAttr(failureAttributes(error), true, true, false);
        }).finally(() => {
            if (this.#captureRequest === request) this.#captureRequest = null;
        });
    }

    // A fresh attempt clears the previous local verification, including on cancellation.
    #verifyBiometrics(node) {
        if (this.#biometricsRequest) return;
        const request = new AbortController();
        this.#biometricsRequest = request;
        node.setValue(null, true, {status: 'pending', error: null}, true, false);
        Promise.resolve().then(() => {
            if (request.signal.aborted) return;
            this.requireCapability('biometrics');
            return this.provider.verifyBiometrics(request.signal);
        }).then(() => {
            if (request.signal.aborted) return;
            const result = new Bag();
            result.setItem('verified', true);
            node.setValue(result, true, {status: 'success', error: null}, true, false);
        }).catch(error => {
            if (!request.signal.aborted) node.setValue(null, true, failureAttributes(error), true, false);
        }).finally(() => {
            if (this.#biometricsRequest === request) this.#biometricsRequest = null;
        });
    }

    #startNotificationEvents(node) {
        if (this.#notificationEvents) return this.#notificationEvents.start;
        const events = {controller: new AbortController()};
        this.#notificationEvents = events;
        events.start = Promise.resolve().then(() => {
            if (events.controller.signal.aborted) return async () => {};
            return this.provider.startNotificationEvents(event => {
                if (events.controller.signal.aborted) return;
                try {
                    if (!['received', 'action'].includes(event.kind) || !Number.isInteger(event.id)
                        || typeof event.title !== 'string' || typeof event.body !== 'string'
                        || (event.kind === 'action' && typeof event.actionId !== 'string')) {
                        throw new TypeError('Invalid notification event from device provider');
                    }
                    const value = new Bag();
                    for (const key of ['id', 'title', 'body']) value.setItem(key, event[key]);
                    if (event.kind === 'action') value.setItem('actionId', event.actionId);
                    node.staticValue.setItem(event.kind, value);
                } catch (error) {
                    node.setAttr({listenerError: failureAttributes(error).error}, true, true, false);
                }
            }, events.controller.signal);
        }).then(stop => {
            if (!events.controller.signal.aborted) node.setAttr({listening: true}, true, true, false);
            return stop;
        });
        events.start.catch(error => {
            const aborted = events.controller.signal.aborted;
            events.controller.abort();
            if (this.#notificationEvents === events) this.#notificationEvents = null;
            if (!aborted) {
                node.setAttr({listening: false, listenerError: failureAttributes(error).error}, true, true, false);
            }
        });
        node.setAttr({listenerError: null}, true, true, false);
        return events.start;
    }

    #scheduleNotification(node) {
        if (this.#notificationRequest) return;
        const request = new AbortController();
        this.#notificationRequest = request;
        const value = node.staticValue.getItem('request');
        const input = value instanceof Bag
            ? Object.fromEntries(['id', 'title', 'body', 'delay'].map(key => [key, value.getItem(key)])) : null;
        node.staticValue.setItem('scheduled', null);
        node.setAttr({status: 'pending', error: null}, true, true, false);
        Promise.resolve().then(async () => {
            if (request.signal.aborted) return;
            this.requireCapability('notifications');
            if (!input || !Number.isInteger(input.id) || input.id < 1 || input.id > 2147483647
                || typeof input.title !== 'string' || !input.title.trim()
                || typeof input.body !== 'string' || !input.body.trim()
                || typeof input.delay !== 'number' || !Number.isFinite(input.delay) || input.delay <= 0) {
                throw new TypeError('Notification requires a positive 32-bit id, title, body and positive delay in seconds');
            }
            await this.#startNotificationEvents(node);
            if (request.signal.aborted) return;
            return this.provider.scheduleNotification(input, request.signal);
        }).then(result => {
            if (request.signal.aborted) return;
            if (result?.id !== input.id || typeof result.at !== 'number' || !Number.isFinite(result.at)) {
                throw new TypeError('Invalid notification scheduling acknowledgement');
            }
            const scheduled = new Bag();
            scheduled.setItem('id', result.id);
            scheduled.setItem('at', result.at);
            node.staticValue.setItem('scheduled', scheduled);
            node.setAttr({status: 'success', error: null}, true, true, false);
        }).catch(error => {
            if (!request.signal.aborted) node.setAttr(failureAttributes(error), true, true, false);
        }).finally(() => {
            if (this.#notificationRequest === request) this.#notificationRequest = null;
        });
    }

    #finishPushRequest() {
        const request = this.#pushRequest;
        this.#pushRequest = null;
        if (request) clearTimeout(request.timer);
        return request;
    }

    #acceptPushEvent(node, event) {
        if (event.kind === 'registration') {
            if (typeof event.token !== 'string' || !event.token) throw new TypeError('Invalid push registration token');
            this.#finishPushRequest();
            const value = new Bag();
            value.setItem('token', event.token);
            node.staticValue.setItem('registration', value);
            node.setAttr({status: 'success', error: null}, true, true, false);
        } else if (event.kind === 'registrationError') {
            this.#finishPushRequest();
            node.staticValue.setItem('registration', null);
            node.setAttr(failureAttributes(event.error), true, true, false);
        } else {
            if (!['received', 'action'].includes(event.kind)) throw new TypeError('Invalid push event kind');
            const fields = ['id', 'title', 'body', 'messageId', 'destination'];
            if (event.kind === 'action') fields.push('actionId');
            const value = new Bag();
            for (const key of fields) {
                if (typeof event[key] !== 'string') throw new TypeError(`Invalid push event ${key}`);
                value.setItem(key, event[key]);
            }
            node.staticValue.setItem(event.kind, value);
        }
    }

    #startPushEvents(node) {
        if (this.#pushEvents) return this.#pushEvents.start;
        const events = {controller: new AbortController()};
        this.#pushEvents = events;
        events.start = Promise.resolve().then(() => {
            if (events.controller.signal.aborted) return async () => {};
            return this.provider.startPushEvents(event => {
                if (events.controller.signal.aborted) return;
                try { this.#acceptPushEvent(node, event); }
                catch (error) { node.setAttr({listenerError: failureAttributes(error).error}, true, true, false); }
            }, events.controller.signal);
        }).then(stop => {
            if (!events.controller.signal.aborted) node.setAttr({listening: true}, true, true, false);
            return stop;
        });
        events.start.catch(error => {
            const aborted = events.controller.signal.aborted;
            events.controller.abort();
            if (this.#pushEvents === events) this.#pushEvents = null;
            if (!aborted) node.setAttr({listening: false, listenerError: failureAttributes(error).error}, true, true, false);
        });
        node.setAttr({listenerError: null}, true, true, false);
        return events.start;
    }

    #registerPush(node) {
        if (this.#pushRequest) return;
        const request = {controller: new AbortController(), timer: null};
        this.#pushRequest = request;
        request.timer = setTimeout(() => {
            if (this.disposed || this.#pushRequest !== request) return;
            this.#finishPushRequest();
            request.controller.abort();
            node.setAttr(failureAttributes({code: 'TIMEOUT', message: 'Push registration has not returned a token'}), true, true, false);
        }, 30000);
        node.staticValue.setItem('registration', null);
        node.setAttr({status: 'pending', error: null}, true, true, false);
        Promise.resolve().then(async () => {
            if (request.controller.signal.aborted) return;
            this.requireCapability('push');
            await this.#startPushEvents(node);
            if (request.controller.signal.aborted || this.#pushRequest !== request) return;
            await this.provider.registerPush(request.controller.signal);
            // SDK register() only initiates registration. The token event completes it.
        }).catch(error => {
            if (this.disposed || this.#pushRequest !== request) return;
            this.#finishPushRequest();
            request.controller.abort();
            node.setAttr(failureAttributes(error), true, true, false);
        });
    }

    #startShortcutEvents(node) {
        const events = {controller: new AbortController()};
        this.#shortcutEvents = events;
        events.start = Promise.resolve().then(() => {
            if (events.controller.signal.aborted) return async () => {};
            return this.provider.startShortcutEvents((request, error = null) => {
                if (events.controller.signal.aborted) return;
                try {
                    if (error) throw error;
                    for (const key of ['id', 'destination']) {
                        if (typeof request?.[key] !== 'string' || !request[key]) {
                            throw new TypeError(`Invalid shortcut request ${key}`);
                        }
                    }
                    if (node.staticValue.getItem('request')?.getItem('id') === request.id) return;
                    const value = new Bag();
                    value.setItem('id', request.id);
                    value.setItem('destination', request.destination);
                    node.setAttr({listenerError: null}, true, true, false);
                    node.staticValue.setItem('request', value);
                } catch (error) {
                    node.setAttr({listenerError: failureAttributes(error).error}, true, true, false);
                }
            }, events.controller.signal);
        }).then(stop => {
            if (!events.controller.signal.aborted) node.setAttr({listening: true}, true, true, false);
            return stop;
        });
        events.start.catch(error => {
            const aborted = events.controller.signal.aborted;
            events.controller.abort();
            if (!aborted) node.setAttr({listening: false, listenerError: failureAttributes(error).error}, true, true, false);
        });
    }

    #startLinkEvents(node) {
        const events = {controller: new AbortController()};
        this.#linkEvents = events;
        events.start = Promise.resolve().then(() => {
            if (events.controller.signal.aborted) return async () => {};
            return this.provider.startLinkEvents((request, error = null) => {
                if (events.controller.signal.aborted) return;
                try {
                    if (error) throw error;
                    for (const key of ['id', 'url']) {
                        if (typeof request?.[key] !== 'string' || !request[key]) {
                            throw new TypeError(`Invalid link request ${key}`);
                        }
                    }
                    if (node.staticValue.getItem('request')?.getItem('id') === request.id) return;
                    const value = new Bag();
                    value.setItem('id', request.id);
                    value.setItem('url', request.url);
                    node.setAttr({listenerError: null}, true, true, false);
                    node.staticValue.setItem('request', value);
                } catch (error) {
                    node.setAttr({listenerError: failureAttributes(error).error}, true, true, false);
                }
            }, events.controller.signal);
        }).then(stop => {
            if (!events.controller.signal.aborted) node.setAttr({listening: true}, true, true, false);
            return stop;
        });
        events.start.catch(error => {
            const aborted = events.controller.signal.aborted;
            events.controller.abort();
            if (!aborted) node.setAttr({listening: false, listenerError: failureAttributes(error).error}, true, true, false);
        });
    }

    requireCapability(name) {
        if (!this.provider || !this.provider.capabilities.includes(name)) {
            throw Object.assign(new Error(`${name} is unavailable in this environment`), {code: 'UNAVAILABLE'});
        }
    }

    attributes(resolver, attrs) {
        const writing = resolver.writing;
        resolver.writing = true;
        try { resolver._node.setAttr(attrs, true, true, false); }
        finally { resolver.writing = writing; }
    }

    accept(resolver, value) {
        const fields = resolver.name === 'appinfo' ? ['id', 'name', 'version', 'build']
            : ['latitude', 'longitude', 'accuracy', 'timestamp'];
        const type = resolver.name === 'appinfo' ? 'string' : 'number';
        for (const key of fields) {
            if (typeof value[key] !== type || (type === 'number' && !Number.isFinite(value[key]))) {
                throw new TypeError(`Invalid ${resolver.name}.${key} from device provider`);
            }
        }
        const current = resolver.cachedValue;
        // A slower point lookup must not overwrite a newer native measurement.
        if (resolver.name === 'location' && current && value.timestamp < current.getItem('timestamp')) {
            this.attributes(resolver, {status: 'success', error: null});
            return;
        }
        const bag = new Bag();
        for (const key of fields) bag.setItem(key, value[key]);
        resolver._lastUpdate = Date.now();
        resolver.failed = false;
        resolver.received++;
        const writing = resolver.writing;
        resolver.writing = true;
        try { resolver._node.setValue(bag, true, {status: 'success', error: null}, true, false); }
        finally { resolver.writing = writing; }
    }

    failure(resolver, error) {
        resolver.failed = true;
        this.attributes(resolver, failureAttributes(error));
    }

    reconcile() {
        const resolver = this.resolvers.get('location');
        if (resolver._node.attr.enabled) {
            if (this.monitor) return;
            const monitor = {stop: null, controller: new AbortController()};
            this.monitor = monitor;
            monitor.start = Promise.resolve(this.cleanup).then(() => {
                if (this.disposed || this.monitor !== monitor) return null;
                this.requireCapability('location');
                return this.provider.startLocationUpdates((value, error) => {
                    if (this.disposed || this.monitor !== monitor) return;
                    if (error) this.failure(resolver, error);
                    else {
                        try { this.accept(resolver, value); }
                        catch (failure) { this.failure(resolver, failure); }
                    }
                }, monitor.controller.signal);
            });
            monitor.start.then(stop => {
                if (stop === null || this.disposed || this.monitor !== monitor) return;
                monitor.stop = stop;
                this.attributes(resolver, {watching: true});
            }).catch(error => {
                if (!this.disposed && this.monitor === monitor) {
                    // Keep the failed intent until enabled changes; Data notifications cannot retry it.
                    this.attributes(resolver, {watching: false});
                    this.failure(resolver, error);
                }
            });
            this.attributes(resolver, {status: 'pending', error: null});
        } else if (this.monitor) {
            const monitor = this.monitor;
            this.monitor = null;
            monitor.controller.abort();
            this.retiring = monitor;
            // Ignore callbacks now; report effective stopping only after native cleanup succeeds.
            this.cleanup = monitor.start.then(stop => stop === null ? undefined : stop(), () => undefined).then(() => {
                if (this.retiring === monitor) this.retiring = null;
                if (!this.disposed) {
                    const attrs = {watching: false};
                    if (!this.monitor && !resolver.request && resolver._node.attr.status === 'pending') {
                        Object.assign(attrs, {status: 'cancelled', error: null});
                    }
                    this.attributes(resolver, attrs);
                }
            });
            this.cleanup.catch(error => { if (!this.disposed) this.failure(resolver, error); });
        }
    }

    /** A page-owned database connection; database technology remains provider-owned. */
    async openDatabase(name) {
        this.assertLive();
        if (!/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(name) || typeof name !== 'string') throw new TypeError('Invalid database name');
        if (this.#database) throw new Error('This page already owns a database connection');
        const node = this.gramlot.data.getNode('gramlot.device.database');
        const state = (status, error = null) => {
            if (!this.disposed) node.setAttr({status, error}, true, true, false);
        };
        if (!this.provider.capabilities.includes('database')) {
            const error = Object.assign(new Error('Native database unavailable'), {code: 'UNAVAILABLE'});
            state('unavailable', {code: error.code, message: error.message}); throw error;
        }
        const slot = {controller: new AbortController(), close: null, start: null};
        this.#database = slot; state('pending');
        slot.start = this.provider.openDatabase(name, slot.controller.signal);
        try {
            const connection = await slot.start;
            let closed = false, closing = null;
            const close = () => {
                if (closing) return closing;
                closed = true;
                closing = connection.close().then(() => { state('closed'); }, error => { state('error', {code:'FAILED', message:error.message}); throw error; })
                    .finally(() => { if (this.#database === slot) this.#database = null; });
                return closing;
            };
            slot.close = close;
            if (this.disposed || slot.controller.signal.aborted) { await close(); throw Object.assign(new Error('Page closed'), {code:'CANCELLED'}); }
            const invoke = async (method, sql, params) => {
                this.assertLive();
                if (closed) throw new Error('Database connection is closed');
                state('pending');
                try { const result = await connection[method](sql, params); state('success'); return result; }
                catch (error) { state('error', {code:'FAILED', message:error.message}); throw error; }
            };
            state('success');
            return {query:(sql, params = []) => invoke('query', sql, params),
                execute:(sql, params = []) => invoke('execute', sql, params), close};
        } catch (error) {
            if (this.#database === slot) this.#database = null;
            if (!this.disposed) node.setAttr(failureAttributes(error), true, true, false);
            throw error;
        }
    }

    dispose() {
        if (this.disposed) return;
        this.disposed = true;
        const database = this.#database;
        database?.controller.abort();
        if (database) this.cleanup = Promise.all([this.cleanup,
            database.start.then(() => database.close?.(), () => undefined)]).then(() => undefined);
        const sensorCleanup = [...this.#sensors.values()].map(sensor => {
            const stream = sensor.stream;
            sensor.stream = null;
            stream?.controller.abort();
            return stream ? stream.start.then(stop => stop(), () => undefined) : sensor.cleanup;
        });
        this.#clipboardRequest?.abort();
        this.#clipboardRequest = null;
        const audio = this.#audio;
        this.#audio = null;
        audio?.controller.abort();
        this.#hapticRequest?.abort();
        this.#hapticRequest = null;
        const stateEvents = [...this.#stateEvents.values()];
        this.#stateEvents.clear();
        for (const events of stateEvents) events.controller.abort();
        const linkEvents = this.#linkEvents;
        this.#linkEvents = null;
        linkEvents?.controller.abort();
        const shortcutEvents = this.#shortcutEvents;
        this.#shortcutEvents = null;
        shortcutEvents?.controller.abort();
        this.#finishPushRequest()?.controller.abort();
        const pushEvents = this.#pushEvents;
        this.#pushEvents = null;
        pushEvents?.controller.abort();
        this.#barcodeRequest?.abort();
        this.#barcodeRequest = null;
        this.#captureRequest?.abort();
        this.#captureRequest = null;
        this.#biometricsRequest?.abort();
        this.#biometricsRequest = null;
        this.#notificationRequest?.abort();
        this.#notificationRequest = null;
        const notificationEvents = this.#notificationEvents;
        this.#notificationEvents = null;
        notificationEvents?.controller.abort();
        this.gramlot.data.unsubscribe('gramlot.device', {any: true});
        const monitor = this.monitor;
        this.monitor = null;
        monitor?.controller.abort();
        if (monitor) {
            this.cleanup = monitor.start.then(stop => stop === null ? undefined : stop(), () => undefined);
        } else if (this.retiring?.stop) {
            const retiring = this.retiring;
            this.cleanup = this.cleanup.catch(() => retiring.stop());
        }
        if (notificationEvents) {
            this.cleanup = Promise.all([this.cleanup,
                notificationEvents.start.then(stop => stop(), () => undefined)]).then(() => undefined);
        }
        if (pushEvents) {
            this.cleanup = Promise.all([this.cleanup,
                pushEvents.start.then(stop => stop(), () => undefined)]).then(() => undefined);
        }
        if (linkEvents) {
            this.cleanup = Promise.all([this.cleanup,
                linkEvents.start.then(stop => stop(), () => undefined)]).then(() => undefined);
        }
        if (shortcutEvents) {
            this.cleanup = Promise.all([this.cleanup,
                shortcutEvents.start.then(stop => stop(), () => undefined)]).then(() => undefined);
        }
        this.cleanup = Promise.all([this.cleanup, ...sensorCleanup, ...stateEvents.map(events =>
            events.start.then(stop => stop(), () => undefined))]).then(() => undefined);
        if (audio) {
            this.cleanup = Promise.all([this.cleanup,
                audio.start.then(session => session === null ? undefined : session.dispose(), error => { if (error?.code !== 'CANCELLED') throw error; })]).then(() => undefined);
        }
        // Cleanup rejection is observed; disposed pages must not receive late Data writes.
        this.cleanup = this.cleanup.finally(() => this.releaseProvider?.());
        this.cleanup.catch(error => { this.cleanupError = error; });
        for (const resolver of this.resolvers.values()) resolver.request = null;
    }
}
