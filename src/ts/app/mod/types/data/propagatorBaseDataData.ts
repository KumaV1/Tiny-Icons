/**
 * Defines optional properties for the standard modifications supported via the mod that all propagators may or may not handle (certain cases may not make sense in certain contexts)
 */
export interface PropagatorBaseDataData {
  /** Tags of icons to place at the start of the entity's description */
  descriptionIconTags?: string[],

  /**
   * Tags of icons to place at the start of conditional modifiers.
   * The first layer represents the original conditionalModifiers array (e.g. EquipmentItem.conditionalModifiers),
   * while the second layer is the tags to apply to the respectively index-matching {@link ConditionalModifier} object
   */
  conditionalModifierIconTags?: string[][]
}
