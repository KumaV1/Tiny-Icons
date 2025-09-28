import { StaticModifierIconTag } from "../ModifierIcons";

// TODO: Possibly make the type "() => StaticModifierIconTag[]" instead of "StaticModifierIconTag"? Would be easier than trying to for example merge 2-3 svgs into a single one

/**
 * A map of category scope sources and their respective tag to show.
 * Outer Map's key is the overall source, whereas the inner Map's key represents the specific entry (e.g. "melvorD" subcategory having the entry "melvorD:Soup").
 * DEV NOTE: This only includes scope sources which do not already have media inherintly
 */
export const modifierScopeSourceCategoryTagMap: Map<string, Map<string, StaticModifierIconTag>> = new Map([
    //['melvorD:Fishing', new Map([
    //    ['melvorD:ShallowShores', 'placeholder'],
    //    ['melvorD:ShrapnelRiver', 'placeholder'],
    //    ['melvorD:TrenchOfDespair', 'placeholder'],
    //    ['melvorD:LemvorPier', 'placeholder'],
    //    ['melvorD:OpenWaters', 'placeholder'],
    //    ['melvorD:BarrenOcean', 'placeholder'],
    //    ['melvorD:BarbarianFishing', 'placeholder'],
    //    ['melvorD:SecretArea', 'placeholder'],
    //    ['melvorTotH:MagmaLake', 'placeholder'],
    //    ['melvorTotH:JungleWaters', 'placeholder'],
    //    ['melvorTotH:StaticValley', 'placeholder'],
    //    ['melvorTotH:FrozenSea', 'placeholder'],
    //    ['melvorTotH:MidnightLagoon', 'placeholder'],
    //    ['melvorTotH:MysticPond', 'placeholder'],
    //    ['melvorAoD:FishermansEnclave', 'placeholder'],
    //    ['melvorItA:CrimsonRiver', 'placeholder'],
    //    ['melvorItA:MistveilSwamp', 'placeholder'],
    //    ['melvorItA:ToxicPools', 'placeholder'],
    //    ['melvorItA:PetrifiedChannel', 'placeholder'],
    //    ['melvorItA:WhisperCove', 'placeholder'],
    //    ['melvorItA:TendrilDepths', 'placeholder'],
    //    ['melvorItA:VoidLagoon', 'placeholder'],
    //    ['melvorItA:CelestialPond', 'placeholder'],
    //])],
    ['melvorD:Mining', new Map([
        ['melvorD:Ore', 'ore'],
        ['melvorD:Essence', 'rune_essence'],
        ['melvorD:Gem', 'gem'],
        ['melvorItA:abyssal_ore', 'abyssal_ore'],
        ['melvorItA:abyssal_gem', 'abyssal_gem'],
        ['melvorItA:Outcrop', 'abyssal_outcrop'],
        ['melvorItA:abyssal_essence', 'abyssal_essence'],
    ])],
    //['melvorD:Thieving', new Map([
    //    ['melvorF:LOW_TOWN', 'placeholder'],
    //    ['melvorF:GOLBIN_VILLAGE', 'placeholder'],
    //    ['melvorF:BANDIT_HIDEOUT', 'placeholder'],
    //    ['melvorF:FARMERS_MARKET', 'placeholder'],
    //    ['melvorF:BANQUET', 'placeholder'],
    //    ['melvorF:PORT_OF_LEMVOR', 'placeholder'],
    //    ['melvorF:CAVE_OF_GIANTS', 'placeholder'],
    //    ['melvorF:OUTSKIRTS', 'placeholder'],
    //    ['melvorF:FORT', 'placeholder'],
    //    ['melvorF:WIZARD_TOWER', 'placeholder'],
    //    ['melvorF:ROYAL_CASTLE', 'placeholder'],
    //    ['melvorTotH:LOST_RUINS', 'placeholder'],
    //    ['melvorTotH:UNDEAD_PALACE', 'placeholder'],
    //    ['melvorTotH:DESERT', 'placeholder'],
    //    ['melvorTotH:MUSHROOM_FOREST', 'placeholder'],
    //    ['melvorTotH:TWILIGHT', 'placeholder'],
    //    ['melvorItA:CrimsonVillage', 'placeholder'],
    //    ['melvorItA:BlightedReach', 'placeholder'],
    //    ['melvorItA:ShadeveilMaze', 'placeholder'],
    //    ['melvorItA:WitheringRuins', 'placeholder'],
    //    ['melvorItA:SilentCrypt', 'placeholder'],
    //    ['melvorItA:VoidVaults', 'placeholder'],
    //])],
]);

/**
 * A map of subcategory scope sources and their respective tag to show.
 * Outer Map's key is the overall source, whereas the inner Map's key represents the specific entry (e.g. "melvorD" subcategory having the entry "melvorD:Soup").
 * DEV NOTE: This only includes scope sources which do not already have media inherintly
 */
export const modifierScopeSourceSubcategoryTagMap: Map<string, Map<string, StaticModifierIconTag>> = new Map([
    ['melvorD:AttackSpell', new Map([
        ['melvorD:Air', 'air_strike'],
        ['melvorD:Water', 'water_strike'],
        ['melvorD:Earth', 'earth_strike'],
        ['melvorD:Fire', 'fire_strike'],
        ['melvorD:Elemental', 'air_strike'],
        ['melvorD:Strike', 'air_strike'],
        ['melvorD:Bolt', 'air_bolt'],
        ['melvorD:Blast', 'air_blast'],
        ['melvorD:Wave', 'air_wave'],
        ['melvorD:Surge', 'air_surge'],
        ['melvorF:Nature', 'natureWrathStaff'],
        ['melvorTotH:Poison', 'poison'],
        ['melvorTotH:Infernal', 'infernal_staff'],
        ['melvorTotH:Lightning', 'lighting_staff'],
        ['melvorItA:Abyssal', 'placeholder'],
        ['melvorItA:Brume', 'placeholder'],
        ['melvorItA:Gloom', 'placeholder'],
        ['melvorItA:Wither', 'placeholder'],
        ['melvorItA:Nether', 'placeholder'],
    ])],
    ['melvorD:Magic', new Map([
        ['melvorD:Air', 'air_strike'],
        ['melvorD:Water', 'water_strike'],
        ['melvorD:Earth', 'earth_strike'],
        ['melvorD:Fire', 'fire_strike'],
        ['melvorD:Elemental', 'air_strike'],
        ['melvorD:Strike', 'air_strike'],
        ['melvorD:Bolt', 'air_bolt'],
        ['melvorD:Blast', 'air_blast'],
        ['melvorD:Wave', 'air_wave'],
        ['melvorD:Surge', 'air_surge'],
        ['melvorF:Nature', 'nature_wrath_staff'],
        ['melvorTotH:Poison', 'poison'],
        ['melvorTotH:Infernal', 'infernal_staff'],
        ['melvorTotH:Lightning', 'lighting_staff'],
        ['melvorItA:Abyssal', 'placeholder'],
        ['melvorItA:Brume', 'placeholder'],
        ['melvorItA:Gloom', 'placeholder'],
        ['melvorItA:Wither', 'placeholder'],
        ['melvorItA:Nether', 'placeholder'],
    ])],
    ['melvorD:Cooking', new Map([
        ['melvorD:Fish', 'fishing'],
        ['melvorD:Soup', 'soup'],
    ])],
    ['melvorD:Smithing', new Map([
        ['melvorD:arrow_tips', 'arrow_tips'],
        ['melvorD:javelin_heads', 'javelin_heads'],
        ['melvorD:crossbow_heads', 'crossbow_heads'],
        ['melvorItA:abyssal_arrow_tips', 'abyssal_arrow_tips'],
        ['melvorItA:abyssal_javelin_heads', 'abyssal_javelin_heads'],
    ])],
    ['melvorD:Fletching', new Map([
        ['melvorF:Arrows', 'arrows'],
        ['melvorF:Bolts', 'bolts'],
        ['melvorF:Javelins', 'javelins'],
        ['melvorF:unstrung_bows', 'unstrung_bows'],
    ])],
    ['melvorD:Crafting', new Map([
        ['melvorF:Jewelry', 'jewelry'],
        ['melvorF:Consumables', 'consumable'],
        ['melvorItA:abyssal_jewelry', 'abyssal_jewelry'],
    ])],
    ['melvorD:Runecrafting', new Map([
        ['melvorF:Runes', 'rune_essence'],
        ['melvorF:ElementalRunes', 'air_rune'],
        ['melvorF:Staves', 'staves'],
        ['melvorF:Wands', 'wands'],
        ['melvorF:WaterComboRunes', 'water_rune'],
        ['melvorItA:abyssal_staves', 'abyssal_staves'],
    ])],
]);

/**
 * A map of action scope sources and their respective tag to show.
 * Outer Map's key is the overall source, whereas the inner Map's key represents the specific entry (e.g. "melvorD" subcategory having the entry "melvorD:Soup").
 * DEV NOTE: This only includes scope sources which do not already have media inherintly
 */
export const modifierScopeSourceActionTagMap: Map<string, Map<string, StaticModifierIconTag>> = new Map([]);

/**
 * A map of combat effect group scope sources and their respective tag to show.
 * DEV NOTE: This only includes scope sources which do not already have media inherintly
 */
export const modifierScopeSourceCombatEffectGroupTagMap: Map<string, StaticModifierIconTag> = new Map([
    ['melvorD:StunLike', 'stun'],
    ['melvorD:Stun', 'stun'],
    ['melvorD:StunImmune', 'stun_immunity'],
    ['melvorD:Freeze', 'placeholder'],
    ['melvorD:Crystallize', 'crystallize'],
    ['melvorD:Sleep', 'sleep'],
    ['melvorD:SleepImmune', 'placeholder'],
    ['melvorD:Drowsy', 'placeholder'],
    ['melvorD:Slow', 'slowed'],
    ['melvorD:Frostburn', 'frost_burn'],
    ['melvorD:DamageOverTime', 'placeholder'],
    ['melvorD:BurnDOT', 'burn'],
    ['melvorD:BleedDOT', 'bleed'],
    ['melvorD:PoisonDOT', 'poison'],
    ['melvorD:RegenDOT', 'regen'],
    ['melvorD:DeadlyPoisonDOT', 'deadly_poison'],
    ['melvorD:BarrierBleedDOT', 'barrier_bleed'],
    ['melvorD:BarrierBurnDOT', 'barrier_burn'],
    ['melvorD:LacerationDOT', 'placeholder'],
    ['melvorD:Stacking', 'placeholder'],
    ['melvorD:Curse', 'curse'],
    ['melvorD:Buff', 'placeholder'],
    ['melvorD:Debuff', 'placeholder'],
    ['melvorD:Fear', 'placeholder'],
    ['melvorD:FearImmune', 'placeholder'],
    ['melvorD:CrystalSanction', 'crystal_sanction'],
    ['melvorItA:Corruption', 'placeholder'], // Things like that are part of default game assets, neat; fallback would be checking data packages for the path instead
    ['melvorItA:Blight', 'placeholder'],
    ['melvorItA:Wither', 'placeholder'],
    ['melvorItA:Silence', 'placeholder'],
    ['melvorItA:SilenceImmune', 'placeholder'],
    ['melvorItA:EldritchCurse', 'placeholder'],
    ['melvorItA:Voidburst', 'placeholder'],
    ['melvorItA:ToxinDOT', 'placeholder'],
    ['melvorItA:AblazeDOT', 'placeholder'],
]);

/**
 * A map of scope sources (e.g. a skill or "Attack Spell"),
 * with an inner map of the actual scope's id (e.g. "melvorD:Soup" for cooking subcategory) and its corresponding tag
 * DEV NOTE: Not all scope sources require tagging, as they bring media by themselves. Also worth noting that "actions" should presumably ALWAYS have media, so tagging is more so for categories and subcategories
 */
//export const modifierScopeSourceTagMap: ModifierScopeSourceTagMap = new Map([['melvorD:AttackSpell', {subcategories: new Map([['melvorD:Air', 'spellbook'],['melvorD:Water', 'spellbook'],['melvorD:Earth', 'spellbook'],['melvorD:Fire', 'spellbook'],['melvorD:Elemental', 'spellbook'],['melvorD:Strike', 'spellbook'],['melvorD:Bolt', 'spellbook'],['melvorD:Blast', 'spellbook'],['melvorD:Wave', 'spellbook'],['melvorD:Surge', 'spellbook'],['melvorF:Nature', 'spellbook'],['melvorTotH:Poison', 'spellbook'],['melvorTotH:Infernal', 'spellbook'],['melvorTotH:Lightning', 'spellbook'],])}],['melvorD:Magic', {subcategories: new Map([['melvorD:Air', 'placeholder'],['melvorD:Water', 'placeholder'],['melvorD:Earth', 'placeholder'],['melvorD:Fire', 'placeholder'],['melvorD:Elemental', 'placeholder'],['melvorD:Strike', 'placeholder'],['melvorD:Bolt', 'placeholder'],['melvorD:Blast', 'placeholder'],['melvorD:Wave', 'placeholder'],['melvorD:Surge', 'placeholder'],['melvorF:Nature', 'placeholder'],['melvorTotH:Poison', 'placeholder'],['melvorTotH:Infernal', 'placeholder'],['melvorTotH:Lightning', 'placeholder'],])}],['melvorD:Fishing', {categories: new Map([['melvorD:ShallowShores', 'placeholder'],['melvorD:ShrapnelRiver', 'placeholder'],['melvorD:TrenchOfDespair', 'placeholder'],['melvorD:LemvorPier', 'placeholder'],['melvorD:OpenWaters', 'placeholder'],['melvorD:BarrenOcean', 'placeholder'],['melvorD:BarbarianFishing', 'placeholder'],['melvorD:SecretArea', 'placeholder'],['melvorTotH:MagmaLake', 'placeholder'],['melvorTotH:JungleWaters', 'placeholder'],['melvorTotH:StaticValley', 'placeholder'],['melvorTotH:FrozenSea', 'placeholder'],['melvorTotH:MidnightLagoon', 'placeholder'],['melvorTotH:MysticPond', 'placeholder'],])}],
//['melvorD:Cooking', {subcategories: new Map([['melvorD:Fish', 'fishing'],['melvorD:Soup', 'coal'],])}],['melvorD:Mining', {categories: new Map([['melvorD:Ore', 'placeholder'],['melvorD:Essence', 'placeholder'],['melvorD:Gem', 'placeholder'],])}],['melvorD:Smithing', {subcategories: new Map([['melvorD:arrow_tips', 'placeholder'],['melvorD:javelin_heads', 'placeholder'],['melvorD:crossbow_heads', 'placeholder'],])}],['melvorD:Thieving', {categories: new Map([['melvorF:LOW_TOWN', 'placeholder'],['melvorF:GOLBIN_VILLAGE', 'placeholder'],['melvorF:BANDIT_HIDEOUT', 'placeholder'],['melvorF:FARMERS_MARKET', 'placeholder'],['melvorF:BANQUET', 'placeholder'],['melvorF:PORT_OF_LEMVOR', 'placeholder'],['melvorF:CAVE_OF_GIANTS', 'placeholder'],['melvorF:OUTSKIRTS', 'placeholder'],['melvorF:FORT', 'placeholder'],['melvorF:WIZARD_TOWER', 'placeholder'],['melvorF:ROYAL_CASTLE', 'placeholder'],['melvorTotH:LOST_RUINS', 'placeholder'],['melvorTotH:UNDEAD_PALACE', 'placeholder'],['melvorTotH:DESERT', 'placeholder'],['melvorTotH:MUSHROOM_FOREST', 'placeholder'],['melvorTotH:TWILIGHT', 'placeholder'],])}],['melvorD:Fletching', {subcategories: new Map([['melvorF:Arrows', 'placeholder'],['melvorF:Bolts', 'placeholder'],['melvorF:Javelins', 'placeholder'],['melvorF:unstrung_bows', 'placeholder'],])}],['melvorD:Crafting', {subcategories: new Map([['melvorF:Jewelry', 'placeholder'],['melvorF:Consumables', 'placeholder'],])}],['melvorD:Runecrafting', {subcategories: new Map([['melvorF:Runes', 'placeholder'],['melvorF:ElementalRunes', 'placeholder'],['melvorF:Staves', 'placeholder'],['melvorF:Wands', 'placeholder'],['melvorF:WaterComboRunes', 'placeholder'],])}],]);
//
//type ModifierScopeSourceTagMap = Map<string, {
//    categories?: Map<string, StaticModifierIconTag>
//    subcategories?: Map<string, StaticModifierIconTag>
//    actions?: Map<string, StaticModifierIconTag>
//}>