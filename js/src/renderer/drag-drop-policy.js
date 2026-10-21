/** Declarative eligibility only; gesture routing and Logic callbacks own the remaining checks. */
export class DragDropPolicy {
    static isTarget(attributes) {
        return attributes.dropTarget === true || Boolean(attributes.dropTargetCb)
            || Object.entries(attributes).some(([name, value]) => name.startsWith('dropTargetCb_') && Boolean(value));
    }

    /** Handler types are already resolved by the dispatcher; no MIME/name encoding is assumed here. */
    static acceptedTypes(payloadTypes, dropTypes = '', handlerTypes = []) {
        const patterns = dropTypes.split(',').map(type => type.trim()).filter(Boolean).map(pattern => {
            const literalParts = pattern.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            return new RegExp(`^${literalParts.join('.*')}$`);
        });
        return payloadTypes.filter(type => type !== 'dragTags'
            && (handlerTypes.includes(type) || patterns.some(pattern => pattern.test(type))));
    }

    static acceptsTags(dragTags = '', dropTags = '') {
        if (!dropTags.trim()) return true;
        const tags = new Set(dragTags.split(',').map(tag => tag.trim()).filter(Boolean));
        if (!tags.size) return false;
        return dropTags.split(',').some(alternative => alternative.split(' AND ').every(term => {
            term = term.trim();
            if (!term || term === '!') return false;
            return term.startsWith('!') ? !tags.has(term.slice(1)) : tags.has(term);
        }));
    }

    static acceptsEffect(effectAllowed = 'all', dropEffect = 'move') {
        const effects = {
            all: ['copy', 'move', 'link'], none: [],
            copy: ['copy'], move: ['move'], link: ['link'],
            copyMove: ['copy', 'move'], copyLink: ['copy', 'link'], linkMove: ['link', 'move']
        };
        if (!Object.hasOwn(effects, effectAllowed)) throw new TypeError(`Invalid effectAllowed: ${effectAllowed}`);
        if (!['copy', 'move', 'link'].includes(dropEffect)) throw new TypeError(`Invalid dropEffect: ${dropEffect}`);
        return effects[effectAllowed].includes(dropEffect);
    }

    /** A true result still requires the destination's dynamic callbacks to pass, including at drop. */
    static evaluate(payloadTypes, dragTags, effectAllowed, target, handlerTypes = []) {
        const types = this.acceptedTypes(payloadTypes, target.dropTypes, handlerTypes);
        const dropEffect = target.dropEffect ?? 'move';
        const accepted = this.isTarget(target) && types.length > 0
            && this.acceptsTags(dragTags, target.dropTags) && this.acceptsEffect(effectAllowed, dropEffect);
        return {accepted, types, dropEffect: accepted ? dropEffect : 'none'};
    }
}
