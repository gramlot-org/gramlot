/** An editor-owned document destination for the same live Source and renderer. */
export class VisualEditorCanvas {
    constructor({app, editor, design}) {
        this.renderer = app.src.renderer;
        this.design = design;
        const presentation = this.renderer.records.get(design).presentation;
        this.frame = presentation.ownerDocument.createElement('iframe');
        this.frame.title = 'Page canvas';
        this.frame.className = 'visual-editor-canvas-frame';
        this.frame.style.cssText = 'display:block;width:100%;height:100%;min-height:240px;border:0;background:white';
        presentation.before(this.frame);
        const document = this.frame.contentDocument;
        app.registerDocument(document);
        const base = document.createElement('style');
        base.textContent = 'html,body{margin:0;min-height:100%;} .visual-editor-canvas{min-height:100vh;}';
        this.styles = document.createElement('style');
        const selection = document.createElement('style');
        selection.textContent = '.gramlot-source-selected{outline:2px solid #8ab4f8!important;outline-offset:-2px!important;}';
        document.head.append(base, this.styles, selection);
        this.body = document.body;
        this.renderer.mountDestination(design, this.body);
        this.release = this.renderer.onDispose(editor, () => this.dispose());
    }
    setCss(texts) { this.styles.textContent = texts.join('\n'); }
    dispose() {
        this.release?.(); this.release = null;
        this.frame.remove();
    }
}
