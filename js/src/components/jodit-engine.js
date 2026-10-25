/** Locally bundled optional Jodit engine, initialized only by htmlEditor. */
import {Jodit} from 'jodit';
import 'jodit/esm/plugins/clean-html/clean-html.js';
import 'jodit/esm/plugins/clipboard/clipboard.js';
import 'jodit/esm/plugins/fullsize/fullsize.js';
import 'jodit/esm/plugins/hr/hr.js';
import 'jodit/esm/plugins/indent/indent.js';
import 'jodit/esm/plugins/search/search.js';
import 'jodit/esm/plugins/select/select.js';
import 'jodit/esm/plugins/select-cells/select-cells.js';
import 'jodit/esm/plugins/resize-cells/resize-cells.js';
import 'jodit/esm/plugins/table-keyboard-navigation/table-keyboard-navigation.js';
import css from 'jodit/es2021/jodit.min.css';
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
    const originalValue=host.readControlValue();
    const content=prepareHtmlDocument(originalValue,window);
    const locked=()=>Boolean(host.parameters.readonly||host.parameters.disabled);
    const editor=Jodit.make(textarea,{
        globalFullSize:false,height:'100%',minHeight:200,readonly:locked(),
        iframe:true,iframeSandbox:'allow-same-origin',iframeStyle:'body{font-family:system-ui;padding:16px;background:white;color:#222}',
        toolbarAdaptive:false,toolbarSticky:false,showXPathInStatusbar:false,showCharsCounter:false,showWordsCounter:false,
        sourceEditor:'area',disablePlugins:['mobile'],
        buttons:['undo','redo','|','paragraph','bold','italic','underline','strikethrough','brush','eraser','|','ul','ol','outdent','indent','align','|','link','image','table','hr','|','find','selectall'],
        uploader:{insertImageAsBase64URI:true}
    });
    const frameDoc=editor.editor.ownerDocument;
    const policy=frameDoc.createElement('meta');policy.httpEquiv='Content-Security-Policy';
    policy.content="default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; form-action 'none'";
    frameDoc.head.prepend(policy);
    const pageStyle=frameDoc.createElement('style');pageStyle.textContent=content.styles;frameDoc.head.append(pageStyle);
    const events=new window.AbortController(),options={capture:true,signal:events.signal};
    frameDoc.addEventListener('submit',event=>event.preventDefault(),options);
    frameDoc.addEventListener('click',event=>{if(event.target.closest('a'))event.preventDefault();},options);
    frameDoc.addEventListener('keydown',event=>{
        if ((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='s') {event.preventDefault();if(!locked())host.pageContext.publish('save',{value:host.readControlValue()});}
    },options);
    editor.value=content.html;
    editor.history.clear();
    const initialHtml=editor.value;
    let previous=initialHtml,restoring=false,disposed=false,scheduled=false,lastHistory;
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
            const value=html===initialHtml ? originalValue : content.serialize(html);previous=html;status.textContent='';host.editorChanged(value);
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
        configure(){editor.setReadOnly(locked());history();},
        undo(){if(locked()||!editor.history.canUndo())return false;editor.history.undo();return true;},
        redo(){if(locked()||!editor.history.canRedo())return false;editor.history.redo();return true;},
        focus(){editor.selection.focus();},
        destroy(){disposed=true;resize.disconnect();events.abort();editor.destruct();}
    };
}
