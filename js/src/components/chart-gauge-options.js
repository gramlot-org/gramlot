/** Engine-side options of the `gauge` element: one value on a dial, a ring or an arc. */

export const GAUGE_PRESENTATIONS = ['needle', 'ring', 'arc'];

/** The node text of a gauge as a number; empty text is no value, never zero. */
export function gaugeValue(text) {
    if (text == null || text === '') return null;
    const value = Number(text);
    if (!Number.isFinite(value)) throw new TypeError(`gauge requires a number, received '${text}'`);
    return value;
}

/**
 * `'65:#e6a23c,85:#c23531'` as `[{value:65,color:'#e6a23c'},{value:85,color:'#c23531'}]`, ascending.
 * A color is a name or a hex code: it cannot contain a comma.
 */
export function parseThresholds(text) {
    if (text == null || text === '') return [];
    if (typeof text !== 'string') throw new TypeError('gauge thresholds requires a string of value:color pairs');
    const items = text.split(',').map(part => {
        const match = /^\s*(-?\d+(?:\.\d+)?)\s*:\s*(\S+)\s*$/.exec(part);
        if (!match) throw new TypeError(`Invalid gauge threshold '${part.trim()}': use value:color`);
        return {value: Number(match[1]), color: match[2]};
    }).sort((a, b) => a.value - b.value);
    for (let i = 1; i < items.length; i++) {
        if (items[i].value === items[i - 1].value) throw new TypeError(`Duplicate gauge threshold ${items[i].value}`);
    }
    return items;
}

/** The color of the band that holds `value`: the last threshold reached, else the accent. */
export function gaugeBandColor(thresholds, value, accent) {
    let color = accent;
    for (const threshold of thresholds) if (value >= threshold.value) color = threshold.color;
    return color;
}

/** Color stops of the dial: each band ends where the next threshold starts. */
export function gaugeBands(thresholds, min, max, accent) {
    const colors = [accent, ...thresholds.map(item => item.color)];
    const ends = [...thresholds.map(item => Math.min(1, Math.max(0, (item.value - min) / (max - min)))), 1];
    const stops = [];
    colors.forEach((color, index) => {
        if (ends[index] > (stops.at(-1)?.[0] ?? 0)) stops.push([ends[index], color]);
    });
    return stops;
}

/** The text under the dial: the real value, rounded to two decimals, inside the mask. */
export function gaugeText(value, mask) {
    const text = String(Math.round(value * 100) / 100);
    return (mask ?? '{}').replaceAll('{}', () => text);
}

const LAYOUT = {
    needle: {startAngle: 225, endAngle: -45, center: ['50%', '52%'], radius: '78%', width: 14,
        detail: [0, '58%'], title: [0, '82%']},
    ring: {startAngle: 90, endAngle: -270, center: ['50%', '50%'], radius: '88%', width: 16,
        detail: [0, '-6%'], title: [0, '28%']},
    arc: {startAngle: 180, endAngle: 0, center: ['50%', '72%'], radius: '112%', width: 16,
        detail: [0, '-22%'], title: [0, '14%']},
};

/**
 * ECharts option for one gauge. `palette` carries the theme colors: accent, ink, muted, track.
 * Every presentation sets the same keys, so a merge into the previous option leaves nothing behind.
 */
export function gaugeOption({value, min, max, mask, thresholds, presentation, caption, palette}) {
    if (!GAUGE_PRESENTATIONS.includes(presentation)) {
        throw new TypeError(`gauge presentation must be one of ${GAUGE_PRESENTATIONS.join(', ')}`);
    }
    if (!(Number.isFinite(min) && Number.isFinite(max) && min < max)) throw new TypeError('gauge requires min lower than max');
    if (value != null && !Number.isFinite(value)) throw new TypeError('gauge requires a finite number');
    const layout = LAYOUT[presentation], needle = presentation === 'needle';
    const shown = value == null ? null : Math.min(max, Math.max(min, value));
    const text = value == null ? '' : gaugeText(value, mask);
    return {
        animationDuration: 300,
        series: [{
            id: 'gauge', type: 'gauge', min, max,
            startAngle: layout.startAngle, endAngle: layout.endAngle, center: layout.center, radius: layout.radius,
            splitNumber: 5,
            pointer: {show: needle, length: '62%', width: 5, itemStyle: {color: palette.ink}},
            anchor: {show: needle, size: 10, showAbove: true, itemStyle: {color: palette.ink}},
            progress: {show: !needle, width: layout.width, roundCap: true,
                itemStyle: {color: value == null ? palette.accent : gaugeBandColor(thresholds, value, palette.accent)}},
            axisLine: {roundCap: !needle, lineStyle: {width: layout.width,
                color: needle ? gaugeBands(thresholds, min, max, palette.accent) : [[1, palette.track]]}},
            axisTick: {show: needle, distance: -layout.width - 4, length: 4, lineStyle: {color: palette.muted, width: 1}},
            splitLine: {show: needle, distance: -layout.width - 6, length: 8, lineStyle: {color: palette.muted, width: 2}},
            axisLabel: {show: needle, distance: layout.width + 6, color: palette.muted, fontSize: 11},
            title: {show: true, offsetCenter: layout.title, color: palette.muted, fontSize: 13},
            detail: {show: true, offsetCenter: layout.detail, color: palette.ink, fontSize: 22, fontWeight: 'bold',
                valueAnimation: false, formatter: () => text},
            data: shown === null ? [] : [{value: shown, name: caption ?? ''}],
        }],
    };
}
