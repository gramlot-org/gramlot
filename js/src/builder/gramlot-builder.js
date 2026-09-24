import {HtmlBuilder, SourceBagNode, sourceTarget} from '@jsr/genro__builders';
import {toTytx} from '@jsr/genro__tytx';

/** Gramlot vocabulary and inert authoring on the shared builder grammar. */
export class GramlotBuilder extends HtmlBuilder {
    static _name = 'gramlot';

    constructor(name = null, {collections = []} = {}) {
        super(name);
        for (const collection of collections) this.loadCollection(collection);
    }
    loadCollection(document) {
        this.loadGrammar(document);
        return this;
    }
    create() { this.setup(this.data); this.main(this.root); }
    computeLogic() {} // Browser declarations are not executed by server authoring.

    /** Preserve mixed leading text when a scalar element gains children. */
    promoteNodeValue(node, oldValue, branch) {
        const attributes = oldValue !== null && oldValue !== undefined
            ? {_text: String(oldValue)} : null;
        node.setValue(branch, true, attributes, true);
    }

    /** Create a transportable reference descriptor for an authored node. */
    reference(node, kind = 'node') {
        node = sourceTarget(node);
        if (!(node instanceof SourceBagNode) || !['node', 'dom'].includes(kind)) {
            throw new TypeError('Reference requires an element and node/dom kind');
        }
        let id = node.getAttr('__ref');
        if (id === null || id === undefined) {
            id = crypto.randomUUID().replaceAll('-', '');
            node.setAttr({__ref: id});
        }
        return {$gramlotRef: id, kind};
    }

    toTytx() { return toTytx(this.source); }
}
