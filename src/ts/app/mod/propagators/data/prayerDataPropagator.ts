import { Logger } from "../../Logger";
import { PropagatorBaseDataData } from "../../types/data/propagatorBaseDataData";
import { PropagatorNamespacedObjectContextData } from "../../types/data/propagatorNamespacedObjectContextData";
import { EntityModificationDataPropagator } from "./entityModificationDataPropagator";

export class PrayerDataPropagator extends EntityModificationDataPropagator<ActivePrayer, PropagatorNamespacedObjectContextData, PropagatorBaseDataData> {
  description = "Propagates the conditional modifier objects to be provided with tiny icon data. As the description always uses stat formatting, description tags are a noop";

  /**
   * 
   * @param context
   * @returns
   */
  getEntity(context: PropagatorNamespacedObjectContextData): ActivePrayer {
    return game.prayers.getObjectSafe(context.id);
  }
}