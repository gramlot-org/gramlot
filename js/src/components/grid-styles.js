/** Grid geometry and token consumption. Themes own the palette and density.
 * A JS stylesheet module keeps the same source usable in Node and browser builds.
 */
export const gridStyles = `
.column-filter{position:absolute;inset-inline-end:8px;top:50%;transform:translateY(-50%);border:0;background:transparent;color:inherit;cursor:pointer;padding:2px;margin-inline-start:4px;vertical-align:middle;line-height:0;opacity:.6}
th:has(.column-filter){padding-inline-end:28px}
.column-filter svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:1.5}
.column-filter.active{opacity:1;color:var(--gramlot-action,Highlight)}
.column-filter.active svg{fill:currentColor}
.column-filtered{box-shadow:inset 0 -2px var(--gramlot-action,Highlight)}
.column-filter:focus-visible{outline:2px solid var(--gramlot-focus-ring,Highlight)}
.column-filter-panel{position:fixed;inset:auto;margin:0;padding:0;border:1px solid var(--gramlot-border,GrayText);border-radius:8px;background:var(--gramlot-surface,Canvas);color:var(--gramlot-ink,CanvasText);font:inherit;box-shadow:0 8px 24px #0003;width:310px;max-width:var(--gramlot-popup-available-width);max-height:var(--gramlot-popup-available-height);overflow:auto}
.column-filter-panel slot{display:contents}

.control-box{position:relative}
.cell-editor{
    position:absolute;z-index:4;height:min(var(--grid-editor-height),var(--grid-cell-max-height,var(--grid-editor-height)));
    background:var(--gramlot-grid-background,var(--gramlot-surface,Canvas));
    --gramlot-field-height:0px;
    --gramlot-field-block-size:min(var(--grid-editor-height),var(--grid-cell-max-height,var(--grid-editor-height)));
    --gramlot-field-padding:var(--gramlot-grid-cell-padding,.3rem .6rem);
    --gramlot-field-font-size:1em;
    --gramlot-field-line-height:var(--gramlot-grid-line-height,1.35);
    --gramlot-field-radius:0px;
    --gramlot-field-focus-outline:1px solid var(--gramlot-focus-ring,Highlight);
    --gramlot-field-focus-offset:-1px;
    --gramlot-field-resize:none;
}
.cell-editor[hidden]{display:none}
.invalid-cell{background:var(--gramlot-error-background,#fff1f0)!important}
.draft-cell{box-shadow:inset 0 -2px var(--gramlot-warning,#805600)}

    :host {
        min-block-size: 0;
        color: var(--gramlot-grid-color, var(--gramlot-ink, CanvasText));
        font-family: var(--gramlot-font-ui, inherit);
        font-size: var(--gramlot-grid-font-size, inherit);
        line-height: var(--gramlot-grid-line-height, 1.35);
    }
    .control-box {
        display: flex;
        flex-direction: column;
        block-size: 100%;
        min-block-size: 0;
        overflow: hidden;
        border: 1px solid var(--gramlot-grid-border-color, var(--gramlot-border, ButtonBorder));
        border-radius: var(--gramlot-grid-radius, var(--gramlot-radius-sm, 0));
        background: var(--gramlot-grid-background, var(--gramlot-surface, Canvas));
    }
    .header-frame {
        flex: none;
        min-inline-size: 0;
        padding-inline-end: var(--grid-scrollbar-width, 0px);
        background: var(--gramlot-grid-header-background, var(--gramlot-surface-subtle, ButtonFace));
        border-block-end: 1px solid var(--gramlot-grid-border-color, var(--gramlot-border, ButtonBorder));
    }
    .header-viewport { overflow: hidden; min-inline-size: 0; }
    .body-frame {
        flex: 1 1 auto;
        min-block-size: 0;
        min-inline-size: 0;
        display: grid;
        grid-template: minmax(0, 1fr) / minmax(0, 1fr);
    }
    .loading-status {
        grid-area: 1 / 1;
        place-self: center;
        z-index: 3;
        padding: .5rem;
        border-radius: 50%;
        background: var(--gramlot-grid-background, var(--gramlot-surface, Canvas));
        color: var(--gramlot-text-secondary, GrayText);
        pointer-events: none;
        opacity: 0;
        animation: grid-loading-reveal 0s 200ms forwards;
    }
    .loading-status svg {
        display: block;
        inline-size: 1.5rem;
        block-size: 1.5rem;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        animation: grid-loading-spin .9s linear infinite;
    }
    @keyframes grid-loading-reveal { to { opacity: 1; } }
    @keyframes grid-loading-spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { .loading-status svg { animation: none; } }
    .body-viewport {
        grid-area: 1 / 1;
        min-block-size: 0;
        min-inline-size: 0;
        overflow: auto;
        background: var(--gramlot-surface-subtle, Canvas);
        scrollbar-gutter: stable;
        overscroll-behavior: contain;
        overflow-anchor: none;
    }
    .row-space { pointer-events: none; inline-size: 1px; }
    .body-viewport:focus-visible {
        outline: 2px solid var(--gramlot-focus-ring, Highlight);
        outline-offset: -2px;
    }
    table {
        border-spacing: 0;
        table-layout: fixed;
        inline-size: var(--grid-columns-width);
        font: inherit;
        color: inherit;
    }
    th, td {
        padding: var(--gramlot-grid-cell-padding, .3rem .6rem);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
        border-inline-end: 1px solid var(--gramlot-grid-column-border-color, var(--gramlot-border, ButtonBorder));
    }
    th {
        position: relative;
        block-size: var(--gramlot-grid-header-height, 2rem);
        color: var(--gramlot-grid-header-color, var(--gramlot-ink, ButtonText));
        background: var(--gramlot-grid-header-background, var(--gramlot-surface-subtle, ButtonFace));
        font-weight: var(--gramlot-grid-header-weight, 600);
        text-align: start;
    }
    th[scope=col], th.row-heading {
        background-image: linear-gradient(to bottom, var(--gramlot-grid-header-highlight), transparent 65%);
        border-inline-end-color: var(--gramlot-grid-header-border-color, ButtonBorder);
        box-shadow: inset 0 1px var(--gramlot-grid-header-highlight), inset 0 -1px var(--gramlot-grid-header-border-color, ButtonBorder);
    }
    .group-spacer, th[scope=colgroup] {
        box-sizing: border-box;
        block-size: var(--gramlot-grid-group-height, 1.5rem);
        padding-block: 0;
    }
    .group-spacer { background: var(--gramlot-grid-header-background); border: 0; }
    th[scope=colgroup] {
        border-start-start-radius: var(--gramlot-radius-lg, 10px);
        border-start-end-radius: var(--gramlot-radius-lg, 10px);
        border-inline-start: 2px solid var(--gramlot-grid-header-background);
        background-clip: padding-box;
        background: var(--gramlot-grid-group-background, var(--gramlot-surface-subtle, ButtonFace));
        color: var(--gramlot-grid-group-color, var(--gramlot-ink, ButtonText));
        border-block-end: 1px solid var(--gramlot-grid-border-color, var(--gramlot-border, ButtonBorder));
    }
    td {
        vertical-align: top;
        block-size: var(--gramlot-grid-row-height, 2rem);
        border-block-end: 1px solid var(--gramlot-grid-row-border-color, var(--gramlot-border, ButtonBorder));
    }
    .cell-color-swatch { display:inline-block;vertical-align:middle;width:100%;max-width:48px;height:14px;
        border:1px solid var(--gramlot-border-control,#888);border-radius:3px; }
    .cell-color-swatch[hidden] { display:none; }
    td[data-field] { padding: 0; }
    .cell-content {
        padding: var(--gramlot-grid-cell-padding, .3rem .6rem);
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: var(--grid-cell-max-height, none);
    }
    td.check-cell { vertical-align: middle; }
    .check-cell > .cell-content {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        min-block-size: calc(var(--gramlot-grid-row-height, 2rem) - 1px);
        text-overflow: clip;
    }
    .grid-set-check { margin: 0; flex: none; }
    .cell-scroll { overflow: auto; overscroll-behavior: contain; }
    .cell-scroll:focus-visible { outline: 1px solid var(--gramlot-focus-ring, Highlight); outline-offset: -1px; }
    tbody tr { background: var(--gramlot-grid-background, var(--gramlot-surface, Canvas)); }
    tbody tr.alternate { background: var(--gramlot-grid-row-alt-background, var(--gramlot-surface-subtle, Canvas)); }
    tbody tr:hover { background: var(--gramlot-grid-row-hover-background, var(--gramlot-selected, Highlight)); }
    th[data-field] { padding-inline-end: 14px; cursor: grab; user-select: none; }
    th[data-field]:hover { background-color: color-mix(in srgb, var(--gramlot-grid-header-background) 92%, var(--gramlot-grid-header-color)); }
    th:focus-visible, .column-resize:focus-visible { outline: 2px solid var(--gramlot-focus-ring, Highlight); outline-offset: -2px; }
    .column-caption { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    th[data-sort-direction] .column-caption { padding-inline-end: 24px; }
    .sort-indicator { display: none; position: absolute; inset-inline-end: 14px; top: calc(50% - 7px); inline-size: 14px; block-size: 14px; fill: none; stroke: currentColor; stroke-width: 1.7; }
    th[data-sort-direction] .sort-indicator { display: inline-block; }
    th[data-sort-direction=descending] .sort-indicator { transform: rotate(180deg); }
    th[data-sort-priority]::after { content: attr(data-sort-priority); position: absolute; inset-inline-end: 7px; top: calc(50% - .8em); font-size: .7em; opacity: .8; }
    .column-resize { position: absolute; inset: 0 -4px 0 auto; inline-size: 9px; z-index: 1; cursor: col-resize; touch-action: none; }
    .column-resize::after { content: ''; position: absolute; inset: 20% 4px; background: transparent; }
    th:hover .column-resize::after, .column-resize:focus-visible::after { background: var(--gramlot-focus-ring, Highlight); }
    .resizing, .resizing * { cursor: col-resize; user-select: none; }
    th.column-dragging { opacity: .45; }
    th[data-drop=before] { box-shadow: inset 3px 0 var(--gramlot-focus-ring, Highlight); }
    th[data-drop=after] { box-shadow: inset -3px 0 var(--gramlot-focus-ring, Highlight); }
    th.row-heading {
        font-variant-numeric: tabular-nums;
        position: sticky;
        inset-inline-start: 0;
        z-index: 2;
        text-align: end;
        font-weight: 400;
        vertical-align: top;
        user-select: none;
        block-size: var(--gramlot-grid-row-height, 2rem);
    }
    thead th.row-heading { vertical-align: middle; font-weight: var(--gramlot-grid-header-weight, 600); }
    .row-number-measure {
        position: absolute;
        visibility: hidden;
        pointer-events: none;
        inline-size: max-content;
        padding-inline: inherit;
        border-inline-end: inherit;
        font-weight: 400;
    }
    .row-height-handle {
        position: absolute;
        inset: auto 0 0;
        block-size: 7px;
        cursor: row-resize;
        touch-action: none;
    }
    .row-height-handle:hover, .row-height-handle:focus-visible {
        background: color-mix(in srgb, var(--gramlot-focus-ring, Highlight) 35%, transparent);
    }
    .row-height-handle:focus-visible { outline: 2px solid var(--gramlot-focus-ring, Highlight); outline-offset: -2px; }
    .resizing-row, .resizing-row * { cursor: row-resize; user-select: none; }
    tbody tr[draggable=true] { cursor: grab; }
    tbody tr.row-dragging { opacity: .45; }
    tbody tr[data-row-drop=before] > * { box-shadow: inset 0 2px var(--gramlot-focus-ring, Highlight); }
    tbody tr[data-row-drop=after] > * { box-shadow: inset 0 -2px var(--gramlot-focus-ring, Highlight); }
    .numeric { font-variant-numeric: tabular-nums; }
    .empty { text-align: center; color: var(--gramlot-text-secondary, GrayText); }
`;
