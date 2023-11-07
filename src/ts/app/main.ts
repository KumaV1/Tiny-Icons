import { SettingsManager } from './mod/SettingsManager';
import { ModifierManagerInit } from './mod/ModifierManager';

export class Main {
  public init(ctx: Modding.ModContext) {
    const settingsManager = new SettingsManager();
    settingsManager.loadSettings(ctx.settings.section('Tiny Icons'));

    const modifierManager = ModifierManagerInit.create(ctx);
    modifierManager.init();
  }
}
