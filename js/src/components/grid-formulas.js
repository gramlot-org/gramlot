import {getDecimalLibrary, isDecimal} from '@genrojs/tytx';

/**
 * Grid row formulas and footer arithmetic (intermediate implementation; the final placement
 * of formulas and totals, data level or grid, is under review).
 *
 * A data formula computes its field for each resident row and writes the result into the row
 * Bag, so every view on the same store sees it. The row index `#` (1-based), the running sum
 * `+=field` and every formula depending on them are view values: each grid computes them on the
 * visible rows of its own view, in view order, and never writes them.
 * Legacy reference: gnr.GridChangeManager.
 */

const SPECIAL_INDEX = '#';
const IDENTIFIER = /[A-Za-z_$][\w$]*/g;

/** The formula definitions of a grid structure, their dependency order, triggers and view fields. */
export function formulaDefinitions(columns) {
    const entries = new Map();
    for (const column of columns) {
        if (column.formula == null) continue;
        const formula = column.formula.trim();
        const special = formula === SPECIAL_INDEX ? {kind:'index', field:null}
            : formula.startsWith('+=') ? {kind:'running', field:formula.slice(2).trim()}
            : formula.startsWith('%=') ? {kind:'percent', field:formula.slice(2).trim()}
            : null;
        if (special && special.kind !== 'index' && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(special.field)) {
            throw new TypeError(`grid formula '${formula}' requires a field`);
        }
        const parameters = new Map();
        for (const [name, raw] of Object.entries(column)) {
            if (name.startsWith('formula_')) parameters.set(name.slice('formula_'.length), raw);
        }
        let arithmetic = null;
        if (!special) {
            try { arithmetic = parseArithmetic(formula); } catch { /* outside the arithmetic grammar: inline code */ }
        }
        const references = special ? new Set(special.field ? [special.field] : []) : new Set(formula.match(IDENTIFIER) ?? []);
        entries.set(column.field, {field:column.field, formula:column.formula, special, arithmetic,
            parameters, references, calculated:column.calculated === true, column});
    }
    const triggered = new Map();
    for (const entry of entries.values()) {
        for (const dependency of entry.references) {
            if (!triggered.has(dependency)) triggered.set(dependency, new Set());
            triggered.get(dependency).add(entry.field);
        }
    }
    const visiting = new Set(), visited = new Set(), order = [];
    const visit = field => {
        if (visited.has(field)) return;
        if (visiting.has(field)) throw new TypeError(`grid formula dependency cycle at '${field}'`);
        visiting.add(field);
        for (const dependency of entries.get(field).references) if (entries.has(dependency)) visit(dependency);
        visiting.delete(field); visited.add(field); order.push(field);
    };
    for (const field of entries.keys()) visit(field);
    // Dependencies come first in `order`: a formula is a view value when it is `#`/`+=` or depends on one.
    const viewFields = new Set();
    for (const field of order) {
        const entry = entries.get(field);
        if (['index', 'running'].includes(entry.special?.kind) || [...entry.references].some(name => viewFields.has(name))) viewFields.add(field);
    }
    const definitions = new Map([...entries].map(([field, entry]) => [field, Object.freeze({...entry, view:viewFields.has(field)})]));
    return Object.freeze({definitions, triggered, order:Object.freeze(order), viewFields});
}

/** Bounded arithmetic grammar: numbers, names, + - * / % ** and parentheses. */
export function parseArithmetic(code) {
    const tokens = tokenize(code);
    let position = 0;
    const peek = () => tokens[position];
    const take = value => {
        if (peek().value !== value) throw new SyntaxError(`expected '${value}' in arithmetic formula`);
        return tokens[position++];
    };
    const precedence = {'+':1, '-':1, '*':2, '/':2, '%':2, '**':3};
    const primary = () => {
        const token = peek();
        if (token.type === 'number') { position++; return {kind:'number', value:token.value}; }
        if (token.type === 'name') { position++; return {kind:'name', value:token.value}; }
        if (token.value === '(') { position++; const node = expression(0); take(')'); return node; }
        if (token.value === '+' || token.value === '-') { position++; return {kind:'unary', operator:token.value, child:primary()}; }
        throw new SyntaxError(`unexpected '${token.value || 'end'}' in arithmetic formula`);
    };
    const expression = minimum => {
        let left = primary();
        while (precedence[peek().value] >= minimum) {
            const operator = tokens[position++].value;
            const right = expression(precedence[operator] + (operator === '**' ? 0 : 1));
            left = {kind:'binary', operator, left, right};
        }
        return left;
    };
    const tree = expression(0);
    if (peek().type !== 'eof') throw new SyntaxError(`unexpected '${peek().value}' in arithmetic formula`);
    return tree;
}

function tokenize(code) {
    const result = [];
    let offset = 0;
    while (offset < code.length) {
        const rest = code.slice(offset);
        const whitespace = /^\s+/.exec(rest);
        if (whitespace) { offset += whitespace[0].length; continue; }
        const number = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/.exec(rest);
        if (number) { result.push({type:'number', value:number[0]}); offset += number[0].length; continue; }
        const name = /^[A-Za-z_$][\w$]*/.exec(rest);
        if (name) { result.push({type:'name', value:name[0]}); offset += name[0].length; continue; }
        const operator = /^(?:\*\*|[()+\-*/%])/.exec(rest);
        if (operator) { result.push({type:'operator', value:operator[0]}); offset += operator[0].length; continue; }
        throw new SyntaxError(`unsupported arithmetic formula token at ${offset}`);
    }
    result.push({type:'eof', value:''});
    return result;
}

function requireDecimalBackend() {
    if (getDecimalLibrary() === 'number') throw new Error('A Decimal backend is required for exact grid formulas');
}

function decimalValue(value, Decimal) {
    if (isDecimal(value)) return value;
    if (value == null || value === '') return null;
    if (typeof value !== 'number' && typeof value !== 'string') throw new TypeError('Decimal arithmetic requires numeric values');
    return new Decimal(String(value));
}

/** JavaScript operators on plain values. */
const OPERATORS = {'+':(a, b) => a + b, '-':(a, b) => a - b, '*':(a, b) => a * b, '/':(a, b) => a / b,
    '%':(a, b) => a % b, '**':(a, b) => a ** b};

function evaluateNumber(node, scope) {
    if (node.kind === 'number') return Number(node.value);
    if (node.kind === 'name') {
        if (!Object.hasOwn(scope, node.value)) throw new ReferenceError(`${node.value} is not defined`);
        return scope[node.value];
    }
    if (node.kind === 'unary') return node.operator === '-' ? -evaluateNumber(node.child, scope) : +evaluateNumber(node.child, scope);
    return OPERATORS[node.operator](evaluateNumber(node.left, scope), evaluateNumber(node.right, scope));
}

function evaluateDecimal(node, scope, Decimal) {
    if (node.kind === 'number') return new Decimal(node.value);
    if (node.kind === 'name') {
        if (!Object.hasOwn(scope, node.value)) throw new ReferenceError(`${node.value} is not defined`);
        return decimalValue(scope[node.value], Decimal);
    }
    if (node.kind === 'unary') {
        const value = evaluateDecimal(node.child, scope, Decimal);
        if (value == null) return null;
        return node.operator === '-' ? value.neg() : value;
    }
    const left = evaluateDecimal(node.left, scope, Decimal);
    const right = evaluateDecimal(node.right, scope, Decimal);
    if (left == null || right == null) return null;
    if (node.operator === '**') return left.pow(Number(right.toString()));
    const method = ({'+':'plus', '-':'minus', '*':'times', '/':'div', '%':'mod'})[node.operator];
    return left[method](right);
}

/** Equality of two computed values: identity, or Decimal value equality. */
export function sameValue(left, right) {
    if (Object.is(left, right)) return true;
    return isDecimal(left) && isDecimal(right) && left.eq(right);
}

/** `left + right` for aggregates; an empty right operand leaves `left` unchanged. */
export function addNumeric(left, right) {
    if (right == null || right === '') return left;
    if (isDecimal(left) || isDecimal(right)) {
        requireDecimalBackend();
        const Decimal = isDecimal(left) ? left.constructor : right.constructor;
        return decimalValue(left, Decimal).plus(decimalValue(right, Decimal));
    }
    if (typeof right !== 'number' || !Number.isFinite(right)) throw new TypeError('Grid aggregate formulas require numeric values');
    return left + right;
}

function dividePercent(value, total) {
    const zero = isDecimal(total) ? total.eq(0) : Object.is(total, 0);
    if (value == null || value === '' || total == null || zero) return null;
    if (isDecimal(value) || isDecimal(total)) {
        const Decimal = isDecimal(value) ? value.constructor : total.constructor;
        return decimalValue(value, Decimal).div(decimalValue(total, Decimal)).times(new Decimal(100));
    }
    if (typeof value !== 'number' || typeof total !== 'number') throw new TypeError('Percentage formulas require numeric values');
    return value / total * 100;
}

/**
 * Formula lifecycle of one grid: store and view subscriptions, `^` parameter registrations,
 * recalculation of data formulas in dependency order with writes into the row Bags, and the
 * view values of this grid.
 *
 * Data results are written only when they differ from the stored value. Writes made by this
 * grid do not trigger it again; another grid on the same store recomputes equal values and
 * writes nothing. Editing drafts never reach the row Bag, so only committed values recalculate.
 */
export class GridFormulas {
    #source;
    #formulas = formulaDefinitions([]);
    #fields = new Set();
    #store = null;
    #view = null;
    #release = [];
    #registrations = [];
    #running = false;
    #errors = new Map();
    #viewValues = null;

    constructor(source) {
        this.#source = source;
    }

    get source() { return this.#source; }
    get runtime() { return this.source.rootBuilder.binding; }
    /** The last error of each formula field, by field name. */
    get errors() { return new Map(this.#errors); }
    get formulas() { return this.#formulas; }
    /** The data formula fields: written into the row Bag. */
    get dataFields() { return new Set(this.formulas.order.filter(field => !this.viewFields.has(field))); }
    /** The view-value fields: computed per grid, never written. */
    get viewFields() { return this.formulas.viewFields; }

    /** Adopt `structure` over `view`/`store`; a new structure or store runs the calculated data formulas. */
    configure(structure, view, store) {
        if (structure.formulas === this.#formulas && store === this.#store && view === this.#view && this.#release.length) return;
        this.disconnect();
        this.#formulas = structure.formulas;
        this.#fields = new Set(structure.fields);
        this.#store = store; this.#view = view;
        this.#errors.clear();
        if (!this.formulas.definitions.size) return;
        this.#release = [store.subscribe(change => this.#storeChanged(change)),
            view.subscribe(() => { this.#viewValues = null; })];
        for (const definition of this.formulas.definitions.values()) {
            for (const raw of definition.parameters.values()) {
                if (typeof raw !== 'string' || !raw.startsWith('^')) continue;
                const [path, attr = null] = this.source.absDatapath(raw).split('?');
                this.#registrations.push(this.runtime.router.register({path, attr, recipient:{receive:() => {
                    this.#viewValues = null;
                    this.recalculate(this.#closure([definition.field]));
                }}}));
            }
        }
        this.recalculate(this.#closure(this.#selected(definition => definition.calculated)));
    }

    disconnect() {
        for (const release of this.#release) release();
        for (const registration of this.#registrations) registration.close();
        this.#release = []; this.#registrations = [];
        this.#store = null; this.#view = null; this.#viewValues = null;
        this.#formulas = formulaDefinitions([]);
    }

    /** The value shown by this grid: a view value, or the stored field. */
    value(node, field) {
        if (!this.viewFields.has(field)) return this.#store.value(node, field);
        // A row filtered out of the view has no view value.
        const values = this.#computeViewValues().get(node);
        return values === undefined ? null : values[field];
    }

    #selected(predicate) {
        return [...this.formulas.definitions.values()].filter(predicate).map(definition => definition.field);
    }

    #closure(fields) {
        const result = new Set(fields);
        const pending = [...fields];
        while (pending.length) {
            for (const dependent of this.formulas.triggered.get(pending.shift()) ?? []) {
                if (!result.has(dependent)) { result.add(dependent); pending.push(dependent); }
            }
        }
        return result;
    }

    #storeChanged({full, rows, event, field}) {
        this.#viewValues = null;
        if (this.#running) return;
        if (full) {
            this.recalculate(this.#closure(this.#selected(definition => definition.calculated || definition.special)));
            return;
        }
        const [row] = rows;
        let fields;
        if (field !== null) fields = [field];
        else if (event.node === row) {
            fields = event.evt === 'upd_attrs' ? Object.keys(event.attrs_diff) : [...this.formulas.triggered.keys()];
        } else fields = (Array.isArray(event.node) ? event.node : [event.node]).map(node => node.label);
        const affected = new Set();
        for (const name of fields) for (const formula of this.formulas.triggered.get(name) ?? []) affected.add(formula);
        const closure = this.#closure(affected);
        const global = [...closure].some(name => this.formulas.definitions.get(name).special?.kind === 'percent');
        this.recalculate(closure, global ? null : [row]);
    }

    #parameters(definition) {
        const result = {};
        for (const [name, raw] of definition.parameters) {
            result[name] = typeof raw === 'string' && (raw.startsWith('^') || raw.startsWith('='))
                ? this.source.getRelativeData(raw) : raw;
        }
        return result;
    }

    /** One formula on one row; `read(row, field)` gives the field values it may reference. */
    #evaluate(definition, row, index, aggregate, read) {
        if (definition.special?.kind === 'index') return index;
        if (definition.special?.kind === 'running') return addNumeric(aggregate, read(row, definition.special.field));
        if (definition.special?.kind === 'percent') return dividePercent(read(row, definition.special.field), aggregate);
        const parameters = this.#parameters(definition);
        const scope = {};
        for (const name of definition.references) {
            if (Object.hasOwn(parameters, name)) scope[name] = parameters[name];
            else if (this.#fields.has(name) || this.#rowFields(row).has(name)) scope[name] = read(row, name) ?? null;
        }
        if (Object.values(scope).some(value => value == null)) return null;
        const decimal = Object.values(scope).find(isDecimal);
        if (definition.arithmetic) {
            if (decimal === undefined) return evaluateNumber(definition.arithmetic, scope);
            requireDecimalBackend();
            return evaluateDecimal(definition.arithmetic, scope, decimal.constructor);
        }
        if (decimal !== undefined) throw new Error('Decimal grid formulas support arithmetic expressions only');
        const names = [...Object.keys(scope), '_currcell', '_rowNode'];
        // Inline code rule: only a formula text received with the grid's Source is compiled.
        const run = this.runtime.inlineCompiler.compile(this.source, `struct.${definition.field}.formula`,
            definition.formula, names, `return (${definition.formula}\n);`);
        return run({...scope, _currcell:definition.column, _rowNode:row});
    }

    #rowFields(row) {
        if (this.#store.rowMode === 'attributes') return new Set(Object.keys(row.getAttr()));
        return new Set(row.staticValue.keys());
    }

    #write(row, field, value) {
        if (sameValue(this.#store.value(row, field), value)) return;
        if (this.#store.rowMode === 'attributes') row.setAttr({[field]:value});
        else row.staticValue.setItem(field, value);
    }

    /** Recalculate the data formulas among `fields`, on `rows` or on every resident row. */
    recalculate(fields, rows = null) {
        if (this.#running || !fields.size || this.#store === null) return;
        this.#running = true;
        const read = (row, field) => this.#store.value(row, field);
        try {
            const resident = this.#store.getRows();
            for (const field of this.formulas.order) {
                const definition = this.formulas.definitions.get(field);
                if (!fields.has(field) || definition.view) continue;
                let aggregate = null, failure = null;
                if (definition.special?.kind === 'percent') {
                    try {
                        aggregate = 0;
                        for (const row of resident) aggregate = addNumeric(aggregate, read(row, definition.special.field));
                    } catch (error) { aggregate = null; failure = error; }
                }
                for (const row of rows ?? resident) {
                    let value = null;
                    try { value = this.#evaluate(definition, row, null, aggregate, read); }
                    catch (error) { failure = error; }
                    this.#write(row, field, value);
                }
                if (failure) this.#errors.set(field, failure);
                else this.#errors.delete(field);
            }
        } finally {
            this.#running = false;
        }
    }

    /** View values of the visible rows in this grid's view order, cached until the next store or view change. */
    #computeViewValues() {
        if (this.#viewValues !== null) return this.#viewValues;
        const ordered = this.#view.getRows();
        const values = new Map(ordered.map(row => [row, {}]));
        const read = (row, field) => this.viewFields.has(field) ? values.get(row)[field] : this.#store.value(row, field);
        for (const field of this.formulas.order) {
            const definition = this.formulas.definitions.get(field);
            if (!definition.view) continue;
            let aggregate = 0, failure = null;
            for (const [index, row] of ordered.entries()) {
                let value = null;
                try {
                    value = this.#evaluate(definition, row, index + 1, aggregate, read);
                    if (definition.special?.kind === 'running') aggregate = value;
                } catch (error) { failure = error; }
                values.get(row)[field] = value;
            }
            if (failure) this.#errors.set(field, failure);
            else this.#errors.delete(field);
        }
        this.#viewValues = values;
        return values;
    }
}
