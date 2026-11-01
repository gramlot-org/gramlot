/** Theme-owned colors; compact reports are shared by forms and grids. */
export const editingStatusStyles = `
:host{display:inline-block;font:inherit;color:var(--gramlot-ink,CanvasText)}
.control-box{display:flex;align-items:center;gap:.35rem}
button{font:inherit;color:inherit;cursor:pointer;border:0;background:transparent;border-radius:var(--gramlot-radius-sm,4px)}
.control-box>button{display:inline-flex;align-items:center;gap:.4rem;padding:.3rem .5rem;white-space:nowrap}
button:hover{background:var(--gramlot-surface-subtle,ButtonFace)}
button:focus-visible{outline:1px solid var(--gramlot-focus-ring,Highlight);outline-offset:-1px}
svg{width:1rem;height:1rem;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linejoin:round;stroke-linecap:round}
.count{font-variant-numeric:tabular-nums;color:var(--gramlot-text-secondary,GrayText)}
.invalid{color:var(--gramlot-error,#b3261e)}
.report{position:fixed;inset:auto;margin:0;padding:.65rem;min-width:15rem;width:28rem;
 max-width:var(--gramlot-popup-available-width,calc(100vw - 16px));max-height:var(--gramlot-popup-available-height,60vh);overflow:auto;
 border:1px solid var(--gramlot-border,ButtonBorder);border-radius:var(--gramlot-radius-md,8px);
 background:var(--gramlot-surface,Canvas);color:var(--gramlot-ink,CanvasText);box-shadow:0 6px 24px #0002;font:inherit}
header{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:0 .35rem .45rem}
header button{font-size:1.2em;line-height:1;padding:.25rem .4rem}
ul{list-style:none;margin:0;padding:0}
li+li{border-top:1px solid var(--gramlot-border,ButtonBorder)}
li button{display:block;width:100%;text-align:start;padding:.55rem .35rem}
.field{display:block;font-weight:600;overflow-wrap:anywhere}
.detail{display:block;white-space:pre-wrap;overflow-wrap:anywhere;margin-top:.2rem}
.previous,.notice{color:var(--gramlot-text-secondary,GrayText)}
.arrow{padding:0 .5rem}
.notice{font-size:.9em;margin:.5rem .35rem .15rem}
`;
