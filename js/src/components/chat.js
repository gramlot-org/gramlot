/** Optional chat viewport; interactive contents are ordinary live Source children. */
import {defineCollection, defineComponent} from './registry.js';
import {Container} from './container.js';

export const ChatMessages = defineComponent({
    name: 'chatMessages', tag: 'gramlot-chat-messages', base: Container, subTags: '*',
    implementation: Base => class extends Base {
        constructor() {
            super();
            const style = this.ownerDocument.createElement('style');
            style.textContent = `:host{height:100%;min-height:0;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable}
                .control-box{padding:20px max(20px,calc((100% - 880px)/2))}
                ::slotted(article){box-sizing:border-box;margin:0 0 24px;padding:16px 20px;border-radius:18px;
                    line-height:1.6;overflow-wrap:anywhere;background:var(--gramlot-chat-assistant-background,
                    color-mix(in srgb,var(--gramlot-surface-subtle,#eee) 88%,#628099))}
                ::slotted(article[data-role=user]){width:fit-content;max-width:85%;margin-left:auto;padding:12px 18px;
                    border-radius:20px;background:var(--gramlot-chat-bubble,var(--gramlot-surface-subtle,#eee))}`;
            this.shadowRoot.append(style);
        }
        connectedCallback() {
            this.setAttribute('role','log');
            this.setAttribute('aria-label','Conversation messages');
            this.setAttribute('aria-live','polite');
            this.tabIndex=0;
        }
    }
});
export default defineCollection({name:'chat', components:[ChatMessages]});
