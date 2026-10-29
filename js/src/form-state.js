/* @ts-self-types="./form-state.d.ts" */
import {Bag} from '@genrojs/bag';
import {fromTytx, toTytx} from '@genrojs/tytx';

// TYTX is the existing typed snapshot format (dates, Decimal and nested Bags included).
const copy = value => fromTytx(toTytx(value));
const same = (a, b) => toTytx(a) === toTytx(b);
const key = node => encodeURIComponent(node.fullpath).replaceAll('.', '%2E');

/** Source-owned local form lifecycle. Logic and DOM never own the registers. */
export class FormState {
    constructor(node, runtime) {
        this.node = node;
        this.runtime = runtime;
        this.registers = new Bag();
        this.validationQueue = new Set();
        this.fields = new Map(); // mounted control resources, not application values
        this.disposed = false;
        this.scheduled = false;
        this.writing = 0;
        this.path = node.absDatapath('.');
        if (!(this.data instanceof Bag)) throw new TypeError('A form requires a Bag at its datapath.');
        this.registers.setItem('baseline', copy(this.data));
        for (const name of ['changes', 'errors', 'pending', 'drafts']) this.registers.setItem(name, new Bag());
        this.subscription = runtime.router.register({path:this.path, recipient:this, subtree:true});
        runtime.bindingFor(node).track(() => this.dispose());
    }
    rebind() {
        const path = this.node.absDatapath('.');
        if (path === this.path) return;
        if (!(this.data instanceof Bag)) throw new TypeError('A form requires a Bag at its datapath.');
        this.subscription.close();
        this.path = path;
        this.subscription = this.runtime.router.register({path, recipient:this, subtree:true});
        this.updateChanges();
        for (const adapter of this.fields.values()) {
            adapter.element.cancelValidation();
            this.clearDraft(adapter.node);
            this.scheduleValidation(adapter);
        }
    }
    get data() { return this.node.getRelativeData('.'); }
    get status() {
        const dirty = this.registers.getItem('changes').length > 0;
        const pending = this.registers.getItem('pending').length > 0;
        const invalid = this.registers.getItem('errors').length > 0;
        const incomplete = this.registers.getItem('drafts').length > 0;
        return {dirty, pending, valid:!invalid && !incomplete, canSave:dirty && !invalid && !incomplete && !pending,
            status:invalid ? 'error' : pending || incomplete ? 'pending' : dirty ? 'changed' : 'ok'};
    }
    register(adapter) {
        const node = adapter.node;
        this.fields.set(node, adapter);
        this.scheduleValidation(adapter);
        return () => {
            this.fields.delete(node);
            for (const name of ['errors','pending','drafts']) this.remove(name,node);
            delete node.formDraft;
            this.notify();
        };
    }
    remove(name, node) {
        const bag = this.registers.getItem(name), label = key(node);
        if (bag.getNode(label)) bag.popNode(label);
    }
    set(name, node, value) {
        if (value == null) this.remove(name,node);
        else this.registers.getItem(name).setItem(key(node), value);
        this.notify();
    }
    draft(node, text) {
        node.formDraft = text;
        this.set('drafts',node,text);
    }
    clearDraft(node) {
        delete node.formDraft;
        this.set('drafts',node,null);
        this.issue(node,'parse',null);
    }
    candidate(adapter, value) {
        this.clearDraft(adapter.node);
        this.writing++;
        try { adapter.commitFormValue(value); }
        finally { this.writing--; }
    }
    result(node, result) {
        this.pendingPart(node,'validation',null);
        this.issue(node,'validation',result.error || null);
    }
    part(register, node, kind, value) {
        const bag = this.registers.getItem(register), label = key(node);
        let row = bag.getItem(label);
        if (!row && value != null) { row = new Bag(); bag.setItem(label,row); }
        if (row) {
            if (value == null) { if (row.getNode(kind)) row.popNode(kind); }
            else row.setItem(kind,value);
            if (!row.length) this.remove(register,node);
        }
        this.notify();
    }
    issue(node, kind, message) { this.part('errors',node,kind,message || null); }
    pendingPart(node, kind, value) { this.part('pending',node,kind,value); }
    parseError(node, message) { this.issue(node,'parse',message); }
    pending(adapter, active) {
        const bag = this.registers.getItem('pending'), node = adapter.node;
        if (active) this.pendingPart(node,'validation','active');
        else if (bag.getItem(key(node) + '.validation') === 'active') this.pendingPart(node,'validation','cancelled');
    }
    scheduleValidation(adapter) {
        if (this.disposed || !this.fields.has(adapter.node)) return;
        if (this.validationQueue.has(adapter)) return;
        this.validationQueue.add(adapter);
        this.pendingPart(adapter.node,'validation','scheduled');
        this.schedule(() => { this.validationQueue.delete(adapter); this.validate(adapter); });
    }
    validate(adapter) {
        if (this.disposed || !this.fields.has(adapter.node) || adapter.binding.closed) return;
        if (Object.hasOwn(adapter.node,'formDraft')) { this.pendingPart(adapter.node,'validation',null); return; }
        if (!adapter.element.isConnected) return;
        if (this.registers.getItem('pending').getItem(key(adapter.node) + '.selection')) return;
        // Validation uses the existing field engine, epoch, callbacks and cancellation.
        adapter.validateForm();
    }
    schedule(callback) {
        queueMicrotask(() => { if (!this.disposed) callback(); });
    }
    receive(change) {
        if (this.disposed) return;
        this.updateChanges();
        if (this.writing) return;
        for (const adapter of this.fields.values()) {
            const path = adapter.node.absDatapath(adapter.node.getAttr('value'));
            if (change.path === path || path.startsWith(change.path + '.')) {
                this.clearDraft(adapter.node);
                this.scheduleValidation(adapter);
            }
        }
    }
    updateChanges() {
        const changes = new Bag();
        const visit = (before, after, prefix = '') => {
            const labels = new Set([...before.getNodes(), ...after.getNodes()].map(node => node.label));
            for (const label of labels) {
                const a = before.getNode(label), b = after.getNode(label), path = prefix + label;
                if (a && b && a.value instanceof Bag && b.value instanceof Bag && same(a.attr,b.attr)) {
                    visit(a.value,b.value,path + '.');
                } else if (!a || !b || !same([a.value,a.attr],[b.value,b.attr])) {
                    changes.setItem(encodeURIComponent(path).replaceAll('.', '%2E'), new Bag({path,
                        existed:Boolean(a), exists:Boolean(b), previous:a ? copy(a.value) : null,
                        current:b ? copy(b.value) : null}));
                }
            }
        };
        visit(this.registers.getItem('baseline'),this.data);
        this.registers.setItem('changes',changes);
        this.notify();
    }
    notify() {
        if (this.disposed || this.scheduled) return;
        this.scheduled = true;
        this.schedule(() => { this.scheduled = false; const status = this.status;
            const previous = this.registers.getItem('status');
            if (!previous || !same(previous,new Bag(status))) {
                this.registers.setItem('status',new Bag(status));
                this.node.publish('formStatus',status);
            } });
    }
    /** Flush active drafts. Refuse errors/pending checks; accept only a valid local snapshot. */
    accept() {
        if (this.disposed) return false;
        for (const adapter of this.fields.values()) {
            if (Object.hasOwn(adapter.node,'formDraft')) adapter.commit();
        }
        if (!this.status.valid || this.status.pending) return false;
        this.registers.setItem('baseline',copy(this.data));
        this.updateChanges();
        return true;
    }
    restore() {
        if (this.disposed) return;
        for (const adapter of this.fields.values()) {
            adapter.element.cancelValidation();
            this.clearDraft(adapter.node);
            adapter.element.restoreFormValue(this.registers.getItem('baseline').getItem(
                adapter.node.absDatapath(adapter.node.getAttr('value')).slice(this.path ? this.path.length + 1 : 0)));
        }
        this.node.setRelativeData('.',copy(this.registers.getItem('baseline')));
        this.updateChanges();
        for (const adapter of this.fields.values()) this.scheduleValidation(adapter);
    }
    dispose() {
        if (this.disposed) return;
        this.disposed = true;
        this.subscription.close();
        this.fields.clear();
        this.validationQueue.clear();
    }
}
