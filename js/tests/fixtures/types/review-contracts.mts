import {Bag, BagResolver} from '@genrojs/bag';
import type {SourceBag, SourceBagNode} from '@genrojs/builders';
import type {Gramlot} from '../../../src/gramlot.js';
import {IdeLogic} from '../../../src/ide-runtime.js';
import {IndexLogic, mountIndexPage} from '../../../src/index-page-runtime.js';
import {HttpTransport} from '../../../src/http-transport.js';
import {NavigationResolver} from '../../../src/navigation-resolver.js';
import {DirectoryResolver} from '../../../src/filesystem.js';
import type {GramlotRenderer} from '../../../src/renderer/gramlot-renderer.js';

declare const page: Gramlot;
declare const node: SourceBagNode;
declare const source: SourceBag;
declare const renderer: GramlotRenderer;
const onError = (error: Error) => { throw error; };

const http = new HttpTransport('/rpc', {navigator: {sendBeacon: () => true}});
http.close('page');
page.dispose();
// @ts-expect-error HTTP close has one beacon path, without a mode selector.
http.close('page', {beacon: false});
// @ts-expect-error Page disposal does not select a transport delivery mode.
page.dispose({beacon: true});

const index = new IndexLogic();
index.indexMount(node);
const coordinator = mountIndexPage(renderer, node, undefined, undefined, {
    onLoad(url, status, error) {
        const known: 'loading' | 'ready' | 'error' | 'cancelled' = status;
        if (known === 'error' && error) onError(error);
    },
});
coordinator.entries.get('/hello')?.pane;
coordinator.dispose();
// @ts-expect-error The controller Source identifies its shell, without a DOM ID argument.
index.indexMount(node, {shell_id: 'index'});

const ide = new IdeLogic();
ide.page = page;
ide.ideDocumentState(node,'draft');
ide.ideNew(node);
ide.ideShowDocument(node,'draft');
const rendered: Promise<void> = ide.ideRenderRecipe(node, {documentKey: 'draft'});
const created: Promise<void> = ide.ideCreate(node, {documentKey: 'draft'});
ide.ideCancelCreate(node, {documentKey: 'draft'});
ide.ideHistoryState(new Bag());
ide.ideEditor(node,'draft').undo();
ide.ideForgetDocument(node,'draft', true);
// @ts-expect-error Document keys are strings.
ide.ideShowDocument(node,123);
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
