/** Resolve descriptor defaults once and return attributes owned by other layers. */
export function projectParameters(element, attrs) {
    element.parameters = parameterValues(element.constructor.gramlotComponent,attrs);
    return Object.fromEntries(Object.entries(attrs).filter(([name]) => !Object.hasOwn(element.parameters, name)));
}

export function parameterValues(component,attrs) {
    return Object.fromEntries(Object.entries(component.parameters)
        .map(([name,spec]) => [name,Object.hasOwn(attrs,name) ? attrs[name] : spec.default]));
}
