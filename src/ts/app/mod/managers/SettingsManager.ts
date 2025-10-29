import { TinyIconsModSettings } from "./types/tinyIconsModSettings";
import { CheckboxGroupFixedConfig } from './models/CheckboxGroupFixedConfig'
import { Constants } from "../constants";

export class SettingsManager {
  private static ctxSettings: ReturnType<Modding.ModContext['settings']['section']>;

  /**
   * A static object representing the mod settings.
   * Depending on when this is called, it may still be in a default state, rather than the actual settings (only available after loading a character)
   */
  static settings: TinyIconsModSettings = {
    globalIconsEnabled: false,
    secondaryIconsEnabled: false,
    placeholderIconEnabled: false,
    scopeIcons: {}
  };

  /**
   * Inializes the possible settings
   * @param settings
   */
  public static init(
    settings: ReturnType<Modding.ModContext['settings']['section']>,
  ) {
    SettingsManager.ctxSettings = settings;

    // Add settings
    settings.add([
      {
        type: 'switch',
        name: 'global-icons',
        label: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.GLOBAL_ICONS.LABEL),
        hint: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.GLOBAL_ICONS.HINT),
        default: true,
        onChange: () => {
          const hint = document
            .getElementById(`tinyIcons:global-icons`)
            ?.nextElementSibling?.querySelector('small');

          if (hint) {
            hint.textContent = getLangString(Constants.TRANSLATION_KEYS.SETTINGS.RELOAD_REQUIRED);
            hint.classList.add('text-warning');
          }
          this.updateButton();
        },
      } as unknown as Modding.Settings.SwitchConfig,
      {
        type: 'switch',
        name: 'secondary-icons',
        label: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SECONDARY_ICONS.LABEL),
        hint: ' ',
        default: false,
        onChange: () => {
          const hint = document
            .getElementById(`tinyIcons:secondary-icons`)
            ?.nextElementSibling?.querySelector('small');

          if (hint) {
            hint.textContent = getLangString(Constants.TRANSLATION_KEYS.SETTINGS.RELOAD_REQUIRED);
            hint.classList.add('text-warning');
          }
          this.updateButton();
        },
      } as unknown as Modding.Settings.SwitchConfig,
      {
        type: 'switch',
        name: 'placeholder-icons',
        label: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.PLACEHOLDER_ICONS.LABEL),
        hint: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.PLACEHOLDER_ICONS.HINT),
        default: true,
        onChange: () => {
          const hint = document
            .getElementById(`tinyIcons:placeholder-icons`)
            ?.nextElementSibling?.querySelector('small');

          if (hint) {
            hint.textContent = getLangString(Constants.TRANSLATION_KEYS.SETTINGS.RELOAD_REQUIRED);
            hint.classList.add('text-warning');
          }
          this.updateButton();
        },
      } as unknown as Modding.Settings.SwitchConfig,
      CheckboxGroupFixedConfig.toSimpleObject(new CheckboxGroupFixedConfig<keyof IModifierScope>('scope-icons', getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SCOPE_ICONS.LABEL), [
        { value: 'skill', label: getLangString(Constants.TRANSLATION_KEYS.MODIFIER_SCOPES.SKILL), hint: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SCOPE_ICONS.OPTIONS.SKILL_HINT) },
        { value: 'damageType', label: getLangString(Constants.TRANSLATION_KEYS.MODIFIER_SCOPES.DAMAGE_TYPE), hint: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SCOPE_ICONS.OPTIONS.DAMAGE_TYPE_HINT) },
        { value: 'realm', label: getLangString(Constants.TRANSLATION_KEYS.MODIFIER_SCOPES.REALM), hint: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SCOPE_ICONS.OPTIONS.REALM_HINT) },
        { value: 'currency', label: getLangString(Constants.TRANSLATION_KEYS.MODIFIER_SCOPES.CURRENCY), hint: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SCOPE_ICONS.OPTIONS.CURRENCY_HINT) },
        { value: 'category', label: getLangString(Constants.TRANSLATION_KEYS.MODIFIER_SCOPES.CATEGORY), hint: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SCOPE_ICONS.OPTIONS.CATEGORY_HINT) },
        { value: 'action', label: getLangString(Constants.TRANSLATION_KEYS.MODIFIER_SCOPES.ACTION), hint: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SCOPE_ICONS.OPTIONS.ACTION_HINT) },
        { value: 'subcategory', label: getLangString(Constants.TRANSLATION_KEYS.MODIFIER_SCOPES.SUBCATEGORY), hint: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SCOPE_ICONS.OPTIONS.SUBCATEGORY_HINT) },
        { value: 'item', label: getLangString(Constants.TRANSLATION_KEYS.MODIFIER_SCOPES.ITEM), hint: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SCOPE_ICONS.OPTIONS.ITEM_HINT) },
        { value: 'effectGroup', label: getLangString(Constants.TRANSLATION_KEYS.MODIFIER_SCOPES.EFFECT_GROUP), hint: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SCOPE_ICONS.OPTIONS.EFFECT_GROUP_HINT) },
      ] as (Modding.Settings.CheckboxOption & { value: keyof IModifierScope })[],
        getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SCOPE_ICONS.HINT),
        ['skill', 'currency', 'category', 'action', 'subcategory', 'item', 'effectGroup'],
        () => {
          this.updateButton();

          const label = <HTMLElement>document.querySelector('label[for="tinyIcons:scope-icons"]');
          if (!label) {
              return;
          }

          let hint = label?.querySelector(`small`);
          if (!hint) {
              createElement('span', { classList: ['ms__force-wrap'], parent: label })
              hint = createElement('small', { classList: ['d-block'], parent: label });
          }

          hint.textContent = getLangString(Constants.TRANSLATION_KEYS.SETTINGS.RELOAD_REQUIRED)
          hint.classList.add("text-warning");
        })),
      {
        type: 'button',
        name: 'save-reload',
        display: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SAVE_AND_RELOAD),
        color: 'primary',
        onClick: () => {
          saveData();
          window.location.reload();
        },
      } as unknown as Modding.Settings.ButtonConfig,
    ]);
  }

  /**
   * Loads the specific character's settings into the static variable
   */
  public static setSettingsFromCharacter() {
    SettingsManager.settings = {
      globalIconsEnabled: SettingsManager.ctxSettings.get('global-icons') as boolean,
      secondaryIconsEnabled: SettingsManager.ctxSettings.get('secondary-icons') as boolean,
      placeholderIconEnabled: SettingsManager.ctxSettings.get('placeholder-icons') as boolean,
      scopeIcons: (SettingsManager.ctxSettings.get('scope-icons') as (keyof IModifierScope)[]).reduce((accumulator: TrueFlags<IModifierScope>, currentValue: keyof IModifierScope) => {
        accumulator[currentValue] = true;
        return accumulator;
      }, {} as TrueFlags<IModifierScope>)
    };
  }

  private static updateButton() {
    const btn = document.getElementById('tinyIcons:save-reload');
    if (btn && btn.classList.contains('btn-primary'))
      btn.classList.replace('btn-primary', 'btn-danger');
  }
}