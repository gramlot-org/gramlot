/** Isolated local HTTP experiment; ordinary RpcHandler/HttpTransport stay unchanged. */
import {Bag, toTytx, fromTytxIter} from '@gramlot/gramlot';

export async function* jsonLines(body, metrics, now = () => performance.now()) {
    const reader = body.getReader(), decoder = new TextDecoder('utf-8', {fatal:true});
    let pending = '', ended = false;
    try {
        while (true) {
            const {value, done} = await reader.read();
            if (done) { pending += decoder.decode(); ended = true; break; }
            metrics.bytes += value.byteLength;
            pending += decoder.decode(value, {stream:true});
            let newline;
            while ((newline = pending.indexOf('\n')) >= 0) {
                const line = pending.slice(0,newline); pending = pending.slice(newline+1);
                if (!line) throw new Error('Empty selection stream record');
                const started = now();
                const record = JSON.parse(line);
                metrics.decode_ms += now()-started;
                yield record;
            }
        }
        if (pending) throw new Error('Incomplete selection stream record');
    } finally {
        try { if (!ended) await reader.cancel(); } finally { reader.releaseLock(); }
    }
}

export async function decodeSelectionStream(body, id, metrics, now = () => performance.now()) {
    const bag = new Bag();
    let started = false, completed = false, count = 0, receipt;
    const source = jsonLines(body,metrics,now);
    // The async iterator decodes each parsed frame without retaining earlier frames.
    let decodeStarted;
    async function* parsed() {
        for await (const frame of source) { decodeStarted = now(); yield frame; }
    }
    for await (const frame of fromTytxIter(parsed())) {
        metrics.decode_ms += now()-decodeStarted;
        if (completed) throw new Error('Data after selection completion');
        if (!started) {
            if (frame.kind !== 'start' || frame.id !== id) throw new Error('Invalid selection stream start');
            started = true; continue;
        }
        if (frame.kind === 'error') throw new Error(frame.message);
        if (frame.kind === 'row') {
            if (!frame.record || typeof frame.record !== 'object' || Array.isArray(frame.record)) throw new Error('Invalid selection row');
            const tick = now();
            bag.setItem(`r${count++}`,null,frame.record);
            metrics.bag_ms += now()-tick;
        } else if (frame.kind === 'end') {
            if (frame.id !== id || frame.count !== count || !Number.isInteger(frame.requested) || count > frame.requested) throw new Error('Invalid selection completion');
            completed = true; receipt = frame;
        } else throw new Error('Unknown selection stream record');
    }
    if (!completed) throw new Error('Selection stream ended without completion');
    return new Bag({rows:bag,count,requested:receipt.requested,query_ms:receipt.query_ms,encode_ms:receipt.encode_ms});
}

export async function loadSelectionTrial({url, pageId, method, limit, signal, fetcher = globalThis.fetch, now = () => performance.now()}) {
    const id = crypto.randomUUID(), metrics = {bytes:0, decode_ms:0, bag_ms:0, search_ms:null};
    const started = now();
    const response = await fetcher(url, {method:'POST', credentials:'same-origin', signal,
        headers:{'Content-Type':'application/json'}, body:toTytx({id,pageId,contentType:'data',name:method,params:{limit}})});
    if (response.status !== 200) throw new Error(`Selection request failed: HTTP ${response.status}`);
    if (!response.headers.get('content-type')?.startsWith('application/x-ndjson')) throw new Error('Expected JSONL response');
    const headersAt = now();
    metrics.headers_ms = headersAt - started;
    const selection = await decodeSelectionStream(response.body, id, metrics, now);
    metrics.receive_ms = now() - headersAt;
    metrics.total_ms = now() - started;
    metrics.query_ms = selection.getItem('query_ms');
    metrics.encode_ms = selection.getItem('encode_ms');
    metrics.count = selection.getItem('count');
    metrics.mb = metrics.bytes / 1e6;
    signal.throwIfAborted();
    return {selection, metrics};
}
