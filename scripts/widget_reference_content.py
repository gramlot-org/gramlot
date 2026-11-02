"""Teaching notes for generated references; executable contracts live in grammars."""

# title, purpose, minimal main() body, behavior and boundaries
COLLECTION_GUIDES = {
    'inputs': (
        'Inputs',
        'Use a component when you need typed values, shared labels, validation or choices. '
        'Use `html_input` when you want the native HTML tag. Both participate in Source/Data bindings; '
        'a component adds its own parameter and editing contract.',
        'pane = root.div(datapath="customer")\n'
        'pane.textbox(value="^.name", lbl="Name", live=True)\n'
        'pane.numberTextBox(value="^.seats", lbl="Seats")',
        '`^` paths are relative to the containing datapath when they start with a dot. '
        'Put interface defaults in `default`; load record values into Data. '
        'Do not rebuild a control when its value changes.\n\n'
        'For typed fields, incomplete text belongs to Source editing state; Data retains the '
        'last typed value. A parseable value can be invalid under validation rules: the form '
        'tracks the error and blocks saving. See '
        '[form editing state](340-components-and-collections-guide.md#gc-340-110) and '
        '[field behavior](105-components.md#gc-105-040).\n\n'
        '`dbSelect` and `dbComboBox` describe remote choices, not a built-in database. '
        'The generic `method` contract uses an application endpoint; Asqueel query capabilities '
        'require its server integration. They are not available in a file-only export without a server.'),
    'buttons': (
        'Menus and buttons',
        'One command hierarchy can appear as a popup or a toolbar. A toolbar is '
        '`menu(presentation="bar")`; its entries remain `menuline`, with ordinary Source children '
        'for embedded controls. A dropdown button is a different component.',
        'bar = root.menu(presentation="bar")\n'
        'bar.menuline("documents:save")\n'
        'bar.spacer(flex=1)\n'
        'bar.menuline("documents:close")',
        'This body assumes the environment has registered `documents:save` and `documents:close`. '
        'The entries inherit the registered captions/icons; commands publish to the configured target. '
        'A Save command does not itself persist Data. '
        '[Register commands and choose targets](350-menus-toolbars-and-windows.md).\n\n'
        'The same guide covers resolver submenus, context/modifier opening, grouped overflow, '
        'priorities and icon-only presentation. Use `iconSrc` for SVG images; `icon` is text/emoji. '
        'The buttons collection is built into the base grammar.'),
    'layout': (
        'Layout and windows',
        'Choose `formlet` for aligned fields, `borderContainer` for regions, `tabContainer` '
        'for selectable panels and `framePane` for reusable toolbar/content compositions. '
        '`dialog` is modal; `floatingPane` keeps the rest of the page usable.',
        'tabs = root.tabContainer(height="240px")\n'
        'for key, title in (("details", "Details"), ("notes", "Notes")):\n'
        '    panel = tabs.contentPane(node_label=key, title=title, datapath=key)\n'
        '    panel.textbox(value="^.text", lbl=title)',
        'This example also uses the inputs collection. Distinct relative datapaths isolate each '
        'panel\'s Data. `title` is a child parameter projected by the tab container, not a textbox '
        'parameter. See [containers](105-components.md#gc-105-085).\n\n'
        'Use the shared Labelbox (`lbl`, `lbl_*`, `box_*`) around HTML or components. '
        'A `trayPane` owns card geometry and selection through its `storepath` Bag; '
        'moving/resizing its DOM must retain content and bindings. '
        '[Tray workspaces](105-components.md#gc-105-970). '
        '[Form state and editingStatus](340-components-and-collections-guide.md#gc-340-110) '
        'track local changes/errors/pending validation; accepting a local baseline is not a server save.'),
    'tree': (
        'Trees',
        'A tree presents a Data Bag. Nodes can carry captions and child resolvers; '
        'the tree owns disclosure and selection, while the Bag remains the data source.',
        'pane = root.div(datapath="catalog")\n'
        'pane.textbox(value="^.search", placeholder="Search", live=True)\n'
        'pane.tree(storepath=".items", searchText="^.search", height="280px")',
        'The example also uses inputs and expects `catalog.items` to contain a Bag, loaded '
        'by the page or a resolver. `searchText` filters the tree, including resolvable branches; '
        'clearing it restores the prior tree view. Resolver work may involve server requests. '
        '[Tree data, selection and drag/drop](105-components.md#gc-105-120). '
        '`rowActions` supplies contextual commands; it is not a second data store.'),
    'editors': (
        'Editors and previews',
        'Editors bind a retained editing instance to Data; previews display a value without '
        'editing it. Engine resources load when needed, independently of collection availability.',
        'pane = root.div(datapath="draft")\n'
        'pane.markdownEditor(value="^.text", height="220px")\n'
        'pane.markdownPreview(value="^.text")',
        'Both controls share one value. External Data updates use supported engine setters rather '
        'than recreating the editor. Editor instances are not application state. '
        'HTML/Markdown rendering uses the runtime sanitization/Markdown services, with component-specific '
        'policies; do not bypass them by inserting generated HTML yourself. '
        '[Modes and engine options](105-components.md#gc-105-125).\n\n'
        'A serverless export opened from file must include the required engine resources in its '
        'exported module graph. Do not replace imports with CDN requests or assume a Python endpoint '
        'exists in a file-only page.'),
    'typst': (
        'Typst previews',
        'Render a Typst document using the preview component. Compiler/worker resources are '
        'separate from ordinary input and layout components.',
        'root.typstPreview(value="^document.source", height="360px")',
        'Load `document.source` as text before rendering, or bind an editor to the same path. '
        'Compiler resources and document assets must be available to the configured preview engine. '
        'Do not infer a server endpoint from this component declaration. '
        '[Compilation and resource contract](105-components.md#gc-105-145).'),
    'uploads': (
        'Uploads and attachments',
        'Use an uploader for a file queue, an imageUploader for an editable image, or '
        'attachmentManager for an attachment list. Upload destinations remain application-owned.',
        'root.uploader(operation="receive", storepath="uploads",\n'
        '              selectedPath="^selectedUpload")',
        'Initialize `uploads` as an empty Data Bag before rendering. This body requires '
        'the host/application upload operation `receive`. Queue/progress '
        'state goes into the Data Bag at `uploads`; selecting a queued file writes the bound '
        '`selectedPath`. Declaring the control does not configure storage or permissions. '
        '[Upload operations, callbacks and limits](105-components.md#gc-105-uploader). '
        'Keep the documented WebKit limitation when qualifying file-input behavior; do not '
        'claim that browser automation validates every native chooser interaction.'),
    'grid': (
        'Grids',
        'A grid displays rows from a Bag and columns from a Source struct or a separate structure '
        'Bag. Loading records is the responsibility of a selection store/provider. '
        'The grid itself is independent of SQL and Asqueel.',
        'grid = root.grid(storepath="customers", rowMode="values", height="280px")\n'
        'columns = grid.struct()\n'
        'columns.column("name", name="Customer")\n'
        'columns.column("seats", name="Seats", dtype="L")',
        'Load `customers` with a Bag whose row nodes contain Bags with `name` and `seats` fields. '
        '`storepath` and `rowMode` are required. Use `values` for nested row Bags or `attributes` '
        'for rows whose fields are node attributes; these representations are explicit, not guessed. '
        'Declare an inline `struct` or use `structpath`, not both.\n\n'
        '`frameGrid(...)` is a Python composition helper: it returns a frame with `.grid`, '
        '`.top`, `.bottom`, `.left` and `.right` for ordinary Source controls. `searchBox` '
        'requires a grid Source context; place it in that composition\'s toolbar.\n\n'
        'Columns are described below, including nested column groups and validation constraints. '
        'Column editing uses the shared field/form contract; see '
        '[local editing](340-components-and-collections-guide.md#gc-340-110). '
        'A resident Bag, server-backed cached selection and database query are different store '
        'capabilities. Generic endpoints remain application-owned; Asqueel-only query options '
        'require the Asqueel host and its authorization policy. No DB access is implied by `grid`. '
        'Viewport output is for the configured store/provider, not an instruction to fetch every row.'),
    'chat': (
        'Chat',
        '`chatMessages` is the scrolling live-Source message viewport. `ChatPane` is a Python '
        'composition helper, not another grammar tag: it combines this viewport with frames, '
        'a composer, status and ordinary toolbar controls.',
        'from gramlot import ChatPane\n\n'
        'chat = ChatPane(root, datapath="assistant", height="480px")\n'
        'chat.frame.top.strong("Assistant")',
        'The environment needs both chat and layout. This body is the UI part; sending also '
        'requires the Page Logic delegates and PageStore below. `ChatPane` accepts a required '
        '`datapath`, optional `chat_id="main"` (a literal identifier starting with a letter, '
        'then letters/digits/underscores), and frame attributes. Each conversation uses its own '
        'Data scope. `.frame`, `.composer`, `.messages` and `.toolbar` expose existing Source '
        'containers for composition.\n\n'
        'Companion page JavaScript:\n\n'
        '```javascript\n'
        'import {chatRender, chatSend, chatCompleted, chatReset, chatResize,\n'
        '        chatPickAttachments, chatRenderAttachments, chatRemoveAttachment}\n'
        '    from "@gramlot/gramlot";\n'
        'export class Logic {\n'
        '    chatRender(node, params) { return chatRender(this.page, node, params); }\n'
        '    chatSend(node) { return chatSend(this.page, node); }\n'
        '    chatCompleted(node, params) { return chatCompleted(this.page, node, params); }\n'
        '    chatReset(node) { return chatReset(this.page, node); }\n'
        '    chatResize(node) { return chatResize(this.page, node); }\n'
        '    chatPickAttachments(node) { return chatPickAttachments(this.page, node); }\n'
        '    chatRenderAttachments(node, params) { return chatRenderAttachments(this.page, node, params); }\n'
        '    chatRemoveAttachment(node) { return chatRemoveAttachment(this.page, node); }\n'
        '}\n```\n\n'
        'A companion PageStore supplies processing; the default hook echoes the submitted message:\n\n'
        '```python\nfrom gramlot import ChatPageStore\n\n'
        'class PageStore(ChatPageStore):\n    pass\n```\n\n'
        'Override `process_message(self, text)` to return a string or Gramlot SourceBag; '
        'plain Data Bags and HTML response formats are not accepted. Distinct panes need distinct '
        '`datapath` and `chat_id`; declare allowed IDs in `ChatPageStore.chat_ids` (default `("main",)`). '
        'Application integrations replace the processing hook and own credentials, permissions '
        'and persistence. Logic only delegates behavior; conversation state remains in Data/Source. '
        'The component has no provider/model/temperature parameters. A file-only export cannot '
        'execute this Python PageStore.'),
    'grouplets': (
        'Grouplets',
        'Reuse a Source-building method as a fragment. A grouplet provides the content host; '
        'groupletCard adds a title, folding and optional bound controls. Relative datapaths '
        'make the same fragment reusable with different Data.',
        'for key in ("billing", "shipping"):\n'
        '    root.groupletCard(title=key.title(), remote="address", datapath=key,\n'
        '                      collapsible=True)',
        'Define the Source endpoint on the same Page (the inputs collection supplies textbox):\n\n'
        '```python\nfrom gramlot import source\n\n'
        '@source\ndef address(self, pane):\n'
        '    pane.textbox(value="^.city", lbl="City")\n```\n\n'
        'The remote binding owns requests, children and cleanup. Do not add a second request '
        'from component DOM lifecycle hooks. [Remote Source contract](099-remote-content.md).\n\n'
        '`collapsed` and `checkbox` support writeback. `checkbox=None` hides the control; '
        '`False` displays it unchecked. `delitem=None` hides Clear, `False` disables it, '
        '`True` enables it. The optional `doc` is bound Markdown for the in-card guide; '
        'empty text hides its information button. `chromeSide` only accepts top/left/right. '
        'Card folding, remote fragments and a full form/save lifecycle are distinct responsibilities; '
        'do not infer legacy GroupletForm APIs from this card.'),
}
