/** Map the host's standard-collection URLs in Node bootstrap fixtures. */
import {register} from 'node:module';
import {standardCollections} from '../../dist/standard-collections.js';
register(new URL('./standard-collection-loader.mjs', import.meta.url), {
    data: standardCollections.map(({name, module}) => ({
        name, module, url: new URL(`../../dist/components/${name}/assets/index.js`, import.meta.url).href,
    })),
});
