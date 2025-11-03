import { PublicApi } from './mod/PublicApi';
import { TagManager } from './mod/managers/TagManager';
import { ModifierScopeSourceMediaMemoizer } from './mod/ModifierScopeSourceMediaMemoizer';
import { PatchManager } from './mod/managers/PatchManager';
import { TranslationManager } from './mod/managers/TranslationManager';
import { SettingsManager } from './mod/managers/SettingsManager';
import { SkillBostsCompatibility } from './mod/compatibility/SkillBoostsCompatibility';

export class Main {
  public init(ctx: Modding.ModContext) {
    // Initialize various managers and other stuff
    TranslationManager.register();
    PatchManager.patch(ctx);
    TagManager.init(ctx);
    ModifierScopeSourceMediaMemoizer.init(ctx);
    SettingsManager.init(ctx.settings.section('Tiny Icons'));
    PublicApi.init(ctx);

    // Initialize mod compatibilities
    const sbComp = new SkillBostsCompatibility();
    sbComp.init(ctx);

    // Hook-in settings and some recomputations
    ctx.onCharacterLoaded(function() {
      SettingsManager.setSettingsFromCharacter();

      enforceRecomputations(ctx);
    });
  }
}

/**
 * Upon entering the character, thereby the mod settings becoming active (differing from their default values),
 * there will be various locations that need to be enforced to re-compute their descriptions in order to reflect the settings
 * @param ctx
 */
function enforceRecomputations(ctx: Modding.ModContext) {
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
}