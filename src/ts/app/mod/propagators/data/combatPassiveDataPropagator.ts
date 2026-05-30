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

    /**
     * 
     * @param entity
     * @param tags
     * @returns
     */
    //propagateForDescriptionOfEntity(entity: CombatPassive, tags: string[]) {
    //    if (!entity._customDescription) {
    //        Logger.warn('Combat passive has no custom description set. Resolver will not add icons to custom description.', entity);
    //        return;
    //    }
    //
    //    entity._customDescription = `${IconManager.getIconHTMLForTags(tags)}${entity._customDescription}`;
    //}
}