/** Shared viewport ownership; applications declare controls, not device edge offsets. */
const environments=new WeakMap();
const TOUCH=`
  --gramlot-toolbar-thickness:56px; --gramlot-toolbar-control-size:44px; --gramlot-toolbar-padding:6px;
`;
const EDGES=`
  box-sizing:border-box; height:100dvh; min-height:0; overflow:auto;
  padding:env(safe-area-inset-top) max(12px,env(safe-area-inset-right)) max(24px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left));
  background:var(--gramlot-chrome-background,color-mix(in srgb,var(--gramlot-surface-subtle,Canvas) 88%,var(--gramlot-ink,CanvasText) 12%)); color:var(--gramlot-ink,CanvasText);
`;
/** Static trusted CSS, exported so hosts can authorize its exact CSP hash. */
export const mobileEnvironmentStyle = `
          [data-gramlot-viewport]{--gramlot-toolbar-thickness:42px;--gramlot-toolbar-control-size:36px;--gramlot-toolbar-padding:2px 3px;}
          :root[data-gramlot-touch="on"] [data-gramlot-viewport]{${TOUCH}}
          :root[data-gramlot-touch="on"] [data-gramlot-viewport="root"]{${EDGES}}
          :root[data-gramlot-touch="on"] [data-gramlot-viewport="root"] > *{max-height:100%;}
          @media(pointer:coarse){
            :root:not([data-gramlot-touch="off"]) [data-gramlot-viewport]{${TOUCH}}
            :root:not([data-gramlot-touch="off"]) [data-gramlot-viewport="root"]{${EDGES}}
            :root:not([data-gramlot-touch="off"]) [data-gramlot-viewport="root"] > *{max-height:100%;}
          }
        `;
export class MobileEnvironment {
    static install({document,root}) {
        if(!environments.has(root))environments.set(root,new MobileEnvironment(document,root));
        return environments.get(root);
    }
    constructor(document,root) {
        this.document=document;this.root=root;this.releases=[];this.closed=false;
        root.setAttribute('data-gramlot-viewport',document.defaultView.parent===document.defaultView?'root':'child');
        let viewport=document.querySelector('meta[name="viewport"]');
        if(!viewport){viewport=document.createElement('meta');viewport.name='viewport';viewport.content='width=device-width,initial-scale=1';document.head.append(viewport);}
        const parts=viewport.content.split(',').map(s=>s.trim()).filter(s=>!s.startsWith('viewport-fit='));
        viewport.content=[...parts,'viewport-fit=cover'].join(',');
        this.style=document.createElement('style');
        this.style.textContent=mobileEnvironmentStyle;
        document.head.append(this.style);
    }
    subscribeAppearance(callback) {
        const window=this.document.defaultView, media=window.matchMedia('(prefers-color-scheme: dark)');
        const update=()=>{
            const scheme=window.getComputedStyle(this.document.documentElement).colorScheme;
            callback({dark:scheme==='dark'||(!['light','dark'].includes(scheme)&&media.matches)});
        };
        const observer=new window.MutationObserver(update);
        observer.observe(this.document.documentElement,{attributes:true,attributeFilter:['data-theme','style','class']});
        media.addEventListener('change',update);update();
        const release=()=>{observer.disconnect();media.removeEventListener('change',update);};
        this.releases.push(release);return release;
    }
    dispose(){if(this.closed)return;this.closed=true;for(const release of this.releases)release();this.style.remove();this.root.removeAttribute('data-gramlot-viewport');environments.delete(this.root);}
}
