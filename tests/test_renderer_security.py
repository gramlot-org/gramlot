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
