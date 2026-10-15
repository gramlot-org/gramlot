/** Temporary document-root CSS variable previews owned by one inspector session. */
export class InspectorStyles {
    #document;
    #element = null;
    #rule = null;

    constructor(document) { this.#document = document; }

    snapshot() {
        const computed = this.#document.defaultView.getComputedStyle(this.#document.documentElement);
        const names = new Set();
        for (let index = 0; index < computed.length; index++) {
            const name = computed.item(index);
            if (name.startsWith('--gramlot-')) names.add(name);
        }
        // Keep edited variables resettable even when their value is invalid at computed time.
        for (let index = 0; index < (this.#rule?.style.length ?? 0); index++) names.add(this.#rule.style.item(index));
        return [...names].sort((left, right) => left.localeCompare(right, 'en', {numeric: true})).map(name => ({name, value: computed.getPropertyValue(name).trim(),
            override: this.#rule?.style.getPropertyValue(name) ?? ''}));
    }

    set(name, value) {
        if (typeof name !== 'string' || !this.snapshot().some(row => row.name === name)) {
            throw new Error('Choose an existing --gramlot-* variable on the document root');
        }
        if (typeof value !== 'string' || !value.trim() || !this.#document.defaultView.CSS.supports(name, value)) {
            throw new Error('Enter a valid CSS variable value');
        }
        if (!this.#element) {
            // This sheet is tool-owned browser machinery, separate from application Source.
            // Removing it reveals the current cascade, without restoring stale page values.
            const element = this.#document.createElement('style');
            this.#document.head.append(element);
            if (!element.sheet) {
                element.remove();
                throw new Error('The page does not allow the inspector preview stylesheet');
            }
            element.sheet.insertRule(':root {}', 0);
            this.#element = element;
            this.#rule = element.sheet.cssRules[0];
        }
        this.#rule.style.setProperty(name, value, 'important');
    }

    reset(name) {
        if (typeof name !== 'string' || !name.startsWith('--gramlot-')) throw new Error('Invalid CSS variable name');
        this.#rule?.style.removeProperty(name);
        if (this.#rule?.style.length === 0) this.dispose();
    }

    dispose() {
        this.#element?.remove();
        this.#element = null;
        this.#rule = null;
    }
}
