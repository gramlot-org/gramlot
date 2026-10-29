import type {Gramlot} from './gramlot.js';
import type {SourceBagNode} from '@genrojs/builders';
import type {Bag} from '@genrojs/bag';
export function chatRender(page: Gramlot, node: SourceBagNode, params: {messages: Bag}): void;
export function chatSend(page: Gramlot, node: SourceBagNode): void;
export function chatReset(page: Gramlot, node: SourceBagNode): void;
export function chatCompleted(page: Gramlot, node: SourceBagNode, params: {response: Bag | null}): void;

export function chatResize(page: Gramlot, node: SourceBagNode): void;
export function chatPickAttachments(page: Gramlot, node: SourceBagNode): Promise<void>;
export function chatRemoveAttachment(page: Gramlot, node: SourceBagNode): void;
export function chatRenderAttachments(page: Gramlot, node: SourceBagNode, params: {attachments: Bag}): void;
