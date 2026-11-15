import {sharedModules} from '@gramlot/gramlot';
const read = name => sharedModules["./components/uploads.js"][name];
export const AttachmentManager = /* @__PURE__ */ read("AttachmentManager");
export const ImageUploader = /* @__PURE__ */ read("ImageUploader");
export const Uploader = /* @__PURE__ */ read("Uploader");
export default /* @__PURE__ */ read('default');
