# Data and binding

Document ID: **GC-510**.

Every page has one Data tree. Elements point at its values with short strings
called **pointers**. This page covers what you need in every page; every option is
in the [Data and logic reference](515-data-and-logic-reference.md).

<a id="gc-510-005"></a>

## 005 · Paths and `datapath`

Block ID: **GC-510-005**.

A Data path is a dotted name: `customer.name`. A path that starts with a dot is
**relative** to the nearest `datapath` above it.

```python
panel = root.div(datapath="customer")
panel.input(value="^.name")    # customer.name
panel.input(value="^.city")    # customer.city
```

Give two panels different `datapath` values and they keep separate values.

<a id="gc-510-010"></a>

## 010 · Three kinds of pointer

Block ID: **GC-510-010**.

| You write | It means |
| --- | --- |
| `'^.name'` | Read `name` and **follow** it: update when it changes. |
| `'=.name'` | Read `name` once, when needed, without following it. |
| `'==a + b'` | Compute a JavaScript expression in the browser. |

Use `^` almost everywhere. Use `=` to pass a value to code without triggering it.

<a id="gc-510-015"></a>

## 015 · Fields write back

Block ID: **GC-510-015**.

A field bound with `value='^.name'` shows the value **and** writes the user's edit
into the Data.

- By default it writes when the field loses focus or the user confirms.
- `live=True` writes at every keystroke.
- A checkbox writes `true` or `false`; a number field writes a number or null.

<a id="gc-510-020"></a>

## 020 · Initial values

Block ID: **GC-510-020**.

Most values arrive from the server. For the rest:

```python
root.input(type="number", value="^.font_size", default_value=14)  # only if empty
root.dataSetter(".settings.caption", "Orders")                     # always writes
```

A `default` never overwrites an existing value, not even `0`, `False` or `""`.

<a id="gc-510-025"></a>

## 025 · Computing and reacting

Block ID: **GC-510-025**.

| Need | Declaration |
| --- | --- |
| A value computed from others | `dataFormula` |
| Run code when a value changes | `dataController` |
| Run code on a click | a `dataController` inside a `button` |

```python
root.dataFormula(".total", func="add", a="^.a", b="^.b")
root.button("Save").dataController(func="save", total="=.total")
```

Arguments with `^` trigger the declaration; arguments with `=` are only read.

<a id="gc-510-030"></a>

## 030 · Where the code goes: `Logic`

Block ID: **GC-510-030**.

`func="add"` names a method of the `Logic` class in the JavaScript file with the
page's name: `orders.js` beside `orders.py`.

```javascript
// orders.js
export class Logic {
    add(kwargs) { return kwargs.a + kwargs.b; }      // formula: returns the value
    save(node, kwargs) { node.SET('.saved', true); } // controller: writes Data itself
}
```

Inside a controller, `node.SET(path, value)` writes Data and `node.GET(path)` reads it.
Inline code such as `formula="a + b"` also works, but is discouraged: it needs a
Content Security Policy that allows `'unsafe-eval'`.

<a id="gc-510-035"></a>

## 035 · Formatting text

Block ID: **GC-510-035**.

```python
pane.p("^.amount", format="0.00", mask="Total: {} €")
pane.div(width="^.width:{}px")     # 38 becomes "38px"
```

`mask` and `:` templates put the value where `{}` is. They never change the Data.

<a id="gc-510-040"></a>

## 040 · Next steps

Block ID: **GC-510-040**.

- [Data and logic reference](515-data-and-logic-reference.md): every pointer form,
  attribute and method.
- [Calling the server](098-server-calls.md): load and save values with `dataRpc`.
- The *Binding* and *Controllers* lessons of the
  [examples gallery](https://gramlot-examples.readthedocs.io/en/latest/).
