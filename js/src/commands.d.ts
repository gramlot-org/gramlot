/** Command metadata authored by a collection and isolated per page instance. */
export interface CommandDefinition {label:string; publish:string; icon?:string; iconSrc?:string; tooltip?:string;}
export interface CommandGroupMetadata {author?:string; description?:string;}
export class CommandRegistry {
    registerGroup(namespace:string, metadata?:CommandGroupMetadata): Readonly<{register(name:string,definition:CommandDefinition):void}>;
    get(command:string): Readonly<CommandDefinition> | undefined;
    toDocument(): {document_format:{name:'gramlot_commands';version:'1.0'};
        groups:Record<string,CommandGroupMetadata & {commands:Record<string,CommandDefinition>}>};
}
