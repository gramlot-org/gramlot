/* @ts-self-types="./signature.d.ts" */
/**
 * `Signature` and `ReturnValue`: the declared parameters and result of a routed function.
 *
 * @module
 */
import {isDecimal} from '@genrojs/tytx';

const PARAMETERS = Symbol('gramlot.routes.parameters');

const isDate = value => value instanceof Date && !Number.isNaN(value.getTime());

const CHECKS = {
    T: value => typeof value === 'string',
    L: Number.isInteger,
    R: value => typeof value === 'number' && Number.isFinite(value),
    N: isDecimal,
    B: value => typeof value === 'boolean',
    D: isDate,
    DHZ: isDate,
    H: isDate,
};

const checkCode = code => {
    if (!Object.hasOwn(CHECKS, code)) throw new TypeError(`unknown TYTX code '${code}'`);
};

/** A parameter name is an identifier; integer-like keys would lose their declaration order in an object. */
const NAME = /^[A-Za-z_$][\w$]*$/;
const EXTRA_PATH = '_extraPath';

const checkName = name => {
    if (!NAME.test(name) || name === EXTRA_PATH) throw new TypeError(`parameter '${name}': not an admissible name`);
};

/** The named parameters of a routed function: TYTX code, required or default, in declaration order. */
export class Signature {
    constructor(specs = {}) {
        const parameters = [];
        for (const [name, spec] of Object.entries(specs)) {
            checkName(name);
            if (typeof spec === 'string') {
                checkCode(spec);
                parameters.push({name, type: spec, required: true, default: undefined});
            } else if (Array.isArray(spec) && spec.length === 2 && typeof spec[0] === 'string') {
                checkCode(spec[0]);
                if (spec[1] !== null && !CHECKS[spec[0]](spec[1])) {
                    throw new TypeError(`parameter '${name}': the default is not a valid '${spec[0]}' value`);
                }
                parameters.push({name, type: spec[0], required: false, default: spec[1]});
            } else {
                throw new TypeError(`parameter '${name}': a spec is a TYTX code or [code, default]`);
            }
        }
        this[PARAMETERS] = parameters;
    }

    /** The declared specs in order as `{name, type, required, default}`. */
    get parameters() {
        return this[PARAMETERS].map(parameter => ({...parameter}));
    }

    /** A new object of the named values `kw` checked against the declaration, defaults applied; `_extraPath` passes through. */
    bind(kw, {extraPath = kw[EXTRA_PATH]} = {}) {
        const parameters = this.parameters;
        const unknown = Object.keys(kw).filter(key => key !== EXTRA_PATH && !parameters.some(parameter => parameter.name === key));
        if (unknown.length) throw new TypeError(`unknown parameter(s): ${unknown.join(', ')}`);
        const bound = {};
        for (const {name, type, required, default: fallback} of parameters) {
            if (!Object.hasOwn(kw, name)) {
                if (required) throw new TypeError(`missing required parameter '${name}'`);
                bound[name] = fallback;
                continue;
            }
            const value = kw[name];
            const accepted = value === null ? !required && fallback === null : CHECKS[type](value);
            if (!accepted) throw new TypeError(`parameter '${name}' is not a valid '${type}' value`);
            bound[name] = value;
        }
        if (typeof extraPath === 'string' && extraPath !== '') bound[EXTRA_PATH] = extraPath;
        return bound;
    }
}

/** What a routed function returns, documented only: a TYTX code or an object field spec, a media type, a docline. */
export class ReturnValue {
    constructor({type, mediaType, docline} = {}) {
        if (typeof type === 'string') checkCode(type);
        else if (type !== undefined) {
            if (type === null || typeof type !== 'object' || Array.isArray(type)) {
                throw new TypeError('ReturnValue type is a TYTX code or an object of field specs');
            }
            new Signature(type);
        }
        this.type = type;
        this.mediaType = mediaType;
        this.docline = docline;
    }
}
