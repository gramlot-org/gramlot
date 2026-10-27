import {labelboxPositions} from '../view/labelbox.js';

/** Connect a component's shadow control to the renderer-owned Labelbox. */
export function Labelbox(Base) {
    return class extends Base {
        setLabelbox(layout) {
            const {box, labelBox, fieldLabel} = layout;
            Object.assign(this, {box, labelBox, fieldLabel});
            fieldLabel.addEventListener('click', () => {
                this.control.focus();
                if (this.control.localName === 'input' && ['checkbox', 'radio'].includes(this.control.type))
                    this.control.click();
            });
        }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            // ID references cannot cross a shadow boundary. Name the actual
            // control in its own tree; the outer label names the presentation.
            const label = this.parameters.lbl ?? '';
            if (label) this.control.setAttribute('aria-label', label);
            else this.control.removeAttribute('aria-label');
            return rest;
        }
    };
}
Labelbox.labelbox = true;
Labelbox.parameters = {
    lbl:{dtype:'T',qualification:'intl_str',nullable:true,binding:'read'},
    lbl_position:{dtype:'T',default:'TL',binding:'read',enum:labelboxPositions}
};
