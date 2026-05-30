import { Logger } from "../../Logger";
import { PropagatorBaseDataData } from "../../types/data/propagatorBaseDataData";
import { PropagatorBaseContextData } from "../../types/data/propagatorBaseContextData";
import { EntityModificationDataPropagator } from "./entityModificationDataPropagator";

interface CartographyWorldMapMasteryBonusPropagatorContextData extends PropagatorBaseContextData {
    worldMapId: string
    masteryBonusId: string;
}

// Example where more than just "category" and "id" are necessary!
export class CartographyWorldMapMasteryBonusDataPropagator extends EntityModificationDataPropagator<WorldMapMasteryBonus,
    CartographyWorldMapMasteryBonusPropagatorContextData,
    PropagatorBaseDataData> {

    description = "Propagates the conditional modifier objects to be provided with tiny icon data. As the description always uses stat formatting, description tags are a noop";

    /**
     * 
     * @param context
     * @returns
     */
    getEntity(context: CartographyWorldMapMasteryBonusPropagatorContextData): WorldMapMasteryBonus {
        // @ts-ignore: The resolver should only be called if the aod expansion is loaded, so game.cartography can be expected to be defined
        const worldMap = game.cartography.worldMaps.getObjectSafe(context.worldMapId);

        return worldMap.masteryBonuses.getObjectSafe(context.masteryBonusId);
    }

    /**
     * 
     * @param entity
     * @param tags
     */
    //propagateForDescriptionOfEntity(entity: WorldMapMasteryBonus, tags: string[]) {
    //    super.propagateForDescriptionOfEntity(entity, tags);
    //    Logger.warn('CartographyWorldMapMasteryBonusDataPropagator.propagateForDescriptionOfEntity is basically a noop');
    //}
}