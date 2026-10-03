"""Minimal reference Host on one pages folder.

The JavaScript counterpart is ``js/src/adapters/file-host.js``. Python page
files are trusted application code, never uploaded content; each opening
executes the module again.
"""
import importlib.util
from pathlib import Path
from urllib.parse import quote
from uuid import uuid4

from .host import Host, PageNotFound
from .resources import SEGMENT, InvalidResourceName, parse_requires


class FileHost(Host):
    """Resolve pages and their same-name companions below one pages folder.

    Page path ``foo``: the file page ``foo.py`` first, then the folder page
    ``foo/foo.py``; the file wins when both exist. Beside the page file:
    ``foo.css`` (CSS), ``foo.md`` (README) and the page logic (group null):
    ``foo.js``, whose ``Logic`` export is the logic (a ``Page`` export, the JS
    version of the same page, stays unused), else ``foo_aux.js``; both at once
    raise ``ValueError``. Python cannot read the exports of ``foo.js``: beside a
    Python page it must export ``Logic``, and the browser rejects it otherwise.
    The ``_aux`` suffix is reserved. There are no
    resource levels: a name in ``css_requires``/``js_requires`` raises
    ``InvalidResourceName``.
    """

    def __init__(self, pages_dir, **options):
        super().__init__(**options)
        self._pages_dir = Path(pages_dir)

    @property
    def pages_dir(self):
        return self._pages_dir

    def locate_page(self, path):
        """Map ``a/b`` to ``a/b.py``, else ``a/b/b.py``, below the real pages folder."""
        parts = path.strip("/").split("/") if path.strip("/") else ["index"]
        if any(not SEGMENT.fullmatch(part) for part in parts) or parts[-1].endswith("_aux"):
            raise PageNotFound("Invalid page path")
        root = self.pages_dir.resolve()
        name = f"{parts[-1]}.py"
        for candidate in (root.joinpath(*parts[:-1], name), root.joinpath(*parts, name)):
            real = candidate.resolve()
            if real.is_relative_to(root) and real.is_file():
                return candidate
        raise PageNotFound("Page not found")

    def resolve_page(self, path):
        filename = self.locate_page(path)
        spec = importlib.util.spec_from_file_location(f"gramlot_page_{uuid4().hex}", filename)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return getattr(module, "Page", None)

    def resolve_resources(self, path, cls):
        """``Page.css`` URLs as written, then the companion ``foo.css`` and the page logic."""
        if parse_requires(cls.css_requires) or parse_requires(cls.js_requires):
            raise InvalidResourceName("requires need a Host with a resource system")
        page_file = self.locate_page(path)
        css, js = list(cls.css), []
        companion_css = page_file.with_name(f"{page_file.stem}.css")
        if companion_css.is_file():
            css.append(self.url(companion_css))
        logic = [self.url(filename) for filename in (page_file.with_name(f"{page_file.stem}.js"),
                                                     page_file.with_name(f"{page_file.stem}_aux.js"))
                 if filename.is_file()]
        if len(logic) == 2:
            raise ValueError(f"Two logic modules for one page: {logic[0]} and {logic[1]}")
        if logic:
            js.append({"url": logic[0], "group": None})
        return {"css": css, "js": js}

    def url(self, filename):
        """Return the root-relative URL of a file below the pages folder, one encoded
        segment per folder; a file whose real path leaves the folder raises ``ValueError``."""
        root = self.pages_dir.resolve()
        relative = Path(filename).relative_to(root)
        if not Path(filename).resolve().is_relative_to(root):
            raise ValueError(f"Resource leaves the pages folder: {relative.as_posix()}")
        return "/" + "/".join(quote(part, safe="") for part in relative.parts)
