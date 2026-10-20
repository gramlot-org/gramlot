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
    original = type(builder.data).get_item

    def read(self, pointer, *args, **kwargs):
        reads.append(pointer)
        return original(self, pointer, *args, **kwargs)

    monkeypatch.setattr(type(builder.data), "get_item", read)
    _, attrs = builder.runtime_values(node)
    assert attrs["width"] == "38px"
    assert attrs["title"] == "px"
    assert attrs["unit"] == "px"
    assert attrs["other"] == "current"
    assert reads.count("unit") == 1
    assert reads.count("other") == 1


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
    with pytest.raises(ValueError, match="(?i)cyclic attribute dependency"):
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


def test_named_slot_on_an_expression_attribute_is_null():
    """The same Source as the JavaScript test of a {name} slot naming a == attribute."""
    builder = GramlotBuilder()
    builder.data.set_item("w", 3)
    node = builder.root.div(w="^w", label="==w + 1", title="^w:{} {label}", target_path="^w:{} {label}")
    _, attrs = builder.runtime_values(node)
    assert attrs["title"] is None
    assert attrs["target_path"] is None


# The same table as 'pointer suffixes on value are found by pointerTransform' in js/tests/pointer-transforms.test.js.
@pytest.mark.parametrize("value,rejected", [
    ("^name:{}", True), ("=name:={}", True), ("^name:={name}", True), ("^name", False), ("=name", False),
    ("==a ? 'x:y' : 'z'", False), ("Name: Ada", False), (3, False), (None, False),
])
def test_value_suffixes_are_found_by_pointer_transform(value, rejected):
    for tag in ("input", "textarea", "select", "webcomponent"):
        builder = GramlotBuilder()
        create = getattr(builder.root, tag)
        kwargs = {"code": "test-input"} if tag == "webcomponent" else {}
        if rejected:
            with pytest.raises(ValueError, match="value.*does not accept pointer suffixes"):
                create(value=value, **kwargs)
        else:
            create(value=value, **kwargs)
