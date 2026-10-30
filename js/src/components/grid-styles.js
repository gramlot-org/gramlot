/** Grid geometry and token consumption. Themes own the palette and density.
 * A JS stylesheet module keeps the same source usable in Node and browser builds.
 */
export const gridStyles = `
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
    .body-viewport {
        flex: 1 1 auto;
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
