export function collectAstrologyRecipes() {
    const out: Array<{ context: any, entity: any }> = [];

    const actions = game.astrology.actions.allObjects;
    for (const action of actions) {
        if (!action || !action.id) continue;
        const arrays = [ { type: 'Standard', arr: action.standardModifiers }, { type: 'Unique', arr: action.uniqueModifiers }, { type: 'Abyssal', arr: action.abyssalModifiers } ];
        for (const a of arrays) {
            if (!a.arr) continue;
            for (let i = 0; i < a.arr.length; i++) {
                out.push({ context: { id: action.id, modifierType: a.type, modifierIndex: i }, entity: a.arr[i] });
            }
        }
    }

    return out;
}
