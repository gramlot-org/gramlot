"""File lookup shared by ``GramlotServer`` (the core themes) and ``GramlotFileServer`` (the pages folder).

The JavaScript counterpart is ``js/src/server/files.js``.
"""
from importlib.resources import files
from pathlib import Path

# The themes folder of the installed core (``gramlot/resources/themes``).
THEMES = Path(str(files("gramlot").joinpath("resources", "themes")))
# The manifest of the third-party libraries of the components, written by the JS build from js/src/libraries.js.
LIBRARIES = Path(str(files("gramlot").joinpath("resources", "libraries.json")))


def file_below(folder, path):
    """The real path of the ``/``-separated ``path`` below ``folder`` when it is a file whose real path stays
    inside the real ``folder``, else ``None``; a path with a NUL character names no file."""
    if "\x00" in path:
        return None
    root = Path(folder).resolve()
    real = root.joinpath(*path.strip("/").split("/")).resolve()
    return real if real.is_relative_to(root) and real.is_file() else None
