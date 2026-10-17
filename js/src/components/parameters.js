/** Resolve descriptor defaults once and return attributes owned by other layers. */
export function projectParameters(element, attrs) {
    element.parameters = Object.fromEntries(Object.entries(element.constructor.gramlotComponent.parameters)
        .map(([name, spec]) => [name, Object.hasOwn(attrs, name) ? attrs[name] : spec.default]));
    return Object.fromEntries(Object.entries(attrs).filter(([name]) => !Object.hasOwn(element.parameters, name)));
}
