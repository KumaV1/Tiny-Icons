# Modding Support
## Table of Contents

1. [Intro](#intro)
2. [Data Packages](#data-packages)
   - [Data package and format](#data-package-and-format)
   - [Code integration example](#code-integration-example)
3. [API](#api)
   - [About availability](#about-availability)
   - [applyDescriptionModificationsSupport](#applydescriptionmodificationssupport)
   - [Adding](#adding)
   - [Getting](#getting)
   - [Viewing](#viewing)

## Intro
Some data ca be added via both API and data packages. Some things can only be registered via API. See the following description on what is possible.

## Data Packages

### Data package and format
**IMPORTANT**: Unfortunately, due to the restrictions of `dependentData`, data packages **have** to be loaded via code!
`dependentData` unfortunately supports neither the `onModsLoadedHook` (making mod load order atually important, if you don't wait for said hook),
nor does it support requiring more than one namespace (for example `tinyIcons` **and** `melvorTotH`).

To load data packages conditionally, first create a `.json` data package file as usual.
```json
{
  "$schema": "https://melvoridle.com/assets/schema/gameData.json",
  "namespace": "myMod",
  "dependentData": [
    {
      "namespace": "melvorTotH",
      "modifications": {
        "tinyIcons": {
          // Data here
        }
      }
    }
  ]
}
```

Available data structure for tiny icons:
```ts
interface GameDataModifications {
    tinyIcons?: {
        /** Tags to add */
        tags: {
            /** The name of the mod's namespace, so media can be properly computed */
            namespace: string,

            /** The actual tag data */
            data: { name: string, media: string }[]
        }

        /** Static tag allocations to add */
        staticTagAllocations?: {
            /** Info on the context for which to process the entry. For example the propagator to use and data to find the entity to propogate data to */
            context: Object & { category: string },

            /** The actual data, aka info on what tags to actually set */
            data: Object
        }[]

        /** Modifier tag allocations to add */
        modifierTagAllocations: {
            /** The Id of the modifier for which to configure tag allocation */
            modifierId: string,

            /** Primary tag to set for the modifier */
            primaryTag: string | {
                positive: string,
                negative: string,
                ignoreIfSkillScope?: boolean
            },

            /** Optionally secondary tag to set for the modifier */
            secondaryTag?: string | {
                positive: string,
                negative: string,
                ignoreIfSkillScope?: boolean
            }
        }[]
    }
}
```

### Code integration example

Example for loading packages via code:
```ts

// ===== Data Package Imports =====
// NOTE: You can use dependent data for expansion namespaces, instead of checking for the expansions via code!
// If you wait with registering the data packages until the "onModsLoaded" hook, then you can also use dependentData for mod namespaces
import Data from '../src/data/data.json';
import DataTotH from '../src/data/dataTotH.json';
import DataAoD from '../src/data/dataAoD.json';
import DataItA from '../src/data/dataItA.json';

// ===== Class =====
export class TinyIconsCompatibility {
  // === Partially Documentational properties ===

  /** Version of the mod at the time of last updating this class */
  static _version: string

  /** The namespace of the mod */
  static _namespace: string

  /** "Official" name of the mod as it appears in certain methods; generally more output-friendly */
  static _name: string

  // === Functionality ===
  public static async loadData(ctx: Modding.ModContext) {
    ctx.onModsLoaded(() => {
      if (!TinyIconsCompatibility.modIsLoaded()) {
        return;
      }

      // NOTE: You may have to add "@ts-ignore" statements, as the base game data definition does not include tiny icons
      await ctx.gameData.addPackage(Data);
      await ctx.gameData.addPackage(DataTotH);
      await ctx.gameData.addPackage(DataAoD);
      await ctx.gameData.addPackage(DataItA);
    });
  }
  
  /**
   * Checks whether the given mod is loaded
   */
  private static modIsLoaded(): boolean {
    return game.registeredNamespaces.hasNamespace(TinyIconsCompatibility._namespace);

    // Alternatively, you could check the loaded mods list
    return mod.manager.getLoadedModList().includes(TinyIconsCompatibility._name);
  }
}

```

## API

You can check [this file](https://github.com/KumaV1/Tiny-Icons/blob/main/src/ts/app/mod/PublicApi.ts) in the Repository for an up-to-date overview of the API.

Generally, you will need to add static tags for custom modifiers by yourself.

As for scope media, this mod may already be able to pick up on it. This mod will generally pick up, if the scope source has a `media` property. This mod will also be able to pick up on data added to existing structures, assuming the data package is loaded in before `onCharacterSelection` (for example, the mod would pick up on an additional Thieving Area being added by a mod).

### About availability

Generally, you will need to ensure that anything you do is only called once the `onModsLoaded` hook has been initialized, to ensure this mod's API has actually been initialized by the game.

Due to the game possibly caching values (as in texts which include tiny icons), it is advised to add all your custom data `onCharacterSelectionLoaded` **at the latest** (Tiny Icons may then force the game to re-compute certain texts at `onCharacterLoaded` to ensure the mod settings are adhered to).

As for getting/viewing data, some data may only be available upon `onCharacterSelectionLoaded`. Furthermore, the mod settings are, understandibly, only available upon `onCharacterLoaded`, so icon usage is generally disabled before that due to the "Global Icons" setting being disabled by default. On the note of mod settings, any changes to them are expected to be followed by a reload, so they can be retrieved once and then preserved for whatever you may want to use them.

### applyDescriptionModificationsSupport

TODO: Explain.

Short summary: A certain un-patchable game function can currently cause issues with broken tiny icons, if not properly catched. If that function is called by a mod, then they may have broken tiny icons in some cases.

### Adding

There are a few functions that allow you to add data to the mod.

```typescript
/**
 * Add tags you can use for static tags on modifiers
 * @param tags - Map of tags to add (key is tag, value the media to use for the tag). Already existing tags will be skipped.
 */
addTagSourceMap: (tags: Map<string, string>): void

// Example
const tags = new Map([
  ['my-mod-tag', 'my/media']
]);
```

```typescript
/**
* Add static tags to modifiers
* @param modifierId - Full id of the modifier
* @param primaryTag - Define primary tag(s), either as simple string or as object, depending on whether positive and negative value interpretation should use different icons (also whether an icon should possibly be hidden when a skill scope is available)
* @param secondaryTag - Optionally also provide a secondary tag
*/
addModifier: (modifierId: string, primaryTag: string | { positive: string, negative: string, ignoreIfSkillScope?: boolean }, secondaryTag?: string | { positive: string, negative: string, ignoreIfSkillScope?: boolean }): void

// Examples
addModifier('myNamespace:myLocalId', 'my-mod-tag') // Add only a primary tag;
addModifier('myNamespace:myLocalId', 'my-mod-tag', 'another-tag'); // Add both primary and secondary tag
addModifier(
  'myNamespace:myLocalId',
  { positive: 'my-positive-mod-tag', negative: 'my-negative-mod-tag' },
  { positive: 'another-positive-tag', negative: 'another-negative-tag' },
); // Add both primary and secondary tag, with positive and negative results using different tags
```

```typescript
/**
* Add media sources for category scopes that do not come with their own media inherintly
* @param scopeSourceId Id of the scope source (for example, the Thieving skill)
* @param entries The entries that should be added for the scope source (for example, adding npc media for thieving areas)
*/
addCategoryScopeMedia: (scopeSourceId: string, entries: Map<string, NamedObjectWithMedia>): void
addSubcategoryScopeMedia: (scopeSourceId: string, entries: Map<string, NamedObjectWithMedia>): void
addActionScopeMedia: (scopeSourceId: string, entries: Map<string, NamedObjectWithMedia>): void

// Example - Add icon for new Thieving area, by using the first NPC in said area as source for the media
addCategoryScopeMedia('melvorD:Thieving', new Map([
  ['myNamespace:my-thieving-area', game.thieving.areas.getObjectByID('myNamespace:my-thieving-area').npcs[0]]
]));
```

```typescript
/**
* Add media sources for (combat) effect group scopes.
* NOTE: Combat effect groups generally do NOT come with their own media inherintly
* @param entries - The entries that should be added 
*/
addEffectGroupScopeMedia: (entries: Map<string, NamedObjectWithMedia>): void

// Example
addEffectGroupScopeMedia(new Map([
  ['myNamespace:my-combat-effect-group', game.combatEffects.getObjectByID('myNamespace:my-combat-effect')]
]));
```

### Getting

There are a few functions by which you can retrieve certain values.

```typescript
/**
* Get currently active mod settings
* @returns Mod settings
*/
settings: (): TinyIconsModSettings
```

```typescript
/**
* Returns tag attributes object for given modifier, if one is set up for that modifier
* @param modifier The name of the modifier.
* @returns {ModifierTagMapEntryAttributes | undefined} An object of modifier tag attributes
*/
getIconTagMapForModifier: (modifier: string): ModifierTagMapEntryAttributes | undefined

// Example
const tagMap = getIconTagMapForModifier('myNamespace:myLocalId');
// e.g. { primaryTag: { positive: 'my-positive-mod-tag', negative: 'my-negative-mod-tag' }, secondaryTag: 'another-tag' }
```

```typescript
/**
* Returns the HTML for the icon associated with the given modifier and value.
* @param {ModifierValue} modifierValue - Data on the modifier boost this gives.
* @param {boolean} positive - Whether the value has a positive impact on the entity the modifier is applied on
* @param {boolean} [secondary] Whether to get the secondary icon HTML.
* @param {string} [size='xxs'] Optional icon size - 'xxs', 'xs', 'sm', 'md'
* @returns {string} The HTML for the icon.
*/
getIconHTMLForModifier: (modifierValue: ModifierValue, positive: boolean, secondary?: boolean, size?: string): string
// Example
const html = getIconHTMLForModifier(new ModifierValue(game.modifierRegisty.getObjectByID('myNamespace:myLocalId'), 10), true, true);
// e.g. '<img class="skill-icon-xxs tiny-icon mb-1 mr-1" src="assets/media/main/xp.svg">' // base game media
// e.g. '<img class="skill-icon-xxs tiny-icon mb-1 mr-1" src="blob:https://steam.melvoridle.com/49969d46-da80-47f0-a35a-d53a51248e09">' // mod media
```

```typescript
/**
* An array of all available icon tags
* @returns {string[]} The list of available icon tags.
*/
getAvailableTags: (): string[]

/**
* @returns {Map<string, string>} An object of all available tags and their media source.
*/
getAvailableTagsWithSources: (): Map<string, string>
```

```typescript
/**
* Get the currently memoized media references for scope sources that do not inherintly have one themselves
*/
getModifierScopeSourceMediaMemoizer: ModifierScopeSourceMediaMemoizer,
```

### Viewing

There are a few functions by which you can visually display certain values via popups.

```typescript
/**
* SweetAlert popup with all game tags and their icons
*/
viewAvailableTagsWithImages: (alphabetically?: boolean): void
```

```typescript
/**
* SweetAlert popup with all game modifiers and their tagged icons.
* @param exampleObjects - Optionally provide specific scope objects you want to be utilized for the view (e.g. using your own custom skill)
* @param namespaceFilter - Optionally limit the output to a certain namespace (e.g. if you only want to see your own modifiers)
* @param forceIconEnablement - Optionally able to set this to true, to set all icon-related settings to true. Otherwise, the view will adhere to the character's mod settings (which will only be available inside a character)
*/
viewAllModifiers: (exampleObjects?: Partial<IModifierScope>, namespaceFilter?: string, forceIconEnablement?: boolean): void

// Example
viewAllModifiers(); // Show all modifiers. Will show icons based on character mod settings (which means no icons, unless you actually entered a character)
viewAllModifiers(namespace: 'myNamespace', forceIconEnablement: true); // Show only modifiers added by you, ensure icons are displayed
viewAllModifiers({ skill: game.myCustomSkill }, 'myNamespace', true); // Show only modifiers added by you, using your custom skill as source for skill scoping, while ensuring icons are displayed
```

```typescript
/**
* SweetAlert popup of the {@link ModifierScopeSourceMediaMemoizer} data
*/
viewModifierScopeSourceMemoizer: (): void
```