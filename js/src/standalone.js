import {Gramlot} from './gramlot.js';
import {WorkerTransport} from './worker-transport.js';

/** Start one JS Page in a dedicated bundled Worker through the normal main path. */
export async function mount({workerUrl, element = null, rootId = 'gramlot-root',
                             document = globalThis.document, signal} = {}) {
    if (!workerUrl) throw new TypeError('Standalone mount requires a Worker URL');
    const transport = new WorkerTransport(new Worker(workerUrl));
    let app;
    const abort = () => { transport.dispose(); app?.dispose(); };
    signal?.addEventListener('abort', abort, {once: true});
    try {
        const {pageId, title} = await transport.open(signal);
        signal?.throwIfAborted();
        document.title = title;
        app = new Gramlot({pageId, element, rootId, document, transport});
        await app.start();
        signal?.throwIfAborted();
        return app;
    } catch (error) {
        transport.dispose();
        app?.dispose();
        throw error;
    } finally {
        signal?.removeEventListener('abort', abort);
    }
}
