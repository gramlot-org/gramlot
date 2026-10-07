// The received Source of a test page: inline code runs only as received with the Source
// (SourceHandler.prepareSource), so a test with inline code builds its Source apart and mounts it as `main`.
import {GramlotBuilder} from '../../src/index.js';

/**
 * Build a Source with `build(root)` on a GramlotBuilder of its own, mount it on `app` with startSource,
 * and return what `build` returned. The nodes keep their identity in the mounted Source.
 */
export function mount(app, build) {
    const builder = new GramlotBuilder();
    const result = build(builder.root);
    app.src.startSource(builder.source);
    return result;
}
