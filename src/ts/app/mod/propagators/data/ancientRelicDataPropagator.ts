import { Logger } from "../../Logger";
import { PropagatorBaseDataData } from "../../types/data/propagatorBaseDataData";
import { PropagatorNamespacedObjectContextData } from "../../types/data/propagatorNamespacedObjectContextData";
import { EntityModificationDataPropagator } from "./entityModificationDataPropagator";

export class AncientRelicDataPropagator extends EntityModificationDataPropagator<AncientRelic, PropagatorNamespacedObjectContextData, PropagatorBaseDataData> {
    description = "Propagates the conditional modifier objects to be provided with tiny icon data. As the description always uses stat formatting, description tags are a noop";

    /**
     * 
     * @param context
     * @returns
     */
    getEntity(context: PropagatorNamespacedObjectContextData): AncientRelic {
        return game.ancientRelics.getObjectSafe(context.id);
    }

    /**
     * 
     * @param entity
     * @param tags
     */
    //propagateForDescriptionOfEntity(entity: AncientRelic, tags: string[]) {
    //    super.propagateForDescriptionOfEntity(entity, tags);
    //    Logger.warn('AncientRelicDataPropagator.propagateForDescriptionOfEntity is basically a noop');
    //}
}