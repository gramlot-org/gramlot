export function resolve(specifier, context, nextResolve) {
    if (specifier === '@gramlot/collections/layout') return nextResolve('@gramlot/gramlot/components/layout', context);
    if (specifier === '@gramlot/collections/tree') return nextResolve('@gramlot/gramlot/components/tree', context);
    return nextResolve(specifier, context);
}
