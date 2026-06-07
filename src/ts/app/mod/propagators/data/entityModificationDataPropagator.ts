import { PropagatorBaseDataData } from '../../types/data/propagatorBaseDataData';
import { PropagatorBaseContextData } from '../../types/data/propagatorBaseContextData';
import { Logger } from '../../Logger';

// BASE CLASS FOR ALL
// ^ Keep in mind there are cases (Synergies) where id is actually irrelevant in general, so even "id" should not be in here
// ^ One could create a base class for resolvers working based on a single NamespacedObject, though, heh
// Btw, should the resolvers be put into a "Memoizer" too?

// TODO: This class (and those overriding) would actually need to check whether the "tinyIcons" data already exists on the target object, foregoing overriding in that case!

/**
 * Base class for all resolvers that deal with applying modifications from data packaes to the corresponding object.
 * This approach was chosen for its explicitly-ness. 
 * This allows a centered space for the data, 
 * support for separating base game data and mod data, 
 * as well as ensuring that it is very clear what happens without being too intrusive into the base game logc.
 * @typeParam TEntity - The type of the entity to modify, to allow for intellisense
 * @typeParam TContextData - Defines the object structure (in the data package) for the context object, which allows retrieval of the entity that should be modified
 * @typeParam TDataData - Defines the object structure (in the data package) for the data object, which contains what should be applied to the object
 */
export abstract class EntityModificationDataPropagator<TEntity, TContextData extends PropagatorBaseContextData, TDataData extends PropagatorBaseDataData> {
  abstract description: string

  constructor() {
  }

  /**
   * Get entity from context. Always needs overwriting.
   * NOTE: Make sure you retrieve the object from a global data store (e.g. "game.items", or "game.attackStyles"),
   * otherwise you run the risk of the object possibly getting destroyed.
   * @param context
   * @returns The entity to process. Though in case of issues, no entry being found would ne possibly, but optimally should not happen
   */
  getEntity(context: TContextData): TEntity | undefined {
    // TODO: It may not always be just one entity, actually! E.g. item synergies may manage all items in said synergy!
    // ^ Although, I guess in that case one could argue the entity would be the synergy object, rather than the items, although it is said items that need the adjusting
    // ^ Also, "getConditionalModifiersFromEntity", if supported, would actually be expected to run on the ItemSynergy, so there is merit to that as well. "description modifications" may be so specific, those have to be overridden anyway (though "getConditionalModifiersFromEntity" can still be overriden too, at the end of the day)
    throw new Error("[Tiny Icons] The 'getEntity' function must always be overriden");
  }

  /**
   * Apply all sorts of modifications on the entity object
   * @param entity
   * @param data
   */
  propagateForEntity(entity: TEntity, data: TDataData) {
    // This should allow for more than "custom descriptions" and "conditional modifiers", but should not require the former two to have to be repeated all the time
    if (data.descriptionIconTags && data.descriptionIconTags.length > 0) {
      try {
        this.propagateForDescriptionOfEntity(entity, data.descriptionIconTags);
      } catch (e) {
        Logger.warn('Failed to apply description modifications properly due to an error. Following are the error, the entity to update and the data that was attempted to be applied', e, entity, data);
      }
    }
    if (data.conditionalModifierIconTags && data.conditionalModifierIconTags.length > 0) {
      try {
        const cms = this.getConditionalModifiersFromEntity(entity);
        if (!cms) {
          Logger.warn('Failed to retrieve conditional modifiers on entity!', entity);
          return;
        }

        this.propagateToConditionalModifiersOnEntity(entity, cms, data.conditionalModifierIconTags);
      } catch (e) {
        Logger.warn('Failed to apply conditional modifier modifications properly due to an error. Following are the error, the entity to update and the data that was attempted to be applied', e, entity, data);
      }
    }
  }

  /**
   * Apply description modifications. Different types MAY at times handle this differently, so needs overwrite support
   * Usually, this means just putting the description tags on the entity itself
   * @param entity
   * @param tags
   */
  propagateForDescriptionOfEntity(entity: TEntity, tags: string[]) {
    // @ts-ignore: Missing type declaration
    entity.tinyIcons = entity.tinyIcons ?? {};
    // @ts-ignore: Missing type declaration
    if (!entity.tinyIcons.descriptionTags) {
      // @ts-ignore: Missing type declaration
      entity.tinyIcons.descriptionTags = tags;
    } else {
      Logger.warn('This entity has already been set up with description tags by TI itself or another mod.', entity);
    }
  }

  /**
   * Get the custom modifiers on an entity
   * @param entity
   * @returns
   */
  getConditionalModifiersFromEntity(entity: TEntity): ConditionalModifier[] | undefined {
    // @ts-ignore This are probably the most standardized placements for conditional modifiers on an object with stats support
    if (entity.conditionalModifiers) {
      // @ts-ignore This are probably the most standardized placements for conditional modifiers on an object with stats support
      return entity.conditionalModifiers;
    }
    // @ts-ignore This are probably the most standardized placements for conditional modifiers on an object with stats support
    if (entity.stats && entity.stats.conditionalModifiers) {
      // @ts-ignore This are probably the most standardized placements for conditional modifiers on an object with stats support
      return entity.stats.conditionalModifiers;
    }

    return undefined;
  }

  /**
   * Apply modifications based on tag data for conditional modifiers.
   * Usually, this means just getting the conditional modifiers on the entity itself and appending tag data on it
   * @param entity
   * @param conditionalModifiers
   * @param tagGroups
   */
  propagateToConditionalModifiersOnEntity(entity: TEntity, conditionalModifiers: ConditionalModifier[], tagGroups: string[][]) {
    // @ts-ignore: No type definition
    conditionalModifiers.forEach((modifier, index) => {
      if (!modifier.tinyIcons) {
        modifier.tinyIcons = {
          descriptionTags: tagGroups[index]
        };
      } else {
        Logger.warn(`This entity has already been set up with conditional modifier tags for this specific index (${index}), either by TI itself or another mod.`, entity);
      }
    });
  }
}