import { PropagatorNamespacedObjectContextData } from '../../types/data/propagatorNamespacedObjectContextData';
import { PropagatorBaseDataData } from '../../types/data/propagatorBaseDataData';
import { EntityModificationDataPropagator } from './entityModificationDataPropagator'
import { Logger } from '../../Logger';
import { IconManager } from '../../managers/IconManager';

export class CombatPassiveDataPropagator extends EntityModificationDataPropagator<CombatPassive, PropagatorNamespacedObjectContextData, PropagatorBaseDataData> {
  description = 'Propagate custom description tags OR conditional modifier tags (Mutual exclusive, as custom descriptions lead to stat data not generating description)';

  /**
   * 
   * @param context
   * @returns
   */
  getEntity(context: PropagatorNamespacedObjectContextData): CombatPassive {
    return game.combatPassives.getObjectSafe(context.id);
  }
}