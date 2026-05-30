// NOTE: If already looking for text-warning span, might as well improve support for modded items, by also looking for "tiny-icon-index" attribute, to allow for proper placement, if more than one "text-warning" element is added (e.g. someose putting the synergies into an item's description could control it the way that each synergy has its icon placed at a fitting location)
// NOTE2: For an item synergy, one would preferably update all items (assuming they have that text-warning span). HOWEVER, this may lead to an item with multiple synergies having a BUNCH of tags added,

import { Logger } from "../../Logger";
import { IconManager } from "../../managers/IconManager";
import { PropagatorBaseContextData } from "../../types/data/propagatorBaseContextData";
import { PropagatorBaseDataData } from "../../types/data/propagatorBaseDataData";
import { EntityModificationDataPropagator } from "./entityModificationDataPropagator";
import { ItemDataPropagator } from "./itemDataPropagator";

/**
 * A regex to extract the location of an html element with the "text-warning" class from a text
 */
const warningElementRegex = /<[^>]*class\s*=\s*["'][^"']*\btext-warning\b[^"']*["'][^>]*>/i;

/**
 * A regex to extract the location(s) of an html element with the "tiny-icons-index" attribute
 */
const tinyIconsElementRegex = /<[^>]*tiny-icons-index\s*=\s*["'](\d+)["'][^>]*>/gi;

interface ItemSynergyPropagatorContextData extends PropagatorBaseContextData {
    /**
     * Full ids of the items that make up the synergy
     */
    itemIDs: string[],

    /**
     * Whether the synergy descriptions are placed in a "text-warning" element
     * If so, this usually should be the first one. More may exist due to special attacks.
     * Regardless of the amount of synergies, they are usually wrapped in a single "text-warning" element
     */
    synergyDescriptionIsWrappedByTextWarningClassElement?: boolean

    /**
     * If one knows when the conditional modifiers start, one may be able to determine when which one starts thanks to separator characters like a ";"
     */
    conditionalModifiersSeparatorCharacter?: string

    /**
     * Modded items could create their own html and explicitly use tiny icon support elements. Users would not see that support (if tiny icons is not actually loaded), but if Tiny Icons is in fact available, then they can allow for more placement control for other mod developers
     */
    attributesThatWouldHelpWithPlacement?: Object
}

// so maybe each item synergy tiny icons data should (optionally?) specify a specific item to be updated, with each item being allowed to have "synergy tiny icons" added only once
export class ItemSynergyDataPropagator extends EntityModificationDataPropagator<ItemSynergy, ItemSynergyPropagatorContextData, PropagatorBaseDataData> {
    description = 'Noop propagator! - Base game + expansions pretty much never uses more than one synergy per item, and the only time it does the synergies are mutually exclusive.'

    getEntity(context: ItemSynergyPropagatorContextData) {
        // Get the first item of the array
        const item = game.items.getObjectSafe(context.itemIDs[0]);

        // Get the synergies for that item
        const synergies: ItemSynergy[] | undefined = game.itemSynergies.get(item as EquipmentItem);
        if (!synergies) {
            throw new Error(`[Tiny Icons] Failed to find synergies for item with id ${item.id}`);
        }

        // Find specifically the synergy with the other items in it
        const filteredSynergies = synergies.filter(s => {
            const synergyItemIds: string[] = s.items.filter((i): i is EquipmentItem => i instanceof EquipmentItem).map(i => i.id);
            return context.itemIDs.every(id => synergyItemIds.includes(id));
        });
        if (filteredSynergies.length <= 0) {
            Logger.warn('Failed to retrieve a synergy for context data', context);
            return undefined;
        }

        if (filteredSynergies.length >= 2) {
            Logger.warn(`Context data let to ${filteredSynergies.length} synergies being found, rather than just one. Will only return the first one.`, context);
        }
        return filteredSynergies[0];
    }

    /**
     * 
     * @param entity
     * @param conditionalModifiers
     * @param tags
     */
    //propagateToConditionalModifiersOnEntity(entity: ItemSynergy, conditionalModifiers: ConditionalModifier[], tagGroups: string[][]) {
        //super.propagateToConditionalModifiersOnEntity(entity, conditionalModifiers, tagGroups);

        // TODO: Add conditional modifier info on each item?

        // Apply tags on the conditional modifiers of the item synergy itself
        //Logger.warn('ItemSynergyDataPropagator.propagateToConditionalModifiersOnEntity is basically a noop');
        //super.propagateToConditionalModifiersOnEntity(entity, conditionalModifiers, tagGroups);

        // TODO: This is actually NOT about conditional modifiers! Item synergies are ended explicitly, not via conditional modifiers!
        // ^ Although they ARE stat objects and therefore MAY contain conditional modifiers also!
        // This resolver would need a "standard" or "id" for a given "synergy", so rather than an index, the spans would include that id in order to signify which synergy is placed where!
        // I guess an Item Synergy would still support a "description modification" to put at the start of each item?
        // And correspondingly also an array of tags for multiple conditional modifiers
        // However, the description would need span structures like this
        // <span class="text-warning">
        // <span class="synergy" tiny-icons-synergy-id="synergyA">SYNERGY_DESC</span>
        // <span class="synergy" tiny-icons-synergy-id="synergyB">
        //  SYNERGY_BASE_DESC
        //      <span class="conditional_modifier_desc" tiny-icons-cm-index="0">CONDITIONAL_MODIFIER_1_DESC</span>
        //      <span class="conditional_modifier_desc" tiny-icons-cm-index="1">CONDITIONAL_MODIFIER_2_DESC</span>
        // </span>
        // </span>

    //}

    /**
     * 
     * @param entity
     * @param tags
     */
    propagateForDescriptionOfEntity(entity: ItemSynergy, tags: string[]) {
        Logger.warn('ItemSynergyDataPropagator.propagateForDescriptionOfEntity is basically a noop. Use ItemDataPropagator instead.');
        super.propagateForDescriptionOfEntity(entity, tags);

        // Build an id
        entity.tinyIcons!.id = `tinyIcons__${entity.items.map(i => i instanceof EquipmentItem ? i.id : i).sort().join('__')}`;

        // Set flag on items, so the item description patch has it easier (item synergies only ever are described on its items, not via the ItemSynergy object itself)
        entity.items.forEach((value: EquipmentItem | SynergyGroup) => {
            if (value instanceof EquipmentItem) {
                value.tinyIcons = value.tinyIcons || {};
                value.tinyIcons.hasItemSynergies = true;
            } else {
                Logger.warn('Data propagation currently only works for specific equipment items, not synergy groups like "ThrowingWeapon" (which will not print a synergy to every single item of that type anyway, so not an issue)', entity, value);
            }
        });
    }

    /**
     * 
     * @param entity
     * @param conditionalModifiers
     * @param tagGroups
     */
    propagateToConditionalModifiersOnEntity(entity: ItemSynergy, conditionalModifiers: ConditionalModifier[], tagGroups: string[][]) {
        Logger.warn('ItemSynergyDataPropagator.propagateToConditionalModifiersOnEntity is basically a noop. Use ItemDataPropagator instead.');
        super.propagateToConditionalModifiersOnEntity(entity, conditionalModifiers, tagGroups);
    }

    /**
     * 
     * @param entity
     * @param tags
     */
    //propagateForDescriptionOfEntity(entity: ItemSynergy, tags: string[]) {
    //    //Logger.warn('ItemSynergyDataResolver.propagateForDescriptionOfEntity is basically a noop');
    //    //return;
    //
    //    TODO: Add desctipzion info on each item?
    //
    //    // Go through each item in the synergy, looking for text-warning html
    //    for (const value of entity.items) {
    //        // We ignore the "categories" that is "all throwing weapons"
    //        // and "all melee 2h weapons" for now, I guess...
    //    
    //        // Guard clause: skip non-equipment items
    //        if (!(value instanceof EquipmentItem)) {
    //            continue;
    //        }
    //    
    //        // Guard clause: skip entities without custom description
    //        if (!value._customDescription) {
    //            Logger.warn(
    //                'Item has no custom description set. Resolver will not add icons to custom description.',
    //                value
    //            );
    //            continue;
    //        }
    //    
    //        let modifiedDescription = value._customDescription;
    //    
    //        //
    //        // CASE 1:
    //        // Single tag array -> insert before .text-warning
    //        //
    //        if (!Array.isArray(tags[0])) {
    //            const match = warningElementRegex.exec(modifiedDescription);
    //    
    //            // Guard clause: nothing to insert into
    //            if (!match) {
    //                continue;
    //            }
    //    
    //            const insertion = IconManager.getIconHTMLForTags(tags);
    //    
    //            modifiedDescription =
    //                modifiedDescription.slice(0, match.index) +
    //                insertion +
    //                modifiedDescription.slice(match.index);
    //    
    //            value._customDescription = modifiedDescription;
    //            continue;
    //        }
    //    
    //        //
    //        // CASE 2:
    //        // Array of tag arrays -> insert via tiny-icons-index
    //        //
    //        // @ts-ignore As of now, tags is not supposed to be a nested array. TODO: Think about how to manage this!
    //        //const tagGroups = tags as Tag[][];
    //        //
    //        //// Collect matches first because we'll mutate the string
    //        //const matches = [...modifiedDescription.matchAll(tinyIconsElementRegex)];
    //        //
    //        //// Guard clause: no insertion markers found
    //        //if (matches.length === 0) {
    //        //    continue;
    //        //}
    //        //
    //        //// Reverse iteration so indexes remain valid after insertion
    //        //for (let i = matches.length - 1; i >= 0; i--) {
    //        //    const match = matches[i];
    //        //    if (!match.index) {
    //        //        continue;
    //        //    }
    //        //
    //        //    const targetIndex = Number(match[1]);
    //        //
    //        //    // Guard clause: invalid target index
    //        //    if (
    //        //        Number.isNaN(targetIndex) ||
    //        //        targetIndex < 0 ||
    //        //        targetIndex >= tagGroups.length
    //        //    ) {
    //        //        continue;
    //        //    }
    //        //
    //        //    const insertion = IconManager.getIconHTMLForTags(
    //        //        tagGroups[targetIndex]
    //        //    );
    //        //
    //        //    modifiedDescription =
    //        //        modifiedDescription.slice(0, match.index) +
    //        //        insertion +
    //        //        modifiedDescription.slice(match.index);
    //        //}
    //        //
    //        //value._customDescription = modifiedDescription;
    //    }
    //}

    /**
     * 
     * @param entity
     * @returns
     */
    //getConditionalModifiersFromEntity(entity: ItemSynergy): ConditionalModifier[] | undefined {
    //    Logger.warn('Due to the base game always working with custom descriptions on items, calling ItemSynergyDataResolver.getConditionalModifiersFromEntity may be a noop');
    //    return super.getConditionalModifiersFromEntity(entity);
    //}
}