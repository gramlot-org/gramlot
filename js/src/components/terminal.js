import {loadLibrary} from '../libraries.js';

let engineModules;

/**
 * xterm.js, its fit addon and its style for a terminal of `document`, loaded once on first use. Resolves with
 * `{Terminal, FitAddon, style}`.
 */
export function loadTerminalEngine(document) {
    return engineModules ??= Promise.all([
        loadLibrary('xterm', document, () => import('@xterm/xterm/lib/xterm.mjs')),
        loadLibrary('xtermFit', document, () => import('@xterm/addon-fit/lib/addon-fit.mjs')),
        loadLibrary('xtermStyle', document, () => import('@xterm/xterm/css/xterm.css')),
    ]).then(([xterm, fit, style]) => ({Terminal: xterm.Terminal, FitAddon: fit.FitAddon, style}));
}
