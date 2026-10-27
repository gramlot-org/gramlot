import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';

function page() {
    const {window} = new JSDOM('<main></main>', {url:'https://example.test', runScripts:'dangerously'});
    const app = new Gramlot({document:window.document, element:window.document.querySelector('main'), transport:false});
    return {app, window};
}

test('native form action rejects javascript URLs in literal, dialect and Data paths', () => {
    for (const value of ['javascript:alert(1)', ' \tjava\nscript:alert(1)', '^url']) {
        const builder = new GramlotBuilder();
        builder.data.setItem('url', 'javascript:alert(1)');
        builder.root.form({html_action:value});
        assert.throws(() => builder.render(), /javascript: URL/);
        const {app, window} = page();
        try {
            app.data.setItem('url', 'javascript:alert(1)');
            assert.throws(() => app.src.startSource(builder.source), /javascript: URL/);
            assert.equal(window.document.querySelector('form'), null);
        } finally { app.dispose(); window.close(); }
    }
    const builder = new GramlotBuilder();
    builder.root.form({html_action:'/submit'});
    assert.match(builder.render(), /action="\/submit"/);
});

test('script executable text and URLs cannot be read from Data, even before a value exists', () => {
    const authors = [
        root => root.script('^code'), root => root.script('=code'),
        root => root.script('==this.GET("code")'),
        root => root.script({src:'^url'}), root => root.script({html_src:'=url'}),
        root => root.script({html_SRC:'^url'}),
        root => root.script({_text:'^code'}),
        root => root.script({src:'^url:={}'})
    ];
    for (const author of authors) {
        const builder = new GramlotBuilder();
        author(builder.root);
        assert.throws(() => builder.render(), /script.*(literal Source|inline code)/);
        const {app, window} = page();
        try {
            app.data.setItem('code', 'window.scriptAttack = 1');
            app.data.setItem('url', 'data:text/javascript,window.scriptAttack=1');
            assert.throws(() => app.src.startSource(builder.source), /script.*(literal Source|inline code)/);
            assert.equal(window.scriptAttack, undefined);
            assert.equal(window.document.querySelector('script'), null);
        } finally { app.dispose(); window.close(); }
    }
});

test('literal Source script runs, but later replacement code and URLs are refused', () => {
    const {app, window} = page();
    const builder = new GramlotBuilder();
    builder.root.script('window.literalScript = 1', {nodeId:'script'});
    try {
        app.src.startSource(builder.source);
        assert.equal(window.literalScript, 1);
        const node = app.src.binding.nodeIds.get('script');
        assert.throws(() => node.setValue('window.scriptAttack = 1'), /only as received with the Source/);
        assert.equal(window.scriptAttack, undefined);
    } finally { app.dispose(); window.close(); }
    const external = new GramlotBuilder();
    external.root.script({src:'/trusted.js'});
    assert.match(external.render(), /src="\/trusted.js"/);
});

test('live script URL replacement and newly inserted unactivated scripts are refused', () => {
    const {app, window} = page();
    const builder = new GramlotBuilder();
    builder.root.script({nodeId:'script', src:'/trusted.js'});
    try {
        app.src.startSource(builder.source);
        const node = app.src.binding.nodeIds.get('script');
        assert.throws(() => node.setAttr({src:'data:text/javascript,window.scriptAttack=1'}), /only as received with the Source/);
        assert.equal(window.document.querySelector('script').getAttribute('src'), '/trusted.js');
        assert.throws(() => app.src.builder.root.script('window.scriptAttack=1'), /only as received with the Source/);
        assert.equal(window.scriptAttack, undefined);
    } finally { app.dispose(); window.close(); }
});

test('Data widget attributes cannot override a script URL through its node value', () => {
    const {app, window} = page();
    const builder = new GramlotBuilder(); builder.root.script('^code', {src:'/trusted.js'});
    try {
        app.data.setItem('code', '', {_wdg:{src:'data:text/javascript,window.scriptAttack=1'}});
        assert.throws(() => app.src.startSource(builder.source), /script.*(literal Source|inline code)/);
        assert.equal(window.document.querySelector('script'), null);
        assert.equal(window.scriptAttack, undefined);
    } finally { app.dispose(); window.close(); }
});

test('object data rejects script URLs in literal, dialect and bound projections', () => {
    for (const attribute of ['data','html_data','html_DATA']) {
        for (const value of ['javascript:alert(1)', ' \tjava\nscript:alert(1)', '^url']) {
            const builder = new GramlotBuilder();
            builder.data.setItem('url', 'javascript:alert(1)');
            builder.root.object({[attribute]:value});
            assert.throws(() => builder.render(), /javascript: URL/);
            const {app, window} = page();
            try {
                app.data.setItem('url', 'javascript:alert(1)');
                assert.throws(() => app.src.startSource(builder.source), /javascript: URL/);
                assert.equal(window.document.querySelector('object'), null);
            } finally {app.dispose(); window.close();}
        }
    }
    const builder = new GramlotBuilder();
    builder.root.object({data:'/report.pdf'});
    assert.match(builder.render(), /data="\/report.pdf"/);
});


test('javascript URL scheme matching is ASCII, matching Python',()=>{
    const b=new GramlotBuilder();
    b.root.a('Non-ASCII scheme',{href:'javaſcript:alert(1)'});
    assert.doesNotThrow(()=>b.render());
    const invalid=new GramlotBuilder();invalid.root.a('Invalid',{href:'JaVaScRiPt:alert(1)'});
    assert.throws(()=>invalid.render(),/javascript: URL/);
});
