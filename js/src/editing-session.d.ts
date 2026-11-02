import type {Bag} from '@genrojs/bag';
import type {SourceBagNode} from '@genrojs/builders';

export interface FormStatus {
    dirty: boolean;
    pending: boolean;
    valid: boolean;
    canSave: boolean;
    status: 'ok' | 'changed' | 'error' | 'pending';
}
/** Local editing state owned by a Source node, never a server persistence service. */
export class EditingSession {
    readonly node: SourceBagNode;
    readonly registers: Bag;
    readonly data: Bag;
    readonly status: FormStatus;
    readonly disposed: boolean;
    readonly errorEntries: ReadonlyArray<{path: string; message: string}>;
    readonly changeEntries: ReadonlyArray<{path: string; previous: unknown; current: unknown; existed: boolean; exists: boolean}>;
    focusField(path: string): boolean;
    registerNavigator(navigate: (path: string) => boolean): () => void;
    load(data: Bag): void;
    validate(): Promise<boolean>;
    accept(): boolean;
    restore(): void;
}
