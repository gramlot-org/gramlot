// Runs `typed-literals.js` as a browser does: `@gramlot/gramlot/page` is mapped to the built runtime
// (dist/gramlot.js), not to src/server/page.js. Prints `{text, onRuntime}`: the TYTX text of the Source that
// `main` builds with the builder of the runtime, and whether the page class extends the class of the runtime.
// Usage: node browser-context.mjs RUNTIME_URL
import {register} from 'node:module';

const runtimeUrl = process.argv[2];
register('./import-map.mjs', {parentURL: import.meta.url, data: {imports: {'@gramlot/gramlot/page': runtimeUrl}}});
const runtime = await import(runtimeUrl);
const {Page} = await import('./typed-literals.js');
const builder = new Page.sourceBuilder('main');
new Page().main(builder.root);
console.log(JSON.stringify({text: builder.toTytx(), onRuntime: Object.getPrototypeOf(Page) === runtime.Page}));
