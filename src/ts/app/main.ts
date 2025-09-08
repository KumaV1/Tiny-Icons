import { SettingsManager } from './mod/SettingsManager';
import { ModifierManagerInit } from './mod/ModifierManager';

export class Main {
  public init(ctx: Modding.ModContext) {
    const settingsManager = new SettingsManager();
    settingsManager.init(ctx.settings.section('Tiny Icons'));
    ctx.onCharacterLoaded(function() {
      settingsManager.setSettingsFromCharacter();
    });

    const modifierManager = ModifierManagerInit.create(ctx);
    modifierManager.init();
  }
}
