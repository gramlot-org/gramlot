/**
 * The syntax of a method name, declared by the server.
 *
 * @module
 */

/** The descriptor of a portable regex of genro-builders, as the bootstrap carries it. */
export interface NameSyntaxDescriptor {
    kind: 'regex';
    /** The pattern, matched whole, without the constructs Python and JavaScript read differently. */
    pattern: string;
    /** The Python `re` flags: only MULTILINE (8), DOTALL (16) and UNICODE (32). */
    flags: number;
}

/**
 * The syntax of a method name of `remote`, `dataRpc`, `dataRemote` and `remoteSource`, declared by the server
 * (`GramlotServer.nameSyntax`) and carried to the browser by the bootstrap (`nameSyntax`). A portable regex of
 * genro-builders, matched whole; a construct that Python and JavaScript do not read the same way is a TypeError.
 */
export class NameSyntax {
    /** The pattern, matched whole. */
    readonly pattern: string;
    /** The Python `re` flags. */
    readonly flags: number;
    /** Load the portable regex `pattern` with `flags`; a non-portable regex is a TypeError. */
    constructor(pattern: string, flags?: number);
    /** The syntax of a descriptor `{kind: 'regex', pattern, flags}`; another descriptor is a TypeError. */
    static fromJSON(descriptor: NameSyntaxDescriptor): NameSyntax;
    /** The descriptor `{kind: 'regex', pattern, flags}`, as the bootstrap carries it. */
    toJSON(): NameSyntaxDescriptor;
    /** Whether `name` is a string the syntax matches whole. */
    matches(name: unknown): boolean;
}

/** The core default syntax: `a.b.c.method`, each segment an ASCII letter followed by ASCII letters, digits and `_`. */
export const NAME_SYNTAX: NameSyntax;
