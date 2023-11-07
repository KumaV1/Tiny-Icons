import { ModifierIconPaths } from './ModifierIcons';
import { modifierTags } from './ModifierTags';

/**
 * Manages the icons associated with modifiers and provides the relevant HTML string.
 */
export class IconManager {
  constructor(
    private ctx: Modding.ModContext,
    private paths: ModifierIconPaths
  ) {}

  /**
   * Returns the combined primary and secondary icon's HTML string for a given modifier.
   * If the secondary icon setting is turned off, only the primary icon is returned.
   * @param {string} modifier - The name of the modifier.
   * @param {SkillModifier | number} value - The value associated with the modifier.
   * @param {boolean} [secondary] - Whether to include the secondary icon.
   * @param {string} [size='xxs'] - Optional icon size.
   * @returns {string} The HTML image tag representation of the icon(s).
   */
  public getIconHTML(
    modifier: string,
    value: SkillModifier | number,
    secondary?: boolean,
    size?: string
  ): string {
    const primaryIcon = this.imgSource(
      this.getIconForModifier(modifier, value),
      size
    );
    if (!primaryIcon) return '';

    if (!this.secondaryIconsEnabled || secondary === false) return primaryIcon;
    const secondaryIcon = this.imgSource(
      this.getIconForModifier(modifier, value, true),
      size
    );

    return secondaryIcon && primaryIcon !== secondaryIcon
      ? `${primaryIcon + secondaryIcon}`
      : primaryIcon;
  }

  private get secondaryIconsEnabled() {
    return this.ctx.settings.section('Tiny Icons').get('secondary-icons');
  }

  /**
   * Determines the appropriate icon for a modifier based on its tags.
   * It can return primary or secondary icon based on the "secondary" argument.
   * @param {string} modKey - The key associated with the modifier.
   * @param {SkillModifier | number} value - The value of the modifier.
   * @param {boolean} [secondary] - Whether to retrieve the secondary icon.
   * @returns {string} - The icon asset URL associated with the modifier.
   */
  private getIconForModifier(
    modKey: string,
    value: SkillModifier | number,
    secondary?: boolean
  ): string {
    const modTags: string[] = modifierTags[modKey];
    if (!modTags) {
      console.warn(`[Tiny Icons] No tags found for modifier ${modKey}`);
      return '';
    }

    if (typeof value === 'object' && modTags.includes('skill')) {
      const skillName = value.skill?.localID.toLowerCase();
      return !secondary
        ? this.paths.srcForTag[skillName] ?? ''
        : this.paths.srcForTag[modTags[1]] ?? '';
    }

    return this.paths.srcForTag[modTags[secondary ? 1 : 0]] ?? '';
  }

  /**
   * Converts a asset URL into an HTML img tag string with specified size and formatting.
   *
   * @param {string} sourceURL - The source URL of the image.
   * @param {string} [size='xxs'] - The size classification of the icon.
   * @returns {string} - The HTML representation of the image.
   */
  private imgSource = (sourceURL: string, size: string = 'xxs'): string => {
    if (!sourceURL) return '';
    return sourceURL.includes('fa-hammer')
      ? `<i class="fa ${sourceURL} tiny-icon mb-1 mr-1 text-warning font-size-${size}"></i>`
      : `<img class="skill-icon-${size} tiny-icon mb-1 mr-1" src="${sourceURL}">`;
  };

  /**
   * SweetAlert popup with all game modifiers.
   */
  private viewAllPassivesOnClick() {
    let passives = `<h5 class="font-w600 font-size-sm mb-1 text-combat-smoke">All Game Modifiers</h5><h5 class="font-w600 font-size-sm mb-3 text-warning"><small>(Visual Only)</small></h5>`;
    const descriptions: any[] = [];
    const mods = Array.from(Object.keys(modifierData));
    for (const mod of mods)
      modifierData[mod].isSkill
        ? descriptions.push(
            printPlayerModifier(mod as any, { skill: game.agility, value: 0 })
          )
        : descriptions.push(printPlayerModifier(mod as any, 0));

    passives += descriptions
      .map(
        ([text, textClass]) =>
          `<h5 class="font-w400 font-size-sm mb-1 ${textClass}">${text}</h5>`
      )
      .join('');

    SwalLocale.fire({ html: passives });
  }

  public exposeAPI() {
    this.ctx.api({
      /**
       * Returns the icon tags defined for a given modifier.
       * The first tag is the primary icon and the second tag is the secondary icon if any.
       * @param {string} modifier The name of the modifier.
       * @returns {string[]} The icon tags defined for the modifier in array of up to 2 string elements.
       */
      getIconTagsForModifier: (modifier: string): string[] =>
        modifierTags[modifier],

      /**
       * Returns the HTML for the icon associated with the given modifier and value.
       * @param {string} modifier The name of the modifier.
       * @param {SkillModifier | number} value The value of the modifier.
       * @param {boolean} [secondary] Whether to get the secondary icon HTML.
       * @param {string} [size='xxs'] Optional icon size - 'xxs', 'xs', 'sm', 'md'
       * @returns {string} The HTML for the icon.
       */
      getIconHTMLForModifier: (
        modifier: string,
        value: SkillModifier | number,
        secondary: boolean,
        size?: string
      ): string => this.getIconHTML(modifier, value, secondary, size),

      /**
       * An array of all available icon tags with an associated icon.
       * @returns {string[]} The list of available icon tags.
       */
      getAvailableTags: (): string[] => this.paths.availableTags,

      /**
       * SweetAlert popup with all game modifiers and their tagged icons.
       */
      viewAllModifiers: (): void => this.viewAllPassivesOnClick(),
    });
  }
}
