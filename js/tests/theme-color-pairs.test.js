import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const luminance = hex => hex.slice(1).match(/../g).map(part => parseInt(part, 16) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
    .reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0);
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) /
    (Math.min(luminance(a), luminance(b)) + .05);

for (const file of ['gramlot-base/theme.css', 'gramlot-compact/theme.css', 'mimi/theme.css',
    'joanna/theme.css', 'mela/theme.css', 'palettes/compact.css', 'palettes/mimi.css', 'palettes/joanna.css']) {
    test(`${file}: surface/header pairs remain legible in light, system dark and explicit dark`, () => {
        const css = readFileSync(new URL(`../../themes/${file}`, import.meta.url), 'utf8');
        const modes = [...css.matchAll(/\{([^{}]+)\}/g)].map(match => Object.fromEntries(
            [...match[1].matchAll(/--gramlot-([\w-]+):\s*(#[\da-f]{6});/gi)].map(item => [item[1], item[2]])))
            .filter(tokens => tokens.surface);
        assert.equal(modes.length, 3);
        for (const tokens of modes) {
            for (const [background, foreground] of [['surface', 'ink'], ['header-background', 'header-color']]) {
                assert.ok(tokens[background] && tokens[foreground]);
                assert.ok(contrast(tokens[background], tokens[foreground]) >= 4.5, `${background}/${foreground}`);
            }
            assert.notEqual(tokens.surface, tokens['header-background']);
        }
        for (const role of ['surface', 'ink', 'header-background', 'header-color']) {
            assert.equal(modes[1][role], modes[2][role], `system and explicit dark share ${role}`);
        }
        assert.ok(luminance(modes[2]['header-background']) < .15, 'dark headers remain dark');
    });
}
