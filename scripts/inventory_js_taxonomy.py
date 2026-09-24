"""Extract a source inventory for taxonomy review; requires tree-sitter JS.

No JS execution and no inference of dynamic inheritance or semantic compatibility.
"""
import argparse
from collections import Counter
import json
from importlib.metadata import version
from pathlib import Path
import re
import subprocess

import tree_sitter
import tree_sitter_javascript


def text(node):
    return node.text.decode() if node else ''


def walk(node):
    yield node
    for child in node.named_children:
        yield from walk(child)


def extract(repo):
    parser = tree_sitter.Parser(tree_sitter.Language(tree_sitter_javascript.language()))
    files, classes, functions = [], [], []
    for directory in ('js/dom/src', 'js/pages/src'):
        for path in sorted((repo / directory).rglob('*')):
            if path.suffix not in {'.js', '.mjs'}:
                continue
            tree = parser.parse(path.read_bytes())
            if tree.root_node.has_error:
                raise ValueError(f'Parse error: {path}')
            relative = str(path.relative_to(repo))
            file_classes = []
            for node in walk(tree.root_node):
                if node.type in {'class_declaration', 'class'}:
                    name = text(node.child_by_field_name('name'))
                    ancestors = []; parent = node.parent
                    while parent:
                        ancestors.append(parent); parent = parent.parent
                    enclosing = next((p for p in ancestors if p.type in {'function_declaration', 'variable_declarator', 'method_definition'}), None)
                    scope = text(enclosing.child_by_field_name('name')) if enclosing else ''
                    kind = 'class'
                    if not name and enclosing and enclosing.type == 'variable_declarator':
                        name = scope; kind = 'functional mixin'
                    if not name:
                        call = next((p for p in ancestors if p.type == 'call_expression'), None)
                        args = call.child_by_field_name('arguments') if call else None
                        name = 'anonymous'
                        if args and args.named_children and args.named_children[0].type == 'string':
                            name += ':' + text(args.named_children[0]).strip("'\"")
                    heritage = next((c for c in node.named_children if c.type == 'class_heritage'), None)
                    base = text(heritage).removeprefix('extends ').strip()
                    record = dict(name=name, kind=kind, base_expression=base, scope=scope,
                                  file=relative, line=node.start_point[0]+1)
                    classes.append(record); file_classes.append(name)
                elif node.type in {'function_declaration', 'generator_function_declaration'}:
                    # Record module-level functions, including functions exported by name.
                    if node.parent.type in {'program', 'export_statement'}:
                        functions.append(dict(name=text(node.child_by_field_name('name')), file=relative,
                                              line=node.start_point[0]+1))
            files.append(dict(file=relative, classes=file_classes))
    cards = []
    for path in sorted((repo / 'gramlot_inventory/legacy-census/cards').glob('*.md')):
        content = path.read_text()
        def field(name):
            m = re.search(r'^- \*\*'+name+r':\*\* (.*)$', content, re.M)
            return m.group(1) if m else 'unclassified'
        cards.append(dict(name=content.splitlines()[0].removeprefix('# '), type=field('Type'),
                          level=field('Level'), recorded_status=field('Status'),
                          file=str(path.relative_to(repo))))
    reviewed = []
    for path in sorted((repo / 'gramlot_inventory').rglob('*.md')):
        if any(part in path.parts for part in ('legacy-census', 'reference')) or path.name == 'README.md':
            continue
        reviewed.append(str(path.relative_to(repo)))
    catalog=json.loads((repo/'js/dom/src/components/builtin-components.json').read_text())
    return dict(revision=subprocess.check_output(['git','-C',str(repo),'rev-parse','HEAD'],text=True).strip(),
                scope=['js/dom/src/**/*.js', 'js/dom/src/**/*.mjs', 'js/pages/src/**/*.js',
                       'gramlot_inventory/legacy-census/cards/*.md', 'components/builtin-components.json'],
                tools={name:version(name) for name in ['tree-sitter','tree-sitter-javascript']},
                limitations=['External dependencies not scanned', 'Legacy cards are discovery evidence, not JS classes or accepted behavior',
                             'Factory base expressions retained, not dynamically evaluated',
                             'Exported arrow helpers are covered by file inventory, not function-declaration count'],
                files=files, classes=classes, module_functions=functions, legacy_cards=cards,
                reviewed_cards=reviewed, collections=catalog['collections'])


def write_census(root, data):
    base = f"https://github.com/gramlot-org/gramlot-poc/blob/{data['revision']}/"
    def link(path, line=None):
        return f"[source]({base}{path}" + (f"#L{line}" if line else "") + ")"
    def section(number, title):
        return f'\n<a id="gc-050-{number}"></a>\n\n## {number} · {title}\n\n'
    intro = ("# Complete JavaScript and legacy-card census\n\nDocument ID: **GC-050**. "
             "Generated evidence; not a public API or compatibility claim.\n\n"
             "[Taxonomy and diagrams](045-js-taxonomy.md). "
             "[JSON evidence](inventory/045-js-taxonomy.json).\n\n"
             f"PoC revision: `{data['revision']}`.\n")
    full = intro + section('005', 'JavaScript classes and functional mixins')
    full += "Base expressions are syntactic evidence. Base/Element parameters and mixin calls require call-site review.\n\n"
    full += "| Name | Kind | Base expression | Definition |\n| --- | --- | --- | --- |\n"
    for c in data['classes']:
        full += f"| `{c['name']}` | {c['kind']} | `{c['base_expression'] or 'none'}` | `{c['file']}:{c['line']}` {link(c['file'],c['line'])} |\n"
    full += section('010', 'All scanned modules and module-level functions')
    full += "Every scanned module is retained, including utilities with no classes. Arrow helpers are outside the function-declaration count.\n\n"
    full += "| Module | Class constructs | Function declarations |\n| --- | --- | --- |\n"
    for f in data['files']:
        funcs=[v['name'] for v in data['module_functions'] if v['file']==f['file']]
        full += f"| `{f['file']}` {link(f['file'])} | {', '.join(f['classes']) or '—'} | {', '.join(funcs) or '—'} |\n"
    full += section('015', 'Legacy cards: recorded classification and status')
    full += ("All 390 source cards are listed. Recorded Italian status labels are quoted verbatim; "
             "implementato means a recorded name-level match, not reverified compatibility. "
             "The syntactic classifier can label composition helpers as components.\n\n")
    full += "| Identity | Recorded type | Level | Recorded status | Evidence |\n| --- | --- | --- | --- | --- |\n"
    for c in data['legacy_cards']:
        full += f"| `{c['name']}` | {c['type']} | {c['level']} | {c['recorded_status']} | {link(c['file'])} |\n"
    full += section('020', 'Curated current-contract cards and coverage limits')
    for path in data['reviewed_cards']:
        full += f"- `{path}` {link(path)}\n"
    full += ("\nNo test suite was executed to establish runtime coverage for this census. "
             "Tree-sitter syntax checks, inventory consistency and Mermaid syntax validation are separate checks. "
             "Only the selected PoC JS trees and existing legacy inventory were scanned.\n")
    (root/'docs/internal/050-js-taxonomy-census.md').write_text(full)
    brief = intro + section('005','JavaScript classes and functional mixins')
    brief += "112 class constructs and 2 functional mixins. Full per-definition paths/lines and base expressions are in the [full census](../../docs/internal/050-js-taxonomy-census.md#gc-050-005) and paired JSON. No inferred dynamic hierarchy.\n"
    brief += section('010','All scanned modules and module-level functions')
    brief += "113 modules, including no-class utilities; 138 module function declarations. Arrow helpers are excluded from that count. Every module is listed in the full census/JSON.\n"
    brief += section('015','Legacy cards: recorded classification and status')
    brief += "All 390 cards retained in full census/JSON: 341 component, 20 controller, 17 internal/reference helper, 11 component/helper, 1 recipe/registration. Recorded status is evidence, not compatibility. Source labels quoted verbatim; syntactic categories need review.\n"
    brief += section('020','Curated current-contract cards and coverage limits')
    brief += "Six curated cards cover textBox, dataFormula, dataRecord, dataSelection, apiResolver/openApiResolver and DbHandler. External dependencies, dynamic classes, other repositories and complete legacy JS are outside scope. No runtime tests for this census; parsing/consistency/Mermaid checks are distinct.\n"
    (root/'docs_llm/internal/050-js-taxonomy-census.md').write_text(brief)
    # Literal complete tree: do not silently resolve factory parameters or mixin calls.
    graph=['flowchart LR', '  note["Complete syntactic class tree: factory parameters and mixin expressions remain explicit"]']
    known={c['name']:f"c{i}" for i,c in enumerate(data['classes'])}
    external={}
    for i,c in enumerate(data['classes']):
        graph.append(f'  c{i}["{c["name"]}"]')
        base_expr=c['base_expression']
        if base_expr:
            if base_expr not in known:
                if base_expr not in external:
                    external[base_expr]=f'b{len(external)}'
                    graph.append(f'  {external[base_expr]}["{base_expr} · external or unresolved expression"]')
                parent=external[base_expr]
            else: parent=known[base_expr]
            graph.append(f'  {parent} -->|extends| c{i}')
        else:
            graph.append(f'  note -. no superclass declared .-> c{i}')
    for view in ['docs','docs_llm']:
        (root/view/'internal/diagrams/045-all-classes.mmd').write_text('\n'.join(graph)+'\n')


def main():
    ap=argparse.ArgumentParser();ap.add_argument('poc',type=Path);args=ap.parse_args()
    data=extract(args.poc.resolve())
    root=Path(__file__).resolve().parents[1]
    # Retain identity/capabilities, not large embedded documentation examples.
    data['collections']=[dict(name=c['name'],components=[{k:v for k,v in i.items() if k in
        {'name','tag','capabilities','pythonGroup'}} for i in c['components']]) for c in data['collections']]
    for view in ['docs','docs_llm']:
        target=root/view/'internal/inventory/045-js-taxonomy.json'
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
    write_census(root, data)
    print(json.dumps(dict(files=len(data['files']),classes=len(data['classes']),
        kinds=dict(Counter(c['kind'] for c in data['classes'])),
        functions=len(data['module_functions']),collections=len(data['collections']),
        components=sum(len(c['components']) for c in data['collections']),
        legacy=len(data['legacy_cards']),legacy_types=dict(Counter(c['type'] for c in data['legacy_cards'])),
        reviewed=len(data['reviewed_cards'])),indent=2))


if __name__ == '__main__':
    main()
