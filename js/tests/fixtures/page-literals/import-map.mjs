// A Node resolve hook that does what the import map of the bootstrap HTML does in a browser: it maps the
// specifiers of `imports` to the URLs given to `register` and resolves nothing else differently.
let imports = {};

export function initialize(data) {
    imports = data.imports;
}

export function resolve(specifier, context, next) {
    return imports[specifier] ? {url: imports[specifier], shortCircuit: true} : next(specifier, context);
}
