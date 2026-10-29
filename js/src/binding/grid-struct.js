import {Bag} from '@genrojs/bag';
import {SourceBag} from '@genrojs/builders';
import {GridStructure} from '../components/grid-structure.js';

/** Convert declarative Source into the one ordinary-Data structure schema. */
function structureData(source) {
    const data = new Bag(), cells = new Bag(), groups = new Bag();
    data.setItem('view_0', new Bag(), {tag:'view'});
    data.getItem('view_0').setItem('rows_0', cells, {tag:'rows'});
    data.setItem('info', new Bag());
    data.getItem('info').setItem('columnsets', groups);
    const addColumn = (node, group = null) => {
        node.builder.validateNode(node);
        if (node.nodeTag !== 'column' || node.staticValue != null) throw new TypeError('grid column must be a scalar declaration');
        const attrs = {tag:'cell'};
        for (const key of ['field', 'name', 'dtype', 'width', 'align', 'format', 'white_space']) {
            if (node.getAttr(key) != null) attrs[key] = node.getAttr(key);
        }
        const label = `cell_${attrs.field}`;
        if (cells.getNode(label)) throw new TypeError(`Duplicate grid field: ${attrs.field}`);
        if (group !== null) attrs.columnset = group;
        cells.setItem(label, null, attrs);
    };
    for (const node of source.getNodes()) {
        if (node.nodeTag === 'column') addColumn(node);
        else if (node.nodeTag === 'colgroup') {
            node.builder.validateNode(node);
            if (!(node.staticValue instanceof SourceBag)) throw new TypeError('grid colgroup requires column declarations');
            const code = node.getAttr('code');
            if (groups.getNode(code)) throw new TypeError(`Duplicate grid colgroup: ${code}`);
            const attrs = {tag:'columnset', code, name:node.getAttr('name') ?? code};
            for (const key of ['background','color']) if (node.getAttr(key) != null) attrs[key] = node.getAttr(key);
            groups.setItem(code, null, attrs);
            for (const column of node.staticValue.getNodes()) addColumn(column, code);
        } else throw new TypeError('grid struct accepts column and colgroup only');
    }
    return data;
}

/** Validate before DataInstaller writes any setters in the incoming branch. */
export function validateGridDeclaration(node) {
    if (node._getMeta('gramlot_component')?.bagStruct) {
        const children = node.staticValue instanceof SourceBag ? node.staticValue.getNodes() : [];
        if (children.some(child => !child._getMeta('gridStruct')) || children.length > 1) throw new TypeError('grid accepts one struct declaration');
        if (children.length && node.getAttr('structpath') != null) throw new TypeError('grid requires structpath or nested struct, not both');
        if (!children.length && !node.getAttr('structpath')) throw new TypeError('grid requires structpath or nested struct');
        if (!['values', 'attributes'].includes(node.getAttr('rowMode'))) throw new TypeError('grid rowMode must explicitly be values or attributes');
    }
    if (!node._getMeta('gridStruct')) return;
    if (!node.parentNode?._getMeta('gramlot_component')?.bagStruct) throw new TypeError('struct requires a grid parent');
    if (!(node.staticValue instanceof SourceBag)) throw new TypeError('grid struct requires column declarations');
    new GridStructure(structureData(node.staticValue));
}

/** DataInstaller consumes this declaration after its one ordinary Data write. */
export function installGridStruct(node, data) {
    const value = structureData(node.staticValue);
    new GridStructure(value);
    const path = `gramlot.grid.${crypto.randomUUID().replaceAll('-', '')}.struct`;
    data.setItem(path, value, null, '>', false, true, node);
    node.parentNode.setAttr({structpath: path}, false);
    node.setValue(null, false);
}
