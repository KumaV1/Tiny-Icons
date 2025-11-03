import { IconManager } from "./managers/IconManager";
import { SettingsManager } from "./managers/SettingsManager";
import { TagManager } from "./managers/TagManager";
import { ModifierTagMapEntryAttributes } from './models/ModifierTagMapEntryAttributes';
import { ModifierIconContext } from "./ModifierIconContext";
import { ModifierScopeSourceMediaMemoizer } from './ModifierScopeSourceMediaMemoizer';
import { modifierTagMap } from './tagging/modifierTagMap';
import { ModModifierIconTag } from './types/modModifierIconTag';
import { NamedObjectWithMedia } from './types/namedObjectWithMedia';
import { PathType } from "./types/pathType";
import { StaticModifierIconTag } from "./types/staticModifierIconTag";
import { TinyIconsModSettings } from "./types/tinyIconsModSettings";

export class PublicApi {
    public static init(ctx: Modding.ModContext): void {
        ctx.api({
            /**
             * Wrapper object around functions that deal with "applyDescriptionModifications"
             */
            applyDescriptionModificationsSupport: {
              applyTinyIconsPlaceholderReplacement: (description: string): string => ModifierIconContext.applyTinyIconsPlaceholderReplacement(description),
              setIsDescriptionModificationContext: (): void => ModifierIconContext.setIsDescriptionModificationContext(),
              resetDescriptionModificationContext: (): void => ModifierIconContext.resetDescriptionModificationContext(),
            },

            /**
             * Get currently active mod settings
             * @returns Mod settings
             */
            settings: (): TinyIconsModSettings => {
                return SettingsManager.settings;
            },

            /**
             * Add tags you can use for static tags on modifiers
             * @param tags - Map of tags to add (key is tag, value the media to use for the tag). Already existing tags will be skipped.
             */
            addTagSourceMap: (tags: Map<ModModifierIconTag, string>): void => {
              tags.forEach((value: string, key: ModModifierIconTag) => {
                if (TagManager.tagSrcs.has(key)) {
                  console.warn(`[Tiny Icons] Tag '${key}' already exists.`);
                } else {
                  TagManager.tagSrcs.set(key, value);
                }
              });
            },

            /**
             * Add static tags to modifiers
             * @param modifierId - Full id of the modifier
             * @param primaryTag - Define primary tag(s), either as simple string or as object, depending on whether positive and negative values should use different icons
             * @param secondaryTag - Optionally also provide a secondary tag
             */
            addModifier: (modifierId: string, primaryTag: StaticModifierIconTag | ModModifierIconTag | { positive: StaticModifierIconTag | ModModifierIconTag, negative: StaticModifierIconTag | ModModifierIconTag }, secondaryTag?: StaticModifierIconTag | ModModifierIconTag | { positive: StaticModifierIconTag | ModModifierIconTag, negative: StaticModifierIconTag | ModModifierIconTag }): void => {
                if (!modifierId) {
                  console.warn('[Tiny Icons] No/Falsey modifier id provided');
                  return;
                }

                const modifier = game.modifierRegistry.getObjectByID(modifierId);
                if (!modifier) {
                  console.warn(`[Tiny Icons] Could not find modifier with id ${modifierId} in game.modifierRegistry.`);
                  return;
                }

                modifierTagMap.set(modifierId, new ModifierTagMapEntryAttributes(primaryTag, secondaryTag));
            },

            /**
             * Add media sources for category scopes that do not come with their own media inherintly
             * @param scopeSourceId Id of the scope source (for example, the Thieving skill)
             * @param entries The entries that should be added for the scope source (for example, adding npc media for thieving areas)
             */
            addCategoryScopeMedia: (scopeSourceId: string, entries: Map<string, NamedObjectWithMedia>): void => {
              ModifierScopeSourceMediaMemoizer.registerCategoryScopeMedia(scopeSourceId, entries);
            },

            /**
             * Add media sources for subcategory scopes that do not come with their own media inherintly
             * @param scopeSourceId - Id of the scope source (for example, the Cooking skill)
             * @param entries - The entries that should be added for the scope source (for example, adding some media for Cooking subcategories)
             */
            addSubcategoryScopeMedia: (scopeSourceId: string, entries: Map<string, NamedObjectWithMedia>): void => {
              ModifierScopeSourceMediaMemoizer.registerSubcategoryScopeMedia(scopeSourceId, entries);
            },

            /**
             * Add media sources for action scopes that do not come with their own media inherintly
             * NOTE: Actions should generally already have media, making this redundant. The only exceptions may be passive actions, as those would not need media to display on your character save slot
             * @param scopeSourceId - Id of the scope source
             * @param entries - The entries that should be added for the scope source
             */
            addActionScopeMedia: (scopeSourceId: string, entries: Map<string, NamedObjectWithMedia>): void => {
              ModifierScopeSourceMediaMemoizer.registerActionScopeMedia(scopeSourceId, entries);
            },

            /**
             * Add media sources for (combat) effect group scopes.
             * NOTE: Combat effect groups generally do NOT come with their own media inherintly
             * @param entries - The entries that should be added
             */
            addEffectGroupScopeMedia: (entries: Map<string, NamedObjectWithMedia>): void => {
              ModifierScopeSourceMediaMemoizer.registerEffectGroupScopeMedia(entries)
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
                secondary?: boolean,
                size?: string,
            ): string => IconManager.getIconHTML(modifierValue, positive, secondary, size),

            /**
             * An array of all available icon tags with an associated icon.
             * @returns {string[]} The list of available icon tags.
             */
            getAvailableTags: (): string[] => Array.from(TagManager.tagSrcs.keys()),

            /**
             * @returns {TagIconSources} An object of all available tags and their sources.
             */
            getAvailableTagsWithSources: (): Map<string, string> => TagManager.tagSrcs,

            /**
             * The {@link ModifierScopeSourceMediaMemoizer} data
             */
            getModifierScopeSourceMediaMemoizer: () => {
                return {
                  categoryMediaMap: ModifierScopeSourceMediaMemoizer.categoryMediaMap,
                  subcategoryMediaMap: ModifierScopeSourceMediaMemoizer.subcategoryMediaMap,
                  actionMediaMap: ModifierScopeSourceMediaMemoizer.actionMediaMap,
                  effectGroupMediaMap: ModifierScopeSourceMediaMemoizer.effectGroupMediaMap
                };
            },

            /**
             * SweetAlert popup with all game tags and their icons
             */
            viewAvailableTagsWithImages: (): void => this.viewAvailableTagsWithImages(),

            /**
             * SweetAlert popup with all game modifiers and their tagged icons.
             * @param exampleObjects Optionally privde specific scope objects you want to be utilized for the view (e.g. using your own custom skill)
             * @param namespaceFilter Optionally limit the output to a certain namespace (e.g. if you only want to see your own modifiers)
             * @param forceIconEnablement Optionally able to set this to true, to set all icon-related settings to true. Otherwise, the view will adhere to the character's mod settings (which will only be available inside a character)
             */
            viewAllModifiers: (exampleObjects?: Partial<IModifierScope>, namespaceFilter?: string, forceIconEnablement?: boolean): void => this.viewAllPassivesOnClick(exampleObjects, namespaceFilter, forceIconEnablement),

            /**
             * SweetAlert popup of the {@link ModifierScopeSourceMediaMemoizer} data
             */
            viewModifierScopeSourceMemoizer: (): void => this.viewModifierScopeSourceMemoizer(),

            // === DEPRECATED ===

            /**
             * Adds an object of custom tags and their sources to the list of icons available to Tiny Icons.
             * @param customTags An object of custom string tags and their string sources.
             * @deprecated
             */
            //addTagSources: (customTags: { [key: string]: string }) => {
            //  console.warn('[Tiny Icons] addTagSources is deprecated. Use addTagSourceMap instead.');
            //},

            /**
             * Adds an object of custom modifiers and their tags to the list of modifiers recognized by Tiny Icons.
             * @param customModifiers An object of custom modifiers and their tags.
             * @deprecated
             */
            //addCustomModifiers: (customModifiers: {
            //    modifier: string;
            //    tag: [string, string?];
            //}) => {
            //    console.warn('[Tiny Icons] addCustomModifiers has been deprecated. Use addCustomModifier instead.');
            //},

            /**
             * Returns the STATIC icon tags defined for a given modifier.
             * The first tag is the primary icon and the second tag is the secondary icon if any.
             * @param {string} modifier The name of the modifier.
             * @returns {string[]} The icon tags defined for the modifier in array of up to 2 string elements.
             * @deprecated
             */
            //getIconTagsForModifier: (modifier: string): (StaticModifierIconTag | ModModifierIconTag)[] => {
            //    console.warn('[Tiny Icons] getIconTagsForModifier has been deprecated. Use getIconTagMapForModifier instead.')
            //    return [];
            //},

            /**
             * Gets a melvor icon's asset path based on the given parameters.
             * Builds a string starting from `assets/media/`
             * @param {string} type "skills" | "skill" | "bank" | "main" | "status" | "misc" | "ti" | "mods" | "pets" | "shop" | "fa"
             * @param {string} name The file name of the icon.
             * @param {string | undefined} [specific] - Specific file name if name is a subtype.
             * @param {string} [ext='svg']  - The file extension.
             *
             * @deprecated
             * @example
             *  - getIconResourcePath("skills", "mining") // returns "assets/media/skills/mining/mining.svg"
             *  - getIconResourcePath("skills", "mining", "rock_iron") // returns "assets/media/skills/mining/rock_iron.svg"
             */
            //getIconResourcePath: (
            //    type: PathType,
            //    name: string,
            //    specific?: string | undefined,
            //    ext?: string,
            //): string => {
            //  console.warn('[Tiny Icons] getIconResourcePath has been deprecated.');
            //  return '';
            //},
        });
    }

    /**
   * SweetAlert popup with all game tags and their icons
   */
  private static viewAvailableTagsWithImages() {
    let html = '';

    TagManager.tagSrcs.forEach((value: string, key: string) => {
        html += `<h5 class="font-w400 font-size-sm mb-1">${key}: ${IconManager.imgSource(value)}</h5>`;
    });

    SwalLocale.fire({ html });
  }

  private static viewModifierScopeSourceMemoizer() {
    let html = '';

    // Categories
    html += '<h3 class="font-w600 mb-1 text-combat-smoke">Categories</h3>';
    ModifierScopeSourceMediaMemoizer.categoryMediaMap.forEach((value: Map<string, NamedObjectWithMedia>, key: string) => {
      html += '<hr class="w-50">';
      html += `<h4 class="text-warning">${key}</h4>`;
      html += '<ul>';
      value.forEach((value: NamedObjectWithMedia, key: string) => {
        html += `<li class="mb-2">${key}: ${IconManager.imgSource(value.media)} (${value.id})</li>`;
      });
      html += '</ul>';
    });

    html += '<hr class="w-75">'

    // Subcategories
    html += '<hr class="w-75">'
    html += '<h3 class="font-w600 mb-1 text-combat-smoke">Subcategories</h3>';
    ModifierScopeSourceMediaMemoizer.subcategoryMediaMap.forEach((value: Map<string, NamedObjectWithMedia>, key: string) => {
      html += '<hr class="w-50">';
      html += `<h4 class="text-warning">${key}</h4>`;
      html += '<ul>';
      value.forEach((value: NamedObjectWithMedia, key: string) => {
        html += `<li class="mb-2">${key}: ${IconManager.imgSource(value.media)} (${value.id})</li>`;
      });
      html += '</ul>';
    });

    // Actions
    html += '<hr class="w-75">'
    html += '<h3 class="font-w600 mb-1 text-combat-smoke">Actions</h3>';
    ModifierScopeSourceMediaMemoizer.actionMediaMap.forEach((value: Map<string, NamedObjectWithMedia>, key: string) => {
      html += '<hr class="w-50">';
      html += `<h4 class="text-warning">${key}</h4>`;
      html += '<ul>';
      value.forEach((value: NamedObjectWithMedia, key: string) => {
        html += `<li class="mb-2">${key}: ${IconManager.imgSource(value.media)} (${value.id})</li>`;
      });
      html += '</ul>';
    });

    // Combat effect groups
    html += '<hr class="w-75">'
    html += '<h3 class="font-w600 mb-1 text-combat-smoke">(Combat) Effect Groups</h3>';
    html += '<ul>';
    ModifierScopeSourceMediaMemoizer.effectGroupMediaMap.forEach((value: NamedObjectWithMedia, key: string) => {
      html += `<li class="mb-2">${key}: ${IconManager.imgSource(value.media)} (${value.id})</li>`;
    });
    html += '</ul>';

    SwalLocale.fire({ html: html });
  }

  /**
   * SweetAlert popup with all game modifiers.
   * @param exampleObjects Optionally privde specific scope objects you want to be utilized for the view (e.g. using your own custom skill)
   * @param namespaceFilter Optionally limit the output to a certain namespace (e.g. if you only want to see your own modifiers)
   * @param forceIconEnablement Optionally able to set this to true, to set all icon-related settings to true. Otherwise, the view will adhere to the character's mod settings (which will only be available inside a character)
   */
  private static viewAllPassivesOnClick(exampleObjects?: Partial<IModifierScope>, namespaceFilter?: string, forceIconEnablement?: boolean) {
    const originalModSettings = SettingsManager.settings;
    if (forceIconEnablement) {
      SettingsManager.settings = {
        globalIconsEnabled: true,
        secondaryIconsEnabled: true,
        placeholderIconEnabled: true,
        scopeIcons: {
          skill: true,
          damageType: true,
          realm: true,
          currency: true,
          category: true,
          action: true,
          subcategory: true,
          item: true,
          effectGroup: true,
        }
      };
    }

    // Explicitly using cooking for scope objects, as that skill makes use of all scope sources
    // Of course, some modifiers do not actually make sense with such scopes (e.g. combat identifiers), but that's not the point of these test entries after all
    const scopeExampleObjects: Required<IModifierScope> = {
      skill: exampleObjects?.skill ?? game.cooking,
      damageType: exampleObjects?.damageType ?? game.damageTypes.getObjectByID('melvorD:Normal')!,
      realm: exampleObjects?.realm ?? game.realms.getObjectByID('melvorD:Melvor')!,
      currency: exampleObjects?.currency ?? game.raidCoins, // visually more distinguishable than gp
      category: exampleObjects?.category ?? game.cooking.categories.getObjectByID('melvorD:Fire')!,
      action: exampleObjects?.action ?? game.cooking.actions.getObjectByID('melvorD:Shrimp')!,
      subcategory: exampleObjects?.subcategory ?? game.cooking.subcategories.getObjectByID('melvorD:Fish')!,
      item: exampleObjects?.item ?? game.items.getObjectByID('melvorD:Basic_Soup')!,
      effectGroup: exampleObjects?.effectGroup ?? game.combatEffectGroups.getObjectByID('melvorD:Stun')! // Fallback to generic icon, but give known groups a specific tag?
    };

    let html = `<h4 class="font-w600 font-size-sm mb-1 text-combat-smoke">All Game Modifiers</h5><h5 class="font-w600 font-size-sm mb-3 text-warning"><small>(Visual Only)</small></h5>`;

    const totalModifierCount = game.modifierRegistry.registeredObjects.size;
    let currentModifierIndex = 0;

    for (const mod of game.modifierRegistry.registeredObjects) {
      currentModifierIndex++;
      const modifier: Modifier = mod[1];
      if (namespaceFilter && modifier.namespace !== namespaceFilter) {
        continue;
      }

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

    // Reset settings back to what they were before this method was called
    SettingsManager.settings = originalModSettings;

    SwalLocale.fire({ html: html });
  }

  /**
   * Provide text to append to modifier overview, to signify scopes
   * @param scope
   * @returns
   */
  private static getScopeInfoSuffixForOverview(scope: IModifierScope) {
    let scopeNames: string[] = [];
    Object.keys(scope).forEach((value) => {
      scopeNames.push(value);
    });

    return scopeNames.join(', ');
  }
}