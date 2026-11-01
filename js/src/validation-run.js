/** One validation attempt lifecycle, independent of a mounted control. */
export class ValidationRun {
    epoch = 0;
    controller = null;
    cancel() {
        this.epoch++;
        this.controller?.abort();
        this.controller = null;
    }
    start(value, rules, context, execute, complete, pending = () => {}) {
        this.cancel();
        const controller = new AbortController(), epoch = this.epoch;
        this.controller = controller;
        const current = context.validationCurrent();
        const isCurrent = () => epoch === this.epoch && !controller.signal.aborted && current();
        const failure = error => ({value, modified:false, error:error.message, warnings:[], issues:[], datachanges:[]});
        let settled = false;
        const finish = result => {
            if (settled || !isCurrent()) return {ok:false};
            settled = true;
            this.controller = null;
            const outcome = {ok:!result.error, value:result.value, result, rules, isCurrent};
            complete(outcome);
            return outcome;
        };
        let result;
        try {
            if (rules.validate_timeout != null && (!Number.isInteger(rules.validate_timeout) || rules.validate_timeout <= 0)) {
                throw new TypeError('validate_timeout must be a positive integer in milliseconds.');
            }
            result = execute(value, rules, {...context, signal:controller.signal});
        } catch (error) { return finish(failure(error)); }
        if (!(result instanceof Promise)) return finish(result);
        pending();
        return new Promise(resolve => {
            let timer;
            const abort = () => { clearTimeout(timer); resolve({ok:false}); };
            controller.signal.addEventListener('abort', abort, {once:true});
            const settle = answer => {
                clearTimeout(timer);
                controller.signal.removeEventListener('abort', abort);
                try { resolve(finish(answer)); } catch (error) { context.reportError(error, 'Validation completion failed'); resolve({ok:false}); }
            };
            if (rules.validate_timeout != null) timer = setTimeout(() => {
                settle(failure(new Error('Validation timed out.'))); controller.abort();
            }, rules.validate_timeout);
            result.then(settle, error => settle(failure(error)));
        });
    }
}
