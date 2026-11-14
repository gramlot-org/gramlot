/** Prepare portable collection artifacts from JS definitions in an isolated directory. */
import {readFile, writeFile, mkdir, readdir, rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {lowerResourceReferences} from './resource-references.js';
import {wrapper, initializer} from './artifact.js';

const canonical = value => {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k,canonical(value[k])]));
    return value;
};
const json = value => JSON.stringify(canonical(value), null, 2) + '\n';
function keys(value, required, optional = []) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || required.some(k => !Object.hasOwn(value,k)) ||
            Object.keys(value).some(k => !required.includes(k) && !optional.includes(k))) throw new Error('Invalid protocol/config fields');
}
function absolute(value) {
    if (typeof value !== 'string' || !path.isAbsolute(value)) throw new Error('Expected absolute path');
}
function packageName(value) {
    if (typeof value !== 'string' || !/^[A-Za-z_]\w*(\.[A-Za-z_]\w*)*$/.test(value)) throw new Error('Invalid Python package name');
}
/**
 * Keeps the third-party libraries (GC-325 §160) out of the runtime graph, as the runtime build does: a dynamic
 * import of the `local` of a library is the module `@gramlot/libraries/<name>`.
 */
function libraryExternals(coreEntry, libraries) {
    return {name:'library-externals',setup(b){
        let files = null;
        b.onResolve({filter:/.*/},async args=>{
            if (args.kind !== 'dynamic-import' || args.pluginData?.library) return undefined;
            files ??= Promise.all(Object.entries(libraries).map(async ([name, library]) => [(await b.resolve(library.local,
                {kind:'dynamic-import', importer:coreEntry, resolveDir:path.dirname(coreEntry), pluginData:{library:true}})).path, name]))
                .then(entries => new Map(entries));
            const target = await b.resolve(args.path, {kind:args.kind, importer:args.importer, resolveDir:args.resolveDir, pluginData:{library:true}});
            const name = (await files).get(target.path);
            return name === undefined ? undefined : {path:`@gramlot/libraries/${name}`, external:true};
        });
    }};
}
/**
 * Links collection imports to the modules the runtime shares (`sharedModules` of the core).
 *
 * `key` names the shared module an import reaches, `proxy` emits the module that reads it from
 * `@gramlot/gramlot`, `verify` refuses a bundle that still contains a module of the runtime.
 */
async function sharedModuleLinks(coreEntry, sharedModules, manifest) {
    if (!sharedModules) throw new Error(`The core at ${coreEntry} does not export sharedModules; the generator needs a core that does`);
    const coreDirectory = path.dirname(coreEntry);
    const libraries = new Set(Object.keys(sharedModules).filter(key => !key.startsWith('./')));
    const packageOf = specifier => specifier.split('/').slice(0, specifier.startsWith('@') ? 2 : 1).join('/');
    const sharedPackages = new Set([...libraries].map(packageOf));
    // The runtime module graph: any of these files in a collection bundle is a second copy.
    const runtime = await build({entryPoints:[coreEntry],absWorkingDir:coreDirectory,bundle:true,write:false,
        metafile:true,format:'esm',platform:'browser',target:'es2022',logLevel:'silent',
        external:['@gramlot/gramlot/markdown'],plugins:[libraryExternals(coreEntry, manifest)]});
    const runtimeFiles = new Set(Object.keys(runtime.metafile.inputs).map(input => path.resolve(coreDirectory,input)));
    return {
        key(specifier, resolveDir) {
            if (specifier.startsWith('.') || path.isAbsolute(specifier)) {
                const relative = path.relative(coreDirectory, path.resolve(resolveDir, specifier)).split(path.sep).join('/');
                return Object.hasOwn(sharedModules, './' + relative) ? './' + relative : null;
            }
            if (!sharedPackages.has(packageOf(specifier))) return null;
            if (!libraries.has(specifier)) throw new Error(`The runtime does not share ${specifier}; import one of: ${[...libraries].join(', ')}`);
            return specifier;
        },
        proxy(key) {
            const names = Object.keys(sharedModules[key]);
            const named = names.filter(name => name !== 'default' && /^[A-Za-z_$][\w$]*$/.test(name));
            // A pure read per export lets esbuild drop the exports a collection does not use.
            return `import {sharedModules} from '@gramlot/gramlot';\n` +
                `const read = name => sharedModules[${JSON.stringify(key)}][name];\n` +
                named.map(name => `export const ${name} = /* @__PURE__ */ read(${JSON.stringify(name)});\n`).join('') +
                (names.includes('default') ? `export default /* @__PURE__ */ read('default');\n` : '');
        },
        verify(name, metafile, projectRoot) {
            const copies = Object.entries(metafile.inputs)
                .filter(([input]) => !input.includes(':') && runtimeFiles.has(path.resolve(projectRoot, input)))
                .filter(([input]) => Object.values(metafile.outputs).some(output => output.inputs[input]?.bytesInOutput > 0))
                .map(([input]) => path.relative(coreDirectory, path.resolve(projectRoot, input)).split(path.sep).join('/'));
            if (copies.length) throw new Error(`Collection ${name} bundles runtime modules missing from sharedModules: ${copies.join(', ')}`);
        },
    };
}

/**
 * Refuses a collection whose start-up graph (its entry module and the modules it imports statically) contains
 * a third-party package. A third-party library loads on first use through `loadLibrary` of the core (GC-325
 * §160), so it can only sit in a deferred module.
 */
function verifyStartup(name, metafile) {
    const outputs = metafile.outputs;
    const entry = Object.keys(outputs).find(file => outputs[file].entryPoint);
    const seen = new Set(), pending = [entry];
    while (pending.length) {
        const file = pending.pop();
        if (seen.has(file) || !outputs[file]) continue;
        seen.add(file);
        for (const item of outputs[file].imports) if (item.kind === 'import-statement' && !item.external) pending.push(item.path);
    }
    const packages = new Set();
    for (const file of seen) for (const [input, {bytesInOutput}] of Object.entries(outputs[file].inputs)) {
        const match = bytesInOutput > 0 && /(?:^|\/)node_modules\/((?:@[^/]+\/)?[^/]+)/.exec(input);
        if (match) packages.add(match[1]);
    }
    if (packages.size) throw new Error(`Collection ${name} loads third-party packages at start: ${[...packages].sort().join(', ')}; load them on first use with loadLibrary`);
}

export async function generate(request) {
    keys(request,['protocolVersion','operation','configPath','projectRoot','stagingDirectory','config','externals']);
    if (request.protocolVersion !== 1 || !['build','check'].includes(request.operation)) throw new Error('Unsupported generator protocol/operation');
    for (const key of ['configPath','projectRoot','stagingDirectory']) absolute(request[key]);
    keys(request.config,['output','collections'],['externals']);
    if (typeof request.config.output !== 'string' || !Array.isArray(request.config.collections) || !Array.isArray(request.externals)) throw new Error('Invalid configuration');
    const resolver = createRequire(path.join(request.projectRoot,'package.json'));
    const coreEntry = resolver.resolve('@gramlot/gramlot');
    const coreRegistry = path.join(path.dirname(coreEntry),'components/registry.js');
    const {CommandRegistry, collectionBuildId, sharedModules, libraries} = await import(pathToFileURL(coreEntry));
    const shared = await sharedModuleLinks(coreEntry, sharedModules, libraries);
    // The local copy of a UMD build is evaluated as a browser script, as the same file imported from the CDN:
    // without CommonJS and AMD in scope it takes its window-global branch (GC-325 §160).
    const coreResolver = createRequire(coreEntry);
    const scriptFiles = new Set(Object.values(libraries).filter(library => library.format === 'script')
        .map(library => coreResolver.resolve(library.local)));
    // The resolved file of each library `local` (GC-325 §160): a dynamic import of one of them is the library.
    let libraryMap = null;
    const libraryFiles = (b = null) => {
        if (libraryMap) return libraryMap;
        if (!b) throw new Error('Library files are resolved during a build');
        libraryMap = Promise.all(Object.entries(libraries).map(async ([name, library]) => {
            const resolved = await b.resolve(library.local, {kind:'dynamic-import', importer:coreEntry, resolveDir:path.dirname(coreEntry), pluginData:{library:true}});
            if (resolved.errors.length) throw new Error(`Library ${name}: cannot resolve ${library.local}`);
            return [resolved.path, name];
        })).then(entries => new Map(entries));
        return libraryMap;
    };
    const base = path.dirname(request.configPath);
    const resolveEntry = entry => {
        if (typeof entry !== 'string' || !entry) throw new Error('Invalid collection entry');
        return entry.startsWith('.') || path.isAbsolute(entry) ? path.resolve(base,entry) : resolver.resolve(entry);
    };
    const rows = [], byName = new Map(), byEntry = new Map(), byObject = new Map(), imports = new Map();
    for (const config of request.config.collections) {
        keys(config,['entry','pythonPackage']); packageName(config.pythonPackage);
        rows.push({entry:resolveEntry(config.entry), specifier:config.entry, pythonPackage:config.pythonPackage, external:false});
    }
    for (const metadata of request.externals) {
        keys(metadata,['entry','pythonImport','name','buildId','dependencies']);
        if (typeof metadata.pythonImport !== 'string' || !Array.isArray(metadata.dependencies)) throw new Error('Invalid external metadata');
        const parts = metadata.pythonImport.split(':');
        if (parts.length !== 2) throw new Error('Invalid external Python import');
        packageName(parts[0]); packageName(parts[1]);
        rows.push({entry:resolveEntry(metadata.entry), specifier:metadata.entry, metadata, external:true});
    }
    for (const row of rows) {
        row.collection = (await import(pathToFileURL(row.entry))).default;
        const c = row.collection;
        if (!c || typeof c.name !== 'string' || !Array.isArray(c.dependencies)) throw new Error(`Invalid collection: ${row.entry}`);
        if (byName.has(c.name) || byEntry.has(row.entry)) throw new Error(`Duplicate collection mapping: ${c.name}`);
        byName.set(c.name,row); byEntry.set(row.entry,row); byObject.set(c,row);
        imports.set(c.name,row.external ? row.metadata.pythonImport : `${row.pythonPackage}:mygramlot`);
        if (row.external && (c.name !== row.metadata.name || JSON.stringify(c.dependencies.map(d=>d.name)) !== JSON.stringify(row.metadata.dependencies))) {
            throw new Error(`External collection identity/dependencies mismatch: ${c.name}`);
        }
    }
    const ordered = [], visiting = new Set(), visited = new Set();
    function visit(row) {
        if (visiting.has(row)) throw new Error(`Collection cycle: ${row.collection.name}`);
        if (visited.has(row)) return;
        visiting.add(row);
        for (const dependency of row.collection.dependencies) {
            const next = byObject.get(dependency);
            if (!next) throw new Error(`Unmapped collection dependency: ${dependency.name}`);
            visit(next);
        }
        visiting.delete(row);visited.add(row);ordered.push(row);
    }
    for (const row of rows.filter(r=>!r.external)) visit(row);
    const namespaceOwners = new Map(), results = [];
    for (const row of ordered) {
        const commands = new CommandRegistry();
        row.collection.registerCommands({commands});
        row.catalogue = commands.toDocument();
        for (const namespace of Object.keys(row.catalogue.groups)) {
            if (namespaceOwners.has(namespace)) throw new Error(`Duplicate command namespace: ${namespace}`);
            namespaceOwners.set(namespace,row.collection.name);
        }
        if (row.external) continue;
        const c = row.collection;
        const directory = path.join(request.stagingDirectory,...row.pythonPackage.split('.'));
        const assets = path.join(directory,'assets');
        await mkdir(assets,{recursive:true});
        const css = [], named = {}, resources = {};
        const localFile = url => {
            if (!(url instanceof URL) || url.protocol !== 'file:') throw new Error(`Expected local resource URL: ${url}`);
            return fileURLToPath(url);
        };
        for (const [index,url] of c.css.entries()) {
            const relative = `assets/styles/${index}.css`;
            await build({entryPoints:[localFile(url)], outfile:path.join(directory,relative), absWorkingDir:request.projectRoot,
                bundle:true, logLevel:'silent', legalComments:'inline', assetNames:'../files/[name]-[hash]',
                plugins:[{name:'collection-css-files',setup(b){
                    b.onLoad({filter:/.*/},async args => args.path.endsWith('.css') ? undefined :
                        {contents:await readFile(args.path),loader:'file'});
                }}]});
            css.push(relative); resources[url.href] = relative;
        }
        for (const [key,url] of Object.entries(c.assets)) {
            const filename = localFile(url), bytes = await readFile(filename);
            const relative = `assets/files/${createHash('sha256').update(bytes).digest('hex')}-${path.basename(filename)}`;
            await mkdir(path.dirname(path.join(directory,relative)),{recursive:true});
            await writeFile(path.join(directory,relative),bytes); named[key]=relative; resources[url.href] = relative;
        }
        // Lower collection resource metadata at construction time, before callbacks capture the collection.
        // The source remains untouched; the emitted module uses the shared authoring API and emitted URLs.
        const urlExpression = relative => `new URL(${JSON.stringify('./'+relative.slice('assets/'.length))}, import.meta.url)`;
        const resourceModule = `export default {${Object.entries(resources).map(([key,value]) => `${JSON.stringify(value)}:${urlExpression(value)}`).join(',')}};`;
        const lowered = `export * from '@gramlot/gramlot/components';\n`+
            `import resources from 'gramlot-collection-resources';\n`+
            `import {defineCollection as create} from '@gramlot/gramlot/components';\n`+
            `export function defineCollection(options) {\n`+
            `if(options.name!==${JSON.stringify(c.name)}) throw new Error('Unexpected bundled collection');\n`+
            `const css=[${css.map(relative => `resources[${JSON.stringify(relative)}]`).join(',')}], assets={${Object.entries(named).map(([k,v])=>`${JSON.stringify(k)}:resources[${JSON.stringify(v)}]`).join(',')}};\n`+
            `options.css?.forEach((url,index)=>{url.href=css[index].href;});\n`+
            `for(const [key,url] of Object.entries(options.assets??{})) url.href=assets[key].href;\n`+
            `return create({...options,css,assets});\n}\n`;
        // The import of a third-party library on first use (`loadLibrary`) reaches the module of the library in
        // this artifact through `@gramlot/libraries/<name>`, which the import map of the bootstrap resolves: the
        // runtime bundle reaches the same module for the collections it carries (GC-325 §160).
        const used = new Set();
        const linking = {name:'collection-linking',setup(b){
            b.onResolve({filter:/^gramlot-collection-resources$/}, () => ({path:'resources',namespace:'collection-resources'}));
            b.onLoad({filter:/.*/,namespace:'collection-resources'}, () => ({contents:resourceModule,loader:'js'}));
            b.onLoad({filter:/\.[cm]?js$/,namespace:'file'}, async args => scriptFiles.has(args.path) ? {loader:'js',
                contents:`(function (exports, module, define, require) {\n${await readFile(args.path, 'utf8')}\n}).call(globalThis);\n`} : undefined);
            b.onLoad({filter:/\.[cm]?js$/,namespace:'file'}, async args => {
                const source = await readFile(args.path, 'utf8');
                const contents = lowerResourceReferences(source, pathToFileURL(args.path), resources);
                return contents === source ? undefined : {contents,loader:'js'};
            });
            b.onResolve({filter:/.*/,namespace:'shared-module'},args=>({path:args.path,external:true}));
            b.onLoad({filter:/.*/,namespace:'shared-module'},args=>({contents:shared.proxy(args.path),loader:'js'}));
            b.onResolve({filter:/.*/},async args=>{
                if(args.kind==='dynamic-import' && !args.pluginData?.library) {
                    const target=await b.resolve(args.path,{kind:args.kind,importer:args.importer,resolveDir:args.resolveDir,pluginData:{library:true}});
                    const library=(await libraryFiles(b)).get(target.path);
                    if(library) { used.add(library); return {path:`@gramlot/libraries/${library}`,external:true}; }
                }
                if(args.kind!=='entry-point' && args.namespace!=='collection-authoring') {
                    const key=shared.key(args.path,args.resolveDir);
                    if(key) return {path:key,namespace:'shared-module'};
                }
                if(args.path==='markdown-it') return {path:'@gramlot/gramlot/markdown',external:true};
                if(args.path==='@gramlot/gramlot/components' || (args.path.startsWith('.') && path.resolve(args.resolveDir,args.path)===coreRegistry)) return args.namespace==='collection-authoring'
                    ? {path:'@gramlot/gramlot/components',external:true} : {path:'@gramlot/gramlot/components',namespace:'collection-authoring'};
                if(args.kind==='entry-point') return;
                if(args.path==='@gramlot/gramlot' || args.path.startsWith('@gramlot/gramlot/')) {
                    const target=rows.find(candidate=>candidate.specifier===args.path);
                    if(target && target!==row) return {path:`@gramlot/collections/${encodeURIComponent(target.collection.name)}`,external:true};
                    return {path:args.path,external:true};
                }
                let resolved;
                if(args.path.startsWith('.')) resolved=path.resolve(args.resolveDir,args.path);
                else if(path.isAbsolute(args.path)) resolved=args.path;
                else resolved=createRequire(args.importer).resolve(args.path);
                const target=byEntry.get(resolved);
                if(target && target!==row) return {path:`@gramlot/collections/${encodeURIComponent(target.collection.name)}`,external:true};
            });
            b.onLoad({filter:/.*/,namespace:'collection-authoring'},()=>({contents:lowered,loader:'js'}));
        }};
        const options = {outdir:assets,metafile:true,absWorkingDir:request.projectRoot,bundle:true,splitting:true,minify:true,
            format:'esm',platform:'browser',target:'es2022',logLevel:'silent',legalComments:'inline',loader:{'.css':'text'},plugins:[linking]};
        // Keep component-declared import() boundaries in the artifact. Engines are
        // fetched on first use, not downloaded as part of collection activation.
        const built = await build({...options,entryPoints:{collection:row.entry},chunkNames:'modules/[name]-[hash]'});
        // A collection of the runtime bundle reads itself from the runtime: the artifact keeps its libraries only.
        const bundledKey = shared.key(row.entry, path.dirname(row.entry));
        if (!bundledKey) shared.verify(c.name,built.metafile,request.projectRoot);
        verifyStartup(c.name,built.metafile);
        if (bundledKey) {
            await rm(path.join(assets,'modules'),{recursive:true,force:true});
            await writeFile(path.join(assets,'collection.js'),shared.proxy(bundledKey));
        }
        const libraryNames = [...used].sort();
        if (libraryNames.length) {
            const map = await libraryFiles();
            const files = Object.fromEntries(libraryNames.map(name => [name, [...map].find(([,value]) => value === name)[0]]));
            const libraryBuild = await build({...options,outdir:path.join(assets,'libraries'),entryPoints:files,
                entryNames:'[name]',chunkNames:'chunks/[name]-[hash]'});
            shared.verify(c.name,libraryBuild.metafile,request.projectRoot);
        }
        await writeFile(path.join(directory,'grammar.json'),json(c.toDocument()));
        await writeFile(path.join(directory,'commands.json'),json(row.catalogue));
        await writeFile(path.join(assets,'index.js'),wrapper('__GRAMLOT_BUILD_ID__'));
        const content = new Map();
        async function inventory(folder,prefix='') {
            for (const entry of await readdir(folder,{withFileTypes:true})) {
                const relative=prefix+entry.name;
                if(entry.isDirectory()) await inventory(path.join(folder,entry.name),relative+'/');
                else content.set(relative,await readFile(path.join(folder,entry.name)));
            }
        }
        await inventory(assets,'assets/');
        for (const file of ['grammar.json','commands.json']) content.set(file,await readFile(path.join(directory,file)));
        const record={name:c.name,pythonPackage:row.pythonPackage,grammar:'grammar.json',commands:'commands.json',
            module:'assets/index.js',css,dependencies:c.dependencies.map(d=>d.name),
            files:[...content.keys()].sort((a,b)=>Buffer.compare(Buffer.from(a),Buffer.from(b)))};
        record.buildId=await collectionBuildId(record,content);
        await writeFile(path.join(assets,'index.js'),wrapper(record.buildId));
        await writeFile(path.join(directory,'__init__.py'),initializer(record,imports));
        results.push(record);
    }
    return {protocolVersion:1,status:'ok',collections:results,diagnostics:[]};
}
