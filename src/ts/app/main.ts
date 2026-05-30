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

// TODO: Add setting context to Map<category, identifier> (e.g. <EquipmentItem, melvorD:Bronze_Boots>), which can override trying to get icons via modifiers
// ^ Actually, a set of two-property objects. As multiple entries can have the same "category", obviously
// ^ Needs to allow custom keys (e.g. "Construction Furniture")
// ^ Needs documentation for easier usage. E.g. a "compatibility" class for the context wrapper (maybe file in rep, rather than on mod io? or both?)

// TODO: Add icon setting to combat effects. MUST BE TOGGABLE and DEFAULT TO OFF, due to english already adding icons
// ^ Should preferably be able to inherit icons from "combatEffectTemplates", though would have to worry about too many icons, maybe.
// ^ Probably allow final combat effect object to not "add to icons from templates", but rather overwrite them

// TODO: REMEMBER TO SWITCH GIT CONTEXT TO "KumaV1", NOT STAY AS ANONONON!

// TODO: Some objects may be StatObjects. But that does not go for all, so context would be lost if one tried to just set some property on a Stat or Stat-holder object, right?

// TODO: Cases where a description is built using StatObject, we will still need to patch around the context for the stat object, aka the conditional modifier descriptions. So we cannot get around lots of small patches, I guess
// ^ That being said, we need to diffrentiate between a patch applying description modifications directly (e.g. items to prepend to equip custom description), but also the cases where we ONLY patch in entity context around!

// TODO: What if there is a case like "An HTML element has a method to render a list of stat object descriptions (e.g. active prayers)"... Then we would actually not have a context for each entry... ohoh

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
    ctx.onCharacterLoaded(function() {
      SettingsManager.setSettingsFromCharacter();

      enforceRecomputations();
    });
    const t1: number = performance.now();

    if (Constants.DEV_MODE) {
      Logger.log(`Loading hook-unrelated things took ${Math.floor(t1 - t0)}ms`);
    }
  }
}

/**
 * Upon entering the character, thereby the mod settings becoming active (differing from their default values),
 * there will be various locations that need to be enforced to re-compute their descriptions in order to reflect the settings
 * @param ctx
 */
function enforceRecomputations() {
  const t0: number = performance.now();
  game.items.forEach((item) => {
    item._modifiedDescription = undefined;
  });
  game.specialAttacks.forEach((specialAttack) => {
    specialAttack._modifiedDescription = undefined;
  });
  game.combatPassives.forEach((combatPassive) => {
    combatPassive._modifiedDescription = undefined;
  });
  game.prayer.renderQueue.prayerMenu = true;
  const t1: number = performance.now();

  if (Constants.DEV_MODE) {
    Logger.log(`Enforcing (NOT running) re-computation took ${Math.floor(t1 - t0)}ms`);
  }
}