/** Node equivalent of the host-provided collection import map, for bundle tests. */
let imports;
export function initialize(data) { imports = data; }
export function resolve(specifier, context, nextResolve) {
    if (Object.hasOwn(imports, specifier)) return {url: imports[specifier], shortCircuit: true};
    return nextResolve(specifier, context);
}
