import {Bag, BagResolver} from '@genrojs/bag';
import type {SourceBag, SourceBagNode} from '@genrojs/builders';
import type {Gramlot} from '../../../src/gramlot.js';
import {IdeLogic} from '../../../src/ide-runtime.js';
import {NavigationResolver} from '../../../src/navigation-resolver.js';
import {DirectoryResolver} from '../../../src/filesystem.js';
import type {GramlotRenderer} from '../../../src/renderer/gramlot-renderer.js';

declare const page: Gramlot;
declare const node: SourceBagNode;
declare const source: SourceBag;
declare const renderer: GramlotRenderer;
const onError = (error: Error) => { throw error; };

const ide = new IdeLogic();
ide.page = page;
ide.ideDocumentState('draft');
ide.ideNew();
ide.ideShowDocument('draft');
const rendered: Promise<void> = ide.ideRenderRecipe(node, {documentKey: 'draft'});
const created: Promise<void> = ide.ideCreate(node, {documentKey: 'draft'});
ide.ideCancelCreate(node, {documentKey: 'draft'});
ide.ideHistoryState(new Bag());
ide.ideEditor('draft').undo();
ide.ideForgetDocument('draft', true);
// @ts-expect-error Document keys are strings.
ide.ideShowDocument(123);
// @ts-expect-error Recipe rendering requires a document key.
ide.ideRenderRecipe(node, {});

const navigation = new NavigationResolver({gramlot: page, method: 'navigation', directory: '', onError});
const directory = new DirectoryResolver({gramlot: page, root: '/examples', onError});
for (const resolver of [navigation, directory]) {
    const bagResolver: BagResolver = resolver;
    const cached: Bag | null = resolver.resolve({static: true});
    const pending: Promise<Bag | undefined> | null = resolver.refresh();
    const loading: Promise<Bag | undefined> | null = resolver.loading;
    const closed: boolean = resolver.closed;
    const loaded: boolean = resolver.loaded;
    const writing: boolean = resolver.writing;
    resolver.resolveSync({static: true});
    resolver.reset();
    resolver.prepareValue(new Bag());
    resolver.abort();
    // @ts-expect-error Refresh is asynchronous, not an immediate Bag.
    const wrong: Bag = resolver.refresh();
    // @ts-expect-error Static reads take a boolean.
    resolver.resolve({static: 'yes'});
}
const validated: SourceBag = renderer.validateCandidate(source, {replacingNode: node});
const record = renderer.buildNode(node, document.body);
const built: SourceBagNode = record.node;
const children: Set<SourceBagNode> = record.children;
record.cleanup.push(() => {});
// @ts-expect-error The built result is a render record, not a DOM element.
const element: HTMLElement = renderer.buildNode(node, document.body);
