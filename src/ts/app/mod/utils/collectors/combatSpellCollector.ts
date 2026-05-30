export function collectCombatSpells() {
    const out: Array<{ context: any, entity: any }> = [];

    const aurora = game.auroraSpells.allObjects;
    for (const s of aurora) {
        if (!s || !s.id) continue;
        out.push({ context: { id: s.id, spellType: 'Aurora' }, entity: s });
    }

    const curse = game.curseSpells.allObjects;
    for (const s of curse) {
        if (!s || !s.id) continue;
        out.push({ context: { id: s.id, spellType: 'Curse' }, entity: s });
    }

    const attack = game.attackSpells.allObjects;
    for (const s of attack) {
        if (!s || !s.id) continue;
        out.push({ context: { id: s.id, spellType: 'Attack' }, entity: s });
    }

    return out;
}
