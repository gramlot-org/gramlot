/**
 * The column syntax of a chart type, checked against the chart parameters before any engine reads the data.
 * The syntax lives in the type descriptor (`chart-types/*.js`); this module only reads it.
 */

/** A chart configuration that does not match the syntax of its type. `diagnosis` carries the structured reasons. */
export class ChartSyntaxError extends TypeError {
    constructor(diagnosis) {
        super(diagnosis.message);
        this.name = 'ChartSyntaxError';
        this.diagnosis = diagnosis;
    }
}

function list(names) { return names.join(', '); }

function fail(type, role, message, expected, received, fix) {
    throw new ChartSyntaxError({type:type.id, role:role ? role.name : null, message, expected, received, fix});
}

/** Selected measures from `valueFields`: comma-separated, distinct, nonempty codes, or none. */
function selectedMeasures(type, structure) {
    const selection = structure.getItem('valueFields');
    if (selection !== null && selection !== undefined && typeof selection !== 'string') {
        fail(type, null, 'valueFields requires comma-separated codes or null', 'comma-separated column codes', String(selection),
            'Pass the measures as one string, for example "open,high,low,close".');
    }
    const fields = selection ? selection.split(',') : [];
    if (fields.some(field => !field) || new Set(fields).size !== fields.length) {
        fail(type, null, 'valueFields requires distinct nonempty fields', 'distinct column codes', selection,
            'Remove the empty or repeated codes from valueFields.');
    }
    return fields;
}

function checkMeasures(type, roles, fields) {
    const [first] = roles;
    if (first.count === 'many') {
        if (first.required && !fields.length) fail(type, first, `${type.label} needs at least one measure.`,
            'one or more measures', 'none', 'Choose at least one numeric column as measure.');
        return;
    }
    const names = roles.map(role => role.name);
    const expected = roles.length === 1 ? 'one measure' : `${roles.length} measures in the order ${list(names)}`;
    if (fields.length < roles.length) {
        const missing = roles[fields.length];
        fail(type, missing, `${type.label} needs ${expected}; received ${fields.length}.`, expected, list(fields) || 'none',
            roles.length === 1 ? 'Choose one numeric column as measure.' : `Choose a column for ${list(names.slice(fields.length))}.`);
    }
    if (fields.length > roles.length) {
        fail(type, null, `${type.label} takes ${expected}; received ${fields.length}: ${list(fields)}.`, expected, list(fields),
            `Remove ${list(fields.slice(roles.length))} from the measures.`);
    }
}

/**
 * Check the chart parameters against the syntax of `type` and return the selected measures.
 * Missing required columns, measures in excess or missing, repeated codes and a second dimension equal to the first are errors.
 * A parameter the type does not declare is not read, as `valueFields` for the 2D map: a configuration shared by
 * several types (chartPane) keeps the values of the other types.
 */
export function checkChartSyntax(type, structure) {
    for (const role of type.syntax) {
        if (role.parameter === 'valueFields' || !role.required) continue;
        const value = structure.getItem(role.parameter);
        if (typeof value !== 'string' || !value) {
            fail(type, role, `${type.label} needs ${role.caption} (${role.parameter}).`, `a column for ${role.caption}`, 'none',
                `Choose the column for ${role.caption}: ${role.doc}`);
        }
    }
    const second = type.syntax.find(role => role.parameter === 'secondCaptionField');
    if (second && structure.getItem('secondCaptionField') === structure.getItem('captionField')) {
        const first = type.syntax[0];
        fail(type, second, `${type.label} needs ${second.caption} different from ${first.caption}.`,
            `two different columns`, structure.getItem('captionField'), `Choose another column for ${second.caption}.`);
    }
    const roles = type.syntax.filter(role => role.parameter === 'valueFields');
    if (!roles.length) return [];
    const fields = selectedMeasures(type, structure);
    checkMeasures(type, roles, fields);
    return fields;
}
