import {BagResolver} from '@genrojs/bag';

/** A nonblocking device value; outcomes are written by its owning handler. */
export class DeviceResolver extends BagResolver {
    constructor(handler, name, cacheTime) {
        super({cacheTime});
        this.handler = handler;
        this.name = name;
        this.failed = false;
        this.writing = false;
        this.request = null;
        this.revision = 0;
        this.received = 0;
    }

    resolve({static: isStatic = false} = {}) {
        if (!isStatic && !this.handler.disposed && !this.writing && !this.request && !this.failed &&
            !this._node.attr.watching && this.expired) this.handler.refresh(this.name);
        return this.cachedValue;
    }

    reset() {
        super.reset();
        this.failed = false;
        this.revision++;
    }
}
