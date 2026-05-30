export function collectItemSynergies() {
    const out: Array<{ context: any, entity: any }> = [];

    const items = game.items.allObjects.filter(
        (i): i is WeaponItem | EquipmentItem =>
            i instanceof WeaponItem || i instanceof EquipmentItem
    );
    for (const item of items) {
        try {
            const synergies = game.itemSynergies.get(item);
            if (!synergies) continue;
            for (const s of synergies) {
                if (!s || !s.items) continue;
                // items are expected to be an array of item ids
                out.push({ context: { itemIDs: s.items }, entity: s });
            }
        } catch (e) {
            // ignore
        }
    }

    return out;
}
