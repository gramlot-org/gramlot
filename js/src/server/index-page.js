/* @ts-self-types="./index-page.d.ts" */
/** Reusable application index authored with Gramlot Source. */
import {Page as GramlotPage} from './page-base.js';

export class IndexPage extends GramlotPage {
    static title = 'Application';
    static logoUrl = '';
    static shellId = 'index';
    static navigation = [];
    static css = ['/themes/gramlot-base/theme.css', '/themes/gramlot-index/theme.css'];

    main(root) {
        const families = this.constructor.navigation;
        const shell = root.div({class: 'index-shell', id: this.constructor.shellId});
        const sidebar = shell.aside({class: 'index-sidebar', id: 'index-sidebar'});
        const brand = sidebar.header();
        if (this.constructor.logoUrl) brand.img({src: this.constructor.logoUrl, alt: this.constructor.title, class: 'index-logo'});
        brand.h1(this.constructor.title);
        const navigation = sidebar.nav({'aria-label': 'Pages'}).ul({class: 'index-list'});
        for (const family of families) {
            const category = navigation.li().details({open: family === families[0]});
            category.summary({tabindex: -1}).a(family.title, {id: `open-${family.key}`, href: `#panel-${family.key}`,
                class: 'index-family', aria_current: null, tabindex: -1});
            const examplesList = category.ul({class: 'index-list'});
            for (const example of family.children) {
                examplesList.li().a(example.title, {id: `open-${example.key}`, href: example.url,
                    aria_current: null, tabindex: -1});
            }
        }
        shell.div({class: 'index-divider', id: 'index-sidebar-divider',
            role: 'separator', aria_orientation: 'vertical', tabindex: 0,
            aria_label: 'Resize sidebar', aria_controls: 'index-sidebar',
            aria_valuemin: 120, aria_valuemax: 460, aria_valuenow: 240});
        const content = shell.main({class: 'index-main'});
        const tabs = content.div({class: 'index-tabs', role: 'tablist', aria_label: 'Open pages'});
        tabs.button('Introduction', {type: 'button', role: 'tab', id: 'tab-intro',
            aria_controls: 'panel-intro',
            aria_selected: 'true', tabindex: -1, hidden: false});
        for (const family of families) {
            for (const {key, title} of [family, ...family.children]) {
                tabs.button(title, {type: 'button', role: 'tab', id: `tab-${key}`,
                    aria_controls: `panel-${key}`,
                    aria_selected: 'false', tabindex: -1, hidden: true});
            }
        }

        const panels = content.div({class: 'index-panels'});
        const intro = panels.section({id: 'panel-intro', class: 'index-intro', role: 'tabpanel',
            aria_labelledby: 'tab-intro', hidden: false});
        this.introduction(intro);

        for (const family of families) {
            const categoryPanel = panels.section({id: `panel-${family.key}`, class: 'index-category',
                role: 'tabpanel',
                aria_labelledby: `tab-${family.key}`, hidden: true});
            this.groupPanel(categoryPanel, family);
            for (const example of family.children) this.panel(panels, example);
        }
        const footer = shell.footer({class: 'index-footer'});
        this.footer(footer);
        this.behavior(shell);
    }

    behavior(shell) {
        shell.dataController({func: 'indexMount', _onStart: true, shell_id: this.constructor.shellId});
    }
    introduction(pane) {
        pane.h2(this.constructor.title);
        pane.p('Choose a page from the navigation. Open pages remain available in tabs.');
    }
    groupPanel(pane, group) { pane.h2(group.title); }
    footer(footer) {
        const theme = footer.div({class: 'index-theme'});
        theme.html_label('Theme', {for: 'index-appearance'});
        const appearance = theme.select({id: 'index-appearance', value: 'compact'});
        appearance.option('Base', {value: 'base', selected: false});
        appearance.option('Compact', {value: 'compact', selected: true});
        const color = footer.div({class: 'index-theme'});
        color.html_label('Color mode', {for: 'index-theme'});
        const choices = color.select({id: 'index-theme', value: 'light'});
        choices.option('Light', {value: 'light', selected: true});
        choices.option('Dark', {value: 'dark', selected: false});
        const keyboard = footer.div({class: 'index-keyboard'});
        const label = keyboard.html_label({for: 'keyboard-navigation'});
        label.input({type: 'checkbox', id: 'keyboard-navigation', checked: false});
        label.span('Keyboard navigation');

        if (this.constructor.installable) {
            const app = footer.details({class: 'index-install'});
            app.summary('Install app');
            app.button('Install', {type: 'button', id: 'index-install-button', hidden: true});
            app.p('', {id: 'index-install-status', role: 'status'});
            app.p('Chrome: use Install page as app in the browser menu. Safari on macOS Sonoma or later: File > Add to Dock.');
            app.p('Use HTTPS or localhost. For a static export, serve the directory; direct file opening is not installable. Keep the server running for hosted pages.');
        }
    }
    panel(parent, item) {
        const pane = parent.section({id: `panel-${item.key}`, class: 'index-panel', role: 'tabpanel',
            aria_labelledby: `tab-${item.key}`, hidden: true});
        pane.iframe({id: `frame-${item.key}`, title: item.title, name: `page-${item.key}`});
    }
}
