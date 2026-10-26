/** One viewport environment owned by the Gramlot page, shared with integrations. */
export class MobileEnvironment {
    static install(options: {document: Document; root: HTMLElement}): MobileEnvironment;
    subscribeAppearance(callback: (appearance: {dark: boolean}) => void): () => void;
    dispose(): void;
}
