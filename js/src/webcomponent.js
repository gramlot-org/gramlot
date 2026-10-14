// Custom-element names, shared by inert authoring and DOM projection.
const NAME = /^[a-z][.0-9_a-z\-\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}]*$/u;
const RESERVED = new Set(['annotation-xml', 'color-profile', 'font-face', 'font-face-src',
    'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph']);

/** The literal DOM tag of a webcomponent; code is never a Data pointer or expression. */
export function webcomponentCode(attrs) {
    const code = attrs.code;
    if (typeof code !== 'string' || NAME.exec(code)?.[0] !== code || !code.includes('-') || RESERVED.has(code)) {
        throw new TypeError('webcomponent: code must be a literal custom-element name');
    }
    return code;
}
