import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fromTytx} from '@jsr/genro__tytx';
import {Bag} from '@jsr/genro__bag';
import {SourceBag, SourceBagNode, sourceBagFromTytx, sourceBagToTytx} from '@jsr/genro__builders';
import {GramlotBuilder} from '../src/builder/gramlot-builder.js';
import {GramlotBuilderBag, GramlotBuilderBagNode} from '../src/builder/source.js';

const python = process.env.GRAMLOT_TEST_PYTHON ?? 'python3';
for (const transport of ['json', 'msgpack']) {
    test(`Python ↔ JavaScript preserves typed root/branches and native nodes over ${transport}`, () => {
        const code = `
import sys,base64
import gramlot
from genro_builders.builder import SourceBag,SourceBagNode
from genro_tytx import to_tytx,from_tytx
transport=None if sys.argv[1]=='json' else sys.argv[1]
if sys.argv[2]=='encode':
    source=SourceBag(); children=SourceBag()
    children.set_item('leaf','Hello',node_tag='span')
    source.set_item('section',children,node_tag='section')
    wire=to_tytx(source,transport)
    print(base64.b64encode(wire.encode() if isinstance(wire,str) else wire).decode())
else:
    data=base64.b64decode(sys.stdin.read())
    source=from_tytx(data.decode() if transport is None else data,transport)
    assert isinstance(source,SourceBag)
    node=source.get_node('section')
    assert isinstance(node,SourceBagNode) and node.node_tag=='section'
    assert isinstance(node.value,SourceBag)
    leaf=source.get_node('section.leaf')
    assert isinstance(leaf,SourceBagNode) and leaf.node_tag=='span' and leaf.value=='Hello'
    print('ok')
`;
        const encoded = execFileSync(python, ['-c', code, transport, 'encode'], {encoding: 'utf8'}).trim();
        const bytes = Buffer.from(encoded, 'base64');
        const source = fromTytx(transport === 'json' ? bytes.toString() : bytes, transport === 'json' ? null : transport);
        assert.ok(source instanceof SourceBag);
        const section = source.getNodes()[0];
        assert.ok(section instanceof SourceBagNode);
        assert.ok(section.value instanceof SourceBag);
        assert.equal(section.nodeTag, 'section');
        assert.equal(section.value.getNodes()[0].nodeTag, 'span');
        assert.equal(section.value.getNodes()[0].value, 'Hello');
        const wire = sourceBagToTytx(source, {transport});
        const decoded = execFileSync(python, ['-c', code, transport, 'decode'], {
            input: Buffer.from(wire).toString('base64'), encoding: 'utf8',
        });
        assert.equal(decoded.trim(), 'ok');
    });
}

// S05 fixture: the dataSetter declarations the installer reads cross Python → JavaScript unchanged.
const SETTER_AUTHORING = `
from genro_bag import Bag
from genro_tytx import to_tytx
from gramlot import GramlotBuilder
builder = GramlotBuilder()
payload = Bag()
payload.set_item("a", 1, colore="rosso")
box = builder.root.div(datapath="ctx")
box.dataSetter(".bag", payload, tipo="persona")
box.dataSetter(".literal", "^y", caption="=z", size="\${w}")
box.dataSetter(".nul", None, caption=None)
print(to_tytx(builder.source))
`;

test('Python dataSetter declarations reach JavaScript as Gramlot Source nodes with literal attributes', () => {
    const wire = execFileSync(python, ['-c', SETTER_AUTHORING], {encoding: 'utf8'}).trim();
    const source = sourceBagFromTytx(wire, new GramlotBuilder());
    assert.ok(source instanceof GramlotBuilderBag);
    const [bag, literal, nul] = source.getNodes()[0].value.getNodes();
    for (const node of [bag, literal, nul]) {
        assert.ok(node instanceof GramlotBuilderBagNode);
        assert.equal(node.nodeTag, 'dataSetter');
    }
    const payload = bag.getAttr('value');
    assert.ok(payload instanceof Bag && !(payload instanceof SourceBag));
    assert.deepEqual(payload.getNode('a').getAttr(), {colore: 'rosso'});
    assert.equal(bag.getAttr('tipo'), 'persona');
    assert.deepEqual([literal.getAttr('value'), literal.getAttr('caption'), literal.getAttr('size')], ['^y', '=z', '${w}']);
    const {_meta, ...rest} = nul.getAttr();
    assert.deepEqual(rest, {destination_path: '.nul'});
});
