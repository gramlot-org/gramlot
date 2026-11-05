/** Search capsule: uses shared field, surface and focus tokens in every theme. */
export const gridSearchLabelStyle = `.gramlot-search-labelbox{inline-size:var(--gramlot-search-width,240px);max-inline-size:100%;font-size:var(--gramlot-search-font-size,12px)}`;
export const gridSearchStyles = `
:host{display:inline-block;inline-size:100%;font-size:var(--gramlot-search-font-size,12px);max-inline-size:100%;min-inline-size:0}
.control-box{display:flex;align-items:stretch;position:relative;min-block-size:max(var(--gramlot-search-height,26px),var(--gramlot-touch-target,0px));
    border:1px solid var(--gramlot-border,GrayText);border-radius:999px;
    background:var(--gramlot-field-background,Canvas);color:var(--gramlot-ink,CanvasText);
    transition:border-color .15s}
.control-box:hover{border-color:var(--gramlot-border-control,GrayText)}
.control-box:focus-within{border-color:var(--gramlot-border-control,GrayText)}
input,button{font:inherit;color:inherit;min-inline-size:0;border:0;background:transparent}
.search-entry{position:relative;display:flex;align-items:center;flex:1;min-inline-size:0}
.search-lens{position:absolute;inset-inline-start:.65rem;pointer-events:none;color:var(--gramlot-text-secondary,GrayText);opacity:.6}
input{inline-size:100%;min-block-size:max(var(--gramlot-search-height,26px),var(--gramlot-touch-target,0px));padding:2px calc(2 * max(24px,var(--gramlot-touch-target,0px)) + 4px) 2px 26px;border-radius:999px;outline:none}
input::placeholder{color:var(--gramlot-text-secondary,GrayText);opacity:.75}
input:disabled{opacity:.5}
.clear,.info{position:absolute;display:grid;place-items:center;padding:.3rem;
    inline-size:max(24px,var(--gramlot-touch-target,0px));block-size:max(24px,var(--gramlot-touch-target,0px));border-radius:50%;color:var(--gramlot-text-secondary,GrayText);cursor:pointer}
.clear{inset-inline-end:calc(max(24px,var(--gramlot-touch-target,0px)) + 2px)}
.info[hidden]{display:none}
.search-entry:has(.info[hidden]) .clear{inset-inline-end:2px}
.search-entry:has(.info[hidden]) input{padding-inline-end:calc(max(24px,var(--gramlot-touch-target,0px)) + 4px)}
.info{inset-inline-end:2px;opacity:.7}
.clear:hover,.info:hover{color:var(--gramlot-ink,CanvasText);background:var(--gramlot-surface-subtle,ButtonFace)}
input:placeholder-shown~.clear{display:none}
button:focus-visible{outline:1px solid var(--gramlot-text-secondary,GrayText);outline-offset:-3px}
svg{width:1rem;height:1rem;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:none}
.control-box:has([aria-invalid=true]){border-color:var(--gramlot-error,Mark)}
.error{position:absolute;inset-block-start:calc(100% + .35rem);inset-inline:0;z-index:1;
    border:1px solid var(--gramlot-border,GrayText);border-radius:var(--gramlot-radius,.5rem);
    background:var(--gramlot-field-background,Canvas);color:var(--gramlot-error,Mark);
    font-size:.85em;padding:.5rem .75rem;box-shadow:var(--gramlot-shadow,0 2px 5px #0002)}
.error:empty{display:none}
.search-help{position:fixed;inset:auto;margin:0;inline-size:19rem;max-inline-size:calc(100vw - 1rem);
    max-block-size:var(--gramlot-popup-available-height,80vh);overflow:auto;padding:1rem;
    border:1px solid var(--gramlot-border,GrayText);border-radius:var(--gramlot-radius-lg,.75rem);
    background:var(--gramlot-surface,Canvas);color:var(--gramlot-ink,CanvasText);
    box-shadow:var(--gramlot-shadow,0 3px 12px #0002);font:inherit;font-size:inherit;line-height:1.5}
.search-help p{margin:.6rem 0 0}.search-help p:last-child{color:var(--gramlot-text-secondary,GrayText)}
@media(prefers-reduced-motion:reduce){.control-box{transition:none}}
`;
