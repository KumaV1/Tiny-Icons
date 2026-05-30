import { PropagatorNamespacedObjectContextData } from '../../types/data/propagatorNamespacedObjectContextData';
import { PropagatorBaseDataData } from '../../types/data/propagatorBaseDataData';
import { EntityModificationDataPropagator } from './entityModificationDataPropagator'
import { Logger } from '../../Logger';
import { IconManager } from '../../managers/IconManager';

export class ShopPurchaseDataPropagator extends EntityModificationDataPropagator<ShopPurchase, PropagatorNamespacedObjectContextData, PropagatorBaseDataData> {
    description = 'Propagate custom description tags OR conditional modifier tags (Mutual exclusive, as custom descriptions lead to stat data not generating description)';

    /**
     * 
     * @param context
     * @returns
     */
    getEntity(context: PropagatorNamespacedObjectContextData): ShopPurchase {
        return game.shop.purchases.getObjectSafe(context.id);
    }

    /**
     * 
     * @param entity
     * @param tags
     * @returns
     */
    //propagateForDescriptionOfEntity(entity: ShopPurchase, tags: string[]) {
    //    if (!entity._customDescription) {
    //        Logger.warn('Shop purchase has no custom description set. Propagator will not add icons to custom description.', entity);
    //        return;
    //    }
    //
    //    entity._customDescription = `${IconManager.getIconHTMLForTags(tags)}${entity._customDescription}`;
    //}
}