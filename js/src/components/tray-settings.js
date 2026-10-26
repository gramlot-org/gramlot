/** Compact geometry controls; Data owns values and popup visibility. */
import {SVG_NS} from '../renderer/attributes.js';
import {positionPopup} from './popup.js';

export function createTraySettings(box) {
    const doc=box.ownerDocument,controls={};
    for(const [key,caption,min,max,pathData] of [
        ['layer','Layer',-10,10,'M3 8 12 3l9 5-9 5-9-5Zm0 5 9 5 9-5M3 18l9 5 9-5'],
        ['scale','Zoom (%)',10,200,'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM6 10h8M10 6v8']
    ]) {
        const button=doc.createElement('button');button.type='button';
        button.className='tray-settings-button';button.dataset.kind=key;
        button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-expanded','false');
        const svg=doc.createElementNS(SVG_NS,'svg'),path=doc.createElementNS(SVG_NS,'path');
        svg.setAttribute('viewBox','0 0 24 26');svg.setAttribute('aria-hidden','true');
        path.setAttribute('d',pathData);path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');
        path.setAttribute('stroke-width','1.5');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');
        svg.append(path);button.append(svg);box.labelbox.labelBox.append(button);
        const popup=doc.createElement('div');popup.className='tray-settings-popup';
        popup.setAttribute('popover','auto');popup.setAttribute('role','dialog');
        const style=doc.createElement('style');style.textContent=`.tray-settings-popup{position:fixed;inset:auto;margin:0;padding:10px;min-width:64px;box-sizing:border-box;border:1px solid var(--gramlot-border-control,#b9c2ce);border-radius:7px;background:var(--gramlot-surface,#fff);color:var(--gramlot-ink,#203149);box-shadow:0 4px 14px #0002;font:12px system-ui;max-height:var(--gramlot-popup-available-height,90vh);overflow:auto}
          .tray-settings-popup:popover-open{display:grid;justify-items:center;gap:7px}
          .tray-settings-popup input{writing-mode:vertical-lr;direction:rtl;width:24px;height:130px;margin:0;touch-action:none;accent-color:var(--gramlot-brand-blue,#3766b5)}
          .tray-settings-popup output{font-weight:600;white-space:nowrap}`;
        const output=doc.createElement('output'),upper=doc.createElement('span'),lower=doc.createElement('span');
        upper.textContent=key==='layer'?'+10':'200%';lower.textContent=key==='layer'?'−10':'10%';
        const input=doc.createElement('input');input.type='range';input.min=String(min);input.max=String(max);input.step='1';
        input.setAttribute('aria-orientation','vertical');input.setAttribute('aria-label',caption);
        popup.append(style,output,upper,input,lower);
        controls[key]={button,popup,input,output};
    }
    function mount(tray,read,change) {
        for(const [key,{popup,input,button}] of Object.entries(controls)) {
            input.oninput=()=>{change(key,input.valueAsNumber/(key==='scale'?100:1));project(read());};
            popup.onbeforetoggle=event=>{
                if(event.newState==='closed'&&read().getItem(`settings.${key}Open`)===true)
                    read().setItem(`settings.${key}Open`,false);
            };
            popup.onkeydown=event=>{if(event.key==='Escape') {read().setItem(`settings.${key}Open`,false);button.focus();event.stopPropagation();}};
            if(popup.parentNode!==tray.shadowRoot)tray.shadowRoot.append(popup);
        }
    }
    function project(row) {
        for(const [key,{button,popup,input,output}] of Object.entries(controls)) {
            const value=row.getItem(key)*(key==='scale'?100:1),open=row.getItem(`settings.${key}Open`)===true;
            input.value=String(value);output.value=key==='scale'?`${Math.round(value)}%`:`Layer ${value}`;
            popup.setAttribute('aria-label',button.title);button.setAttribute('aria-expanded',String(open));
            if(open) {
                // Anchor once: zoom moves the trigger, but must not move the slider under the pointer.
                if(!popup.matches(':popover-open')) {popup.showPopover();positionPopup(popup,button,{align:'end'});}
            }
            else if(popup.matches(':popover-open'))popup.hidePopover();
        }
    }
    function open(row,key) {
        const next=row.getItem(`settings.${key}Open`)!==true;
        for(const kind of Object.keys(controls))row.setItem(`settings.${kind}Open`,kind===key&&next);
        project(row);if(next)controls[key].input.focus();
    }
    function remove(){for(const {popup} of Object.values(controls))popup.remove();}
    return {controls,mount,project,open,remove};
}
