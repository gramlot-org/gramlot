/** Replace declared source resource constructors with the emitted resource URLs. */
import {parse} from 'acorn';

export function lowerResourceReferences(source, moduleUrl, resources) {
    if (!source.includes('import.meta.url')) return source;
    let binding = 'collectionResources';
    while (source.includes(binding)) binding += '_';
    const edits = [];
    function visit(node) {
        if (!node || typeof node !== 'object') return;
        if (node.type === 'NewExpression' && node.callee.name === 'URL' && node.arguments.length === 2) {
            const [path, base] = node.arguments;
            if (path.type === 'Literal' && typeof path.value === 'string' &&
                base.type === 'MemberExpression' && !base.computed && base.property.name === 'url' &&
                base.object.type === 'MetaProperty' && base.object.meta.name === 'import') {
                const key = new URL(path.value, moduleUrl).href;
                if (Object.hasOwn(resources, key)) {
                    edits.push({start:node.start, end:node.end, text:`${binding}[${JSON.stringify(resources[key])}]`});
                    return;
                }
            }
        }
        for (const value of Object.values(node)) {
            if (Array.isArray(value)) value.forEach(visit);
            else if (value && typeof value === 'object') visit(value);
        }
    }
    visit(parse(source, {ecmaVersion:'latest',sourceType:'module'}));
    if (!edits.length) return source;
    for (const edit of edits.sort((a,b) => b.start - a.start))
        source = source.slice(0,edit.start) + edit.text + source.slice(edit.end);
    return `import ${binding} from 'gramlot-collection-resources';\n` + source;
}
