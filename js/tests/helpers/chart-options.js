import {Bag} from '@genrojs/bag';

const roots = new WeakMap();

/** The address of `options` for ChartRenderer.update: a Data root that holds it at 'seriesOptions'. */
export function optionsAddress(options) {
    if (!roots.has(options)) {
        const data = new Bag();
        data.setItem('seriesOptions', options);
        roots.set(options, data);
    }
    return {data:roots.get(options), path:'seriesOptions'};
}
