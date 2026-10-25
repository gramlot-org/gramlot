import type {Bag} from '@genrojs/bag';
import type {DomElement} from './dom.d.ts';
import type {SourceBagNode} from '@genrojs/builders';
import type {Gramlot} from './gramlot.js';
/** Export as the page's Logic; constructor-free methods are registered by Gramlot. */
export class IdeLogic {
    page: Gramlot;
    fileSystemMount(node:SourceBagNode):void;
    fileSystemOpen(node:SourceBagNode,args:{root:string|null}):Promise<string|null>|undefined;
    ideMount(node:SourceBagNode):void;
    ideOpenWorkspace():void;
    ideDocumentState(key:string):void;
    ideOpenDocument(root:string,path:string):Promise<void>;
    ideNew():void;
    ideShowDocument(key:string):void;
    ideRenderRecipe(node:SourceBagNode,args:{documentKey:string}):Promise<void>;
    ideCancelCreate(node:SourceBagNode,args:{documentKey:string}):void;
    ideCreate(node:SourceBagNode,args:{documentKey:string}):Promise<void>;
    ideSave(node?:SourceBagNode,args?:{documentKey?:string|null}):Promise<void>;
    ideRevert(node:SourceBagNode,args:{documentKey:string}):void;
    ideUndo(node:SourceBagNode,args:{documentKey:string}):void;
    ideRedo(node:SourceBagNode,args:{documentKey:string}):void;
    ideHistoryChanged(node:SourceBagNode,args:{canUndo:boolean,canRedo:boolean}):void;
    ideHistoryState(document:Bag):void;
    ideEditor(documentKey:string):DomElement;
    ideClose(node:SourceBagNode):boolean;
    ideClosed(node:SourceBagNode,args:{pageName:string}):void;
    ideForgetDocument(key:string,discard?:boolean):void;
}
