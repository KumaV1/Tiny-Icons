export function collectPets() {
    const out: Array<{ context: any, entity: any }> = [];

    const objs = game.pets.allObjects;
    for (const obj of objs) {
        if (!obj || !obj.id) continue;
        out.push({ context: { id: obj.id }, entity: obj });
    }

    return out;
}
