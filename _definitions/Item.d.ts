declare global {
  // TODO: Define tinyIcons type
  // NOTE: Unlike most other cases, the object here will also include ItemSynergy-related data
  interface ItemTinyIconsPropagatedData {
    /**
    * The tags to place at the beginning of a conditional modifier's description.
    */
    descriptionTags?: string[],

    /**
     * The tags to place in front of an item's synergies' description (location usually determinable via common "text-warning" html in the description)
     */
    itemSynergyTags?: string[][],

    /**
     * The new modified description, with tiny icon modifications for both item description data and item synergy data
     */
    //modifiedDescriptionHtmlCached?: string,

    /**
     * Quick-check boolean for whether the icon html has already been added to the description backing field
     */
    customDescriptionModified?: boolean
  }

  interface EquipmentItemTinyIconsPropagatedData extends ItemTinyIconsPropagatedData {
    /**
    * A quick-access boolean, as a way to potentially enforce a "tinyIcons" object existing on the item, thereby allowing for easier checking in item method patch
    */
    hasItemSynergies?: boolean
  }

  interface Item {
    tinyIcons: undefined | ItemTinyIconsData
  }

  interface EquipmentItem {
    tinyIcons: undefined | EquipmentItemTinyIconsPropagatedData
  }

  interface MasteryTokenItem {
    tinyIcons: undefined | {
      iconHtmlCached: string
    }
  }
}

export { };