import {Gramlot} from '../../../src/index.js';
import inputsCollection from '../../../src/components/inputs.js';
import layoutCollection from '../../../src/components/layout.js';
import {toTytx, fromTytx} from '@genrojs/tytx';
const app = new Gramlot({document,transport:false,collections:[inputsCollection,layoutCollection]});
app.src.startSource(document.getElementById('source').textContent);
window.readTrayPosition = () => Object.fromEntries(['left','top','width','height','layer','rotation','scale'].map(key=>[key,app.data.getItem(`workspace.customer.${key}`)]));
window.readTrayGroup = () => ['customer','notes'].map(key=>({left:app.data.getItem(`workspace.${key}.left`),top:app.data.getItem(`workspace.${key}.top`)}));
window.readTraySelection = () => Object.fromEntries(['customer','notes'].map(key=>[key,app.data.getItem(`workspace.${key}.selected`)]));
window.resetTrayTransform = () => {app.data.setItem('workspace.customer.rotation',0);app.data.setItem('workspace.customer.scale',1);};
window.readTrayLevel = () => app.data.getItem('customer.level');
window.captureTrayContent = () => {
    const card=document.getElementById('move-customer');
    const nodes=[...card.querySelectorAll('*')];
    const controls=nodes.filter(node=>node.control).map(node=>[node,node.control]);
    return () => {
        if(nodes.some(node=>!card.contains(node))||controls.some(([node,control])=>node.control!==control))
            throw Error('Resize recreated tray content');
    };
};
window.restoreTrayPosition = async () => {
    const card=document.getElementById('move-customer'), field=card.querySelector('gramlot-textbox'), control=field.control;
    const saved=toTytx(app.data.getItem('workspace'));
    app.data.setItem('workspace.customer.left',0);app.data.setItem('workspace.customer.top',0);
    app.data.setItem('workspace.customer.width',180);app.data.setItem('workspace.customer.height',180);
    app.data.setItem('workspace',fromTytx(saved));
    await new Promise(resolve=>requestAnimationFrame(resolve));
    if(document.getElementById('move-customer')!==card||field.control!==control)throw Error('Tray restoration recreated content');
};
window.readComposedLayout = () => toTytx(app.data.getItem('composed_layout'));
window.readSavedLayout = () => toTytx(app.data.getItem('saved_layout'));
window.resizeComposedWorkspace = (width,height) => {
    app.data.setItem('composed_layout.workspace.width',width);
    app.data.setItem('composed_layout.workspace.height',height);
};
window.captureComposedWorkspace = () => {
    const frame=document.getElementById('composed-workspace'),nodes=[...frame.querySelectorAll('*')];
    const controls=nodes.filter(node=>node.control).map(node=>[node,node.control]);
    return () => {
        if(document.getElementById('composed-workspace')!==frame||nodes.some(node=>!frame.contains(node))
            ||controls.some(([node,control])=>node.control!==control))throw Error('Composed workspace was recreated');
        return {owner:app.data.getItem('project.owner'),notes:app.data.getItem('project.notes'),tab:app.data.getItem('project.tab')};
    };
};
// Test-only probes: identities are observed, application state remains in Data/Source.
window.exerciseHtmlLabelbox = async () => {
    const original = document.getElementById('first-native'), record = app.src.renderer.elements.get(original);
    const node = record.node, binding = record.binding;
    original.focus(); original.setSelectionRange(1,2);
    app.data.setItem('demo.position','L'); app.data.setItem('demo.caption','Updated title');
    if (document.activeElement !== original || original.selectionStart !== 1) throw Error('Focus/selection lost');
    if (app.src.renderer.getDomNode(node) !== original || record.binding !== binding) throw Error('Identity lost');
    original.value='Grace'; original.dispatchEvent(new Event('input',{bubbles:true}));
    if (app.data.getItem('first.name') !== 'Grace' || app.data.getItem('second.name') !== 'Ada') throw Error('Relative binding changed');
    node.setAttr({hidden:true});
    if (record.presentation.getBoundingClientRect().height !== 0) throw Error('Hidden labelbox still occupies space');
    node.setAttr({hidden:false});
    if (record.presentation.getBoundingClientRect().height === 0) throw Error('Labelbox did not become visible');
    const native=document.getElementById('mixed-native');
    const host=document.getElementById('mixed-component'), control=host.control;
    if(host.shadowRoot.querySelector('.labelbox'))throw Error('Duplicate internal Labelbox');
    host.fieldLabel.click();if(host.shadowRoot.activeElement!==control)throw Error('Component label does not focus control');
    control.setSelectionRange(1,2);app.data.setItem('demo.position','R');
    if(host.control!==control||control.selectionStart!==1)throw Error('Component recreated or selection lost');
    control.value='Shared';control.dispatchEvent(new Event('input',{bubbles:true,composed:true}));
    if(native.value!=='Shared')throw Error('Mixed bindings diverged');
    const check=document.getElementById('mixed-check');check.fieldLabel.click();
    if(app.data.getItem('mixed.enabled')!==true)throw Error('Checkbox label activation lost');
    app.data.setItem('demo.position','L');
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const form=document.getElementById('mixed-native').closest('gramlot-formlet');
    const columns=new Map();
    for(const box of form.children){
        const left=box.getBoundingClientRect().left;
        const edge=box.labelbox.controlBox.getBoundingClientRect().left;
        if(columns.has(left)&&Math.abs(columns.get(left)-edge)>1)throw Error('Mixed formlet labels do not align');
        columns.set(left,edge);
    }
    if(document.documentElement.scrollWidth>innerWidth)throw Error('Horizontal overflow');
    app.data.setItem('demo.position','TL');app.data.setItem('demo.windowOpen',true);
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const win=document.getElementById('frame-window');
    const frameBox=win.firstElementChild,frame=frameBox.labelbox.controlBox.firstElementChild;
    const area=frameBox.labelbox.controlBox.getBoundingClientRect(),rect=frame.getBoundingClientRect();
    if(Math.abs(rect.height-area.height)>1||rect.height<100)throw Error(`Labelled frame does not fill its content area: ${rect.height}/${area.height}`);
    app.data.setItem('demo.windowOpen',false);
    return 'Python Source: shared HTML/component Labelbox, focus, selection, label activation, formlet alignment, independent bindings and visibility verified';
};
