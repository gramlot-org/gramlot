# Vector source and reproducible exports

`gramlot-master.svg` is the single artwork master. It contains two named groups:
`symbol` and `wordmark`, with explicit filled paths and no raster images, font files,
external references or scripts. The original 440 × 530 stacked composition is retained.

The symbol was reconstructed from the owner-selected light raster of 2026-09-18.
Contours were smoothed and fitted with cubic Bezier segments, then assigned the
approved solid blue/yellow values. This removes generated texture and provides
one geometry for light, dark and monochrome exports. It is a vector reconstruction,
not a claim of recovering the original authoring file or pixel-identical raster colors.
The seven outlined lettering paths are preserved from the original logo unchanged.
Original files are in git history, [commit `234c6d8`](https://github.com/gramlot-org/gramlot/tree/234c6d8/assets/branding).

## Rebuild

Export dependencies: Python 3.10+ with Pillow and reportlab; Node.js with sharp.
They are asset-production tools, not Gramlot runtime dependencies. Install them
in an isolated tool environment or use the Codex bundled runtime.

From the repository root, with the Python packages already available:

```sh
npm install --prefix temp/branding-tools sharp
python assets/branding/source/build_assets.py
```

For an existing Node package directory:

```sh
python assets/branding/source/build_assets.py --node-modules /path/to/node_modules
```

`--node /path/to/node` selects the Node executable. The generator reads the
master and `../theme-tokens.json`, regenerates SVG/PNG/icon/palette/composition/PDF
outputs and the catalogue, and rebuilds the manifest and ZIP (the ZIP is not
committed). It does not alter documentation. Run `--package-only` after changing a
guide to refresh checksums and the ZIP without rendering again.

The PDF contains vector logo paths and RGB colors. Its icon samples are raster.
Use SVG for individual artwork masters; use the PDF as a printable identity guide.
Confirm a printer-specific CMYK profile, paper and proof before press production.

## Authorization and acceptance

Owner request, 2026-10-02: “puoi provvedere e creare una bella cartella con tutto
il necessario per un immagine grafica ? bella ricca”. This authorizes completing
the kit described in the preceding audit: vector, transparent, monochrome and
favicon assets, preserving the previously approved identity. It does not imply
owner visual acceptance of the reconstruction or new compositions.
