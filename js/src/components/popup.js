/** Geometry only: each component owns opening, focus, events and cleanup. */
const VIEWPORT_MARGIN = 8;
const ANCHOR_GAP = 3;

export function positionPopup(popup, anchor, {align = 'start', matchWidth = false, inset = 0, placement = 'bottom', point = null} = {}) {
    const view = anchor.ownerDocument.defaultView;
    const field = point ? {left:point.x,right:point.x,top:point.y,bottom:point.y,width:0}
        : anchor.getBoundingClientRect();
    const availableWidth = Math.max(0, view.innerWidth - 2 * VIEWPORT_MARGIN);
    popup.style.setProperty('--gramlot-popup-available-width', `${availableWidth}px`);
    if (matchWidth) popup.style.width = `${Math.min(Math.max(0, field.width - 2 * inset), availableWidth)}px`;
    popup.style.removeProperty('--gramlot-popup-available-height');
    const natural = popup.getBoundingClientRect();
    if (placement === 'side') {
        const right = Math.max(0, view.innerWidth - VIEWPORT_MARGIN - field.right - ANCHOR_GAP);
        const left = Math.max(0, field.left - VIEWPORT_MARGIN - ANCHOR_GAP);
        const opensLeft = natural.width > right && left > right;
        popup.style.setProperty('--gramlot-popup-available-width', `${opensLeft ? left : right}px`);
        popup.style.setProperty('--gramlot-popup-available-height', `${Math.max(0, view.innerHeight - 2 * VIEWPORT_MARGIN)}px`);
        const size = popup.getBoundingClientRect();
        const x = opensLeft ? field.left - size.width - ANCHOR_GAP : field.right + ANCHOR_GAP;
        popup.style.left = `${Math.max(VIEWPORT_MARGIN, Math.min(x, view.innerWidth - size.width - VIEWPORT_MARGIN))}px`;
        popup.style.top = `${Math.max(VIEWPORT_MARGIN, Math.min(field.top, view.innerHeight - size.height - VIEWPORT_MARGIN))}px`;
        return;
    }
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
