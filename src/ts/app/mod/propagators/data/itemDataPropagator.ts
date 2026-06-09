import { PropagatorNamespacedObjectContextData } from '../../types/data/propagatorNamespacedObjectContextData';
import { PropagatorBaseDataData } from '../../types/data/propagatorBaseDataData';
import { EntityModificationDataPropagator } from './entityModificationDataPropagator'
import { Logger } from '../../Logger';
import { IconManager } from '../../managers/IconManager';

/**
 * (Base) Propagator for items
 */
export class ItemDataPropagator extends EntityModificationDataPropagator<AnyItem, PropagatorNamespacedObjectContextData, PropagatorBaseDataData> {
  description = 'Resolve custom description tags OR conditional modifier tags (Mutual exclusive, as custom descriptions lead to stat data not generating description)';

  /**
   * 
   * @param context
   * @returns
   */
  getEntity(context: PropagatorNamespacedObjectContextData): AnyItem {
    return game.items.getObjectSafe(context.id);
  }
}