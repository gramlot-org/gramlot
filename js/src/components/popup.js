/** Geometry only: each component owns opening, focus, events and cleanup. */
const VIEWPORT_MARGIN = 8;
const ANCHOR_GAP = 3;

export function positionPopup(popup, anchor, {align = 'start', matchWidth = false, inset = 0} = {}) {
    const view = anchor.ownerDocument.defaultView;
    const field = anchor.getBoundingClientRect();
    const availableWidth = Math.max(0, view.innerWidth - 2 * VIEWPORT_MARGIN);
    popup.style.setProperty('--gramlot-popup-available-width', `${availableWidth}px`);
    if (matchWidth) popup.style.width = `${Math.min(Math.max(0, field.width - 2 * inset), availableWidth)}px`;
    popup.style.removeProperty('--gramlot-popup-available-height');
    const natural = popup.getBoundingClientRect();
    const below = Math.max(0, view.innerHeight - VIEWPORT_MARGIN - field.bottom - ANCHOR_GAP);
    const above = Math.max(0, field.top - VIEWPORT_MARGIN - ANCHOR_GAP);
    const upwards = natural.height > below && above > below;
    popup.style.setProperty('--gramlot-popup-available-height', `${upwards ? above : below}px`);
    const size = popup.getBoundingClientRect();
    const left = align === 'end' ? field.right - size.width - inset : field.left + inset;
    const top = upwards ? field.top - size.height - ANCHOR_GAP : field.bottom + ANCHOR_GAP;
    popup.style.left = `${Math.max(VIEWPORT_MARGIN, Math.min(left, view.innerWidth - size.width - VIEWPORT_MARGIN))}px`;
    popup.style.top = `${Math.max(VIEWPORT_MARGIN, Math.min(top, view.innerHeight - size.height - VIEWPORT_MARGIN))}px`;
}
