import { EntityCategory } from '../entityCategory'

export interface PropagatorBaseContextData {
    /**
     * The identifier of the category the resolver/propagator should manage (e.g. "EquipmentItem", or "")
     */
    category: EntityCategory;
}
