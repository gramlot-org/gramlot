/** Local choices share the same code:caption grammar in editors and groups. */
export function parseChoices(values) {
    if (values === '') return [];
    const ids = new Set();
    return values.split(',').map(item => {
        const colon = item.indexOf(':');
        const id = colon < 0 ? item : item.slice(0, colon);
        const caption = colon < 0 ? item : item.slice(colon + 1);
        if (!id || ids.has(id)) throw new Error('Invalid or duplicate choice code');
        ids.add(id);
        return {id, caption};
    });
}
