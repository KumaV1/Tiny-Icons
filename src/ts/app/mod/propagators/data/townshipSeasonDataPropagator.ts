import { PropagatorNamespacedObjectContextData } from '../../types/data/propagatorNamespacedObjectContextData';
import { PropagatorBaseDataData } from '../../types/data/propagatorBaseDataData';
import { EntityModificationDataPropagator } from './entityModificationDataPropagator'

export class TownshipSeasonDataPropagator extends EntityModificationDataPropagator<TownshipSeason, PropagatorNamespacedObjectContextData, PropagatorBaseDataData> {
  description = 'Propagate custom description tags';

  /**
   * 
   * @param context
   * @returns
   */
  getEntity(context: PropagatorNamespacedObjectContextData): TownshipSeason {
    return game.township.seasons.getObjectSafe(context.id);
  }
}