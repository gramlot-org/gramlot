/** Native module caching shares the code; it does not share mutable parser options. */
export function loadMarkdown() {
    return import('@gramlot/gramlot/markdown');
}
