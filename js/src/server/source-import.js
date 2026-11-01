import {fromTytx} from '@genrojs/tytx';
import {SourceBag} from '@genrojs/builders';
import {UploadTarget} from './upload.js';
export class SourceImport extends UploadTarget {
    constructor() {
        super({maxBytes:5 * 1024 * 1024});
        this.decoder = new TextDecoder('utf-8', {fatal:true});
        this.parts = [];
        this.outcome = {state:'pending'};
    }
    write(chunk) { this.parts.push(this.decoder.decode(chunk, {stream:true})); }
    finish() {
        this.parts.push(this.decoder.decode());
        const wire = this.parts.join('');
        this.parts = [];
        const source = fromTytx(wire);
        if (!(source instanceof SourceBag) || source.length !== 1 || source.getNodes()[0].label !== 'pageRoot') {
            throw new TypeError('Expected one pageRoot Source');
        }
        this.outcome = {state:'completed', result:wire};
        return this.outcome;
    }
    abort() {
        if (this.outcome.state !== 'completed') {
            this.parts = [];
            this.outcome = {state:'unsaved'};
        }
        return this.outcome;
    }
    status() { return this.outcome; }
}
