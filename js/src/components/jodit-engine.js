/** Locally bundled optional Jodit engine, initialized only by htmlEditor. */
import {Jodit} from 'jodit';
import createDOMPurify from 'dompurify';
import 'jodit/esm/plugins/clean-html/clean-html.js';
import 'jodit/esm/plugins/clipboard/clipboard.js';
import 'jodit/esm/plugins/paste/paste.js';
import 'jodit/esm/plugins/drag-and-drop/drag-and-drop.js';
import 'jodit/esm/plugins/fullsize/fullsize.js';
import 'jodit/esm/plugins/hr/hr.js';
import 'jodit/esm/plugins/indent/indent.js';
import 'jodit/esm/plugins/search/search.js';
import 'jodit/esm/plugins/select/select.js';
import 'jodit/esm/plugins/select-cells/select-cells.js';
import 'jodit/esm/plugins/resize-cells/resize-cells.js';
import 'jodit/esm/plugins/table-keyboard-navigation/table-keyboard-navigation.js';
import css from 'jodit/es2021/jodit.min.css';
import {randomId} from '../random-id.js';
import {prepareHtmlDocument} from './html-document.js';

const theme=`.jodit-container,.jodit-popup,.jodit-dialog{--jd-color-background-default:var(--gramlot-surface,white);--jd-color-panel:var(--gramlot-surface-subtle,#eee);--jd-color-text-icons:var(--gramlot-ink,#222);--jd-color-separator:var(--gramlot-border-control,#aaa);--jd-color-button-background-hover:var(--gramlot-selected,#ddd);--jd-color-background-active:var(--gramlot-selected,#ddd);--jd-color-background-gray:var(--gramlot-surface-subtle,#eee);--jd-color-background-light-gray:var(--gramlot-surface-subtle,#eee);--jd-color-background-button-hover:var(--gramlot-selected,#ddd);--jd-color-border:var(--gramlot-border-control,#aaa);--jd-color-text:var(--gramlot-ink,#222);--jd-color-icon:var(--gramlot-ink,#222);--jd-border-radius-default:var(--gramlot-radius-sm,4px)}.jodit-toolbar-button__button:focus-visible{outline:2px solid var(--gramlot-focus-ring,Highlight)}`;
const styles=new WeakSet();
export function createHtmlEditor(host) {
    const document=host.ownerDocument, window=document.defaultView;
    if (!styles.has(host.shadowRoot)) {
        const style=document.createElement('style');style.textContent=css+'\n'+theme;host.shadowRoot.append(style);styles.add(host.shadowRoot);
    }
    if (!styles.has(document)) {
        const style=document.createElement('style');style.textContent=css+'\n'+theme;document.head.append(style);styles.add(document);
    }
    const status=document.createElement('div');status.className='html-editor-status';status.setAttribute('role','status');
    const textarea=document.createElement('textarea');textarea.setAttribute('aria-label','HTML content');
    host.control.append(status,textarea);
    // Each projected document carries an inert history marker before its editable body. Its codec retains the
    // head and protected nodes when Jodit restores an older body through Undo/Redo.
    const documents=new Map();
    const sanitizer=createDOMPurify(window);
    // Only our inert history comments survive. User comments are already represented
    // by the document codec's noneditable placeholders; arbitrary comments are removed.
    sanitizer.addHook('uponSanitizeElement',(node,data)=>{
        if(node.nodeType===8)data.allowedTags['#comment']=documents.has(`<!--${node.data}-->`);
    });
    const prepare=value=>{
        const content=prepareHtmlDocument(value,window), marker=`<!--gramlot-document-${randomId()}-->`;
        const record={content,value,marker,initialHtml:null};
        documents.set(marker,record);
        return record;
    };
    let current=prepare(host.readControlValue());
    const locked=()=>Boolean(host.parameters.readonly||host.parameters.disabled);
    const editor=Jodit.make(textarea,{
        globalFullSize:false,height:'100%',minHeight:200,readonly:locked(),
        // The iframe isolates document styles. Jodit's sanitizer hook cleans assigned
        // HTML; the codec rejects active rich edits and the canvas CSP blocks scripts.
        iframe:true,iframeStyle:'body{font-family:system-ui;padding:16px;background:white;color:#222}',
        cleanHTML:{sanitizer:html=>sanitizer.sanitize(html,{
            USE_PROFILES:{html:true},FORCE_BODY:true,ADD_ATTR:['contenteditable'],
            FORBID_TAGS:['style','form','input','button','select','textarea','iframe','object','embed','noscript'],
            FORBID_ATTR:['autofocus','srcdoc']
        })},
        toolbarAdaptive:false,toolbarSticky:false,showXPathInStatusbar:false,showCharsCounter:false,showWordsCounter:false,
        sourceEditor:'area',beautifyHTML:false,disablePlugins:['mobile'],
        buttons:['undo','redo','|','paragraph','bold','italic','underline','strikethrough','brush','eraser','|','ul','ol','outdent','indent','align','|','link','image','table','hr','|','find','selectall'],
        uploader:{insertImageAsBase64URI:true}
    });
    const frameDoc=editor.editor.ownerDocument;
    const policy=frameDoc.createElement('meta');policy.httpEquiv='Content-Security-Policy';
    policy.content="default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; form-action 'none'";
    frameDoc.head.prepend(policy);
    const pageStyle=frameDoc.createElement('style');pageStyle.textContent=current.content.styles;frameDoc.head.append(pageStyle);
    const events=new window.AbortController(),options={capture:true,signal:events.signal};
    frameDoc.addEventListener('submit',event=>event.preventDefault(),options);
    frameDoc.addEventListener('click',event=>{if(event.target.closest('a'))event.preventDefault();},options);
    frameDoc.addEventListener('keydown',event=>{
        if ((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='s') {event.preventDefault();if(!locked())host.pageContext.publish('save',{value:host.readControlValue()});}
    },options);
    editor.value=current.marker+(current.content.html||'<p><br></p>');
    editor.history.clear();
    current.initialHtml=editor.value;
    let previous=editor.value,restoring=false,disposed=false,scheduled=false,lastHistory;
    const history=()=>{
        if(scheduled)return;scheduled=true;
        queueMicrotask(()=>{
            scheduled=false;if(disposed)return;
            const current={canUndo:!locked()&&editor.history.canUndo(),canRedo:!locked()&&editor.history.canRedo()};
            if(lastHistory&&current.canUndo===lastHistory.canUndo&&current.canRedo===lastHistory.canRedo)return;
            lastHistory=current;host.pageContext.publish('historyChanged',current);
        });
    };
    editor.events.on('change',()=>{
        if(restoring||locked()||disposed)return;
        const html=editor.value;if(html===previous)return;
        try {
            const matches=[...documents.values()].filter(record=>html.includes(record.marker));
            const record=matches[0];
            if(matches.length!==1||html.indexOf(record.marker)!==html.lastIndexOf(record.marker))throw new Error('Protected document context changed. Use Code to edit it.');
            const value=html===record.initialHtml ? record.value : record.content.serialize(html.replace(record.marker,''));
            current=record;pageStyle.textContent=record.content.styles;
            previous=html;status.textContent='';host.editorChanged(value);
        } catch(error) {
            restoring=true;try{editor.value=previous;}finally{restoring=false;}
            status.textContent=error.message;
        }
        history();
    });
    editor.events.on('blur',()=>host.editorBlurred());
    editor.events.on('changeStack',history);
    const resize=new window.ResizeObserver(entries=>{
        if(!disposed && entries.some(entry=>entry.contentRect.width>0 && entry.contentRect.height>0)) editor.events.fire('resize');
    });
    resize.observe(host.control);
    history();
    return {
        replace(value){
            const record=prepare(value), active=document.activeElement;
            restoring=true;
            try {
                // The public value setter also commits pending typing to Jodit history.
                editor.value=editor.value;
                const selection=editor.history.snapshot.make();
                const focused=document.activeElement===host&&host.shadowRoot.activeElement===editor.iframe&&editor.selection.isFocused();
                const scroll=editor.editor.scrollTop;
                editor.value=record.marker+(record.content.html||'<p><br></p>');
                record.initialHtml=editor.value;current=record;previous=editor.value;
                pageStyle.textContent=record.content.styles;status.textContent='';
                // Restore the selection only when its DOM paths still exist in the new document.
                const valid=(path,offset)=>{
                    let node=editor.editor;
                    for(const index of path){node=node.childNodes[index];if(!node)return false;}
                    return offset<=(node.nodeType===3 ? node.length : node.childNodes.length);
                };
                const range=selection.range;
                if(focused&&range&&valid(range.startContainer,range.startOffset)&&valid(range.endContainer,range.endOffset))
                    editor.history.snapshot.restoreOnlySelection(selection);
                editor.editor.scrollTop=scroll;
            } finally {
                // Jodit's value setter can focus its canvas while wrapping body nodes.
                // A background Data projection must retain the caller's active control.
                if(active!==host&&active!==document.body&&active.isConnected&&document.activeElement!==active)
                    active.focus({preventScroll:true});
                restoring=false;
            }
            history();
        },
        configure(){editor.setReadOnly(locked());history();},
        undo(){if(locked()||!editor.history.canUndo())return false;editor.history.undo();return true;},
        redo(){if(locked()||!editor.history.canRedo())return false;editor.history.redo();return true;},
        focus(){editor.selection.focus();},
        destroy(){disposed=true;resize.disconnect();events.abort();editor.destruct();sanitizer.removeAllHooks();documents.clear();}
    };
}
