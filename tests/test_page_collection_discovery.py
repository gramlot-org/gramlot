"""Page catalogue scanning follows existing routes without executing page methods."""

import pytest

from gramlot.server import GramlotFileServer


def test_discovery_imports_helpers_and_deduplicates_reexports(tmp_path, monkeypatch):
    (tmp_path / "helper.py").write_text(
        "from gramlot import Page as Base\nclass Shared(Base):\n    def main(self,root):raise AssertionError('must not execute')\n"
    )
    (tmp_path / "a.py").write_text("from helper import Shared as Page\n")
    (tmp_path / "b.py").write_text("from helper import Shared as Page\n")
    (tmp_path / "support.py").write_text("from gramlot import Page\n")
    (tmp_path / "logic_aux.py").write_text("raise AssertionError('aux is excluded')\n")
    monkeypatch.syspath_prepend(str(tmp_path))
    server = GramlotFileServer(tmp_path)
    classes = list(server.iter_page_classes())
    assert len(classes) == 1 and classes[0].__name__ == "Shared"
    assert {p.name for p in server._modules} == {
        "a.py",
        "b.py",
        "helper.py",
        "support.py",
    }
    server.close_all()


@pytest.mark.parametrize(
    "source", ["Page = None", "Page = 123", "raise RuntimeError('broken import')"]
)
def test_invalid_export_or_import_stops_catalogue(tmp_path, source):
    (tmp_path / "index.py").write_text(source)
    with pytest.raises(ValueError, match="index.py"):
        list(GramlotFileServer(tmp_path).iter_page_classes())


def test_candidate_paths_cannot_leave_root(tmp_path):
    pages = tmp_path / "pages"
    pages.mkdir()
    (tmp_path / "outside.py").write_text("raise AssertionError('outside')")
    (pages / "escape.py").symlink_to(tmp_path / "outside.py")
    assert list(GramlotFileServer(pages).iter_page_classes()) == []
