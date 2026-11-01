import {Bag} from '@genrojs/bag';
import {isDecimal} from '@genrojs/tytx';
import {invokeHook} from './hooks.js';

/** Source-scoped validation services, retained independently of the control view. */
export function validationContext(binding) {
    const node = binding.node, app = binding.runtime.gramlot;
    const invoke = (attribute, code, keywords, expression = false) => {
        if (!expression) return invokeHook(binding.runtime, node, attribute, code, keywords);
        return binding.runtime.inlineCompiler.compile(node, attribute, code, Object.keys(keywords),
            `return (${code});`)(keywords);
    };
    return {
        isDecimal, invoke,
        remote:(method, keywords, signal) => app.rpc.call('data', method, keywords, {signal}),
        reportError:(error, title) => { if (!binding.closed) binding.runtime.reportError(error,title); },
        validationCurrent:() => {
            const pointer = node.getAttr('value');
            const path = node.pointerType(pointer) ? node.absDatapath(pointer) : null;
            return () => !binding.closed && node.getAttr('value') === pointer && (path === null || node.absDatapath(pointer) === path);
        },
        finishValidation:({ok, result, rules}) => {
            if (binding.closed) return;
            if (ok) for (const patch of result.datachanges) node.getRelativeData('.').update(patch);
            const attribute = ok ? 'validate_onAccept' : 'validate_onReject';
            if (rules[attribute]) {
                const report = error => { if (!binding.closed) binding.runtime.reportError(error, 'Validation callback failed'); };
                try {
                    const validations = Object.fromEntries(Object.entries(rules).map(([key, value]) => [key.slice(9), value]));
                    const returned = invoke(attribute, rules[attribute], {value:result.value, result, validations, userChange:true});
                    if (returned instanceof Promise) returned.catch(report);
                } catch (error) { report(error); }
            }
        },
        checkDataPatch:patch => {
            if (!(patch instanceof Bag)) throw new TypeError('Validation data changes must be a Bag.');
            if (!(node.getRelativeData('.') instanceof Bag)) throw new TypeError('Validation data changes require a Bag datapath.');
        }
    };
}
