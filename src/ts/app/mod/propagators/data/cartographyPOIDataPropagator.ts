import { Logger } from "../../Logger";
import { PropagatorBaseDataData } from "../../types/data/propagatorBaseDataData";
import { PropagatorNamespacedObjectContextData } from "../../types/data/propagatorNamespacedObjectContextData";
import { EntityModificationDataPropagator } from "./entityModificationDataPropagator";

interface CartographyPOIPropagatorContextData extends PropagatorNamespacedObjectContextData {
  worldMapId: string
  pointOfInterestId: string;
}

export class CartographyPOIDataPropagator extends EntityModificationDataPropagator<PointOfInterest,
  CartographyPOIPropagatorContextData,
  PropagatorBaseDataData> {

  description = "Propagates the conditional modifier objects to be provided with tiny icon data. As the description always uses stat formatting, description tags are a noop";

  /**
   * 
   * @param context
   * @returns
   */
  getEntity(context: CartographyPOIPropagatorContextData): PointOfInterest {
    // @ts-ignore Propagator should only trigger when AoD is loaded, so "game.cartography" should always be available
    const worldMap = game.cartography.worldMaps.getObjectSafe(context.worldMapId);

    return worldMap.pointsOfInterest.getObjectSafe(context.pointOfInterestId);
  }

  /**
   * 
   * @param entity
   * @returns
   */
  getConditionalModifiersFromEntity(entity: PointOfInterest): ConditionalModifier[] | undefined {
    return entity.activeStats?.conditionalModifiers;
  }
}