import {sharedModules} from '@gramlot/gramlot';
const read = name => sharedModules["./components/chat.js"][name];
export const ChatMessages = /* @__PURE__ */ read("ChatMessages");
export default /* @__PURE__ */ read('default');
