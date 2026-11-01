/** Application-owned destination for one upload; methods may be asynchronous. */
export class UploadTarget {
    constructor(options: {maxBytes: number});
    readonly maxBytes: number;
    write(chunk: Uint8Array): void | Promise<void>;
    finish(): UploadOutcome | Promise<UploadOutcome>;
    abort(): UploadOutcome | Promise<UploadOutcome>;
    status(): UploadOutcome | Promise<UploadOutcome>;
}
export type UploadOutcome = {state: 'completed'; result: unknown} | {state: 'unsaved' | 'pending' | 'uncertain'};

/** Internal serialized transfer returned to a binary adapter. */
export class UploadTransfer {
    constructor(target: UploadTarget, size: number);
    readonly size: number;
    write(chunk: Uint8Array): Promise<void>;
    finish(): Promise<UploadOutcome>;
    abort(): Promise<UploadOutcome>;
    status(): Promise<UploadOutcome>;
}
