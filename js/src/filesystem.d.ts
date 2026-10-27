import type {Bag} from '@genrojs/bag';
import {RemoteResolver} from './binding/remote-resolver.js';
import type {SourceBag, SourceBagNode} from '@genrojs/builders';
import type {Gramlot} from './gramlot.js';
export function fileSystemTree(parent: SourceBag | SourceBagNode, options: {datapath: string; [key:string]:unknown}): SourceBagNode;
export class DirectoryResolver extends RemoteResolver {
    constructor(options: {gramlot:Gramlot; root:string; path?:string; onError:(error:Error)=>void});
    gramlot:Gramlot;
    method:string;
    params:{root:string;path:string};
    children:Set<DirectoryResolver>;
    prepareValue(bag:Bag):Bag;
    readonly closed:boolean;
    loading:Promise<Bag|undefined>|null;
    resolve(options?:{static?:boolean}):Bag|null;
    refresh():Promise<Bag|undefined>|null;
    startLoad(perform: (request: {controller: AbortController; method: string; params: {root: string; path: string}; ignored: boolean}) => Promise<unknown>): Promise<unknown>;
    loadAsync(request: {controller: AbortController; method: string; params: {root: string; path: string}}): Promise<unknown>;
    abort():void;
}
export class FileSystemController {
    constructor(gramlot:Gramlot, source:SourceBagNode);
    open(root:string):Promise<string|null>;
    dispose():void;
}
export class FileSystemLogic {
    fileSystemMount(node:SourceBagNode):void;
    fileSystemOpen(node:SourceBagNode, args:{root:string|null}):Promise<string|null>|undefined;
}
