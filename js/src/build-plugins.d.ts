/** An esbuild plugin: name and setup, as esbuild declares `Plugin`. */
export interface BuildPlugin {
    readonly name: string;
    setup(build: unknown): void;
}
/** Replaces big.js and @xmldom/xmldom with modules whose classes throw when constructed. */
export const absentPackagePlugin: BuildPlugin;
/** Makes the dynamic import of a third-party library of a component external as `@gramlot/libraries/<name>`. */
export const libraryPlugin: BuildPlugin;
