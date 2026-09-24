"""Package the canonical native collections exported by genro-builders-js."""
import argparse
import json
from pathlib import Path


def main():
    root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', nargs='?', type=Path,
                        default=root / 'js/node_modules/genro-builders-js/src/collections',
                        help='Exported collection directory in the installed package or owning checkout')
    source = parser.parse_args().source
    documents = {}
    for name in ('html5', 'svg'):
        content = (source / f'{name}.json').read_bytes()
        if json.loads(content).get('document_format') != {'name': 'builder_grammar', 'version': '1.1'}:
            raise RuntimeError(f'{name} requires the owning builder_grammar 1.1 export')
        documents[name] = content
    destination = root / 'src/gramlot/collections'
    destination.mkdir(parents=True, exist_ok=True)
    for name, content in documents.items():
        (destination / f'{name}.json').write_bytes(content)


if __name__ == '__main__':
    main()
