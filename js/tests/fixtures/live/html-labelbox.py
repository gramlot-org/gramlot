"""Experimental Python-authored fixture; no gallery or adapter dependency."""
from gramlot import GramlotBuilder
from pathlib import Path
import json


def panel(parent, path, title):
    box = parent.div(datapath=path, lbl=title, lbl_position="^demo.position",
                     box_padding="14px", box_border="1px solid #bcc8d7",
                     box_border_radius="8px", box_background="#fff",
                     box_c_min_width="0", lbl_width="min(35vw, 10rem)", lbl_font_weight="600", lbl_color="#314766")
    box.p("This is an ordinary HTML div. Its children keep their Source and Data.")
    box.input(id=path + "-native", value="^.name", default="Ada", live=True, lbl="Name",
              lbl_position="^demo.position", width="100%", min_width="0", padding="8px", border="1px solid #99a9bd",
              border_radius="4px", box_margin_bottom="10px")
    box.p("^.name", color="#275f9e", font_weight="600")


def main(root):
    root.dataSetter("demo.caption", "A labelled div")
    root.dataSetter("demo.position", "TL")
    page = root.div(margin="0", padding="12px",
                    font_family="system-ui", color="#203149")
    page.h1("TrayPane playground", margin="0 0 6px", font_size="24px")
    page.p("Drag a title, resize a corner, use the left grip to rotate, and the right icons for layer and zoom. Shift+click adds cards; drag empty space to select a rectangle.", margin="0 0 12px")
    composed_workspace(page)
    guide = page.details(margin_top="12px")
    guide.summary("Instructions and additional checks", cursor="pointer", font_weight="600")
    page = guide.div(padding="12px 0", max_width="850px")
    movement(page)
    page.p("Experimental branch. Change the title or label position, then type in either Name field. The two blocks have independent relative datapaths.")
    page.input(value="^demo.caption", live=True, lbl="Panel title", width="100%",
               padding="8px", box_margin_bottom="12px")
    page.html_label("Label position", for_="position")
    choices = page.select(id="position", value="^demo.position", margin="0 0 16px 10px")
    for value in ("TL", "TC", "TR", "L", "R", "BL", "BC", "BR"):
        choices.option(value, value=value)
    blocks = page.div(display="grid", gap="16px")
    for path, title in (("first", "^demo.caption"), ("second", "Another ordinary div")):
        panel(blocks, path, title)
    group = page.groupBox(id="mixed-group", lbl="HTML and components together", copy=True,
                          datapath="mixed", box_margin_top="16px")
    form = group.formlet(col_min_width="18rem", lbl_position="^demo.position")
    form.input(id="mixed-native", lbl="HTML input", value="^.name", default="Ada", live=True, width="100%")
    form.textbox(id="mixed-component", lbl="Gramlot textbox", value="^.name", live=True, width="100%")
    form.checkbox(id="mixed-check", lbl="Enabled", value="^.enabled", default=False)
    form.div(lbl="Whole panel").p("A single Labelbox can contain a composed panel.")
    page.button("Open labelled frame", action="SET demo.windowOpen = true;")
    window = page.floatingPane(id="frame-window", title="Labelled frame", open="^demo.windowOpen",
                               width="300px", height="230px")
    window.frame.set_attr(dict(lbl="Frame content", lbl_position="^demo.position"))
    window.frame.center.input(id="frame-input", value="^mixed.name", live=True)
    page.p("Unlabelled HTML retains its original DOM. Labels and positions update without recreating controls. Structural HTML constraints and static exports are separate concerns.", font_size="13px", color="#52627a")


def composed_workspace(page):
    page.dataSetter("composed_layout", {
        "workspace": {"left": 20, "top": 20, "width": 440, "height": 430, "layer": 0},
        "mixer": {"left": 500, "top": 20, "width": 260, "height": 260, "layer": 0},
        "checklist": {"left": 800, "top": 20, "width": 240, "height": 260, "layer": 0},
        "memo": {"left": 500, "top": 320, "width": 300, "height": 250, "layer": 0},
    })
    page.dataSetter("tray_ui", {"locked": False, "saved": False, "gridStep": 10, "gridVisible": False, "rotationStep": 15})
    page.dataFormula("tray_ui.restore_disabled", "!saved", saved="^tray_ui.saved", _init=True)
    surface = page.framePane(height="max(700px, calc(100dvh - 90px))", border="1px solid #bcc8d7", border_radius="10px", background="#edf1f6")
    toolbar = surface.top.menu(id="tray-toolbar", presentation="bar", height="42px", border_bottom="1px solid #bcc8d7")
    toolbar.menuline(caption="Lock layout", icon="🔒", checked="^tray_ui.locked",
                     action="this.SET('tray_ui.locked', !this.GET('tray_ui.locked'))")
    controls = toolbar.contentPane(display="flex", align_items="center", padding="0 8px")
    controls.input(type="number", lbl="Grid px", lbl_position="L", value="^tray_ui.gridStep", min=0, step=1, width="62px", box_margin_left="12px")
    controls.checkbox(lbl="Grid", lbl_position="R", value="^tray_ui.gridVisible", box_margin_left="8px")
    controls.input(type="number", lbl="Shift °", lbl_position="L", value="^tray_ui.rotationStep", min=0, step=1, width="62px", box_margin_left="12px")
    toolbar.spacer(flex=1)
    toolbar.menuline(caption="Save layout", action="this.SET('saved_layout', this.GET('composed_layout').deepcopy()); this.SET('saved_tray_settings', this.GET('tray_ui').deepcopy()); this.SET('tray_ui.saved', true)")
    toolbar.menuline(caption="Restore layout", disabled="^tray_ui.restore_disabled",
                     action="this.SET('composed_layout', this.GET('saved_layout').deepcopy()); this.SET('tray_ui', this.GET('saved_tray_settings').deepcopy()); this.SET('tray_ui.saved', true)")
    surface.top.div("Hold Shift while moving, resizing or rotating to snap. Grid visibility is independent; 0 disables snapping.",
                font_size="12px", padding="4px 10px", color="#52627a")
    viewport = surface.center
    viewport.set_attr(dict(overflow="auto"))
    tray = viewport.trayPane(id="composed-tray", storepath="composed_layout",
                            locked="^tray_ui.locked", gridStep="^tray_ui.gridStep", gridVisible="^tray_ui.gridVisible",
                            rotationStep="^tray_ui.rotationStep", min_width="1080px", height="100%", min_height="620px",
                            background="#e5ebf1")
    workspace_card(tray)
    mixer_card(tray)
    checklist_card(tray)
    memo_card(tray)


def workspace_card(tray):
    frame = tray.borderContainer(node_label="workspace", id="composed-workspace", lbl="Workspace",
                    datapath="project", minWidth=220, minHeight=320,
                    height="100%", box_c_padding="0")
    top = frame.contentPane(region="top", height="42px", background="#edf1f6",
                            border_bottom="1px solid #ccd4df")
    bar = top.menu(presentation="bar", height="100%")
    bar.menuline(caption="Apply", action="this.SET('.savedOwner', this.GET('.owner'))")
    bar.spacer(flex=1)
    bar.menuline(caption="Reset", action="this.SET('.owner', 'Ada'); this.SET('.seats', 3); this.SET('.notes', ''); this.SET('.savedOwner', '')")
    center = frame.contentPane(region="center")
    tabs = center.tabContainer(id="workspace-tabs", selectedPage="^.tab", height="100%")
    details = tabs.contentPane(pageName="details", title="Details", padding="12px")
    form = details.formlet(col_min_width="10rem", lbl_position="TL", gap="10px")
    form.textbox(lbl="Owner", value="^.owner", default="Ada", live=True, width="100%")
    form.numberTextBox(lbl="Seats", value="^.seats", default=3, dtype="L", width="100%")
    form.checkbox(lbl="Notifications", value="^.notifications", default=True)
    options = tabs.contentPane(pageName="options", title="Options", padding="12px")
    form = options.formlet(columns=1, lbl_position="TL", gap="10px")
    form.colorpicker(lbl="Accent", value="^.accent", default="#4b78b8")
    form.horizontalSlider(lbl="Volume", value="^.volume", default=40, min=0, max=100, live=True)
    form.textBoxArea(lbl="Notes", value="^.notes", default="", live=True, width="100%", height="90px")
    footer = frame.contentPane(region="bottom", height="30px", padding="5px 10px",
                               font_size="12px", background="#edf1f6", border_top="1px solid #ccd4df")
    footer.span("Last applied: ")
    footer.span("^.savedOwner", font_weight="600")


def tray_card(tray, key, title):
    return tray.div(node_label=key, lbl=title, datapath=key, minWidth=180, minHeight=160)


def mixer_card(tray):
    card = tray_card(tray, "mixer", "Mixer")
    for name, value in (("bass", 35), ("treble", 65)):
        card.horizontalSlider(lbl=name.title(), value=f"^.{name}", default=value,
                              min=0, max=100, live=True, box_margin_bottom="12px")
    card.button("Reset levels", action="SET .bass = 35; SET .treble = 65;")


def checklist_card(tray):
    card = tray_card(tray, "checklist", "Checklist")
    card.p("Ready to publish?", margin="0 0 12px")
    for key, label in (("content", "Content reviewed"), ("links", "Links checked"),
                       ("preview", "Preview approved")):
        card.checkbox(lbl=label, lbl_position="R", value=f"^.{key}", default=False,
                      box_margin_bottom="12px")


def memo_card(tray):
    card = tray_card(tray, "memo", "Notes")
    card.textBoxArea(value="^.text", default="Try editing this note, then move the card.",
                     live=True, width="100%", height="130px")
    card.button("Clear", action="SET .text = '';", margin_top="8px")


def movement(page):
    page.dataSetter("workspace", {"customer": {"selected": False, "layer": 0, "left": 12, "top": 14, "width": 220, "height": 290},
                                  "notes": {"selected": False, "layer": 0, "left": 30, "top": 344, "width": 220, "height": 290}})
    page.h2("Move, resize and transform the cards")
    page.p("Drag a dark title to move, the upper-left circular arrow to rotate, or the lower-right grip to resize. Try the sliders, toolbar and Reset buttons: each card keeps its own Data. Blocks on the same layer stop at contact. Different layers may overlap; larger layer numbers appear above. The two upper-right icons open vertical sliders for layer (−10 to +10) and zoom. Try Zoom 60%, then rotate with the upper-left grip to leave room near the tray edges. The sliders remain upright. Rotation and zoom stop at contact or at the tray edge. A conflicting layer change is refused. Geometry, rotation, zoom, layer and selection live in the workspace Bag.")
    page.p("Click a card to select it; Shift+click adds or removes one. Click empty tray space to clear the selection, or drag a rectangle around several cards. Hold Shift to add enclosed cards; Escape cancels. The checkboxes below read and write the same Bag state. Drag a selected title to move the whole selection, preserving its spacing. The first contact or tray edge stops the whole group; resize and rotation affect only their own card.")
    layers = page.formlet(columns=2, col_min_width="8rem", margin="12px 0")
    for key, title in (("customer", "Customer"), ("notes", "Notes")):
        layers.numberTextBox(lbl=title + " layer", value="^workspace." + key + ".layer", dtype="L")
        layers.checkbox(lbl=title + " selected", value="^workspace." + key + ".selected")
    tray = page.trayPane(id="move-tray", storepath="workspace", height="680px",
                        border="1px solid #bcc8d7", border_radius="10px", background="#e5ebf1")
    for key, title in (("customer", "Customer"), ("notes", "Notes")):
        card = tray.div(node_label=key, id="move-" + key, lbl=title,
                        minWidth=160, minHeight=100, datapath=key)
        card.textbox(lbl="Name" if key == "customer" else "Note", value="^.text",
                     default="Ada" if key == "customer" else "Try moving me", live=True, width="100%")
        card.horizontalSlider(lbl="Intensity", value="^.level", default=35, min=0, max=100, live=True, box_margin_top="10px")
        card.p("^.level", font_weight="600", margin="4px 0")
        bar=card.menu(presentation="bar", border_top="1px solid #ccd4df", margin_top="8px")
        for caption, delta in (("−10", -10), ("+10", 10)):
            bar.menuline(caption=caption, action=f"this.SET('.level', Math.max(0, Math.min(100, this.GET('.level') + {delta})))")
        bar.spacer(flex=1)
        card.button("Reset intensity", action="SET .level = 35;", margin_top="8px")
    positions = page.formlet(columns=2, col_min_width="8rem", margin="12px 0 20px")
    for key in ("left", "top", "width", "height"):
        positions.input(type="number", lbl="Customer · " + key, value="^workspace.customer." + key, live=True, width="100%")
    page.button("Reset movement test", action="SET workspace.customer.left = 12; SET workspace.customer.top = 14; SET workspace.customer.width = 220; SET workspace.customer.height = 290; SET workspace.notes.left = 30; SET workspace.notes.top = 344; SET workspace.notes.width = 220; SET workspace.notes.height = 290; SET workspace.customer.layer = 0; SET workspace.notes.layer = 0;")


if __name__ == "__main__":
    collections = Path(__file__).resolve().parents[4] / "src/gramlot/collections"
    builder = GramlotBuilder(collections=[json.loads((collections / (name + ".json")).read_text())
                                         for name in ("inputs", "layout")])
    main(builder.root)
    print(builder.to_tytx())
