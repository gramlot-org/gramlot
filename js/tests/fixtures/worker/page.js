import {Page as BasePage, source} from '@gramlot/native-html/page';

export class Page extends BasePage {
    static title = 'Worker native HTML';
    main(root) {
        root.h1('Hello Worker');
        root.section(null, {id: 'details'}).p('Initial');
        return null;
    }
    details(root, {name}) { root.p(name); }
}
source(Page.prototype.details);
