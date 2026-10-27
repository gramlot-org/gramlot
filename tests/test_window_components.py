from gramlot import GramlotBuilder
import json
from importlib.resources import files


def test_python_window_frame_and_native_dialog_are_distinct():
    b = GramlotBuilder(collections=[json.loads(files('gramlot').joinpath('collections/layout.json').read_text())])
    window = b.root.dialog(title="Modal", open="^open", width="400px", maximizable=True, maximized="^maximized")
    assert window.frame is window.frame
    assert window.frame.top is window.frame.top
    assert window.frame.node_tag == "framePane"
    assert len(window.static_value) == 1
    assert b.root.html_dialog().node_tag == "html_dialog"
    floating = b.root.floatingPane(open="^floating", maximizable=True, maximized="^float_maximized")
    floating.frame.center.div("Tools")
    assert floating.node_tag == "floatingPane"
