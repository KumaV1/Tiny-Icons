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

  getConditionalModifiersFromEntity(entity: ShopPurchase) {
    return entity.contains?.stats?.conditionalModifiers;
  }
}