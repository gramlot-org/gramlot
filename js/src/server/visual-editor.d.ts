import type {SourceBagNode} from '@genrojs/builders';
export interface PageCodeDocument {language:'python'|'javascript'; key:string; path:string; content:string; revision:string; writable:boolean;}
export class VisualEditor {
    constructor(parent:SourceBagNode, options?:{datapath?:string; dataRoot?:string; editorId?:string; uploadOperation?:string; codeDocument?:PageCodeDocument; catalogue?:"html"|string[]; fileCommands?:boolean; canvasCss?:string[]; [attribute:string]:unknown});
    pane:SourceBagNode;
    frame:SourceBagNode;
    toolbar:SourceBagNode;
    rail:SourceBagNode;
    design:SourceBagNode;
    codeDocument(document:PageCodeDocument, frame?:SourceBagNode):void;
}
