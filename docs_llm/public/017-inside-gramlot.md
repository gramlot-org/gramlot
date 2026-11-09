# Inside Gramlot

Document ID: **GC-017**.

[Expanded guide](../../docs/public/017-inside-gramlot.md).

<a id="gc-017-005"></a>

## 005 · Think of a page like a spreadsheet

A spreadsheet analogy introduces declared relationships: change an input and a result can follow. Gramlot connects an interface to Data.

<a id="gc-017-010"></a>

## 010 · Connect an interface to Data

`^example.name` connects a field and a display to one Data value.

<a id="gc-017-015"></a>

## 015 · Calculate a value

A `dataFormula` derives triangle area from base and height; `_init=True` runs it initially.

<a id="gc-017-020"></a>

## 020 · Describe the interface

Source describes interface declarations; Data holds values and bindings connect them.

<a id="gc-017-025"></a>

## 025 · Declare behavior

Formulas derive values; controllers react to changes and events. MVC is a helpful analogy, not an exact identity.

<a id="gc-017-030"></a>

## 030 · Draw the triangle

The SVG polygon uses a pointer template for points and a binding for color. Its transform places the right angle at the bottom left; the viewBox is designed for values from 0 to 10.

<a id="gc-017-035"></a>

## 035 · From one triangle to many

Hierarchical Data can hold separate branches for triangles and their values.

<a id="gc-017-040"></a>

## 040 · Give each triangle a context

A container `datapath` supplies each instance context; fixed relative paths in the imported helper resolve within that context.

<a id="gc-017-045"></a>

## 045 · Reuse the triangle in another page

The full Python Page, `triangle.py` helper and a second Page that imports it appear in the human guide with their companion stylesheet. Inline formula execution requires a compatible browser Content Security Policy.
