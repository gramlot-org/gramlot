/** Companion of calcolo.py: the root group of the page logic. */
export class Logic {
    somma(kwargs) { return kwargs.a + kwargs.b; }
    azzera(node, kwargs) { return this.page.logic.gui.scroll(node, kwargs); }
}
