/** Shared field affordance: one field border, an inset transparent chevron. */
export const choiceFieldStyles = `
.choice-field{position:relative;min-width:0}
.choice-field>input{box-sizing:border-box;width:100%;padding-inline-end:calc(var(--gramlot-choice-toggle-width,1.6em) + .4em)}
.choice-field>.choice-toggle{position:absolute;inset-inline-end:1px;inset-block:1px;
    width:var(--gramlot-choice-toggle-width,1.6em);min-width:0;min-height:0;
    display:grid;place-items:center;padding:0;border:0;border-radius:0;
    background:transparent;box-shadow:none;color:inherit;font:inherit;cursor:pointer}
.choice-toggle::after{content:'';width:.4em;height:.4em;border-inline-end:1.5px solid currentColor;
    border-block-end:1.5px solid currentColor;transform:translateY(-.1em) rotate(45deg);pointer-events:none}
.choice-toggle:disabled{opacity:.5;cursor:default}
.choice-toggle:focus-visible{outline:1px solid var(--gramlot-focus-ring,Highlight);outline-offset:-3px}
.choice-field>input::-webkit-calendar-picker-indicator{opacity:0}
`;
