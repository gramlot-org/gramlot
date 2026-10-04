/** The module documentation and type reference that the runtime bundle starts with; shared with the C07 test. */
export const moduleDoc = `/**
 * The Gramlot browser runtime as one ES module: the same exports as the \`@gramlot/gramlot\` entry
 * point (\`Gramlot\`, \`PageBootstrap\`, the builder, the renderers, \`Bag\` and the rest), bundled with
 * its dependencies.
 *
 * @module
 */`;
export const bundleBanner = `/* @ts-self-types="./gramlot.d.ts" */\n${moduleDoc}`;
