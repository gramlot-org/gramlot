// A page module that authors typed literals in main(): it imports only `@gramlot/gramlot/page`, the one name the
// import map of the browser resolves. On the server Node resolves the name to src/server/page.js.
import {Bag, Page as BasePage, createDecimal} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const prices = new Bag();
        prices.setItem('net', createDecimal('12.75'));
        root.dataSetter({destination_path: 'price', value: createDecimal('12.75')});
        root.dataSetter({destination_path: 'day', value: new Date(Date.UTC(2026, 9, 17))});
        root.dataSetter({destination_path: 'moment', value: new Date(Date.UTC(2026, 9, 17, 9, 30))});
        root.dataSetter({destination_path: 'time', value: new Date('1970-01-01T09:30:00Z')});
        root.dataSetter({destination_path: 'prices', value: prices});
    }
}

export class Logic {}
