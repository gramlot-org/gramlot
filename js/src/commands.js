/** Page-local command definitions shared by collection preparation and activation. */
export class CommandRegistry {
    #groups = new Map();
    registerGroup(namespace, metadata = {}) {
        if (typeof namespace !== 'string' || !namespace || namespace.includes(':')) {
            throw new TypeError('Extension command namespace must be nonempty and unqualified');
        }
        if (this.#groups.has(namespace)) throw new Error(`Duplicate command namespace: ${namespace}`);
        if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata) || Object.keys(metadata).some(key => !['author', 'description'].includes(key)) ||
                Object.values(metadata).some(value => typeof value !== 'string')) {
            throw new TypeError(`Invalid command group metadata: ${namespace}`);
        }
        const commands = new Map();
        this.#groups.set(namespace, {metadata: {...metadata}, commands});
        return Object.freeze({register(name, definition) {
            if (typeof name !== 'string' || !name || name.includes(':')) throw new TypeError('Invalid command name');
            if (commands.has(name)) throw new Error(`Duplicate command: ${namespace}:${name}`);
            if (!definition || typeof definition !== 'object' || Array.isArray(definition) ||
                    !Object.hasOwn(definition, 'label') || !Object.hasOwn(definition, 'publish') ||
                    Object.keys(definition).some(key => !['label', 'publish', 'icon', 'iconSrc', 'tooltip'].includes(key)) ||
                    Object.values(definition).some(value => typeof value !== 'string')) {
                throw new TypeError(`Invalid command definition: ${namespace}:${name}`);
            }
            commands.set(name, Object.freeze({...definition}));
        }});
    }
    get(command) {
        const separator = command.indexOf(':');
        return this.#groups.get(command.slice(0, separator))?.commands.get(command.slice(separator + 1));
    }
    toDocument() {
        return {document_format: {name: 'gramlot_commands', version: '1.0'},
            groups: Object.fromEntries([...this.#groups].map(([name, {metadata, commands}]) =>
                [name, {...metadata, commands: Object.fromEntries(commands)}]))};
    }
}
