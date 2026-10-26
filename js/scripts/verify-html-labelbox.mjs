/** Isolated Python-authored experiment. --serve keeps a local preview on port 8101. */
import {execFileSync} from 'node:child_process';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
const python=process.env.GRAMLOT_TEST_PYTHON;
if(!python)throw Error('Set GRAMLOT_TEST_PYTHON to the configured Python interpreter');
const source=execFileSync(python,[new URL('../tests/fixtures/live/html-labelbox.py',import.meta.url).pathname],{encoding:'utf8'}).trim();
const bundle=await build({entryPoints:[new URL('../tests/fixtures/live/html-labelbox.js',import.meta.url).pathname],bundle:true,write:false,format:'iife'});
const serve=process.argv[2]==='--serve';
async function workspaceScrollAreas(page) {
    return page.locator('#composed-workspace').evaluate(frame => {
        const found=[];
        function visit(root) {
            for(const element of root.children) {
                const style=getComputedStyle(element);
                if(element.clientWidth && element.clientHeight && !['INPUT','TEXTAREA'].includes(element.tagName)) {
                    const x=/auto|scroll/.test(style.overflowX) && element.scrollWidth>element.clientWidth+1;
                    const y=/auto|scroll/.test(style.overflowY) && element.scrollHeight>element.clientHeight+1;
                    if(x||y)found.push({tag:element.tagName,cls:element.className,id:element.id,x,y,
                        width:element.clientWidth,scrollWidth:element.scrollWidth,height:element.clientHeight,scrollHeight:element.scrollHeight});
                }
                if(element.shadowRoot)visit(element.shadowRoot);
                visit(element);
            }
        }
        visit(frame.parentElement.parentElement);
        return found;
    });
}
async function verifyWorkspaceSizing(page) {
    const frame=page.locator('#composed-workspace');
    for(const tab of ['Details','Options']) {
        await frame.getByRole('tab',{name:tab,exact:true}).click();
        for(const width of [220, Math.min(440,await page.locator('#composed-tray').evaluate(el=>el.clientWidth-16)),240]) {
            await page.evaluate(width=>window.resizeComposedWorkspace(width,430),width);
            await page.evaluate(()=>new Promise(requestAnimationFrame));
            const areas=await workspaceScrollAreas(page);
            if(areas.length)throw Error(`Unnecessary workspace scrollbars (${tab}, ${width}): ${JSON.stringify(areas)}`);
        }
    }
    await page.evaluate(()=>window.resizeComposedWorkspace(220,320));
    await page.evaluate(()=>new Promise(requestAnimationFrame));
    const areas=await workspaceScrollAreas(page);
    if(areas.length!==1 || areas[0].tag!=='GRAMLOT-CONTENT-PANE' || areas[0].x || !areas[0].y)
        throw Error(`Small workspace must scroll only tab content: ${JSON.stringify(areas)}`);
    const notes=frame.getByRole('textbox',{name:'Notes',exact:true});
    await notes.scrollIntoViewIfNeeded();
    if(!await notes.isVisible())throw Error('Small workspace hides notes');
    await page.evaluate(()=>window.resizeComposedWorkspace(240,430));
    await page.evaluate(()=>new Promise(requestAnimationFrame));
    if((await workspaceScrollAreas(page)).length)throw Error('Workspace scrollbars remain after expansion');
    await page.evaluate(()=>window.checkComposedWorkspace());
}
async function trayCommand(page,name) {
    const toolbar=page.locator('#tray-toolbar');
    const command=toolbar.getByLabel(name,{exact:true});
    if(!await command.isVisible())await toolbar.getByRole('button',{name:'More commands',exact:true}).click();
    await command.click();
}
async function verifyGridToolbar(page) {
    const grid=page.getByRole('spinbutton',{name:'Grid px',exact:true});
    const angle=page.getByRole('spinbutton',{name:'Shift °',exact:true});
    const visible=page.getByRole('checkbox',{name:'Grid',exact:true});
    const tray=page.locator('#composed-tray');
    await grid.fill('17');await grid.press('Tab');
    await angle.fill('22.5');await angle.press('Tab');await visible.check();
    const projection=await tray.evaluate(el=>({size:getComputedStyle(el,'::before').backgroundSize,display:getComputedStyle(el,'::before').display,angle:el.parameters.rotationStep}));
    if(!projection.size.split(', ').every(size=>size==='17px 17px')||projection.display!=='block'||projection.angle!==22.5)
        throw Error(`Grid toolbar binding: ${JSON.stringify(projection)}`);
    await trayCommand(page,'Save layout');
    await grid.fill('0');await grid.press('Tab');await visible.uncheck();
    await angle.fill('5');await angle.press('Tab');
    await trayCommand(page,'Restore layout');
    if(await grid.inputValue()!=='17'||await angle.inputValue()!=='22.5'||!await visible.isChecked())
        throw Error('Restore lost tray settings');
    await grid.fill('10');await grid.press('Tab');await visible.uncheck();
    await angle.fill('15');await angle.press('Tab');
}
async function verifyLayoutToolbar(page) {
    const frame=page.locator('#composed-workspace');
    await trayCommand(page,'Save layout');
    const saved=await page.evaluate(()=>window.readSavedLayout());
    await page.evaluate(()=>window.resizeComposedWorkspace(230,410));
    if(await page.evaluate(()=>window.readComposedLayout())===saved)throw Error('Trial geometry did not change');
    if(await page.evaluate(()=>window.readSavedLayout())!==saved)throw Error('Saved layout aliases current Data');
    await trayCommand(page,'Restore layout');
    if(await page.evaluate(()=>window.readComposedLayout())!==saved)throw Error('Restore lost layout fields');
    await trayCommand(page,'Lock layout');
    const tray=page.locator('#composed-tray');
    if(await tray.getByRole('button',{name:'Resize Workspace',exact:true}).isVisible()
        ||await tray.getByRole('button',{name:'Rotate Workspace',exact:true}).isVisible()
        ||await tray.getByRole('button',{name:'Layer for Workspace',exact:true}).isVisible())throw Error('Locked layout still shows chrome');
    const before=await page.evaluate(()=>window.readComposedLayout());
    const title=await frame.evaluate(el=>{const r=el.parentElement.parentElement.labelbox.labelBox.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
    await page.mouse.move(title.x,title.y);await page.mouse.down();await page.mouse.move(title.x+30,title.y+20);await page.mouse.up();
    if(await page.evaluate(()=>window.readComposedLayout())!==before)throw Error('Locked layout moved');
    await frame.getByRole('textbox',{name:'Owner',exact:true}).fill('Editable while locked');
    if((await page.evaluate(()=>window.checkComposedWorkspace())).owner!=='Editable while locked')throw Error('Lock disabled widget content');
    await trayCommand(page,'Lock layout');
    if(!await tray.getByRole('button',{name:'Resize Workspace',exact:true}).isVisible())throw Error('Unlock did not restore chrome');
}
async function setZoom(page,title,value) {
    await page.getByRole('button',{name:`Zoom for ${title}`,exact:true}).click();
    const popup=page.getByRole('dialog',{name:`Zoom for ${title}`,exact:true});
    const slider=popup.getByRole('slider',{name:'Zoom (%)',exact:true});
    if(await slider.getAttribute('aria-orientation')!=='vertical')throw Error('Zoom slider is not vertical');
    await slider.evaluate((el,value)=>{el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}));},value);
    if(await popup.evaluate(el=>getComputedStyle(el).transform)!=='none')throw Error('Slider popup transformed with card');
    await slider.press('Escape');
}
async function verifyZoomDrag(page) {
    await page.getByRole('button',{name:'Zoom for Customer',exact:true}).click();
    const popup=page.getByRole('dialog',{name:'Zoom for Customer',exact:true});
    const slider=popup.getByRole('slider',{name:'Zoom (%)',exact:true});
    const rect=await slider.boundingBox(),origin=await popup.boundingBox();
    const start=rect.y+8+(rect.height-16)*(200-100)/190;
    await page.mouse.move(rect.x+rect.width/2,start);await page.mouse.down();
    let previous=(await page.evaluate(()=>window.readTrayPosition())).scale;
    for(let step=1;step<=6;step++) {
        await page.mouse.move(rect.x+rect.width/2,start+step*5);
        await page.evaluate(()=>new Promise(requestAnimationFrame));
        const current=await popup.boundingBox();
        if(Math.abs(current.x-origin.x)>1||Math.abs(current.y-origin.y)>1)
            throw Error(`Zoom popup moved under pointer: ${JSON.stringify({origin,current})}`);
        const scale=(await page.evaluate(()=>window.readTrayPosition())).scale;
        if(scale>previous+.01)throw Error('Zoom reversed while dragging down');
        previous=scale;
    }
    await page.mouse.up();
    if(previous>.75)throw Error(`Zoom drag did not update Data: ${previous}`);
    await page.evaluate(()=>window.checkTrayContent());
    await slider.press('Escape');await setZoom(page,'Customer',100);
}
async function rotateBy(page,title,degrees) {
    const grip=page.getByRole('button',{name:`Rotate ${title}`,exact:true}),key=degrees>0?'ArrowRight':'ArrowLeft';
    for(let n=0;n<Math.floor(Math.abs(degrees)/10);n++)await grip.press('Shift+'+key);
    for(let n=0;n<Math.abs(degrees)%10;n++)await grip.press(key);
}
async function verifyComposedWorkspace(page) {
    const frame=page.locator('#composed-workspace');
    await page.evaluate(()=>{window.checkComposedWorkspace=window.captureComposedWorkspace();});
    await frame.getByRole('textbox',{name:'Owner',exact:true}).fill('Grace');
    await frame.getByText('Apply',{exact:true}).click();
    if(!await frame.getByText('Grace',{exact:true}).isVisible())throw Error('Workspace toolbar did not update summary');
    await frame.getByRole('tab',{name:'Options',exact:true}).click();
    await frame.getByRole('textbox',{name:'Notes',exact:true}).fill('Keep this draft');
    await verifyWorkspaceSizing(page);
    await setZoom(page,'Workspace',60);
    await rotateBy(page,'Workspace',20);
    let state=await page.evaluate(()=>window.checkComposedWorkspace());
    if(state.owner!=='Grace'||state.notes!=='Keep this draft'||state.tab!=='options')throw Error('Workspace state lost on transform');
    await rotateBy(page,'Workspace',-20);
    await setZoom(page,'Workspace',100);
    await page.getByRole('button',{name:'Resize Workspace',exact:true}).press('Shift+ArrowRight');
    await frame.evaluate(el=>el.parentElement.parentElement.scrollIntoView({block:'center'}));
    const header=await frame.evaluate(el=>{const r=el.parentElement.parentElement.labelbox.labelBox.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
    await page.mouse.move(header.x,header.y);await page.mouse.down();await page.mouse.move(header.x+8,header.y+5);await page.mouse.up();
    state=await page.evaluate(()=>window.checkComposedWorkspace());
    if(state.notes!=='Keep this draft'||state.tab!=='options')throw Error('Workspace state lost after movement/resize');
    await frame.getByRole('tab',{name:'Details',exact:true}).click();
    if(await frame.getByRole('textbox',{name:'Owner',exact:true}).inputValue()!=='Grace')throw Error('Tab switch lost owner');
}
async function verifySelection(page) {
    const card=page.locator('#move-customer'),notes=page.locator('#move-notes');
    const initial=await card.evaluate(el=>{const box=el.parentElement.parentElement;return {width:box.offsetWidth,height:box.offsetHeight,background:getComputedStyle(box).backgroundColor};});
    await page.evaluate(()=>{window.checkTrayContent=window.captureTrayContent();});
    async function expectSelection(customer,notes) {
        const state=await page.evaluate(()=>window.readTraySelection());
        if(state.customer!==customer||state.notes!==notes)throw Error(`Selection mismatch: ${JSON.stringify(state)}`);
        if(await page.getByRole('checkbox',{name:'Customer selected',exact:true}).isChecked()!==customer
            ||await page.getByRole('checkbox',{name:'Notes selected',exact:true}).isChecked()!==notes)
            throw Error('Selection checkboxes diverged from Data');
    }
    await expectSelection(false,false);
    await card.getByRole('textbox',{name:'Name',exact:true}).click();await expectSelection(true,false);
    await notes.getByRole('textbox',{name:'Note',exact:true}).click({modifiers:['Shift']});await expectSelection(true,true);
    const selected=await card.evaluate(el=>{const box=el.parentElement.parentElement,s=getComputedStyle(box);return {width:box.offsetWidth,height:box.offsetHeight,background:s.backgroundColor,outline:s.outlineWidth,marked:box.hasAttribute('data-selected')};});
    if(!selected.marked||selected.outline!=='2px'||selected.width!==initial.width||selected.height!==initial.height||selected.background!==initial.background)
        throw Error(`Selection presentation changed layout/content: ${JSON.stringify(selected)}`);
    await card.getByRole('textbox',{name:'Name',exact:true}).click({modifiers:['Shift']});await expectSelection(false,true);
    await card.getByRole('textbox',{name:'Name',exact:true}).click();await expectSelection(true,false);
    await page.locator('#move-tray').evaluate(el=>el.scrollIntoView({block:'end'}));
    const tray=await page.locator('#move-tray').boundingBox();
    await page.mouse.click(tray.x+tray.width-8,tray.y+tray.height-8);await expectSelection(false,false);
    await page.getByRole('checkbox',{name:'Customer selected',exact:true}).check();
    await page.getByRole('checkbox',{name:'Notes selected',exact:true}).check();await expectSelection(true,true);
    await page.evaluate(()=>window.restoreTrayPosition());await expectSelection(true,true);
    await page.evaluate(()=>window.checkTrayContent());
}
async function verifyMarqueeSelection(page) {
    const tray=page.locator('#move-tray');await tray.scrollIntoViewIfNeeded();
    const rect=await tray.boundingBox();
    await page.mouse.move(rect.x+8,rect.y+8);await page.mouse.down();
    let selected=await page.evaluate(()=>window.readTraySelection());
    if(selected.customer||selected.notes)throw Error('Empty rectangle start did not clear selection');
    await page.mouse.move(rect.x+rect.width-8,rect.y+rect.height-8,{steps:6});
    selected=await page.evaluate(()=>window.readTraySelection());
    if(!selected.customer||!selected.notes)throw Error('Rectangle did not select both cards');
    if(!await tray.locator('.tray-marquee').isVisible())throw Error('Selection rectangle is invisible');
    await page.mouse.up();
    if(await tray.locator('.tray-marquee').count())throw Error('Rectangle remained after release');
    await page.evaluate(()=>window.checkTrayContent());
}
async function verifyGroupMovement(page) {
    const card=page.locator('#move-customer');
    await card.scrollIntoViewIfNeeded();
    const before=await page.evaluate(()=>window.readTrayGroup());
    const header=await card.evaluate(el=>{const r=el.parentElement.parentElement.labelbox.labelBox.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
    await page.mouse.move(header.x,header.y);await page.mouse.down();
    await page.mouse.move(header.x+15,header.y+12,{steps:4});await page.mouse.up();
    const after=await page.evaluate(()=>window.readTrayGroup());
    for(let i=0;i<2;i++)if(Math.abs(after[i].left-before[i].left-15)>1||Math.abs(after[i].top-before[i].top-12)>1)
        throw Error(`Group spacing lost: ${JSON.stringify({before,after})}`);
    const selected=await page.evaluate(()=>window.readTraySelection());
    if(!selected.customer||!selected.notes)throw Error('Title drag lost multi-selection');
    await page.evaluate(()=>window.checkTrayContent());
    await page.getByRole('button',{name:'Reset movement test',exact:true}).click();
}
async function verifyLayerMenu(page) {
    const button=page.getByRole('button',{name:'Layer for Customer',exact:true});
    const before=await page.evaluate(()=>window.readTrayPosition());
    await button.click();
    const popup=page.getByRole('dialog',{name:'Layer for Customer',exact:true});
    const slider=popup.getByRole('slider',{name:'Layer',exact:true});
    if(await slider.getAttribute('aria-orientation')!=='vertical')throw Error('Layer slider is not vertical');
    for(let i=0;i<20;i++)await slider.press('ArrowUp');
    if((await page.evaluate(()=>window.readTrayPosition())).layer!==10)throw Error(`Upper layer limit: ${JSON.stringify(await page.evaluate(()=>window.readTrayPosition()))}, input=${await slider.inputValue()}`);
    for(let i=0;i<20;i++)await slider.press('ArrowDown');
    if((await page.evaluate(()=>window.readTrayPosition())).layer!==-10)throw Error('Lower layer limit failed');
    await slider.press('Escape');
    if(await popup.isVisible())throw Error('Layer popup did not close with Escape');
    await setLayer(page,'Customer',0);
    const after=await page.evaluate(()=>window.readTrayPosition());
    if(after.left!==before.left||after.top!==before.top||after.width!==before.width||after.height!==before.height)
        throw Error('Layer control moved or resized the card');
}
async function verifyTransforms(page) {
    await setZoom(page,'Customer',60);
    await rotateBy(page,'Customer',30);
    let pose=await page.evaluate(()=>window.readTrayPosition());
    if(pose.rotation!==30||pose.scale!==.6)throw Error(`Transform controls: ${JSON.stringify(pose)}`);
    await page.evaluate(()=>window.checkTrayContent());
    await page.evaluate(()=>window.restoreTrayPosition());
    if(JSON.stringify(pose)!==JSON.stringify(await page.evaluate(()=>window.readTrayPosition())))throw Error('Transforms did not roundtrip');
    await setZoom(page,'Customer',200);pose=await page.evaluate(()=>window.readTrayPosition());
    if(pose.scale<=.6||pose.scale>=2)throw Error('Zoom ignored tray boundary');
    await setZoom(page,'Customer',60);await rotateBy(page,'Customer',-45);
    if((await page.evaluate(()=>window.readTrayPosition())).rotation!==-15)throw Error('Negative grip rotation failed');
    await rotateBy(page,'Customer',15);await setZoom(page,'Customer',100);
}
async function verifyRotationGrip(page) {
    await setZoom(page,'Customer',60);
    await page.locator('#move-customer').evaluate(el=>el.parentElement.parentElement.scrollIntoView({block:'center'}));
    const handle=page.getByRole('button',{name:'Rotate Customer',exact:true});
    const grip=await handle.boundingBox();
    const center=await page.locator('#move-customer').evaluate(el=>{const r=el.parentElement.parentElement.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
    const x=grip.x+grip.width/2,y=grip.y+grip.height/2,dx=x-center.x,dy=y-center.y,a=20*Math.PI/180;
    await page.mouse.move(x,y);await page.mouse.down();
    await page.mouse.move(center.x+dx*Math.cos(a)-dy*Math.sin(a),center.y+dx*Math.sin(a)+dy*Math.cos(a),{steps:6});await page.mouse.up();
    const pose=await page.evaluate(()=>window.readTrayPosition());
    // WebKit's delivered mouse coordinates can be rounded to CSS pixels; at
    // 60% zoom this permits a sub-degree angular difference. Unit tests use exact coordinates.
    if(Math.abs(pose.rotation-20)>1)throw Error(`Rotation grip: ${JSON.stringify(pose)}`);
    await page.evaluate(()=>window.checkTrayContent());
    await page.evaluate(()=>window.resetTrayTransform());

}
async function setLayer(page, title, value) {
    const field=page.getByRole('textbox',{name:title+' layer',exact:true});
    await field.focus();await field.fill(String(value));await field.press('Enter');return field;
}
async function verifyLayers(page) {
    const card=page.locator('#move-customer');
    const handle=page.getByRole('button',{name:'Resize Customer',exact:true});
    await handle.scrollIntoViewIfNeeded();
    await page.evaluate(()=>{window.checkTrayContent=window.captureTrayContent();});
    const grip=await handle.boundingBox();
    await page.mouse.move(grip.x+grip.width/2,grip.y+grip.height/2);await page.mouse.down();
    await page.mouse.move(grip.x+grip.width/2,grip.y+grip.height/2+150);await page.mouse.up();
    if((await page.evaluate(()=>window.readTrayPosition())).height!==330)throw Error('Same-layer resize did not stop at contact');
    await page.getByRole('button',{name:'Reset movement test',exact:true}).click();
    async function moveDown(delta) {
        await card.evaluate(el=>el.parentElement.parentElement.scrollIntoView({block:'center'}));
        const p=await card.evaluate(el=>{const r=el.parentElement.parentElement.labelbox.labelBox.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};});
        await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(p.x,p.y+delta);await page.mouse.up();
    }
    await moveDown(200);
    if((await page.evaluate(()=>window.readTrayPosition())).top!==54)throw Error('Same-layer drag crossed the obstacle');
    await setLayer(page,'Customer',1);await moveDown(100);
    if((await page.evaluate(()=>window.readTrayPosition())).top!==154)throw Error(`Other-layer drag: ${JSON.stringify(await page.evaluate(()=>window.readTrayPosition()))}`);
    await page.getByRole('button',{name:'Layer for Customer',exact:true}).click();
    const layerSlider=page.getByRole('dialog',{name:'Layer for Customer',exact:true}).getByRole('slider',{name:'Layer',exact:true});
    await layerSlider.press('ArrowDown');
    if((await page.evaluate(()=>window.readTrayPosition())).layer!==1 || await layerSlider.inputValue()!=='1')
        throw Error('Layer slider did not restore rejected layer');
    await layerSlider.press('Escape');
    const layerField=await setLayer(page,'Customer',0);
    if((await page.evaluate(()=>window.readTrayPosition())).layer!==1 || await layerField.inputValue()!=='1')
        throw Error(`Conflicting layer change: ${JSON.stringify(await page.evaluate(()=>window.readTrayPosition()))}, field=${await layerField.inputValue()}`);
    await setLayer(page,'Notes',2);await setLayer(page,'Customer',0);
    if((await page.evaluate(()=>window.readTrayPosition())).layer!==0)throw Error('Free target layer was refused');
    await page.evaluate(()=>window.checkTrayContent());
    await page.getByRole('button',{name:'Reset movement test',exact:true}).click();
    await setLayer(page,'Notes',1);
}
async function verifyResize(page) {
    const card=page.locator('#move-customer');
    const handle=page.getByRole('button',{name:'Resize Customer',exact:true});
    await handle.scrollIntoViewIfNeeded();
    await page.evaluate(()=>{window.checkTrayContent=window.captureTrayContent();});
    const before=await page.evaluate(()=>window.readTrayPosition());
    const grip=await handle.boundingBox();
    await page.mouse.move(grip.x+grip.width/2,grip.y+grip.height/2);await page.mouse.down();
    await page.mouse.move(grip.x+grip.width/2+20,grip.y+grip.height/2+30,{steps:5});await page.mouse.up();
    const after=await page.evaluate(()=>window.readTrayPosition());
    if(after.width!==before.width+20||after.height!==before.height+30||after.left!==before.left||after.top!==before.top)
        throw Error(`Resize geometry mismatch: ${JSON.stringify(after)}`);
    await page.evaluate(()=>window.checkTrayContent());
    await card.getByText('+10',{exact:true}).click();
    if(await page.evaluate(()=>window.readTrayLevel())!==45)throw Error('Toolbar binding failed after resize');
    await card.getByRole('slider').focus();await page.keyboard.press('ArrowRight');
    if(await page.evaluate(()=>window.readTrayLevel())!==46)throw Error('Slider binding failed after resize');
    await card.getByRole('button',{name:'Reset intensity',exact:true}).click();
    if(await page.evaluate(()=>window.readTrayLevel())!==35)throw Error('Button binding failed after resize');
    await page.evaluate(()=>window.restoreTrayPosition());
    await page.evaluate(()=>window.checkTrayContent());
    if(JSON.stringify(after)!==JSON.stringify(await page.evaluate(()=>window.readTrayPosition())))throw Error('Geometry restoration failed');
}
async function verifyMovement(page) {
    const card=page.locator('#move-customer');await card.scrollIntoViewIfNeeded();
    const field=card.locator('gramlot-textbox input');await field.fill('Edited before moving');
    await field.evaluate(el=>el.setSelectionRange(1,4));
    const header=await card.evaluate(el=>{
        const rect=el.parentElement.parentElement.labelbox.labelBox.getBoundingClientRect();
        return {x:rect.left+rect.width/2,y:rect.top+rect.height/2};
    });
    const before=await page.evaluate(()=>window.readTrayPosition());
    await page.mouse.move(header.x,header.y);await page.mouse.down();
    await page.mouse.move(header.x+18,header.y+32,{steps:5});await page.mouse.up();
    const after=await page.evaluate(()=>window.readTrayPosition());
    if(after.left!==before.left+18||after.top!==before.top+32)throw Error(`Drag did not update storepath: ${JSON.stringify(after)}`);
    await page.evaluate(()=>window.restoreTrayPosition());
    if(await field.inputValue()!=='Edited before moving' || await field.evaluate(el=>el.selectionStart)!==1)
        throw Error('Drag/restoration lost field content or selection');
    const restored=await page.evaluate(()=>window.readTrayPosition());
    if(JSON.stringify(after)!==JSON.stringify(restored))throw Error('TYTX position restoration failed');
    const bounds=await card.evaluate(el=>{
        const box=el.parentElement.parentElement,rect=box.getBoundingClientRect(),tray=box.parentElement.getBoundingClientRect();
        return rect.left>=tray.left&&rect.right<=tray.right&&rect.top>=tray.top&&rect.bottom<=tray.bottom;
    });
    if(!bounds)throw Error('Card escaped the tray');
    await card.scrollIntoViewIfNeeded();
    const limit=await card.evaluate(el=>{
        const box=el.parentElement.parentElement, rect=box.labelbox.labelBox.getBoundingClientRect();
        return {x:rect.left+rect.width/2,y:rect.top+rect.height/2,
            left:box.parentElement.clientWidth-box.offsetWidth,top:box.parentElement.clientHeight-box.offsetHeight};
    });
    await page.mouse.move(limit.x,limit.y);await page.mouse.down();
    await page.mouse.move(limit.x+5000,limit.y+5000);await page.mouse.up();
    const clamped=await page.evaluate(()=>window.readTrayPosition());
    if(clamped.left>limit.left+1e-7||clamped.top>limit.top+1e-7||Math.min(Math.abs(clamped.left-limit.left),Math.abs(clamped.top-limit.top))>1e-7)throw Error(`Tray bounds not applied: ${JSON.stringify(clamped)}`);
}
const server=createServer((req,res)=>{
    res.setHeader('Content-Type',req.url==='/app.js'?'text/javascript; charset=utf-8':'text/html; charset=utf-8');
    res.end(req.url==='/app.js'?bundle.outputFiles[0].text:`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Experimental HTML labelbox</title><style>body{margin:0;background:#f1f4f8}input{box-sizing:border-box} .gramlot-labelbox{min-width:0}</style><main id="gramlot-root"></main><script type="application/json" id="source">${source.replaceAll('<','\\u003c')}</script><script src="/app.js"></script>`);
});
await new Promise(resolve=>server.listen(serve?8101:0,'127.0.0.1',resolve));
if(serve)console.log('Experimental preview: http://127.0.0.1:8101/');
else {
    const engine=process.argv[2]??'chromium';
    if(!['chromium','webkit'].includes(engine))throw Error('Expected chromium or webkit');
    const browsers=createRequire(import.meta.url)('playwright');let browser;
    try {
        browser=await browsers[engine].launch({headless:true});const page=await browser.newPage(),errors=[];
        page.on('pageerror',e=>{errors.push(e.stack);console.error(e.stack);});await page.goto(`http://127.0.0.1:${server.address().port}`);
        if(errors.length)throw Error(errors.join('\n'));
        await verifyGridToolbar(page);
        await verifyComposedWorkspace(page);
        await verifyLayoutToolbar(page);
        await page.getByText('Instructions and additional checks',{exact:true}).click();
        await verifySelection(page);
        await verifyMarqueeSelection(page);
        await verifyGroupMovement(page);
        await verifyLayerMenu(page);
        await verifyZoomDrag(page);
        await verifyTransforms(page);
        await verifyRotationGrip(page);
        await verifyLayers(page);
        await verifyResize(page);
        await verifyMovement(page);
        console.log(`${engine}: ${await page.evaluate(()=>window.exerciseHtmlLabelbox())}`);
        await page.setViewportSize({width:390,height:844});await page.reload();
        await verifyGridToolbar(page);
        await verifyComposedWorkspace(page);
        await verifyLayoutToolbar(page);
        await page.getByText('Instructions and additional checks',{exact:true}).click();
        await verifySelection(page);
        await verifyMarqueeSelection(page);
        await verifyGroupMovement(page);
        await verifyLayerMenu(page);
        await verifyZoomDrag(page);
        await verifyTransforms(page);
        await verifyRotationGrip(page);
        await verifyLayers(page);
        await verifyResize(page);
        await verifyMovement(page);
        console.log(`${engine} narrow: ${await page.evaluate(()=>window.exerciseHtmlLabelbox())}`);
        if(errors.length)throw Error(errors.join('\n'));
    }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
