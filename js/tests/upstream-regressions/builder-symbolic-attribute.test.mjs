import test from 'node:test';
import assert from 'node:assert/strict';
import {BuilderBase, SourceBag} from '@jsr/genro__builders';

for (const symbol of ['FORM', 'ANCHOR', 'target']) {
    test(`symbolic #${symbol} reads preserve the attribute selector`, () => {
        const builder = new BuilderBase();
        const scope = new SourceBag(null, builder);
        builder.source.setItem('scope', scope, {
            datapath: 'main.form', form: true, _anchor: true, node_id: 'target',
        });
        const node = scope.setItem('reader', null);
        builder.data.setItem('main.form.x', 'value', {caption: 'Caption'});
        assert.equal(node.GET('main.form.x?caption'), 'Caption');
        assert.equal(node.absDatapath(`#${symbol}.x?caption`), 'main.form.x?caption');
        assert.equal(node.GET(`#${symbol}.x?caption`), 'Caption');
    });
}
