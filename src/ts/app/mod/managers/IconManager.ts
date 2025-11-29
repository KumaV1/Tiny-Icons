import { Logger } from "../Logger";
import { ModifierTagMapEntryAttributes } from "../models/ModifierTagMapEntryAttributes";
import { ModifierScopeSourceMediaMemoizer } from "../ModifierScopeSourceMediaMemoizer";
import { modifierTagMap } from "../tagging/modifierTagMap";
import { NamedObjectWithMedia } from "../types/namedObjectWithMedia";
import { SettingsManager } from "./SettingsManager";
import { TagManager } from "./TagManager";

/**
 * Manages the icons associated with modifiers and provides the relevant HTML string.
 */
export class IconManager {
  /**
   * Converts a asset URL into an HTML img tag string with specified size and formatting.
   *
   * @param {string} sourceURL - The source URL of the image.
   * @param {string} [size='xxs'] - The size classification of the icon.
   * @returns {string} - The HTML representation of the image.
   */
  public static  imgSource = (sourceURL: string, size: string = 'xxs'): string => {
    if (!sourceURL) {
      return '';
    }

    return sourceURL.includes(' fa-') // whitespace is important, so a blob url is not accidentally caught by this
      ? `<i class="fa ${sourceURL} tiny-icon mb-1 mr-1 text-warning font-size-${size}"></i>`
      : `<img class="skill-icon-${size} tiny-icon mb-1 mr-1" src="${sourceURL}">`;
  };

  /**
   * Returns the combined primary and secondary icon's HTML string for a given modifier.
   * If the secondary icon setting is turned off, only the primary icon is returned.
   * @param {ModifierValue} modifierValue - Data on the modifier boost this gives.
   * @param {boolean} positive - Whether the value has a positive impact on the entity the modifier is applied on
   * @param {boolean} secondary - Whether to include the secondary icon.
   * @param {string} [size='xxs'] - Optional icon size.
   * @returns {string} The HTML image tag representation of the icon(s).
   */
  public static getIconHTML(
    modifierValue: ModifierValue,
    positive: boolean,
    secondary?: boolean,
    size?: string,
  ): string {
    // Get additional icons for scopes
    const scopeIcons = this.getIconsForScopes(modifierValue);

    // Get primary or secondary icon via hard-defined tag
    const primaryIcon = this.imgSource(
      this.getIconForModifier(modifierValue, positive),
      size,
    );

    if (!SettingsManager.settings.secondaryIconsEnabled || secondary === false) {
      return scopeIcons
        ? `${primaryIcon}${scopeIcons}`
        : `${primaryIcon}`;
    }

    const secondaryIcon = this.imgSource(
      this.getIconForModifier(modifierValue, positive, true),
      size,
    );

    // Return final
    const staticIcons = secondaryIcon && primaryIcon !== secondaryIcon
      ? primaryIcon + secondaryIcon
      : primaryIcon;
    return scopeIcons
      ? `${staticIcons}${scopeIcons}`
      : `${staticIcons}`;
  }

  /**
   * Determines the appropriate icon for a modifier based on its tags.
   * It can return primary or secondary icon based on the "secondary" argument.
   * @param {ModifierValue} modifierValue - Data on the modifier boost this gives.
   * @param {number} value - The value of the modifier.
   * @param {boolean} positive - Whether the value has a positive impact on the entity the modifier is applied on
   * @param {boolean} secondary - Whether to retrieve the secondary icon.
   * @returns {string} - The icon asset URL associated with the modifier.
   */
  private static getIconForModifier(
    modifierValue: ModifierValue,
    positive: boolean,
    secondary?: boolean,
  ): string {
    // Determine static tag attributes | TODO: Doing this twice (for primary and secondary tag separetely) is imperformant and should be changed
    const modTagAttributes: ModifierTagMapEntryAttributes | undefined = modifierTagMap.get(modifierValue.modifier.id);
    if (!modTagAttributes) {
      Logger.warn(`No tags found for modifier ${modifierValue.modifier.id}`);
      return SettingsManager.settings.placeholderIconEnabled
        ? TagManager.tagSrcs.get('placeholder') ?? ''
        : '';
    }

    // Determine static tag definition
    const tagDefinition = secondary
      ? modTagAttributes.secondaryTag
      : modTagAttributes.primaryTag;
    if (!tagDefinition) {
      // If no tag available, but we tried to get secondary, then just assume no secondary icon exists in the first place
      if (secondary) {
        return '';
      }

      // Otherwise, if a modifier does not have even a primary tag defined, then we need to treat it like it was not intended
      Logger.warn(`No primary tag definition could be determined for modifier ${modifierValue.modifier.id}`);
      return SettingsManager.settings.placeholderIconEnabled
        ? TagManager.tagSrcs.get('placeholder') ?? ''
        : '';
    }

    // If the tag should be ignored when a skill scope is available, and said scope is available, then we do not need to return a value
    if (tagDefinition.ignoreIfSkillScope && modifierValue.skill) {
      Logger.log(`Modifier ${modifierValue.modifier.id} has "ignoreIfSkillScope" set to true and modifierValue.skill is set to ${modifierValue.skill.name}:`)
      return '';
    }

    // Determine tag to use
    const tag = positive
      ? tagDefinition.positive
      : tagDefinition.negative;
    if (!tag) {
      // If no tag available, but we tried to get secondary, then just assume no secondary icon exists in the first place
      if (secondary) {
        return '';
      }

      // Otherwise, if a modifier does not have even a primary tag defined, then we need to treat it like it was not intended
      Logger.warn(`No primary tag could be determined for modifier ${modifierValue.modifier.id} and positive flag ${positive}`);
      return SettingsManager.settings.placeholderIconEnabled
        ? TagManager.tagSrcs.get('placeholder') ?? ''
        : '';
    }

    // With a tag available, try retrieving the media source to use
    return TagManager.tagSrcs.get(tag) ?? /*SettingsManager.settings.placeholderIconEnabled
        ? TagManager.tagSrcs.get('placeholder') ?? ''
        :*/ '';
  }

  /**
   * Determines the appropriate icons for the active scopes
   * @param modValue data on mod value, which among other things includes active scoping (may have none)
   */
  private static getIconsForScopes(modValue: ModifierValue): string {
    let html = '';

    if (modValue.skill && SettingsManager.settings.scopeIcons.skill) {
      html += this.imgSource(this.getIconSrcForSkillScope(modValue.skill));
    }
    if (modValue.damageType && SettingsManager.settings.scopeIcons.damageType) {
      html += this.imgSource(this.getIconSrcForDamageTypeScope(modValue.damageType));
    }
    if (modValue.realm && SettingsManager.settings.scopeIcons.realm) {
      html += this.imgSource(this.getIconSrcForRealmScope(modValue.realm));
    }
    if (modValue.currency && SettingsManager.settings.scopeIcons.currency) {
      html += this.imgSource(this.getIconSrcForCurrencyScope(modValue.currency));
    }
    if (modValue.category && SettingsManager.settings.scopeIcons.category) {
      html += this.imgSource(this.getIconSrcForCategoryScope(modValue, modValue.category) ?? '');
    }
    if (modValue.action && SettingsManager.settings.scopeIcons.action) {
      html += this.imgSource(this.getIconSrcForActionScope(modValue, modValue.action) ?? '');
    }
    if (modValue.subcategory && SettingsManager.settings.scopeIcons.subcategory) {
      html += this.imgSource(this.getIconSrcForSubcagetoryScope(modValue, modValue.subcategory) ?? '');
    }
    if (modValue.item && SettingsManager.settings.scopeIcons.item) {
      html += this.imgSource(this.getIconSrcForItemScope(modValue.item) ?? '');
    }
    if (modValue.effectGroup && SettingsManager.settings.scopeIcons.effectGroup) {
      html += this.imgSource(this.getIconSrcForCombatEffectGroupScope(modValue.effectGroup) ?? '');
    }

    return html;
  }

  /**
   * Get icon source for skill scope
   * @param skill
   * @returns
   */
  private static getIconSrcForSkillScope(skill: AnySkill): string {
    return skill.media;
  }

  /**
   * Get icon source for damageType scope
   * @param damageType
   * @returns
   */
  private static getIconSrcForDamageTypeScope(damageType: DamageType): string {
    return damageType.media;
  }

  /**
   * Get icon source for realm scope
   * @param realm
   * @returns
   */
  private static getIconSrcForRealmScope(realm: Realm): string {
    if (game.realms.size === 1) {
      return ''; // Remove any realm specification, if there is only one to begin with (which can happen without certain mods and expansions)
    }

    return realm.media;
  }

  /**
   * Get icon source for currency scope
   * @param currency
   * @returns
   */
  private static getIconSrcForCurrencyScope(currency: Currency): string {
    return currency.media;
  }

  /**
   * Get icon source for category scope
   * @param modValue
   * @param category
   * @returns
   */
  private static getIconSrcForCategoryScope(modValue: ModifierValue, category: NamedObject | NamedObjectWithMedia): string | undefined {
    /** @ts-ignore - unknown property, as unknown whether scope source has media */
    if (category.media) {
      /** @ts-ignore - unknown property, as unknown whether scope source has media */
      return category.media;
    }

    // Try determine tagging from scope source
    const source: IModifierScopeSource | undefined = this.tryGetModifierScopeSource(modValue);
    if (source) {
      const mediaMap = ModifierScopeSourceMediaMemoizer.categoryMediaMap.get(source.id); // e.g. "Fishing"
      if (mediaMap) {
        const mediaObject = mediaMap.get(category.id); // e.g. "Secret Area"
        if (mediaObject) {
          return mediaObject.media;
        }
      }
    }

    // Fallback
    return SettingsManager.settings.placeholderIconEnabled
      ? TagManager.tagSrcs.get('placeholder') ?? ''
      : undefined;
  }

  /**
   * Get icon source for action scope
   * @param modValue
   * @param action
   * @returns
   */
  private static getIconSrcForActionScope(modValue: ModifierValue, action: NamedObject | NamedObjectWithMedia): string | undefined {
    /** @ts-ignore - unknown property, as unknown whether scope source has media */
    if (action.media) {
      /** @ts-ignore - unknown property, as unknown whether scope source has media */
      return action.media;
    }

    // Try determine tagging from scope source
    const source: IModifierScopeSource | undefined = this.tryGetModifierScopeSource(modValue);
    if (source) {
      const mediaMap = ModifierScopeSourceMediaMemoizer.actionMediaMap.get(source.id);
      if (mediaMap) {
        const mediaObject = mediaMap.get(action.id);
        if (mediaObject) {
          return mediaObject.media;
        }
      }
    }

    // Fallback
    return SettingsManager.settings.placeholderIconEnabled
      ? TagManager.tagSrcs.get('placeholder') ?? ''
      : undefined;
  }

  /**
   * Get icon source for subcategory scope
   * @param modValue
   * @param subcategory
   * @returns
   */
  private static getIconSrcForSubcagetoryScope(modValue: ModifierValue, subcategory: NamedObject | NamedObjectWithMedia): string | undefined {
    /** @ts-ignore - unknown property, as unknown whether scope source has media */
    if (subcategory.media) {
      /** @ts-ignore - unknown property, as unknown whether scope source has media */
      return subcategory.media;
    }

    // Try determine tagging from scope source
    const source: IModifierScopeSource | undefined = this.tryGetModifierScopeSource(modValue);
    if (source) {
      const mediaMap = ModifierScopeSourceMediaMemoizer.subcategoryMediaMap.get(source.id); // e.g. "Fletching"
      if (mediaMap) {
        const mediaObject = mediaMap.get(subcategory.id); // e.g. "Arrows"
        if (mediaObject) {
          return mediaObject.media;
        }
      }
    }

    // Fallback
    return SettingsManager.settings.placeholderIconEnabled
      ? TagManager.tagSrcs.get('placeholder') ?? ''
      : undefined;
  }

  /**
   * Get icon source for item scope
   * @param item
   * @returns
   */
  private static getIconSrcForItemScope(item: Item): string | undefined {
    return item.media;
  }

  /**
   * Get icon source for effectGroup scope
   * @param modValue
   * @param effectGroup
   * @returns
   */
  private static getIconSrcForCombatEffectGroupScope(effectGroup: CombatEffectGroup | CombatEffectGroup & { media: string }): string | undefined {
    /** @ts-ignore - unknown property, as unknown whether scope source has media */
    if (effectGroup.media) {
      /** @ts-ignore - unknown property, as unknown whether scope source has media */
      return effectGroup.media;
    }

    // Try determine tagging from media map
    const mediaObject = ModifierScopeSourceMediaMemoizer.effectGroupMediaMap.get(effectGroup.id); // e.g. "melvorD:StunLike"
    if (mediaObject) {
      return mediaObject.media;
    }

    // Fallback
    return SettingsManager.settings.placeholderIconEnabled
      ? TagManager.tagSrcs.get('placeholder') ?? ''
      : undefined;
  }

  /**
   * Tries to get fitting scoping, from which the source (and thereby icon to use) can be determined
   * DEV NOTE: While skill is used at times as a fallback, that's only if is
   * @param modValue
   * @returns
   */
  private static tryGetModifierScopeSource(modValue: ModifierValue): IModifierScopeSource | undefined {
      const scopeKey: number = Modifier.getScopeKey(modValue);
      const scoping: ModifierScoping | undefined = modValue.modifier.scopeMap.get(scopeKey);
      if (!scoping) {
        return undefined;
      }

      // If scope source exist, just return that one
      if (scoping.scopeSource) {
        return scoping.scopeSource;
      }

      // If no scope source exists, try falling back to skill scope, if available (mirrors behaviour from base game)
      if (scoping.scopes.skill) {
        return modValue.skill;
      }

      // Nothing could be found
      return undefined;
  }
}
