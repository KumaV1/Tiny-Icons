export function collectSummoningSynergies() {
    const out: Array<{ context: any, entity: any }> = [];

    // game.summoning.synergies is already an array of all synergies
    const synergies = game.summoning.synergies;

    for (const synergy of synergies) {
        if (!synergy) continue;

        // Find the two summoning actions for this synergy
        const actions = game.summoning.actions.allObjects;
        let summon0ID: string | undefined;
        let summon1ID: string | undefined;

        for (const action of actions) {
            if (!action || !action.id) continue;

            const actionSynergies = game.summoning.synergiesByItem.get(action.product);
            if (!actionSynergies) continue;

            for (const [, syn] of actionSynergies) {
                if (syn === synergy) {
                    if (!summon0ID) {
                        summon0ID = action.id;
                    } else if (!summon1ID) {
                        summon1ID = action.id;
                        break;
                    }
                }
            }

            if (summon0ID && summon1ID) break;
        }

        if (summon0ID && summon1ID) {
            out.push({ context: { summonIDs: [summon0ID, summon1ID] }, entity: synergy });
        }
    }

    return out;
}
