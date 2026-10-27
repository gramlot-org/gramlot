"""Stage only explicitly selected public pages, never internal documents."""

from pathlib import Path
import shutil

PUBLIC_PAGES = (
    "docs/public/018-quickstart.md",
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
)
PUBLIC_ASSETS = (
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
        home = home.replace(f"]({Path(relative).name}", f"]({relative}")
    groups = (
        ("Start here", ("018-quickstart", "025-try", "055-family", "020-evaluate")),
        ("Build applications", ("095-writing-pages", "105-components", "097-data-binding", "098-server-calls", "099-remote-content", "350-menus-toolbars-and-windows")),
        ("Reference and examples", ("345-widget-reference", "096-themes-and-css", "355-examples-and-visual-tour", "090-classes-and-hosts", "030-quality")),
        ("Extend and integrate", ("340-components-and-collections-guide", "100-extensions", "101-server-protocol")),
    )
    for caption, pages in groups:
        home += "\n```{toctree}\n:maxdepth: 1\n:hidden:\n:caption: " + caption + "\n\n"
        home += "\n".join("docs/public/" + page for page in pages)
        home += "\n```\n"
    (destination / "index.md").write_text(home)
    shutil.copy2(root / "docs/conf.py", destination / "conf.py")
    for relative in (*PUBLIC_PAGES, *PUBLIC_ASSETS):
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(root / relative, target)


if __name__ == "__main__":
    main()
