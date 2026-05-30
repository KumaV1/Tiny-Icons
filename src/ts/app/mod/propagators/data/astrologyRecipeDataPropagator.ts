import { Logger } from "../../Logger";
import { PropagatorBaseDataData } from "../../types/data/propagatorBaseDataData";
import { PropagatorNamespacedObjectContextData } from "../../types/data/propagatorNamespacedObjectContextData";
import { EntityModificationDataPropagator } from "./entityModificationDataPropagator";

interface AstrologyRecipePropagatorNamespacedObjectContextData extends PropagatorNamespacedObjectContextData {
    modifierType: 'Standard' | 'Unique' | 'Abyssal' | AstrologyModifierType
    modifierIndex: number
}

export class AstrologyRecipeDataPropagator extends EntityModificationDataPropagator<AstrologyModifier, AstrologyRecipePropagatorNamespacedObjectContextData, PropagatorBaseDataData> {
    description = "Propagates the conditional modifier objects to be provided with tiny icon data. As the description always uses stat formatting, description tags are a noop";

    /**
     * 
     * @param context
     * @returns
     */
    getEntity(context: AstrologyRecipePropagatorNamespacedObjectContextData): AstrologyModifier | undefined {
        const action = game.astrology.actions.getObjectSafe(context.id);

        let modifiers = undefined as AstrologyModifier[] | undefined;
        if (context.modifierType === 'Standard' || context.modifierType === AstrologyModifierType.Standard) {
            modifiers = action.standardModifiers;
        } else if (context.modifierType === 'Unique' || context.modifierType === AstrologyModifierType.Unique) {
            modifiers = action.uniqueModifiers;
        } else if (context.modifierType === 'Abyssal' || context.modifierType === AstrologyModifierType.Abyssal) {
            modifiers = action.abyssalModifiers;
        }

        if (!modifiers) {
            Logger.warn('Failed to determine modifier array for context (make sure the node has modifiers for the given type in the first place)', context);
            return undefined;
        }

        return modifiers[context.modifierIndex];
    }

    /**
     * 
     * @param entity
     * @param tags
     */
    //propagateForDescriptionOfEntity(entity: AstrologyModifier, tags: string[]) {
    //    super.propagateForDescriptionOfEntity(entity, tags);
    //    Logger.warn('AstrologyRecipeDataPropagator.propagateForDescriptionOfEntity is basically a noop');
    //}
}