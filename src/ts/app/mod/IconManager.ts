import { ModifierTagMapEntryAttributes } from './models/ModifierTagMapEntryAttributes';
import {
  PathType,
  StaticModifierIconTag,
  IconTagSources,
  ModifierIconPaths,
} from './ModifierIcons';
import { modifierTagMap } from './ModifierTags';

/**
 * Manages the icons associated with modifiers and provides the relevant HTML string.
 */
export class IconManager {
  constructor(
    private ctx: Modding.ModContext,
    private paths: ModifierIconPaths,
  ) { }

  /**
   * Returns the combined primary and secondary icon's HTML string for a given modifier.
   * If the secondary icon setting is turned off, only the primary icon is returned.
   * @param {ModifierValue} modifierValue - Data on the modifier boost this gives.
   * @param {boolean} positive - Whether the value has a positive impact on the entity the modifier is applied on
   * @param {boolean} secondary - Whether to include the secondary icon.
   * @param {string} [size='xxs'] - Optional icon size.
   * @returns {string} The HTML image tag representation of the icon(s).
   */
  public getIconHTML(
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
    if (!primaryIcon) {
      return '';
    }

    if (!this.secondaryIconsEnabled || secondary === false) {
      return scopeIcons
        ? `[Static: ${primaryIcon}][Scope: ${scopeIcons}]`
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
      ? `[Static: ${staticIcons}][Scope: ${scopeIcons}]`
      : `${staticIcons}`;
  }

  private get secondaryIconsEnabled() {
    return this.ctx.settings.section('Tiny Icons').get('secondary-icons');
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
  private getIconForModifier(
    modifierValue: ModifierValue,
    positive: boolean,
    secondary?: boolean,
  ): string {
    const modTagAttributes: ModifierTagMapEntryAttributes | undefined = modifierTagMap.get(modifierValue.modifier.id);
    if (!modTagAttributes) {
      console.warn(`[Tiny Icons] No tags found for modifier ${modifierValue.modifier.id}`);
      return '';
    }

    const tag = secondary
      ? positive
        ? modTagAttributes.secondaryTag?.positive
        : modTagAttributes.secondaryTag?.negative
      : positive
        ? modTagAttributes.primaryTag.positive
        : modTagAttributes.primaryTag.negative;

    if (!tag) {
      console.warn(`[Tiny Icons] No tag could be determined for modifier ${modifierValue.modifier.id}, positive value ${positive} and secondary value ${secondary}`);
      return '';
    }

    return this.paths.srcForTag[tag];
  }

  /**
   * Determines the appropriate icons for the active scopes
   * @param scope data on active scoping (may have none)
   */
  private getIconsForScopes(scope: IModifierScope): string {
    let html = '';

    if (scope.skill) {
      html += this.imgSource(this.getIconSrcForSkillScope(scope.skill));
    }
    if (scope.damageType) {
      html += this.imgSource(this.getIconSrcForDamageTypeScope(scope.damageType));
    }
    if (scope.realm) {
      html += this.imgSource(this.getIconSrcForRealmScope(scope.realm));
    }
    if (scope.currency) {
      html += this.imgSource(this.getIconSrcForCurrencyScope(scope.currency));
    }
    if (scope.category) {
      html += this.imgSource(this.getIconSrcForCategoryScope(scope.category) ?? '');
    }
    if (scope.action) {
      html += this.imgSource(this.getIconSrcForActionScope(scope.action) ?? '');
    }
    if (scope.subcategory) {
      html += this.imgSource(this.getIconSrcForSubcagetoryScope(scope.subcategory) ?? '');
    }
    if (scope.item) {
      html += this.imgSource(this.getIconSrcForItemScope(scope.item) ?? '');
    }
    if (scope.effectGroup) {
      html += this.imgSource(this.getIconSrcForCombatEffectGroupScope(scope.effectGroup));
    }

    return html;
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
    return sourceURL.includes('fa-')
      ? `<i class="fa ${sourceURL} tiny-icon mb-1 mr-1 text-warning font-size-${size}"></i>`
      : `<img class="skill-icon-${size} tiny-icon mb-1 mr-1" src="${sourceURL}">`;
  };

  /**
   * SweetAlert popup with all game tags and their icons
   */
  private viewAvailableTagsWithImages() {
    let html = '';
    for (const [key, value] of Object.entries(this.paths.availableTagSources)) {
      html += `<h5 class="font-w400 font-size-sm mb-1">${key}: ${this.imgSource(value)}</h5>`;
    }

    SwalLocale.fire({ html });
  }

  /**
   * SweetAlert popup with all game modifiers.
   */
  private viewAllPassivesOnClick() {
    // Explicitly using cooking for scope objects, as that skill makes use of all scope sources
    // Of course, some modifiers do not actually make sense with such scopes (e.g. combat identifiers), but that's not the point of these test entries after all
    const scopeExampleObjects: Required<IModifierScope> = {
      skill: game.cooking,
      damageType: game.damageTypes.getObjectByID('melvorD:Normal')!,
      realm: game.realms.getObjectByID('melvorD:Melvor')!,
      currency: game.raidCoins, // visually more distinguishable than gp
      category: game.cooking.categories.getObjectByID('melvorD:Fire')!,
      action: game.cooking.actions.getObjectByID('melvorD:Shrimp')!,
      subcategory: game.cooking.subcategories.getObjectByID('melvorD:Fish')!,
      item: game.items.getObjectByID('melvorD:Basic_Soup')!,
      effectGroup: game.combatEffectGroups.getObjectByID('melvorD:Stun')! // Fallback to generic icon, but give known groups a specific tag?
    };

    let html = `<h5 class="font-w600 font-size-sm mb-1 text-combat-smoke">All Game Modifiers</h5><h5 class="font-w600 font-size-sm mb-3 text-warning"><small>(Visual Only)</small></h5>`;

    html += '<p class="font-w600">MOD REFACTOR IN PROGRESS</p>';

    const totalModifierCount = game.modifierRegistry.registeredObjects.size;
    let currentModifierIndex = 0;

    for (const mod of game.modifierRegistry.registeredObjects) {
      currentModifierIndex++;
      const modifier = mod[1];

      html += `<hr><div><h5 class="font-w400 font-size-sm mb-1 text-primary">${modifier.id} (${currentModifierIndex} / ${totalModifierCount})</h5></div>`;

      const scopeTotalCount = modifier.allowedScopes.length;
      let currentScopeIndex = 0;
      modifier.allowedScopes.forEach((scope) => {
        // Go through each 'scope' key, adding the object, if the property is set to true, building a scope object accordingly
        const scopeObj: IModifierScope = {};

        if (scope.scopes.skill) {
          scopeObj.skill = scopeExampleObjects.skill;
        }
        if (scope.scopes.damageType) {
          scopeObj.damageType = scopeExampleObjects.damageType;
        }
        if (scope.scopes.realm) {
          scopeObj.realm = scopeExampleObjects.realm;
        }
        if (scope.scopes.currency) {
          scopeObj.currency = scopeExampleObjects.currency;
        }
        if (scope.scopes.category) {
          scopeObj.category = scopeExampleObjects.category;
        }
        if (scope.scopes.action) {
          scopeObj.action = scopeExampleObjects.action;
        }
        if (scope.scopes.subcategory) {
          scopeObj.subcategory = scopeExampleObjects.subcategory;
        }
        if (scope.scopes.item) {
          scopeObj.item = scopeExampleObjects.item;
        }
        if (scope.scopes.effectGroup) {
          scopeObj.effectGroup = scopeExampleObjects.effectGroup;
        }

        const hasScope = Object.getOwnPropertyNames(scopeObj).length > 0;

        // Initialize Modifier value with given scope object
        // Rather than "allow" positive and negative, checking the description and whether there are ones unfiltered or only for "above" or "below" (0) seems more robust
        if (modifier.allowPositive) {
          const modVal = new ModifierValue(mod[1], 1, scopeObj);
          const description: StatDescription = modVal.print();
          const scopeInfo = hasScope
            ? ` <span class="font-italic">[Scope: ${this.getScopeInfoSuffixForOverview(scopeObj)}]</span>`
            : '';
          html += `<h5 class="font-w400 font-size-sm mb-1 ${getStandardDescTextClass(description, false)}">${description.text}${scopeInfo}</h5>`;
        }

        if (modifier.allowNegative) {
          const modVal = new ModifierValue(mod[1], -1, scopeObj);
          const description: StatDescription = modVal.print();
          const scopeInfo = hasScope
            ? ` <span class="font-italic">[Scope: ${this.getScopeInfoSuffixForOverview(scopeObj)}]</span>`
            : '';
          html += `<h5 class="font-w400 font-size-sm mb-1 ${getStandardDescTextClass(description, false)}">${description.text}${scopeInfo}</h5>`;
        }

        // Add a small separator between scopes
        if (currentScopeIndex + 1 < scopeTotalCount) {
          html += '<hr class="w-25">'
        }

        currentScopeIndex++;
      });
    }

    SwalLocale.fire({ html: html });
  }

  /**
   * TEMP: Provide text to append to modifier overview, to signify scopes
   * @param scope
   * @returns
   */
  private getScopeInfoSuffixForOverview(scope: IModifierScope) {
    let scopeNames: string[] = [];
    Object.keys(scope).forEach((value) => {
      scopeNames.push(value);
    });

    return scopeNames.join(', ');
  }

  /* DEV NOTE:

  Regarding getting src for some of the scopes, aside from a "scope" source, the "skill" may also be a valid scope source

  const hasScopeSource = this.scopeSource !== undefined || this.scopes.skill;
  if (this.scopes.category && !hasScopeSource)
    throw new Error('The category scope requires the skill scope, or a scope source.');
  if (this.scopes.action && !hasScopeSource)
    throw new Error(`The action scope requires the skill scope, or a scope source.`);
  if (this.scopes.subcategory && !hasScopeSource)
    throw new Error('The subcategory scope requires the skill scope, or a scope source.');

  That being said, "ModifierScope" seems to generally overwrite its "scopeSource", if a skill scope is set (also meaning one can reliably check "scopeSource")

  */

  /**
   * Get icon source for skill scope
   * @param skill
   * @returns
   */
  private getIconSrcForSkillScope(skill: AnySkill): string {
    return skill.media;//skill.getMediaURL(skill._media);
  }

  /**
   * Get icon source for damageType scope
   * @param damageType
   * @returns
   */
  private getIconSrcForDamageTypeScope(damageType: DamageType): string {
    return damageType.media;//damageType.getMediaURL(damageType._media);
  }

  /**
   * Get icon source for realm scope
   * @param realm
   * @returns
   */
  private getIconSrcForRealmScope(realm: Realm): string {
    return realm.media;//realm.getMediaURL(realm._media);
  }

  /**
   * Get icon source for currency scope
   * @param currency
   * @returns
   */
  private getIconSrcForCurrencyScope(currency: Currency): string {
    return currency.media;//currency.getMediaURL(currency._media);
  }

  /**
   * Get icon source for category scope
   * @param category
   * @returns
   */
  private getIconSrcForCategoryScope(category: NamedObject | NamedObject & { media: string }): string | undefined {
    console.log(category);
    /** @ts-ignore - unknown property, as unknown whether scope source has media */
    if (category.media) {
      /** @ts-ignore - unknown property, as unknown whether scope source has media */
      return category.media;//category.getMediaURL(category._media);
    }

    return this.paths.srcForTag['placeholder'];
  }

  /**
   * Get icon source for action scope
   * @param action
   * @returns
   */
  private getIconSrcForActionScope(action: NamedObject | NamedObject & { media: string }): string | undefined {
    console.log(action);
    /** @ts-ignore - unknown property, as unknown whether scope source has media */
    if (action.media) {
      /** @ts-ignore - unknown property, as unknown whether scope source has media */
      return action.media//action.getMediaURL(action._media);
    }

    return this.paths.srcForTag['placeholder'];
  }

  /**
   * Get icon source for subcategory scope
   * @param subcategory
   * @returns
   */
  private getIconSrcForSubcagetoryScope(subcategory: NamedObject | NamedObject & { media: string }): string | undefined {
    console.log(subcategory);
    /** @ts-ignore - unknown property, as unknown whether scope source has media */
    if (subcategory.media) {
      /** @ts-ignore - unknown property, as unknown whether scope source has media */
      return subcategory.media;//subcategory.getMediaURL(subcategory._media);
    }

    return this.paths.srcForTag['placeholder'];
  }

  /**
   * Get icon source for item scope
   * @param item
   * @returns
   */
  private getIconSrcForItemScope(item: Item): string | undefined {
    return item.media;//item.getMediaURL(item._media);
  }

  /**
   * Get icon source for effectGroup scope
   * @param effectGroup
   * @returns
   */
  private getIconSrcForCombatEffectGroupScope(effectGroup: CombatEffectGroup | CombatEffectGroup & { media: string }): string {
    console.log(effectGroup);
    /** @ts-ignore - unknown property, as unknown whether scope source has media */
    if (effectGroup.media) {
      /** @ts-ignore - unknown property, as unknown whether scope source has media */
      return effectGroup.media;//effectGroup.getMediaURL(effectGroup.media);
    }

    return this.paths.srcForTag['placeholder'];
  }

  public exposeAPI() {
    this.ctx.api({
      /**
       * Adds an object of custom tags and their sources to the list of icons available to Tiny Icons.
       * @param customTags An object of custom string tags and their string sources.
       */
      addTagSources: (customTags: { [key: string]: string }) => {
        for (const tag in customTags) {
          if (this.paths.srcForTag[tag]) {
            console.warn(`[Tiny Icons] Tag "${tag}" already exists.`);
            continue;
          }

          this.paths.srcForTag[tag] = customTags[tag];
        }
      },

      /**
       * Adds an object of custom modifiers and their tags to the list of modifiers recognized by Tiny Icons.
       * @param customModifiers An object of custom modifiers and their tags.
       */
      addCustomModifiers: (customModifiers: {
        modifier: string;
        tag: [string, string?];
      }) => {
        console.warn('MOD REFACTOR IN PROGRESS. ADDING MODIFIERS IS CURRENTLY DISABLED!');
        //for (const mod of Object.keys(customModifiers)) {
        //  if (modifierTags[mod]) {
        //    console.warn(
        //      `[Tiny Icons] Modifier ${mod} already exists. Skipping.`,
        //    );
        //    continue;
        //  }
        //
        //  modifierTags[mod] = customModifiers[mod];
        //}
      },

      /**
       * Returns the STATIC icon tags defined for a given modifier.
       * The first tag is the primary icon and the second tag is the secondary icon if any.
       * @param {string} modifier The name of the modifier.
       * @returns {string[]} The icon tags defined for the modifier in array of up to 2 string elements.
       */
      getIconTagsForModifier: (modifier: string): StaticModifierIconTag[] => {
        console.warn('[Tiny Icons] getIconTagsForModifier has been deprecated, due to new structure. Use getIconTagMapForModifier instead')
        return [];
      },

      /**
       * Returns tag attributes object for given modifier, if one is set up for that modifier
       * @param modifier The name of the modifier.
       * @returns {ModifierTagMapEntryAttributes | undefined} An object of modifier tag attributes
       */
      getIconTagMapForModifier: (modifier: string): ModifierTagMapEntryAttributes | undefined => {
        return modifierTagMap.get(modifier);
      },

      /**
       * Returns the HTML for the icon associated with the given modifier and value.
       * @param {ModifierValue} modifierValue - Data on the modifier boost this gives.
       * @param {boolean} positive - Whether the value has a positive impact on the entity the modifier is applied on
       * @param {boolean} [secondary] Whether to get the secondary icon HTML.
       * @param {string} [size='xxs'] Optional icon size - 'xxs', 'xs', 'sm', 'md'
       * @returns {string} The HTML for the icon.
       */
      getIconHTMLForModifier: (
        modifierValue: ModifierValue,
        positive: boolean,
        secondary: boolean,
        size?: string,
      ): string => this.getIconHTML(modifierValue, positive, secondary, size),

      /**
       * Gets a melvor icon's asset path based on the given parameters.
       * Builds a string starting from `assets/media/`
       * @param {string} type "skills" | "skill" | "bank" | "main" | "status" | "misc" | "ti" | "mods" | "pets" | "shop" | "fa"
       * @param {string} name The file name of the icon.
       * @param {string | undefined} [specific] - Specific file name if name is a subtype.
       * @param {string} [ext='svg']  - The file extension.
       *
       * @example
       *  - getIconResourcePath("skills", "mining") // returns "assets/media/skills/mining/mining.svg"
       *  - getIconResourcePath("skills", "mining", "rock_iron") // returns "assets/media/skills/mining/rock_iron.svg"
       */
      getIconResourcePath: (
        type: PathType,
        name: string,
        specific?: string | undefined,
        ext?: string,
      ): string => this.paths.iconPath(type, name, specific, ext),

      /**
       * An array of all available icon tags with an associated icon.
       * @returns {string[]} The list of available icon tags.
       */
      getAvailableTags: (): string[] => this.paths.availableTags,

      /**
       * @returns {TagIconSources} An object of all available tags and their sources.
       */
      getAvailableTagsWithSources: (): IconTagSources =>
        this.paths.availableTagSources,

      /**
       * SweetAlert popup with all game tags and their icons
       */
      viewAvailableTagsWithImages: (): void => this.viewAvailableTagsWithImages(),

      /**
       * SweetAlert popup with all game modifiers and their tagged icons.
       */
      viewAllModifiers: (): void => this.viewAllPassivesOnClick(),
    });
  }
}
