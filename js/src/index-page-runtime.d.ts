import type {Bag, BagNode} from '@genrojs/bag';
export interface IndexEntry {url: string; path: string; node: BagNode; pane: any; title: string; loading: boolean;}
export function mountIndexPage(renderer: any, root: any,
    onSelection?: (entries: Map<string, IndexEntry>, active: string | null) => void,
    prepareEntry?: (entry: IndexEntry) => void,
    options?: {state?: Bag; createEntry?: (entry: IndexEntry) => Promise<void>;
        onLoad?: (url: string, status: 'loading' | 'ready' | 'error' | 'cancelled', error?: Error) => void}): {entries: Map<string, IndexEntry>; dispose(): void};
export class IndexLogic {indexMount(node: any): void;}
export const THEME_READY: string;
export const THEME_SET: string;
export const THEMES: Set<string>;
export const APPEARANCES: Set<string>;
