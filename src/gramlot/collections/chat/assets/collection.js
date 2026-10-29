var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));

// collection-authoring:@gramlot/gramlot/components
var components_exports = {};
__export(components_exports, {
  defineCollection: () => defineCollection
});
__reExport(components_exports, components_star);
import * as components_star from "@gramlot/gramlot/components";
import { defineCollection as create } from "@gramlot/gramlot/components";
function defineCollection(options) {
  if (options.name !== "chat") throw new Error("Unexpected bundled collection");
  const css = [], assets = {};
  options.css?.forEach((url, index) => {
    url.href = css[index].href;
  });
  for (const [key, url] of Object.entries(options.assets ?? {})) url.href = assets[key].href;
  return create({ ...options, css, assets });
}

// src/components/parameters.js
function projectParameters(element, attrs) {
  element.parameters = Object.fromEntries(Object.entries(element.constructor.gramlotComponent.parameters).map(([name, spec]) => [name, Object.hasOwn(attrs, name) ? attrs[name] : spec.default]));
  return Object.fromEntries(Object.entries(attrs).filter(([name]) => !Object.hasOwn(element.parameters, name)));
}

// src/components/container.js
function Container(HTMLElement) {
  return class extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });
      const style = this.ownerDocument.createElement("style");
      style.textContent = `:host{box-sizing:border-box;display:block;min-width:0;font:inherit;color:var(--gramlot-ink,CanvasText)}
                *,*::before,*::after{box-sizing:border-box}.control-box{min-width:0}slot{display:contents}
                ::slotted(*){min-width:0;max-width:100%}`;
      this.controlBox = this.ownerDocument.createElement("div");
      this.controlBox.className = "control-box";
      this.control = this.controlBox;
      this.control.id = "control";
      this.control.append(this.ownerDocument.createElement("slot"));
      shadow.append(style, this.controlBox);
    }
    projectAttributes(attrs) {
      return projectParameters(this, attrs);
    }
  };
}
Container.parameters = {};

// src/components/chat.js
var ChatMessages = (0, components_exports.defineComponent)({
  name: "chatMessages",
  tag: "gramlot-chat-messages",
  base: Container,
  subTags: "*",
  implementation: (Base) => class extends Base {
    constructor() {
      super();
      const style = this.ownerDocument.createElement("style");
      style.textContent = `:host{height:100%;min-height:0;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable}
                .control-box{padding:20px max(20px,calc((100% - 880px)/2))}
                ::slotted(article){box-sizing:border-box;margin:0 0 24px;padding:16px 20px;border-radius:18px;
                    line-height:1.6;overflow-wrap:anywhere;background:var(--gramlot-chat-assistant-background,
                    color-mix(in srgb,var(--gramlot-surface-subtle,#eee) 88%,#628099))}
                ::slotted(article[data-role=user]){width:fit-content;max-width:85%;margin-left:auto;padding:12px 18px;
                    border-radius:20px;background:var(--gramlot-chat-bubble,var(--gramlot-surface-subtle,#eee))}`;
      this.shadowRoot.append(style);
    }
    connectedCallback() {
      this.setAttribute("role", "log");
      this.setAttribute("aria-label", "Conversation messages");
      this.setAttribute("aria-live", "polite");
      this.tabIndex = 0;
    }
  }
});
var chat_default = defineCollection({ name: "chat", components: [ChatMessages] });
export {
  ChatMessages,
  chat_default as default
};
