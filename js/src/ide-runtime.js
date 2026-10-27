import {randomId} from './random-id.js';
import {sourceTarget} from '@genrojs/builders';
import {FileSystemLogic} from './filesystem.js';
import {IdeDocuments, RecentWorkspaces} from './ide-documents.js';
import {codeMirrorWithOptions} from './components/editor-options.js';

/** Resolve the owner through Source ancestry, independently of DOM placement. */
function ideContext(node) {
    for (let scope = node; scope; scope = scope.parentNode) {
        const context = scope.ideContext;
        if (context) return context;
    }
    throw new Error('IDE operation requires a node inside a mounted IDE');
}

/** Reusable IDE coordination uses Source for panels and Data for all document state. */
export class IdeLogic {
    fileSystemMount(node) { return FileSystemLogic.prototype.fileSystemMount.call(this,node); }
    fileSystemOpen(node, args) { return FileSystemLogic.prototype.fileSystemOpen.call(this,node,args); }
    ideMount(node) {
        const scope = node.parentNode;
        const context = {scope, documents:new IdeDocuments(this.page,scope), requested:0,
            editorPrefix:`ide_${randomId()}`, recent:new RecentWorkspaces(this.page.src.renderer.destination.ownerDocument.defaultView.sessionStorage)};
        Object.defineProperty(scope,'ideContext',{value:context,configurable:true});
        const {documents, recent} = context;
        const state = scope.getRelativeData('.');
        const roots = recent.read();
        state.setItem('recent',recent.choices(roots));
        state.setItem('workspace',roots[0] ?? '');
        const browser = state.getItem('browser');
        browser.subscribe('ide-browser',{any:event => {
            if (event.node === browser.getNode('root')) {
                const root = browser.getItem('root');
                state.setItem('workspace',root);
                state.setItem('recent',recent.choices(recent.remember(root)));
                state.setItem('status',`Workspace: ${root}`);
            } else if (event.node === browser.getNode('selectedPath')) {
                const path = browser.getItem('selectedPath');
                const item = path === null ? null : browser.getItem('store').getNode(path);
                if (item && !item.attr.is_directory) void this.ideOpenDocument(scope,browser.getItem('root'),item.attr.path);
            }
        }});
        const documentBag = documents.documents;
        documentBag.subscribe('ide-documents',{any:event => {
            if (!['content','saved','busy','writable','view','isNew','path','root'].includes(event.node.label)) return;
            for (const pane of scope.value.getNode('frame.center.tabs').value?.getNodes() ?? []) {
                const key = pane.getAttr('documentKey');
                const doc = documents.documents.getItem(key);
                if (doc) {
                    if (event.node === doc.getNode('content')) documents.invalidateRecipe(key);
                    this.ideDocumentState(scope,key);
                    pane.setAttr({title:`${documents.dirty(key) ? '● ' : ''}${doc.getItem('path')}`});
                }
            }
        }});
        this.page.src.renderer.onDispose(context.scope,() => {
            browser.unsubscribe('ide-browser',{any:true});
            documentBag.unsubscribe('ide-documents',{any:true});
            documents.dispose();
        });
    }
    ideOpenWorkspace(node) {
        const context = ideContext(node);
        const state = context.scope.getRelativeData('.');
        const root = state.getItem('workspace');
        if (root && root !== state.getItem('browser.root')) state.setItem('browser.requestedRoot',root);
    }
    ideDocumentState(node, key) {
        const context = ideContext(node), {documents} = context;
        const doc = documents.documents.getItem(key);
        const disabled = (!documents.dirty(key) && !doc.getItem('isNew')) || doc.getItem('busy');
        doc.setItem('saveDisabled',Boolean(disabled || !doc.getItem('writable')));
        doc.setItem('revertDisabled',Boolean(!documents.dirty(key) || doc.getItem('busy')));
        doc.setItem('displayPath',doc.getItem('isNew') ? doc.getItem('path') : `${doc.getItem('root')}/${doc.getItem('path')}`);
        doc.setItem('pdfFilename',doc.getItem('path').split('/').at(-1).replace(/\.typ(?:\.py)?$/i,'.pdf'));
        doc.setItem('renderDisabled',Boolean(doc.getItem('busy') || !doc.getItem('writable')));
        this.ideHistoryState(doc);
    }
    async ideOpenDocument(node, root, path) {
        const context = ideContext(node), {documents} = context;
        const state = context.scope.getRelativeData('.');
        const requested = ++context.requested;
        try {
            const key = await documents.open(root,path);
            if (key === null || documents.disposed) return;
            this.ideShowDocument(node,key);
            if (requested === context.requested) {
                state.setItem('active',key);
                state.setItem('status',`${path}${documents.documents.getItem(key).getItem('writable') ? '' : ' (draft only — Remote Edit is disabled)'}`);
            }
        } catch (error) { if (!documents.disposed) state.setItem('status',error.message); }
    }
    ideNew(node) {
        const context = ideContext(node), {documents} = context;
        const state = context.scope.getRelativeData('.');
        const type = state.getItem('newType');
        const language = type === 'typstRecipe' ? 'python' : type;
        const extensions = {typstRecipe:'.typ.py',typst:'.typ',markdown:'.md',html:'.html',python:'.py',javascript:'.js',
            typescript:'.ts',json:'.json',css:'.css',sql:'.sql',xml:'.xml',text:'.txt'};
        const key = documents.newDocument(language,extensions[type],state.getItem('workspace'));
        documents.documents.getItem(key).setItem('writable',state.getItem('browser.writable') === true);
        ++context.requested;
        this.ideShowDocument(node,key);
        state.setItem('active',key);
        state.setItem('status','New document. Choose directory and name when saving.');
    }
    ideShowDocument(node, key) {
        const context = ideContext(node), {documents} = context;
        const document = documents.documents.getItem(key);
        const path = document.getItem('path');
        const tabs = context.scope.value.getNode('frame.center.tabs');
        if (!tabs.value?.getNode(key)) {
            const doc = documents.documents.getItem(key);
            const recipe = path.endsWith('.typ.py');
            if (recipe) documents.invalidateRecipe(key);
            doc.setItem('readonly',false);
            this.ideDocumentState(node,key);
            doc.setItem('view','code');
            doc.setItem('createHidden',true);
            doc.setItem('undoDisabled',true);
            doc.setItem('redoDisabled',true);
            const pane = sourceTarget(tabs.builder.wrapSource(tabs).contentPane({node_label:key,
                title:path, pageName:key, documentKey:key, closable:true, onClose:'ideClose',
                height:'100%'}));
            const target = pane.builder.wrapSource(pane).div({display:'flex',flex_direction:'column',height:'100%'});
            const toolbar = target.div({datapath:`.documents.${key}`,display:'flex',align_items:'center',gap:'6px',padding:'4px 12px',
                height:'40px',flex_shrink:0,box_sizing:'border-box',class:'gramlot-ide-document-toolbar',role:'toolbar','aria-label':`Commands for ${path}`});
            for (const [name,path,label,func] of [
                ['save','M5 3h12l4 4v14H3V3h2 M7 3v6h10V3 M7 21v-8h10v8','Save','ideSave'],
                ['revert','M3 10a9 9 0 1 1 2 8 M3 4v6h6 M12 7v5l3 2','Revert to saved','ideRevert'],
                ['undo','M9 5 3 11l6 6 M3 11h12a6 6 0 0 1 6 6v2','Undo','ideUndo'],
                ['redo','m15 5 6 6-6 6 M21 11H9a6 6 0 0 0-6 6v2','Redo','ideRedo']]) {
                const button = toolbar.button({title:label,'aria-label':label,disabled:`^.${name}Disabled`,
                    class:`button--quiet gramlot-ide-${name}`});
                button.svg({viewBox:'0 0 24 24',width:18,height:18,fill:'none',stroke:'currentColor',
                    stroke_width:1.7,stroke_linecap:'round',stroke_linejoin:'round','aria-hidden':'true'}).path({d:path});
                button.dataController({func,documentKey:key});
            }
            if (recipe) toolbar.button('Generate preview',{disabled:'^.renderDisabled',class:'button--quiet'})
                .dataController({func:'ideRenderRecipe',documentKey:key});
            toolbar.div('^.displayPath',{class:'gramlot-ide-document-path',overflow:'hidden',
                text_overflow:'ellipsis',white_space:'nowrap',min_width:0,flex:'1'});
            const form = target.div({datapath:`.documents.${key}`,hidden:'^.createHidden',
                padding:'8px 12px',display:'flex',gap:'8px',align_items:'end',flex_shrink:0});
            form.textbox({value:'^.saveRoot',lbl:'Directory',flex:'1',disabled:'^.busy'});
            form.textbox({value:'^.savePath',lbl:'File name',flex:'1',disabled:'^.busy'});
            form.button('Create file',{disabled:'^.busy'}).dataController({func:'ideCreate',documentKey:key});
            form.button('Cancel',{disabled:'^.busy',class:'button--quiet'}).dataController({func:'ideCancelCreate',documentKey:key});
            const editorArea = target.div({flex:'1',min_height:0});
            const html = doc.getItem('language') === 'html';
            const markdown = doc.getItem('language') === 'markdown';
            const rich = html || markdown;
            const typst = doc.getItem('language') === 'typst';
            const preview = rich || typst || recipe;
            const views = preview ? editorArea.tabContainer({height:'100%',selectedPage:`^.documents.${key}.view`}) : null;
            const code = preview ? views.contentPane({title:'Code',pageName:'code',height:'100%'}) : editorArea;
            codeMirrorWithOptions(code,{datapath:`.documents.${key}`,value:'^.content',language:doc.getItem('language'),
                height:'100%', readonly:'^.readonly',nodeId:`${context.editorPrefix}_editor_${key}`,
                editorView:'code',selfsubscribe_historyChanged:'ideHistoryChanged'});
            target.dataController({func:'ideSave',documentKey:key,[`subscribe_${context.editorPrefix}_editor_${key}_save`]:true});
            if (typst) views.contentPane({title:'Preview',pageName:'preview',height:'100%'}).typstPreview({value:`^.documents.${key}.content`,filename:`^.documents.${key}.pdfFilename`,height:'100%'});
            if (recipe) {
                const output = views.contentPane({title:'Preview',pageName:'preview',height:'100%',display:'flex',flex_direction:'column'});
                output.div(`^.documents.${key}.renderStatus`,{role:'status',padding:'8px 12px',white_space:'pre-wrap',overflow:'auto',max_height:'30%'});
                output.typstPreview({value:`^.documents.${key}.typstSource`,filename:`^.documents.${key}.pdfFilename`,
                    hidden:`^.documents.${key}.previewHidden`,flex:'1',min_height:0});
                views.contentPane({title:'Generated Typst',pageName:'generated',height:'100%'})
                    .codeMirror({value:`^.documents.${key}.typstSource`,language:'typst',readonly:true,height:'100%'});
            }
            if (rich) {
                const previewPane = views.contentPane({title:'Preview',pageName:'preview',height:'100%',display:'flex',flex_direction:'column'});
                if (markdown) {
                    doc.setItem('allowHtml',false);
                    previewPane.checkbox({value:`^.documents.${key}.allowHtml`,label:'Allow embedded HTML',class:'gramlot-ide-allow-html',padding:'8px 12px',flex_shrink:0});
                }
                previewPane[html ? 'htmlPreview' : 'markdownPreview']({value:`^.documents.${key}.content`,flex:'1',min_height:0,
                    ...(markdown ? {allowHtml:`^.documents.${key}.allowHtml`} : {})});
                views.contentPane({title:'Rich text',pageName:'rich',height:'100%'})[html ? 'htmlEditor' : 'markdownEditor']({
                    datapath:`.documents.${key}`,value:'^.content',readonly:'^.readonly',height:'100%',
                    nodeId:`${context.editorPrefix}_rich_editor_${key}`,editorView:'rich',selfsubscribe_historyChanged:'ideHistoryChanged'});
                target.dataController({func:'ideSave',documentKey:key,[`subscribe_${context.editorPrefix}_rich_editor_${key}_save`]:true});
            }
        }
    }
    async ideRenderRecipe(node, {documentKey}) {
        const context = ideContext(node), {documents} = context;
        const doc = documents.documents.getItem(documentKey);
        doc.setItem('view','preview');
        await documents.renderRecipe(documentKey);
    }
    ideCancelCreate(node, {documentKey}) {
        const context = ideContext(node), {documents} = context;
        documents.documents.getItem(documentKey).setItem('createHidden',true);
    }
    async ideCreate(node, {documentKey}) {
        const context = ideContext(node), {documents} = context;
        const state = context.scope.getRelativeData('.');
        state.setItem('status','Creating file…');
        try {
            const saved = await documents.create(documentKey);
            if (!documents.disposed && saved) {
                state.setItem('status','File created.');
                const browser = state.getItem('browser');
                if (browser.getItem('root')) await context.scope.value.getNode('frame.left.browser').fileSystemController.open(browser.getItem('root'));
            }
        } catch (error) { if (!documents.disposed) state.setItem('status',error.message); }
    }
    async ideSave(node, {documentKey = null} = {}) {
        const context = ideContext(node), {documents} = context;
        const state = context.scope.getRelativeData('.');
        const key = documentKey ?? state.getItem('active');
        if (!key || documents.documents.getItem(key).getItem('saveDisabled')) return;
        const doc = documents.documents.getItem(key);
        if (doc.getItem('isNew')) { doc.setItem('createHidden',false); return; }
        state.setItem('status','Saving…');
        try {
            const saved = await documents.save(key);
            if (!documents.disposed) state.setItem('status', saved ? 'Saved.' : 'Document is read only or a request is pending.');
        } catch (error) { if (!documents.disposed) state.setItem('status',error.message); }
    }
    ideRevert(node, {documentKey}) {
        const context = ideContext(node), {documents} = context;
        const state = context.scope.getRelativeData('.');
        if (documents.revert(documentKey)) state.setItem('status','Restored the last saved version.');
    }
    ideHistoryChanged(node, {canUndo,canRedo}) {
        const doc = node.getRelativeData('.');
        const view = node.getAttr('editorView');
        doc.setItem(`${view}CanUndo`,canUndo);
        doc.setItem(`${view}CanRedo`,canRedo);
        this.ideHistoryState(doc);
    }
    ideHistoryState(doc) {
        const view = doc.getItem('view');
        doc.setItem('undoDisabled',!doc.getItem(`${view}CanUndo`));
        doc.setItem('redoDisabled',!doc.getItem(`${view}CanRedo`));
    }
    ideEditor(node, documentKey) {
        const context = ideContext(node), {documents} = context;
        const rich = documents.documents.getItem(documentKey).getItem('view') === 'rich';
        const editor = this.page.src.binding.nodeIds.get(`${context.editorPrefix}_${rich ? 'rich_' : ''}editor_${documentKey}`);
        return this.page.src.renderer.records.get(editor).element;
    }
    ideUndo(node, {documentKey}) { this.ideEditor(node,documentKey).undo(); }
    ideRedo(node, {documentKey}) { this.ideEditor(node,documentKey).redo(); }
    ideClose(node) {
        const context = ideContext(node), {documents} = context;
        const state = context.scope.getRelativeData('.');
        const key = node.getAttr('documentKey');
        if (!documents.canClose(key)) {
            state.setItem('status','Save or revert your changes before closing. Pending operations must finish first.');
            return false;
        }
        return true;
    }
    ideClosed(node, {pageName}) { this.ideForgetDocument(node,pageName); }
    ideForgetDocument(node, key, discard = false) {
        const context = ideContext(node), {documents} = context;
        const state = context.scope.getRelativeData('.');
        const document = documents.documents.getItem(key);
        const browser = state.getItem('browser'), selectedPath = browser.getItem('selectedPath');
        const selected = selectedPath === null ? null : browser.getItem('store').getNode(selectedPath);
        if (document && browser.getItem('root') === document.getItem('root') && selected?.attr.path === document.getItem('path')) {
            browser.setItem('selectedPath',null);
        }
        documents.close(key,discard);
    }
}
