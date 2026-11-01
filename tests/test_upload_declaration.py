import pytest

from gramlot import Page, endpoint, upload
from gramlot.page.base import endpoint_methods, resolve_declared, upload_methods


def test_upload_declaration_has_separate_auth_and_respects_shadowing():
    class Base(Page):
        @upload(auth="editor")
        def import_source(self, metadata):
            return metadata

    class Child(Base):
        pass

    class Shadow(Base):
        def import_source(self, metadata):
            return metadata

    method = upload_methods(Child)["import_source"]
    assert method.__gramlot_upload__ == {"auth": "editor"}
    assert not endpoint_methods(Child)
    assert resolve_declared(Child(), "import_source", "__gramlot_upload__")
    assert resolve_declared(Shadow(), "import_source", "__gramlot_upload__") is None


def test_upload_declaration_cannot_be_an_endpoint_or_main():
    class Both(Page):
        @upload
        @endpoint
        def action(self):
            pass

    with pytest.raises(TypeError, match="conflicting declarations"):
        upload_methods(Both)
    def main(self, root):
        pass

    with pytest.raises(TypeError, match="@upload cannot declare main"):
        upload(main)


def test_upload_target_requires_sink_and_a_bounded_integer_limit():
    from gramlot.server import UploadTarget

    with pytest.raises(TypeError):
        UploadTarget(max_bytes=1)

    class Sink(UploadTarget):
        def write(self, chunk): pass
        def finish(self): return {"state": "completed", "result": None}
        def abort(self): return {"state": "unsaved"}
        def status(self): return {"state": "pending"}

    for limit in (-1, True, 1.5, None):
        with pytest.raises(ValueError):
            Sink(max_bytes=limit)
    assert Sink(max_bytes=0).max_bytes == 0


def test_on_complete_is_not_a_native_html_event():
    from gramlot import GramlotBuilder
    builder = GramlotBuilder()
    builder.root.div(onComplete="alert(1)")
    with pytest.raises(ValueError, match="only supported on an uploader"):
        builder.render()
