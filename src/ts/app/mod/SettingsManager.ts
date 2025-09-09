import { TinyIconsModSettings } from "./types/tinyIconsModSettings";
import { CheckboxGroupFixedConfig } from './models/CheckboxGroupFixedConfig'

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
  public init(
    settings: ReturnType<Modding.ModContext['settings']['section']>,
  ) {
    SettingsManager.ctxSettings = settings;

    // Add settings
    settings.add([
      {
        type: 'switch',
        name: 'global-icons',
        label: 'Enable Global Icons',
        hint: 'Show icons outside of Astrology and Agility',
        default: true,
        onChange: () => {
          const hint = document
            .getElementById(`tinyIcons:global-icons`)
            ?.nextElementSibling?.querySelector('small');

          if (hint) {
            hint.textContent = 'Reload Required';
            hint.classList.add('text-warning');
          }
          this.updateButton();
        },
      } as unknown as Modding.Settings.SwitchConfig,
      {
        type: 'switch',
        name: 'secondary-icons',
        label: 'Enable Secondary Icons',
        hint: ' ',
        default: false,
        onChange: () => {
          const hint = document
            .getElementById(`tinyIcons:secondary-icons`)
            ?.nextElementSibling?.querySelector('small');

          if (hint) {
            hint.textContent = 'Reload required';
            hint.classList.add('text-warning');
          }
          this.updateButton();
        },
      } as unknown as Modding.Settings.SwitchConfig,
      {
        type: 'switch',
        name: 'placeholder-icons',
        label: 'Enable Placeholder Icons',
        hint: 'If enabled, then whenever the mod determines an icon should have been placed, but failed to determine which one, a cog icon will be used. This is primarily relevant for dynamically determined icons, which happens when a boost has a set scope. Though it can also happen when a new modifier is added (e.g. through another mod) which this mod does not (yet) know.',
        default: true,
        onChange: () => {
          const hint = document
            .getElementById(`tinyIcons:placeholder-icons`)
            ?.nextElementSibling?.querySelector('small');

          if (hint) {
            hint.textContent = 'Reload required';
            hint.classList.add('text-warning');
          }
          this.updateButton();
        },
      } as unknown as Modding.Settings.SwitchConfig,
      CheckboxGroupFixedConfig.toSimpleObject(new CheckboxGroupFixedConfig<keyof IModifierScope>('scope-icons', 'Enable scope icons', [
        { value: 'skill', label: 'Skill', hint: 'For example, a skill xp buff only affecting Agility. In which case the "Agility skill" icon should be displayed.' },
        { value: 'damageType', label: 'Damage Type', hint: 'For example, a damage buff only affecting "Pure" damage. In which case the "Pure Damage" icon should be displayed.' },
        { value: 'realm', label: 'Realm', hint: 'Only relevant with certain expansions and possibly mods. For example, a damage buff only working in the "Normal" realm. In which case the "Normal Realm" icon should be displayed.' },
        { value: 'currency', label: 'Currency', hint: 'For example, a currency gain buff only affecting GP. In which case the "GP" icon should be displayed.' },
        { value: 'category', label: 'Category', hint: 'What the "Category" is varies on the source that is affected. In Cooking, for example, a buff that only affects the Cooking Fire. In which case the icon of the Cooking Fire should be displayed.' },
        { value: 'action', label: 'Action', hint: 'For example, a buff to gain additional resources, but only when woodcutting the willow tree. In which case, the "Willow tree" icon should be displayed.' },
        { value: 'subcategory', label: 'Subcategory', hint: 'What the "Subcategory" is varies on the source that is affected. In Cooking, for example, this can be a "category/group", such as "All fish". In which case an icon representing "All fish" should be displayed.' },
        { value: 'item', label: 'Item', hint: 'For example, a buff that provides you with an item during any skilling action (of a particular skill). For example, a buff that provides you a "Fire rune" whenever you craft a rune. In which case the icon of the "Fire Rune" item should be displayed.' },
        { value: 'effectGroup', label: 'Combat effect group', hint: 'Combat effects can be singular ones (e.g. "Burn") or categorized into groups (e.g. "Damage-over-time"). For example, a debuff that reduces your damage while affected by any sort of "Damage-over-time". In which case an icon representing "Damage-over-time damage" should be displayed.' },
      ] as (Modding.Settings.CheckboxOption & { value: keyof IModifierScope })[],
        'Scope is the limitation of an initially "generic" buff. For example, for a generic modifier to increase your currency gain, the boost can be set to limit this effect to only GP.',
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

          hint.textContent = 'Reload required';
          hint.classList.add("text-warning");
        })),
      {
        type: 'button',
        name: 'save-reload',
        display: 'Save & Reload',
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
  public setSettingsFromCharacter() {
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

  private updateButton() {
    const btn = document.getElementById('tinyIcons:save-reload');
    if (btn && btn.classList.contains('btn-primary'))
      btn.classList.replace('btn-primary', 'btn-danger');
  }
}