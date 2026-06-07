/**
 * A clarity type for documenting explicitly hard-defined categories
 */
type StaticEntityCategory = 'BaseAgilityObject' // obstacles and pillars; does not have custom description and seemingly explicitly does not support conditional modifiers? | NOTE: Way of printing looks to indicate that it is handled as a stat object, so COULD support conditional modifiers at some point in the future (looking at BaseAgilityObject and PassivePillarMenuElement)
  | 'AncientRelic' // Does not have custom description, but has cases of conditional modifiers being utilized
  | 'AstrologyRecipe' // Does not have custom description, but has cases of conditional modifiers being utilized
  | 'CombatSpell' // Allows for combat effetcs (and aurora for stats). Also likely 
  | 'AttackStyle' // Technically supports conditional modifiers, although probably rather unlikely
  | 'CartographyPOI' // Supports conditional modifiers. Description may be about general, as in is displayed additionally to the modifiers, not overwriting them?
  | 'CartographyWorldMapMasteryBonus' // Supports conditional modifiers
  | 'CombatPassive' // Supports conditional modifiers and custom description
  | 'SummoningSynergy' // Supports conditional modifiers and custom description
  //| 'CombatEffect' Unsure
  //| 'FiremakingOiledLogRecipe' // Really?
  | 'TokenItem' // Supports conditional modifiers and custom description
  | 'PotionItem' // Supports conditional modifiers and custom description
  | 'EquipmentItem' // Supports conditional modifiers and custom description
  | 'WeaponItem'
  | 'FiremakingOilItem' // Supports conditional modifiers and custom description
  | 'FoodItem' // Supports conditional modifiers and custom description
  | 'ItemSynergy' // Supports conditional modifiers. Does not support custom descriptions I think?
  | 'Pet' // Supports conditional modifiers
  | 'Prayer' // Supports conditional modifiers
  | 'ShopPurchase' // Supports custom descriptions. Supports conditional modifiers
  | 'SkillTreeNode' // Supports conditional modifiers
  | 'TownshipBuilding' // Supports conditional modifiers
  | 'TownshipSeason'; // Supports conditional modifiers

/**
 * A support type for categories added by other mods
 */
type ModEntityCategory = string;

/**
 * Joint clarity type for entity category (which essentially boils down to a string)
 */
export type EntityCategory = StaticEntityCategory | ModEntityCategory;