import {BagResolver} from '@genrojs/bag';
import type {Bag, BagNode} from '@genrojs/bag';
import type {SourceBagNode} from '@genrojs/builders';
import type {Gramlot} from './gramlot.js';

export class TreeStoreResolver extends BagResolver {
    constructor(options?: {readOnly?: boolean});
    bind(store: TreeStore, path: string): void;
    load(): Promise<Bag>;
}
export class TreeStore {
    constructor(options: {gramlot: Gramlot; method: string; params?: Record<string, unknown>});
    pathFor(node: BagNode): string;
    load(path?: string, label?: string | null, attributes?: Record<string, unknown>): Promise<Bag>;
    dispose(): void;
}
export class TreeStoreLogic {
    treeStoreMount(node: SourceBagNode, args: {storeMethod: string; storeParams: Record<string, unknown>}): Promise<void>;
    treeFavoritesMount(node: SourceBagNode, args: {favoriteKey: string}): void;
    treeFavoriteActionState(node: SourceBagNode, args: {item: BagNode; state: Bag}): {hidden: boolean; icon: string; title: string};
    treeFavoriteToggle(node: SourceBagNode, args: {item: BagNode; path: string; favoriteKey: string}): void;
    treeInspect(node: SourceBagNode, args: {item: BagNode; path: string}): void;
    treeInspectClose(node: SourceBagNode, event: Event): void;
}
