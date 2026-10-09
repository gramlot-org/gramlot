import {Page as BasePage} from '../../../src/server/page.js';

export class Page extends BasePage {
    static title = 'Contract fixture';

    async main(root) {
        const panel = root.div('homer', {id: 'panel'});
        panel.span('bart', {id: 'child'});
        root.input(null, {value: 'marge', id: 'name'});
        root.p('<literal text>', {id: 'literal'});
    }
    check_fragment(root, {text = 'check'} = {}) { root.span(text); }
    check_endpoint({value}) { return value; }
    check_endpoint_auth() { return 'allowed'; }
    check_endpoint_raise() { throw new Error('check'); }
}
Page.registerSource('check_fragment');
Page.registerEndpoint('check_endpoint');
Page.registerEndpoint('check_endpoint_auth', {auth: 'admin'});
Page.registerEndpoint('check_endpoint_raise');
