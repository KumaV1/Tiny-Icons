import { PropagatorBaseContextData } from './propagatorBaseContextData';

export interface PropagatorNamespacedObjectContextData extends PropagatorBaseContextData {
    /**
     * The full id of a namespaced entity, so "namespace:local_id"
     */
    id: string;
}