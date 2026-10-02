import {Page as BasePage, source} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Worker page';
    main(root) {
        root.h1('Hello Worker');
        root.section(null, {id: 'details'}).p('Initial');
        return null;
    }
    details(root, {name}) { root.p(name); }
}
source(Page.prototype.details);
