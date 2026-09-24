"""Check the public build boundary and local HTML links after Sphinx runs."""

from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import unquote, urlsplit

from prepare_docs import PUBLIC_ASSETS, PUBLIC_PAGES


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag in {"img", "script"} and attrs.get("src"):
            self.links.append(attrs["src"])
        if tag == "link" and attrs.get("href"):
            self.links.append(attrs["href"])


def main():
    root = Path(__file__).resolve().parents[1]
    source = root / "build/docs-source"
    site = root / "build/docs-site"
    expected = {"index.md", "conf.py", *PUBLIC_PAGES, *PUBLIC_ASSETS}
    staged = {str(p.relative_to(source)) for p in source.rglob("*") if p.is_file()}
    # Import caches are Sphinx execution artifacts, not staged content.
    staged = {p for p in staged if "__pycache__" not in Path(p).parts}
    assert staged == expected, f"Staging mismatch: {staged ^ expected}"
    docnames = {"index", *(str(Path(p).with_suffix("")) for p in PUBLIC_PAGES)}
    expected_html = {f"{p}.html" for p in docnames} | {"search.html", "genindex.html"}
    actual_html = {str(p.relative_to(site)) for p in site.rglob("*.html")}
    assert actual_html == expected_html, f"HTML mismatch: {actual_html ^ expected_html}"
    index = (site / "searchindex.js").read_text()
    data = json.loads(index.removeprefix("Search.setIndex(").removesuffix(")"))
    assert set(data["docnames"]) == docnames, "Unexpected search documents"
    expected_sources = {str(Path(p).with_suffix(".md.txt")) for p in docnames}
    actual_sources = {
        str(p.relative_to(site / "_sources"))
        for p in (site / "_sources").rglob("*") if p.is_file()
    }
    assert actual_sources == expected_sources, "Unexpected downloadable sources"
    parsed = {}
    for relative in actual_html:
        page = site / relative
        parser = Links()
        parser.feed(page.read_text())
        parsed[page.resolve()] = parser
    for page, parser in parsed.items():
        for href in parser.links:
            url = urlsplit(href)
            if url.scheme or url.netloc:
                continue
            target = (page.parent / unquote(url.path)).resolve() if url.path else page
            assert target.is_relative_to(site.resolve()), f"Outside site: {page}: {href}"
            assert target.is_file(), f"Missing target: {page}: {href}"
            if url.fragment and target in parsed:
                assert unquote(url.fragment) in parsed[target].ids, f"Missing anchor: {page}: {href}"
    for relative in PUBLIC_PAGES:
        mirror = root / "docs_llm" / Path(relative).relative_to("docs")
        assert mirror.is_file(), f"Missing mirror: {mirror}"
        full, brief = Links(), Links()
        full.feed((root / relative).read_text())
        brief.feed(mirror.read_text())
        assert full.ids == brief.ids, f"Mismatched stable anchors: {relative}"
    print(f"Public documentation verified: {len(docnames)} pages, search, sources, local links and mirrored anchors.")


if __name__ == "__main__":
    main()
