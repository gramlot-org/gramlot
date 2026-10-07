/**
 * `Signature` and `ReturnValue`: the declared parameters and result of a routed function.
 *
 * @module
 */

/** A TYTX code accepted by a `Signature`. */
export type TytxCode = 'T' | 'L' | 'R' | 'N' | 'B' | 'D' | 'DHZ' | 'H';

/** A required parameter (its code) or an optional one (`[code, default]`). */
export type ParameterSpec = TytxCode | [TytxCode, unknown];

/** One declared parameter. */
export interface Parameter {
    name: string;
    type: TytxCode;
    required: boolean;
    default: unknown;
}

/** The named parameters of a routed function: TYTX code, required or default, in declaration order. */
export class Signature {
    /** Declare the parameters; a spec that is neither a code nor `[code, default]` raises a TypeError. */
    constructor(specs?: Record<string, ParameterSpec>);
    /** Copies of the declared specs in order; changing them does not change the signature. */
    readonly parameters: Parameter[];
    /**
     * A new object of the named values `kw` checked against the declaration, defaults applied.
     * Unknown, missing or wrongly typed names raise a TypeError. A non-empty `extraPath` is carried as `_extraPath`.
     */
    bind(kw: Record<string, unknown>, options?: {extraPath?: string}): Record<string, unknown>;
}

/** What a routed function returns, documented only: never checked against the actual return. */
export class ReturnValue {
    /** A TYTX code or an object of field specs. */
    type?: TytxCode | Record<string, ParameterSpec>;
    mediaType?: string;
    docline?: string;
    constructor(fields?: {
        type?: TytxCode | Record<string, ParameterSpec>;
        mediaType?: string;
        docline?: string;
    });
}
