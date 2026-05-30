import { PropagatorNamespacedObjectContextData } from '../../types/data/propagatorNamespacedObjectContextData';
import { PropagatorBaseDataData } from '../../types/data/propagatorBaseDataData';
import { EntityModificationDataPropagator } from './entityModificationDataPropagator'
import { Logger } from '../../Logger';
import { IconManager } from '../../managers/IconManager';
import { PropagatorBaseContextData } from '../../types/data/propagatorBaseContextData';

interface SummoningSynergyPropagatorContextData extends PropagatorBaseContextData {
    summonIDs: string[]
}

export class SummoningSynergyDataPropagator extends EntityModificationDataPropagator<SummoningSynergy, SummoningSynergyPropagatorContextData, PropagatorBaseDataData> {
    description = 'Propagate custom description tags OR conditional modifier tags (Mutual exclusive, as custom descriptions lead to stat data not generating description)';

    /**
     * 
     * @param context
     * @returns
     */
    getEntity(context: SummoningSynergyPropagatorContextData): SummoningSynergy | undefined {
        const summon0 = game.summoning.actions.getObjectSafe(context.summonIDs[0]);
        const summon1 = game.summoning.actions.getObjectSafe(context.summonIDs[1]);

        const summon0Synergies = game.summoning.synergiesByItem.get(summon0.product)!;
        return summon0Synergies.get(summon1.product);
    }

    /**
     * 
     * @param entity
     * @param tags
     * @returns
     */
    //propagateForDescriptionOfEntity(entity: SummoningSynergy, tags: string[]) {
    //    if (!entity._customDescription) {
    //        Logger.warn('Entity has no custom description set. Propagator will not add icons to custom description.', entity);
    //        return;
    //    }
    //
    //    entity._customDescription = `${IconManager.getIconHTMLForTags(tags)}${entity._customDescription}`;
    //}
}