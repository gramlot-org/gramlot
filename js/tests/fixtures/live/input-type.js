import {Gramlot,GramlotBuilder} from '../../../src/index.js';
import inputs from '../../../src/components/inputs.js';

window.exerciseInputType=async()=>{
    const check=(ok,message)=>{if(!ok)throw Error(message);};
    const app=new Gramlot({document,transport:false,collections:[inputs]});
    const builder=new GramlotBuilder(null,{collections:[inputs]});
    app.data.setItem('kind','password');app.data.setItem('value','committed');
    builder.root.input({id:'field',type:'^kind',value:'^value'});
    app.data.setItem('selection',null);
    const select=builder.root.select({id:'choices',value:'^selection',multiple:'^many'});
    for(const value of ['a','b','c'])select.option(value,{value});
    builder.root.input({id:'files',type:'file',multiple:'^manyFiles'});
    for(const kind of ['input','radioButton']) {
        app.data.setItem(`${kind}.group`,`${kind}-old`);
        for(const [id,value] of [['moving',true],['old',false],['next',true]]) {
            app.data.setItem(`${kind}.${id}`,value);
            const attrs={id:`${kind}-${id}`,value:`^${kind}.${id}`,
                group:id==='moving'?`^${kind}.group`:`${kind}-${id}`};
            if(kind==='input')attrs.type='radio';
            builder.root[kind](attrs);
        }
    }
    app.src.startSource(builder.toTytx());
    const field=document.getElementById('field');
    const record=app.src.renderer.elements.get(field),node=record.node,adapter=record.control;
    const binding=record.binding;
    await window.typeDraft();
    field.setSelectionRange(1,3);
    app.data.setItem('kind','text');
    check(document.getElementById('field')===field&&record.control===adapter,'Same element and adapter');
    check(document.activeElement===field&&field.value==='draft','Focus and uncommitted draft');
    check(field.selectionStart===1&&field.selectionEnd===3,'Selection retained');
    check(app.data.getItem('value')==='committed','Type change does not commit draft');
    app.data.setItem('kind','password');
    check(field.value==='draft','Password setter retains draft');
    field.dispatchEvent(new Event('change',{bubbles:true}));
    check(app.data.getItem('value')==='draft','Existing binding still commits');
    app.data.setItem('kind','number');
    check(document.getElementById('field')===field&&field.value==='','Native number sanitization');
    check(app.data.getItem('value')==='draft','Sanitization does not rewrite Data');
    app.data.setItem('kind','text');check(field.value==='draft','Text restores stored value');
    app.data.setItem('value',false);app.data.setItem('kind','checkbox');
    check(!field.checked,'Checkbox projects boolean');
    field.click();check(app.data.getItem('value')===true,'Checkbox commits with its new adapter');
    app.data.setItem('kind','radio');check(field.checked,'Radio projects the same boolean');
    check(record.binding===binding&&app.src.renderer.records.get(node)===record,'Source and binding retained');
    const choices=document.getElementById('choices');
    const selectRecord=app.src.renderer.elements.get(choices),selectAdapter=selectRecord.control;
    const options=[...choices.options];
    choices.focus();
    app.data.setItem('many',true);app.data.setItem('selection',['a','c']);
    check(document.getElementById('choices')===choices&&selectRecord.control===selectAdapter,'Select and adapter retained');
    check(document.activeElement===choices&&options.every((o,i)=>o===choices.options[i]),'Select focus and option identity retained');
    check([...choices.selectedOptions].map(o=>o.value).join(',')==='a,c','Multiple selection projects');
    choices.options[1].selected=true;choices.dispatchEvent(new Event('change',{bubbles:true}));
    check(app.data.getItem('selection').join(',')==='a,b,c','Existing select binding commits arrays');
    app.data.setItem('single','b');selectRecord.node.setAttr({multiple:false,value:'^single'});
    check(document.getElementById('choices')===choices&&choices.value==='b','Same select returns to single mode');
    check(app.data.getItem('selection').join(',')==='a,b,c','Mode change does not convert Data');
    await window.chooseFile();
    const files=document.getElementById('files'),file=files.files[0];
    app.data.setItem('manyFiles',true);
    check(document.getElementById('files')===files&&files.files[0]===file,'File setter preserves selected file');
    app.data.setItem('manyFiles',false);
    check(files.files[0]===file&&await file.text()==='sample','Selected file remains readable');
    for(const kind of ['input','radioButton']) {
        const host=document.getElementById(`${kind}-moving`),control=kind==='input'?host:host.control;
        const radioRecord=app.src.renderer.elements.get(host),adapter=radioRecord.control;
        control.focus();app.data.setItem(`${kind}.group`,`${kind}-next`);
        check(document.getElementById(`${kind}-moving`)===host&&radioRecord.control===adapter,'Radio identity retained');
        check((kind==='input'?document:host.shadowRoot).activeElement===control,'Radio focus retained');
        for(const id of ['moving','old','next']) {
            check(app.data.getItem(`${kind}.${id}`)===false,'Both radio groups cleared in Data');
            const element=document.getElementById(`${kind}-${id}`);
            check(!(kind==='input'?element:element.control).checked,'Reset projected');
        }
        control.click();check(app.data.getItem(`${kind}.moving`)===true,'Radio binding still commits');
    }
    app.dispose();
    return 'radio group reset and identity (native/components); multiple setter, select options/focus/binding, selected files; input identity, adapter lifecycle, focus, draft, selection, binding and native sanitization';
};
