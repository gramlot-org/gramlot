"""A Source-composed IDE for host-backed text documents."""
from genro_bag import Bag
from gramlot.collections.typst import mygramlot as typst
from .frame_page import FramePage
from .filesystem import file_system_tree


class IdePage(FramePage):
    gramlots = [typst]
    title = "Gramlot IDE"
    shell_id = "gramlot-ide"
    datapath = "ide"

    def top(self, pane):
        pane.set_attr(dict(padding="12px", height="110px"))
        pane.h2(self.title, margin="0 0 8px")
        row = pane.div(display="flex", gap="8px", align_items="end")
        row.comboBox(value="^.workspace", store="^.recent", lbl="Workspace directory",
                     placeholder="Directory on this server", flex="1", id=f"{self.shell_id}-workspace",
                     connect_onfocusout="ideOpenWorkspace")

        row.filteringSelect(value="^.newType", values="typst:Typst,typstRecipe:Typst Python recipe,markdown:Markdown,html:HTML,python:Python,javascript:JavaScript,typescript:TypeScript,json:JSON,css:CSS,sql:SQL,xml:XML,text:Text", lbl="Document type", width="160px")
        row.button("New document", class_="button--quiet").dataController(func="ideNew")
        row.button("Upload image", id=f"{self.shell_id}-upload", disabled="^.upload.disabled",
                   action="this.SET('.upload.open', true)")
        window = pane.dialog(title="Upload image", open="^.upload.open", width="520px", height="400px",
                             movable=True, resizable=True)
        window.frame.center.uploader(id=f"{self.shell_id}-uploader", operation="workspace_upload",
                                     storepath=".upload.queue", contextPath=".upload.context",
                                     accept="image/png,image/jpeg,image/webp", multiple=False,
                                     onComplete="ideUploadCompleted")

    def left(self, pane):
        pane.set_attr(dict(width="300px", splitter=True, drawer=True, drawer_label="Files", overflow="auto"))
        file_system_tree(pane, datapath=".browser", node_label="browser", height="100%")

    def center(self, pane):
        pane.tabContainer(node_label="tabs", selectedPage="^.active", height="100%", selfsubscribe_closed="ideClosed")

    def bottom(self, pane):
        pane.set_attr(dict(height="32px", padding="6px 12px"))
        pane.div("^.status", role="status", id=f"{self.shell_id}-status")

    def behavior(self, shell):
        for name, value in {"workspace": "", "recent": Bag(), "documents": Bag(),
                            "active": None, "newType": "typst", "upload": Bag(dict(open=False, disabled=True,
                            queue=Bag(), context=Bag())), "status": "Choose a workspace directory to begin."}.items():
            shell.dataSetter(f".{name}", value)
        shell.dataFormula('.upload.context.root', 'root', root='^.browser.root', _init=True)
        shell.dataFormula('.upload.disabled', '!root || !writable', root='^.browser.root',
                          writable='^.browser.writable', _init=True)
        shell.dataController(func="ideMount", _onStart=True)
