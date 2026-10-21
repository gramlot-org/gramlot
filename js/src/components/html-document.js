/** Preserve nonvisual document content while editing the body through Jodit. */
const protectedSelector = 'script,style,iframe,object,embed,template,svg,math,link,meta,base';
const unsafeAttribute = (element, name, value) => /^on/i.test(name) || ['autofocus','srcdoc'].includes(name) ||
    (['href','src','action','formaction','xlink:href'].includes(name) && /^(?:javascript|vbscript|data):/i.test(value.trim()) &&
    !(element.tagName === 'IMG' && name === 'src' && /^data:image\/(?:png|jpeg|gif|webp);base64,/i.test(value)));

export function prepareHtmlDocument(value, window) {
    const parse = html => new window.DOMParser().parseFromString(html,'text/html');
    const original = parse(value);
    const full = /<(?:html|head|body)[\s>]|<!doctype/i.test(value) || original.head.children.length > 0;
    const display = original.body.cloneNode(true);
    const marker = `data-gramlot-${crypto.randomUUID()}`;
    const nodes = new Map(), attributes = new Map();
    let sequence = 0;
    const comments = [], walker = original.createTreeWalker(display,128);
    while (walker.nextNode()) comments.push(walker.currentNode);
    for (const node of [...display.querySelectorAll(protectedSelector), ...comments]) {
        if (!display.contains(node)) continue;
        const id = String(++sequence), placeholder = original.createElement('span');
        placeholder.setAttribute(marker,id); placeholder.setAttribute('contenteditable','false');
        placeholder.textContent = `[${node.nodeName.toLowerCase()} — edit in Code]`;
        nodes.set(id,node.cloneNode(true)); node.replaceWith(placeholder);
    }
    for (const element of display.querySelectorAll('*')) {
        const removed = [...element.attributes].filter(attr => unsafeAttribute(element,attr.name,attr.value))
            .map(attr => [attr.name,attr.value]);
        if (!removed.length) continue;
        for (const [name] of removed) element.removeAttribute(name);
        const id = String(++sequence); element.setAttribute(`${marker}-attrs`,id); attributes.set(id,removed);
    }
    const unique = (body, attribute, id) => {
        const matches = body.querySelectorAll(`[${attribute}="${id}"]`);
        if (matches.length !== 1) throw new Error('Protected page content changed. Use Code to edit it.');
        return matches[0];
    };
    return {
        html:display.innerHTML,
        styles:[...original.head.querySelectorAll('style')].map(node => node.textContent).join('\n'),
        serialize(html) {
            const edited = parse(html);
            if (edited.body.querySelector(protectedSelector) || [...edited.body.querySelectorAll('*')].some(element =>
                [...element.attributes].some(attr => unsafeAttribute(element,attr.name,attr.value)))) {
                throw new Error('Active or embedded content must be edited in Code.');
            }
            for (const [id,node] of nodes) unique(edited.body,marker,id).replaceWith(node.cloneNode(true));
            for (const [id,removed] of attributes) {
                const element = unique(edited.body,`${marker}-attrs`,id);
                for (const [name,value] of removed) element.setAttribute(name,value);
                element.removeAttribute(`${marker}-attrs`);
            }
            const result = original.cloneNode(true);
            result.body.innerHTML = edited.body.innerHTML;
            return full ? (result.doctype ? new window.XMLSerializer().serializeToString(result.doctype)+'\n' : '') + result.documentElement.outerHTML : result.body.innerHTML;
        }
    };
}
