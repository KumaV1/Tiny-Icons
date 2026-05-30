# Modding Support

## Intro

## Data Packages
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