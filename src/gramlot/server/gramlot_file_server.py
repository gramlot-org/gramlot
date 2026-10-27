"""Minimal reference GramlotServer on one pages folder.

The JavaScript counterpart is ``js/src/server/gramlot-file-server.js``. Python page
files are trusted application code, never uploaded content. With ``reload``
each opening executes the module again; without it the module runs once per
real path.
"""
import importlib.util
import sys
from pathlib import Path
from urllib.parse import quote
from uuid import uuid4

from genro_bag import Bag
from genro_builders.builder import SourceBag
from genro_tytx import from_tytx

from .assets import gramlot_dev
from .files import file_below
from .gramlot_server import GramlotServer, PageNotFound
from .resources import SEGMENT, InvalidResourceName, parse_requires

# The URL suffixes of the files below the pages folder that reach the browser (GC-230 §145).
COMPANION_SUFFIXES = (".css", ".js")


class GramlotFileServer(GramlotServer):
    """Resolve pages and their same-name companions below one pages folder.

    Page path ``foo``: the file page ``foo.py`` first, then the folder page
    ``foo/foo.py``; the file wins when both exist. Beside the page file:
    ``foo.css`` (CSS), ``foo.md`` (README) and the page logic (group null):
    ``foo.js``, whose ``Logic`` export is the logic (a ``Page`` export, the JS
    version of the same page, stays unused), else ``foo_aux.js``; both at once
    raise ``ValueError``. Python cannot read the exports of ``foo.js``: it is the
    logic module beside a Python page, and without ``Logic`` it gives no logic
    methods in the browser.
    The ``_aux`` suffix is reserved. There are no
    resource levels: a name in ``css_requires``/``js_requires`` raises
    ``InvalidResourceName``.

    ``reload=None`` takes the value from ``GRAMLOT_DEV`` (true for ``YES`` and
    ``DEBUG``, false when unset); an explicit boolean wins.

    ``companion_file`` is the file an adapter serves at the ``.css`` and ``.js`` URLs of GC-230 §145
    (``theme_file``, the file of the ``/themes/`` URLs, is the one of ``GramlotServer``); the adapter
    adds the HTTP part (methods, media types, headers).
    """

    def __init__(self, pages_dir, reload=None, **options):
        super().__init__(**options)
        self._pages_dir = Path(pages_dir)
        self.reload = gramlot_dev() is not None if reload is None else reload
        self._modules = {}

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
        real = filename.resolve()
        previous = self._modules.get(real)
        module = previous
        if self.reload or module is None:
            name = previous.__name__ if previous is not None else f"gramlot_page_{uuid4().hex}"
            spec = importlib.util.spec_from_file_location(name, filename)
            module = importlib.util.module_from_spec(spec)
            # Compiled from the source, never from __pycache__: a .pyc is trusted on the source's size and
            # whole-second mtime, so an edit of the same size within one second would run the old code.
            sys.modules[name] = module
            try:
                exec(compile(spec.loader.get_source(spec.name), str(filename), "exec"), module.__dict__)
            except BaseException:
                if previous is None:
                    del sys.modules[name]
                else:
                    sys.modules[name] = previous
                raise
            self._modules[real] = module
        return getattr(module, "Page", None)

    def resolve_data(self, path):
        """Read foo_data.tytx beside foo.py without exposing a public file URL."""
        page_file = self.locate_page(path)
        filename = page_file.with_name(f"{page_file.stem}_data.tytx")
        try:
            real = filename.resolve(strict=True)
        except FileNotFoundError:
            return None
        if not real.is_relative_to(self.pages_dir.resolve()):
            raise ValueError("Data companion leaves the pages folder")
        data = from_tytx(real.read_text(encoding="utf-8"))
        if not isinstance(data, Bag) or isinstance(data, SourceBag):
            raise TypeError("Initial page data must be a Data Bag")
        return data

    def iter_page_classes(self):
        """Import route-eligible candidates deterministically and classify Page exports."""
        from ..page import Page
        root = self.pages_dir.resolve()
        seen_files, seen_classes = set(), set()
        for filename in sorted(root.rglob('*.py'), key=lambda p: p.relative_to(root).as_posix()):
            logical = filename.relative_to(root).with_suffix('').as_posix()
            try:
                resolved = self.locate_page(logical).resolve()
            except PageNotFound:
                continue
            if resolved in seen_files:
                continue
            seen_files.add(resolved)
            try:
                cls = self.resolve_page(logical)
            except Exception as error:
                raise ValueError(f'Page catalogue import failed: {filename}: {error}') from error
            module = self._modules[resolved]
            if 'Page' not in vars(module) or cls is Page:
                continue
            if not isinstance(cls, type) or not issubclass(cls, Page):
                raise ValueError(f'Invalid Page export: {filename}')
            if cls not in seen_classes:
                seen_classes.add(cls)
                yield cls

    def resolve_page_store(self, page_class):
        """Read the separate PageStore declaration from the page's own module."""
        from ..page.page_store import PageStore
        return vars(sys.modules[page_class.__module__]).get("PageStore", PageStore)

    def close_all(self):
        """Release pages and their registered modules when the adapter shuts down."""
        super().close_all()
        for module in self._modules.values():
            if sys.modules.get(module.__name__) is module:
                del sys.modules[module.__name__]
        self._modules.clear()

    def resolve_resources(self, path, cls):
        """``Page.css`` URLs as written, then the companion ``foo.css`` and the page logic."""
        if parse_requires(cls.css_requires) or parse_requires(cls.js_requires):
            raise InvalidResourceName("requires need a GramlotServer with a resource system")
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

    def companion_file(self, path):
        """The file of the URL path ``path`` (mount prefix removed, percent-decoded) when it ends in
        ``.css`` or ``.js`` and its real path is a file below the pages folder: page modules,
        companions (``foo.css``, ``foo_aux.js``) and ``Page.css`` files placed there; else ``None``.
        Any other file of the folder is never served (GC-230 §145)."""
        if not path.endswith(COMPANION_SUFFIXES):
            return None
        return file_below(self.pages_dir, path)

    def url(self, filename):
        """Return the root-relative URL of a file below the pages folder, one encoded
        segment per folder; a file whose real path leaves the folder raises ``ValueError``."""
        root = self.pages_dir.resolve()
        relative = Path(filename).relative_to(root)
        if not Path(filename).resolve().is_relative_to(root):
            raise ValueError(f"Resource leaves the pages folder: {relative.as_posix()}")
        return "/" + "/".join(quote(part, safe="") for part in relative.parts)
