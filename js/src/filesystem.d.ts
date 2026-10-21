import type {Bag} from '@genrojs/bag';
import type {SourceBag, SourceBagNode} from '@genrojs/builders';
import type {Gramlot} from './gramlot.js';
export function fileSystemTree(parent: SourceBag | SourceBagNode, options: {datapath: string; [key:string]:unknown}): SourceBagNode;
export class DirectoryResolver {
    constructor(options: {gramlot:Gramlot; root:string; path?:string; onError:(error:Error)=>void});
    prepareValue(bag:Bag):Bag;
    readonly closed:boolean;
    loading:Promise<Bag>|null;
    resolve():Bag|null;
    refresh():Promise<Bag>|null;
    abort():void;
}
export class FileSystemController {
    constructor(gramlot:Gramlot, state:Bag);
    open(root:string):Promise<string|null>;
    dispose():void;
}
export class FileSystemLogic {
    fileSystemMount(node:SourceBagNode):void;
    fileSystemOpen(node:SourceBagNode, args:{root:string|null}):Promise<string|null>|undefined;
}
