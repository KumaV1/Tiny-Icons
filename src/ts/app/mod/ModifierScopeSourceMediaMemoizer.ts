import { NamedObjectWithMedia } from "./types/namedObjectWithMedia";

/**
 * A class for managing (and preserving, for efficiency) icons for various scope sources, 
 * which do not inherintly possess their own media (e.g. a "combat effect group" like `melvorD:Stun` does not have media associated with it).
 *
 * Most tag maps are two-layered, as they are layered to "main source" (e.g. "melvorD:Fletching") and then corresponding entry (e.g. subcategory entry "melvorF:Arrows")
 */
export class ModifierScopeSourceMediaMemoizer {
    /**
     * A map of objects for {@link IModifierScope.category} entries that do not inherintly have their own media
     */
    public static categoryMediaMap: Map<string, Map<string, NamedObjectWithMedia>>;

    /**
     * A map of objects for {@link IModifierScope.subcategory} entries that do not inherintly have their own media
     */
    public static subcategoryMediaMap: Map<string, Map<string, NamedObjectWithMedia>>;

    /**
     * A map of objects for {@link IModifierScope.action} entries that do not inherintly have their own media
     */
    public static actionMediaMap: Map<string, Map<string, NamedObjectWithMedia>>;

    /**
     * A map of objects for {@link IModifierScope.effectGroup} entries that do not inherintly have their own media
     */
    public static effectGroupMediaMap: Map<string, NamedObjectWithMedia>;

    /**
     * Initialize the memoizer and set some game data
     * @param ctx
     */
    public static init(ctx: Modding.ModContext) {
        ModifierScopeSourceMediaMemoizer.categoryMediaMap = new Map();
        ModifierScopeSourceMediaMemoizer.subcategoryMediaMap = new Map();
        ModifierScopeSourceMediaMemoizer.actionMediaMap = new Map();
        ModifierScopeSourceMediaMemoizer.effectGroupMediaMap = new Map();

        ctx.onCharacterSelectionLoaded(function() {
            // Init tagging for base game (and expansions)
            ModifierScopeSourceMediaMemoizer.initCategoryMediaMap();
            ModifierScopeSourceMediaMemoizer.initSubcategoryMediaMap();
            ModifierScopeSourceMediaMemoizer.initActionMediaMap();
            ModifierScopeSourceMediaMemoizer.initEffectGroupMediaMap();

            // Init tag for modded stuff
            ModifierScopeSourceMediaMemoizer.addModData();
        });
    }

    /**
     * Register data of mods
     */
    public static registerModData() {// TODO: alternative name this "preserve/stup/preparation" or something
        // IMPORTANT: To support mod data for existing stuff inherintly (e.g. additional fletching category added by a mod),
        // it is important that the tag maps are only initialized after all mods loaded (e.g. during character select hook).
        // Therefore, this should write the content into a private property that is then later actually added to tag maps via "addModData"
    }

    /**
     * Initialize category tag map with data
     */
    private static initCategoryMediaMap() {
        // Fishing
        let fishingCategoryMediaMap: Map<string, NamedObjectWithMedia> = new Map();
        game.fishing.areas.forEach((area: FishingArea) => {
            if (!area.fish || area.fish.length < 1) {
                console.warn(`[Tiny Icons] Unable to find any fish in fishing area ${area.id}`);
            } else {
                fishingCategoryMediaMap.set(area.id, area.fish[0]);
            }
        });
        this.categoryMediaMap.set(SkillIDs.Fishing, fishingCategoryMediaMap);

        // Thieving
        let thievingCategoryMediaMap: Map<string, NamedObjectWithMedia> = new Map();
        game.thieving.areas.forEach((area: ThievingArea) => {
            if (!area.npcs || area.npcs.length < 1) {
                console.warn(`[Tiny Icons] Unable to find any npcs in thieving area ${area.id}`);
            } else {
                thievingCategoryMediaMap.set(area.id, area.npcs[0]);
            }
        });
        this.categoryMediaMap.set(SkillIDs.Thieving, thievingCategoryMediaMap);
    }

    /**
     * Initialize subcategory tag map with data
     */
    private static initSubcategoryMediaMap() {
        // TODO: Probably do this similarly to combat effect groups, looping through the actions, rather than the subcategory type
        // ^ On that note, if fishing or thieving had also been here, could have been worth to merge the methods

        // Attack spell
        let attackSpellSubcategoryMediaMap: Map<string, NamedObjectWithMedia> = new Map();
        game.attackSpells.forEach((attackSpell: AttackSpell) => {
            if (attackSpell.categories && attackSpell.categories.length > 0) {
                attackSpell.categories.forEach((category: SkillSubcategory) => {
                    if (!attackSpellSubcategoryMediaMap.has(category.id)) {
                        attackSpellSubcategoryMediaMap.set(category.id, attackSpell);
                    }
                });
            }
        });
        this.subcategoryMediaMap.set('melvorD:AttackSpell', attackSpellSubcategoryMediaMap);

        // Magic (not sure tbh, but let's prioritize actions, while also going through attack spells, I guess?)
        let magicSubcategoryMediaMap: Map<string, NamedObjectWithMedia> = new Map();
        game.altMagic.actions.forEach((altMagicSpell: AltMagicSpell) => {
            if (altMagicSpell.categories && altMagicSpell.categories.length > 0) {
                altMagicSpell.categories.forEach((category: SkillSubcategory) => {
                    if (!magicSubcategoryMediaMap.has(category.id)) {
                        magicSubcategoryMediaMap.set(category.id, altMagicSpell);
                    }
                });
            }
        });
        game.attackSpells.forEach((attackSpell: AttackSpell) => {
            if (attackSpell.categories && attackSpell.categories.length > 0) {
                attackSpell.categories.forEach((category: SkillSubcategory) => {
                    if (!magicSubcategoryMediaMap.has(category.id)) {
                        magicSubcategoryMediaMap.set(category.id, attackSpell);
                    }
                });
            }
        });
        this.subcategoryMediaMap.set(SkillIDs.Magic, magicSubcategoryMediaMap);

        // Cooking
        let cookingSubcategoryMediaMap: Map<string, NamedObjectWithMedia> = new Map();
        game.cooking.actions.forEach((recipe: CookingRecipe) => {
            if (recipe.subcategory && !cookingSubcategoryMediaMap.has(recipe.subcategory.id)) {
                cookingSubcategoryMediaMap.set(recipe.subcategory.id, recipe);
            }
        });
        this.subcategoryMediaMap.set(SkillIDs.Cooking, cookingSubcategoryMediaMap);

        // Smithing
        let smithingSubcategoryMediaMap: Map<string, NamedObjectWithMedia> = new Map();
        game.smithing.actions.forEach((recipe: SmithingRecipe) => {
            if (recipe.subcategory && !smithingSubcategoryMediaMap.has(recipe.subcategory.id)) {
                smithingSubcategoryMediaMap.set(recipe.subcategory.id, recipe);
            }
        });
        this.subcategoryMediaMap.set(SkillIDs.Smithing, smithingSubcategoryMediaMap);

        // Fletching
        let fletchingSubcategoryMediaMap: Map<string, NamedObjectWithMedia> = new Map();
        game.fletching.actions.forEach((recipe: FletchingRecipe) => {
            if (recipe.subcategory && !fletchingSubcategoryMediaMap.has(recipe.subcategory.id)) {
                fletchingSubcategoryMediaMap.set(recipe.subcategory.id, recipe);
            }
        });
        this.subcategoryMediaMap.set(SkillIDs.Fletching, fletchingSubcategoryMediaMap);

        // Crafting
        let craftingSubcategoryMediaMap: Map<string, NamedObjectWithMedia> = new Map();
        game.crafting.actions.forEach((recipe: CraftingRecipe) => {
            if (recipe.subcategory && !craftingSubcategoryMediaMap.has(recipe.subcategory.id)) {
                craftingSubcategoryMediaMap.set(recipe.subcategory.id, recipe);
            }
        });
        this.subcategoryMediaMap.set(SkillIDs.Crafting, craftingSubcategoryMediaMap);

        // Runecrafting
        let runecraftingSubcategoryMediaMap: Map<string, NamedObjectWithMedia> = new Map();
        game.runecrafting.actions.forEach((recipe: RunecraftingRecipe) => {
            if (recipe.subcategories && recipe.subcategories.length > 1) {
                recipe.subcategories.forEach((runecraftingSubcategory: SkillSubcategory) => {
                    if (!runecraftingSubcategoryMediaMap.has(runecraftingSubcategory.id)) {
                        runecraftingSubcategoryMediaMap.set(runecraftingSubcategory.id, recipe);
                    }
                });
            }
        });
        this.subcategoryMediaMap.set(SkillIDs.Runecrafting, runecraftingSubcategoryMediaMap);
    }

    /**
     * Initialize action tag map with data
     */
    private static initActionMediaMap() {
        // None
    }

    /**
     * Initialize (combat) effect group tag map with data
     */
    private static initEffectGroupMediaMap() {
        // Not layered

        // We try to set icons via combat effect, so why not just go through the effects itself,
        // Unused effect groups may be missing an icon then, but those could be set manually if need be,
        // and going through the ffects is probably more performant
        game.combatEffects.forEach((combatEffect: CombatEffect) => {
            combatEffect.effectGroups.forEach((combatEffectGroup: CombatEffectGroup) => {
                if (!this.effectGroupMediaMap.has(combatEffectGroup.id)) {
                    this.effectGroupMediaMap.set(combatEffectGroup.id, combatEffect);
                }
            });
        });

        // TODO: I may actually want to overwrite some of these, e.g. "Buff" and "Debuff" being incredibly generic, or "DamageOverTime" which combines all the other dots and probably shouldn't use the icon of one specific one
    }

    /**
     * Add data provided by mods via API
     */
    private static addModData() {
        // Note: a mod must be able to overwrite whatever here. If they add an effect group and know a more fitting icon, let them overwrite what this mod initially chose
    }
}