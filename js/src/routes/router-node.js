/* @ts-self-types="./router-node.d.ts" */
/**
 * `RouterNode`: the target a path resolves to, called with `call(kw)`.
 *
 * @module
 */
import {fromTytx} from '@genrojs/tytx';
import {Signature} from './signature.js';

const ENTRY = Symbol('gramlot.routes.entry');
const SEGMENT_VALUES = Symbol('gramlot.routes.segmentValues');
const EXTRA_PATH = Symbol('gramlot.routes.extraPath');
const ERRORS = Symbol('gramlot.routes.errors');

/** The text form a segment must have for each TYTX code before it is decoded. */
const SEGMENT_FORMATS = {
    T: /^[\s\S]*$/,
    L: /^[+-]?\d+$/,
    R: /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/,
    N: /^[+-]?(\d+(\.\d*)?|\.\d+)$/,
    B: /^(true|false)$/,
    D: /^\d{4}-\d{2}-\d{2}$/,
    DHZ: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?Z$/,
    H: /^\d{2}:\d{2}:\d{2}(\.\d{3})?$/,
};

/** Decode one path segment with its parameter's TYTX code; a segment out of format or a value the code rejects raises a TypeError. */
const decodeSegment = (segment, {name, type}) => {
    if (!SEGMENT_FORMATS[type].test(segment)) throw new TypeError(`segment '${segment}' is not a '${type}' value`);
    const value = fromTytx(`${segment}::${type}`);
    new Signature({[name]: type}).bind({[name]: value});
    return value;
};

/** Fill the parameters with the segments in declaration order, the rest joined into the extra path; null when a segment does not decode. */
const assignPartial = (parameters, partial) => {
    const values = {};
    try {
        partial.slice(0, parameters.length).forEach((segment, index) => {
            values[parameters[index].name] = decodeSegment(segment, parameters[index]);
        });
    } catch {
        return null;
    }
    return {values, extraPath: partial.slice(parameters.length).join('/')};
};

/** The entry a path resolves to, with the unconsumed segments assigned to its parameters. */
export class RouterNode {
    constructor(router, {entryName, path = null, partial = [], errors = router.errors} = {}) {
        this.router = router;
        this[ERRORS] = errors;
        this.path = path;
        const entry = router.entries.get(entryName ?? router.defaultEntry);
        const assigned = entry ? assignPartial(entry.signature.parameters, partial) : null;
        this[ENTRY] = assigned ? entry : null;
        this[SEGMENT_VALUES] = assigned?.values ?? {};
        this[EXTRA_PATH] = assigned?.extraPath ?? '';
        this.error = this[ENTRY] ? null : 'not_found';
    }

    /** `name`, `docline`, `meta` and `result` of the entry; empty when the node has no entry. */
    get metadata() {
        const entry = this[ENTRY];
        if (!entry) return {};
        return {name: entry.name, docline: entry.docline, meta: entry.meta, result: entry.result};
    }

    /** Invoke the entry with the segment values over `kw` (the path wins); returns the handler result as is. */
    call(kw = {}) {
        const selector = this.path ? `${this.router.name}:${this.path}` : this.router.name;
        const entry = this[ENTRY];
        if (this.error) throw new this[ERRORS][this.error](selector);
        let bound;
        try {
            bound = entry.signature.bind({...kw, ...this[SEGMENT_VALUES]}, {extraPath: this[EXTRA_PATH]});
        } catch (error) {
            const SignatureError = this[ERRORS].signature_error;
            if (SignatureError === TypeError) throw error;
            throw new SignatureError(selector, {cause: error});
        }
        return entry.original.call(this.router.instance, bound);
    }
}
