/** DOM-free component definitions and their portable Builder declarations. */
import {webcomponentCode} from '../webcomponent.js';

function freeze(value) {
    for (const child of Object.values(value)) if (child && typeof child === 'object') freeze(child);
    return Object.freeze(value);
}
function annotation(parameter) {
    if (!parameter.annotation && typeof parameter.dtype !== 'string' && !Array.isArray(parameter.dtype)) throw new TypeError('Component parameter requires dtype');
    const alternatives = parameter.annotation ? [structuredClone(parameter.annotation)]
        : (Array.isArray(parameter.dtype) ? parameter.dtype : [parameter.dtype]).map(dtype => ({kind: 'dtype', dtype}));
    if (parameter.nullable) alternatives.push({kind: 'dtype', dtype: 'NN'});
    if (parameter.binding && parameter.dtype !== 'T') alternatives.push({kind: 'annotated',
        base: {kind: 'dtype', dtype: 'T'},
        metadata: [{kind: 'regex', pattern: '^[\\^=].+', flags: 0}]});
    return alternatives.length === 1 ? alternatives[0] : {kind: 'union', items: alternatives};
}

/** Compose effective metadata without invoking a DOM class factory. */
export function defineComponent({name, tag, base, mixins = [], parameters = {}, subTags = '', presentationDefaults = [], dataScope = false, command = false, childParameters = {}, sourceContext = false, bagStore = false, bagStruct = false, dragSource = false, implementation}) {
    webcomponentCode({code: tag});
    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) throw new TypeError('Invalid component authoring name');
    const effective = {...base.parameters};
    for (const mixin of mixins) {
        for (const [key, spec] of Object.entries(mixin.parameters)) {
            if (Object.hasOwn(effective, key)) throw new Error(`Duplicate mixin parameter: ${key}`);
            effective[key] = spec;
        }
    }
    Object.assign(effective, parameters);
    for (const spec of Object.values(effective)) annotation(spec);
    return Object.freeze({name, tag, base, subTags, presentationDefaults: Object.freeze([...presentationDefaults]), dataScope, command, bagStore, bagStruct, mixins: Object.freeze([...mixins]),
        labelbox: mixins.some(mixin => mixin.labelbox === true),
        parameters: freeze(structuredClone(effective)), childParameters: freeze(structuredClone(childParameters)), sourceContext, dragSource, implementation});
}

export class ComponentCollection {
    #classes = new WeakMap();
    constructor({name, components, dependencies = [], css = [], assets = {}, registerCommands = () => {}}) {
        if (typeof name !== 'string' || !name) throw new TypeError('Collection name must be nonempty');
        if (!Array.isArray(dependencies) || dependencies.some(item => !(item instanceof ComponentCollection))) {
            throw new TypeError('Collection dependencies must be collection objects');
        }
        if (!Array.isArray(css) || css.some(url => !(url instanceof URL)) ||
                !assets || typeof assets !== 'object' || Array.isArray(assets) ||
                Object.values(assets).some(url => !(url instanceof URL))) {
            throw new TypeError('Collection css/assets require URL objects');
        }
        if (typeof registerCommands !== 'function') throw new TypeError('registerCommands must be a function');
        this.dependencies = Object.freeze([...dependencies]);
        this.css = Object.freeze([...css]);
        this.assets = Object.freeze({...assets});
        this.registerCommands = registerCommands;
        this.name = name;
        this.components = Object.freeze([...components]);
        const names = new Set(), tags = new Set();
        for (const component of components) {
            if (names.has(component.name.toLowerCase()) || tags.has(component.tag)) {
                throw new Error(`Duplicate component: ${component.name}`);
            }
            names.add(component.name.toLowerCase()); tags.add(component.tag);
        }
    }
    /** Same JSON consumed by Python and JavaScript Builders. */
    toDocument() {
        return {document_format: {name: 'builder_grammar', version: '1.1'},
            grammar: {name: this.name, version: null, title: this.name, description: null},
            abstracts: {}, elements: Object.fromEntries(this.components.map(component => [component.name, {
                doc: null, sub_tags: component.subTags, parent_tags: null, inherits_from: null, ns: null,
                node_label: null, collection_key: null,
                attributes: {parameters: [
                    ...Object.entries(component.parameters).map(([name, spec]) => ({name,
                        kind: 'keyword_only', role: 'attribute', annotation: annotation(spec),
                        has_default: true, default: spec.default ?? null})),
                    {name: 'attr', kind: 'var_keyword', role: 'attribute',
                        annotation: {kind: 'any'}, has_default: false}],
                    accepts_var_keyword: true, accepts_var_positional: false},
                _meta: {render_tag: component.tag, gramlot_component: {parameters: structuredClone(component.parameters),
                    presentationDefaults: [...component.presentationDefaults], dataScope: component.dataScope, command: component.command,
                    ...(Object.keys(component.childParameters).length ? {childParameters: structuredClone(component.childParameters)} : {}),
                    ...(component.sourceContext ? {sourceContext: true} : {}),
                    ...(component.labelbox ? {labelbox: true} : {}),
                    ...(component.dragSource ? {dragSource: true} : {}),
                    ...(component.bagStore ? {bagStore: true} : {}),
                    ...(component.bagStruct ? {bagStruct: true} : {})}}
            }]))};
    }
    /** Register once per document realm, only when the collection is activated. */
    register(window) {
        if (this.#classes.has(window)) return;
        const classes = [];
        for (const component of this.components) {
            if (window.customElements.get(component.tag)) throw new Error(`Custom element already registered: ${component.tag}`);
            let Base = component.base(window.HTMLElement);
            for (const mixin of component.mixins) Base = mixin(Base);
            const Class = component.implementation(Base);
            Object.defineProperty(Class, 'gramlotComponent', {value: component});
            classes.push([component.tag, Class]);
        }
        for (const [tag, Class] of classes) window.customElements.define(tag, Class);
        this.#classes.set(window, classes);
    }
}

export function defineCollection(options) { return new ComponentCollection(options); }
