/** Optional CodeMirror engine; loaded only when an editor is connected. */
import {EditorState, Compartment} from '@codemirror/state';
import {EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, dropCursor} from '@codemirror/view';
import {syntaxHighlighting, HighlightStyle, bracketMatching, indentOnInput, indentUnit, foldGutter, foldKeymap} from '@codemirror/language';
import {defaultKeymap, history, historyKeymap, isolateHistory, undo, redo, undoDepth, redoDepth, indentWithTab, insertNewline, insertNewlineAndIndent} from '@codemirror/commands';
import {search, searchKeymap, highlightSelectionMatches} from '@codemirror/search';
import {closeBrackets, closeBracketsKeymap, autocompletion, completionKeymap} from '@codemirror/autocomplete';
import {setDiagnostics} from '@codemirror/lint';
import {tags} from '@lezer/highlight';
import {python} from '@codemirror/lang-python';
import {javascript} from '@codemirror/lang-javascript';
import {json} from '@codemirror/lang-json';
import {html} from '@codemirror/lang-html';
import {css} from '@codemirror/lang-css';
import {xml} from '@codemirror/lang-xml';
import {markdown} from '@codemirror/lang-markdown';
import {typst_lezer} from 'codemirror-lang-typst/lezer';
import {sql} from '@codemirror/lang-sql';

const languages = {text: () => [], python, javascript, typescript: () => javascript({typescript:true}), json, html, css, xml, markdown, sql, typst:typst_lezer};
const colors = syntaxHighlighting(HighlightStyle.define([
    {tag:[tags.keyword, tags.modifier], color:'var(--gramlot-editor-keyword, #9677d9)'},
    {tag:[tags.string, tags.regexp], color:'var(--gramlot-editor-string, #318f74)'},
    {tag:[tags.number, tags.bool, tags.null], color:'var(--gramlot-editor-number, #c47733)'},
    {tag:tags.comment, color:'var(--gramlot-text-secondary, #78889a)', fontStyle:'italic'},
    {tag:[tags.function(tags.variableName), tags.tagName], color:'var(--gramlot-editor-function, #5499cb)'}
]));
const theme = EditorView.theme({
    '&': {height:'100%', color:'var(--gramlot-ink, CanvasText)', backgroundColor:'var(--gramlot-field-background, Canvas)'},
    '.cm-scroller': {overflow:'auto', fontFamily:'inherit'},
    '.cm-content': {caretColor:'var(--gramlot-ink, CanvasText)'},
    '.cm-cursor, .cm-dropCursor': {borderLeftColor:'var(--gramlot-ink, CanvasText)'},
    '.cm-gutters': {color:'var(--gramlot-text-secondary, GrayText)', backgroundColor:'var(--gramlot-surface-subtle, Canvas)', borderColor:'var(--gramlot-border-control, GrayText)'},
    '.cm-activeLine, .cm-activeLineGutter': {backgroundColor:'color-mix(in srgb, var(--gramlot-brand-blue, Highlight) 10%, transparent)'},
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {backgroundColor:'color-mix(in srgb, var(--gramlot-brand-blue, Highlight) 28%, transparent)'},
    '.cm-panels, .cm-tooltip': {color:'var(--gramlot-ink, CanvasText)', backgroundColor:'var(--gramlot-field-background, Canvas)', borderColor:'var(--gramlot-border-control, GrayText)'},
    '.cm-textfield, .cm-button': {color:'inherit', background:'var(--gramlot-field-background, Canvas)', borderColor:'var(--gramlot-border-control, GrayText)'},
    '.cm-search': {fontFamily:'system-ui', fontSize:'13px'}
});
function configuration(p) {
    return [languages[p.language](), indentUnit.of(' '.repeat(p.indentUnit)),
        EditorState.tabSize.of(p.indentUnit), EditorState.readOnly.of(Boolean(p.readonly || p.disabled)),
        EditorView.editable.of(!p.disabled), EditorView.contentAttributes.of({'aria-readonly':String(p.readonly), 'aria-disabled':String(p.disabled), tabindex:p.disabled ? '-1' : '0', 'aria-label':p.lbl || 'Code editor'}),
        p.lineNumbers ? lineNumbers() : [], p.lineWrapping ? EditorView.lineWrapping : [],
        p.folding ? foldGutter() : [], p.autoCloseBrackets ? closeBrackets() : [],
        p.autoIndent ? indentOnInput() : [], p.autocompletion ? autocompletion() : [],
        p.highlightActiveLine ? [highlightActiveLine(), highlightActiveLineGutter()] : [],
        p.highlightSelectionMatches ? highlightSelectionMatches() : [], p.bracketMatching ? bracketMatching() : [],
        keymap.of([{key:'Enter', run:p.autoIndent ? insertNewlineAndIndent : insertNewline, shift:p.autoIndent ? insertNewlineAndIndent : insertNewline},
            ...(p.folding ? foldKeymap : []), ...(p.autoCloseBrackets ? closeBracketsKeymap : []), ...(p.autocompletion ? completionKeymap : [])])];
}
export function createEditor(host) {
    const options = new Compartment();
    let lastHistory, historyScheduled = false, disposed = false;
    const publishHistory = () => {
        if (historyScheduled) return;
        historyScheduled = true;
        // Subscribers may update bound toolbar Data. Notify after the current
        // editor transaction / external value projection has fully completed.
        queueMicrotask(() => {
            historyScheduled = false;
            if (disposed) return;
            const current = {
                canUndo:!view.state.facet(EditorState.readOnly) && undoDepth(view.state) > 0,
                canRedo:!view.state.facet(EditorState.readOnly) && redoDepth(view.state) > 0
            };
            if (lastHistory && current.canUndo === lastHistory.canUndo && current.canRedo === lastHistory.canRedo) return;
            lastHistory = current;
            host.pageContext.publish('historyChanged',current);
        });
    };
    const extensions = [history(), theme, colors, drawSelection(), dropCursor(),
        search({top:true}), keymap.of([{key:'Mod-s', preventDefault:true, run:() => {if (!view.state.facet(EditorState.readOnly)) host.pageContext.publish('save', {value:host.readControlValue()}); return true;}},
            indentWithTab, ...searchKeymap, ...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of(update => {
            if (update.docChanged && !projecting) host.editorChanged(update.state.doc.toString());
            if (update.docChanged || update.transactions.some(transaction => transaction.reconfigured)) publishHistory();
        })];
    let projecting = false;
    const state = doc => EditorState.create({doc, extensions:[options.of(configuration(host.parameters)), ...extensions]});
    const view = new EditorView({state:state(host.readControlValue()), parent:host.control, root:host.shadowRoot});
    return {view,
        configure() {view.dispatch({effects:options.reconfigure(configuration(host.parameters))});},
        replace(value) {
            const current = view.state.doc.toString();
            let from = 0, end = current.length, nextEnd = value.length;
            while (from < end && from < nextEnd && current[from] === value[from]) from++;
            while (end > from && nextEnd > from && current[end - 1] === value[nextEnd - 1]) {end--; nextEnd--;}
            if (from === end && from === nextEnd) return;
            projecting = true;
            try {view.dispatch({changes:{from, to:end, insert:value.slice(from,nextEnd)}, annotations:isolateHistory.of('full')});}
            finally {projecting = false;}
        },
        publishHistory,
        undo() {return !view.state.facet(EditorState.readOnly) && undo(view);},
        redo() {return !view.state.facet(EditorState.readOnly) && redo(view);},
        diagnostics(items) {view.dispatch(setDiagnostics(view.state, items));},
        reveal(position) {view.dispatch({selection:{anchor:position}, effects:EditorView.scrollIntoView(position, {y:'center'})});},
        destroy() {disposed = true; view.destroy();}
    };
}
