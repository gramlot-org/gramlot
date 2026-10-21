"""Reusable Source composition with per-instance editor settings in Data."""


def code_mirror_with_options(parent, *, datapath, value, language="text", height="420px", **attributes):
    """Build an editor and right options drawer; value resolves inside datapath."""
    if not datapath:
        raise ValueError("code_mirror_with_options requires datapath")
    pane = parent.borderContainer(datapath=datapath, height=height, class_="gramlot-editor-options")
    defaults = dict(language=language, indentUnit=4, fontSize=14, fontFamily="monospace", lineNumbers=True,
                    lineWrapping=True, folding=True, bracketMatching=True, autoCloseBrackets=True, autoIndent=True,
                    autocompletion=True, highlightActiveLine=True, highlightSelectionMatches=True)
    for name, setting in defaults.items():
        pane.dataSetter(f".settings.{name}", setting)
    options = pane.contentPane(region="right", width="250px", drawer="close", drawer_label="Options",
                               drawer_icon="⚙", drawer_minimize=False, padding="12px", overflow="auto",
                               class_="gramlot-editor-settings")
    options.h3("Editor options")
    options.filteringSelect(value="^.settings.language", lbl="Language",
                            values="text:Plain text,python:Python,javascript:JavaScript,typescript:TypeScript,json:JSON,html:HTML,css:CSS,xml:XML,markdown:Markdown,sql:SQL,typst:Typst")
    options.numberTextBox(value="^.settings.indentUnit", lbl="Indent spaces", min=1, max=16, dtype="L", validate_notnull=True)
    options.numberTextBox(value="^.settings.fontSize", lbl="Font size", min=8, max=48, dtype="L", validate_notnull=True)
    options.textbox(value="^.settings.fontFamily", lbl="Font family")
    labels = dict(lineNumbers="Line numbers", lineWrapping="Wrap lines", folding="Code folding", bracketMatching="Match brackets",
                  autoCloseBrackets="Close brackets and quotes", autoIndent="Automatic indentation",
                  autocompletion="Local completion", highlightActiveLine="Highlight current line",
                  highlightSelectionMatches="Highlight matching selections")
    for name, label in labels.items():
        options.checkbox(value=f"^.settings.{name}", label=label, display="block", margin_top="8px")
    center = pane.contentPane(region="center", min_height=0)
    center.codeMirror(**(attributes | dict(value=value, height="100%") |
                         {name: f"^.settings.{name}" for name in defaults}))
    return pane
