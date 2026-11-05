import {chartDomains} from './chart-domains.js';

/** Numeric snapshot projection; row handles are indices, never Bag nodes. */
export class ChartSampleView {
    bind(samples, step, start, category, measure) {
        if (!Array.isArray(samples) || samples.some(value => typeof value !== 'number' || !Number.isFinite(value))) {
            throw new TypeError('Sample chart requires an array of finite numbers');
        }
        if (!Number.isFinite(step) || step <= 0 || !Number.isFinite(start)) throw new TypeError('Sample chart requires a positive step and finite start');
        if (typeof category !== 'string' || !category || typeof measure !== 'string' || !measure || measure.includes(',') || category === measure) throw new TypeError('Sample chart requires distinct captionField and one valueFields name');
        this.samples = samples;
        this.step = step; this.start = start; this.category = category; this.measure = measure;
        if (this.rows?.length !== samples.length) this.rows = Array.from(samples.keys());
    }
    domains(context, min, max) {
        if (min == null && max == null) return null;
        if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
            throw new TypeError('Sample bounds require finite sampleMin < sampleMax');
        }
        const domains = chartDomains(this, context);
        domains.dimension.range = [this.start, this.start + Math.max(1, this.samples.length - 1) * this.step];
        domains.axes = {left:[min,max], right:[min,max]};
        domains.z = [min,max];
        return domains;
    }
    getRows() { return this.rows; }
    value(index, field) {
        if (field === this.category) return this.start + index * this.step;
        if (field === this.measure) return this.samples[index];
        throw new TypeError(`Unknown sample field: ${field}`);
    }
}
