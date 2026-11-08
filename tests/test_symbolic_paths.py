"""Legacy symbolic datapaths in the Python resolver: the cases shared with js/tests/symbolic-paths.test.js."""
import json
from pathlib import Path

import pytest

from gramlot.page.builder import GramlotBuilder
from gramlot.page.source import string_hash

FIXTURE = json.loads((Path(__file__).parent / "fixtures" / "symbolic_paths.json").read_text())


def build(parent, items):
    for item in items:
        node = parent.div(node_label=item["label"], **item.get("attrs", {}))
        build(node, item.get("children", []))


@pytest.fixture(scope="module")
def builder():
    builder = GramlotBuilder()
    build(builder.root, FIXTURE["tree"])
    return builder


@pytest.mark.parametrize("case", FIXTURE["cases"], ids=lambda case: f"{case['node']}:{case['path']}")
def test_symbolic_resolution(builder, case):
    node = builder.source.get_node(case["node"])
    if "error" in case:
        with pytest.raises((KeyError, ValueError, TypeError), match=case["error"].replace("?", r"\?")):
            node.abs_datapath(case["path"], row=case.get("row"))
    else:
        assert node.abs_datapath(case["path"], row=case.get("row")) == case["expect"]


def test_string_hash_is_the_legacy_hash():
    assert string_hash("page.ws3") == 858339576
    assert string_hash("é€😀abc" * 50) == 2111466368


def test_symbolic_attributes_are_not_rendered(builder):
    html = builder.render()
    for name in ("_workspace", "childname", "_workspace_path"):
        assert name not in html


def test_workspace_requires_true_or_a_name():
    builder = GramlotBuilder()
    leaf = builder.root.div(_workspace=False).div()
    with pytest.raises(TypeError, match="_workspace must be true or a name"):
        leaf.abs_datapath("#WORKSPACE.a")


def test_get_child_returns_none_for_a_missing_step(builder):
    box = builder.source.get_node("box")
    assert box.get_child("top/inner").label == "named"
    assert box.get_child("top/missing") is None
    assert box.get_child("hidden") is None
