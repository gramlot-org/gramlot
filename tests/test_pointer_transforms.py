"""Python authoring and static template contract; expressions remain browser-owned."""
import pytest

from gramlot import GramlotBuilder


def test_static_templates_read_typed_values_and_preserve_other_attributes():
    builder = GramlotBuilder()
    builder.data.set_item("width", 38)
    builder.data.set_item("unit", "px")
    node = builder.root.div(width="^width:{}{unit}", unit="^unit", title="^width:Width: {}")
    _, attrs = builder.runtime_values(node)
    assert attrs["width"] == "38px"
    assert attrs["title"] == "Width: 38"
    assert attrs["unit"] == "px"
    assert builder.data.get_item("width") == 38


def test_static_projection_resolves_each_source_attribute_once(monkeypatch):
    builder = GramlotBuilder()
    builder.data.set_item("width", 38)
    builder.data.set_item("unit", "px")
    builder.data.set_item("other", "current")
    node = builder.root.div(width="^width:{}{unit}", title="^width:{unit}", unit="^unit", other="^other")
    reads = []
    original = type(node).get_relative_data

    def read(self, pointer):
        reads.append(pointer)
        return original(self, pointer)

    monkeypatch.setattr(type(node), "get_relative_data", read)
    _, attrs = builder.runtime_values(node)
    assert attrs["width"] == "38px"
    assert attrs["title"] == "px"
    assert attrs["unit"] == "px"
    assert attrs["other"] == "current"
    assert reads.count("^unit") == 1
    assert reads.count("^other") == 1


@pytest.mark.parametrize("value,required,optional", [
    (None, None, None), ("", None, "Value: "), (0, "Value: 0", "Value: 0"),
    (False, "Value: false", "Value: false"), (" ", "Value:  ", "Value:  "),
])
def test_static_template_empty_rules(value, required, optional):
    builder = GramlotBuilder()
    builder.data.set_item("datum", value)
    node = builder.root.div(title="^datum:Value: {}", aria_label="^datum:Value: {?}")
    _, attrs = builder.runtime_values(node)
    assert attrs["title"] == required
    assert attrs["aria_label"] == optional


def test_static_expressions_are_inert_and_template_errors_are_explicit():
    builder = GramlotBuilder()
    builder.data.set_item("draft", False)
    node = builder.root.input(value="^name", readonly="^draft:=!{}")
    assert builder.runtime_values(node)[1]["readonly"] is None
    node = builder.root.div(title="^draft:{absent}")
    with pytest.raises(ValueError, match="absent.*does not exist"):
        builder.runtime_values(node)
    node = builder.root.div(title="^draft:{other}", other="^draft:{title}")
    with pytest.raises(ValueError, match="cyclic attribute dependency"):
        builder.runtime_values(node)


@pytest.mark.parametrize("tag", ["input", "textarea", "select", "webcomponent"])
@pytest.mark.parametrize("value", ["^name:{}", "=name:={}"])
def test_widget_values_reject_suffixes(tag, value):
    builder = GramlotBuilder()
    with pytest.raises(ValueError, match="value.*does not accept pointer suffixes"):
        getattr(builder.root, tag)(value=value, **({"code": "test-input"} if tag == "webcomponent" else {}))


def test_literal_colons_and_plain_value_pointers_are_unchanged():
    builder = GramlotBuilder()
    builder.data.set_item("name", "Ada")
    node = builder.root.input(value="^name", title="Name: Ada")
    _, attrs = builder.runtime_values(node)
    assert attrs["value"] == "Ada"
    assert attrs["title"] == "Name: Ada"
