/* @ts-self-types="./name-syntax.d.ts" */
/**
 * The syntax of a method name, declared by the server.
 *
 * @module
 */
import {CustomTypes} from '@genrojs/builders';

/**
 * The syntax of a method name of `remote`, `dataRpc`, `dataRemote` and `remoteSource`, declared by the server
 * (`GramlotServer.nameSyntax`) and carried to the browser by the bootstrap (`nameSyntax`, GC-230 §010).
 *
 * A portable regex in the format of genro-builders (`Regex(pattern, flags)` exported as
 * `{kind: 'regex', pattern, flags}`), matched whole. It is loaded as genro-builders loads the regex of a grammar
 * (`CustomTypes.fromJSON`): a construct that Python and JavaScript do not read the same way (`\w`, `(?P<…>)`,
 * an inline flag such as `(?i)`, the flag `IGNORECASE`…) is a TypeError. The Python counterpart is `NameSyntax`
 * of `src/gramlot/page/name_syntax.py`.
 */
export class NameSyntax {
    #test;

    constructor(pattern, flags = 0) {
        this.pattern = pattern;
        this.flags = flags;
        this.#test = CustomTypes.fromJSON({nameSyntax: {kind: 'annotated',
            base: {kind: 'type', module: 'builtins', name: 'str'}, metadata: [this.toJSON()]}}).resolve('nameSyntax').test;
        Object.freeze(this);
    }

    /** The syntax of the descriptor `{kind: 'regex', pattern, flags}`; another descriptor is a TypeError. */
    static fromJSON(descriptor) {
        const keys = descriptor !== null && typeof descriptor === 'object' ? Object.keys(descriptor).sort() : [];
        if (keys.join() !== 'flags,kind,pattern' || descriptor.kind !== 'regex') {
            throw new TypeError(`A name syntax is {kind: 'regex', pattern, flags}, not ${JSON.stringify(descriptor)}`);
        }
        return new NameSyntax(descriptor.pattern, descriptor.flags);
    }

    /** The descriptor `{kind: 'regex', pattern, flags}` of genro-builders, as the bootstrap carries it. */
    toJSON() {
        return {kind: 'regex', pattern: this.pattern, flags: this.flags};
    }

    /** Whether `name` is a string the syntax matches whole. */
    matches(name) {
        return this.#test(name);
    }
}

/**
 * The core default syntax: the method of the page, or a path of public attributes from the page ending in the
 * method, `a.b.c.method`. Each segment is an ASCII letter followed by ASCII letters, digits and `_`.
 */
export const NAME_SYNTAX = new NameSyntax(String.raw`[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*`);
