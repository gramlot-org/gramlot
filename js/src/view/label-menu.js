import {parseChoices, choiceCaption} from '../components/choices.js';

/** Label presentation over the shared menu. Source/Data own choices and selection. */
export class LabelMenu {
    constructor(layout, choose) {
        this.layout = layout;
        const doc = layout.box.ownerDocument;
        this.button = doc.createElement('button');
        this.button.type = 'button';
        this.button.className = 'label-menu-trigger';
        this.button.setAttribute('aria-haspopup', 'menu');
        this.button.setAttribute('aria-expanded', 'false');
        this.menu = doc.createElement('gramlot-menu');
        this.menu.projectAttributes({});
        layout.labelBox.append(this.button, this.menu);
        this.button.addEventListener('click', event => {
            event.preventDefault(); event.stopPropagation();
            if (this.menu.opened) this.menu.close();
            else this.menu.open(this.button);
        });
        this.button.addEventListener('keydown', event => {
            if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
            event.preventDefault(); event.stopPropagation();
            this.menu.open(this.button, event.key === 'ArrowUp');
        });
        this.choose = choose;
    }
    project({lbl, lbl_value, lbl_values, disabled, readonly}, adapt) {
        const choices = parseChoices(lbl_values);
        if (this.values !== lbl_values) {
            this.menu.close(false);
            for (const item of this.menu.items) item.releaseCommand();
            this.menu.replaceChildren(...choices.map(({id, caption}) => {
                const item = this.menu.ownerDocument.createElement('gramlot-menu-line');
                item.projectAttributes({code:id, caption}, adapt);
                item.activateCommand = event => {
                    if (item.prepareCommand(event)) this.choose(id);
                };
                item.control.addEventListener('click', event => item.activateCommand(event));
                return item;
            }));
            this.values = lbl_values;
        }
        const caption = choiceCaption(choices, lbl_value, lbl);
        this.button.textContent = caption;
        this.button.disabled = Boolean(disabled || readonly || !choices.length);
        if (this.button.disabled) this.menu.close(false);
        for (const item of this.menu.items) {
            item.projectAttributes({...item.parameters, checked:item.parameters.code === lbl_value}, adapt);
        }
        this.layout.fieldLabel.textContent = caption;
        this.layout.fieldLabel.hidden = true;
        this.layout.labelBox.hidden = false;
    }
    dispose() {
        this.menu.close(false);
        for (const item of this.menu.items) item.releaseCommand();
        this.menu.remove(); this.button.remove();
        this.layout.fieldLabel.hidden = false;
    }
}
