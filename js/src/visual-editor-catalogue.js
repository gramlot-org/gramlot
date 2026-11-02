import {HtmlBuilder, SourceBag} from '@genrojs/builders';

const htmlTags = new Set(Object.entries(new HtmlBuilder().schema)
    .filter(([, info]) => !info._meta?.data_element && !info._meta?.subbuilder && !info._meta?.container)
    .map(([tag]) => tag));

export function validateCatalogue(catalogue) {
    if (catalogue == null || catalogue === 'html') return;
    if (!Array.isArray(catalogue) || catalogue.some(tag => typeof tag !== 'string' || !tag || tag.trim() !== tag))
        throw new TypeError('catalogue must be "html" or a list of tag names');
    if (!catalogue.includes('div')) throw new Error('catalogue must include div for pageRoot');
}

export function catalogueAllows(catalogue, tag, meta = {}) {
    if (catalogue == null) return true;
    if (Array.isArray(catalogue)) return catalogue.includes(tag);
    return !meta.gramlot_component && !meta.data_element && !meta.subbuilder && !meta.container
        && htmlTags.has(meta.render_tag ?? tag);
}

export function validateCatalogueSource(catalogue, source) {
    if (catalogue == null) return;
    const visit = (bag, prefix) => {
        for (const node of bag.getNodes()) {
            const path = prefix ? `${prefix}.${node.label}` : node.label;
            if (!catalogueAllows(catalogue, node.nodeTag, node.getAttr('_meta') ?? {}))
                throw new Error(`Tag ${node.nodeTag} is outside the editor catalogue at ${path}`);
            if (node.resolver) throw new Error(`Catalogue scope requires materialized Source at ${path}`);
            const value = node.getValue(true);
            if (value instanceof SourceBag) visit(value, path);
        }
    };
    visit(source, '');
}
