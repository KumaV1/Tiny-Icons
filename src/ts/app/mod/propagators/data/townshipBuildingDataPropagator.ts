import { PropagatorNamespacedObjectContextData } from '../../types/data/propagatorNamespacedObjectContextData';
import { PropagatorBaseDataData } from '../../types/data/propagatorBaseDataData';
import { EntityModificationDataPropagator } from './entityModificationDataPropagator'

export class TownshipBuildingDataPropagator extends EntityModificationDataPropagator<TownshipBuilding, PropagatorNamespacedObjectContextData, PropagatorBaseDataData> {
    description = 'Propagate custom description tags';

    /**
     * 
     * @param context
     * @returns
     */
    getEntity(context: PropagatorNamespacedObjectContextData): TownshipBuilding {
        return game.township.buildings.getObjectSafe(context.id);
    }
}