"""Stage only explicitly selected public pages, never internal documents."""

from pathlib import Path
import re
import shutil

PUBLIC_PAGES = (
    "docs/public/017-inside-gramlot.md",
    "docs/public/018-quickstart.md",
    "docs/public/llm/index.md",
    "docs/public/055-family.md",
    "docs/public/020-evaluate.md",
    "docs/public/025-try.md",
    "docs/public/030-quality.md",
    "docs/public/090-classes-and-hosts.md",
    "docs/public/095-writing-pages.md",
    "docs/public/097-data-binding.md",
    "docs/public/098-server-calls.md",
    "docs/public/099-remote-content.md",
    "docs/public/096-themes-and-css.md",
    "docs/public/105-components.md",
    "docs/public/100-extensions.md",
    "docs/public/101-server-protocol.md",
    "docs/public/340-components-and-collections-guide.md",
    "docs/public/345-widget-reference.md",
    "docs/public/350-menus-toolbars-and-windows.md",
    "docs/public/355-examples-and-visual-tour.md",
    "docs/public/410-inputs.md",
    "docs/public/415-buttons.md",
    "docs/public/420-layout.md",
    "docs/public/425-tree.md",
    "docs/public/430-editors.md",
    "docs/public/435-typst.md",
    "docs/public/440-uploads.md",
    "docs/public/445-grid.md",
    "docs/public/450-chat.md",
    "docs/public/455-grouplets.md",
    "docs/public/480-charts.md",
    "docs/public/485-vizabi.md",
    "docs/public/490-audio.md",
    "docs/public/495-drawing.md",
    "docs/public/460-widget-coverage.md",
    "docs/public/465-widget-examples.md",
)
# Owner-approved publication boundary: selected collection cards, not the LLM archive.
PUBLIC_LLM_PAGES = (
    "docs_llm/public/410-inputs.md",
    "docs_llm/public/415-buttons.md",
    "docs_llm/public/420-layout.md",
    "docs_llm/public/425-tree.md",
    "docs_llm/public/430-editors.md",
    "docs_llm/public/435-typst.md",
    "docs_llm/public/440-uploads.md",
    "docs_llm/public/445-grid.md",
    "docs_llm/public/450-chat.md",
    "docs_llm/public/455-grouplets.md",
    "docs_llm/public/480-charts.md",
    "docs_llm/public/485-vizabi.md",
    "docs_llm/public/490-audio.md",
    "docs_llm/public/495-drawing.md",
)
LLM_INDEX = "docs_llm/public/llm/index.md"


def published_links(text, *, index=False):
    """Resolve repository links into the same version of the published manual."""
    names = {Path(path).name for path in PUBLIC_LLM_PAGES}
    def replace(match):
        target = match[1]
        if "://" in target or target.startswith("#"):
            return match[0]
        path, separator, anchor = target.partition("#")
        basename = Path(path).name
        fragment = separator + anchor
        if basename in names:
            return "](" + ("llm/" if index else "") + basename + fragment + ")"
        if path.endswith('.md'):
            return "](" + ("docs/public/" if index else "../docs/public/") + Path(basename).with_suffix('.html').name + fragment + ")"
        return match[0]
    return re.sub(r"\]\(([^)]+)\)", replace, text)


def llm_downloads(root):
    files = {"llms.txt": published_links((root / LLM_INDEX).read_text(), index=True)}
    files.update({f"llm/{Path(path).name}": published_links((root / path).read_text())
                  for path in PUBLIC_LLM_PAGES})
    return files


PUBLIC_ASSETS = (
    "docs/public/examples/inside/name.py",
    "docs/public/examples/inside/triangle.py",
    "docs/public/examples/inside/many_triangles.py",
    "docs/public/examples/inside/triangle_block.py",
    "docs/public/examples/inside/reuse.py",
    "docs/public/assets/inside/spreadsheet.png",
    "docs/public/assets/inside/triangle.png",
    "docs/public/assets/inside/triangles.png",
    "docs/public/assets/inside/triangles.css",
    "assets/branding/gramlot-logo.svg",
    "docs/public/assets/showcase/drawers.png",
    "docs/public/assets/showcase/tabs.png",
    "docs/public/assets/showcase/menus.png",
    "docs/public/assets/showcase/dialog.png",
    "docs/public/assets/showcase/floating.png",
    "docs/public/assets/showcase/compact.png",
    "docs/public/assets/showcase/colors.png",
    "docs/public/assets/showcase/validation.png",
    "docs/public/assets/showcase/tree.png",
    "docs/public/assets/showcase/markdown.png",
    "assets/branding/gramlot-logo-dark.svg",
    "docs/_static/manual.css",
    "docs/public/assets/themes/appearance-after.jpg",
    "docs/public/assets/themes/appearance-before.jpg",
    "docs/public/assets/themes/compact.jpg",
    "docs/public/assets/themes/larger-text.jpg",
    "docs/public/assets/themes/state-after.jpg",
    "docs/public/assets/themes/state-before.jpg",
    "docs/public/assets/themes/summary-after.jpg",
    "docs/public/assets/themes/summary-before.jpg",
    "docs/public/assets/themes/surface-dark.jpg",
    "docs/public/assets/themes/surface-light.jpg",
)


def main():
    root = Path(__file__).resolve().parents[1]
    destination = root / "build" / "docs-source"
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True)
    site = root / "build" / "docs-site"
    if site.exists():
        shutil.rmtree(site)
    home = (root / "docs/public/index.md").read_text()
    # The repository home lives beside the guides; the site home lives at its root.
    for relative in PUBLIC_PAGES:
        home = home.replace(f"]({Path(relative).relative_to('docs/public')}", f"]({relative}")
    groups = (
        ("Start here", ("017-inside-gramlot", "055-family", "018-quickstart", "020-evaluate")),
        ("Build applications", ("095-writing-pages", "105-components", "097-data-binding", "098-server-calls", "099-remote-content", "350-menus-toolbars-and-windows")),
        ("Library reference", ("llm/index", "345-widget-reference", "460-widget-coverage", "096-themes-and-css", "090-classes-and-hosts", "030-quality")),
        ("Collection reference", ('410-inputs', '415-buttons', '420-layout', '425-tree', '430-editors', '435-typst', '440-uploads', '445-grid', '450-chat', '455-grouplets', '480-charts', '485-vizabi', '490-audio', '495-drawing')),
        ("Extend and integrate", ("340-components-and-collections-guide", "100-extensions", "101-server-protocol")),
        ("Appendix: examples", ("025-try", "355-examples-and-visual-tour", "465-widget-examples")),
    )
    for caption, pages in groups:
        home += "\n```{toctree}\n:maxdepth: 1\n:hidden:\n:caption: " + caption + "\n\n"
        home += "\n".join("docs/public/" + page for page in pages)
        home += "\n```\n"
    (destination / "index.md").write_text(home)
    for name, content in llm_downloads(root).items():
        target = destination / "downloads" / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content)
    shutil.copy2(root / "docs/conf.py", destination / "conf.py")
    for relative in (*PUBLIC_PAGES, *PUBLIC_ASSETS):
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        if relative == "docs/public/llm/index.md":
            text = (root / relative).read_text().replace("../../../docs_llm/public/", "../../../llm/")
            # Markdown .md links are treated as Sphinx document references. These
            # are deliberately raw downloads, so retain them as ordinary HTML links.
            text = re.sub(r"\[([^\]]+)\]\((\.\./\.\./\.\./llm/[^)]+)\)",
                          lambda match: f'<a href="{match[2]}">{match[1]}</a>', text)
            text += '\n<a href="../../../llms.txt">Download the discovery index</a>.\n'
            target.write_text(text)
        else:
            shutil.copy2(root / relative, target)


if __name__ == "__main__":
    main()
