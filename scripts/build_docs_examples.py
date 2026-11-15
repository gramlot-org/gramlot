"""Build the documentation's Python-authored examples into static TYTX pages."""
import importlib.util
from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from gramlot import GramlotBuilder
EXAMPLES = ROOT / "docs/public/examples/inside"
OUTPUT = ROOT / "build/docs-source/downloads/inside"
PAGES = {"name": "name.py", "triangle": "triangle.py", "many": "many_triangles.py"}


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    sys.path.insert(0, str(EXAMPLES))
    for route, filename in PAGES.items():
        path = EXAMPLES / filename
        spec = importlib.util.spec_from_file_location(f"docs_example_{route}", path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        builder = GramlotBuilder()
        result = module.Page().main(builder.root)
        if result is not None:
            raise TypeError(f"{filename}: Page.main must return None")
        target = OUTPUT / route
        target.mkdir(parents=True, exist_ok=True)
        (target / "source.tytx").write_text(builder.to_tytx(), encoding="utf-8")
        shutil.copyfile(EXAMPLES / f"{path.stem}.css", target / "page.css")
        (target / "index.html").write_text('''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Gramlot example</title><link rel="stylesheet" href="../theme.css"><link rel="stylesheet" href="page.css"></head><body><div id="gramlot-root"></div><script type="module" src="../runtime.js"></script></body></html>
''', encoding="utf-8")
    shutil.copyfile(ROOT / "themes/gramlot-base/theme.css", OUTPUT / "theme.css")


if __name__ == "__main__":
    main()
