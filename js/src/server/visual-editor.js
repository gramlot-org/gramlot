import {Bag} from '@genrojs/bag';
import {sourceTarget} from '@genrojs/builders';
import {toolIcons} from '../visual-editor-icons.js';

export class VisualEditor {
    constructor(root, {datapath = '__editor', dataRoot = '', editorId = 'visual', uploadOperation = 'import_source', codeDocument = null, ...attributes} = {}) {
        if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(editorId)) throw new Error('editorId must be a literal identifier');
        if (!dataRoot && datapath !== '__editor' && !datapath.startsWith('__editor.')) throw new Error('Root Data editing requires an __editor datapath');
        this.dataRoot = dataRoot;
        const pane = this.pane = root.main({node_label:editorId, datapath, visualEditorId:editorId, ...attributes, nodeId:`${editorId}Editor`, class:`visual-editor-shell ${attributes.class ?? ''}`, overflow:'hidden', tabindex:0, connect_onkeydown:'clipboardShortcut'});
        pane.dataSetter({destination_path:'.uploadQueue', value:new Bag()});
        pane.dataController({func:'initializeEditor', dataRoot:this.dataRoot, _init:true});
        pane.dataController({func:'showProperties', path:'^.selection', _init:true});
        pane.dataController({func:'initializeCanvasSelection', _onBuilt:true});
        pane.dataController({func:'highlightSelection', path:'^.selection', _init:true});
        pane.style('^.appearanceCss');
        pane.dataController({func:'initializeEditorAppearance', _onBuilt:true});
        pane.dataController({func:'applyEditorAppearance', profile:'^.appearanceProfile', palette:'^.appearancePalette', mode:'^.appearanceMode'});
        const rail = this.rail = pane.menu({presentation:'bar', orientation:'vertical', aria_label:'Editor panels', class:'visual-editor-rail'});
        this.toolButton(rail.menuline({group:true, overflowable:false}), 'Source / Data', 'toggleNavigation', toolIcons.navigation);
        this.toolButton(rail.menuline({group:true, overflowable:false}), 'Catalogue', 'openCatalogue', toolIcons.catalogue);
        this.toolButton(rail.menuline({group:true, overflowable:false}), 'Properties', 'openProperties', toolIcons.properties);
        this.toolButton(rail.menuline({group:true, overflowable:false}), 'Clipboard', "this.SET('.clipboardVisible', !this.GET('.clipboardVisible'))", toolIcons.paste);
        rail.spacer({flex:1});
        this.toolButton(rail.menuline({group:true, overflowable:false}), 'Appearance', "this.SET('.appearanceOpen', !this.GET('.appearanceOpen'))", toolIcons.appearance);
        const layoutRoot = pane.framePane({node_label:'layout', height:'100%', id:`${editorId}-editor-frame`, class:'visual-editor-layout'});
        layoutRoot.top.setAttr({height:'38px'});
        const toolbar = layoutRoot.top.menu({presentation:'bar', aria_label:'Editor tools', class:'visual-editor-toolbar'});
        toolbar.menuline({group:true, overflowable:false}).span('Source editor', {class:'visual-editor-brand'});
        const files = toolbar.menuline({group:true, overflowable:false, gap:'4px'});
        for (const [caption,action,icon] of [['New','newPage','new'],['Open','openUpload','open'],['Download','downloadPage','download'],['Copy Source','copySource','copy']])
            this.toolButton(files,caption,action,toolIcons[icon],{id:`${editorId}-${icon}`});
        toolbar.menuline({group:true, overflowable:false}).span({class:'visual-toolbar-divider', aria_hidden:'true'});
        const edit = toolbar.menuline({group:true, overflowable:false, gap:'2px'});
        this.toolButton(edit,'Cut branch','cutBranch',toolIcons.cut,{title:'Cut branch (F8)'});
        this.toolButton(edit,'Copy branch','copyBranch',toolIcons.copy);
        this.toolButton(edit,'Paste branch','pasteBranch',toolIcons.paste,{title:'Paste branch (F9)'});
        toolbar.spacer({flex:1});
        toolbar.menuline({group:true, overflowable:false}).span('^.fileStatus', {role:'status', class:'visual-editor-file-status'});
        toolbar.menuline({group:true, overflowable:false}).span('^.filename', {class:'visual-editor-filename'});
        const left = layoutRoot.left;
        left.setAttr({width:'min(260px, 34vw)', splitter:true,
            drawer:'^.navigationOpen', default_drawer:true, drawer_label:'Source / Data',
            drawer_onclick:"this.SET('.navigationOpen', show ? true : 'close')",
            display:'flex', flex_direction:'column', min_height:0, class:'visual-editor-sidebar'});
        const sidebar = left.borderContainer({height:'100%', flex:1, min_height:0});
        const navigation = sidebar.contentPane({region:'center'}).borderContainer({height:'100%', min_height:0});
        const sourceStack = navigation.contentPane({region:'center'}).borderContainer({height:'100%', min_height:0});
        const source = sourceStack.contentPane({node_label:'source', region:'center', title:'Source', detachable:true,
            display:'flex', flex_direction:'column', min_height:0, overflow:'hidden'});
        this.search(source, 'sourceSearch', 'Search Source');
        source.tree({storepath:`*S.${sourceTarget(pane).fullpath.split('.').slice(1).join('.')}.layout.center.design`, hideValues:true, getLabel:'sourceLabel', searchText:'^.sourceSearch', selectedPath:'^.selection',
            draggable:true, dragTags:`${editorId}Source`, effectAllowed:'all', onDrag:'prepareSource', dropTarget:true,
            dropTypes:'app/widget,app/source,app/clipboard', dropTags:`widget,${editorId}Source,${editorId}Clipboard`, dropEffect:'^.sourceDropEffect', onDrop:'dropNode',
            id:`${editorId}-source-tree`, class:'visual-source-tree', flex:1, min_height:0});
        const shelf = sourceStack.contentPane({node_label:'clipboard', region:'bottom', height:'112px', splitter:true, minSize:80, title:'Clipboard', detachable:true, hidden:'^.clipboardVisible:=!{}', display:'flex', flex_direction:'column',
            min_height:0, overflow:'hidden', dropTarget:true, dropTypes:'app/source', dropTags:`${editorId}Source`,
            dropEffect:'^.clipboardDropEffect', connect_ondragover:'clipboardModifiers', connect_ondrop:'clipboardModifiers',
            onDrop:'dropClipboard', class:'visual-clipboard'});
        shelf.span('Drop a branch here · Option to copy', {class:'visual-editor-hint'});
        shelf.tree({storepath:'.clipboard', hideValues:true, labelAttribute:'name', selectedPath:'^.clipboardSelection',
            draggable:true, dragTags:`${editorId}Clipboard`, effectAllowed:'copy', onDrag:'prepareClipboard',
            id:`${editorId}-clipboard-tree`, class:'visual-clipboard-tree', flex:1, min_height:0});
        shelf.p('^.error', {role:'alert', class:'visual-editor-hint'});
        const data = navigation.contentPane({node_label:'data', region:'bottom', title:'Data', detachable:true, height:'108px', splitter:true, minSize:80, display:'flex', flex_direction:'column', min_height:0, overflow:'hidden'});
        this.search(data, 'dataSearch', 'Search Data');
        data.tree({storepath:this.dataRoot ? `*D.${this.dataRoot}` : '*D', excludeRoot:this.dataRoot ? null : '__editor', searchText:'^.dataSearch', id:`${editorId}-data-tree`, flex:1, min_height:0});
        const center = layoutRoot.center;
        center.setAttr({overflow:'auto', class:'visual-editor-workspace'});
        const design = center.div({node_label:'design', class:'visual-editor-canvas'});
        design.div({node_label:'pageRoot', ...(this.dataRoot ? {datapath:this.dataRoot} : {})});
        const window = pane.floatingPane({title:'Widget catalogue', open:'^.catalogueOpen', default_open:false, width:'320px', height:'480px', movable:true, resizable:true});
        this.search(window.frame.top, 'catalogueSearch', 'Search widgets');
        window.frame.center.tree({storepath:'.catalogue', hideValues:true, labelAttribute:'caption', searchText:'^.catalogueSearch',
            draggable:true, dragTags:'widget', effectAllowed:'all', onDrag:'prepareWidget', id:`${editorId}-widget-tree`});
        const properties = sidebar.contentPane({region:'bottom', height:'^.propertiesHeight', default_height:'240px', minSize:140, splitter:true,
            title:'^.propertiesTitle', detachable:true, hidden:'^.propertiesOpen:=!{}',
            display:'flex', flex_direction:'column', overflow:'hidden', min_height:0});
        properties.div({nodeId:`${editorId}EditorFields`, class:'visual-editor-fields', display:'flex', flex_direction:'column', flex:1, min_height:0}).span('');
        properties.p('^.propertyError', {role:'alert', class:'visual-editor-hint', margin:'8px'});
        const uploader = pane.dialog({title:'Open Source', open:'^.uploadOpen', width:'480px', height:'300px', movable:true, resizable:true});
        uploader.frame.center.uploader({operation:uploadOperation, storepath:'.uploadQueue', accept:'.grmlt',
            multiple:false, autoUpload:true, onComplete:'sourceUploaded', id:`${editorId}-uploader`});
        const naming = pane.dialog({title:'Save branch to clipboard', open:'^.clipboardOpen', width:'380px', height:'210px'});
        naming.frame.center.textbox({value:'^.clipboardDraft.name', lbl:'Name', margin:'12px'});
        naming.frame.center.p('^.error', {role:'alert', margin:'12px'});
        const namingBar = naming.frame.bottom.menu({presentation:'bar', aria_label:'Clipboard commands', padding:'8px 12px'});
        namingBar.spacer({flex:1});
        const namingButtons = namingBar.menuline({group:true, overflowable:false, gap:'8px'});
        namingButtons.button('Cancel', {action:"this.SET('.clipboardOpen', false)"});
        namingButtons.button('Save branch', {action:'saveClipboard'});
        const dialog = pane.dialog({title:'Required parameters', open:'^.insertionOpen', width:'400px', height:'280px', movable:true, resizable:true});
        dialog.frame.center.div({nodeId:`${editorId}InsertFields`, class:'visual-editor-fields', padding:'12px'}).span('');
        dialog.frame.center.p('^.error', {role:'alert'});
        const bar = dialog.frame.bottom.menu({presentation:'bar', aria_label:'Insertion commands', padding:'8px 12px', border_top:'1px solid var(--gramlot-border)'});
        bar.spacer({flex:1});
        const buttons = bar.menuline({group:true, overflowable:false, gap:'8px'});
        buttons.button('Cancel', {action:"this.SET('.insertionOpen', false)"});
        buttons.button('Insert', {action:'insertWidget'});
        const settings = pane.floatingPane({title:'Appearance', open:'^.appearanceOpen', default_open:false, width:'280px', height:'260px', movable:true, resizable:true});
        const form = settings.frame.center.formlet({columns:1, lbl_position:'TL', gap:'10px', padding:'12px'});
        form.filteringSelect({validate_notnull:true, lbl:'Theme', value:'^.appearanceProfile', values:'base:Base,compact:Compact,mimi:Mimi,joanna:Joanna,mela:Mela'});
        form.filteringSelect({validate_notnull:true, lbl:'Colors', value:'^.appearancePalette', values:'default:Theme default,compact:Blue & slate,mimi:Sage & green,joanna:Warm gray & blue'});
        form.filteringSelect({validate_notnull:true, lbl:'Mode', value:'^.appearanceMode', values:'light:Light,dark:Dark'});
        pane.p('^.error', {role:'alert', class:'visual-editor-error', hidden:'^.error:=!{}'});
        this.frame = layoutRoot; this.toolbar = toolbar; this.design = design;
        if (codeDocument !== null) this.codeDocument(codeDocument);
    }
    toolButton(parent, caption, action, icon, attributes = {}) {
        const button = parent.button({aria_label:caption, title:caption, action, class:'button--quiet visual-editor-tool', ...attributes});
        button.span({class:'visual-tool-icon', aria_hidden:'true', style:`mask-image:url("${icon}")`});
        return button;
    }
    codeDocument(document, frame = this.frame) {
        if (!['python', 'javascript'].includes(document.language)) throw new TypeError('Expected a Python or JavaScript page document');
        const pane = this.pane;
        pane.setAttr({codeDocumentKey:document.key});
        pane.dataSetter({destination_path:'.codeDocument', value:new Bag({...document, saved:document.content, busy:false, status:''})});
        const anchor = `#${pane.getAttr('visualEditorId')}Editor`;
        const opener = frame === this.frame ? this.toolbar : frame.top.menu({presentation:'bar', aria_label:'Code drawer'});
        opener.menuline({group:true, overflowable:false}).button('Code', {action:'openCode', class:'button--quiet'});
        const drawer = frame.right;
        drawer.setAttr({datapath:anchor, title:'Page code', detachable:true, width:'60%', minSize:240, splitter:true,
            drawer:'^.codeOpen', default_drawer:'close', drawer_label:'Code', drawer_minimize:false,
            drawer_onclick:"this.SET('.codeOpen', show ? true : 'close')", min_height:0, overflow:'hidden'});
        const code = drawer.framePane({height:'100%', width:'100%', min_width:0, flex:1});
        code.top.setAttr({height:'32px'}); code.bottom.setAttr({height:'58px'});
        code.center.setAttr({display:'flex', flex_direction:'column', min_height:0, overflow:'hidden'});
        code.top.div(document.path, {padding:'8px 12px', font_size:'12px', overflow:'hidden', text_overflow:'ellipsis', white_space:'nowrap'});
        code.center.codeMirror({value:'^.codeDocument.content', language:document.language, live:true, readonly:'^.codeDocument.writable:=!{}', height:'100%', box_height:'100%', box_c_height:'100%', box_min_height:0, box_c_min_height:0, fontSize:13, flex:1, min_height:0});
        code.bottom.div('^.codeDocument.status', {role:'status', font_size:'12px', padding:'4px 10px'});
        const bar = code.bottom.menu({presentation:'bar', aria_label:'Page code commands', padding:'6px 10px'});
        bar.spacer({flex:1});
        const commands = bar.menuline({group:true, overflowable:false, gap:'6px'});
        commands.button('Close', {action:"this.SET('.codeOpen', 'close')"});
        commands.button('Preview saved', {action:'codePreview', disabled:'^.codeDocument.busy'});
        commands.button('Save', {action:'codeSave', disabled:'^.codeSaveDisabled'});
        pane.dataFormula({result_path:'.codeSaveDisabled', formula:'!writable || busy || content === saved',
            writable:'^.codeDocument.writable', busy:'^.codeDocument.busy', content:'^.codeDocument.content', saved:'^.codeDocument.saved', _init:true});
    }
    search(pane, path, label) {
        const bar = pane.menu({presentation:'bar', aria_label:label, class:'visual-search-toolbar'});
        const field = bar.menuline({group:true, overflowable:false, flex:1, min_width:0}).div({class:'visual-search-field'});
        field.span({class:'visual-search-icon', aria_hidden:'true'});
        field.input({type:'search', value:`^.${path}`, default:'', live:true, placeholder:label, aria_label:label});
        field.html_button({type:'button', class:'visual-search-clear', aria_label:`Clear ${label.toLowerCase()}`,
            hidden:`^.${path}:={} === ''`, connect_onclick:`this.SET('.${path}', '')`});
    }
}
