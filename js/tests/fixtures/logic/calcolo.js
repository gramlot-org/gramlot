import {Page as BasePage} from '../../../src/adapters/page.js';

/** The JavaScript twin of calcolo.py; data-elements in the object form (genropy/genro-builders-js#15). */
export class Page extends BasePage {
    static title = 'Named logic fixture';
    static js_requires = 'business,gui,gnrcomponents/settingmanager';

    main(root) {
        const order = root.div({datapath: 'ordine'});
        order.input({value: '^.prezzo'});
        order.dataFormula({result_path: '.sconto', func: 'business.calcolaSconto', prezzo: '^.prezzo'});
        order.dataController({func: 'gui.scroll', _fired: '^.vai'});
        order.dataFormula({result_path: '.totale', func: 'somma', a: '^.a', b: '^.b'});
        order.dataController({func: 'gnrcomponents.settingmanager.load', _fired: '^.carica'});
    }
}
