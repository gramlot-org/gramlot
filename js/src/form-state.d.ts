import type {Bag} from '@genrojs/bag';
import type {SourceBagNode} from '@genrojs/builders';

export interface FormStatus {
    dirty: boolean;
    pending: boolean;
    valid: boolean;
    canSave: boolean;
    status: 'ok' | 'changed' | 'error' | 'pending';
}
/** Local form state owned by a Source node, never a server persistence service. */
export class FormState {
    readonly node: SourceBagNode;
    readonly registers: Bag;
    readonly data: Bag;
    readonly status: FormStatus;
    readonly disposed: boolean;
    accept(): boolean;
    restore(): void;
}
