import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {toggleMark,baseKeymap} from 'prosemirror-commands';
import {keymap} from 'prosemirror-keymap';
import {history,undo,redo} from 'prosemirror-history';
import {createMarkdownCodec} from './markdown-codec.js';

const styleText=`.markdown-editor-control{display:flex;flex-direction:column;border:1px solid var(--gramlot-border-control,#aaa);border-radius:var(--gramlot-radius-sm,4px);background:var(--gramlot-surface,white);color:var(--gramlot-ink,#243449)}
.markdown-tools{display:flex;gap:4px;align-items:center;flex-wrap:wrap;padding:5px 8px;border-bottom:1px solid var(--gramlot-border-control,#aaa);background:var(--gramlot-surface-subtle,#edf1f7)}
.markdown-tools button{border:0;background:transparent;color:inherit;border-radius:var(--gramlot-radius-sm,4px);padding:6px 10px;font:inherit;cursor:pointer}.markdown-tools button:hover:not(:disabled),.markdown-tools button[aria-pressed=true]{background:var(--gramlot-selected,#eaf0fc)}.markdown-tools button:disabled{opacity:.4;cursor:default}
.markdown-content{flex:1;min-height:0;overflow:auto}.ProseMirror{padding:20px;min-height:100%;outline:0;white-space:pre-wrap;overflow-wrap:break-word;line-height:1.6}.ProseMirror:focus-visible{outline:2px solid var(--gramlot-focus-ring,Highlight);outline-offset:-2px}.ProseMirror pre{white-space:pre-wrap;background:var(--gramlot-surface-subtle,#edf1f7);padding:12px}.ProseMirror li{position:relative}.ProseMirror img{max-width:100%}.ProseMirror a{color:var(--gramlot-action,LinkText)}.ProseMirror blockquote{border-left:3px solid var(--gramlot-border-control,#aaa);padding-left:16px;margin-left:0}.ProseMirror table{border-collapse:collapse}.ProseMirror td,.ProseMirror th{border:1px solid var(--gramlot-border-control,#aaa);padding:6px 12px}.markdown-source-block{border:1px dashed var(--gramlot-border-control,#aaa);padding:10px;margin:12px 0;background:var(--gramlot-surface-subtle,#edf1f7);white-space:normal}.ProseMirror-selectednode{outline:2px solid var(--gramlot-focus-ring,Highlight)}.ProseMirror-hideselection *::selection{background:transparent}.ProseMirror-hideselection{caret-color:transparent}`;
const styled=new WeakSet();
export function createMarkdownEditor(host) {
    const document=host.ownerDocument;
    if (!styled.has(host.shadowRoot)) {const style=document.createElement('style');style.textContent=styleText;host.shadowRoot.append(style);styled.add(host.shadowRoot);}
    const toolbar=document.createElement('div');toolbar.className='markdown-tools';toolbar.setAttribute('role','toolbar');toolbar.setAttribute('aria-label','Markdown formatting');
    const content=document.createElement('div');content.className='markdown-content';host.control.append(toolbar,content);
    const original=host.readControlValue(),codec=createMarkdownCodec(document),initialDoc=codec.parse(original);
    const locked=()=>Boolean(host.parameters.readonly||host.parameters.disabled);
    let disposed=false,scheduled=false,lastHistory;
    const buttons=[];
    function refresh() {
        for (const {button,command,mark} of buttons) {
            button.disabled=locked()||!command(view.state);
            if(mark){const {from,to,empty,$from}=view.state.selection;button.setAttribute('aria-pressed',String(empty ? Boolean(mark.isInSet(view.state.storedMarks||$from.marks())) : view.state.doc.rangeHasMark(from,to,mark)));}
        }
        if(scheduled)return;scheduled=true;
        queueMicrotask(()=>{
            scheduled=false;if(disposed)return;
            const current={canUndo:!locked()&&undo(view.state),canRedo:!locked()&&redo(view.state)};
            if(lastHistory&&current.canUndo===lastHistory.canUndo&&current.canRedo===lastHistory.canRedo)return;
            lastHistory=current;host.pageContext.publish('historyChanged',current);
        });
    }
    const save=()=>{if(!locked())host.pageContext.publish('save',{value:host.readControlValue()});return true;};
    const view=new EditorView(content,{
        state:EditorState.create({doc:initialDoc,plugins:[history(),keymap({'Mod-z':undo,'Mod-Shift-z':redo,'Mod-y':redo,'Mod-b':toggleMark(codec.schema.marks.strong),'Mod-i':toggleMark(codec.schema.marks.em),'Mod-`':toggleMark(codec.schema.marks.code),'Mod-s':save}),keymap(baseKeymap)]}),
        editable:()=>!locked(),attributes:()=>({'aria-label':'Markdown editor',role:'textbox','aria-multiline':'true','aria-readonly':String(locked()),tabindex:host.parameters.disabled ? '-1':'0'}),
        handleDOMEvents:{blur:()=>{if(!disposed)host.editorBlurred();return false;},click:(_,event)=>{if(event.target.closest('a')){event.preventDefault();return true;}return false;}},
        dispatchTransaction:transaction=>{
            if(disposed || (transaction.docChanged&&locked()))return;
            view.updateState(view.state.apply(transaction));
            if(transaction.docChanged)host.editorChanged(view.state.doc.eq(initialDoc) ? original : codec.serialize(view.state.doc));
            refresh();
        }
    });
    for (const [label,command,mark] of [
        ['Bold',toggleMark(codec.schema.marks.strong),codec.schema.marks.strong],
        ['Italic',toggleMark(codec.schema.marks.em),codec.schema.marks.em],
        ['Code',toggleMark(codec.schema.marks.code),codec.schema.marks.code],['Undo',undo],['Redo',redo]]) {
        const button=document.createElement('button');button.type='button';button.textContent=label;button.title=label;
        button.addEventListener('mousedown',event=>event.preventDefault());
        button.addEventListener('click',()=>{if(!locked()){command(view.state,view.dispatch,view);view.focus();}});
        toolbar.append(button);buttons.push({button,command,mark});
    }
    refresh();
    return {
        view,
        configure(){view.setProps({editable:()=>!locked()});refresh();},
        undo(){return !locked()&&undo(view.state,view.dispatch,view);},
        redo(){return !locked()&&redo(view.state,view.dispatch,view);},
        focus(){view.focus();},
        destroy(){disposed=true;view.destroy();}
    };
}
