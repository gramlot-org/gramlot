import {Bag} from '@gramlot/gramlot';
import {pointerTemplate} from '@genrojs/builders';

/** Shared ordered rules. Context supplies activated callbacks/RPC; this module never writes Data. */
const validationRules = ['select', 'notnull', 'empty', 'case', 'len', 'min', 'max', 'email', 'regex', 'call', 'remote'];
const deferredRules = ['nodup', 'exist', 'gridnodup'];
const empty = value => value == null || value === '';
const then = (value, next) => value instanceof Promise ? value.then(next) : next(value);

export function validateInput(value, parameters, context = {}) {
    const result = {value, modified:false, error:null, warnings:[], issues:[], datachanges:[]};
    const validations = Object.fromEntries(Object.entries(parameters).map(([key, val]) => [key.slice(9), val]));
    const configured = name => Object.hasOwn(parameters, `validate_${name}`) && parameters[`validate_${name}`] != null;
    for (const name of deferredRules) if (configured(name)) throw new Error(`validate_${name} requires the DB/grid integration.`);
    const invoke = (name, current, expression = false) => context.invoke(name, parameters[name], {
        ...validations, value:current, result, validations, userChange:true, signal:context.signal
    }, expression);
    const consume = (rule, output) => {
        if (output == null || output === true) return;
        if (typeof output !== 'boolean' && typeof output !== 'string' && (typeof output !== 'object' || Array.isArray(output))) throw new TypeError('A validator returns true, false, null, an error code, or a result object/Bag.');
        const prefix = `validate_${rule}`;
        const response = output instanceof Bag ? Object.fromEntries(output.getNodes().map(node => [node.label, node.value])) : typeof output === 'object' ? output : {errorcode:output === false ? 'error' : output};
        if (Object.hasOwn(response, 'value')) {
            result.modified ||= !Object.is(result.value, response.value);
            result.value = response.value;
        }
        if (response.data != null) { context.checkDataPatch(response.data); result.datachanges.push(response.data); }
        if (!response.errorcode) return;
        const warning = parameters[`${prefix}_iswarning`] ?? response.iswarning
            ?? Boolean(parameters[`${prefix}_warning`] && !parameters[`${prefix}_error`]);
        const message = parameters[`${prefix}_${response.errorcode}`]
            || parameters[`${prefix}_${warning ? 'warning' : 'error'}`]
            || response.message || parameters[`${prefix}_${warning ? 'error' : 'warning'}`] || String(response.errorcode);
        const renderedMessage = pointerTemplate(message, name => name ? ({...validations, ...response, value:result.value})[name] : result.value);
        if (renderedMessage == null) throw new Error('A validation message references a missing value.');
        const issue = {rule, code:response.errorcode, severity:warning ? 'warning' : 'error', message:renderedMessage};
        result.issues.push(issue);
        if (warning) result.warnings.push(renderedMessage);
        else { result.error = renderedMessage; result.required = Boolean(response.required); }
    };
    const step = index => {
        if (context.signal?.aborted) throw context.signal.reason;
        if (result.error || index === validationRules.length) return result;
        const rule = validationRules[index], prefix = `validate_${rule}`, param = parameters[prefix];
        if (!configured(rule) || (param === false && rule !== 'empty')) return step(index + 1);
        const run = allowed => {
            if (!allowed) return step(index + 1);
            let output;
            if (rule === 'remote' && result.value == null) return step(index + 1);
            if (rule === 'call') output = invoke(prefix, result.value);
            else if (rule === 'remote') output = context.remote(param, {...remoteArguments(parameters), value:result.value}, context.signal);
            else output = localRule(rule, param, result.value, context);
            return then(output, answer => {
                if (context.signal?.aborted) throw context.signal.reason;
                const complete = () => { consume(rule, answer); return step(index + 1); };
                if (rule === 'remote' && parameters.validate__onResult) return then(context.invoke('validate__onResult', parameters.validate__onResult,
                    {result:answer, value:result.value, validations, signal:context.signal}), complete);
                return complete();
            });
        };
        const condition = parameters[`${prefix}_if`];
        return then(condition == null ? true : typeof condition === 'boolean' ? condition
            : invoke(`${prefix}_if`, result.value, true), run);
    };
    return step(0);
}

function remoteArguments(parameters) {
    const excluded = new Set(['if', 'error', 'warning', 'iswarning']);
    return Object.fromEntries(Object.entries(parameters).filter(([key]) => key.startsWith('validate_remote_')
        && !excluded.has(key.slice(16))).map(([key, value]) => [key.slice(16), value]));
}
function fail(errorcode, message, extra = {}) { return {errorcode, message, ...extra}; }
function localRule(rule, param, value, context) {
    if (rule === 'select') return context.selection(value);
    if (rule === 'notnull') return empty(value) && param ? fail('notnull', 'A value is required.', {required:true}) : null;
    if (rule === 'empty') return empty(value) ? {value:param} : null;
    if (rule === 'len') {
        if (typeof param !== 'string' || !/^(?:\d+|\d+:\d*|:\d+)$/.test(param)) throw new Error('Invalid validate_len: use a length or min:max.');
        const [low, high] = param.split(':');
        const min = Number(low || 0), max = high === undefined ? min : high === '' ? Infinity : Number(high);
        if (min > max) throw new Error('Invalid validate_len: minimum exceeds maximum.');
        if (empty(value)) return;
        if (typeof value !== 'string') throw new TypeError('validate_len requires a text value.');
        if (value.length < min || value.length > max) return fail(min === max ? 'wrong length' : value.length < min ? 'too short' : 'too long',
            min === max ? `Enter exactly ${min} characters.` : max === Infinity ? `Enter at least ${min} characters.`
                : min === 0 ? `Enter no more than ${max} characters.` : `Enter between ${min} and ${max} characters.`);
        return;
    }
    if (empty(value)) return;
    if (rule === 'case') {
        if (typeof value !== 'string') throw new TypeError('validate_case requires a text value.');
        switch (param) {
        case 'upper': case 'u': return {value:value.toUpperCase()};
        case 'lower': case 'l': return {value:value.toLowerCase()};
        case 'title': case 't': return {value:value.replace(/\p{L}[\p{L}\p{M}]*/gu, word => word[0].toUpperCase() + word.slice(1).toLowerCase())};
        case 'capitalize': case 'c': return {value:value[0].toUpperCase() + value.slice(1).toLowerCase()};
        default: throw new Error('Invalid validate_case: use upper, lower, title or capitalize.');
        }
    }
    if (rule === 'min' || rule === 'max') {
        let comparison;
        if (context.isDecimal?.(value)) comparison = value.comparedTo(param);
        else if (value instanceof Date && param instanceof Date) comparison = value.getTime() - param.getTime();
        else if (typeof value === 'number' && Number.isFinite(value) && typeof param === 'number' && Number.isFinite(param)) comparison = value - param;
        else throw new TypeError(`validate_${rule} requires matching numeric or date/time values.`);
        if (rule === 'min' ? comparison < 0 : comparison > 0) return fail(rule, `Value must be ${rule === 'min' ? 'at least' : 'at most'} ${param}.`);
        return;
    }
    if (rule === 'email') {
        if (typeof value !== 'string') throw new TypeError('validate_email requires a text value.');
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value) ? null : fail('email', 'Check email format.', {iswarning:true});
    }
    if (rule === 'regex') {
        if (typeof value !== 'string' || typeof param !== 'string') throw new TypeError('validate_regex requires text.');
        const pattern = param.trim(), negative = pattern.startsWith('!');
        return new RegExp(negative ? pattern.slice(1) : pattern, 'u').test(value) !== negative ? null : fail('regex', 'The value does not match the required pattern.');
    }
}

/** Shared metadata exports the same rule types to both Builders. */
const text = {dtype:'T', nullable:true, binding:'read'};
const boolean = {dtype:'B', nullable:true, binding:'read'};
const scalar = {dtype:['T','L','N','R','B','D','H','DH','DHZ'], nullable:true, binding:'read'};
export const validationParameters = {
    validate_select:boolean, validate_notnull:{...boolean,default:false}, validate_empty:scalar,
    validate_case:{...text,enum:['upper','lower','title','capitalize','u','l','t','c']},
    validate_len:text, validate_min:scalar, validate_max:scalar, validate_email:boolean,
    validate_regex:text, validate_call:{dtype:'T',nullable:true}, validate_remote:text,
    validate_onAccept:{dtype:'T',nullable:true}, validate_onReject:{dtype:'T',nullable:true},
    validate__onResult:{dtype:'T',nullable:true},
    validate_timeout:{dtype:'L',nullable:true,binding:'read'},
    ...Object.fromEntries(validationRules.flatMap(rule => [
        [`validate_${rule}_if`, {dtype:['T','B'],nullable:true}],
        [`validate_${rule}_iswarning`, boolean],
        ...['error','warning'].map(suffix => [`validate_${rule}_${suffix}`, {...text,qualification:'intl_str'}])
    ]))
};
