export function collectCartography() {
    const out: Array<{ context: any, entity: any }> = [];
    const g: any = (window as any).game;
    if (!g || !g.cartography) return out;

    const worldMaps = g.cartography.worldMaps?.allObjects || g.cartography.worldMaps?.getAllObjects?.() || [];
    for (const wm of worldMaps) {
        if (!wm) continue;
        const pois = wm.pointsOfInterest?.allObjects || wm.pointsOfInterest?.getAllObjects?.() || [];
        for (const poi of pois) {
            if (!poi || !poi.id) continue;
            out.push({ context: { worldMapId: wm.id, pointOfInterestId: poi.id }, entity: poi });
        }

        const mastery = wm.masteryBonuses?.allObjects || wm.masteryBonuses?.getAllObjects?.() || [];
        for (const m of mastery) {
            if (!m || !m.id) continue;
            out.push({ context: { worldMapId: wm.id, masteryBonusId: m.id }, entity: m });
        }
    }

    return out;
}
