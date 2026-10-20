/* @ts-self-types="./index-page-runtime.d.ts" */
import {appearanceStyles} from './index-page-styles.js';
import {THEME_READY, THEME_SET, THEMES, APPEARANCES} from './index-theme.js';

/** Index-page behavior; writes UI state through the existing Source records. */
export function mountIndexPage(renderer, root, onSelection = () => {}, prepareEntry = () => {}, {containerLayout = false, state: suppliedState = null, createEntry = null, onLoad = () => {}} = {}) {
    if (createEntry && !containerLayout) throw new TypeError('Deferred index entries require containerLayout');
    const shell = renderer.records.get(root).element;
    const document = shell.ownerDocument;
    const window = document.defaultView;
    const byId = id => document.getElementById(id);
    const node = element => renderer.elements.get(element).node;
    const set = (element, attrs) => node(element).setAttr(attrs);
    const keyboard = byId('keyboard-navigation');
    const theme = byId('index-theme');
    const appearance = byId('index-appearance');
    const sidebar = byId('index-sidebar');
    const sidebarHandle = byId('index-sidebar-divider');
    const navigationToggle = byId('index-navigation-toggle');
    const codeToggle = byId('index-code-toggle');
    const codeSidebar = byId('index-code');
    const codeHandle = byId('index-code-divider');
    // localStorage is scoped to this origin; the path separates mounted galleries.
    const preferencesKey = `gramlot.${shell.id}.preferences:${window.location.pathname}`;
    let preferences = {};
    try {
        const saved = JSON.parse(window.localStorage.getItem(preferencesKey));
        if (saved !== null && typeof saved === 'object' && !Array.isArray(saved)) preferences = saved;
    } catch (error) {
        if (error.name !== 'SyntaxError' && error.name !== 'SecurityError') throw error;
    }
    const restoreChoice = (control, value, allowed) => {
        if (!control || !allowed.has(value)) return;
        set(control, {value});
        for (const option of control.options) set(option, {selected: option.value === value});
    };
    restoreChoice(theme, preferences.theme, THEMES);
    restoreChoice(appearance, preferences.appearance, APPEARANCES);
    const families = [...shell.querySelectorAll('.index-sidebar details')];
    const Bag = root.builder.data.constructor;
    const state = suppliedState ?? new Bag();
    const opened = new Bag();
    state.setItem('opened', opened);
    state.setItem('keyboard', (keyboard?.checked ?? false));
    state.setItem('theme', (theme?.value ?? 'light'));
    state.setItem('appearance', (appearance?.value ?? 'compact'));
    state.setItem('navigationVisible', preferences.navigationVisible !== false);
    state.setItem('codeVisible', preferences.codeVisible !== false);
    const savePreferences = () => {
        try {
            window.localStorage.setItem(preferencesKey, JSON.stringify({
                theme: state.getItem('theme'), appearance: state.getItem('appearance'),
                sidebarWidth: state.getItem('preferredSidebarWidth'),
                codeWidth: state.getItem('preferredCodeWidth'),
                navigationVisible: state.getItem('navigationVisible'),
                codeVisible: state.getItem('codeVisible'),
            }));
        } catch (error) {
            // A browser may deny storage (including opaque file origins) or exhaust its quota.
            // Keep the current interaction usable; no other persistence mechanism is used.
            if (error.name !== 'SecurityError' && error.name !== 'QuotaExceededError') throw error;
        }
    };
    const entries = new Map();
    const releases = [];
    const style = root.builder.wrapSource(root.value).style(appearanceStyles[appearance?.value ?? 'compact']);
    let drag = null;
    let disposed = false;
    let installPrompt = null;
    const previousTheme = document.documentElement.getAttribute('data-theme');
    const listen = (element, type, handler) => {
        if (!element) return;
        element.addEventListener(type, handler);
        releases.push(() => element.removeEventListener(type, handler));
    };
    const stopDrag = () => {
        if (!drag) return;
        const {handle, pointerId} = drag;
        drag = null;
        if (!disposed) set(shell, {data_resizing: null});
        if (handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId);
    };
    const dispose = () => {
        if (disposed) return;
        disposed = true;
        installPrompt = null;
        stopDrag();
        for (const release of releases.reverse()) release();
        if (style.parentBag) style.parentBag.popNode(style.label);
        if (previousTheme == null) document.documentElement.removeAttribute('data-theme');
        else document.documentElement.setAttribute('data-theme', previousTheme);
    };
    const send = frame => frame.contentWindow.postMessage({type: THEME_SET, theme: state.getItem('theme'), appearance: state.getItem('appearance')}, '*');
    const applyTheme = () => {
        document.documentElement.setAttribute('data-theme', state.getItem('theme'));
        style.setValue(appearanceStyles[state.getItem('appearance')]);
        for (const {frame} of entries.values()) if (frame) send(frame);
    };
    const updateInspector = () => onSelection(entries, state.getItem('active'));
    const updatePanels = () => {
        if (navigationToggle) {
            const visible = state.getItem('navigationVisible');
            set(sidebar, containerLayout ? {drawer: visible ? true : 'close'} : {hidden: !visible});
            if (!containerLayout) set(sidebarHandle, {hidden: !visible});
            set(navigationToggle, {aria_expanded: String(visible)});
            set(shell, {data_navigation_hidden: String(!visible)});
        }
        if (codeSidebar) {
            const available = Boolean(entries.get(state.getItem('active'))?.code);
            const visible = available && state.getItem('codeVisible');
            set(codeSidebar, containerLayout ? {hidden: !available, drawer: visible ? true : 'close'} : {hidden: !visible});
            if (!containerLayout) set(codeHandle, {hidden: !visible});
            set(codeToggle, {disabled: !available, aria_expanded: String(visible)});
            set(shell, {data_code_visible: String(visible)});
        }
    };
    const prepare = entry => {
        entry.panel = byId(`panel-${entry.key}`);
        entry.tab = containerLayout ? entry.panel : byId(`tab-${entry.key}`);
        entry.code = byId(`codepane-${entry.key}`);
        if (entry.key === 'intro') return;
        prepareEntry(entry, {byId, node, set, listen});
        entry.frame = byId(`frame-${entry.key}`);
        if (entry.frame) listen(entry.frame, 'load', () => send(entry.frame));
    };
    const openEntry = entry => {
        if (opened.getItem(entry.key)) return;
        opened.setItem(entry.key, true);
        set(containerLayout ? entry.panel : entry.tab, {hidden: false});
        if (entry.frame) set(entry.frame, {src: entry.open.getAttribute('href')});
    };
    let selecting = false;
    function select(key) {
        if (selecting || disposed) return;
        const requested = entries.get(key);
        if (!requested) return;
        state.setItem('requested', key);
        if (!requested.panel) {
            onLoad(key, 'loading');
            if (!requested.loading) {
                requested.loading = Promise.resolve().then(() => { if (!disposed) return createEntry(requested); }).then(() => {
                    if (disposed) return;
                    prepare(requested);
                    openEntry(requested);
                    if (state.getItem('requested') === key) {
                        onLoad(key, 'ready');
                        select(key);
                    }
                }).catch(error => {
                    if (!disposed && state.getItem('requested') === key) onLoad(key, 'error', error);
                }).finally(() => { requested.loading = null; });
            }
            return;
        }
        onLoad(key, 'ready');
        selecting = true;
        try {
            const entry = entries.get(key);
            openEntry(entry);
            if (entry.family) set(entry.family, {open: true});
            for (const [current, item] of entries) {
                const active = current === key;
                if (!containerLayout) {
                    set(item.tab, {aria_selected: String(active), tabindex: active && state.getItem('keyboard') ? 0 : -1});
                    set(item.panel, {hidden: !active});
                }
                if (item.code) set(item.code, {hidden: !active});
                if (item.open) set(item.open, {aria_current: active ? 'page' : null});
            }
            if (state.getItem('active') !== key) state.setItem('active', key);
            updatePanels();
            updateInspector();
        } finally { selecting = false; }
    }
    const sidebarMaximum = () => Math.max(120, Math.min(460, Math.floor(window.innerWidth * .6)));
    const applyWidths = () => set(shell, {style: `--sidebar-width: ${state.getItem('sidebarWidth')}px; --code-width: ${state.getItem('codeWidth') ?? 420}px`});
    const setSidebarWidth = (value, remember = false) => {
        const maximum = sidebarMaximum();
        const width = Math.max(120, Math.min(maximum, value));
        state.setItem('sidebarWidth', width);
        applyWidths();
        set(sidebarHandle, {aria_valuenow: width, aria_valuemax: maximum});
        if (remember) {
            state.setItem('preferredSidebarWidth', width);
            savePreferences();
        }
    };
    const codeMaximum = () => Math.max(200, Math.floor(window.innerWidth * .6));
    const setCodeWidth = (value, remember = false) => {
        const maximum = codeMaximum();
        const width = Math.max(200, Math.min(maximum, value));
        state.setItem('codeWidth', width);
        applyWidths();
        set(codeHandle, {aria_valuenow: width, aria_valuemax: maximum});
        if (remember) {
            state.setItem('preferredCodeWidth', width);
            savePreferences();
        }
    };
    const beginDrag = (handle, event, move) => {
        if (event.button !== 0) return;
        stopDrag();
        handle.setPointerCapture(event.pointerId);
        drag = {handle, pointerId: event.pointerId, move};
        set(shell, {data_resizing: 'true'});
        event.preventDefault();
    };
    try {
        const install = byId('index-install-button');
        if (install) {
            listen(window, 'beforeinstallprompt', event => {
                event.preventDefault();
                installPrompt = event;
                set(install, {hidden: false, disabled: false});
            });
            listen(window, 'appinstalled', () => {
                installPrompt = null;
                set(install, {hidden: true});
                node(byId('index-install-status')).setValue('App installed.');
            });
            listen(install, 'click', async () => {
                if (!installPrompt) return;
                const prompt = installPrompt;
                installPrompt = null;
                set(install, {disabled: true});
                try {
                    await prompt.prompt();
                    const {outcome} = await prompt.userChoice;
                    if (!disposed) node(byId('index-install-status')).setValue(
                        outcome === 'accepted' ? 'Installation accepted.' : 'Installation cancelled. You can also use the browser menu.');
                } catch (error) {
                    if (!disposed) node(byId('index-install-status')).setValue(`Installation failed: ${error.message}`);
                } finally {
                    if (!disposed) set(install, {hidden: true});
                }
            });
        }
        set(shell, {data_resizing: null});
        // Retain the preferred width when a narrow viewport temporarily limits the visible sidebar.
        if (!containerLayout) {
            const savedWidth = preferences.sidebarWidth;
            const width = typeof savedWidth === 'number' && Number.isFinite(savedWidth) && savedWidth >= 120 && savedWidth <= 460
                ? savedWidth : sidebar.getBoundingClientRect().width || Number(sidebarHandle.getAttribute('aria-valuenow'));
            state.setItem('preferredSidebarWidth', width);
            setSidebarWidth(width);
        } else {
            const gramlot = renderer.binding.gramlot;
            for (const [pane, property, widthProperty] of [[sidebar, 'navigationVisible', 'sidebarWidth'], [codeSidebar, 'codeVisible', 'codeWidth']]) {
                const source = node(pane);
                const savedWidth = preferences[widthProperty];
                if (typeof savedWidth === 'number' && Number.isFinite(savedWidth) && savedWidth > 0) set(pane, {width: `${savedWidth}px`});
                const handle = gramlot.subscribe(`${source.getAttr('nodeId')}_closable_change`, ({open}) => {
                    if (source.getAttr('hidden') === true || source.getAttr('drawer') === false) return;
                    state.setItem(property, open);
                    set(pane, {drawer: open ? true : 'close'});
                    set(property === 'navigationVisible' ? navigationToggle : codeToggle, {aria_expanded: String(open)});
                    set(shell, {[property === 'navigationVisible' ? 'data_navigation_hidden' : 'data_code_visible']: String(property === 'navigationVisible' ? !open : open)});
                    savePreferences();
                });
                releases.push(() => gramlot.unsubscribe(handle));
            }
            const border = shell.querySelector('[data-index-regions]');
            const handle = gramlot.subscribe(`${node(border).getAttr('nodeId')}_splitter_resize`, ({region, size}) => {
                set(region === 'left' ? sidebar : codeSidebar, {width: size});
                state.setItem(region === 'left' ? 'preferredSidebarWidth' : 'preferredCodeWidth', Number.parseFloat(size));
                savePreferences();
            });
            releases.push(() => gramlot.unsubscribe(handle));
            state.setItem('preferredSidebarWidth', preferences.sidebarWidth);
            state.setItem('preferredCodeWidth', preferences.codeWidth);
        }
        listen(navigationToggle, 'click', () => {
            state.setItem('navigationVisible', !state.getItem('navigationVisible'));
            updatePanels();
            savePreferences();
        });
        listen(codeToggle, 'click', () => {
            state.setItem('codeVisible', !state.getItem('codeVisible'));
            updatePanels();
            savePreferences();
        });
        if (!containerLayout && codeHandle) {
            const saved = preferences.codeWidth;
            const width = typeof saved === 'number' && Number.isFinite(saved) && saved >= 200 ? saved : 420;
            state.setItem('preferredCodeWidth', width);
            setCodeWidth(width);
            listen(codeHandle, 'keydown', event => {
                const current = state.getItem('codeWidth');
                const value = event.key === 'ArrowLeft' ? current + 10 : event.key === 'ArrowRight' ? current - 10
                    : event.key === 'Home' ? 200 : event.key === 'End' ? codeMaximum() : null;
                if (value == null) return;
                event.preventDefault();
                setCodeWidth(value, true);
            });
            listen(codeHandle, 'pointerdown', event => beginDrag(codeHandle, event,
                x => setCodeWidth(Math.round(shell.getBoundingClientRect().right - x), true)));
            listen(codeHandle, 'lostpointercapture', () => {
                if (drag?.handle === codeHandle) stopDrag();
            });
            listen(window, 'resize', () => setCodeWidth(state.getItem('preferredCodeWidth')));
        }
        if (!containerLayout) {
            listen(sidebarHandle, 'keydown', event => {
                const current = state.getItem('sidebarWidth');
                const value = event.key === 'ArrowLeft' ? current - 10 : event.key === 'ArrowRight' ? current + 10
                    : event.key === 'Home' ? 120 : event.key === 'End' ? sidebarMaximum() : null;
                if (value == null) return;
                event.preventDefault();
                setSidebarWidth(value, true);
            });
            listen(sidebarHandle, 'pointerdown', event => beginDrag(sidebarHandle, event,
                x => setSidebarWidth(Math.round(x - shell.getBoundingClientRect().left), true)));
            listen(sidebarHandle, 'lostpointercapture', () => {
                if (drag?.handle === sidebarHandle) stopDrag();
            });
            listen(window, 'resize', () => setSidebarWidth(state.getItem('preferredSidebarWidth')));
        }
        const choices = createEntry
            ? [byId('panel-intro'), ...shell.querySelectorAll('.index-sidebar a[id^="open-"]')]
            : containerLayout ? byId('index-pages').children : shell.querySelectorAll('.index-tabs button');
        for (const tab of choices) {
            const key = tab.id.slice(createEntry && tab.id.startsWith('open-') ? 'open-'.length : containerLayout ? 'panel-'.length : 'tab-'.length);
            const entry = {key, tab, panel: byId(`panel-${key}`),
                code: byId(`codepane-${key}`),
                open: key === 'intro' ? null : byId(`open-${key}`)};
            entries.set(key, entry);
            if (entry.panel && (containerLayout ? node(entry.panel).getAttr('hidden') !== true : !tab.hidden)) opened.setItem(key, true);
            if (!containerLayout && tab.getAttribute('aria-selected') === 'true') state.setItem('active', key);
            if (!containerLayout) listen(tab, 'click', () => select(key));
            if (entry.open) listen(entry.open, 'click', event => { event.preventDefault(); select(key); });
            if (!containerLayout) listen(tab, 'keydown', event => {
                if (!state.getItem('keyboard') || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
                const keys = [...entries.keys()].filter(key => opened.getItem(key));
                const index = keys.indexOf(key);
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? keys.length - 1
                    : (index + (event.key === 'ArrowRight' ? 1 : -1) + keys.length) % keys.length;
                event.preventDefault();
                select(keys[next]);
                entries.get(keys[next]).tab.focus();
            });
            if (key === 'intro') continue;
            entry.family = entry.open.closest('details');
            if (entry.panel) prepare(entry);
        }
        if (containerLayout) {
            const pages = byId('index-pages');
            listen(pages, 'click', event => {
                // Re-clicking the active tab need not change Data, but supersedes a pending navigation.
                if (event.target === pages && event.composedPath().some(element =>
                    element instanceof window.Element && element.getAttribute('role') === 'tab')) {
                    select(state.getItem('active'));
                }
            });
            const subscription = `${shell.id}-selection`;
            state.subscribe(subscription, {any: event => {
                if (event.node === state.getNode('active')) select(state.getItem('active'));
            }});
            releases.push(() => state.unsubscribe(subscription, {any: true}));
        }
        listen(document, 'pointermove', event => {
            if (!drag || event.pointerId !== drag.pointerId) return;
            drag.move(event.clientX);
        });
        for (const type of ['pointerup', 'pointercancel']) listen(document, type, event => {
            if (drag && event.pointerId === drag.pointerId) stopDrag();
        });
        for (const family of families) listen(family, 'toggle', () => set(family, {open: family.open}));
        listen(keyboard, 'change', () => {
            state.setItem('keyboard', (keyboard?.checked ?? false));
            set(keyboard, {checked: (keyboard?.checked ?? false)});
            for (const [key, entry] of entries) {
                if (entry.open) set(entry.open, {tabindex: (keyboard?.checked ?? false) ? 0 : -1});
                if (!containerLayout) set(entry.tab, {tabindex: (keyboard?.checked ?? false) && key === state.getItem('active') ? 0 : -1});
            }
        });
        listen(appearance, 'change', () => {
            if (!APPEARANCES.has((appearance?.value ?? 'compact'))) throw new Error('Unknown index appearance');
            state.setItem('appearance', (appearance?.value ?? 'compact'));
            set(appearance, {value: (appearance?.value ?? 'compact')});
            for (const option of appearance.options) set(option, {selected: option.value === (appearance?.value ?? 'compact')});
            applyTheme();
            savePreferences();
        });
        listen(theme, 'change', () => {
            if (!THEMES.has((theme?.value ?? 'light'))) throw new Error('Index theme must be light or dark');
            state.setItem('theme', (theme?.value ?? 'light'));
            set(theme, {value: (theme?.value ?? 'light')});
            for (const option of theme.options) set(option, {selected: option.value === (theme?.value ?? 'light')});
            applyTheme();
            savePreferences();
        });
        listen(window, 'message', event => {
            if (event.data?.type !== THEME_READY) return;
            for (const {frame} of entries.values()) {
                if (frame && frame.contentWindow === event.source) { send(frame); updateInspector(); break; }
            }
        });
        applyTheme();
        updatePanels();
        updateInspector();
        renderer.onDispose(root, dispose);
    } catch (error) {
        dispose();
        throw error;
    }
    return {dispose};
}


/** Re-export as the page's Logic, or delegate indexMount from a custom Logic. */
export class IndexLogic {
    indexMount(node, {shell_id}) {
        const renderer = this.page.src.renderer;
        const element = renderer.destination.ownerDocument.getElementById(shell_id);
        this.index = mountIndexPage(renderer, renderer.elements.get(element).node);
    }
}

export {THEME_READY, THEME_SET, THEMES, APPEARANCES} from "./index-theme.js";
