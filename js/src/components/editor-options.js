/** Source composition; settings belong to the caller's scoped Data. */
export function codeMirrorWithOptions(parent, {datapath, value, language = 'text', height = '420px', ...attributes}) {
    if (!datapath) throw new TypeError('codeMirrorWithOptions requires datapath');
    const pane = parent.borderContainer({datapath, height, class:'gramlot-editor-options'});
    const defaults = {language, indentUnit:4, fontSize:14, fontFamily:'monospace', lineNumbers:true, lineWrapping:true,
        folding:true, bracketMatching:true, autoCloseBrackets:true, autoIndent:true, autocompletion:true, highlightActiveLine:true, highlightSelectionMatches:true};
    for (const [name, setting] of Object.entries(defaults)) pane.dataSetter({destination_path:`.settings.${name}`, value:setting});
    const options = pane.contentPane({region:'right', width:'250px', drawer:'close', drawer_label:'Options', drawer_icon:'⚙', drawer_minimize:false,
        padding:'12px', overflow:'auto', class:'gramlot-editor-settings'});
    options.h3('Editor options');
    options.filteringSelect({value:'^.settings.language', lbl:'Language', values:'text:Plain text,python:Python,javascript:JavaScript,typescript:TypeScript,json:JSON,html:HTML,css:CSS,xml:XML,markdown:Markdown,sql:SQL,typst:Typst'});
    options.numberTextBox({value:'^.settings.indentUnit', lbl:'Indent spaces', min:1, max:16, dtype:'L', validate_notnull:true});
    options.numberTextBox({value:'^.settings.fontSize', lbl:'Font size', min:8, max:48, dtype:'L', validate_notnull:true});
    options.textbox({value:'^.settings.fontFamily', lbl:'Font family'});
    const labels = {lineNumbers:'Line numbers', lineWrapping:'Wrap lines', folding:'Code folding', bracketMatching:'Match brackets', autoCloseBrackets:'Close brackets and quotes', autoIndent:'Automatic indentation',
        autocompletion:'Local completion', highlightActiveLine:'Highlight current line', highlightSelectionMatches:'Highlight matching selections'};
    for (const [name, label] of Object.entries(labels)) options.checkbox({value:`^.settings.${name}`, label, display:'block', margin_top:'8px'});
    const center = pane.contentPane({region:'center', min_height:0});
    center.codeMirror({...attributes, value, height:'100%', ...Object.fromEntries(Object.keys(defaults).map(name => [name, `^.settings.${name}`]))});
    return pane;
}
