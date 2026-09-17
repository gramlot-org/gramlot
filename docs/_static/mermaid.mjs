import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10.9.3/dist/mermaid.esm.min.mjs";

mermaid.initialize({ startOnLoad: false, theme: "default" });
// SuperFences wraps the diagram text in <code>; Mermaid expects plain text.
for (const diagram of document.querySelectorAll(".mermaid")) {
  diagram.textContent = diagram.textContent;
}
await mermaid.run({ querySelector: ".mermaid" });
