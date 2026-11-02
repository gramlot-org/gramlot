/** Scalar editor contract. Containers and unsupported objects remain inspectable. */
export const editorTypes = ['string', 'number', 'integer', 'boolean', 'date', 'time', 'datetime', 'null'];

export function scalarType(value) {
    if (value === null) return 'null';
    if (['string', 'boolean'].includes(typeof value)) return typeof value;
    if (typeof value === 'number' && Number.isFinite(value)) return Number.isSafeInteger(value) ? 'integer' : 'number';
    if (value instanceof Date && Number.isFinite(value.getTime())) {
        const iso = value.toISOString();
        return iso.slice(0, 10) === '1970-01-01' ? 'time' : iso.endsWith('T00:00:00.000Z') ? 'date' : 'datetime';
    }
    return null;
}

export function scalarText(value, type) {
    if (type === 'null') return '';
    if (value instanceof Date) {
        const iso = value.toISOString();
        return type === 'date' ? iso.slice(0, 10) : type === 'time' ? iso.slice(11, 23) : iso;
    }
    return String(value);
}

export function parseScalar(type, text) {
    if (type === 'string') return text;
    if (type === 'null') return null;
    if (type === 'boolean' && ['true', 'false'].includes(text)) return text === 'true';
    if (type === 'number' || type === 'integer') {
        if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(text.trim())) {
            const value = Number(text);
            if (Number.isFinite(value) && (type !== 'integer' || Number.isSafeInteger(value))) return value;
        }
    }
    if (['date', 'time', 'datetime'].includes(type)) {
        const pattern = type === 'date' ? /^\d{4}-\d{2}-\d{2}$/
            : type === 'time' ? /^\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/
            : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?Z$/;
        if (pattern.test(text)) {
            const input = type === 'date' ? `${text}T00:00:00Z` : type === 'time' ? `1970-01-01T${text}Z` : text;
            const date = new Date(input);
            if (Number.isFinite(date.getTime())) {
                // Reject Date's normalization of invalid calendar dates and 24:00.
                const iso = date.toISOString();
                const supplied = input.replace(/Z$/, '').split(/[T:.]/);
                const actual = iso.replace(/Z$/, '').split(/[T:.]/);
                if (supplied.every((part, index) => index === 4 ? Number(part.padEnd(3, '0')) === Number(actual[index]) : part === actual[index])) return date;
            }
        }
    }
    throw new Error(`Invalid ${type} value: ${text || '(empty)'}`);
}

/** Read the portable component contract from a real Source node. */
export function readParameterEnums(node) {
    return Object.fromEntries(Object.entries(node._getMeta('gramlot_component')?.parameters ?? {})
        .filter(([, spec]) => spec.enum).map(([name, spec]) => [name, spec.enum]));
}
