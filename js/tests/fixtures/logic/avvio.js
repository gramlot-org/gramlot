import {Page as BasePage} from '../../../src/adapters/page.js';

/** The JavaScript twin of avvio.py; data-elements in the object form (genropy/genro-builders-js#15). */
export class Page extends BasePage {
    static title = 'Provider fixture';

    main(root) {
        root.div('^pronto', {id: 'pronto'});
        root.dataFormula({result_path: 'pronto', func: 'prepara', base: '=base', _init: true});
        root.dataSetter({destination_path: 'base', value: 'ok'});
    }
}
