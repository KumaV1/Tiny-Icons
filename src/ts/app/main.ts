import { SettingsManager } from './mod/SettingsManager';
import { ModifierManagerInit } from './mod/ModifierManager';

export class Main {
  public init(ctx: Modding.ModContext) {
    const settingsManager = new SettingsManager();
    settingsManager.init(ctx.settings.section('Tiny Icons'));
    ctx.onCharacterLoaded(function() {
      settingsManager.setSettingsFromCharacter();

      enforceRecomputations(ctx);
    });

    const modifierManager = ModifierManagerInit.create(ctx);
    modifierManager.init();
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