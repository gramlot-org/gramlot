"""Stage only explicitly selected public pages, never internal documents."""

from pathlib import Path
import shutil

PUBLIC_PAGES = (
    "docs/public/020-evaluate.md",
    "docs/public/025-try.md",
    "docs/public/030-quality.md",
    "docs/public/090-classes-and-hosts.md",
    "docs/public/095-writing-pages.md",
    "docs/public/100-extensions.md",
)
PUBLIC_ASSETS = (
    "assets/branding/gramlot-logo.svg",
    "assets/branding/gramlot-logo-dark.svg",
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
    home = (root / "README.md").read_text()
    start = home.index('<p align="center">')
    end = home.index("</p>", start) + len("</p>")
    home = (
        home[:start]
        + "```{image} assets/branding/gramlot-logo.svg\n:alt: Gramlot\n:width: 220px\n:align: center\n```"
        + home[end:]
    )
    home += "\n```{toctree}\n:maxdepth: 2\n:hidden:\n\n"
    home += "\n".join(str(Path(page).with_suffix("")) for page in PUBLIC_PAGES)
    home += "\n```\n"
    (destination / "index.md").write_text(home)
    shutil.copy2(root / "docs/conf.py", destination / "conf.py")
    for relative in (*PUBLIC_PAGES, *PUBLIC_ASSETS):
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(root / relative, target)


if __name__ == "__main__":
    main()
