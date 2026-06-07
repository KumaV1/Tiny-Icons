import { TagAllocationMemoizer } from '../TagAllocationMemoizer';
import { EntityCategory } from '../types/entityCategory';
import { Logger } from '../Logger';
import { collectors } from './collectors';
import { TagManager } from '../managers/TagManager';

/**
 * Ensure the namespaced id does in fact contain a namespace
 * @param id
 * @returns
 */
function ensureNamespace(id: string): string {
  if (id.includes(':')) {
    return id;
  }

  return `melvorD:${id}`;
}

/**
 * Try to extract a modifier id from the given object. For example, the object could be a "ModifierValue", where the modifier id is extractable from "ModifierValue.modifier.id"
 * @param m
 * @returns
 */
function getModifierId(m: any): string | undefined {
  // The string or object is simply not defined at all
  if (!m) {
    return undefined;
  }

  // A direct string reference of a modifier
  if (typeof m === 'string') {
    return m;
  }

  // An object where the modifier (identifying) data is on a "modifierId" property (is that actually used somewhere)
  if (m.modifierId) {
    return m.modifierId;
  }

  // An object where the modifier (identifying) data is on a "modifier" property (e.g. ModifierValue.modifier)
  if (m.modifier) {
    if (typeof m.modifier === 'string') {
      return m.modifier;
    }
    if (m.modifier.id) {
      return m.modifier.id;
    }
  }

  // An object representing the modifier (like ModifierValue.modifier)
  if (m.id) {
    return m.id;
  }

  return undefined;
}

function mapModifiersToTags(mods: any[] | undefined): string[] {
  const tags: string[] = [];
  if (!mods || !Array.isArray(mods)) return tags;

  for (const mv of mods) {
    const mid = getModifierId(mv);
    if (!mid) {
      continue;
    }
    const trueMId = ensureNamespace(mid);
    const entry = TagAllocationMemoizer.modifierTagMap.get(trueMId) || (window as any).tinyIcons?.modifierTagMap?.get(trueMId);
    if (!entry) {
      continue;
    }
    try {
      const t = entry.primaryTag?.positive ?? undefined;
      if (t && !tags.includes(t)) {
        tags.push(t);
      }
      const s = entry.secondaryTag?.positive ?? undefined;
      if (s && !tags.includes(s)) {
        tags.push(s);
      }
    } catch (e) {
      // ignore
      // TODO: Possibly output a warn
    }
  }

  return tags;
}

/**
 * Whether a given modification application function is a noop
 * @param fn
 * @returns
 */
function isFunctionNoop(fn: Function | undefined) {
  if (!fn) {
    return true;
  }

  const s = fn.toString();
  return s.includes('is basically a noop') || s.includes("must always be overriden");
}

/**
 * Determines which cases are noops for a given entity category
 * @param category
 * @returns Object with descriptionIsNoop and conditionalModifiersIsNoop flags
 */
function getNoopCasesForCategory(category: EntityCategory): { descriptionIsNoop: boolean; conditionalModifiersIsNoop: boolean } {
  // Categories where description tags are noops (because custom description doesn't override stat printing)
  const descriptionNoopCategories = new Set([
    'Pet',
    'Prayer',
    'AttackStyle',
    'BaseAgilityObject',
    'AstrologyRecipe',
    'CombatPassive',
    'CombatSpell',
  ]);

  // Categories where conditional modifier tags are noops
  const conditionalModifiersNoopCategories = new Set<string>();

  return {
    descriptionIsNoop: descriptionNoopCategories.has(category),
    conditionalModifiersIsNoop: conditionalModifiersNoopCategories.has(category),
  };
}

/**
 * Try to find matching item icon tags by checking if item ID ends with a known tag name
 * @param itemId
 * @returns Array of matching tag names
 */
function findMatchingItemTags(itemId: string): string[] {
  const tags: string[] = [];
  if (!itemId) return tags;

  const lowerItemId = itemId.toLowerCase();

  // Get all item icon tag keys from TagManager
  const itemIconTags = (TagManager as any).staticTagsByCategories?.itemIcons;
  if (!itemIconTags || typeof itemIconTags !== 'object') return tags;

  // Check if item ID ends with any of the known tag names
  for (const tagName in itemIconTags) {
    if (lowerItemId.endsWith(tagName.toLowerCase())) {
      tags.push(tagName);
    }
  }

  return tags;
}

/**
 * Run one specific or all collectors
 * TODO: Add being able to filter to a certain namespace
 */
export function collect(cat: EntityCategory | undefined = undefined) {
  if (!collectors) {
    console.warn('Collectors not available');
    return;
  }

  const entries: any[] = [];
  const resultsByCategory: Map<string, any[]> = new Map();

  for (const [category, collectorFn] of collectors.entries()) {
    if (cat && category !== cat) {
      continue;
    }

    //Logger.log('Starting collector', category, collectorFn);
    let items: Array<{ context: any, entity: any }> = [];
    try {
      items = collectorFn();
    } catch (e) {
      Logger.log('Collector ran into error', category, e);
      continue;
    }
    Logger.log('Collector ran and returned following entities', category, items);

    const categoryResults: any[] = [];
    const noopCases = getNoopCasesForCategory(category);

    for (const it of items) {
      const ctx = it.context || {};
      const entity = it.entity;
      if (!entity) {
        continue;
      }

      // Special case: For items with providedRunes, check those runes for icon tags
      let itemTagsFromRunes: string[] = [];
      if ((category === 'WeaponItem' || category === 'EquipmentItem') && entity.providedRunes && Array.isArray(entity.providedRunes)) {
        for (const runeEntry of entity.providedRunes) {
          if (runeEntry && runeEntry.item && runeEntry.item.id) {
            const runeTags = findMatchingItemTags(runeEntry.item.id);
            for (const tag of runeTags) {
              if (!itemTagsFromRunes.includes(tag)) {
                itemTagsFromRunes.push(tag);
              }
            }
          }
        }
      }

      if (itemTagsFromRunes.length > 0) {
        const entry = { context: Object.assign({ category }, ctx), data: { descriptionIconTags: itemTagsFromRunes } };
        entries.push(entry);
        categoryResults.push(entry);
        continue;
      }

      // Get conditional modifiers from the entity
      const cms = entity.conditionalModifiers || entity.stats?.conditionalModifiers || entity.activeStats?.conditionalModifiers || entity.contains?.stats?.conditionalModifiers;

      // Check if conditional modifiers have descriptions or descriptionLang (meaning they generate custom descriptions)
      const cmsWithDescriptions = cms && Array.isArray(cms)
        ? cms.filter((c: any) => c.description !== undefined || c.descriptionLang !== undefined || c._description !== undefined || c._descriptionLang !== undefined)
        : [];

      // Case 1: Conditional modifiers with descriptions/descriptionLang but NO custom description on entity (skip if noop)
      if (!noopCases.conditionalModifiersIsNoop && cmsWithDescriptions.length > 0 && !entity._customDescription && !entity._langCustomDescription) {
        const cmTags = cmsWithDescriptions.map((c: any) => {
          // Check both modifiers and enemyModifiers
          const innerMods: any[] = [];
          if (c.modifiers) {
            innerMods.push(...c.modifiers);
          }
          if (c.enemyModifiers) {
            innerMods.push(...c.enemyModifiers);
          }
          if (c.values) {
            innerMods.push(...c.values);
          }
          if (c.modifierValues) {
            innerMods.push(...c.modifierValues);
          }
          const tags = mapModifiersToTags(innerMods);
          return tags;
        });

        const entry = { context: Object.assign({ category }, ctx), data: { conditionalModifierIconTags: cmTags } };
        entries.push(entry);
        categoryResults.push(entry);
        continue;
      }

      // Case 2: Entity has custom description AND at least one of (modifiers, enemyModifiers, conditionalModifiers) (skip if noop)
      if (!noopCases.descriptionIsNoop) {
        const hasCustomDescription = entity._customDescription !== undefined || entity._langCustomDescription !== undefined;
        const hasAnyModifiers = (entity.modifiers && entity.modifiers.length > 0) ||
          (entity.enemyModifiers && entity.enemyModifiers.length > 0) ||
          (entity.conditionalModifiers && entity.conditionalModifiers.length > 0) ||
          (entity.stats && ((entity.stats.modifiers && entity.stats.modifiers.length > 0) ||
            (entity.stats.enemyModifiers && entity.stats.enemyModifiers.length > 0) ||
            (entity.stats.conditionalModifiers && entity.stats.conditionalModifiers.length > 0))) ||
          (entity.activeStats && ((entity.activeStats.modifiers && entity.activeStats.modifiers.length > 0) ||
            (entity.activeStats.enemyModifiers && entity.activeStats.enemyModifiers.length > 0) ||
            (entity.activeStats.conditionalModifiers && entity.activeStats.conditionalModifiers.length > 0))) ||
          (entity.contains?.stats && ((entity.contains.stats.modifiers && entity.contains.stats.modifiers.length > 0) ||
            (entity.contains.stats.enemyModifiers && entity.contains.stats.enemyModifiers.length > 0) ||
            (entity.contains.stats.conditionalModifiers && entity.contains.stats.conditionalModifiers.length > 0)));

        if (hasCustomDescription && hasAnyModifiers) {
          const allMods: any[] = [];
          if (entity.modifiers) {
            allMods.push(...entity.modifiers);
          }
          if (entity.enemyModifiers) {
            allMods.push(...entity.enemyModifiers);
          }
          if (entity.stats) {
            if (entity.stats.modifiers) {
              allMods.push(...entity.stats.modifiers);
            }
            if (entity.stats.enemyModifiers) {
              allMods.push(...entity.stats.enemyModifiers);
            }
          }
          if (entity.activeStats) {
            if (entity.activeStats.modifiers) {
              allMods.push(...entity.activeStats.modifiers);
            }
            if (entity.activeStats.enemyModifiers) {
              allMods.push(...entity.activeStats.enemyModifiers);
            }
          }
          if (entity.contains?.stats) {
            if (entity.contains.stats.modifiers) {
              allMods.push(...entity.contains.stats.modifiers);
            }
            if (entity.contains.stats.enemyModifiers) {
              allMods.push(...entity.contains.stats.enemyModifiers);
            }
          }

          const suggested = mapModifiersToTags(allMods);
          const entry = { context: Object.assign({ category }, ctx), data: { descriptionIconTags: suggested } };
          entries.push(entry);

          let categoryResultEntry = JSON.parse(JSON.stringify(entry));
          categoryResultEntry.context.entity = entity;
          categoryResults.push(categoryResultEntry);
        }
      }
    }

    if (categoryResults.length > 0) {
      resultsByCategory.set(category, categoryResults);
    }
  }

  // Print results by category for easier verification
  const output = { modifications: { tinyIcons: { staticTagAllocations: entries } } };
  game.thieving.stunned
  console.log('=== Full data string ===');
  console.log(JSON.stringify(output, null, 2));

  console.log('=== Results by Category ===');
  resultsByCategory.forEach((results, category) => {
    console.log(`${category}: ${results.length} entries`);
    console.log(results);
  });

  console.log('=== Results as Category Map ===');
  console.log(resultsByCategory);

  console.log('=== Results Full ===');
  console.log(output);

  return output;
}

export default collect;
