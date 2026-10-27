export interface CollectionArtifactMetadata {
    name: string;
    grammar: string;
    commands: string;
    module: string;
    css: string[];
    dependencies: string[];
    files: string[];
}
export declare function collectionBuildId(metadata: CollectionArtifactMetadata, files: Map<string, Uint8Array>): Promise<string>;
export declare function verifyCollectionArtifact(metadata: CollectionArtifactMetadata & {buildId: string}, files: Map<string, Uint8Array>): Promise<void>;
