import { PublicApi } from './mod/PublicApi';
import { TagManager } from './mod/managers/TagManager';
import { ModifierScopeSourceMediaMemoizer } from './mod/ModifierScopeSourceMediaMemoizer';
import { PatchManager } from './mod/managers/PatchManager';
import { TranslationManager } from './mod/managers/TranslationManager';
import { SettingsManager } from './mod/managers/SettingsManager';
import { SkillBoostsCompatibility } from './mod/compatibility/SkillBoostsCompatibility';
import { Constants } from './constants';
import { Logger } from './mod/Logger';

export class Main {
  public init(ctx: Modding.ModContext) {
    // Initialize various managers and other stuff
    const t0: number = performance.now();
    TranslationManager.register();
    PatchManager.patch(ctx);
    TagManager.init(ctx);
    ModifierScopeSourceMediaMemoizer.init(ctx);
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