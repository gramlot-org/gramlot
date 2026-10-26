"""Public documentation only; source selection lives in prepare_docs.py."""
import re

from docutils import nodes

project = "Gramlot"
author = "Gramlot contributors"
copyright = "2026, Gramlot contributors"
extensions = ["myst_parser"]
myst_enable_extensions = ["colon_fence"]
source_suffix = {".md": "markdown"}
root_doc = "index"
exclude_patterns = []
nitpicky = True
# Links to the explicit block anchors of another page (`page.md#gc-095-100`) are raw HTML
# ids that MyST cannot resolve; scripts/check_public_docs.py verifies every local link and
# anchor in the built HTML instead.
suppress_warnings = ["myst.xref_missing"]
html_theme = "sphinx_rtd_theme"
html_logo = "assets/branding/gramlot-logo.svg"
html_title = "Gramlot — developer guide"
html_show_sourcelink = False
html_static_path = ["docs/_static"]
html_css_files = ["manual.css"]


def hide_reference_metadata(app, doctree):
    """Keep source identities and generated anchors, with reader-facing titles."""
    for paragraph in list(doctree.findall(nodes.paragraph)):
        if re.fullmatch(r"(?:Document|Block) ID: [A-Z]{2}-\d+(?:-\d+)?\.", paragraph.astext()):
            paragraph.parent.remove(paragraph)
    for title in doctree.findall(nodes.title):
        if title.children and isinstance(title[0], nodes.Text):
            title[0] = nodes.Text(re.sub(r"^\d{3} · ", "", str(title[0])))


SECTION_REFERENCE = re.compile(r"§§?\d{3}(?:\s*[–-]\s*\d{3})?")


def link_section_references(app, doctree):
    """Turn a bare `§NNN` into a link to the block anchor of the same page."""
    anchors = {}
    for raw in doctree.findall(nodes.raw):
        for anchor in re.findall(r'<a id="(gc-\d+-(\d{3}))">', raw.astext()):
            anchors[anchor[1]] = anchor[0]
    if not anchors:
        return
    for text in list(doctree.findall(nodes.Text)):
        if any(isinstance(parent, (nodes.reference, nodes.literal, nodes.literal_block, nodes.title))
               for parent in _ancestors(text)):
            continue
        source = str(text)
        if "§" not in source:
            continue
        children, position = [], 0
        for match in SECTION_REFERENCE.finditer(source):
            numbers = re.findall(r"\d{3}", match.group())
            if numbers[0] not in anchors:
                continue
            children.append(nodes.Text(source[position:match.start()]))
            children.append(nodes.reference(match.group(), match.group(), refuri=f"#{anchors[numbers[0]]}"))
            position = match.end()
        if children:
            children.append(nodes.Text(source[position:]))
            text.parent.replace(text, children)


def _ancestors(node):
    while node.parent is not None:
        node = node.parent
        yield node


def setup(app):
    app.connect("doctree-read", hide_reference_metadata, priority=100)
    app.connect("doctree-read", link_section_references, priority=110)
