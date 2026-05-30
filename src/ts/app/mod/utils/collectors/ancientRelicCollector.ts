export function collectAncientRelics() {
    const out: Array<{ context: any, entity: any }> = [];
    const g: any = (window as any).game;
    if (!g || !g.ancientRelics) return out;

    const objs = g.ancientRelics.allObjects || g.ancientRelics.getAllObjects?.() || [];
    for (const obj of objs) {
        if (!obj || !obj.id) continue;
        out.push({ context: { id: obj.id }, entity: obj });
    }

    return out;
}
