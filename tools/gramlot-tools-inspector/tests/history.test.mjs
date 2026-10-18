import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { Gramlot, GramlotBuilder } from "@gramlot/gramlot";
import { InspectorHistory } from "../src/inspector-history.js";
import layout from "../../../js/src/components/layout.js";
import { layoutWindow } from "../../../js/tests/helpers/layout-window.js";
function setup(collections = []) {
  const { window } = new JSDOM("<main></main>");
  layoutWindow(window);
  const app = new Gramlot({ collections, document: window.document, element: window.document.querySelector("main"), transport: false });
  const b = new GramlotBuilder(null, { collections });
  const left = b.root.div({ node_label: "left" });
  left.p("^name", { node_label: "text" });
  left.input({ value: "^name", node_label: "input" });
  b.root.div("Prefix", { node_label: "right" });
  app.data.setItem("name", "Ada");
  app.src.startSource(b.source);
  return { app, h: new InspectorHistory(app), node: (path) => app.src.source.getNode(path), close() {
    app.dispose();
    window.close();
  } };
}
test("scalar edits and attributes are reversible without losing bindings or metadata", () => {
  const f = setup();
  try {
    const n = f.node("main.left.text"), meta = n.getAttr("_meta");
    f.h.edit(n, { ...n.getAttr(), style: "color: crimson" }, n.value, true, false);
    assert.equal(f.app.src.renderer.destination.querySelector("p").style.color, "crimson");
    f.h.undo();
    assert.equal(n.getAttr("style"), null);
    assert.equal(n.getAttr("_meta"), meta);
    f.h.redo();
    assert.equal(n.getAttr("style"), "color: crimson");
    const d = f.app.data.getNode("name");
    f.h.edit(d, d.getAttr(), "Grace", false, true);
    assert.equal(f.app.src.renderer.destination.querySelector("p").textContent, "Grace");
    f.h.undo();
    assert.equal(f.app.src.renderer.destination.querySelector("input").value, "Ada");
  } finally {
    f.close();
  }
});
test("add to scalar Source preserves leading text and undo restores scalar representation", () => {
  const f = setup();
  try {
    const path = f.h.insert("main.right", "span");
    assert.ok(f.node(path));
    assert.equal(f.node("main.right").getAttr("_text"), "Prefix");
    f.h.undo();
    assert.equal(f.node("main.right").value, "Prefix");
    assert.equal(f.node("main.right").getAttr("_text"), null);
    f.h.redo();
    assert.ok(f.node(path));
    assert.equal(f.app.src.renderer.destination.lastElementChild.textContent, "Prefix");
  } finally {
    f.close();
  }
});
test("delete and restore entire branches, then undo earlier descendant and parent edits", () => {
  const f = setup();
  try {
    const left = f.node("main.left");
    f.h.edit(left, { ...left.getAttr(), title: "Edited" }, left.value, true, false);
    const child = f.h.insert("main.left", "div");
    f.h.insert(child, "span");
    f.h.remove("main.left");
    assert.equal(f.node("main.left"), null);
    f.h.undo();
    assert.ok(f.node(child + ".span_0"));
    f.h.undo();
    assert.equal(f.node(child + ".span_0"), null);
    f.h.undo();
    assert.equal(f.node(child), null);
    f.h.undo();
    assert.equal(f.node("main.left").getAttr("title"), null);
    for (let i = 0; i < 4; i++) f.h.redo();
    assert.equal(f.node("main.left"), null);
  } finally {
    f.close();
  }
});
test("reorder and reparent branches through Source, undo/redo preserves live bindings and Data", () => {
  const f = setup();
  try {
    f.h.move("main.left.text", "main.left.input", "after");
    assert.deepEqual(f.node("main.left").value.getNodes().map((n) => n.label), ["input", "text"]);
    f.h.undo();
    assert.deepEqual(f.node("main.left").value.getNodes().map((n) => n.label), ["text", "input"]);
    f.h.redo();
    f.h.move("main.left.text", "main.right", "inside");
    assert.equal(f.node("main.right.text").value, "^name");
    assert.equal(f.app.data.getItem("name"), "Ada");
    f.h.undo();
    assert.equal(f.node("main.right").value, "Prefix");
    f.h.undo();
    f.h.redo();
    f.h.redo();
    f.app.data.setItem("name", "Grace");
    assert.equal(f.app.src.renderer.destination.lastElementChild.textContent, "PrefixGrace");
  } finally {
    f.close();
  }
});
test("reject invalid topology, unavailable tags and duplicate labels before touching Source", () => {
  const f = setup();
  try {
    assert.throws(() => f.h.remove("main"), /root/);
    assert.throws(() => f.h.move("main.left", "main.left.text", "inside"), /itself/);
    assert.throws(() => f.h.insert("main.left.input", "div"));
    assert.throws(() => f.h.insert("main.left", "inventedWidget"));
    assert.equal(f.node("main.left.input").value, null);
    assert.equal(f.h.state.undo, "");
    f.h.insert("main.right", "p");
    const source = f.app.src.source.toTytx("json");
    assert.throws(() => f.h.move("main.left.text", "main.right", "unknown"), /position/);
    assert.equal(f.app.src.source.toTytx("json"), source);
  } finally {
    f.close();
  }
});
test("external changes block undo rather than overwriting application edits; new edit clears redo", () => {
  const f = setup();
  try {
    const n = f.node("main.left.text");
    f.h.edit(n, { ...n.getAttr(), title: "Mine" }, n.value, true, false);
    n.setAttr({ title: "Application" });
    assert.throws(() => f.h.undo(), /outside/);
    assert.equal(n.getAttr("title"), "Application");
    f.h.clear();
    f.h.insert("main.right", "span");
    f.h.undo();
    assert.ok(f.h.state.redo);
    f.h.insert("main.right", "b");
    assert.equal(f.h.state.redo, "");
  } finally {
    f.close();
  }
});
test("history follows a restored node even when an application subscriber throws after insertion", () => {
  const f = setup();
  try {
    f.h.remove("main.left");
    f.app.src.source.subscribe("history-test-error", { any: (event) => {
      if (event.evt === "ins") throw new Error("Application insertion error");
    } });
    assert.throws(() => f.h.undo(), /Application insertion error/);
    assert.ok(f.node("main.left.text"));
    assert.equal(f.h.state.redo, "Remove branch");
    f.app.src.source.unsubscribe("history-test-error", { any: true });
    f.h.redo();
    assert.equal(f.node("main.left"), null);
    f.h.undo();
    assert.equal(f.app.src.renderer.destination.querySelector("p").textContent, "Ada");
  } finally {
    f.app.src.source.unsubscribe("history-test-error", { any: true });
    f.close();
  }
});
test("container insertion validates explicit region before mutating Source, including duplicate regions", () => {
  const f = setup([layout]);
  try {
    const path = f.h.insert("main.right", "borderContainer");
    const before = f.app.src.source.toTytx("json");
    assert.throws(() => f.h.insert(path, "contentPane"), /Choose region/);
    assert.equal(f.app.src.source.toTytx("json"), before);
    assert.throws(() => f.h.insert(path, "contentPane", { region: "invalid" }), /Invalid region/);
    assert.equal(f.app.src.source.toTytx("json"), before);
    const child = f.h.insert(path, "contentPane", { region: "center" });
    const valid = f.app.src.source.toTytx("json");
    assert.throws(() => f.h.insert(path, "contentPane", { region: "center" }), /already in use/);
    assert.equal(f.app.src.source.toTytx("json"), valid);
    assert.deepEqual(f.h.catalog(path)[0].fields, [{ name: "region", choices: ["top", "bottom", "left", "right"] }]);
    f.h.undo();
    assert.equal(f.node(child), null);
    f.h.redo();
    assert.equal(f.node(child).getAttr("region"), "center");
    assert.throws(() => f.h.move("main.left.text", path, "inside"), /Choose region/);
    assert.ok(f.node("main.left.text"));
  } finally {
    f.close();
  }
});
