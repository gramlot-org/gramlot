let collections;
export function initialize(data) { collections = data; }
export function resolve(specifier, context, nextResolve) {
    const collection = collections.find(({name, module}) =>
        specifier === `@gramlot/collections/${name}` || specifier.endsWith(module));
    if (collection) return {url: collection.url, shortCircuit: true};
    return nextResolve(specifier, context);
}
