import {createDecimal, isDecimal} from '@genrojs/tytx';
import {parseDateExpression} from '@genrojs/toolbox';
import {formatValue} from '../format.js';

/** Legacy search syntax, independent of grid DOM and collection ordering. */
export function compileFilter(filter) {
    if (filter === null) return null;
    const {value, columns, dtype, locale} = filter;
    if (typeof value !== 'string' || !Array.isArray(columns) || !columns.length ||
        columns.some(field => typeof field !== 'string' || !field || field === 'rowidx') ||
        !['T', 'L', 'R', 'N', 'D'].includes(dtype)) throw new TypeError('Invalid collection filter');
    if (!value.trim()) return null;
    if (dtype === 'T') {
        const expression = new RegExp(value, 'i');
        return read => expression.test(columns.map(field => searchText(read(field), locale, filter.timeZone)).join(' '));
    }
    if (columns.length !== 1) throw new TypeError('Typed filters require one column');
    const match = /^\s*(<=|>=|==|!=|[<>=!#])\s*(.+?)\s*$/.exec(value);
    if (!match) throw new Error('Enter a comparison, for example > 100 or = 12.');
    const [, operator, text] = match;
    let operand;
    if (dtype === 'D') {
        const now = new Date();
        const workdate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        const parsed = parseDateExpression(text, {locale, workdate});
        if (!parsed.ok || parsed.kind !== 'date') throw new Error('Enter one complete date after the comparison.');
        operand = new Date(`${parsed.date}T00:00:00Z`);
    } else operand = parseNumber(text, locale);
    return read => {
        const actual = read(columns[0]);
        if (actual == null) return false;
        if (dtype === 'D' ? !(actual instanceof Date) || !Number.isFinite(actual.getTime())
            : !(typeof actual === 'number' && Number.isFinite(actual) || isDecimal(actual) && actual.isFinite())) {
            throw new TypeError(`Filter value does not match ${dtype}`);
        }
        const order = isDecimal(operand) ? -operand.comparedTo(actual) : actual < operand ? -1 : actual > operand ? 1 : 0;
        switch (operator) {
            case '=': case '==': return order === 0;
            case '!': case '#': case '!=': return order !== 0;
            case '<': return order < 0;
            case '>': return order > 0;
            case '<=': return order <= 0;
            case '>=': return order >= 0;
        }
    };
}

function searchText(value, locale, timeZone) {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'boolean') return String(value);
    return formatValue(value, {pattern:value instanceof Date ? 'short' : '#,##0.####################'}, {locale, timeZone});
}

function parseNumber(text, locale) {
    const parts = new Intl.NumberFormat(locale).formatToParts(-12345.6);
    const decimal = parts.find(part => part.type === 'decimal').value;
    const group = parts.find(part => part.type === 'group')?.value;
    const minus = parts.find(part => part.type === 'minusSign').value;
    let number = text.replaceAll(minus, '-');
    if (group && number.includes(group)) {
        const integer = number.split(decimal)[0].replace(/^[+-]/, '');
        const groups = integer.split(group);
        const sizes = new Intl.NumberFormat(locale).formatToParts(1234567890123).filter(part => part.type === 'integer').map(part => part.value.length);
        const last = sizes.at(-1), middle = sizes.at(-2);
        if (number.split(decimal).slice(1).some(part => part.includes(group)) ||
            !/^\d+$/.test(groups[0]) || groups[0].length > middle ||
            groups.slice(1).some((item,index) => !/^\d+$/.test(item) || item.length !== (index === groups.length - 2 ? last : middle))) {
            throw new Error('Invalid numeric grouping.');
        }
        number = number.replaceAll(group, '');
    }
    number = number.replace(decimal, '.');
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(number)) throw new Error('Enter a complete number.');
    const result = createDecimal(number);
    if (!isDecimal(result) || !result.isFinite()) throw new Error('A finite Decimal backend is required.');
    return result;
}
