/**
 * What the page sends, receives, saves and downloads (`gramlot.inout`).
 *
 * @module
 */
import type {DomDocument} from './dom.d.ts';
import type {Bag} from '@genrojs/bag';
import type {Gramlot} from './gramlot.js';

/** The practical length limit of a mailto: URL in mail programs and browsers. */
export const MAILTO_LIMIT: number;

/**
 * What the page sends, receives, saves and downloads: `gramlot.inout`.
 * Every function takes the Data path of a Bag branch; a missing path or a value that is not a Bag
 * raises an Error.
 */
export class InOut {
    /** The page this object belongs to. */
    gramlot: Gramlot;
    /** The document used for links, file inputs and the window. */
    document: DomDocument;
    /** Create the inout object of `gramlot`. */
    constructor(gramlot: Gramlot, document: DomDocument);
    /** The Bag at `path` in the Data. */
    branch(path: string): Bag;
    /** One `relative.path: value` line per leaf of the branch at `path`. */
    mailText(path: string): string;
    /** The mailto: URL of `sendMail`; longer than `MAILTO_LIMIT` raises an Error. */
    mailtoUrl(path: string, email: string): string;
    /** Prepare an email to `email` in the mail program of the user, with the data at `path` as text lines. */
    sendMail(path: string, email: string): void;
    /** POST the data at `path` as a JSON object to `url`; rejects on a status out of 2xx. */
    sendHttp(path: string, url: string): Promise<Response>;
    /** Save the data at `path` as a TYTX file, which `restore` reads back with its exact types. */
    save(path: string, filename: string): void;
    /** Read a TYTX file chosen by the user into `path`; resolves with the restored Bag. Needs a user gesture. */
    restore(path: string): Promise<Bag>;
    /** Export the data at `path` as `'json'` or `'xml'`; types become text. */
    download(path: string, filename: string, format: 'json' | 'xml'): void;
    /** Hand `text` to the browser as a file named `filename`. */
    saveText(text: string, filename: string, type: string): void;
    /** Follow `url` through a link, as a download when `filename` is given. */
    open(url: string, filename?: string | null): void;
}
