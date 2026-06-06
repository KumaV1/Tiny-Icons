export function collectCartography() {
    const out: Array<{ context: any, entity: any }> = [];
    if (!game.cartography) {
        // AoD skills are not initialized, if not at all registered
        return out;
    }

    const worldMaps = game.cartography.worldMaps.allObjects;
    for (const wm of worldMaps) {
        const pois = wm.pointsOfInterest.allObjects;
        for (const poi of pois) {
            if (!poi || !poi.id) {
                continue;
            }

            out.push({ context: { worldMapId: wm.id, pointOfInterestId: poi.id }, entity: poi });
        }

        const mastery = wm.masteryBonuses?.allObjects;
        for (const m of mastery) {
            if (!m || !m.id) {
                continue;
            }

            out.push({ context: { worldMapId: wm.id, masteryBonusId: m.id }, entity: m });
        }
    }

    return out;
}
