import {Bag} from '@genrojs/bag';

/** The practical length limit of a mailto: URL in mail programs and browsers. */
export const MAILTO_LIMIT = 2000;

/** A leaf value as text: a Date at UTC midnight is a date (TYTX `D`), any other Date a datetime. */
function leafText(value) {
    if (!(value instanceof Date)) return String(value ?? '');
    const text = value.toISOString();
    return text.endsWith('T00:00:00.000Z') ? text.slice(0, 10) : text;
}

/**
 * What the page sends, receives, saves and downloads: `gramlot.inout` (decisions of 2026-10-03).
 * Every function takes the Data path of a Bag branch; a missing path or a value that is not a Bag
 * raises an Error. There is no Python counterpart: this object belongs to the runtime in the
 * browser, and Python pages call it from inline code or from their Logic.
 */
export class InOut {
    constructor(gramlot, document) {
        this.gramlot = gramlot;
        this.document = document;
    }

    /** The Bag at path in the Data. */
    branch(path) {
        const value = this.gramlot.data.getItem(path);
        if (!(value instanceof Bag)) throw new Error(`gramlot.inout: no data Bag at '${path}'`);
        return value;
    }

    /** One `relative.path: value` line per leaf of the branch at path. */
    mailText(path) {
        const lines = [];
        const walk = (bag, prefix) => {
            for (const node of bag.getNodes()) {
                const label = prefix + node.label;
                if (node.value instanceof Bag) walk(node.value, `${label}.`);
                else lines.push(`${label}: ${leafText(node.value)}`);
            }
        };
        walk(this.branch(path), '');
        return lines.join('\n');
    }

    /** The mailto: URL of sendMail; longer than MAILTO_LIMIT raises an Error. */
    mailtoUrl(path, email) {
        const url = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(this.document.title)}` +
            `&body=${encodeURIComponent(this.mailText(path))}`;
        if (url.length > MAILTO_LIMIT) {
            throw new Error(`gramlot.inout.sendMail: the email of '${path}' is ${url.length} characters long, ` +
                `over the mailto: limit of ${MAILTO_LIMIT}; send it with sendHttp or save it as a file`);
        }
        return url;
    }

    /** Prepare an email to email in the mail program of the user, with the data at path as text lines. */
    sendMail(path, email) {
        this.open(this.mailtoUrl(path, email));
    }

    /** POST the data at path as a JSON object to url; resolves with the Response, rejects on a status out of 2xx. */
    async sendHttp(path, url) {
        const body = JSON.stringify(this.branch(path).asDict(false, false, true));
        const response = await this.document.defaultView.fetch(url, {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body,
        });
        if (!response.ok) throw new Error(`gramlot.inout.sendHttp: ${url} answered ${response.status}`);
        return response;
    }

    /** Save the data at path as a TYTX file, which restore reads back with its exact types. */
    save(path, filename) {
        this.saveText(this.branch(path).toTytx(), filename, 'application/json');
    }

    /** Read a TYTX file chosen by the user into path; resolves with the restored Bag. Needs a user gesture. */
    restore(path) {
        const input = this.document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        return new Promise((resolve, reject) => {
            input.addEventListener('change', async () => {
                try {
                    const bag = Bag.fromTytx(await input.files[0].text());
                    this.gramlot.data.setItem(path, bag);
                    resolve(bag);
                } catch (error) {
                    reject(new Error(`gramlot.inout.restore: the file is not a saved Gramlot branch: ${error.message}`,
                        {cause: error}));
                }
            }, {once: true});
            input.click();
        });
    }

    /** Export the data at path as 'json' (Bag.toJson) or 'xml' (Bag.toXml, inside one root element named
     * after the last segment of path); types become text. */
    download(path, filename, format) {
        if (!['json', 'xml'].includes(format)) {
            throw new Error(`gramlot.inout.download: format '${format}' is not 'json' or 'xml'`);
        }
        const bag = this.branch(path);
        if (format === 'json') {
            this.saveText(bag.toJson(false), filename, 'application/json');
        } else {
            const root = path.split('.').at(-1);
            this.saveText(`<?xml version='1.0' encoding='UTF-8'?>\n<${root}>${bag.toXml()}</${root}>`, filename,
                'application/xml');
        }
    }

    /** Hand text to the browser as a file named filename. */
    saveText(text, filename, type) {
        const window = this.document.defaultView;
        const url = window.URL.createObjectURL(new window.Blob([text], {type}));
        this.open(url, filename);
        // The download reads the Blob after the click returns.
        window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    }

    /** Follow url through a link, as a download when filename is given. */
    open(url, filename = null) {
        const link = this.document.createElement('a');
        link.href = url;
        if (filename !== null) link.download = filename;
        link.click();
    }
}
