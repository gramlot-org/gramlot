/** Fixed wrapper and generated Python initializer; no final-output writes. */
export const wrapper = buildId => `export {default} from "./collection.js";\nexport const buildId = "${buildId}";\n`;
export function initializer(record, imports) {
    const text = JSON.stringify;
    const tuple = values => `(${values.join(', ')}${values.length ? ',' : ''})`;
    const lines = ['from gramlot import GramlotCollection'];
    const dependencies = record.dependencies.map((name, index) => {
        const [module, symbol] = imports.get(name).split(':');
        lines.push(`from ${module} import ${symbol} as _dependency_${index}`);
        return `_dependency_${index}`;
    });
    lines.push('', 'mygramlot = GramlotCollection(', `    name=${text(record.name)},`, '    package=__package__,');
    for (const key of ['grammar','commands','module']) lines.push(`    ${key}=${text(record[key])},`);
    lines.push(`    css=${tuple(record.css.map(text))},`, `    dependencies=${tuple(dependencies)},`,
        `    build_id=${text(record.buildId)},`, `    files=${tuple(record.files.map(text))},`, ')', '');
    return lines.join('\n');
}
