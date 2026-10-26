import MarkdownIt from 'markdown-it';
import createDOMPurify from 'dompurify';

// Keep the rich-editor codec and ordinary previews in HTML-as-text mode.
export const markdownRenderer = new MarkdownIt({html:false});
const htmlRenderer = new MarkdownIt({html:true});
const markdownDocumentStyle = `body{font:16px/1.6 system-ui;color:#243449;background:white;padding:24px;margin:0;overflow-wrap:anywhere}table{border-collapse:collapse}td,th{border:1px solid #ccd3dd;padding:6px 12px}pre{overflow:auto;background:#edf1f7;padding:12px;border-radius:4px}code{font-size:.9em}img{max-width:100%}blockquote{border-left:3px solid #ccd3dd;margin-left:0;padding-left:16px}a{color:#3566aa}`;
export function renderMarkdownDocument(value, {allowHtml=false, document} = {}) {
    if (typeof value !== 'string') throw new TypeError('Markdown preview value must be a string');
    const rendered = allowHtml ? createDOMPurify(document.defaultView).sanitize(htmlRenderer.render(value), {
        USE_PROFILES:{html:true}, FORBID_TAGS:['style','form','input','button','select','textarea'],
    }) : markdownRenderer.render(value);
    return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; form-action 'none'"><style>${markdownDocumentStyle}</style></head><body>${rendered}</body></html>`;
}
