import {Page as BasePage, source} from '../../../src/adapters/page.js';

export class Page extends BasePage {
    static title = 'Contract fixture';

    async main(root) {
        const panel = root.div('homer', {id: 'panel'});
        panel.span('bart', {id: 'child'});
        root.input(null, {value: 'marge', id: 'name'});
        root.p('<literal text>', {id: 'literal'});
    }
    details(root, {name = 'remote'} = {}) { root.div(name); }
}
source(Page.prototype.details);
