import { Logger } from "../../Logger";
import { PropagatorBaseDataData } from "../../types/data/propagatorBaseDataData";
import { PropagatorNamespacedObjectContextData } from "../../types/data/propagatorNamespacedObjectContextData";
import { EntityModificationDataPropagator } from "./entityModificationDataPropagator";

interface CombatSpellPropagatorContextData extends PropagatorNamespacedObjectContextData {
    spellType: 'Aurora' | 'Curse' | 'Attack'
}

export class CombatSpellDataPropagator extends EntityModificationDataPropagator<CombatSpell, PropagatorNamespacedObjectContextData, PropagatorBaseDataData> {
    description = "Propagates the conditional modifier objects to be provided with tiny icon data. As the description always uses stat formatting, description tags are a noop";
    // TODO: Reminder about possibly supporting icons for combat effects (curse spells).

    /**
     * 
     * @param context
     * @returns
     */
    getEntity(context: CombatSpellPropagatorContextData): CombatSpell | undefined {
        if (context.spellType === 'Aurora') {
            return game.auroraSpells.getObjectSafe(context.id);
        }

        if (context.spellType === 'Curse') {
            return game.curseSpells.getObjectSafe(context.id);
        }

        if (context.spellType === 'Attack') {
            return game.attackSpells.getObjectSafe(context.id);
        }

        Logger.warn('Unable to determine spell for context', context);
        return undefined;
    }

    /**
     * 
     * @param entity
     * @param tags
     */
    //propagateForDescriptionOfEntity(entity: CombatSpell, tags: string[]) {
    //    Logger.warn('CombatSpellDataPropagator.propagateForDescriptionOfEntity is basically a noop');
    //}
}