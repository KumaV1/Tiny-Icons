export function collectWeaponItems() {
    const out: Array<{ context: any, entity: any }> = [];

    const items = game.items.allObjects;
    for (const item of items) {
        if (item instanceof WeaponItem) {
            out.push({ context: { id: item.id }, entity: item });
        }
    }

    return out;
}

export function collectFiremakingOilItems() {
    const out: Array<{ context: any, entity: any }> = [];

    const items = game.items.allObjects;
    for (const item of items) {
        if (item instanceof FiremakingOilItem) {
            out.push({ context: { id: item.id }, entity: item });
        }
    }

    return out;
}

export function collectFoodItems() {
    const out: Array<{ context: any, entity: any }> = [];

    const items = game.items.allObjects;
    for (const item of items) {
        if (item instanceof FoodItem) {
            out.push({ context: { id: item.id }, entity: item });
        }
    }

    return out;
}

export function collectPotionItems() {
    const out: Array<{ context: any, entity: any }> = [];

    const items = game.items.allObjects;
    for (const item of items) {
        if (item instanceof PotionItem) {
            out.push({ context: { id: item.id }, entity: item });
        }
    }

    return out;
}

export function collectTokenItems() {
    const out: Array<{ context: any, entity: any }> = [];

    const items = game.items.allObjects;
    for (const item of items) {
        if (item instanceof TokenItem) {
            out.push({ context: { id: item.id }, entity: item });
        }
    }

    return out;
}

export function collectEquipmentItems() {
    const out: Array<{ context: any, entity: any }> = [];

    const items = game.items.allObjects;
    for (const item of items) {
        // Check if it's an EquipmentItem but NOT a subclass (WeaponItem, etc)
        if (item instanceof EquipmentItem && 
            !(item instanceof WeaponItem) &&
            !(item instanceof FiremakingOilItem) &&
            !(item instanceof FoodItem) &&
            !(item instanceof PotionItem) &&
            !(item instanceof TokenItem)) {
            out.push({ context: { id: item.id }, entity: item });
        }
    }

    return out;
}

export function collectItems() {
    const out: Array<{ context: any, entity: any }> = [];

    const items = game.items.allObjects;
    for (const item of items) {
        // Determine category by constructor name and filter by exact type to avoid duplicates
        // WeaponItem must be checked before EquipmentItem since WeaponItem is likely a subclass
        if (item instanceof WeaponItem) {
            out.push({ context: { id: item.id }, entity: item });
        }
        else if (item instanceof FiremakingOilItem) {
            out.push({ context: { id: item.id }, entity: item });
        }
        else if (item instanceof FoodItem) {
            out.push({ context: { id: item.id }, entity: item });
        }
        else if (item instanceof PotionItem) {
            out.push({ context: { id: item.id }, entity: item });
        }
        else if (item instanceof TokenItem) {
            out.push({ context: { id: item.id }, entity: item });
        }
        else if (item instanceof EquipmentItem) {
            out.push({ context: { id: item.id }, entity: item });
        }
    }

    return out;
}
