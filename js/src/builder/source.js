import {SourceBag, SourceBagNode} from '@jsr/genro__builders';
import {getSubtypeDict, setSubtypeDict} from '@jsr/genro__tytx';

/**
 * Gramlot Source node: Builder's SourceBagNode plus the Data behavior Builder lacks.
 *
 * SET, GET, setRelativeData and getRelativeData remain Builder's.
 */
export class GramlotBuilderBagNode extends SourceBagNode {
    /** Builder's pointerType, except that a string starting with `==` is not a pointer. */
    pointerType(v) {
        if (typeof v === 'string' && v.startsWith('==')) return null;
        return super.pointerType(v);
    }

    /** Write without any Data event (Bag doTrigger=false). */
    PUT(path, value) {
        this.data.setItem(this.absDatapath(path), value, null, '>', false, true, this, false, false);
    }

    /** FIRE after `delay` ms; the caller owns the returned cancel function. */
    FIRE_AFTER(path, value = true, delay = 10) {
        const timer = setTimeout(() => this.FIRE(path, value), delay);
        return () => clearTimeout(timer);
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

    /** Builder's datapath climb, reading a pointer datapath from Data (variable datapath). */
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

    #variableDatapath(carrier, pointer) {
        if (pointer.slice(1).startsWith('.')) {
            throw new Error(`${carrier.nodeTag} '${carrier.label}': relative variable datapath `
                + `has no defined resolution: datapath='${pointer}'`);
        }
        const value = this.data.getItem(carrier.absDatapath(pointer));
        return value === null || value === undefined || value === '' ? null : value;
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
