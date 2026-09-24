"""Build the owner-requested Italian offline HTML guide with Sphinx RTD styling.

Requires BeautifulSoup in the runner, a Sphinx/MyST/RTD Python environment,
and a separate Node installation of Mermaid and playwright-core for SVG export.
The public Sphinx allowlist is deliberately unchanged.
"""
import argparse
import base64
import html
import json
import mimetypes
from pathlib import Path
import re
import shutil
import subprocess
import sys

from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]


def data_url(path):
    mime=mimetypes.guess_type(path)[0] or 'application/octet-stream'
    return f'data:{mime};base64,'+base64.b64encode(path.read_bytes()).decode()


def appendices():
    data=json.loads((ROOT/'docs/internal/inventory/045-js-taxonomy.json').read_text())
    base=f"https://github.com/gramlot-org/gramlot-poc/blob/{data['revision']}/"
    def table(title, headers, rows):
        return '<details><summary>'+html.escape(title)+'</summary><div class="inventory-table"><table><thead><tr>'+''.join('<th>'+html.escape(h)+'</th>' for h in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+cell+'</td>' for cell in row)+'</tr>' for row in rows)+'</tbody></table></div></details>'
    def source(path,line=None):
        return '<a href="'+base+path+(f'#L{line}' if line else '')+'">Sorgente</a>'
    pieces=[]
    pieces.append(table('10 collezioni · 38 descrizioni di componenti', ['Collezione','Nomi dichiarativi'],
        [[html.escape(c['name']),html.escape(', '.join(i['name'] for i in c['components']))] for c in data['collections']]))
    pieces.append(table('112 costrutti di classe e 2 mixin · elenco completo', ['Nome','Base sintattica','File','Riferimento'],
        [[html.escape(c['name']),html.escape(c['base_expression'] or 'Nessuna base dichiarata'),html.escape(c['file']),source(c['file'],c['line'])] for c in data['classes']]))
    pieces.append(table('390 schede GenroPy · evidenza legacy, non parità verificata', ['Identità','Tipo registrato','Stato registrato','Riferimento'],
        [[html.escape(c['name']),html.escape(c['type']),html.escape(c['recorded_status']),source(c['file'])] for c in data['legacy_cards']]))
    return '\n\n'.join(pieces)


def build(args):
    work=ROOT/'build/collaborator-guide'/args.document
    if work.exists(): shutil.rmtree(work)
    work.mkdir(parents=True)
    source=(ROOT/'docs/internal'/f'{args.document}.md').read_text()
    document_id=re.search(r'GC-[0-9]+',source).group(0)
    blocks=re.findall(r'```mermaid\n(.*?)```',source,re.S)
    svg_dir=work/'rendered';svg_dir.mkdir()
    jobs=[{'source':block,'output':str(svg_dir/f'diagram-{i}.svg')} for i,block in enumerate(blocks)]
    (work/'diagrams.json').write_text(json.dumps(jobs))
    subprocess.run(['node',str(ROOT/'scripts/render_guide_diagrams.mjs'),args.tools,args.browser,str(work/'diagrams.json')],check=True)
    for view in ('docs','docs_llm'):
        stage=work/view;stage.mkdir()
        shutil.copytree(svg_dir,stage/'diagrams')
        shutil.copy2(ROOT/'assets/branding/gramlot-logo.svg',stage/'logo.svg')
        original=(ROOT/view/'internal'/f'{args.document}.md').read_text()
        count=iter(range(len(blocks)))
        def image(match):
            i=next(count)
            assert match.group(1)==blocks[i], 'Full/concise diagrams diverged'
            return f'```{{image}} diagrams/diagram-{i}.svg\n:alt: Diagramma verticale {i+1}: responsabilità e relazioni Gramlot\n:align: center\n```'
        content=re.sub(r'```mermaid\n(.*?)```',image,original,flags=re.S)
        if view=='docs': content=content.replace('<!-- INVENTORY_APPENDICES -->',appendices())
        (stage/'index.md').write_text(content)
        (stage/'conf.py').write_text('''project = 'Gramlot'
author = 'Gramlot'
copyright = '2026, Gramlot'
language = 'it'
extensions = ['myst_parser']
source_suffix = {'.md': 'markdown'}
html_theme = 'sphinx_rtd_theme'
html_logo = 'logo.svg'
html_title = 'Gramlot — architettura e collaborazione'
html_show_sourcelink = False
html_copy_source = False
html_domain_indices = False
html_use_index = False
exclude_patterns = ['site']
''')
        log=work/f'{view}-sphinx.log'
        with log.open('w') as output:
            subprocess.run([args.sphinx_python,'-m','sphinx','-W','--keep-going','-n','-b','html',str(stage),str(stage/'site')],stdout=output,stderr=subprocess.STDOUT,check=True)
        page=stage/'site/index.html'
        soup=BeautifulSoup(page.read_text(),'html.parser')
        # Standalone navigation: all destinations are same-file section anchors.
        for elem in soup.select('script, link[rel="index"], link[rel="search"], form, .rst-breadcrumbs, .rst-footer-buttons'):
            elem.decompose()
        for link in list(soup.select('link[rel="stylesheet"]')):
            css_path=(page.parent/link['href'].split('?')[0]).resolve()
            css=css_path.read_text()
            def resource(match):
                rel=match.group(1).strip('"\'')
                if rel.startswith('data:'): return match.group(0)
                path=(css_path.parent/rel.split('?')[0].split('#')[0]).resolve()
                if not path.is_file(): raise FileNotFoundError(path)
                return 'url("'+data_url(path)+'")'
            css=re.sub(r'url\(([^)]+)\)',resource,css)
            style=soup.new_tag('style');style.string=css;link.replace_with(style)
        for image_node in list(soup.select('img')):
            asset=(page.parent/image_node['src']).resolve()
            if asset.name.startswith('diagram-') and asset.suffix=='.svg':
                svg=BeautifulSoup(asset.read_text(),'html.parser').find('svg')
                svg['role']='img';svg['aria-label']=image_node.get('alt','Diagramma Gramlot')
                container=soup.new_tag('div',attrs={'class':'guide-diagram'});container.append(svg)
                zoom=soup.new_tag('button',attrs={'type':'button','class':'diagram-zoom'})
                zoom.string='Ingrandisci diagramma'
                container.append(zoom)
                image_node.replace_with(container)
            else: image_node['src']=data_url(asset)
        nav=soup.select_one('.wy-menu-vertical')
        if nav:
            nav.clear()
            for number,title in re.findall(r'## (\d+) · ([^\n]+)',original):
                entry=soup.new_tag('a',href=f'#{document_id.lower()}-{number}');entry.string=f'{number} · {title}';nav.append(entry)
        for anchor in soup.select('a[href="index.html"], a[href="#"]'):
            anchor['href']='#'
        footer=soup.find('footer')
        if footer:
            footer.clear();footer.append(f'{document_id} · Guida interna italiana · 18 settembre 2026 · Diagrammi SVG incorporati, leggibili offline.')
        # Keep the classic RTD palette and typography, adapt only document readability.
        dialog=soup.new_tag('dialog',attrs={'id':'diagram-dialog','aria-label':'Diagramma ingrandito'})
        soup.body.append(dialog)
        extra=soup.new_tag('style');extra.string='''
.wy-nav-content{max-width:1000px}.wy-nav-side{background:#343131}
.wy-side-nav-search{background:#2980b9}.wy-side-nav-search img{max-height:100px;width:auto;padding:0}
.wy-menu-vertical a{font-size:14px;line-height:1.4;padding:8px 22px;color:#d9d9d9}
.guide-diagram{margin:24px auto 32px;max-width:690px;padding:18px 8px;border:1px solid #dce5eb;background:#fff;border-radius:4px}
.guide-diagram svg{display:block;margin:auto;width:100%;height:auto}
.rst-content table.docutils{width:100%;table-layout:fixed}.rst-content table.docutils td,.rst-content table.docutils th{white-space:normal;overflow-wrap:anywhere}
.rst-content .wy-table-responsive table td,.rst-content .wy-table-responsive table th{white-space:normal}
details{margin:16px 0;border:1px solid #d7e0e6;border-radius:3px;padding:14px}summary{cursor:pointer;font-weight:bold;color:#246992}
.inventory-table{overflow:auto;margin-top:14px}.inventory-table table{width:100%;font-size:13px}.inventory-table td,.inventory-table th{padding:8px;border-bottom:1px solid #ddd;vertical-align:top;overflow-wrap:anywhere}
.diagram-zoom{display:block;margin:12px auto 0;color:#246992;border:1px solid #d7e0e6;background:white;padding:6px 10px;font:inherit;font-size:13px;cursor:pointer}#diagram-dialog{max-width:94vw;max-height:92vh;border:1px solid #638299;padding:20px;overflow:auto}#diagram-dialog svg{display:block;min-width:500px;width:auto;max-width:none!important}#diagram-dialog::backdrop{background:#0008}.wy-nav-top{cursor:pointer}h2{scroll-margin-top:24px}a{overflow-wrap:anywhere}
@media(max-width:768px){.wy-nav-content{padding:22px 16px}.guide-diagram{padding:8px 0}.wy-nav-side.shift{left:0}.wy-nav-content-wrap.shift{left:300px;position:relative}}
@media print{.wy-nav-side,.wy-nav-top{display:none}.wy-nav-content-wrap{margin:0}.wy-nav-content{max-width:none;padding:0}.guide-diagram{break-inside:avoid;max-width:620px}h2{break-after:avoid}details:not([open]){display:none}}
''';soup.head.append(extra)
        script=soup.new_tag('script');script.string='''
const dialog=document.getElementById('diagram-dialog');
document.querySelectorAll('.diagram-zoom').forEach(button=>button.addEventListener('click',()=>{dialog.replaceChildren();const close=document.createElement('button');close.textContent='Chiudi';close.className='diagram-zoom';close.addEventListener('click',()=>dialog.close());dialog.append(close,button.parentElement.querySelector('svg').cloneNode(true));dialog.showModal();}));
document.querySelector('.wy-nav-top')?.addEventListener('click', function(event){event.preventDefault();document.querySelector('.wy-nav-side').classList.toggle('shift');});
document.querySelectorAll('.wy-menu-vertical a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.wy-nav-side').classList.remove('shift')));
''';soup.body.append(script)
        target=ROOT/view/'internal'/f'{args.document}.html'
        target.write_text(str(soup))
        print(f'Wrote {target} ({target.stat().st_size:,} bytes)')


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--tools',required=True);p.add_argument('--browser',required=True)
    p.add_argument('--sphinx-python',default=sys.executable)
    p.add_argument('--document',default='055-guida-collaboratori')
    build(p.parse_args())
