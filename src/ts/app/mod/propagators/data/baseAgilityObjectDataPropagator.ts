import { Logger } from "../../Logger";
import { PropagatorBaseDataData } from "../../types/data/propagatorBaseDataData";
import { PropagatorNamespacedObjectContextData } from "../../types/data/propagatorNamespacedObjectContextData";
import { EntityModificationDataPropagator } from "./entityModificationDataPropagator";

interface BaseAgilityObjectPropagatorNamespacedObjectContextData extends PropagatorNamespacedObjectContextData {
    objectType: 'Obstacle' | 'Pillar'
}

export class BaseAgilityObjectDataPropagator extends EntityModificationDataPropagator<BaseAgilityObject, BaseAgilityObjectPropagatorNamespacedObjectContextData, PropagatorBaseDataData> {
    description = "NOTE: Agility obstacles and pillars seemingly explicitly only support modifiers and enemy modifiers, making this entire propagator a noop! Propagates the conditional modifier objects to be provided with tiny icon data. As the description always uses stat formatting, description tags are a noop";

    /**
     * 
     * @param context
     * @returns
     */
    getEntity(context: BaseAgilityObjectPropagatorNamespacedObjectContextData): BaseAgilityObject | undefined {
        if (context.objectType === 'Obstacle') {
            return game.agility.actions.getObjectSafe(context.id);
        } else if (context.objectType === 'Pillar') {
            return game.agility.pillars.getObjectSafe(context.id);
        }

        Logger.warn('Unknown agility object type in context', context);
        return undefined;
    }

    /**
     * 
     * @param entity
     * @param tags
     */
    //propagateForDescriptionOfEntity(entity: BaseAgilityObject, tags: string[]) {
    //    super.propagateForDescriptionOfEntity(entity, tags);
    //    Logger.warn('BaseAgilityObjectDataPropagator.propagateForDescriptionOfEntity is basically a noop');
    //}
}