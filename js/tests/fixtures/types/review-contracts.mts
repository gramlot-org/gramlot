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
const externalTree = page.src.source.getNode('main.tree');
externalTree?.setTreeStore(new Bag());
externalTree?.setTreeStore(null);
// @ts-expect-error A Source-linked tree requires a Bag, not an arbitrary object.
externalTree?.setTreeStore({});

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

// Optional parser declarations retain markdown-it's constructor and instance API.
import {loadMarkdown} from '../../../src/index.js';
import MarkdownIt from '@gramlot/gramlot/markdown';
const directParser = new MarkdownIt({html: false});
const renderedMarkdown: string = directParser.render('# Heading');
void loadMarkdown().then(({default: Parser}) => {
    const parser = new Parser({html: true});
    const html: string = parser.render(renderedMarkdown);
    return html;
});
import {BrowserCameraProvider} from '../../../src/index.js';
declare const cameraDocument: Document;
const browserCamera = new BrowserCameraProvider({document:cameraDocument});
page.dvc.attach(browserCamera);
const cameraPhoto: Promise<{url:string;format:string}> = browserCamera.takePhoto(new AbortController().signal);
void cameraPhoto;

// The package root preserves the public native database and sensor types.
import type {DeviceDatabase, DeviceOrientation, DeviceMotionEvent} from '../../../src/index.js';
declare const deviceDatabase: DeviceDatabase;
const deviceRows: Promise<Record<string, unknown>[]> = deviceDatabase.query('select 1');
const orientation: DeviceOrientation = {type: 'portrait', direction: 'primary', timestamp: 0};
const motion: DeviceMotionEvent = {kind: 'sample', x: 0, y: 0, z: 0, timestamp: 0};
void [deviceRows, orientation, motion];
