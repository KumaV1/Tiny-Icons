import { IconManager } from "./managers/IconManager";
import { SettingsManager } from "./managers/SettingsManager";
import { TagManager } from "./managers/TagManager";
import { ModifierTagMapEntryAttributes } from "./models/ModifierTagMapEntryAttributes";
import { ModifierScopeSourceMediaMemoizer } from "./ModifierScopeSourceMediaMemoizer";
import { modifierTagMap } from "./tagging/modifierTagMap";
import { ModModifierIconTag } from "./types/modModifierIconTag";
import { NamedObjectWithMedia } from "./types/namedObjectWithMedia";
import { StaticModifierIconTag } from "./types/staticModifierIconTag";
import { TinyIconsModSettings } from "./types/tinyIconsModSettings";

export class PublicApi {
    public static init(ctx: Modding.ModContext): void {
        ctx.api({
            settings: (): TinyIconsModSettings => {
                return SettingsManager.settings;
            },

            /**
             * Adds an object of custom tags and their sources to the list of icons available to Tiny Icons.
             * @param customTags An object of custom string tags and their string sources.
             */
            //addTagSources: (customTags: { [key: string]: string }) => {
            //    console.log('addTagSources', customTags);
            //    for (const tag in customTags) {
            //        if (this.paths.srcForTag[tag]) {
            //            console.warn(`[Tiny Icons] Tag "${tag}" already exists.`);
            //            continue;
            //        }

            //        this.paths.srcForTag[tag] = customTags[tag];
            //    }
            //},

            /**
             * Adds an object of custom modifiers and their tags to the list of modifiers recognized by Tiny Icons.
             * @param customModifiers An object of custom modifiers and their tags.
             */
            addCustomModifiers: (customModifiers: {
                modifier: string;
                tag: [string, string?];
            }) => {
                console.warn('MOD REFACTOR IN PROGRESS. ADDING MODIFIERS IS CURRENTLY DISABLED!');
            },

            /**
             * Returns the STATIC icon tags defined for a given modifier.
             * The first tag is the primary icon and the second tag is the secondary icon if any.
             * @param {string} modifier The name of the modifier.
             * @returns {string[]} The icon tags defined for the modifier in array of up to 2 string elements.
             */
            getIconTagsForModifier: (modifier: string): (StaticModifierIconTag | ModModifierIconTag)[] => {
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
            ): string => IconManager.getIconHTML(modifierValue, positive, secondary, size),

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
            //getIconResourcePath: (
            //    type: PathType,
            //    name: string,
            //    specific?: string | undefined,
            //    ext?: string,
            //): string => this.paths.iconPath(type, name, specific, ext),

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
             * SweetAlert popup with all game tags and their icons
             */
            viewAvailableTagsWithImages: (): void => this.viewAvailableTagsWithImages(),

            /**
             * SweetAlert popup with all game modifiers and their tagged icons.
             */
            viewAllModifiers: (): void => this.viewAllPassivesOnClick(),

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
             * SweetAlert popup of the {@link ModifierScopeSourceMediaMemoizer} data
             */
            viewModifierScopeSourceMemoizer: (): void => this.viewModifierScopeSourceMemoizer(),
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
   */
  private static viewAllPassivesOnClick() {
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

    let html = `<h4 class="font-w600 font-size-sm mb-1 text-combat-smoke">All Game Modifiers</h5><h5 class="font-w600 font-size-sm mb-3 text-warning"><small>(Visual Only)</small></h5>`;

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