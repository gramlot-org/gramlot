"""Reusable Source editor composition; host services are supplied by its page."""
import re
from gramlot.server import UploadTarget
from genro_bag import Bag
from genro_builders.builder import SourceBag
from genro_tytx import from_tytx
from .visual_editor_catalogue import validate_catalogue, validate_catalogue_source
TOOL_ICONS = {'navigation': 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237b8795%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%223%22%20y%3D%224%22%20width%3D%2218%22%20height%3D%2216%22%20rx%3D%222%22%2F%3E%3Cpath%20d%3D%22M9%204v16M5.5%208h1M5.5%2012h1%22%2F%3E%3C%2Fsvg%3E', 'catalogue': 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237b8795%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%223%22%20y%3D%223%22%20width%3D%227%22%20height%3D%227%22%20rx%3D%221%22%2F%3E%3Crect%20x%3D%2214%22%20y%3D%223%22%20width%3D%227%22%20height%3D%227%22%20rx%3D%221%22%2F%3E%3Crect%20x%3D%223%22%20y%3D%2214%22%20width%3D%227%22%20height%3D%227%22%20rx%3D%221%22%2F%3E%3Cpath%20d%3D%22M14%2017.5h7M17.5%2014v7%22%2F%3E%3C%2Fsvg%3E', 'properties': 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237b8795%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M4%206h16M4%2012h16M4%2018h16%22%2F%3E%3Ccircle%20cx%3D%228%22%20cy%3D%226%22%20r%3D%222%22%2F%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2212%22%20r%3D%222%22%2F%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2218%22%20r%3D%222%22%2F%3E%3C%2Fsvg%3E', 'new': 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237b8795%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M14%202H6a2%202%200%200%200-2%202v16a2%202%200%200%200%202%202h12a2%202%200%200%200%202-2V8Z%20M14%202v6h6%20M8%2015h8%20M12%2011v8%22%2F%3E%3C%2Fsvg%3E', 'download': 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237b8795%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M12%203v12m-5-5%205%205%205-5%20M4%2016v4a1%201%200%200%200%201%201h14a1%201%200%200%200%201-1v-4%22%2F%3E%3C%2Fsvg%3E', 'copy': 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237b8795%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%228%22%20y%3D%228%22%20width%3D%2212%22%20height%3D%2213%22%20rx%3D%222%22%2F%3E%3Cpath%20d%3D%22M16%208V5a2%202%200%200%200-2-2H5a2%202%200%200%200-2%202v9a2%202%200%200%200%202%202h3%22%2F%3E%3C%2Fsvg%3E'}


TOOL_ICONS["open"] = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237b8795%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M3%207V5a2%202%200%200%201%202-2h5l2%202h7a2%202%200%200%201%202%202v2M3%209h18l-2%2011H4z%22%2F%3E%3C%2Fsvg%3E"


TOOL_ICONS['cut'] = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237b8795%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Ccircle%20cx%3D%226%22%20cy%3D%226%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%226%22%20cy%3D%2218%22%20r%3D%223%22%2F%3E%3Cpath%20d%3D%22m8%208%2012%2012M8%2016%2020%204%22%2F%3E%3C%2Fsvg%3E'


TOOL_ICONS['paste'] = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237b8795%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%225%22%20y%3D%225%22%20width%3D%2214%22%20height%3D%2216%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%229%22%20y%3D%222%22%20width%3D%226%22%20height%3D%225%22%20rx%3D%221%22%2F%3E%3Cpath%20d%3D%22M9%2012h6m-6%204h6%22%2F%3E%3C%2Fsvg%3E'


TOOL_ICONS["appearance"] = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%228%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%221.7%22%2F%3E%3Cpath%20d%3D%22M12%204a8%208%200%200%201%200%2016z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E'


class SourceImport(UploadTarget):
    """Bounded document import; the editor validates Source before mounting it."""
    def __init__(self, *, catalogue=None):
        validate_catalogue(catalogue)
        self.catalogue = catalogue
        super().__init__(max_bytes=5 * 1024 * 1024)
        self._data = bytearray()
        self._outcome = {"state": "pending"}

    def write(self, chunk):
        self._data.extend(chunk)

    def finish(self):
        wire = self._data.decode("utf-8")
        source = from_tytx(wire)
        if not isinstance(source, SourceBag) or len(source.nodes) != 1 or source.nodes[0].label != "pageRoot":
            raise ValueError("Expected one pageRoot Source")
        validate_catalogue_source(self.catalogue, source)
        self._data.clear()
        self._outcome = {"state": "completed", "result": wire}
        return self._outcome

    def abort(self):
        if self._outcome["state"] != "completed":
            self._data.clear()
            self._outcome = {"state": "unsaved"}
        return self._outcome

    def status(self):
        return self._outcome


class VisualEditor:
    def __init__(self, root, *, datapath="__editor", data_root="", editor_id="visual", upload_operation="import_source", code_document=None, catalogue=None, file_commands=True, canvas_css=None, **attributes):
        if not re.fullmatch(r"[A-Za-z][A-Za-z0-9_]*", editor_id):
            raise ValueError("editor_id must be a literal identifier")
        if not data_root and datapath != "__editor" and not datapath.startswith("__editor."):
            raise ValueError("Root Data editing requires an __editor datapath")
        validate_catalogue(catalogue)
        if canvas_css is not None and (not isinstance(canvas_css, list) or any(not isinstance(text, str) for text in canvas_css)):
            raise TypeError('canvas_css must be a list of CSS texts')
        self.data_root = data_root
        pane = root.main(node_label=editor_id, datapath=datapath, visualEditorId=editor_id, overflow="hidden",
                         tabindex=0, connect_onkeydown="clipboardShortcut", **attributes)
        pane.set_attr(nodeId=f"{editor_id}Editor", class_="visual-editor-shell " + pane.attr.get("class", ""))
        self.pane = pane
        pane.dataSetter(".catalogueScope", catalogue)
        pane.dataSetter(".canvasCss", canvas_css)
        pane.dataSetter(".uploadQueue", Bag())
        pane.dataController(func="initializeEditor", dataRoot=self.data_root, _init=True)
        pane.dataController(func="showProperties", path="^.selection", _init=True)
        pane.dataController(func="initializeCanvasSelection", _onBuilt=True)
        pane.dataController(func="initializeDocument", _onBuilt=True)
        pane.dataController(func="highlightSelection", path="^.selection", _init=True)
        pane.style('^.appearanceCss')
        pane.dataController(func='initializeEditorAppearance', _onBuilt=True)
        pane.dataController(func='applyEditorAppearance', profile='^.appearanceProfile', palette='^.appearancePalette', mode='^.appearanceMode')
        rail = pane.menu(presentation='bar', orientation='vertical', aria_label='Editor panels', class_='visual-editor-rail')
        self.rail = rail
        self.tool_button(rail.menuline(group=True), 'Source / Data', 'toggleNavigation', TOOL_ICONS['navigation'])
        self.tool_button(rail.menuline(group=True), 'Catalogue', 'openCatalogue', TOOL_ICONS['catalogue'])
        self.tool_button(rail.menuline(group=True), 'Properties', 'openProperties', TOOL_ICONS['properties'])
        self.tool_button(rail.menuline(group=True), 'Clipboard', "this.SET('.clipboardVisible', !this.GET('.clipboardVisible'))", TOOL_ICONS['paste'],
                         dropTarget=True, dropTypes="app/source", dropTags=f"{editor_id}Source",
                         dropEffect="^.clipboardDropEffect", connect_ondragover="clipboardModifiers",
                         connect_ondrop="clipboardModifiers", onDrop="dropClipboard")
        rail.spacer(flex=1)
        self.tool_button(rail.menuline(group=True), 'Appearance', "this.SET('.appearanceOpen', !this.GET('.appearanceOpen'))", TOOL_ICONS['appearance'])
        layout_root = pane.framePane(node_label="layout", height="100%", id=f"{editor_id}-editor-frame", class_='visual-editor-layout')
        layout_root.top.set_attr(height='30px')
        toolbar = layout_root.top.menu(presentation="bar", aria_label="Editor tools", class_="visual-editor-toolbar")
        toolbar.menuline(group=True).span("Source editor", class_="visual-editor-brand")
        files = toolbar.menuline(group=True, gap="4px", hidden=not file_commands)
        for caption, action, icon in [('New', 'newPage', 'new'), ('Open', 'openUpload', 'open'),
                                      ('Download', 'downloadPage', 'download'), ('Copy Source', 'copySource', 'copy')]:
            self.tool_button(files, caption, action, TOOL_ICONS[icon], id=f'{editor_id}-{icon}')
        toolbar.menuline(group=True).span(class_="visual-toolbar-divider", aria_hidden="true")
        edit = toolbar.menuline(group=True, gap="2px")
        self.tool_button(edit, 'Cut branch', 'cutBranch', TOOL_ICONS['cut'], title='Cut branch (F8)')
        self.tool_button(edit, 'Copy branch', 'copyBranch', TOOL_ICONS['copy'])
        self.tool_button(edit, 'Paste branch', 'pasteBranch', TOOL_ICONS['paste'], title='Paste branch (F9)')
        toolbar.spacer(flex=1)
        toolbar.menuline(group=True, hidden="^.modified:=!{}").span("Unsaved changes", role="status", class_="visual-editor-hint")
        toolbar.menuline(group=True).span("^.fileStatus", role="status", class_="visual-editor-file-status")
        toolbar.menuline(group=True).span("^.filename", class_="visual-editor-filename")
        left = layout_root.left
        left.setAttr(dict(width="min(240px, 34vw)", splitter=True,
                          drawer="^.navigationOpen", default_drawer=True, drawer_label="Source / Data",
                          drawer_onclick="this.SET('.navigationOpen', show ? true : 'close')",
                          display="flex", flex_direction="column", min_height=0, class_="visual-editor-sidebar"))
        sidebar = left.borderContainer(height="100%", flex=1, min_height=0)
        navigation = sidebar.contentPane(region="center").borderContainer(height="100%", min_height=0)
        source_stack = navigation.contentPane(region="center").borderContainer(height="100%", min_height=0)
        source = source_stack.contentPane(node_label="source", region="center", title="Source", detachable=True,
                                        display="flex", flex_direction="column", min_height=0, overflow="hidden")
        self.search(source, "sourceSearch", "Search Source")
        source.tree(storepath=f"*S.{'.'.join(pane.fullpath.split('.')[1:])}.layout.center.design", hideValues=True, getLabel="sourceLabel", searchText="^.sourceSearch",
                    selectedPath="^.selection", draggable=True, dragTags=f"{editor_id}Source", effectAllowed="all",
                    onDrag="prepareSource", dropTarget=True, dropTypes="app/widget,app/source,app/clipboard", dropTags=f"widget,{editor_id}Source,{editor_id}Clipboard",
                    dropEffect="^.sourceDropEffect", onDrop="dropNode", id=f"{editor_id}-source-tree", class_="visual-source-tree", flex=1, min_height=0)
        shelf = source_stack.contentPane(node_label="clipboard", region="bottom", height="112px", splitter=True, minSize=80, title="Clipboard", detachable=True, hidden="^.clipboardVisible:=!{}", display="flex", flex_direction="column",
                                       min_height=0, overflow="hidden", dropTarget=True, dropTypes="app/source", dropTags=f"{editor_id}Source",
                                       dropEffect="^.clipboardDropEffect", connect_ondragover="clipboardModifiers",
                                       connect_ondrop="clipboardModifiers", onDrop="dropClipboard", class_="visual-clipboard")
        shelf.span("Drop a branch here · Option to copy", class_="visual-editor-hint")
        shelf.tree(storepath=".clipboard", hideValues=True, labelAttribute="name", selectedPath="^.clipboardSelection",
                   draggable=True, dragTags=f"{editor_id}Clipboard", effectAllowed="copy", onDrag="prepareClipboard",
                   id=f"{editor_id}-clipboard-tree", class_="visual-clipboard-tree", flex=1, min_height=0)
        shelf.p("^.error", role="alert", class_="visual-editor-hint")
        data = navigation.contentPane(node_label="data", region="bottom", title="Data", detachable=True, height="108px", splitter=True, minSize=80, display="flex", flex_direction="column",
                                      min_height=0, overflow="hidden")
        self.search(data, "dataSearch", "Search Data")
        data.tree(storepath=f"*D.{self.data_root}" if self.data_root else "*D", excludeRoot="__editor" if not self.data_root else None, searchText="^.dataSearch", id=f"{editor_id}-data-tree", flex=1, min_height=0)
        center = layout_root.center
        center.setAttr(dict(overflow="auto", class_="visual-editor-workspace"))
        design = center.div(node_label="design", class_="visual-editor-canvas")
        design.div(node_label="pageRoot", **({"datapath": self.data_root} if self.data_root else {}))
        window = pane.floatingPane(title="Widget catalogue", open="^.catalogueOpen", default_open=False, width="280px", height="400px", class_="visual-editor-popup",
                                   movable=True, resizable=True)
        self.search(window.frame.top, "catalogueSearch", "Search widgets")
        window.frame.center.tree(storepath=".catalogue", hideValues=True, labelAttribute="caption",
                                 searchText="^.catalogueSearch", draggable=True, dragTags="widget",
                                 effectAllowed="all", onDrag="prepareWidget", id=f"{editor_id}-widget-tree")
        properties = sidebar.contentPane(region='bottom', height='^.propertiesHeight', default_height='200px', minSize=140, splitter=True,
                                          title='^.propertiesTitle', detachable=True, hidden='^.propertiesOpen:=!{}',
                                          display='flex', flex_direction='column', overflow='hidden', min_height=0)
        properties.div(nodeId=f'{editor_id}EditorFields', class_='visual-editor-fields', display='flex',
                       flex_direction='column', flex=1, min_height=0).span('')
        properties.p('^.propertyError', role='alert', class_='visual-editor-hint', margin='3px')
        uploader = pane.dialog(class_="visual-editor-popup", title="Open Source", open="^.uploadOpen", width="480px", height="300px",
                               movable=True, resizable=True)
        uploader.frame.center.uploader(operation=upload_operation, storepath=".uploadQueue",
                                       accept=".grmlt", multiple=False, autoUpload=True,
                                       onComplete="sourceUploaded", id=f"{editor_id}-uploader")
        naming = pane.dialog(class_="visual-editor-popup", title="Save branch to clipboard", open="^.clipboardOpen", width="380px", height="210px")
        naming.frame.center.textbox(value="^.clipboardDraft.name", lbl="Name", margin="12px")
        naming.frame.center.p("^.error", role="alert", margin="12px")
        naming_bar = naming.frame.bottom.menu(presentation="bar", aria_label="Clipboard commands", padding="3px 6px")
        naming_bar.spacer(flex=1)
        naming_buttons = naming_bar.menuline(group=True, gap="8px")
        naming_buttons.button("Cancel", action="this.SET('.clipboardOpen', false)")
        naming_buttons.button("Save branch", action="saveClipboard")
        dialog = pane.dialog(class_="visual-editor-popup", title="Required parameters", open="^.insertionOpen", width="400px", height="280px",
                             movable=True, resizable=True)
        dialog.frame.center.div(nodeId=f"{editor_id}InsertFields", class_="visual-editor-fields", padding="6px").span("")
        dialog.frame.center.p("^.error", role="alert")
        bar = dialog.frame.bottom.menu(presentation="bar", aria_label="Insertion commands",
                                       padding="3px 6px", border_top="1px solid var(--gramlot-border)")
        bar.spacer(flex=1)
        buttons = bar.menuline(group=True, gap="8px")
        buttons.button("Cancel", action="this.SET('.insertionOpen', false)")
        buttons.button("Insert", action="insertWidget")
        settings = pane.floatingPane(class_="visual-editor-popup", title='Appearance', open='^.appearanceOpen', default_open=False, width='280px', height='260px', movable=True, resizable=True)
        form = settings.frame.center.formlet(columns=1, lbl_position='TL', gap='4px', padding='6px')
        form.filteringSelect(validate_notnull=True, lbl='Theme', value='^.appearanceProfile', values='base:Base,compact:Compact,mimi:Mimi,joanna:Joanna,mela:Mela')
        form.filteringSelect(validate_notnull=True, lbl='Colors', value='^.appearancePalette', values='default:Theme default,compact:Blue & slate,mimi:Sage & green,joanna:Warm gray & blue')
        form.filteringSelect(validate_notnull=True, lbl='Mode', value='^.appearanceMode', values='light:Light,dark:Dark')
        pane.p("^.error", role="alert", class_='visual-editor-error', hidden='^.error:=!{}')
        self.frame, self.toolbar, self.design = layout_root, toolbar, design
        if code_document is not None:
            self.code_document(code_document)

    @staticmethod
    def tool_button(parent, caption, action, icon, **attributes):
        attributes.setdefault('title', caption)
        button = parent.button(aria_label=caption, action=action, class_='button--quiet visual-editor-tool', **attributes)
        button.span(class_='visual-tool-icon', aria_hidden='true', style=f'mask-image:url("{icon}")')
        return button

    def code_document(self, document, *, frame=None):
        if document['language'] not in ('python', 'javascript'):
            raise ValueError('Expected a Python or JavaScript page document')
        pane = self.pane
        pane.set_attr(dict(codeDocumentKey=document["key"]))
        pane.dataSetter('.codeDocument', Bag(dict(document, saved=document['content'], busy=False, status='')))
        frame = self.frame if frame is None else frame
        opener = self.toolbar if frame is self.frame else frame.top.menu(presentation='bar', aria_label='Code drawer')
        opener.menuline(group=True).button('Code', action='openCode', class_='button--quiet')
        drawer = frame.right
        drawer.set_attr(class_='visual-editor-code', datapath=f"#{pane.attr['visualEditorId']}Editor", title='Page code', detachable=True,
                        width='60%', minSize=240, splitter=True, drawer='^.codeOpen', default_drawer='close',
                        drawer_label='Code', drawer_minimize=False,
                        drawer_onclick="this.SET('.codeOpen', show ? true : 'close')", min_height=0, overflow='hidden')
        code = drawer.framePane(height='100%', width='100%', min_width=0, flex=1)
        code.top.set_attr(height='26px')
        code.bottom.set_attr(height='48px')
        code.center.set_attr(display='flex', flex_direction='column', min_height=0, overflow='hidden')
        code.top.div(document['path'], padding='3px 6px', font_size='12px', overflow='hidden',
                     text_overflow='ellipsis', white_space='nowrap')
        code.center.codeMirror(value='^.codeDocument.content', language=document['language'], live=True,
                               readonly='^.codeDocument.writable:=!{}', height='100%', box_height='100%', box_c_height='100%', box_min_height=0, box_c_min_height=0, fontSize=13, flex=1, min_height=0)
        code.bottom.div('^.codeDocument.status', role='status', font_size='12px', padding='4px 10px')
        bar = code.bottom.menu(presentation='bar', aria_label='Page code commands', padding='3px 6px')
        bar.spacer(flex=1)
        commands = bar.menuline(group=True, gap='6px')
        commands.button('Close', action="this.SET('.codeOpen', 'close')")
        commands.button('Preview saved', action='codePreview', disabled='^.codeDocument.busy')
        commands.button('Save', action='codeSave', disabled='^.codeSaveDisabled')
        pane.dataFormula('.codeSaveDisabled', '!writable || busy || content === saved',
                         writable='^.codeDocument.writable', busy='^.codeDocument.busy',
                         content='^.codeDocument.content', saved='^.codeDocument.saved', _init=True)

    def search(self, pane, path, label):
        bar = pane.menu(presentation="bar", aria_label=label, class_="visual-search-toolbar")
        field = bar.menuline(group=True, flex=1, min_width=0).div(class_="visual-search-field")
        field.span(class_="visual-search-icon", aria_hidden="true")
        field.input(type="search", value=f"^.{path}", default="", live=True, placeholder=label, aria_label=label)
        field.html_button(type="button", class_="visual-search-clear", aria_label=f"Clear {label.lower()}",
                          hidden=f"^.{path}:={{}} === ''", connect_onclick=f"this.SET('.{path}', '')")
