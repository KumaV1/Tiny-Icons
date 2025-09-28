import { StaticModifierIconTag } from "../ModifierIcons";

// TODO: Possibly make the type "() => StaticModifierIconTag[]" instead of "StaticModifierIconTag"? Would be easier than trying to for example merge 2-3 svgs into a single one

/**
 * A map of category scope sources and their respective tag to show.
 * Outer Map's key is the overall source, whereas the inner Map's key represents the specific entry (e.g. "melvorD" subcategory having the entry "melvorD:Soup").
 * DEV NOTE: This only includes scope sources which do not already have media inherintly
 */
export const modifierScopeSourceCategoryTagMap: Map<string, Map<string, StaticModifierIconTag>> = new Map([
    ['melvorD:Fishing', new Map([
        ['melvorD:ShallowShores', 'placeholder'],
        ['melvorD:ShrapnelRiver', 'placeholder'],
        ['melvorD:TrenchOfDespair', 'placeholder'],
        ['melvorD:LemvorPier', 'placeholder'],
        ['melvorD:OpenWaters', 'placeholder'],
        ['melvorD:BarrenOcean', 'placeholder'],
        ['melvorD:BarbarianFishing', 'placeholder'],
        ['melvorD:SecretArea', 'placeholder'],
        ['melvorTotH:MagmaLake', 'placeholder'],
        ['melvorTotH:JungleWaters', 'placeholder'],
        ['melvorTotH:StaticValley', 'placeholder'],
        ['melvorTotH:FrozenSea', 'placeholder'],
        ['melvorTotH:MidnightLagoon', 'placeholder'],
        ['melvorTotH:MysticPond', 'placeholder'],
        ['melvorAoD:FishermansEnclave', 'placeholder'],
        ['melvorItA:CrimsonRiver', 'placeholder'],
        ['melvorItA:MistveilSwamp', 'placeholder'],
        ['melvorItA:ToxicPools', 'placeholder'],
        ['melvorItA:PetrifiedChannel', 'placeholder'],
        ['melvorItA:WhisperCove', 'placeholder'],
        ['melvorItA:TendrilDepths', 'placeholder'],
        ['melvorItA:VoidLagoon', 'placeholder'],
        ['melvorItA:CelestialPond', 'placeholder'],
    ])],
    ['melvorD:Mining', new Map([
        ['melvorD:Ore', 'placeholder'],
        ['melvorD:Essence', 'placeholder'],
        ['melvorD:Gem', 'placeholder'],
        ['melvorItA:AbyssalOre', 'placeholder'],
        ['melvorItA:AbyssalGem', 'placeholder'],
        ['melvorItA:Outcrop', 'placeholder'],
        ['melvorItA:AbyssalEssence', 'placeholder'],
    ])],
    ['melvorD:Thieving', new Map([
        ['melvorF:LOW_TOWN', 'placeholder'],
        ['melvorF:GOLBIN_VILLAGE', 'placeholder'],
        ['melvorF:BANDIT_HIDEOUT', 'placeholder'],
        ['melvorF:FARMERS_MARKET', 'placeholder'],
        ['melvorF:BANQUET', 'placeholder'],
        ['melvorF:PORT_OF_LEMVOR', 'placeholder'],
        ['melvorF:CAVE_OF_GIANTS', 'placeholder'],
        ['melvorF:OUTSKIRTS', 'placeholder'],
        ['melvorF:FORT', 'placeholder'],
        ['melvorF:WIZARD_TOWER', 'placeholder'],
        ['melvorF:ROYAL_CASTLE', 'placeholder'],
        ['melvorTotH:LOST_RUINS', 'placeholder'],
        ['melvorTotH:UNDEAD_PALACE', 'placeholder'],
        ['melvorTotH:DESERT', 'placeholder'],
        ['melvorTotH:MUSHROOM_FOREST', 'placeholder'],
        ['melvorTotH:TWILIGHT', 'placeholder'],
        ['melvorItA:CrimsonVillage', 'placeholder'],
        ['melvorItA:BlightedReach', 'placeholder'],
        ['melvorItA:ShadeveilMaze', 'placeholder'],
        ['melvorItA:WitheringRuins', 'placeholder'],
        ['melvorItA:SilentCrypt', 'placeholder'],
        ['melvorItA:VoidVaults', 'placeholder'],
    ])],
]);

/**
 * A map of subcategory scope sources and their respective tag to show.
 * Outer Map's key is the overall source, whereas the inner Map's key represents the specific entry (e.g. "melvorD" subcategory having the entry "melvorD:Soup").
 * DEV NOTE: This only includes scope sources which do not already have media inherintly
 */
export const modifierScopeSourceSubcategoryTagMap: Map<string, Map<string, StaticModifierIconTag>> = new Map([
    ['melvorD:AttackSpell', new Map([
        ['melvorD:Air', 'air_strike'],
        ['melvorD:Water', 'placeholder'],
        ['melvorD:Earth', 'earth_strike'],
        ['melvorD:Fire', 'fire_strike'],
        ['melvorD:Elemental', 'placeholder'],
        ['melvorD:Strike', 'placeholder'],
        ['melvorD:Bolt', 'placeholder'],
        ['melvorD:Blast', 'placeholder'],
        ['melvorD:Wave', 'placeholder'],
        ['melvorD:Surge', 'placeholder'],
        ['melvorF:Nature', 'placeholder'],
        ['melvorTotH:Poison', 'poison'],
        ['melvorTotH:Infernal', 'placeholder'],
        ['melvorTotH:Lightning', 'placeholder'],
        ['melvorItA:Abyssal', 'placeholder'],
        ['melvorItA:Brume', 'placeholder'],
        ['melvorItA:Gloom', 'placeholder'],
        ['melvorItA:Wither', 'placeholder'],
        ['melvorItA:Nether', 'placeholder'],
    ])],
    ['melvorD:Magic', new Map([
        ['melvorD:Air', 'air_strike'],
        ['melvorD:Water', 'placeholder'],
        ['melvorD:Earth', 'earth_strike'],
        ['melvorD:Fire', 'fire_strike'],
        ['melvorD:Elemental', 'placeholder'],
        ['melvorD:Strike', 'placeholder'],
        ['melvorD:Bolt', 'placeholder'],
        ['melvorD:Blast', 'placeholder'],
        ['melvorD:Wave', 'placeholder'],
        ['melvorD:Surge', 'placeholder'],
        ['melvorF:Nature', 'placeholder'],
        ['melvorTotH:Poison', 'placeholder'],
        ['melvorTotH:Infernal', 'placeholder'],
        ['melvorTotH:Lightning', 'placeholder'],
        ['melvorItA:Abyssal', 'placeholder'],
        ['melvorItA:Brume', 'placeholder'],
        ['melvorItA:Gloom', 'placeholder'],
        ['melvorItA:Wither', 'placeholder'],
        ['melvorItA:Nether', 'placeholder'],
    ])],
    ['melvorD:Cooking', new Map([
        ['melvorD:Fish', 'fishing'],
        ['melvorD:Soup', 'placeholder'],
    ])],
    ['melvorD:Smithing', new Map([
        ['melvorD:Arrowtips', 'placeholder'],
        ['melvorD:JavelinHeads', 'placeholder'],
        ['melvorD:CrossbowHeads', 'placeholder'],
        ['melvorItA:AbyssalArrowtips', 'placeholder'],
        ['melvorItA:AbyssalJavelinHeads', 'placeholder'],
    ])],
    ['melvorD:Fletching', new Map([
        ['melvorF:Arrows', 'placeholder'],
        ['melvorF:Bolts', 'placeholder'],
        ['melvorF:Javelins', 'placeholder'],
        ['melvorF:UnstrungBows', 'placeholder'],
    ])],
    ['melvorD:Crafting', new Map([
        ['melvorF:Jewelry', 'placeholder'],
        ['melvorF:Consumables', 'placeholder'],
        ['melvorItA:AbyssalJewelry', 'placeholder'],
    ])],
    ['melvorD:Runecrafting', new Map([
        ['melvorF:Runes', 'placeholder'],
        ['melvorF:ElementalRunes', 'placeholder'],
        ['melvorF:Staves', 'placeholder'],
        ['melvorF:Wands', 'placeholder'],
        ['melvorF:WaterComboRunes', 'placeholder'],
        ['melvorItA:AbyssalStaves', 'placeholder'],
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
//['melvorD:Cooking', {subcategories: new Map([['melvorD:Fish', 'fishing'],['melvorD:Soup', 'coal'],])}],['melvorD:Mining', {categories: new Map([['melvorD:Ore', 'placeholder'],['melvorD:Essence', 'placeholder'],['melvorD:Gem', 'placeholder'],])}],['melvorD:Smithing', {subcategories: new Map([['melvorD:Arrowtips', 'placeholder'],['melvorD:JavelinHeads', 'placeholder'],['melvorD:CrossbowHeads', 'placeholder'],])}],['melvorD:Thieving', {categories: new Map([['melvorF:LOW_TOWN', 'placeholder'],['melvorF:GOLBIN_VILLAGE', 'placeholder'],['melvorF:BANDIT_HIDEOUT', 'placeholder'],['melvorF:FARMERS_MARKET', 'placeholder'],['melvorF:BANQUET', 'placeholder'],['melvorF:PORT_OF_LEMVOR', 'placeholder'],['melvorF:CAVE_OF_GIANTS', 'placeholder'],['melvorF:OUTSKIRTS', 'placeholder'],['melvorF:FORT', 'placeholder'],['melvorF:WIZARD_TOWER', 'placeholder'],['melvorF:ROYAL_CASTLE', 'placeholder'],['melvorTotH:LOST_RUINS', 'placeholder'],['melvorTotH:UNDEAD_PALACE', 'placeholder'],['melvorTotH:DESERT', 'placeholder'],['melvorTotH:MUSHROOM_FOREST', 'placeholder'],['melvorTotH:TWILIGHT', 'placeholder'],])}],['melvorD:Fletching', {subcategories: new Map([['melvorF:Arrows', 'placeholder'],['melvorF:Bolts', 'placeholder'],['melvorF:Javelins', 'placeholder'],['melvorF:UnstrungBows', 'placeholder'],])}],['melvorD:Crafting', {subcategories: new Map([['melvorF:Jewelry', 'placeholder'],['melvorF:Consumables', 'placeholder'],])}],['melvorD:Runecrafting', {subcategories: new Map([['melvorF:Runes', 'placeholder'],['melvorF:ElementalRunes', 'placeholder'],['melvorF:Staves', 'placeholder'],['melvorF:Wands', 'placeholder'],['melvorF:WaterComboRunes', 'placeholder'],])}],]);
//
//type ModifierScopeSourceTagMap = Map<string, {
//    categories?: Map<string, StaticModifierIconTag>
//    subcategories?: Map<string, StaticModifierIconTag>
//    actions?: Map<string, StaticModifierIconTag>
//}>