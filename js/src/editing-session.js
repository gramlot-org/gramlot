/* @ts-self-types="./editing-session.d.ts" */
import {Bag} from '@genrojs/bag';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {ValidationRun} from './validation-run.js';
import {validationContext} from './binding/validation-context.js';

// TYTX is the existing typed snapshot format (dates, Decimal and nested Bags included).
const copy = value => fromTytx(toTytx(value));
const same = (a, b) => toTytx(a) === toTytx(b);
const fieldPath = node => node.absDatapath(node.getAttr('value'));
const encoded = path => encodeURIComponent(path).replaceAll('.', '%2E');
const key = node => encoded(fieldPath(node));
const contribution = (node, kind) => encoded(node.fullpath) + ":" + kind;

/** Source-owned local editing lifecycle shared by forms and grids. Logic and DOM never own the registers. */
export class EditingSession {
    constructor(node, runtime, path = node.absDatapath('.')) {
        this.node = node;
        this.runtime = runtime;
        this.registers = new Bag();
        this.validationQueue = new Set();
        this.fields = new Map(); // mounted presentations only
        this.validations = new Map(); // semantic fields, independent of their views
        this.disposed = false;
        this.scheduled = false;
        this.writing = 0;
        this.path = path;
        this.retainedFields = new Map();
        this.listeners = new Set();
        this.navigators = new Set();
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
        for (const name of ['errors','pending','drafts']) this.registers.setItem(name,new Bag());
        this.path = path;
        this.subscription = this.runtime.router.register({path, recipient:this, subtree:true});
        this.updateChanges();
        for (const adapter of this.fields.values()) {
            adapter.element.cancelValidation();
            this.clearDraft(adapter.node);
            this.scheduleValidation(adapter);
        }
    }
    get data() { return this.runtime.gramlot.data.getItem(this.path); }
    subscribe(listener) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
    /** Read-only reports derived from the canonical registers, never a second journal. */
    get errorEntries() {
        return this.registers.getItem('errors').getNodes().map(node => ({
            path:decodeURIComponent(node.label),
            message:node.value.getNodes().map(part => part.value).join('\n')
        }));
    }
    get changeEntries() {
        const entries = [];
        for (const node of this.registers.getItem('changes').getNodes()) {
            const change = node.value;
            const path = [this.path,change.getItem('path')].filter(Boolean).join('.');
            const existed = change.getItem('existed'), exists = change.getItem('exists');
            const previous = change.getItem('previous'), current = change.getItem('current');
            if (!existed || !exists || !same(previous,current)) entries.push({path,previous,current,existed,exists});
            if (existed && exists) {
                const before = change.getItem('previousAttributes'), after = change.getItem('currentAttributes');
                for (const attr of new Set([...before.getNodes(),...after.getNodes()].map(node => node.label))) {
                    const had = before.getNode(attr) !== null, has = after.getNode(attr) !== null;
                    if (had !== has || !same(before.getItem(attr),after.getItem(attr))) entries.push({
                        path:path+'?'+attr, previous:before.getItem(attr), current:after.getItem(attr), existed:had, exists:has
                    });
                }
            }
        }
        return entries;
    }
    registerNavigator(navigator) {
        this.navigators.add(navigator);
        return () => this.navigators.delete(navigator);
    }
    focusField(path) {
        if (this.disposed) return false;
        for (const adapter of this.fields.values()) {
            if (fieldPath(adapter.node) === path && adapter.element.isConnected) {
                adapter.element.control.focus();
                return true;
            }
        }
        for (const navigate of this.navigators) if (navigate(path)) return true;
        return false;
    }
    retainField(path) { this.retainedFields.set(path, (this.retainedFields.get(path) ?? 0) + 1); }
    releaseField(path) {
        const count = this.retainedFields.get(path);
        if (count > 1) { this.retainedFields.set(path, count - 1); return; }
        this.retainedFields.delete(path);
        if ([...this.validations.values()].some(field => field.path === path)) return;
        for (const name of ['errors', 'pending', 'drafts']) {
            const bag = this.registers.getItem(name), label = encoded(path);
            if (bag.getNode(label)) bag.popNode(label);
        }
        this.notify();
    }
    fieldStatus(path) {
        const label = encoded(path);
        return {error:this.registers.getItem('errors').getItem(label),
            pending:this.registers.getItem('pending').getItem(label),
            draft:this.registers.getItem('drafts').getItem(label)};
    }
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
        let field = this.validations.get(node);
        if (!field) {
            field = {node, binding:adapter.binding, context:validationContext(adapter.binding), run:new ValidationRun(),
                execute:adapter.element.validationExecutor, checkValue:adapter.element.validationValueCheck(), path:fieldPath(node), rules:null, value:undefined, target:null, result:null, selection:adapter.element.validationSelection()};
            this.validations.set(node,field);
            adapter.binding.editingSession = this;
            field.release = adapter.binding.track(() => this.forgetField(node));
            this.refreshField(node);
        }
        this.schedule(() => {
            if (this.fields.get(node) !== adapter) return;
            const draft = this.registers.getItem('drafts').getNode(key(node));
            if (draft) { node.formDraft = draft.value; adapter.element.restoreFormDraft(draft.value); }
            if (field.result) adapter.element.presentValidation(field.result);
            const errors = this.registers.getItem('errors').getItem(key(node));
            if (errors) adapter.element.error(errors.getNodes().map(n => n.value).join('\n'));
            adapter.element.setFieldState({invalid:Boolean(errors), pending:Boolean(this.fieldStatus(field.path).pending)});
        });
        return () => { this.fields.delete(node); };
    }
    forgetField(node) {
        const field = this.validations.get(node);
        if (!field) return;
        field.run.cancel(); field.release();
        if (field.binding.editingSession === this) field.binding.editingSession = null;
        this.validations.delete(node); this.validationQueue.delete(node);
        for (const name of ['errors','pending']) {
            const parts = this.registers.getItem(name).getItem(encoded(field.path));
            if (parts) {
                for (const part of [...parts.getNodes()]) if (part.label.startsWith(encoded(node.fullpath) + ':')) parts.popNode(part.label);
                if (!parts.length) this.registers.getItem(name).popNode(encoded(field.path));
            }
        }
        if (![...this.validations.values()].some(other => other.path === field.path)) {
            const drafts = this.registers.getItem('drafts');
            if (drafts.getNode(encoded(field.path))) drafts.popNode(encoded(field.path));
        }
        delete node.formDraft;
        this.notify();
    }
    refreshField(node) {
        const field = this.validations.get(node);
        if (!field || this.disposed || this.writing) return;
        const [, attrs] = node.rootBuilder.runtimeValues(node);
        const resolved = this.runtime.renderer.evaluateExpressions(node,attrs);
        const rules = Object.fromEntries(Object.entries(resolved).filter(([name]) => name.startsWith('validate_')));
        const path = fieldPath(node), target = this.runtime.gramlot.data.getNode(path.split('?')[0]);
        const value = node.getRelativeData(node.getAttr('value'));
        const dataChanged = field.path !== path || field.target !== target || !same(field.value,value);
        if (!dataChanged && same(field.rules,rules)) return;
        this.cancelValidation(node);
        if (field.path !== path) {
            for (const name of ['errors','pending','drafts']) {
                const bag = this.registers.getItem(name);
                if (bag.getNode(encoded(field.path))) bag.popNode(encoded(field.path));
            }
        }
        Object.assign(field,{path,target,value,rules,result:null});
        if (dataChanged) this.clearDraft(node);
        this.scheduleField(node);
    }
    cancelValidation(node) {
        this.validations.get(node)?.run.cancel();
        this.validationQueue.delete(node);
        this.pendingPart(node,'validation',null);
    }
    writeCandidate(node,value) {
        this.clearDraft(node);
        this.writing++;
        try { this.runtime.renderer.html.writeParameter(node,'value',value); }
        finally { this.writing--; }
        const field = this.validations.get(node);
        if (field) {
            field.value = node.getRelativeData(node.getAttr('value'));
            field.target = this.runtime.gramlot.data.getNode(field.path.split('?')[0]);
        }
        for (const other of this.validations.keys()) if (other !== node) this.refreshField(other);
    }
    validateCandidate(node,value,selection) {
        this.cancelValidation(node);
        this.writeCandidate(node,value);
        const field = this.validations.get(node);
        field.selection = selection;
        return this.validateField(node,false);
    }
    scheduleField(node) {
        if (this.disposed || !this.validations.has(node) || this.validationQueue.has(node)) return;
        if (this.registers.getItem('drafts').getNode(key(node))) return;
        this.validationQueue.add(node);
        this.pendingPart(node,'validation','scheduled');
        this.schedule(() => { if (this.validationQueue.delete(node)) this.validateField(node); });
    }
    scheduleValidation(adapter) {
        this.refreshField(adapter.node);
        const field = this.validations.get(adapter.node);
        if (field && !field.result && !field.run.controller) this.scheduleField(adapter.node);
    }
    validateField(node, refreshSelection = true) {
        const field = this.validations.get(node);
        if (!field || this.disposed || field.binding.closed) return;
        this.validationQueue.delete(node);
        if (this.registers.getItem('drafts').getNode(key(node))) return;
        if (this.registers.getItem('pending').getItem(key(node))?.getItem(contribution(node,'selection'))) return;
        const value = node.getRelativeData(node.getAttr('value'));
        const adapter = this.fields.get(node);
        if (refreshSelection && adapter) field.selection = adapter.element.validationSelection();
        const selection = field.selection;
        const target = field.target;
        const current = field.context.validationCurrent();
        return field.run.start(value,field.rules,{...field.context,
            validationCurrent:() => () => !this.disposed && current() && this.validations.get(node) === field
                && this.runtime.gramlot.data.getNode(field.path.split('?')[0]) === target,
            selection
        },field.execute,outcome => {
            if (outcome.ok) {
                try { field.checkValue(outcome.value,value); }
                catch (error) { outcome.ok = false; outcome.result.error = error.message; }
            }
            this.result(node,outcome.result);
            field.result = outcome.result;
            if (outcome.ok) this.writeCandidate(node,outcome.value);
            const mounted = this.fields.get(node);
            if (mounted) mounted.element.presentValidation(outcome.result);
            field.context.finishValidation(outcome);
        },() => {
            this.pendingPart(node,'validation','active');
            this.fields.get(node)?.element.setFieldState({pending:true});
        });
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
        this.cancelValidation(node);
        node.formDraft = text;
        this.set('drafts',node,text);
    }
    clearDraft(node) {
        delete node.formDraft;
        this.set('drafts',node,null);
        this.issue(node,'parse',null);
    }
    result(node, result) {
        this.pendingPart(node,'validation',null);
        this.issue(node,'validation',result.error || null);
    }
    part(register, node, kind, value) {
        kind = contribution(node,kind);
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
    schedule(callback) {
        queueMicrotask(() => { if (!this.disposed) callback(); });
    }
    receive(change) {
        if (this.disposed) return;
        this.updateChanges(change.path);
        if (this.writing) return;
        for (const node of this.validations.keys()) this.refreshField(node);
    }

    updateChanges(changedPath = null) {
        const changes = this.registers.getItem('changes');
        const relative = changedPath === this.path ? '' : changedPath?.startsWith(this.path + '.')
            ? changedPath.slice(this.path.length + 1).split('?')[0] : '';
        const visit = (a, b, path) => {
            if (a && b && a.value instanceof Bag && b.value instanceof Bag && same(a.attr,b.attr)) {
                const labels = new Set([...a.value.getNodes(), ...b.value.getNodes()].map(n => n.label));
                for (const label of labels) visit(a.value.getNode(label), b.value.getNode(label), path ? path + '.' + label : label);
            } else if (!a || !b || !same([a.value,a.attr],[b.value,b.attr])) {
                changes.setItem(encoded(path), new Bag({path, existed:Boolean(a), exists:Boolean(b),
                    previous:a ? copy(a.value) : null, current:b ? copy(b.value) : null,
                    previousAttributes:a ? copy(a.attr) : null, currentAttributes:b ? copy(b.attr) : null}));
            }
        };
        const baseline = this.registers.getItem('baseline');
        // Preserve an existing changed ancestor (insert, delete or attributes).
        // Reconcile only this affected subtree, never unrelated resident rows.
        let path = relative;
        for (const entry of changes.getNodes()) {
            const ancestor = entry.value.getItem('path');
            if (path.startsWith(ancestor + '.')) path = ancestor;
        }
        let ancestor = path;
        while (ancestor.includes('.')) {
            ancestor = ancestor.slice(0,ancestor.lastIndexOf('.'));
            const before = baseline.getNode(ancestor), after = this.data.getNode(ancestor);
            if (!before || !after || !same(before.attr,after.attr)) path = ancestor;
        }
        for (const entry of [...changes.getNodes()]) {
            const current = entry.value.getItem('path');
            if (!path || current === path || current.startsWith(path + '.')) changes.popNode(entry.label);
        }
        if (path) visit(baseline.getNode(path), this.data.getNode(path), path);
        else visit({value:baseline,attr:{}}, {value:this.data,attr:{}}, '');
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
            }
            for (const listener of this.listeners) listener(); });
    }
    commitField(path) {
        for (const adapter of this.fields.values()) {
            if (fieldPath(adapter.node) === path && Object.hasOwn(adapter.node,'formDraft')) adapter.commit();
        }
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
    load(data) {
        if (!(data instanceof Bag)) throw new TypeError('Editing load requires a Bag.');
        if (this.disposed) return;
        this.registers.setItem('baseline',copy(data));
        this.restore();
    }
    restore() {
        if (this.disposed) return;
        for (const node of this.validations.keys()) this.cancelValidation(node);
        for (const adapter of this.fields.values()) {
            adapter.element.cancelValidation();
            this.clearDraft(adapter.node);
            adapter.element.restoreFormValue(this.registers.getItem('baseline').getItem(
                adapter.node.absDatapath(adapter.node.getAttr('value')).slice(this.path ? this.path.length + 1 : 0)));
        }
        this.runtime.gramlot.data.setItem(this.path,copy(this.registers.getItem('baseline')));
        for (const name of ['errors','pending','drafts']) this.registers.setItem(name,new Bag());
        this.updateChanges();
        for (const node of this.validations.keys()) this.scheduleField(node);
    }
    dispose() {
        if (this.disposed) return;
        this.disposed = true;
        this.subscription.close();
        for (const node of this.validations.keys()) this.forgetField(node);
        this.fields.clear();
        this.validationQueue.clear();
        this.retainedFields.clear();
        this.listeners.clear();
        this.navigators.clear();
    }
}
