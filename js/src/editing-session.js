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
        // Field Source nodes are keyed by fullpath and read again from the Source at each use (fieldNode).
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
        this.validationSources = new Set();
        this.validationDependencies = new Map();
        this.validationRevision = 0;
        this.validatedRevision = -1;
        this.fullValidation = null;
        this.derived = new Set(); // predicates of derived paths, never changes

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
        for (const [fullpath,adapter] of this.fields) {
            const node = this.fieldNode(fullpath);
            adapter.element.cancelValidation();
            this.clearDraft(node);
            this.scheduleValidation(adapter);
        }
    }
    /** The field Source node at `fullpath`, below the session's own node. A field the session uses must be there. */
    fieldNode(fullpath) {
        const base = this.node.fullpath;
        const node = fullpath.startsWith(base + '.') ? this.node.value.getNode(fullpath.slice(base.length + 1)) : null;
        if (!node) throw new Error(`Editing field ${fullpath} is missing from the Source of its session.`);
        return node;
    }
    get data() { return this.runtime.gramlot.data.getItem(this.path); }
    /**
     * Declare derived values (grid formula results, published totals): `match(path)` receives a path
     * relative to the session, `<path>?<attribute>` for an attribute. Derived values are never changes.
     * Returns the release.
     */
    registerDerived(match) {
        this.derived.add(match);
        this.updateChanges();
        // Releasing recomputes nothing: later Data events reconcile only their own subtree.
        return () => { this.derived.delete(match); };
    }
    isDerived(path) {
        for (const match of this.derived) if (match(path)) return true;
        return false;
    }
    /** The attributes of the node at `path` that are not derived. */
    ownAttributes(node, path) {
        return Object.fromEntries(Object.entries(node.attr).filter(([name]) => !this.isDerived(`${path}?${name}`)));
    }
    /** A node, possibly absent, that holds only derived values. */
    onlyDerived(node, path) {
        if (!node) return true;
        if (Object.keys(this.ownAttributes(node, path)).length) return false;
        if (node.value instanceof Bag) return node.value.getNodes().every(child => this.onlyDerived(child, path ? `${path}.${child.label}` : child.label));
        return this.isDerived(path);
    }
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
        for (const [fullpath,adapter] of this.fields) {
            if (fieldPath(this.fieldNode(fullpath)) === path && adapter.element.isConnected) {
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
        const pending = this.fullValidation !== null || this.registers.getItem('pending').length > 0;
        const invalid = this.registers.getItem('errors').length > 0;
        const incomplete = this.registers.getItem('drafts').length > 0;
        return {dirty, pending, valid:!invalid && !incomplete, canSave:dirty && !invalid && !incomplete && !pending,
            status:invalid ? 'error' : pending || incomplete ? 'pending' : dirty ? 'changed' : 'ok'};
    }
    register(adapter) {
        const fullpath = adapter.node.fullpath;
        this.fields.set(fullpath, adapter);
        const field = this.registerField(adapter.node,adapter.element.constructor);
        field.selection = adapter.element.validationSelection();
        this.schedule(() => {
            if (this.fields.get(fullpath) !== adapter) return;
            const node = this.fieldNode(fullpath);
            const draft = this.registers.getItem('drafts').getNode(key(node));
            if (draft) { node._internal.formDraft = draft.value; adapter.element.restoreFormDraft(draft.value); }
            if (field.result) adapter.element.presentValidation(field.result);
            const errors = this.registers.getItem('errors').getItem(key(node));
            if (errors) adapter.element.error(errors.getNodes().map(n => n.value).join('\n'));
            adapter.element.setFieldState({invalid:Boolean(errors), pending:Boolean(this.fieldStatus(field.path).pending)});
        });
        return () => { this.fields.delete(fullpath); };
    }
    /** A real Source declaration can validate without an element or ControlAdapter. */
    registerField(node, component, schedule = true) {
        const fullpath = node.fullpath;
        let field = this.validations.get(fullpath);
        if (field) return field;
        if (!component.validationExecutor) throw new TypeError('Grid editors require shared input validation.');
        const binding = this.runtime.bindingFor(node);
        if (!binding) throw new Error(`Editing field ${fullpath} has no open binding.`);
        // A draft left by a previous registration of this node (a node moved back into the Source) is stale:
        // register() restores the current one from the drafts register.
        delete node._internal.formDraft;
        // The record holds plain values and the component class; binding, context and checks are derived at each use.
        field = {component,run:new ValidationRun(),
            path:fieldPath(node),rules:null,value:undefined,target:null,result:null,selection:null};
        this.validations.set(fullpath,field);
        binding.editingSession = this;
        binding.track(() => this.forgetField(fullpath));
        this.refreshField(node,schedule);
        return field;
    }
    registerValidationSource(fields) {
        this.validationSources.add(fields);
        this.invalidateValidation();
        return () => { this.validationSources.delete(fields); this.invalidateValidation(); };
    }
    invalidateValidation() {
        this.validationRevision++;
        if (this.fullValidation) this.cancelActive(this.fullValidation);
    }
    /** Cancel the fields a full validation pass is checking; a field forgotten meanwhile was cancelled by forgetField. */
    cancelActive(pass) {
        for (const fullpath of pass.active) if (this.validations.has(fullpath)) this.cancelValidation(this.fieldNode(fullpath));
    }
    trackValidationDependency(absolute) {
        if (absolute === null || this.validationDependencies.has(absolute)) return;
        const [path,attr = null] = absolute.split('?',2);
        this.validationDependencies.set(absolute,this.runtime.router.register({path,attr,subtree:true,
            recipient:{receive:() => this.invalidateValidation()}}));
    }
    clearValidationDependencies() {
        for (const registration of this.validationDependencies.values()) registration.close();
        this.validationDependencies.clear();
    }
    /** Validate the complete declared scope. Bounded work keeps remote checks and UI responsive. */
    validate() {
        if (this.disposed) return Promise.resolve(false);
        if (this.fullValidation) return this.fullValidation.promise;
        for (const [fullpath,adapter] of this.fields) if (Object.hasOwn(this.fieldNode(fullpath)._internal,'formDraft')) adapter.commit();
        this.clearValidationDependencies();
        const pass = {revision:this.validationRevision,promise:null,active:new Set(),failed:false,complete:true};
        this.fullValidation = pass;
        this.notify();
        const fields = this.validationFields();
        const current = () => !this.disposed && !pass.failed && pass.revision === this.validationRevision;
        const seen = new Set();
        const worker = async () => {
            let count = 0;
            while (current()) {
                const next = fields.next();
                if (next.done) return;
                const {node,release} = next.value, fullpath = node.fullpath;
                try {
                    if (seen.has(fullpath)) continue;
                    seen.add(fullpath);
                    for (const [name,pointer] of node.pointers()) if (name !== 'value') {
                        this.trackValidationDependency((name === 'datapath' ? node.parentNode : node).absDatapath(pointer));
                    }
                    pass.active.add(fullpath);
                    const outcome = await this.validateField(node);
                    if (!outcome?.ok) pass.complete = false;
                } finally { pass.active.delete(fullpath); release(); }
                if (++count % 20 === 0) await new Promise(resolve => setTimeout(resolve,0));
            }
        };
        pass.promise = Promise.resolve().then(async () => {
            const outcomes = await Promise.allSettled(Array.from({length:8},() => worker().catch(error => {
                pass.failed = true;
                this.cancelActive(pass);
                throw error;
            })));
            const failure = outcomes.find(outcome => outcome.status === 'rejected');
            if (failure) throw failure.reason;
            if (!current()) return false;
            // fullValidation itself is pending until finally; inspect field registers here.
            const valid = pass.complete && this.status.valid && this.registers.getItem('pending').length === 0;
            if (valid) this.validatedRevision = this.validationRevision;
            return valid;
        }).finally(() => {
            fields.return();
            this.fullValidation = null;
            this.notify();
        });
        return pass.promise;
    }
    *validationFields() {
        const existing = [...this.validations.keys()];
        for (const fields of this.validationSources) yield* fields();
        for (const fullpath of existing) if (this.validations.has(fullpath)) yield {node:this.fieldNode(fullpath),release:() => {}};
    }
    /**
     * Called when the field's binding closes, after its node left the Source, or when the session is disposed.
     * The closing binding keeps no further use of the session; after dispose its disposer finds no record.
     */
    forgetField(fullpath) {
        const field = this.validations.get(fullpath);
        if (!field) return;
        field.run.cancel();
        this.validations.delete(fullpath); this.validationQueue.delete(fullpath);
        for (const name of ['errors','pending']) {
            const parts = this.registers.getItem(name).getItem(encoded(field.path));
            if (parts) {
                for (const part of [...parts.getNodes()]) if (part.label.startsWith(encoded(fullpath) + ':')) parts.popNode(part.label);
                if (!parts.length) this.registers.getItem(name).popNode(encoded(field.path));
            }
        }
        if (![...this.validations.values()].some(other => other.path === field.path)) {
            const drafts = this.registers.getItem('drafts');
            if (drafts.getNode(encoded(field.path))) drafts.popNode(encoded(field.path));
        }
        this.notify();
    }
    /** The validation parameters of the field `node`, its `^`, `=` and `==` resolved. */
    validationParameters(node, component) {
        const [, attrs] = node.rootBuilder.runtimeValues(node);
        return component.validationParameters(this.runtime.renderer.evaluateExpressions(node,attrs));
    }
    refreshField(node, schedule = true) {
        const field = this.validations.get(node.fullpath);
        if (!field || this.disposed || this.writing) return;
        const resolved = this.validationParameters(node,field.component);
        const rules = Object.fromEntries(Object.entries(resolved).filter(([name]) => name.startsWith('validate_')));
        const configuration = toTytx(Object.fromEntries(Object.entries(resolved).filter(([name]) => name !== 'value')));
        const path = fieldPath(node), target = this.runtime.gramlot.data.getNode(path.split('?')[0]);
        const value = node.getRelativeData(node.getAttr('value'));
        const dataChanged = field.path !== path || field.target !== target || !same(field.value,value);
        if (!dataChanged && field.configuration === configuration) return;
        if (field.rules !== null) this.invalidateValidation();
        this.cancelValidation(node);
        if (field.path !== path) {
            for (const name of ['errors','pending','drafts']) {
                const bag = this.registers.getItem(name);
                if (bag.getNode(encoded(field.path))) bag.popNode(encoded(field.path));
            }
        }
        // A null selection is derived from the current parameters at validation time.
        Object.assign(field,{path,target,value,rules,configuration,result:null,selection:null});
        if (dataChanged) this.clearDraft(node);
        if (schedule) this.scheduleField(node);
    }
    cancelValidation(node) {
        this.validations.get(node.fullpath)?.run.cancel();
        this.validationQueue.delete(node.fullpath);
        this.pendingPart(node,'validation',null);
    }
    writeCandidate(node,value) {
        this.clearDraft(node);
        this.writing++;
        try { this.runtime.renderer.html.writeParameter(node,'value',value); }
        finally { this.writing--; }
        const field = this.validations.get(node.fullpath);
        if (field) {
            field.value = node.getRelativeData(node.getAttr('value'));
            field.target = this.runtime.gramlot.data.getNode(field.path.split('?')[0]);
        }
        for (const other of this.validations.keys()) if (other !== node.fullpath) this.refreshField(this.fieldNode(other));
    }
    validateCandidate(node,value,selection) {
        this.invalidateValidation();
        this.cancelValidation(node);
        this.writeCandidate(node,value);
        const field = this.validations.get(node.fullpath);
        field.selection = selection;
        return this.validateField(node,false);
    }
    scheduleField(node) {
        const fullpath = node.fullpath;
        if (this.disposed || !this.validations.has(fullpath) || this.validationQueue.has(fullpath)) return;
        if (this.registers.getItem('drafts').getNode(key(node))) return;
        this.validationQueue.add(fullpath);
        this.pendingPart(node,'validation','scheduled');
        this.schedule(() => { if (this.validationQueue.delete(fullpath)) this.validateField(this.fieldNode(fullpath)); });
    }
    scheduleValidation(adapter) {
        const node = adapter.node;
        this.refreshField(node);
        const field = this.validations.get(node.fullpath);
        if (field && !field.result && !field.run.controller) this.scheduleField(node);
    }
    validateField(node, refreshSelection = true) {
        const fullpath = node.fullpath, field = this.validations.get(fullpath);
        // A closed binding has left the runtime map: bindingFor never opens one.
        const binding = this.runtime.bindingFor(node);
        if (!field || this.disposed || !binding || binding.closed) return;
        this.validationQueue.delete(fullpath);
        if (this.registers.getItem('drafts').getNode(key(node))) return;
        if (this.registers.getItem('pending').getItem(key(node))?.getItem(contribution(node,'selection'))) return;
        const value = node.getRelativeData(node.getAttr('value'));
        const adapter = this.fields.get(fullpath);
        if (refreshSelection && adapter) field.selection = adapter.element.validationSelection();
        const component = field.component, context = validationContext(binding);
        const selection = field.selection ?? component.validationSelection(this.validationParameters(node,component),context);
        const checkValue = component.validationValueCheck(context);
        const target = field.target;
        const current = context.validationCurrent();
        return field.run.start(value,field.rules,{...context,
            validationCurrent:() => () => !this.disposed && current() && this.validations.get(fullpath) === field
                && this.runtime.gramlot.data.getNode(field.path.split('?')[0]) === target,
            selection
        },component.validationExecutor,outcome => {
            const node = this.fieldNode(fullpath);
            if (outcome.ok) {
                try { checkValue(outcome.value,value); }
                catch (error) { outcome.ok = false; outcome.result.error = error.message; }
            }
            this.result(node,outcome.result);
            field.result = outcome.result;
            if (outcome.ok) this.writeCandidate(node,outcome.value);
            const mounted = this.fields.get(fullpath);
            if (mounted) mounted.element.presentValidation(outcome.result);
            context.finishValidation(outcome);
        },() => {
            this.pendingPart(this.fieldNode(fullpath),'validation','active');
            this.fields.get(fullpath)?.element.setFieldState({pending:true});
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
        this.invalidateValidation();
        this.cancelValidation(node);
        node._internal.formDraft = text;
        this.set('drafts',node,text);
    }
    clearDraft(node) {
        delete node._internal.formDraft;
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
        this.invalidateValidation();
        for (const fullpath of this.validations.keys()) this.refreshField(this.fieldNode(fullpath));
    }

    updateChanges(changedPath = null) {
        const changes = this.registers.getItem('changes');
        const relative = changedPath === this.path ? '' : changedPath?.startsWith(this.path + '.')
            ? changedPath.slice(this.path.length + 1).split('?')[0] : '';
        const visit = (a, b, path) => {
            if (path && this.isDerived(path)) return;
            const attrsA = a && this.ownAttributes(a, path), attrsB = b && this.ownAttributes(b, path);
            if (a && b && a.value instanceof Bag && b.value instanceof Bag && same(attrsA,attrsB)) {
                const labels = new Set([...a.value.getNodes(), ...b.value.getNodes()].map(n => n.label));
                for (const label of labels) visit(a.value.getNode(label), b.value.getNode(label), path ? path + '.' + label : label);
            } else if (a && b ? !same([a.value,attrsA],[b.value,attrsB])
                // A node appearing or disappearing with derived values only is not an edit.
                : !(this.onlyDerived(a, path) && this.onlyDerived(b, path))) {
                changes.setItem(encoded(path), new Bag({path, existed:Boolean(a), exists:Boolean(b),
                    previous:a ? copy(a.value) : null, current:b ? copy(b.value) : null,
                    previousAttributes:a ? copy(attrsA) : null, currentAttributes:b ? copy(attrsB) : null}));
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
        for (const [fullpath,adapter] of this.fields) {
            const node = this.fieldNode(fullpath);
            if (fieldPath(node) === path && Object.hasOwn(node._internal,'formDraft')) adapter.commit();
        }
    }
    /** Flush active drafts. Refuse errors/pending checks; accept only a valid local snapshot. */
    accept() {
        if (this.disposed) return false;
        for (const [fullpath,adapter] of this.fields) {
            if (Object.hasOwn(this.fieldNode(fullpath)._internal,'formDraft')) adapter.commit();
        }
        if (!this.status.valid || this.status.pending) return false;
        if (this.validationSources.size && this.validatedRevision !== this.validationRevision) return false;
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
        this.invalidateValidation();
        for (const fullpath of this.validations.keys()) this.cancelValidation(this.fieldNode(fullpath));
        for (const [fullpath,adapter] of this.fields) {
            const node = this.fieldNode(fullpath);
            adapter.element.cancelValidation();
            this.clearDraft(node);
            adapter.element.restoreFormValue(this.registers.getItem('baseline').getItem(
                node.absDatapath(node.getAttr('value')).slice(this.path ? this.path.length + 1 : 0)));
        }
        this.runtime.gramlot.data.setItem(this.path,copy(this.registers.getItem('baseline')));
        for (const name of ['errors','pending','drafts']) this.registers.setItem(name,new Bag());
        this.updateChanges();
        for (const fullpath of this.validations.keys()) this.scheduleField(this.fieldNode(fullpath));
    }
    dispose() {
        if (this.disposed) return;
        this.disposed = true;
        this.subscription.close();
        for (const fullpath of this.validations.keys()) this.forgetField(fullpath);
        this.fields.clear();
        this.validationQueue.clear();
        this.retainedFields.clear();
        this.listeners.clear();
        this.navigators.clear();
        this.validationSources.clear();
        this.clearValidationDependencies();
    }
}
