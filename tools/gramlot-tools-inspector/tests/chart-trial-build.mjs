/** Build trial-only artifacts outside the repository, without changing release bundles. */
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {mkdir} from 'node:fs/promises';
const repo=fileURLToPath(new URL('../../../',import.meta.url));
const require=createRequire(`${repo}/js/package.json`);
const {build}=require('esbuild');
const output='/private/tmp/gramlot-chart-visible';
await mkdir(output,{recursive:true});
const canonical={name:'gramlot-canonical',setup(build){
 build.onResolve({filter:/^\.\/registry\.js$/},args=>args.importer.includes('/components/')?{path:'@gramlot/gramlot/components',external:true}:null);
 build.onResolve({filter:/^\.\/inputs\.js$/},args=>args.importer.endsWith('/components/grid.js')?{path:'@gramlot/collections/inputs',external:true}:null);
}};
await build({absWorkingDir:`${repo}/js`,entryPoints:['./src/components/grid.js'],outfile:`${output}/grid.js`,bundle:true,format:'esm',platform:'browser',target:'es2022',external:['@gramlot/gramlot','@gramlot/gramlot/components','@gramlot/collections/inputs'],plugins:[canonical]});

const {runtimeOptions}=await import(pathToFileURL(`${repo}/js/scripts/runtime-options.mjs`));
await build({...runtimeOptions['gramlot.js'],outfile:`${output}/core.js`});
