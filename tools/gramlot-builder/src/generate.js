/** Prepare portable collection artifacts from JS definitions in an isolated directory. */
import {readFile, writeFile, mkdir, readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
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
export async function generate(request) {
    keys(request,['protocolVersion','operation','configPath','projectRoot','stagingDirectory','config','externals']);
    if (request.protocolVersion !== 1 || !['build','check'].includes(request.operation)) throw new Error('Unsupported generator protocol/operation');
    for (const key of ['configPath','projectRoot','stagingDirectory']) absolute(request[key]);
    keys(request.config,['output','collections'],['externals']);
    if (typeof request.config.output !== 'string' || !Array.isArray(request.config.collections) || !Array.isArray(request.externals)) throw new Error('Invalid configuration');
    const resolver = createRequire(path.join(request.projectRoot,'package.json'));
    const coreEntry = resolver.resolve('@gramlot/gramlot');
    const coreRegistry = path.join(path.dirname(coreEntry),'components/registry.js');
    const {CommandRegistry, collectionBuildId} = await import(pathToFileURL(coreEntry));
    const base = path.dirname(request.configPath);
    const resolveEntry = entry => {
        if (typeof entry !== 'string' || !entry) throw new Error('Invalid collection entry');
        return entry.startsWith('.') || path.isAbsolute(entry) ? path.resolve(base,entry) : resolver.resolve(entry);
    };
    const rows = [], byName = new Map(), byEntry = new Map(), byObject = new Map(), imports = new Map();
    for (const config of request.config.collections) {
        keys(config,['entry','pythonPackage']); packageName(config.pythonPackage);
        rows.push({entry:resolveEntry(config.entry), pythonPackage:config.pythonPackage, external:false});
    }
    for (const metadata of request.externals) {
        keys(metadata,['entry','pythonImport','name','buildId','dependencies']);
        if (typeof metadata.pythonImport !== 'string' || !Array.isArray(metadata.dependencies)) throw new Error('Invalid external metadata');
        const parts = metadata.pythonImport.split(':');
        if (parts.length !== 2) throw new Error('Invalid external Python import');
        packageName(parts[0]); packageName(parts[1]);
        rows.push({entry:resolveEntry(metadata.entry), metadata, external:true});
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
        const css = [], named = {};
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
            css.push(relative);
        }
        for (const [key,url] of Object.entries(c.assets)) {
            const filename = localFile(url), bytes = await readFile(filename);
            const relative = `assets/files/${createHash('sha256').update(bytes).digest('hex')}-${path.basename(filename)}`;
            await mkdir(path.dirname(path.join(directory,relative)),{recursive:true});
            await writeFile(path.join(directory,relative),bytes); named[key]=relative;
        }
        // Lower collection resource metadata at construction time, before callbacks capture the collection.
        // The source remains untouched; the emitted module uses the shared authoring API and emitted URLs.
        const urlExpression = relative => `new URL(${JSON.stringify('./'+relative.slice('assets/'.length))}, import.meta.url)`;
        const lowered = `export * from '@gramlot/gramlot/components';\n`+
            `import {defineCollection as create} from '@gramlot/gramlot/components';\n`+
            `export function defineCollection(options) {\n`+
            `if(options.name!==${JSON.stringify(c.name)}) throw new Error('Unexpected bundled collection');\n`+
            `const css=[${css.map(urlExpression).join(',')}], assets={${Object.entries(named).map(([k,v])=>`${JSON.stringify(k)}:${urlExpression(v)}`).join(',')}};\n`+
            `options.css?.forEach((url,index)=>{url.href=css[index].href;});\n`+
            `for(const [key,url] of Object.entries(options.assets??{})) url.href=assets[key].href;\n`+
            `return create({...options,css,assets});\n}\n`;
        await build({entryPoints:[row.entry],outfile:path.join(assets,'collection.js'),absWorkingDir:request.projectRoot,
            bundle:true,format:'esm',platform:'browser',target:'es2022',logLevel:'silent',legalComments:'inline',loader:{'.css':'text'},
            plugins:[{name:'collection-linking',setup(b){
                b.onResolve({filter:/.*/},async args=>{
                    if(args.path==='@gramlot/gramlot/components' || (args.path.startsWith('.') && path.resolve(args.resolveDir,args.path)===coreRegistry)) return args.namespace==='collection-authoring'
                        ? {path:'@gramlot/gramlot/components',external:true} : {path:'@gramlot/gramlot/components',namespace:'collection-authoring'};
                    if((args.path==='@gramlot/gramlot' || args.path.startsWith('@gramlot/gramlot/'))) return {path:args.path,external:true};
                    if(args.kind==='entry-point') return;
                    let resolved;
                    if(args.path.startsWith('.')) resolved=path.resolve(args.resolveDir,args.path);
                    else if(path.isAbsolute(args.path)) resolved=args.path;
                    else resolved=createRequire(args.importer).resolve(args.path);
                    const target=byEntry.get(resolved);
                    if(target && target!==row) return {path:`@gramlot/collections/${encodeURIComponent(target.collection.name)}`,external:true};
                });
                b.onLoad({filter:/.*/,namespace:'collection-authoring'},()=>({contents:lowered,loader:'js'}));
            }}]});
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
