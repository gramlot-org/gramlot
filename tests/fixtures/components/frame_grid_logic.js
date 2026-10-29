/** Qualification commands use the receiving grid's relative Data, never DOM state. */
export class Logic {
    updateFirst(node) {
        const first = node.getRelativeData('.rows').getNodes()[0];
        if (!first) return;
        if (node.getAttr('rowMode') === 'values') first.staticValue.setItem('price', 99.5);
        else first.setAttr({price: 99.5});
        node.setRelativeData('.status', 'First price updated');
    }
    removeLast(node) {
        const rows = node.getRelativeData('.rows'), last = rows.getNodes().at(-1);
        if (!last) return;
        rows.popNode(last.label);
        node.setRelativeData('.status', 'Last row removed');
    }
}
