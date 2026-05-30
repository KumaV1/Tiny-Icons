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

    /**
     * 
     * @param entity
     * @param tags
     * @returns
     */
    //propagateForDescriptionOfEntity(entity: AnyItem, tags: string[]) {
    //    if (!entity._customDescription) {
    //        Logger.warn('Item has no custom description set. Propagator will not add icons to custom description.', entity);
    //        return;
    //    }
    //
    //    // TODO: This and possibly other custom description items:
    //    // * For non-modded items, the game actually calls a LANG-STRING, NOT _customDescription!
    //    // * So the adjustment would need to be made on (in case of items) the "modifiedDescription"
    //    //   * Which in case of items would require listening in on when that is actually set... :()
    //    entity._customDescription = `${IconManager.getIconHTMLForTags(tags)}${entity._customDescription}`;
    //}
}