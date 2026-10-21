import {toTytx, fromTytx} from '@genrojs/tytx';
import {assertTransportData} from '../references.js';

/** Prepare and snapshot local drag data before a browser gesture is committed. */
export class DragPreparation {
    constructor(renderer) { this.renderer = renderer; }

    prepare(sourceNode, event) {
        const record = this.renderer.records.get(sourceNode);
        if (!record || record.resolved.draggable !== true) return null;
        const context = sourceNode._getMeta('gramlot_component')?.dragSource
            ? record.element.getDragContext(event)
            : {dragValues: {}, item: undefined, path: undefined};
        if (context === null) return null;
        const {dragValues, item, path} = context;
        if (record.resolved.onDrag) {
            const result = this.renderer.html.callLogic(sourceNode, record.resolved.onDrag, {dragValues, item, path});
            if (result && typeof result.then === 'function') {
                throw new TypeError('onDrag must run synchronously');
            }
            if (result === false) return null;
        }
        assertTransportData(dragValues);
        const snapshot = Object.fromEntries(Object.entries(dragValues).map(([type, value]) => {
            if (type.startsWith('text/') || type === 'dragTags') {
                if (typeof value !== 'string') throw new TypeError(`${type} drag data must be text`);
                return [type, value];
            }
            return [type, fromTytx(toTytx(value))];
        }));
        return {dragValues: snapshot, item, path};
    }
}
