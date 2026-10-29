/** Reusable remote Source fragments, independently activated as a collection. */
import {defineComponent, defineCollection} from './registry.js';
import {Container} from './container.js';
import {GroupletCard} from './grouplet-card.js';
export {GroupletCard};

export const Grouplet = defineComponent({
    name: 'grouplet', tag: 'gramlot-grouplet', base: Container, subTags: '*',
    parameters: {
        remote: {dtype: 'T', nullable: true, binding: 'read'},
    },
    // Source owns children and Data scope. RemoteBinding owns loading and cleanup;
    // the component must not start a second request from its DOM lifecycle.
    implementation: Base => class extends Base {},
});

export default defineCollection({name: 'grouplets', components: [Grouplet, GroupletCard]});
