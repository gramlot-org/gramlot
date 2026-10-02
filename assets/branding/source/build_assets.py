"""Export the Gramlot identity kit from one vector master and approved tokens.

Requires Python with Pillow/reportlab and Node.js with sharp. See source/README.md.
"""

from __future__ import annotations

import argparse
import copy
import hashlib
import html
import json
from pathlib import Path
import re
import subprocess
import tempfile
import xml.etree.ElementTree as ET
import zipfile

from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
SVG_NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG_NS)
COLORS = json.loads((ROOT / "theme-tokens.json").read_text())["colors"]
VARIANTS = {
    "primary": (COLORS["brand.blue"], COLORS["brand.yellow"], COLORS["ink"]),
    "inverse": (COLORS["brand.blue"], COLORS["brand.yellow"], COLORS["navigation.text"]),
    "blue": (COLORS["brand.blue"],) * 3,
    "ink": (COLORS["ink"],) * 3,
    "black": ("#000000",) * 3,
    "white": ("#FFFFFF",) * 3,
}
FORMS = {
    "mark": (440, 440, (64, 128, 256, 512, 1024)),
    "logo": (440, 530, (256, 512, 1024, 2048)),
    "horizontal": (960, 320, (512, 1024, 2048)),
    "wordmark": (264, 85, (512, 1024, 2048)),
}
MASTER = ET.parse(ROOT / "source/gramlot-master.svg").getroot()
SYMBOL = MASTER.find(f"{{{SVG_NS}}}g[@id='symbol']")
WORDMARK = MASTER.find(f"{{{SVG_NS}}}g[@id='wordmark']")
JOBS: list[dict] = []


def write(relative: str, content: str) -> Path:
    path = ROOT / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return path


def recolor(element: ET.Element, colors: tuple[str, str, str], symbol: bool) -> str:
    node = copy.deepcopy(element)
    if symbol:
        for child, color in zip(node, colors[:2]):
            child.set("fill", color)
    else:
        node.set("fill", colors[2])
    return ET.tostring(node, encoding="unicode")


def artwork(form: str, variant: str) -> str:
    colors = VARIANTS[variant]
    symbol = recolor(SYMBOL, colors, True)
    wordmark = recolor(WORDMARK, colors, False)
    if form == "mark":
        return symbol
    if form == "logo":
        return symbol + wordmark
    if form == "wordmark":
        return '<g transform="translate(-90 -428)">' + wordmark + "</g>"
    return (
        '<g transform="scale(0.727272727)">' + symbol + "</g>"
        '<g transform="translate(320 89) scale(2.35) translate(-100.84 -438.49)">'
        + wordmark + "</g>"
    )


def svg(width: int, height: int, body: str, title: str) -> str:
    return (
        f'<svg xmlns="{SVG_NS}" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}" role="img" aria-label="{html.escape(title)}">'
        f"<title>{html.escape(title)}</title>{body}</svg>\n"
    )


def place(form: str, variant: str, x: float, y: float, width: float) -> str:
    scale = width / FORMS[form][0]
    return f'<g transform="translate({x} {y}) scale({scale})">{artwork(form, variant)}</g>'


def png(source: Path, target: str, width: int, background: str | None = None) -> None:
    dest = ROOT / target
    dest.parent.mkdir(parents=True, exist_ok=True)
    JOBS.append({"input": str(source), "output": str(dest), "width": width,
                 "background": background})


def export_logos() -> None:
    for form, (width, height, sizes) in FORMS.items():
        for variant in VARIANTS:
            source = write(f"svg/gramlot-{form}-{variant}.svg",
                           svg(width, height, artwork(form, variant), f"Gramlot {form}, {variant}"))
            for size in sizes:
                png(source, f"png/gramlot-{form}-{variant}-{size}.png", size)
    # Existing entry points retain their canvas, composition and background use.
    for suffix, variant, background in (("", "primary", "#FFFFFF"),
                                        ("-dark", "inverse", COLORS["navigation"])):
        source = write(f"gramlot-logo{suffix}.svg", svg(440, 530,
            f'<rect width="440" height="530" fill="{background}"/>'
            + artwork("logo", variant), "Gramlot"))
        png(ROOT / f"svg/gramlot-mark-{variant}.svg", f"gramlot-mark{suffix}.png", 1254, background)


def export_icons() -> None:
    body = '<rect width="512" height="512" rx="112" fill="#182333"/>'
    body += place("mark", "primary", -10, -10, 532)
    app = write("icons/app-icon.svg", svg(512, 512, body, "Gramlot app icon"))
    write("icons/favicon.svg", svg(512, 512, body, "Gramlot favicon"))
    write("icons/mask-icon.svg", svg(440, 440, artwork("mark", "black"), "Gramlot mask icon"))
    for size in (16, 24, 32, 48, 64):
        png(app, f"icons/favicon-{size}x{size}.png", size)
    png(app, "icons/apple-touch-icon.png", 180, COLORS["navigation"])
    for size in (192, 512):
        png(app, f"icons/android-chrome-{size}x{size}.png", size)
    # Maskable exports have an opaque background and keep all artwork inside
    # the central safe circle (radius 40% of the canvas).
    safe = svg(512, 512, '<rect width="512" height="512" fill="#182333"/>'
               + place("mark", "primary", 76, 76, 360), "Gramlot maskable icon")
    maskable = write("icons/maskable-icon.svg", safe)
    for size in (192, 512):
        png(maskable, f"icons/maskable-icon-{size}x{size}.png", size)
    write("icons/site.webmanifest", json.dumps({
        "name": "Gramlot", "short_name": "Gramlot",
        "theme_color": COLORS["navigation"], "background_color": COLORS["background"],
        "icons": [{"src": f"android-chrome-{s}x{s}.png", "sizes": f"{s}x{s}",
                   "type": "image/png", "purpose": "any"} for s in (192, 512)]
        + [{"src": f"maskable-icon-{s}x{s}.png", "sizes": f"{s}x{s}",
            "type": "image/png", "purpose": "maskable"} for s in (192, 512)]
    }, indent=2) + "\n")


def export_palette() -> None:
    write("palette/gramlot-palette.json", json.dumps(COLORS, indent=2) + "\n")
    write("palette/gramlot-palette.css", ":root {\n" + "".join(
        f"  --gramlot-{key.replace('.', '-')}: {value};\n" for key, value in COLORS.items()) + "}\n")
    write("palette/gramlot-palette.gpl", "GIMP Palette\nName: Gramlot\nColumns: 4\n#\n" + "".join(
        f"{int(value[1:3],16):3} {int(value[3:5],16):3} {int(value[5:7],16):3} {key}\n"
        for key, value in COLORS.items()))
    body = '<rect width="1000" height="880" fill="#F7F8F5"/>'
    for i, (name, color) in enumerate(COLORS.items()):
        x, y = 24 + i % 4 * 244, 24 + i // 4 * 142
        body += (f'<rect x="{x}" y="{y}" width="220" height="82" rx="8" fill="{color}"/>'
                 f'<text x="{x}" y="{y+106}" font-family="sans-serif" font-size="15" fill="#243449">'
                 f'{name}</text><text x="{x}" y="{y+126}" font-family="monospace" font-size="13" '
                 f'fill="#566579">{color}</text>')
    write("palette/gramlot-palette.svg", svg(1000, 880, body, "Gramlot palette"))


def export_compositions() -> None:
    for name, width, height in (("opengraph", 1200, 630), ("square", 1080, 1080),
                                ("banner", 1500, 500), ("portrait", 1080, 1350),
                                ("story", 1080, 1920)):
        for mode in ("light", "dark"):
            background = COLORS["background"] if mode == "light" else COLORS["navigation"]
            variant = "primary" if mode == "light" else "inverse"
            logo_width = width * (0.38 if height >= width else 0.8)
            form = "logo" if height >= width else "horizontal"
            logo_height = logo_width * FORMS[form][1] / FORMS[form][0]
            body = f'<rect width="{width}" height="{height}" fill="{background}"/>'
            body += f'<g opacity="0.06">{place("mark", "blue", width*.58, -width*.34, width*1.2)}</g>'
            body += f'<rect x="{width*.08}" y="{height*.1}" width="{width*.11}" height="6" rx="3" fill="#FFC400"/>'
            body += place(form, variant, (width-logo_width)/2, (height-logo_height)/2, logo_width)
            source = write(f"social/gramlot-{name}-{mode}.svg", svg(width, height, body, f"Gramlot {name}, {mode}"))
            png(source, f"social/gramlot-{name}-{mode}.png", width)
    for mode in ("light", "dark"):
        background = COLORS["background"] if mode == "light" else COLORS["navigation"]
        variant = "primary" if mode == "light" else "inverse"
        body = f'<rect width="2560" height="1440" fill="{background}"/>'
        body += f'<g opacity="0.07">{place("mark", "blue", 1280, -400, 1850)}</g>'
        body += place("horizontal", variant, 160, 960, 900)
        source = write(f"backgrounds/gramlot-wallpaper-{mode}.svg", svg(2560, 1440, body, f"Gramlot wallpaper, {mode}"))
        for size in (1920, 2560):
            png(source, f"backgrounds/gramlot-wallpaper-{mode}-{size}.png", size)
        for layout in ("title", "content"):
            body = f'<rect width="1920" height="1080" fill="{background}"/>'
            if layout == "title":
                body += f'<g opacity="0.05">{place("mark", "blue", 1100, -300, 1300)}</g>'
                body += place("horizontal", variant, 100, 92, 620)
            else:
                body += place("horizontal", variant, 90, 905, 360)
                body += '<rect x="90" y="870" width="1740" height="2" fill="#7A8798"/>'
            source = write(f"backgrounds/gramlot-slide-{layout}-{mode}.svg", svg(1920, 1080, body, f"Gramlot slide background, {layout}, {mode}"))
            png(source, f"backgrounds/gramlot-slide-{layout}-{mode}.png", 1920)


def export_preview() -> None:
    body = '<rect width="1600" height="1000" fill="#F7F8F5"/>'
    body += '<rect width="1600" height="400" fill="#182333"/>'
    body += place("horizontal", "inverse", 120, 70, 880)
    body += place("mark", "primary", 1150, 22, 340)
    body += place("logo", "primary", 80, 460, 320)
    body += place("horizontal", "primary", 540, 460, 780)
    for i, variant in enumerate(("primary", "blue", "ink", "black")):
        body += place("mark", variant, 550+i*205, 690, 170)
    for i, color in enumerate((COLORS["brand.blue"], COLORS["brand.yellow"], COLORS["navigation"], COLORS["background"])):
        body += f'<rect x="{80+i*140}" y="925" width="122" height="18" rx="9" fill="{color}" stroke="#7A8798" stroke-width="0.5"/>'
    source = write("preview/gramlot-identity.svg", svg(1600, 1000, body, "Gramlot identity overview"))
    png(source, "preview/gramlot-identity.png", 1600)


def export_html() -> None:
    cards = ""
    for form, (width, height, sizes) in FORMS.items():
        items = ""
        for variant in VARIANTS:
            cls = "dark" if variant in ("inverse", "white") else "checker"
            links = " · ".join(f'<a href="png/gramlot-{form}-{variant}-{size}.png">{size}px</a>' for size in sizes)
            items += (f'<article class="card"><div class="art {cls}"><img src="svg/gramlot-{form}-{variant}.svg" '
                      f'alt="Gramlot {form}, {variant}" loading="lazy"></div><div class="card-meta"><strong>{variant}</strong>'
                      f'<a href="svg/gramlot-{form}-{variant}.svg" download>SVG ↗</a></div><p class="downloads">PNG: {links}</p></article>')
        cards += f'<section id="{form}"><div class="section-title"><h2>{form.title()}</h2><span>6 variants · transparent SVG & PNG</span></div><div class="grid">{items}</div></section>'
    swatches = "".join(f'<div class="swatch"><i style="background:{color}"></i><strong>{key}</strong><code>{color}</code></div>' for key, color in COLORS.items())
    social = "".join(f'<article class="card"><img class="social" src="social/gramlot-{name}-dark.png" alt="{name} composition" loading="lazy"><div class="card-meta"><strong>{name}</strong><span>{size}</span></div><p class="downloads"><a href="social/gramlot-{name}-dark.svg">Dark SVG</a> · <a href="social/gramlot-{name}-dark.png">PNG</a> · <a href="social/gramlot-{name}-light.svg">Light SVG</a> · <a href="social/gramlot-{name}-light.png">PNG</a></p></article>' for name, size in (("opengraph","1200 × 630"),("square","1080 × 1080"),("banner","1500 × 500"),("portrait","1080 × 1350"),("story","1080 × 1920")))
    icons = "".join(f'<div class="icon-item"><img src="icons/favicon-{size}x{size}.png" width="{size}" height="{size}" alt="{size}px favicon"><a href="icons/favicon-{size}x{size}.png">{size}px</a></div>' for size in (16,24,32,48,64))
    backgrounds = "".join(f'<article class="card"><img class="social" src="backgrounds/gramlot-slide-{layout}-{mode}.png" alt="{layout}, {mode}" loading="lazy"><div class="card-meta"><strong>{layout} / {mode}</strong><a href="backgrounds/gramlot-slide-{layout}-{mode}.svg">SVG ↗</a></div><p class="downloads"><a href="backgrounds/gramlot-slide-{layout}-{mode}.png">1920 × 1080 PNG</a></p></article>' for layout in ("title","content") for mode in ("light","dark"))
    write("index.html", """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Gramlot · Identity kit</title><link rel="icon" href="icons/favicon.svg" type="image/svg+xml">
<style>
:root{color-scheme:light;--blue:#456BC4;--navy:#182333;--ink:#243449;--paper:#F7F8F5}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font:15px/1.6 system-ui,-apple-system,sans-serif;background:var(--paper);color:var(--ink)}a{color:#3557AB;text-underline-offset:4px}a:focus-visible{outline:3px solid #456BC4;outline-offset:4px}header{background:var(--navy);color:#EDF2FA;padding:34px max(24px,calc((100vw - 1240px)/2));overflow:hidden}.top{display:flex;justify-content:space-between;gap:20px;font-size:12px;letter-spacing:2px;text-transform:uppercase}.top a{color:#EDF2FA}.hero{display:grid;grid-template-columns:1.5fr 1fr;align-items:center;gap:32px;padding:72px 0 56px}.hero-logo{width:100%;max-width:720px}.hero h1{font-size:clamp(32px,4vw,56px);font-weight:500;line-height:1.12;letter-spacing:-2px;margin:0 0 24px}.hero p{color:#AAB8CC;max-width:350px}.pill{display:inline-block;background:#FFC400;color:#182333;padding:12px 20px;border-radius:100px;text-decoration:none;font-weight:650}.hero small{display:block;margin-top:20px;color:#AAB8CC}.nav{border-bottom:1px solid #D5DCE5;padding:18px 24px;display:flex;justify-content:center;flex-wrap:wrap;gap:24px;background:#fff}.nav a{font-size:13px;text-decoration:none;color:#243449}main{max-width:1288px;padding:0 24px;margin:auto}section{padding:54px 0 8px;scroll-margin-top:20px}.section-title{display:flex;align-items:baseline;justify-content:space-between;gap:20px;margin-bottom:22px}h2{font-weight:550;letter-spacing:-1px;font-size:30px;margin:0}.section-title span{font-size:12px;color:#566579}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.card{background:#fff;border:1px solid #D5DCE5;border-radius:12px;overflow:hidden}.art{height:240px;display:flex;align-items:center;justify-content:center;padding:26px}.art img{max-width:100%;max-height:100%;width:auto;height:auto}.checker{background-color:#fff;background-image:linear-gradient(45deg,#EDF1F7 25%,transparent 25%),linear-gradient(-45deg,#EDF1F7 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#EDF1F7 75%),linear-gradient(-45deg,transparent 75%,#EDF1F7 75%);background-size:20px 20px;background-position:0 0,0 10px,10px -10px,-10px 0}.dark{background:#182333}.card-meta{display:flex;justify-content:space-between;gap:12px;padding:16px 18px 0;font-size:13px}.card-meta strong{text-transform:capitalize}.downloads{font-size:11px;padding:0 18px 16px;margin:8px 0 0}.swatches{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}.swatch i{display:block;height:90px;border-radius:8px;border:1px solid #D5DCE5}.swatch strong,.swatch code{display:block;font-size:12px;margin-top:8px}.swatch code{color:#566579;margin:2px 0}.icon-row{display:flex;gap:32px;align-items:end;flex-wrap:wrap;background:white;border:1px solid #D5DCE5;padding:32px;border-radius:12px}.icon-item{display:flex;flex-direction:column;align-items:center;gap:12px;font-size:12px}.social{width:100%;height:220px;object-fit:contain;background:#EDF1F7;display:block}.note{background:#EDF1F7;border-left:3px solid #456BC4;padding:18px 22px;line-height:1.7;margin-top:24px}.links{display:flex;flex-wrap:wrap;gap:20px;margin:20px 0;font-size:13px}.rules{display:grid;grid-template-columns:1fr 1fr;gap:24px}.rule{border-top:2px solid #456BC4;padding:20px 0}.rule h3{font-size:16px;margin:0 0 10px}.rule p{color:#566579;margin:0}.footer{display:flex;justify-content:space-between;gap:24px;padding:44px 0;margin-top:50px;border-top:1px solid #D5DCE5;font-size:12px;color:#566579}@media(max-width:900px){.hero{grid-template-columns:1fr;padding-top:46px}.hero-logo{max-width:580px}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.swatches{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:560px){.top{letter-spacing:1px;font-size:10px}.grid,.rules{grid-template-columns:1fr}.swatches{grid-template-columns:repeat(2,minmax(0,1fr))}.section-title{display:block}.section-title span{display:block;margin-top:6px}.art{height:220px}.hero h1{letter-spacing:-1px}.footer{flex-direction:column}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style></head><body><header><div class="top"><span>Gramlot / visual identity</span><a href="README.md">Kit guide ↗</a></div><div class="hero"><img class="hero-logo" src="svg/gramlot-horizontal-inverse.svg" alt="Gramlot"><div><h1>One identity.<br>Every format.</h1><p>The approved blue and yellow symbol, consistent geometry and original outlined lettering. Ready for digital layouts and scalable artwork.</p><a class="pill" href="../gramlot-brand-kit.zip" download>Download the complete kit ↗</a><small>Vector masters · PNG · Icons · Social · Print</small></div></div></header>
<nav class="nav" aria-label="Asset sections"><a href="#logo">Logo</a><a href="#horizontal">Horizontal</a><a href="#mark">Symbol</a><a href="#wordmark">Wordmark</a><a href="#palette">Palette</a><a href="#icons">Icons</a><a href="#social">Social</a><a href="#backgrounds">Backgrounds</a><a href="#use">Usage</a></nav><main>
""" + cards + '<section id="palette"><div class="section-title"><h2>Color language</h2><span>Approved brand & supporting UI tokens</span></div><div class="swatches">' + swatches + '</div><div class="links"><a href="palette/gramlot-palette.css">CSS variables</a><a href="palette/gramlot-palette.json">JSON</a><a href="palette/gramlot-palette.gpl">GIMP palette</a><a href="palette/gramlot-palette.svg">SVG swatch sheet</a><a href="contrast-check.json">Text contrast calculations</a></div></section>'
    + '<section id="icons"><div class="section-title"><h2>Small, but recognizable</h2><span>Actual pixel sizes</span></div><div class="icon-row">' + icons + '</div><div class="links"><a href="icons/favicon.ico">ICO</a><a href="icons/favicon.svg">SVG favicon</a><a href="icons/app-icon.svg">App icon</a><a href="icons/apple-touch-icon.png">Apple touch</a><a href="icons/android-chrome-512x512.png">512px icon</a><a href="icons/maskable-icon-512x512.png">Maskable icon</a><a href="icons/mask-icon.svg">Safari mask</a><a href="icons/site.webmanifest">Manifest fragment</a></div><p class="note">Inspect 16px and 24px exports on the target browser: the approved mark has thin tips. These are working exports, not certified minimum sizes. The manifest contains icon metadata only; add the application’s own URL and display settings when integrating it.</p></section>'
    + '<section id="social"><div class="section-title"><h2>Space for the brand</h2><span>Five compositions · light & dark</span></div><div class="grid">' + social + '</div></section>'
    + '<section id="backgrounds"><div class="section-title"><h2>Presentation backgrounds</h2><span>1920 × 1080 · space for your content</span></div><div class="grid">' + backgrounds + '</div><div class="links"><a href="backgrounds/gramlot-wallpaper-dark-2560.png">Dark wallpaper · 2560px</a><a href="backgrounds/gramlot-wallpaper-light-2560.png">Light wallpaper · 2560px</a><a href="backgrounds/gramlot-wallpaper-dark.svg">Dark wallpaper SVG</a><a href="backgrounds/gramlot-wallpaper-light.svg">Light wallpaper SVG</a></div></section>'
    + '<section id="use"><div class="section-title"><h2>Use with care</h2><span>Consistent composition. Clear contrast.</span></div><div class="rules"><div class="rule"><h3>Preserve the identity</h3><p>Keep the lowercase name, outlined Arial Rounded lettering, symbol proportions and blue/yellow pair. Use the inverse variant on navy. Leave at least one disc diameter around the visible artwork.</p></div><div class="rule"><h3>Choose the right asset</h3><p>Use SVG for layouts and printing, PNG for raster-only tools, and icons for browser tabs. Monochrome variants are utility exports. Color PDFs use RGB; agree a printer-specific CMYK conversion before production.</p></div></div><div class="links"><a href="theme-guide.md">Complete usage guide</a><a href="print/gramlot-identity-guide.pdf">Printable identity guide</a><a href="source/gramlot-master.svg">Vector master</a><a href="source/README.md">Rebuild instructions</a><a href="manifest.json">Inventory & checksums</a></div><p class="note">The owner authorized completion of the graphic kit on 2026-10-02. The September identity is preserved; the vector reconstruction and new layouts are delivered for visual review. This reference sheet is an asset catalogue, not a Gramlot application or a runtime theme.</p></section><footer class="footer"><span>Gramlot · Identity kit / 2026-10-02</span><span>Self-contained artwork. Original raster references preserved.</span></footer></main></body></html>\n')


def render_pngs(node: str, modules: Path) -> None:
    renderer = """
const {createRequire}=require('module');const fs=require('fs');
const sharp=createRequire(process.argv[1]+'/package.json')('sharp');
const jobs=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
(async()=>{for(const job of jobs){let img=sharp(job.input).resize({width:job.width});
if(job.background)img=img.flatten({background:job.background});
await img.png().toFile(job.output);}console.log(`Rendered ${jobs.length} PNG exports`);})().catch(e=>{console.error(e);process.exit(1)});
"""
    with tempfile.TemporaryDirectory(prefix="gramlot-brand-") as tmp:
        job_path = Path(tmp) / "jobs.json"
        job_path.write_text(json.dumps(JOBS))
        subprocess.run([node, "-e", renderer, str(modules.resolve()), str(job_path)], check=True)
    source = Image.open(ROOT / "icons/android-chrome-512x512.png")
    source.save(ROOT / "icons/favicon.ico", sizes=[(16,16),(24,24),(32,32),(48,48),(64,64)])


def transform(c: canvas.Canvas, text: str) -> None:
    for name, args in re.findall(r"(translate|scale)\(([^)]+)\)", text):
        values = [float(n) for n in re.split(r"[ ,]+", args.strip())]
        if name == "translate": c.translate(values[0], values[1] if len(values)>1 else 0)
        else: c.scale(values[0], values[1] if len(values)>1 else values[0])


def pdf_path(c: canvas.Canvas, d: str) -> None:
    tokens = re.findall(r"[A-Za-z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?", d)
    p = c.beginPath();i=0;x=y=0;command=""
    while i < len(tokens):
        if tokens[i].isalpha(): command=tokens[i];i+=1
        if command == "Z": p.close();command="";continue
        counts={"M":2,"L":2,"H":1,"V":1,"C":6,"Q":4}
        n=counts[command];a=list(map(float,tokens[i:i+n]));i+=n
        if command == "M": x,y=a;p.moveTo(x,y);command="L"
        elif command == "L": x,y=a;p.lineTo(x,y)
        elif command == "H": x=a[0];p.lineTo(x,y)
        elif command == "V": y=a[0];p.lineTo(x,y)
        elif command == "C": p.curveTo(*a);x,y=a[-2:]
        elif command == "Q":
            qx,qy,nx,ny=a
            p.curveTo(x+2*(qx-x)/3,y+2*(qy-y)/3,nx+2*(qx-nx)/3,ny+2*(qy-ny)/3,nx,ny)
            x,y=nx,ny
    c.drawPath(p, stroke=0, fill=1)


def draw_art(c: canvas.Canvas, form: str, variant: str, x: float, y: float, width: float) -> None:
    height=width*FORMS[form][1]/FORMS[form][0]
    root=ET.fromstring(f'<svg xmlns="{SVG_NS}">{artwork(form,variant)}</svg>')
    def walk(element: ET.Element, fill: str = "#000000") -> None:
        c.saveState()
        transform(c, element.get("transform", ""))
        fill=element.get("fill",fill);c.setFillColor(HexColor(fill))
        if element.tag.endswith("path"): pdf_path(c,element.get("d"))
        for child in element:walk(child,fill)
        c.restoreState()
    c.saveState();c.translate(x,y+height);c.scale(width/FORMS[form][0],-width/FORMS[form][0]);walk(root);c.restoreState()


def export_pdf() -> None:
    dest=ROOT/"print/gramlot-identity-guide.pdf";dest.parent.mkdir(exist_ok=True)
    c=canvas.Canvas(str(dest),pagesize=(720,900),invariant=1)
    c.setTitle("Gramlot - visual identity and asset guide");c.setAuthor("Gramlot")
    def text(x,y,value,size=12,color="#243449",bold=False):
        c.setFillColor(HexColor(color));c.setFont("Helvetica-Bold" if bold else "Helvetica",size);c.drawString(x,y,value)
    def page(number,title,subtitle):
        c.setFillColor(HexColor("#F7F8F5"));c.rect(0,0,720,900,fill=1,stroke=0)
        text(48,853,"GRAMLOT / VISUAL IDENTITY",10,bold=True)
        text(48,796,title,30,bold=True);text(48,768,subtitle,12,color="#566579")
        text(48,30,"Identity kit / 2026-10-02 / RGB artwork",9,color="#566579")
        text(640,30,f"{number} / 4",9,color="#566579")
    # Cover: outlined lettering and vector symbol remain vector in the PDF.
    c.setFillColor(HexColor("#182333"));c.rect(0,0,720,900,fill=1,stroke=0)
    text(48,853,"GRAMLOT / IDENTITY KIT",10,"#EDF2FA",True)
    draw_art(c,"logo","inverse",160,260,400)
    text(48,153,"A complete set of graphic assets",23,"#EDF2FA",True)
    text(48,116,"Vector masters. Transparent exports. Icons. Social compositions.",12,"#EDF2FA")
    text(48,94,"Approved September identity; vector reconstruction for visual review.",11,"#AAB8CC")
    text(48,30,"2026-10-02 / 1 of 4",9,"#AAB8CC")
    for i,color in enumerate(("#456BC4","#FFC400","#EDF2FA")):
        c.setFillColor(HexColor(color));c.roundRect(580+i*32,844,22,8,4,fill=1,stroke=0)
    c.showPage()
    page(2,"The identity, in every layout","One shared geometry; original outlined Arial Rounded MT Bold lettering.")
    draw_art(c,"logo","primary",48,310,270)
    text(48,285,"STACKED LOGO",10,bold=True)
    draw_art(c,"horizontal","primary",345,535,325)
    text(345,510,"HORIZONTAL LOGO",10,bold=True)
    draw_art(c,"wordmark","primary",345,370,270)
    text(345,345,"WORDMARK",10,bold=True)
    draw_art(c,"mark","primary",362,135,150)
    draw_art(c,"mark","ink",522,135,150)
    text(345,113,"SYMBOL / MONOCHROME UTILITY",10,bold=True)
    text(48,200,"Keep at least one disc diameter",12)
    text(48,182,"of clear space around the artwork.",12)
    text(48,144,"SVG: use at any output resolution.",11,color="#566579")
    text(48,127,"PNG: width is stated in the filename.",11,color="#566579")
    c.showPage()
    page(3,"Color and small-scale use","Brand colors plus the approved supporting application palette.")
    for i,(name,color) in enumerate(COLORS.items()):
        x,y=48+(i%4)*158,647-(i//4)*91
        c.setFillColor(HexColor(color));c.roundRect(x,y,140,51,5,fill=1,stroke=0)
        text(x,y-15,name,9);text(x,y-29,color,9,color="#566579")
    text(48,126,"Browser icons at 16, 24, 32, 48 and 64 pixels",13,bold=True)
    for size,x in zip((16,24,32,48,64),(48,125,207,294,400)):
        c.drawImage(str(ROOT/f"icons/favicon-{size}x{size}.png"),x,60,width=size,height=size,mask="auto")
        text(x,45,f"{size}px",9,color="#566579")
    text(505,97,"Thin tips need a check",10,color="#566579")
    text(505,80,"in the target browser.",10,color="#566579")
    c.showPage()
    page(4,"A practical handoff","Choose an export, preserve the identity and check the target surface.")
    sections=[
        ("01 / Choosing files",["svg/: transparent logo, horizontal, symbol and wordmark in six variants.","png/: transparent RGB raster exports from 64px to 2048px width.","icons/: browser, Apple touch, Android and maskable icon exports.","social/: open graph, square, banner, portrait and story compositions.","backgrounds/: light/dark wallpapers and presentation backgrounds."]),
        ("02 / Consistent use",["Use primary artwork on light surfaces, inverse on navy.","Preserve proportions, orientation, lowercase lettering and colors.","Leave at least one disc diameter around visible artwork.","Start with a 64px symbol or 160px full logo; inspect the actual size.","Monochrome files support one-color reproduction, not semantic states."]),
        ("03 / Production and provenance",["The source/master SVG contains paths only, with no font dependency.","The symbol is reconstructed from the selected September raster reference.","New vector artwork and compositions remain subject to owner visual review.","PDF and PNG exports use RGB; agree CMYK with the printer for press work.","No font files are redistributed. Historic raster references are preserved."]),
        ("04 / Rebuild and integrate",["source/README.md documents export dependencies and the rebuild command.","manifest.json records dimensions, format, byte count and SHA-256 hashes.","icons/README.md provides favicon and webmanifest integration snippets.","The kit includes graphic assets; it does not install a runtime theme."])
    ]
    y=715
    for heading,lines in sections:
        text(48,y,heading,14,bold=True);y-=26
        for line in lines:text(48,y,line,11,color="#566579");y-=19
        y-=23
    c.save()


def package() -> None:
    files=[]
    for path in sorted(ROOT.rglob("*")):
        if not path.is_file() or path.name=="manifest.json" or "__pycache__" in path.parts or "references" in path.parts:continue
        raw=path.read_bytes();entry={"path":str(path.relative_to(ROOT)),"bytes":len(raw),"sha256":hashlib.sha256(raw).hexdigest()}
        if path.suffix.lower()==".svg":
            root=ET.fromstring(raw);entry.update(format="svg",viewBox=root.get("viewBox"),
                vector=not any(e.tag.endswith("image") for e in root.iter()))
        elif path.suffix.lower()==".png":
            with Image.open(path) as img:entry.update(format="png",width=img.width,height=img.height,mode=img.mode)
        files.append(entry)
    write("manifest.json",json.dumps({"brand":"Gramlot","version":"2026-10-02","source":"source/gramlot-master.svg",
          "status":"Owner-authorized kit completion; new vector artwork and layouts pending visual acceptance",
          "colorspace":"RGB / sRGB PNG exports","files":files},indent=2)+"\n")
    archive=ROOT.parent/"gramlot-brand-kit.zip"
    with zipfile.ZipFile(archive,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for path in sorted(ROOT.rglob("*")):
            if path.is_file() and "__pycache__" not in path.parts and "references" not in path.parts:
                info=zipfile.ZipInfo("gramlot-brand-kit/"+str(path.relative_to(ROOT)),date_time=(2026,10,2,0,0,0))
                info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644 << 16
                z.writestr(info,path.read_bytes())
    print(f"Packaged {len(files)+1} files; ZIP {archive.stat().st_size:,} bytes")


def main() -> None:
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--node",default="node")
    parser.add_argument("--node-modules",type=Path,default=ROOT.parents[1]/"temp/branding-tools/node_modules")
    parser.add_argument("--package-only",action="store_true")
    args=parser.parse_args()
    if not args.package_only:
        export_logos();export_icons();export_palette();export_compositions();export_preview();export_html()
        render_pngs(args.node,args.node_modules);export_pdf()
    package()


if __name__=="__main__":main()
