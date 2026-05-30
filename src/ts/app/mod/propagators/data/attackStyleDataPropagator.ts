import { Logger } from "../../Logger";
import { PropagatorBaseDataData } from "../../types/data/propagatorBaseDataData";
import { PropagatorNamespacedObjectContextData } from "../../types/data/propagatorNamespacedObjectContextData";
import { EntityModificationDataPropagator } from "./entityModificationDataPropagator";

export class AttackStyleDataPropagator extends EntityModificationDataPropagator<AttackStyle, PropagatorNamespacedObjectContextData, PropagatorBaseDataData> {
    description = "Propagates the conditional modifier objects to be provided with tiny icon data. As the description (or tooltip) always uses stat formatting, description tags are a noop";

    /**
     * 
     * @param context
     * @returns
     */
    getEntity(context: PropagatorNamespacedObjectContextData): AttackStyle {
        return game.attackStyles.getObjectSafe(context.id);
    }

    /**
     * 
     * @param entity
     * @param tags
     */
    //propagateForDescriptionOfEntity(entity: AttackStyle, tags: string[]) {
    //    super.propagateForDescriptionOfEntity(entity, tags);
    //    Logger.warn('AttackStyleDataPropagator.propagateForDescriptionOfEntity is basically a noop');
    //}
}