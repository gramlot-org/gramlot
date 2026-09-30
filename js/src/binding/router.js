/**
 * Data routing of one Gramlot page (source plan §4.5).
 *
 * The router receives every event of Builder's Data wrapper through the one
 * subscription of BindingRuntime, strips the first segment `_root_` and
 * delivers the event to the registrations its path reaches, through a trie
 * by segment: the work of one event does not depend on the unconnected
 * branches.
 */

// Builder's content node under the Data wrapper (`_dataroot` → `_root_`).
const DATA_ROOT = '_root_';

/** One trie level: the registrations of one path and the next segments. */
class RouteNode {
    constructor(parent = null, segment = null) {
        this.parent = parent;
        this.segment = segment;
        this.children = new Map();
        this.registrations = new Set();
    }
}

/** One registered path: `path` without `_root_`, `attr` for a `?attr` pointer. */
export class DataRegistration {
    #router;
    #path;
    #attr;
    #recipient;
    #order;
    #active = true;

    constructor(router, {path, attr, recipient, order}) {
        this.#router = router;
        this.#path = path;
        this.#attr = attr;
        this.#recipient = recipient;
        this.#order = order;
    }

    get router() { return this.#router; }
    get path() { return this.#path; }
    get attr() { return this.#attr; }
    get recipient() { return this.#recipient; }
    get active() { return this.#active; }
    /** Registration order, which is also the delivery order of one event. */
    get order() { return this.#order; }

    /** Stop receiving; a second call does nothing. */
    close() {
        if (!this.active) return;
        this.#active = false;
        this.router.unregister(this);
    }
}

/** The object delivered to a recipient. */
export class DataChange {
    constructor({evt, node, path, oldvalue, attrsDiff, reason, fired, level, registration}) {
        this.evt = evt;
        this.node = node;
        this.path = path;
        this.oldvalue = oldvalue;
        this.attrsDiff = attrsDiff;
        this.reason = reason;
        this.fired = fired;
        this.level = level;
        this.registration = registration;
    }
}

export class DataRouter {
    #runtime;
    #root = new RouteNode();
    #routes = new Map();
    #size = 0;
    #order = 0;

    constructor(runtime) {
        this.#runtime = runtime;
    }

    get runtime() { return this.#runtime; }
    /** Active registrations. */
    get size() { return this.#size; }

    /** Register `recipient` on the absolute Data `path` (without `_root_`), optionally on its attribute `attr`. */
    register({path, attr = null, recipient}) {
        if (typeof path !== 'string' || path === '') throw new TypeError(`A Data registration requires a path: ${path}`);
        let route = this.#root;
        for (const segment of path.split('.')) {
            let next = route.children.get(segment);
            if (!next) {
                next = new RouteNode(route, segment);
                route.children.set(segment, next);
            }
            route = next;
        }
        this.#order += 1;
        const registration = new DataRegistration(this, {path, attr, recipient, order: this.#order});
        route.registrations.add(registration);
        this.#routes.set(registration, route);
        this.#size += 1;
        return registration;
    }

    /** Remove a registration from the trie; called by DataRegistration.close. */
    unregister(registration) {
        let route = this.#routes.get(registration);
        if (!route) return;
        this.#routes.delete(registration);
        route.registrations.delete(registration);
        this.#size -= 1;
        while (route.parent && !route.children.size && !route.registrations.size) {
            route.parent.children.delete(route.segment);
            route = route.parent;
        }
    }

    /**
     * Deliver one event of Builder's Data wrapper. `ins` and `del` carry the parent path, the
     * other events the node path; a `del` from `clear()` carries an array of nodes. An event
     * outside `_root_` and an `autocreate` insertion are ignored.
     */
    deliver(event) {
        const {pathlist} = event;
        if (!pathlist?.length || pathlist[0] !== DATA_ROOT) return;
        if (event.reason === 'autocreate') return;
        const base = pathlist.slice(1);
        const container = event.evt === 'ins' || event.evt === 'del';
        for (const node of Array.isArray(event.node) ? event.node : [event.node]) {
            const segments = container ? [...base, node.label] : base;
            const path = segments.join('.');
            // Candidates are copied before any delivery; a registration closed meanwhile receives nothing.
            for (const [registration, level] of this.#candidates(segments, event)) {
                if (!registration.active) continue;
                registration.recipient.receive(new DataChange({
                    evt: event.evt, node, path, oldvalue: event.oldvalue ?? null,
                    attrsDiff: event.attrs_diff ?? null, reason: event.reason ?? null,
                    fired: event.fired ?? false, level, registration,
                }));
            }
        }
    }

    /** `[registration, level]` pairs reached by an event on `segments`, in registration order. */
    #candidates(segments, event) {
        const found = [];
        let route = this.#root;
        for (const segment of segments) {
            for (const registration of route.registrations) {
                if (route !== this.#root && this.#accepts(registration, 'child', event)) found.push([registration, 'child']);
            }
            route = route.children.get(segment);
            if (!route) return found.sort(([a], [b]) => a.order - b.order);
        }
        for (const registration of route.registrations) {
            if (this.#accepts(registration, 'node', event)) found.push([registration, 'node']);
        }
        const below = [...route.children.values()];
        while (below.length) {
            const next = below.pop();
            for (const registration of next.registrations) {
                if (this.#accepts(registration, 'container', event)) found.push([registration, 'container']);
            }
            below.push(...next.children.values());
        }
        return found.sort(([a], [b]) => a.order - b.order);
    }

    /**
     * Whether an event reaches a registration at `level` (node: same path; container: the
     * registered path is below the event path; child: the event path is below it).
     * A value registration receives the value events; an attribute-only `upd_attrs` reaches
     * only the `?attr` registrations of that attribute; a fired event at level child is not
     * delivered. A `?attr` registration also receives the events that insert or delete its
     * node, and those that replace, delete or insert an ancestor (R14).
     */
    #accepts(registration, level, event) {
        const {evt} = event;
        if (registration.attr === null) {
            if (evt === 'upd_attrs') return false;
            return !(level === 'child' && event.fired);
        }
        if (level === 'child') return false;
        if (level === 'container') return evt !== 'upd_attrs';
        if (evt === 'ins' || evt === 'del') return true;
        return Object.hasOwn(event.attrs_diff ?? {}, registration.attr);
    }
}
