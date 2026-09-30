"""GramlotHtmlRenderer: the string renderer of a Gramlot Source, as the JS class of the same name."""

from genro_builders.contrib.html import HtmlBuilder
from genro_builders.contrib.html.html_renderer import HtmlRenderer
from genro_builders.contrib.svg import SvgBuilder

from .attributes import (
    SVG_NS, XHTML_NS, boundary_attributes, display_item, dom_names, is_expression, require_no_expression_template,
    split_native_attributes, text_value, without_binding_attributes, without_null_values,
)
from .svg_renderer import GramlotSvgRenderer


class GramlotHtmlRenderer(HtmlRenderer):
    """The Gramlot attribute rules on Builder's HtmlRenderer.

    Style shortcuts, the parent-dialect prefix, noConvertStyle, DOM names, ``mask``, ``_text``
    as node text and the document wrapper; the same rules as the JS GramlotHtmlRenderer.
    """

    def __init__(self, builder):
        super().__init__(builder)
        # noConvertStyle attributes taken out in _handle_meta, put back in rendered_item.
        self._native_attributes = {}

    def get_render(self, builder):
        """HTML nodes (GramlotBuilder, HtmlBuilder) → this renderer; SVG nodes → one GramlotSvgRenderer owned by it."""
        if id(builder) not in self.renders:
            if isinstance(builder, HtmlBuilder):
                self.add_render(builder, self)
            elif isinstance(builder, SvgBuilder):
                self.add_render(builder, GramlotSvgRenderer(builder, self))
        return super().get_render(builder)

    def render(self, node, **opts):
        """A data-element renders nothing: recognized before runtime_values (R08, revision 10)."""
        if node._get_meta("data_element"):
            return None
        return super().render(node, **opts)

    def _handle_meta(self, node, runtime_attrs):
        """Builder's meta; then the noConvertStyle attributes of the tag are set aside.

        ``adapt_attrs`` has no tag. A sub-builder boundary node keeps its attributes literal,
        with the Gramlot filters and names; the ``html`` boundary inside SVG is a
        ``foreignObject`` in the SVG namespace.
        """
        tag, attrs = super()._handle_meta(node, self.evaluate_expressions(node, runtime_attrs))
        if node._get_meta("subbuilder"):
            boundary = boundary_attributes(attrs)
            if node._get_meta("subbuilder") == "html":
                boundary["xmlns"] = SVG_NS
            return tag, boundary
        rest, native = split_native_attributes(tag, attrs)
        if native:
            self._native_attributes[id(node)] = native
        return tag, rest

    def evaluate_expressions(self, node, runtime_attrs):
        """Step 3 of Q11.2 on the attributes of ``node`` resolved by runtime_values, for HTML and SVG nodes.

        A string renderer has no page runtime: every ``==`` attribute is None and nothing is written,
        as in the JS GramlotHtmlRenderer. A template using a ``==`` attribute is an error.
        """
        require_no_expression_template(node)
        expressions = {name for name, raw in node.fixed_attr_items() if is_expression(raw)}
        return {name: None if name in expressions else value for name, value in runtime_attrs.items()}

    def expression_value(self, node, item):
        """The node text of ``node``: None for a ``==`` node value, which a string renderer does not write."""
        return None if is_expression(node.value) else item

    def restore_native_attributes(self, node, attrs):
        """``attrs`` with the noConvertStyle attributes set aside by _handle_meta for ``node``, None values excluded."""
        native = self._native_attributes.pop(id(node), None)
        if not native:
            return attrs
        return {**attrs, **without_null_values(native)}

    def adapt_attrs(self, attrs):
        """``_meta``, binding attributes and None values out; ``html_<name>`` is the literal attribute ``<name>``
        and ``gramlot_<name>`` an error; Builder's style shortcuts on the rest; DOM names."""
        own = f"{self.builder._name}_"
        prefixes = self.builder.dialect_prefixes
        literal = {}
        styled = {}
        for name, value in without_binding_attributes(attrs).items():
            if name == "_meta" or value is None:
                continue
            if name.startswith(own):
                raise ValueError(f"{name}: the attribute prefix '{own}' is not accepted; use the prefix '{prefixes[0]}'")
            prefix = next((candidate for candidate in prefixes if name.startswith(candidate)), None)
            if prefix is not None:
                literal[name[len(prefix):]] = value
            else:
                styled[name] = value
        return dom_names({**super().adapt_attrs(styled), **literal})

    def rendered_item(self, node, item, runtime_attrs, *, tag, **opts):
        """The HTML string of one node: noConvertStyle put back, display directives consumed, ``_text`` as node text."""
        item, attrs = display_item(self.expression_value(node, item), self.restore_native_attributes(node, runtime_attrs))
        text = attrs.pop("_text", None)
        if isinstance(item, list) and text is not None:
            item = [self._escape_text(text_value(text)), *item]
        parent = node.parent_node
        if parent is not None and parent._get_meta("subbuilder") == "html":
            attrs = {"xmlns": XHTML_NS, **attrs}
        return super().rendered_item(node, item, attrs, tag=tag, **opts)

    def finalize(self, result, target, *, doctype=False, **opts):
        """Builder's finalize; ``doctype`` prepends ``<!doctype html>`` and wraps the output in ``<html>`` when the root is not ``html``."""
        if not doctype:
            return super().finalize(result, target, **opts)
        text = "".join(result) if isinstance(result, list) else result
        roots = [node for node in self.builder.source.nodes if not node._get_meta("data_element")]
        if not (len(roots) == 1 and roots[0].node_tag == "html"):
            text = f"<html>{text}</html>"
        return super().finalize(f"<!doctype html>{text}", target, **opts)
