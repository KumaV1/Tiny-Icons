import { PublicApi } from './mod/PublicApi';
import { TagManager } from './mod/managers/TagManager';
import { ModifierScopeSourceMediaMemoizer } from './mod/ModifierScopeSourceMediaMemoizer';
import { TagAllocationMemoizer } from './mod/TagAllocationMemoizer';
import { PatchManager } from './mod/managers/PatchManager';
import { TranslationManager } from './mod/managers/TranslationManager';
import { SettingsManager } from './mod/managers/SettingsManager';
import { SkillBoostsCompatibility } from './mod/compatibility/SkillBoostsCompatibility';
import { Constants } from './constants';
import { Logger } from './mod/Logger';

// Game data
//import '../../../src/data/testData.json'; Various other, ACTUAL data tfiles
import TestData from '../../../src/data/testData.json';
import AncientRelicItAData from '../../../src/data/ancientRelics/modificationsItA.json';
import AstrologyRecipeItAData from '../../../src/data/astrologyRecipes/modificationsItA.json';
import ItemModificationData from '../../../src/data/items/modifications.json';
import ItemTotHModificationData from '../../../src/data/items/modificationsTotH.json';
import ItemAoDModificationData from '../../../src/data/items/modificationsAoD.json';
import ItemItAModificationData from '../../../src/data/items/modificationsItA.json';
import SummoningSynergyModificationData from '../../../src/data/summoningSynergies/modifications.json';
import CombatPassiveModificationData from '../../../src/data/combatPassives/modifications.json';
import CombatPassiveTotHModificationData from '../../../src/data/combatPassives/modificationsTotH.json';
import PrayersAoDModificationData from '../../../src/data/prayers/modificationsAoD.json';
import ShopPurchasesModificationData from '../../../src/data/shopPurchases/modifications.json';
import ShopPurchasesTotHModificationData from '../../../src/data/shopPurchases/modificationsTotH.json';
import ShopPurchasesItAModificationData from '../../../src/data/shopPurchases/modificationsItA.json';
import SummoningSynergiesModificationData from '../../../src/data/summoningSynergies/modifications.json';
import SummoningSynergiesTotHModificationData from '../../../src/data/summoningSynergies/modificationsTotH.json';
import SummoningSynergiesAoDModificationData from '../../../src/data/summoningSynergies/modificationsAoD.json';
import SummoningSynergiesItAModificationData from '../../../src/data/summoningSynergies/modificationsItA.json';
import TownshipModificationData from '../../../src/data/township/modifications.json';
import TownshipItAModificationData from '../../../src/data/township/modificationsItA.json';

// TODO: Add icon setting to combat effects. MUST BE TOGGABLE and DEFAULT TO OFF, due to english already adding icons
// ^ Should preferably be able to inherit icons from "combatEffectTemplates", though would have to worry about too many icons, maybe.
// ^ Probably allow final combat effect object to not "add to icons from templates", but rather overwrite them

export class Main {
  public init(ctx: Modding.ModContext) {
    // Initialize various managers and other stuff
    const t0: number = performance.now();
    TranslationManager.register();
    PatchManager.patch(ctx);
    TagManager.init(ctx);
    ModifierScopeSourceMediaMemoizer.init(ctx);
    TagAllocationMemoizer.init(ctx);
    SettingsManager.init(ctx.settings.section('Tiny Icons'));
    PublicApi.init(ctx);

    // Initialize compatiblity with other mods
    SkillBoostsCompatibility.init(ctx);

    // Hook-in settings and some recomputations
    ctx.onCharacterLoaded(function () {
      SettingsManager.setSettingsFromCharacter();

      enforceCharacterLoadRecomputations();
    });
    ctx.onInterfaceReady(function () {
      SettingsManager.setSettingsFromCharacter();

      enforceInterfaceReadyRecomputations();
    });

    // Load in data packages
    if (Constants.DEV_MODE) {
      // Load test data
      loadTestData(ctx);
    }
    loadModifications(ctx);
    const t1: number = performance.now();

    if (Constants.DEV_MODE) {
      Logger.log(`Loading hook-unrelated things took ${Math.floor(t1 - t0)}ms`);
    }

    // Development utility
    if (Constants.DEV_MODE) {
      addTestStuff(ctx);
    }
  }
}

/**
 * Some recomputations can only happen after full ui initialization
 */
function enforceInterfaceReadyRecomputations() {
  const t0: number = performance.now();

  // Force shop description re-computations
  try {
    shopMenu.tabs.forEach((tab) => {
      tab.menu.items.forEach((item) => {
        // We only re-compute auto-generated ones, as those are affected by (character-specific) mod settings
        if (item.item.purchase.contains?.stats !== undefined) {
          item.item.description.innerHTML = item.item.purchase.getTemplatedDescription(game.shop);
        }
      });
    });
  } catch (e) {
    Logger.warn('An error occurred while trying to re-compute shop purchase descriptions. The UI may be in an unexpected state', e);
  }

  const t1: number = performance.now();

  if (Constants.DEV_MODE) {
    Logger.log(`Enforcing (NOT necessarily running) interface-ready re-computation took ${Math.floor(t1 - t0)}ms`);
  }
}

/**
 * Upon entering the character, thereby the mod settings becoming active (differing from their default values),
 * there will be various locations that need to be enforced to re-compute their descriptions in order to reflect the settings
 * DEV NOTE: This is not just in relation to modifications of resolvers. Automated texts (e.g. stat object printing) can also be affected.
 * @param ctx
 */
function enforceCharacterLoadRecomputations() {
  const t0: number = performance.now();
  game.items.forEach((item) => {
    item._modifiedDescription = undefined;
    if (item.tinyIcons) {
      item.tinyIcons.customDescriptionModified = false;
      // Possibly also revert cached html, as additional data packages (e.g. item synergies) may have made the results inaccurate
    }
  });
  game.specialAttacks.forEach((specialAttack) => {
    specialAttack._modifiedDescription = undefined;
  });
  game.combatPassives.forEach((combatPassive) => {
    combatPassive._modifiedDescription = undefined;
  });
  game.prayer.renderQueue.prayerMenu = true;

  try {
    // Seems like equipment is actually rendered pre character load hook
    // The following enforces the grids of all equipment sets to be re-rendered
    combatMenus.equipment.forEach((grid) => {
      grid.icons.forEach((icon, slot) => {
        if (icon.tooltipElem) {
          // otherwise the game would notice items not having changed and refuse to re-render the slots
          icon.tooltipElem.unset = true;
        }
      });
    });
    game.combat.player.renderQueue.equipment = true;
  } catch (e) {
    Logger.warn('An error occurred while trying to reset the render of equipment sets. The UI may be in an unexpected state', e);
  }
  try {
    game.attackStyles.forEach((style) => {
      const styleButton = document.getElementById(style.buttonID);
      if (styleButton) {
        // @ts-ignore: Tippy property not defined on definition
        styleButton._tippy.setContent(style.toolTipContent);
      }
    });
  } catch (e) {
    Logger.warn('An error occurred while trying to re-set the combat style button tooltips', e);
  }
  const t1: number = performance.now();

  if (Constants.DEV_MODE) {
    Logger.log(`Enforcing (NOT necessarily running) character-load re-computation took ${Math.floor(t1 - t0)}ms`);
  }
}

async function loadTestData(ctx: Modding.ModContext) {
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(TestData);

  // TODO: Add following to test data:
  // * Pet with conditional modifier(s)
}

async function loadModifications(ctx: Modding.ModContext) {
  // Normal
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(AncientRelicItAData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(AstrologyRecipeItAData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(ItemModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(ItemTotHModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(ItemAoDModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(ItemItAModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(SummoningSynergyModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(CombatPassiveModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(CombatPassiveTotHModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(PrayersAoDModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(ShopPurchasesModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(ShopPurchasesTotHModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(ShopPurchasesItAModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(SummoningSynergiesModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(SummoningSynergiesTotHModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(SummoningSynergiesAoDModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(SummoningSynergiesItAModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(TownshipModificationData);
  // @ts-ignore: Supposed non-matching type (e.g. Tiny Icons custom stuff, I guess)
  await ctx.gameData.addPackage(TownshipItAModificationData);
  // ^ Could possibly create a custom schema and reference that in the json, rather than the melvor one
}

function addTestStuff(ctx: Modding.ModContext) {
  // Always (allow solar eclipse season, so stats are actually printed)
  ctx.onCharacterLoaded(function () {
    const modifier = game.modifierRegistry.getObjectSafe(ModifierIDs.enableSolarEclipseSeason);
    const modifierValue = new ModifierValue(modifier, 1);
    const statObject = {
      modifiers: [modifierValue]
    };
    const statProvider = new StatProvider();
    statProvider.addStatObject({ name: 'TinyIconsSolarEclipse' }, statObject);
    game.combat.registerStatProvider(statProvider);
    game.combat.computeAllStats();
  });

  // Only after tutorial
  ctx.patch(Tutorial, 'completeTutorial').after(function () {
    // Called both on proper completion and on skip
    // Set some settings for less spam (DEV NOTE: Currently does not work)
    //game.settings.boolData.showSummoningMarkDiscoveryModals.currentValue = false;

    // Currency and shop purchases
    game.gp.add(2500000000);
    game.shop.buyQuantity = 500;
    game.shop.buyItemOnClick(game.shop.purchases.getObjectSafe('melvorD:Extra_Bank_Slot'), true);
    game.shop.buyQuantity = 1;

    // Add items
    game.bank.addItemByID('tinyIcons:Test1', 10, false, false, false);
    game.bank.addItemByID('tinyIcons:Test2', 10, false, false, false);
    game.bank.addItemByID('tinyIcons:Test3', 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Summoning_Familiar_Golbin_Thief, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Summoning_Familiar_Occultist, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Summoning_Familiar_Cyclops, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Summoning_Familiar_Lightning_Spirit, 10, false, false, false);
    game.bank.addItemByID('tinyIcons:Summoning_Familiar_Test', 10, false, false, false); // for synergy where conditional modifier arra< entry uses lang key (example: Avyysal Wolf + Abyssal Witch)
    game.bank.addItemByID(ItemIDs.Mining_Gloves, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Ancient_Wizard_Hat, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Fire_Acolyte_Wizard_Robes, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Sand_Treaders, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Slayer_Binding_Scroll, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Air_Battlestaff, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Bobs_Rake, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Ancient_Sword, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Ethereal_Longbow, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Poison_Virulence_Ring, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Summoning_Skillcape, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Bones, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Mastery_Token_Cooking, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Compost, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Bank_Slot_Token, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Superior_Thieving_Skillcape, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Controlled_Heat_Potion_I, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Controlled_Heat_Potion_IV, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Book_of_Eli, 10, false, false, false);
    game.bank.addItemByID(ItemIDs.Book_of_the_Ancients, 10, false, false, false);

    // Add skill levels
    game.altMagic.addXP(exp.levelToXP(75) + 1);
    game.prayer.addXP(exp.levelToXP(20) + 1); // just to avoid confusion, as the new prayer uses "?" inherintly, not just for "unknown state" - which is made clear by icons following being displayed as normal
    game.astrology.addXP(exp.levelToXP(105) + 1);
    game.summoning.addXP(exp.levelToXP(115) + 1);
    game.thieving.addXP(exp.levelToXP(120) + 1);
    game.hitpoints.addXP(exp.levelToXP(120) + 1);
    game.township.addXP(exp.levelToXP(120) + 1);
    game.woodcutting.addXP(exp.levelToXP(80) + 1);
    game.fishing.addXP(exp.levelToXP(80) + 1);
    game.mining.addXP(exp.levelToXP(80) + 1);
    game.cooking.addXP(exp.levelToXP(80) + 1);
    game.smithing.addXP(exp.levelToXP(80) + 1);
    game.firemaking.addXP(exp.levelToXP(80) + 1);

    // Skill progress (Astrology Mastery)
    const tiAction = game.astrology.actions.getObjectSafe('tinyIcons:Test');
    game.astrology.addMasteryXP(tiAction, exp.levelToXP(50) + 1);

    // Skill process (Summoning marks)
    const MARK_COUNT = 61 // Enough for mark level 6
    const GOLBIN_THIEF_RECIPE = game.summoning.recipesByProduct.get(game.items.getObjectSafe(ItemIDs.Summoning_Familiar_Golbin_Thief));
    const OCCULTIST_THIEF_RECIPE = game.summoning.recipesByProduct.get(game.items.getObjectSafe(ItemIDs.Summoning_Familiar_Occultist));
    const CYCLOPS_THIEF_RECIPE = game.summoning.recipesByProduct.get(game.items.getObjectSafe(ItemIDs.Summoning_Familiar_Cyclops));
    const LIGHTNING_SPIRIT_RECIPE = game.summoning.recipesByProduct.get(game.items.getObjectSafe(ItemIDs.Summoning_Familiar_Lightning_Spirit));
    const TEST_FAMILIAR_RECIPE = game.summoning.recipesByProduct.get(game.items.getObjectSafe("tinyIcons:Summoning_Familiar_Test"));
    if (GOLBIN_THIEF_RECIPE && OCCULTIST_THIEF_RECIPE && CYCLOPS_THIEF_RECIPE && LIGHTNING_SPIRIT_RECIPE && TEST_FAMILIAR_RECIPE) {
      for (let i = 0; i < MARK_COUNT; i++) {
        game.summoning.discoverMark(GOLBIN_THIEF_RECIPE);
        game.summoning.discoverMark(OCCULTIST_THIEF_RECIPE);
        game.summoning.discoverMark(CYCLOPS_THIEF_RECIPE);
        game.summoning.discoverMark(LIGHTNING_SPIRIT_RECIPE);
        game.summoning.discoverMark(TEST_FAMILIAR_RECIPE);
      }
    }

    // Unlock pets
    game.petManager.unlockPetByID('tinyIcons:Test');
    game.petManager.unlockPetByID('tinyIcons:Test2');

    // Initialize township and force specific season
    game.township.confirmTownCreation();
    if (!game.township.townData.season || game.township.townData.season.id !== TownshipSeasonIDs.SolarEclipse) {
      const season = game.township.seasons.getObjectSafe(TownshipSeasonIDs.SolarEclipse);
      game.township.townData.season = season;
      game.township.townData.seasonTicksRemaining = season.seasonLength;
      game.township.renderQueue.updateSeason = true;
    }

    // etc.

    // Reset some settings, now that initial setup is done
    //setTimeout(function () {
    //    game.settings.boolData.showSummoningMarkDiscoveryModals.currentValue = true;
    //}, 10000);

    // ADD LOTS OF ITEMS FOR WHICH TO TEST WHETHER ICONS ARE BEING DISPLAYED NICELY
    const summoningTablets = game.summoning.actions.allObjects.map(a => a.product);
    summoningTablets.forEach((item) => {
      game.bank.addItemByID(item.id, 10, false, false, false);

      const recipe = game.summoning.recipesByProduct.get(item);
      if (recipe) {
        for (let i = 0; i < MARK_COUNT; i++) {
          game.summoning.discoverMark(recipe);
        }
      }
    });

    const suggestionEntries = mod.api.tinyIcons.collectModificationSuggestions().modifications.tinyIcons.staticTagAllocations;
    // @ts-ignore
    const suggestionsSortedByItemType = suggestionEntries.sort((e) => e.context.category);
    suggestionsSortedByItemType.forEach((entry: { context: { category: string, id: string } }) => {
      if (entry.context.category.includes('Item') && entry.context.category !== 'ItemSynergies') {
        game.bank.addItemByID(entry.context.id, 10, false, false, false);
      }
    });

    // Add items for shop purchases
    game.bank.addItemByID(ItemIDs.Normal_Logs, 5000, false, false, false);
    game.bank.addItemByID(ItemIDs.Oak_Logs, 5000, false, false, false);
    game.bank.addItemByID(ItemIDs.Willow_Logs, 5000, false, false, false);
    game.bank.addItemByID(ItemIDs.Teak_Logs, 5000, false, false, false);
    game.bank.addItemByID(ItemIDs.Maple_Logs, 5000, false, false, false);
    game.bank.addItemByID(ItemIDs.Mahogany_Logs, 5000, false, false, false);
    game.bank.addItemByID(ItemIDs.Yew_Logs, 5000, false, false, false);
    game.bank.addItemByID(ItemIDs.Magic_Logs, 5000, false, false, false);
    game.bank.addItemByID(ItemIDs.Redwood_Logs, 5000, false, false, false);
    game.bank.addItemByID(ItemIDs.Bronze_Bar, 5000, false, false, false);
    game.bank.addItemByID(ItemIDs.Iron_Bar, 5000, false, false, false);
    game.bank.addItemByID(ItemIDs.Steel_Bar, 5000, false, false, false);
    game.bank.addItemByID(ItemIDs.Mithril_Bar, 5000, false, false, false);
    game.bank.addItemByID(ItemIDs.Adamantite_Bar, 5000, false, false, false);
    game.bank.addItemByID(ItemIDs.Runite_Bar, 5000, false, false, false);
  });
}