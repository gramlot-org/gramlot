/** Manual browser fixture for raw Source attributes and the Clipboard icon target. */
import {Gramlot, GramlotBuilder, VisualEditorLogic} from '../../../src/index.js';
import {VisualEditor} from '../../../src/server/visual-editor.js';
import inputs from '../../../src/components/inputs.js';
import layout from '../../../src/components/layout.js';
import tree from '../../../src/components/tree.js';
import uploads from '../../../src/components/uploads.js';

const collections = [inputs, layout, tree, uploads];
const app = new Gramlot({document, transport:false, collections});
app.src.logicRegistry.register(VisualEditorLogic, {group:null, resource:'visual-editor-attributes'});
const builder = new GramlotBuilder(null, {collections});
new VisualEditor(builder.root, {height:'100dvh', catalogue:'html', canvasCss:['body { background:#f5f1e8; color:#213b33; font:16px Georgia,serif; } h1 { font-size:38px; margin:8px 0 24px; } a { color:#147356; } input { display:block; margin-top:24px; padding:10px; border:1px solid #899d92; border-radius:6px; font:16px system-ui; }']});
const page = builder.wrapSource(builder.source.getNode('visual.layout.center.design.pageRoot'));
page.setAttr({padding:'24px'});
page.h1('Site template', {node_label:'heading'});
page.a('Contact us', {node_label:'contact', href:'/contact', title:'Open contact page'});
page.input({node_label:'visitor',value:'^visitor',placeholder:'Try the live binding'});
page.div('Body content', {node_label:'body', kpress_slot:'body', margin_top:'24px'});
app.src.startSource(builder.toTytx());
