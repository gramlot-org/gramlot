import {BagResolver} from '@genrojs/bag';
import {sourceAttributeItems, pointerTransform, pointerTemplate, pointerExpression} from '@genrojs/builders';
import {isExpression} from '../renderer/attributes.js';

/** Structural attributes (not projected by Builder) may use a parent context, notably
 * variable datapath. Reuse Builder's grammar; only the contextual reads and the `:=`
 * compilation belong here. Visual attributes go through Builder.runtimeValues. A `==`
 * attribute is a null input, as in Builder.runtimeValues: `==` is computed after the
 * suffixes, by the renderer, with InlineCompiler.compileExpression (constitution 11.48 item 11). */
function attributeReader(node, items, context = node) {
    const values = new Map(), active = new Set();
    // Resolve the complete Source attribute set before applying any suffix. Projection
    // and named references share these typed values; the DOM is never an input.
    const current = new Map();
    for (const [name, raw] of items) {
        if (typeof name !== 'string') continue;
        const pointer = pointerTransform(raw)?.pointer ?? raw;
        current.set(name, pointer instanceof BagResolver ? pointer.resolve()
            : node.pointerType(pointer) ? context.getRelativeData(pointer) : isExpression(pointer) ? null : pointer);
    }
    const resolve = name => {
        if (values.has(name)) return values.get(name);
        if (!items.has(name)) throw new Error(`Source attribute '${name}' does not exist`);
        if (active.has(name)) throw new Error(`cyclic attribute dependency: ${[...active, name].join(' -> ')}`);
        active.add(name);
        const raw = items.get(name), transform = pointerTransform(raw);
        const leading = transform ? current.get(name) : null;
        let result;
        const read = key => {
            if (!key) return leading;
            return resolve(key);
        };
        try {
            if (transform) {
                if (transform.expression) {
                    const expression = pointerExpression(transform.body);
                    // Validate references even in static output; JavaScript only executes in the browser.
                    const inputs = expression.slots.map(read);
                    result = node.rootBuilder.evaluatePointerExpression(node, name, raw, expression, inputs);
                } else {
                    result = pointerTemplate(transform.body, read);
                    // A null leading pointer blocks even a constant template.
                    if (leading == null) result = null;
                }
            } else {
                result = current.get(name);
            }
            values.set(name, result);
            return result;
        } finally { active.delete(name); }
    };
    return {resolve};
}

/** Resolve a control/structural attribute with the same rules as visual projection. */
export function resolvePointerAttribute(node, name, context = node) {
    const items = new Map([...Object.entries(node.getAttr()), ...sourceAttributeItems(node.getAttr())]);
    return attributeReader(node, items, context).resolve(name);
}
