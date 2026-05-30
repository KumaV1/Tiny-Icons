// IMPORTANT: In some cases, the category "class" is not the description printer!
// ^ For example, an "ActivePrayer" holds a stat object, but does not come with a description property. Instead "PrayerTooltipElement" explicitly calls the "StatObject" format logic for the stats of a given prayer!


// TODO: Some special cases (THEREFORE NOT YET IMPLEMENTED!)
// * Item- and Summoning Synergies do not have an id
// * Astrology context has to be set per "constellation BONUS" (the 6 unlockable ones), so needs some sub-info on the index of the bonus to process
// * Cartography world map bonuses do not use a "namespace:local_id" id, so can collide with others. Looks like they need to be combined with the WorldMap id they reside in!
// * NEVERMIND, it is a single stat object of a single POI :)

/**
 * A clarity type for documenting explicitly hard-defined categories
 * TODO: WHICH ONES REQUIRE "applyDescriptionModification" support? Check where the function is called
 */
type StaticEntityCategory = 'BaseAgilityObject' // obstacles and pillars; does not have custom description and seemingly explicitly does not support conditional modifiers?
    | 'AncientRelic' // Does not have custom description, but has cases of conditional modifiers being utilized
    | 'AstrologyRecipe' // Does not have custom description, but has cases of conditional modifiers being utilized
    | 'AttackSpell' // Allows for combat effetcs (and aurora for stats). Also likely 
    | 'AttackStyle' // Technically supports conditional modifiers, although probably rather unlikely
    | 'CartographyPOI' // Supports conditional modifiers. Description may be about general, as in is displayed additionally to the modifiers, not overwriting them?
    | 'CartographyWorldMapMasteryBonus' // Supports conditional modifiers
    | 'CombatPassive' // Supports conditional modifiers and custom description
    | 'SummoningSynergy' // Supports conditional modifiers and custom description
    // ^ TODO: Like item synergy, does not have its own id
    //| 'CombatEffect' Unsure
    //| 'FiremakingOiledLogRecipe' // Really?
    | 'TokenItem' // Supports conditional modifiers and custom description
    | 'PotionItem' // Supports conditional modifiers and custom description
    | 'EquipmentItem' // Supports conditional modifiers and custom description
    | 'FiremakingOilItem' // Supports conditional modifiers and custom description
    | 'FoodItem' // Supports conditional modifiers and custom description
    | 'ItemSynergy' // Supports conditional modifiers. Does not support custom descriptions I think?
    // ^ TODO: How to identify these? they do not have their own id... but I guess the same item combination should only have one synergy, so the equipment ids could be concacted?
    | 'Pet' // Supports conditional modifiers
    | 'Prayer' // Supports conditional modifiers
    | 'ShopPurchase' // Supports custom descriptions. Supports conditional modifiers
    | 'SkillTreeNode'; // Supports conditional modifiers
// ^ Really, attack style? Apparently yes, giving hidden skill levels depending on attack style (like slash vs. stab -> strength vs attack)

/**
 * A support type for categories added by other mods
 */
type ModEntityCategory = string;

/**
 * Joint clarity type for entity category (which essentially boils down to a string)
 */
export type EntityCategory = StaticEntityCategory | ModEntityCategory;