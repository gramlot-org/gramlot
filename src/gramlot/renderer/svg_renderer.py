"""GramlotSvgRenderer: the SVG nodes of a Gramlot Source, as the JS class of the same name."""

from genro_builders.contrib.svg.svg_renderer import SvgRenderer

from .attributes import (
    boundary_attributes, dom_names, require_no_script_attributes, text_value, without_binding_attributes, without_null_values,
)


class GramlotSvgRenderer(SvgRenderer):
    """The renderer of the SVG nodes of a Gramlot Source, owned by a GramlotHtmlRenderer.

    Attributes: Builder's SVG names, no style shortcuts, Gramlot names. Output: the SVG string.
    """

    def __init__(self, builder, owner):
        super().__init__(builder)
        self._owner = owner

    @property
    def owner(self):
        """The GramlotHtmlRenderer that renders the enclosing document."""
        return self._owner

    def _handle_meta(self, node, runtime_attrs):
        """Builder's meta on the attributes with the ``==`` handled by the owner, with no ``on<event>`` and no
        ``javascript:`` URL; a sub-builder boundary node keeps its attributes literal, with the Gramlot filters and names."""
        evaluated = self.owner.evaluate_expressions(node, runtime_attrs)
        require_no_script_attributes(node, evaluated)
        tag, attrs = super()._handle_meta(node, evaluated)
        if node._get_meta("subbuilder"):
            return tag, boundary_attributes(attrs)
        return tag, attrs

    def adapt_attrs(self, attrs):
        """``_meta``, binding attributes and None values out; Builder's SVG adaptation; Gramlot names."""
        rest = {name: value for name, value in attrs.items() if name != "_meta"}
        return dom_names(super().adapt_attrs(without_null_values(without_binding_attributes(rest))))

    def rendered_item(self, node, item, runtime_attrs, *, tag, **opts):
        """The SVG string of one node (Builder's form, ``<tag … />`` for a void element), ``_text`` as node text."""
        attrs = dict(runtime_attrs)
        text = attrs.pop("_text", None)
        item = self.owner.expression_value(node, item)
        if isinstance(item, list) and text is not None:
            item = [self._escape_text(text_value(text)), *item]
        return super().rendered_item(node, item, attrs, tag=tag, **opts)
