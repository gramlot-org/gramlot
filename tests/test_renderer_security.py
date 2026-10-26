import pytest

from gramlot import GramlotBuilder


@pytest.mark.parametrize('value', ['javascript:alert(1)', ' \tjava\nscript:alert(1)', '^url'])
def test_native_form_action_rejects_javascript_urls(value):
    builder = GramlotBuilder()
    builder.data.set_item('url', 'javascript:alert(1)')
    builder.root.form(html_action=value)
    with pytest.raises(ValueError, match='javascript: URL'):
        builder.render()


@pytest.mark.parametrize('value, attrs', [
    ('^code', {}), ('=code', {}), ('==code', {}),
    (None, {'src': '^url'}), (None, {'html_src': '=url'}),
    (None, {'html_SRC': '^url'}),
    (None, {'_text': '^code'}), (None, {'src': '^url:={}'}),
])
def test_script_requires_literal_source(value, attrs):
    builder = GramlotBuilder()
    builder.root.script(value, **attrs)
    with pytest.raises(ValueError, match='script.*literal Source'):
        builder.render()


def test_literal_script_and_normal_form_action_remain_available():
    builder = GramlotBuilder()
    builder.root.script('window.literalScript = 1')
    builder.root.script(src='/trusted.js')
    builder.root.form(html_action='/submit')
    rendered = builder.render()
    assert 'window.literalScript = 1' in rendered
    assert 'src="/trusted.js"' in rendered
    assert 'action="/submit"' in rendered


@pytest.mark.parametrize('attribute', ['data', 'html_data', 'html_DATA'])
@pytest.mark.parametrize('value', ['javascript:alert(1)', ' \tjava\nscript:alert(1)', '^url'])
def test_object_data_rejects_javascript_urls(attribute, value):
    builder = GramlotBuilder()
    builder.data.set_item('url', 'javascript:alert(1)')
    builder.root.object(**{attribute: value})
    with pytest.raises(ValueError, match='javascript: URL'):
        builder.render()


def test_object_document_url_remains_available():
    builder = GramlotBuilder()
    builder.root.object(data='/report.pdf')
    assert 'data="/report.pdf"' in builder.render()


def test_javascript_scheme_uses_ascii_case_matching():
    from gramlot.renderer.attributes import is_javascript_url
    assert is_javascript_url('JaVaScRiPt:alert(1)')
    assert not is_javascript_url('javaſcript:alert(1)')
