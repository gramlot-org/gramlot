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
html_theme = "sphinx_rtd_theme"
html_logo = "assets/branding/gramlot-logo.svg"
html_title = "Gramlot — developer guide"
html_show_sourcelink = False


def hide_reference_metadata(app, doctree):
    """Keep source identities and generated anchors, with reader-facing titles."""
    for paragraph in list(doctree.findall(nodes.paragraph)):
        if re.fullmatch(r"(?:Document|Block) ID: [A-Z]{2}-\d+(?:-\d+)?\.", paragraph.astext()):
            paragraph.parent.remove(paragraph)
    for title in doctree.findall(nodes.title):
        if title.children and isinstance(title[0], nodes.Text):
            title[0] = nodes.Text(re.sub(r"^\d{3} · ", "", str(title[0])))


def setup(app):
    app.connect("doctree-read", hide_reference_metadata, priority=100)
