"""Publish only approved LLM cards with version-relative, useful links."""
from pathlib import Path
import re
import sys

sys.path.insert(0, str(Path(__file__).parents[1] / 'scripts'))
from prepare_docs import PUBLIC_LLM_PAGES, llm_downloads, published_links

ROOT = Path(__file__).parents[1]


def test_only_collection_cards_and_discovery_index_are_downloadable():
    files = llm_downloads(ROOT)
    assert len(PUBLIC_LLM_PAGES) == 14
    assert {'docs_llm/public/480-charts.md', 'docs_llm/public/485-vizabi.md', 'docs_llm/public/490-audio.md', 'docs_llm/public/495-drawing.md'} <= set(PUBLIC_LLM_PAGES)
    assert set(files) == {'llms.txt', *(f'llm/{Path(path).name}' for path in PUBLIC_LLM_PAGES)}
    assert all(all(marker not in text for marker in ('/internal/', '/future/', '/Users/', '/private/'))
               for text in files.values())
    for path in PUBLIC_LLM_PAGES:
        assert f'](llm/{Path(path).name})' in files['llms.txt']


def test_publishing_keeps_code_contracts_and_stable_ids_exact():
    files = llm_downloads(ROOT)
    for path in PUBLIC_LLM_PAGES:
        source = (ROOT / path).read_text()
        published = files[f'llm/{Path(path).name}']
        assert re.findall(r'```.*?```', source, re.S) == re.findall(r'```.*?```', published, re.S)
        assert re.findall(r'^\|.*$', source, re.M) == re.findall(r'^\|.*$', published, re.M)
        assert re.findall(r'<a id="([^"]+)"', source) == re.findall(r'<a id="([^"]+)"', published)


def test_links_stay_in_current_version_and_do_not_expose_repository_paths():
    text = '[Peer](410-inputs.md#gc-410-textbox) [Shared](097-data-binding.md#gc-095-040) [Self](#gc-445-grid) [Web](https://example.com/a.md)'
    assert published_links(text) == '[Peer](410-inputs.md#gc-410-textbox) [Shared](../docs/public/097-data-binding.html#gc-095-040) [Self](#gc-445-grid) [Web](https://example.com/a.md)'
    assert published_links('[Inputs](../../../docs_llm/public/410-inputs.md)', index=True) == '[Inputs](llm/410-inputs.md)'
