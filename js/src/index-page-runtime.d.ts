export function mountIndexPage(renderer: any, root: any,
    onSelection?: (entries: Map<string, any>, active: string) => void,
    prepareEntry?: (entry: any, context: any) => void): {dispose(): void};
/** Re-export as Logic, or delegate indexMount from an application's Logic. */
export class IndexLogic {
    indexMount(node: any, args: {shell_id: string}): void;
}
export const THEME_READY: string;
export const THEME_SET: string;
export const THEMES: Set<string>;
export const APPEARANCES: Set<string>;
