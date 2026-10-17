import {isDecimal} from '@genrojs/tytx';
/** Bounded numeric patterns and temporal styles for Gramlot's formatting contract. */

export function validateMask(mask) {
    if (mask != null && (typeof mask !== 'string' || /[{}]/.test(mask.replaceAll('{}', '')))) {
        throw new RangeError('This formatter mask supports only {} placeholders');
    }
}

/** Shared composition for formatted values and plain display text. */
export function applyMask(text, mask) {
    validateMask(mask);
    return mask == null ? text : mask.replaceAll('{}', () => text);
}

function inferredType(value) {
    if (value instanceof Date) {
        // Match TYTX's documented inference; dtype can override this ambiguity.
        const epochDay = value.getUTCFullYear() === 1970 && value.getUTCMonth() === 0 && value.getUTCDate() === 1;
        const midnight = value.getUTCHours() === 0 && value.getUTCMinutes() === 0 &&
            value.getUTCSeconds() === 0 && value.getUTCMilliseconds() === 0;
        if (epochDay && !midnight) return 'H';
        if (midnight && !epochDay) return 'D';
        return 'DHZ';
    }
    if (isDecimal(value)) return 'N';
    if (typeof value === 'number') return Number.isInteger(value) ? 'L' : 'R';
    throw new TypeError('Formatting requires finite JavaScript numbers, TYTX Decimal values or valid Date objects');
}

function temporalText(value, dtype, {pattern = 'short', locale, timeZone}) {
    if (!['short', 'medium', 'long', 'full'].includes(pattern)) {
        throw new RangeError('Temporal formatting currently supports short, medium, long and full only');
    }
    if (dtype === 'DHZ' && (typeof timeZone !== 'string' || !timeZone)) {
        throw new TypeError('DHZ formatting currently requires an explicit timeZone');
    }
    // Civil fields are stored in UTC by TYTX; they must not shift with display timezone.
    const options = {timeZone: dtype === 'DHZ' ? timeZone : 'UTC'};
    if (dtype !== 'H') options.dateStyle = pattern;
    if (dtype !== 'D') options.timeStyle = pattern;
    return new Intl.DateTimeFormat(locale, options).format(value);
}

function numericSection(section) {
    // Only decimal skeletons and sign/parenthesis affixes are implemented here.
    const match = /^(-|\()?(#,##0|0+)(?:\.(0*#*))?(\))?$/.exec(section);
    if (!match || (match[1] === '(') !== (match[4] === ')') || section.endsWith('.')) {
        throw new RangeError(`Unsupported numeric pattern section: ${section}`);
    }
    const fraction = match[3] ?? '';
    return {
        prefix: match[1] ?? '', suffix: match[4] ?? '',
        intl: {
            useGrouping: match[2].startsWith('#,##') ? 'always' : false,
            minimumIntegerDigits: match[2].replace('#,##', '').length,
            minimumFractionDigits: fraction.replaceAll('#', '').length,
            maximumFractionDigits: fraction.length,
        },
    };
}

function numericPattern(pattern) {
    const sections = pattern.split(';');
    if (sections.length > 3) throw new RangeError('Numeric patterns support at most three sections');
    const positive = numericSection(sections[0]);
    if (positive.prefix || positive.suffix) throw new RangeError('Positive-section affixes are not implemented');
    const zero = sections.length === 3 ? sections[1] : null;
    // The first slice supports the already agreed literal '-' and empty zero branch.
    if (zero !== null && zero !== '' && zero !== '-') numericSection(zero);
    const negative = sections.length > 1 ? numericSection(sections.at(-1)) : null;
    // Unicode negative sections supply affixes; digit settings come from the positive section.
    return {positive, zero, negative};
}

/** Internal implementation; the only public entry point is Gramlot.format. */
export function formatValue(value, options = {}, context = {}) {
    // A null value bypasses both the pattern and the mask, by contract.
    if (value === null) return '';
    if (typeof options === 'string') options = {pattern: options};
    if (!options || typeof options !== 'object' || Array.isArray(options)) {
        throw new TypeError('Format options must be a pattern string or an options object');
    }
    for (const key of Object.keys(options)) {
        if (!['pattern', 'locale', 'mask', 'dtype', 'timeZone'].includes(key)) throw new RangeError(`Unsupported format option: ${key}`);
    }
    options = {...options, locale: options.locale ?? context.locale, timeZone: options.timeZone ?? context.timeZone};
    const dtype = options.dtype === undefined ? inferredType(value) : options.dtype;
    const temporal = ['D', 'H', 'DHZ'].includes(dtype);
    if (!temporal && !['L', 'R', 'N'].includes(dtype)) throw new RangeError(`Unsupported format dtype: ${dtype}`);
    if (temporal) {
        if (!(value instanceof Date) || !Number.isFinite(value.getTime())) throw new TypeError(`${dtype} requires a valid Date object`);
    } else if (!(typeof value === 'number' && Number.isFinite(value)) && !(isDecimal(value) && !['NaN', 'Infinity', '-Infinity'].includes(value.toString()))) {
        throw new TypeError(`${dtype} formatting requires finite JavaScript numbers or TYTX Decimal values`);
    }
    if (dtype === 'L' && !Number.isInteger(value)) throw new TypeError('L formatting requires an integer');
    const {pattern, locale, mask} = options;
    if (!temporal && typeof pattern !== 'string') throw new TypeError('Numeric formatting currently requires an explicit pattern');
    if (typeof locale !== 'string' || !locale) throw new TypeError('Formatting currently requires an explicit locale');
    // Do not silently select the browser locale when the requested locale is unavailable.
    const intl = temporal ? Intl.DateTimeFormat : Intl.NumberFormat;
    if (!intl.supportedLocalesOf([locale]).length) throw new RangeError(`Unsupported format locale: ${locale}`);
    validateMask(mask);
    if (temporal) {
        const text = temporalText(value, dtype, options);
        return applyMask(text, mask);
    }
    const {positive, zero, negative} = numericPattern(pattern);
    const decimal = isDecimal(value);
    const zeroValue = decimal ? value.eq(0) : value === 0;
    const negativeValue = decimal ? value.lt(0) : value < 0;
    if (decimal && new Intl.NumberFormat('en', {useGrouping: false}).format('9007199254740993') !== '9007199254740993') throw new Error('This browser cannot format Decimal without precision loss');
    let text;
    if (zeroValue && zero !== null) {
        if (zero === '') return '';
        if (zero === '-') text = '-';
        else {
            const section = numericSection(zero);
            text = section.prefix + new Intl.NumberFormat(locale, section.intl).format(0) + section.suffix;
        }
    } else {
        const affix = negativeValue && negative ? negative : positive;
        const number = decimal ? (negativeValue && negative ? value.abs() : value).toString()
            : negativeValue && negative ? -value : (value === 0 ? 0 : value);
        text = affix.prefix + new Intl.NumberFormat(locale, positive.intl).format(number) + affix.suffix;
    }
    return applyMask(text, mask);
}
