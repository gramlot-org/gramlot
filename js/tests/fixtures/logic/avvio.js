import {Page as BasePage} from '../../../src/adapters/page.js';

/** The JavaScript twin of avvio.py; data-elements in the object form (genropy/genro-builders-js#15).
 * One module for both pages: Page for the JS host, Logic for the JS and Python hosts. */
export class Page extends BasePage {
    static title = 'Provider fixture';

    main(root) {
        root.div('^pronto', {id: 'pronto'});
        root.dataFormula({result_path: 'pronto', func: 'prepara', base: '=base', _init: true});
        root.dataSetter({destination_path: 'base', value: 'ok'});
    }
}

/** Every call is counted on globalThis.gramlotSentinel. */
export class Logic {
    prepara(kwargs) {
        globalThis.gramlotSentinel = (globalThis.gramlotSentinel ?? 0) + 1;
        return `${kwargs.base}: ${kwargs._reason}`;
    }
}
