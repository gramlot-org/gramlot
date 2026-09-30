import {SourceBag, SourceBagNode} from '@jsr/genro__builders';
import {getSubtypeDict, setSubtypeDict} from '@jsr/genro__tytx';

/**
 * Gramlot Source node: Builder's SourceBagNode plus the Data behavior Builder lacks.
 *
 * SET and GET remain Builder's and go through setRelativeData and getRelativeData, which apply
 * the null path rule (Q7): a read gives null, a write is an error. FIRE writes through
 * setRelativeData too, with the Gramlot reset rules.
 */
export class GramlotBuilderBagNode extends SourceBagNode {
    // Attributes ending in `_path` whose pointer symbol was already reported.
    #reportedPathPointers = new Set();

    /** Builder's pointerType, except that a string starting with `==` is not a pointer. */
    pointerType(v) {
        if (typeof v === 'string' && v.startsWith('==')) return null;
        return super.pointerType(v);
    }

    /** Builder's `^` pointers, except the attributes ending in `_path`, which hold a bare path. */
    pointers() {
        return super.pointers().filter(([name, pointer]) => !this.#isPathAttribute(name, pointer));
    }

    /**
     * Builder's items to resolve, with the Gramlot rules applied before Builder's runtimeValues:
     * an attribute ending in `_path` loses its pointer symbol; a pointer on a null path (Q7)
     * is resolved as null.
     */
    runtimeToEvaluate() {
        const items = super.runtimeToEvaluate();
        for (const [name, value] of items) {
            if (!this.pointerType(value)) continue;
            if (this.#isPathAttribute(name, value)) items.set(name, value.slice(1));
            else if (this.absDatapath(value) === null) items.set(name, null);
        }
        return items;
    }

    /**
     * The value of the attribute `name`; for an attribute ending in `_path` written as a pointer, the
     * bare path, with the one warning per declaration of the `_path` rule (the same check as
     * runtimeToEvaluate).
     */
    pathAttribute(name) {
        const value = this.getAttr(name);
        return this.pointerType(value) && this.#isPathAttribute(name, value) ? value.slice(1) : value;
    }

    /** Builder's read; null on a null path (Q7). */
    getRelativeData(path, defaultValue = null, options = {}) {
        if (this.absDatapath(path) === null) return null;
        return super.getRelativeData(path, defaultValue, options);
    }

    /** Builder's write; an error on a null path (Q7). */
    setRelativeData(path, value, options = {}) {
        this.#requireWritablePath(path);
        super.setRelativeData(path, value, options);
    }

    /** Write without any Data event (Bag doTrigger=false); an error on a null path (Q7). */
    PUT(path, value) {
        this.#requireWritablePath(path);
        this.data.setItem(this.absDatapath(path), value, null, '>', false, true, this, false, false);
    }

    /**
     * A fired write that always fires (Q8): the current value is reset to null silently, then written
     * with `fired`; a null value writes `true` (D4). The value is reset to null in a `finally`, also
     * when a recipient raises, and the error propagates (P12, R10). A `?attr` path fires the
     * attribute with the same rules and leaves the node value alone, as legacy `fireEvent`.
     * `attributes` are written on the Data node with the fired value, as legacy `setRelativeData`
     * with `fired` (a button's `fire` writes `modifier` and `_counter`, S12); they stay after the reset.
     */
    FIRE(path, value = true, attributes = null) {
        if (value === null) value = true;
        this.#requireWritablePath(path);
        const absolute = this.absDatapath(path);
        if (absolute.includes('?')) {
            this.#fireAttribute(absolute, value);
            return;
        }
        this.data.getNode(absolute)?.setValue(null, false);
        try {
            this.fireEvent(path, value, {attributes});
        } finally {
            this.data.getNode(absolute)?.setValue(null, false);
        }
    }

    /**
     * FIRE of the attribute `attr` of `target?attr`: silent reset of the attribute, the write of the
     * attribute alone with `fired` (the node value is kept; a missing node is created with null), then
     * the silent reset to null in a `finally`.
     */
    #fireAttribute(absolute, value) {
        const [target, attr] = absolute.split('?', 2);
        const data = this.data;
        data.getNode(target)?.setAttr({[attr]: null}, false);
        try {
            const existing = data.getNode(target);
            if (existing) existing.setValue(existing.staticValue, true, {[attr]: value}, true, true, true, true);
            else data.setItem(target, null, {[attr]: value}, '>', true, true, true, true);
        } finally {
            data.getNode(target)?.setAttr({[attr]: null}, false);
        }
    }

    /**
     * FIRE after `delay` ms. A null path (Q7) is an error at the call, not inside the timer. The timer
     * is tracked on the node's NodeBinding when the node has one, so the close of the node cancels it;
     * the returned function cancels it as well.
     */
    FIRE_AFTER(path, value = true, delay = 10) {
        this.#requireWritablePath(path);
        const binding = this.rootBuilder?.binding?.bindingFor(this) ?? null;
        let release = null;
        const timer = setTimeout(() => {
            release?.();
            this.FIRE(path, value);
        }, delay);
        release = binding?.track(() => clearTimeout(timer)) ?? null;
        return () => {
            clearTimeout(timer);
            release?.();
        };
    }

    /** Builder's absDatapath, keeping `?attr` on symbolic paths. */
    absDatapath(path) {
        const bare = this.pointerType(path) ? path.slice(1) : path;
        if (bare.startsWith('#') && bare.includes('?')) {
            const [target, attr] = bare.split('?', 2);
            const resolved = super.absDatapath(target);
            return resolved === null ? null : `${resolved}?${attr}`;
        }
        return super.absDatapath(path);
    }

    /**
     * Builder's datapath climb, reading a pointer datapath from Data (variable datapath).
     * A datapath that makes the path symbolic (`#<id>`, `#FORM`, `#ANCHOR`), written or read
     * from Data, is resolved from the parent of the node that carries it.
     */
    _composeRelativeDatapath(path, raw) {
        let current = this;
        while (current !== null && path.startsWith('.')) {
            let datapath = current.getAttr('datapath');
            if (this.pointerType(datapath)) {
                datapath = this.#variableDatapath(current, datapath);
                if (datapath === null) return null;
            }
            if (datapath !== null && datapath !== undefined) {
                path = path === '.' ? datapath : datapath + path;
            }
            if (path.startsWith('#')) return current.parentNode._resolveSymbolicDatapath(path, raw);
            current = current.parentNode;
        }
        if (path.startsWith('.')) {
            throw new Error(`unresolved relative datapath: ${raw}`);
        }
        return path;
    }

    /** An empty variable datapath gives a null path. */
    _finalizeAbsPath(path, attr) {
        return path === null ? null : super._finalizeAbsPath(path, attr);
    }

    /** Builder's symbolic resolution; `#<node_id>` reads the node_id map of the page runtime when there is one (R06). */
    _resolveSymbolicDatapath(path, raw) {
        const symbol = path.slice(1).split('.', 1)[0];
        if (symbol === 'FORM' || symbol === 'ANCHOR') return super._resolveSymbolicDatapath(path, raw);
        const runtime = this.rootBuilder?.binding;
        if (!runtime) return super._resolveSymbolicDatapath(path, raw);
        const anchor = runtime.nodeIds.get(symbol);
        if (!anchor) throw new Error(`#<id>: cannot resolve ${raw}`);
        const relpath = path.slice(symbol.length + 2);
        return anchor.absDatapath(relpath ? `.${relpath}` : '.');
    }

    /**
     * The datapath read from Data for a pointer datapath, or null when empty. The pointer is read in
     * the context of the carrier's parent; the value counts as if written in place of the pointer.
     */
    #variableDatapath(carrier, pointer) {
        const path = carrier.parentNode.absDatapath(pointer);
        if (path === null) return null;
        const value = this.data.getItem(path);
        return value === null || value === undefined || value === '' ? null : value;
    }

    /** Whether `name` ends in `_path`; a pointer there loses its symbol, with one warning per attribute. */
    #isPathAttribute(name, value) {
        if (typeof name !== 'string' || !name.endsWith('_path')) return false;
        if (!this.#reportedPathPointers.has(name)) {
            this.#reportedPathPointers.add(name);
            console.warn(`${this.nodeTag} '${this.label}': '${name}' holds a bare Data path; `
                + `the pointer symbol of '${value}' is removed`);
        }
        return true;
    }

    /** A write on a null path (Q7) is an error naming the node and the path. */
    #requireWritablePath(path) {
        if (this.absDatapath(path) === null) {
            throw new Error(`${this.nodeTag} '${this.label}': write on a null path: '${path}'`);
        }
    }
}

/** Gramlot Source Bag: every node it creates is a GramlotBuilderBagNode. */
export class GramlotBuilderBag extends SourceBag {
    get nodeClass() {
        return GramlotBuilderBagNode;
    }
}

// GramlotBuilderBag travels on the TYTX wire as "::X" with __cls "GramlotBuilderBag":
// its name joins the subtype dictionary of its type, as Builder does for SourceBag.
// The name already owned by another class is a collision.
if ((getSubtypeDict(GramlotBuilderBag.tytxSuffix).GramlotBuilderBag ?? GramlotBuilderBag) !== GramlotBuilderBag) {
    throw new Error("TYTX subtype name 'GramlotBuilderBag' is already registered for another class");
}
setSubtypeDict(GramlotBuilderBag.tytxSuffix, {...getSubtypeDict(GramlotBuilderBag.tytxSuffix), GramlotBuilderBag});
