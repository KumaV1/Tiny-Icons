import { ModifierIconContext } from "../ModifierIconContext";
import { IconManager } from "./IconManager";
import { SettingsManager } from "./SettingsManager";
import { TagManager } from "./TagManager";
import { TagAllocationMemoizer } from "../TagAllocationMemoizer";
import { Logger } from "../Logger";
import { EntityCategory } from "../types/entityCategory";
import { PublicApi } from "../PublicApi";

/**
 * Main class taking care of patching the original game logic, to involve our custom logic
 */
export class PatchManager {
    private static ctx: Modding.ModContext;

    public static patch(ctx: Modding.ModContext) {
        PatchManager.ctx = ctx;

        PatchManager.patchapplyDataModifications();

        // NOTE: It is important this runs before other patches, as some types ended up being patched for this and for some other stuff separately,
        // so it is important to keep the order in line
        PatchManager.patchApplyDescriptionModifications();

        PatchManager.patchComputableDescriptionIconization();
        PatchManager.patchPropagatedDataUtilization();

        // Patch in location awareness (for settings like not displaying icons in astrology)
        // TODO: Actually, resolvers would need to be aware of those too, shiet(they run way)
        // Actually, actually, the resolvers would all have to run on entering a character, do they not... maybe? They don't actually differentiate between "primary" and "secondary" tags right now, so that setting (disabling secondary ones) is kinda mood anyway
        PatchManager.patchForLocationContexts();

        // Patch in html resolving in some cases
        PatchManager.patchForHtmlParsing();

        // Patch print-out of modifiers (including conditional ones)
        PatchManager.patchModifierDescription();

        // Patch support regarding global func (redundant?)
        // YES, this one is redundant, due to the ones further below
        //PatchManager.patchApplyDescriptionModifications();

        // The following will be patched for one or more of the following reasons:
        // * Prevent tiny icon html from being broken due to the global "applyDescriptionModification" function of the base game
        // * Support icons for "custom descriptions" (which is to say, not generated from stats)
        // * Support icons for "conditional modifiers" (which is to say, not generated from stats)

        // TODO: Hmm... do "StatObject" always need to support modified dscriptions? No, right?
        //PatchManager.patchAncientRelics();
        //PatchManager.patchAstrology();
        //PatchManager.patchCombat(); // include summoning (synergy) and prayer here?
        //PatchManager.patchCartography();
        //PatchManager.patchItems(); // include item synergies here?
        //PatchManager.patchPets();
        //PatchManager.patchShop();
        //PatchManager.patchSkillTrees();

        PatchManager.applyDataModifications();
    }

    /**
     * Patches game data registration logic
     */
    private static patchapplyDataModifications() {
        PatchManager.ctx.patch(Game, 'applyDataModifications').after(function (returnValue: void, modificationData: GameDataModifications) {
            // Allow async (between data package registration and code-wise registering custom resolverys) by delaying actual resolvement until charcter selection screen

            PatchManager.ctx.onCharacterSelectionLoaded(function () {
                if (modificationData.tinyIcons) {
                    // Add new tags
                    if (modificationData.tinyIcons.tags) {
                        if (modificationData.tinyIcons.tags.namespace) {
                            TagManager.addTagsFromModData(modificationData.tinyIcons.tags.namespace, modificationData.tinyIcons.tags.data);
                        } else {
                            Logger.warn('Unable to process data package for tiny icons tags, as namespace is missing. Without namespace, media strings cannot be computed to actual resource strings');
                        }
                    }

                    // Add new taggings to modifiers
                    if (modificationData.tinyIcons.modifierTagAllocations && modificationData.tinyIcons.modifierTagAllocations.length > 0) {
                        modificationData.tinyIcons.modifierTagAllocations.forEach((data) => {
                            TagAllocationMemoizer.addTaggingForModifier(data.modifierId, data.primaryTag, data.secondaryTag);
                        });
                    }

                    // Add static taggings (entities and conditional modifiers)
                    if (modificationData.tinyIcons.staticTagAllocations && modificationData.tinyIcons.staticTagAllocations.length > 0) {
                        for (let i = 0; i < modificationData.tinyIcons.staticTagAllocations.length; i++) {
                            const ta = modificationData.tinyIcons.staticTagAllocations[i];
                            if (!ta.context || !ta.data) {
                                Logger.warn(`Issue registering modification package, during Tag allocation. Entry at index ${i} is missing context and/or data`, ta);
                            }

                            const propagator = TagAllocationMemoizer.propagators.get(ta.context.category);
                            if (!propagator) {
                                Logger.warn(`Issue registering modification package, during Tag allocation. Propagator for category ${ta.context.category} not found`);
                            }

                            const entity = propagator.getEntity(ta.context);
                            if (!entity) {
                                Logger.warn(`Issue registering modification package, during Tag allocation. Propagator for category ${ta.context.category} failed to retrieve entity/entities based on the context data`, ta.context);
                            }

                            propagator.propagateForEntity(entity, ta.data);
                        }
                    }
                }
            });            
        });
    }

    /**
     * Patches methods that build a description, where icons can be added, but neither require custom propagation, nor print modifier bonuses
     */
    private static patchComputableDescriptionIconization() {
        PatchManager.ctx.patch(MasteryTokenItem, 'description').get(function (o: () => string) {
            const baseResult = o();
            if (this.tinyIcons) {
                return `${this.tinyIcons.iconHtmlCached}${baseResult}`;
            }

            let iconHtml = IconManager.getIconHTMLForTag('mastery_pool');
            iconHtml += IconManager.getIconHTMLForSkill(this.skill);
            iconHtml += IconManager.getIconHTMLForRealm(this.realm);

            this.tinyIcons = {
                iconHtmlCached: iconHtml
            };

            return `${iconHtml}${baseResult}`;
        });
    }

    /**
     * Patch various classes to utilize tiny icon data propagated to certain entities
     * TODO: Technically, all these cases would have to use "context awareness" regarding "applyDescriptionModifications"...
     * ^ Well, supposedly this should not happen, as the logic of statically adding tags, I think, does not run before such a call - EXCEPT conditional modifiers that use lang string, unfortunately
     * ^ So, yeah, will definitely have to research how the original mod did it
     */
    private static patchPropagatedDataUtilization() {
        // Patch ConditionalModifier printing so it can make use of the current entityContext.
        // The context manager only provides category/id and a consumable index — actual data
        // must be retrieved by a memoizer/provider (registered via PublicApi).
        PatchManager.ctx.patch(ConditionalModifier, 'getDescription').after(function (returnValue: StatDescription | undefined, negMult?: number, posMult?: number) {
            // Opt-out if original logic does not result in any description anyway
            if (!returnValue) {
                return returnValue;
            }

            // Opt-out, if object provides no tiny icon context
            if (!this.tinyIcons) {
                return returnValue;
            }

            // Use cached data, if available
            if (this.tinyIcons.descriptionTagsHtmlCached) {
                return {
                    text: `${this.tinyIcons.descriptionTagsHtmlCached}${returnValue.text}`,
                    isNegative: returnValue.isNegative,
                    isDisabled: returnValue.isDisabled,
                };
            }

            if (this.tinyIcons.iconizedTextHtmlCached) {
                return {
                    text: this.tinyIcons.iconizedTextHtmlCached,
                    isNegative: returnValue.isNegative,
                    isDisabled: returnValue.isDisabled,
                };
            }

            // Opt-out, if no tags provided (should ideally not happen, as the "tinyIcons" property should not be set at all in such case)
            if (!this.tinyIcons.descriptionTags || this.tinyIcons.descriptionTags.length === 0) {
                Logger.warn(`Conditional modifier has tiny icon info, but no description tags.`, this);
                return returnValue;
            }

            // Apply icon html to start of description (and cache generated html)
            const iconHtml = IconManager.getIconHTMLForTags(this.tinyIcons.descriptionTags);

            // Finalization may vary in different locations
            let finalText = '';
            switch (ModifierIconContext.getCustomLocationContext()) {
                case 'prayerButtonTooltip':
                    // Wrap description in a span, so the icon and text are placed horizontal, not vertical (as in, wrap them into single child for container)
                    const iconizedText = `${iconHtml}${returnValue.text}`;
                    finalText = `<span class="tiny-icons-prayer-bonus-wrapper-element">${iconizedText}</span>`;
                    this.tinyIcons.iconizedTextHtmlCached = finalText;
                    break;
                default:
                    // Just return as expected
                    finalText = `${iconHtml}${returnValue.text}`;
                    this.tinyIcons.descriptionTagsHtmlCached = iconHtml;
                    break;
            }

            return {
                text: finalText,
                isNegative: returnValue.isNegative,
                isDisabled: returnValue.isDisabled,
            };

            return;
            //if (!returnValue) {
            //    return returnValue;
            //}
            //
            //const ctx = ModifierIconContext.peekEntityContext();
            //if (!ctx) {
            //    return returnValue;
            //}
            //
            //const index = ModifierIconContext.consumeConditionalIndex();
            //if (index === undefined) {
            //    return returnValue;
            //}
            //
            //// Resolve tags via the TagAllocationMemoizer directly. The memoizer
            //// is expected to accept an EntityContext-like object (category/id) and an index.
            //const tagData = TagAllocationMemoizer.getEntityContextTags(ctx.category, ctx.id);
            //if (!tagData || !tagData.conditionalModifierTags || tagData.conditionalModifierTags.length <= index) {
            //    return returnValue;
            //}
            //
            //if (ctx.id === 'melvorF:Sand_Treaders' || ctx.id === 'melvorD:Air_Battlestaff') {
            //    Logger.log(`Custom tags for item ${ctx.id}`, tagData);
            //}
            //
            //// TODO: If entity context has entry, add tiny icons for them
            ////const customTags = TagAllocationMemoizer.getEntityContextTags('EquipmentItem', itemId);
            ////if (customTags && customTags.tags) {
            ////    const iconHtml = customTags.tags.map(t => IconManager.getIconHTMLForTag(t)).join('');
            ////    let iconizedDesc = ModifierIconContext.isDescriptionModificationContext()
            ////        ? ModifierIconContext.addDescriptionModificationsTinyIconsPlaceholders(desc, iconHtml)
            ////        : iconHtml + desc;
            ////    desc = iconizedDesc;
            ////}
            //
            //const iconHtml = tagData.conditionalModifierTags[index]
            //    .map((t: string) => IconManager.getIconHTMLForTag(t))
            //    .join('');
            //if (!iconHtml) {
            //    return returnValue;
            //}
            //
            //const text = iconHtml + returnValue.text;
            //return {
            //    text: text,
            //    isNegative: returnValue.isNegative,
            //    isDisabled: returnValue.isDisabled,
            //};
        });

        // Patch Summoning Synergy
        PatchManager.ctx.patch(SummoningSynergy, 'description').get(function (o: () => string) {
            const baseResult = o();
            if (!this.tinyIcons) {
                return baseResult;
            }

            if (this.tinyIcons.descriptionTagsHtmlCached) {
                return `${this.tinyIcons.descriptionTagsHtmlCached}${baseResult}`;
            }

            // Opt-out, if no tags provided (should ideally not happen, as the "tinyIcons" property should not be set at all in such case)
            if (!this.tinyIcons.descriptionTags || this.tinyIcons.descriptionTags.length === 0) {
                Logger.warn(`Summoning synergy has tiny icon info, but no description tags.`, this);
                return baseResult;
            }

            // Apply icon html to start of description (and cache generated html)
            const iconHtml = IconManager.getIconHTMLForTags(this.tinyIcons.descriptionTags);
            this.tinyIcons.descriptionTagsHtmlCached = iconHtml;

            return `${iconHtml}${baseResult}`;
        });

        // Patch Shop Purchase

        PatchManager.ctx.patch(ShopPurchase, 'description').get(function (o: () => string) {
            const baseResult = o();
            if (!this.tinyIcons) {
                return baseResult;
            }

            if (this.tinyIcons.descriptionTagsHtmlCached) {
                return `${this.tinyIcons.descriptionTagsHtmlCached}${baseResult}`;
            }

            // Opt-out, if no tags provided (should ideally not happen, as the "tinyIcons" property should not be set at all in such case)
            if (!this.tinyIcons.descriptionTags || this.tinyIcons.descriptionTags.length === 0) {
                Logger.warn(`Summoning synergy has tiny icon info, but no description tags.`, this);
                return baseResult;
            }

            // Apply icon html to start of description (and cache generated html)
            const iconHtml = IconManager.getIconHTMLForTags(this.tinyIcons.descriptionTags);
            this.tinyIcons.descriptionTagsHtmlCached = iconHtml;

            return `${iconHtml}${baseResult}`;
        });

        // Patch combat passive
        PatchManager.ctx.patch(CombatPassive, 'modifiedDescription').get(function (o: () => string) {
            const baseResult = o();
            if (!this.tinyIcons) {
                return baseResult;
            }

            if (this.tinyIcons.descriptionTagsHtmlCached) {
                return `${this.tinyIcons.descriptionTagsHtmlCached}${baseResult}`;
            }

            if (!this.tinyIcons.descriptionTags || this.tinyIcons.descriptionTags.length === 0) {
                return baseResult;
            }

            // Apply icon html to start of description (and cache generated html)
            const iconHtml = IconManager.getIconHTMLForTags(this.tinyIcons.descriptionTags);
            this.tinyIcons.descriptionTagsHtmlCached = iconHtml;

            return `${iconHtml}${baseResult}`;
        });

        // Patch item classes
        const classesToPatch = [TokenItem, PotionItem, EquipmentItem, WeaponItem, FiremakingOilItem, FoodItem];
        classesToPatch.forEach(itemClass => {
            // @ts-ignore: Some weird espectations of classes sharing certain stuff, even though the only thing we care about is them all sharing having the "modifiedDescription" getter
            PatchManager.ctx.patch(itemClass, 'modifiedDescription').get(function (o: () => string) {
                const baseResult = o();
                if (!this.tinyIcons) {
                    return baseResult;
                }

                // We already modified the backing field, so the current result is already adjusted
                if (this.tinyIcons.customDescriptionModified) {
                    return baseResult;
                }


                // Modify description for item synergies | CURRENTLY NO USE CASE
                // DEV NOTE: There are cases with only one synergy and NO text-warning element has the description only describes said synergy!
                // TODO: Wait, no... there are cases like the "Poison Virulence Ring" that has both "always modifiers" and "synerg modifiers", so placement inbetween would still be desired...
                // Btw, said ring has 2 conditional modifiers. But the only way to potentially find a fitting placement would be finding a "." or in ring's case ";" in the description, as presumably divider between them
                // To properly deal with that, the "tinyIcons" object would basically need more data, like whether searching for a "." and/or ";" inside the text-warning should be attempted
                // DEV NOTE 2: Cases like "melvorTotH_Ethereal_Longbow" actually have more than one "text-warning"! But in that case it is because the second one is a special attack, NOT a synergy description!
                // ^ Heck, the "melvorF:Ancient_Sword" does have one text-warning, but it is the special attack! The conditional modifier is actually described outside of text-warning!
                // ^ Granted, for that the conditional modifier (being only a single one) could just be described via "item description", as customDescription would make conditional modifier tags non-usable anyway...

                //if (this instanceof EquipmentItem || this instanceof WeaponItem) {
                //    if (this.tinyIcons.hasItemSynergies) {
                //        const synergies = game.itemSynergies.get(this);
                //        if (synergies && synergies.length > 0) {
                //            if (synergies.length === 1) {
                //
                //            } else {
                //
                //            }
                //        }
                //    }
                //}                               


                // Modify description for general description icons
                if (this.tinyIcons.descriptionTags && this.tinyIcons.descriptionTags.length > 0) {
                    const iconHtml = IconManager.getIconHTMLForTags(this.tinyIcons.descriptionTags);
                    const newDescription = `${iconHtml}${baseResult}`;

                    this._modifiedDescription = newDescription;
                }

                // Return final result
                this.tinyIcons.customDescriptionModified = true; // the fact the item has a tiny icon object to begin with should make this required to avoid recomputation even in the case of a failure
                return this._modifiedDescription;
            });
        });
    }

    /**
     * Patching various classes that allow modification, to allow for a tiny icons property.
     * DEV NOTE: Some classes may not support modification. In such cases, check how well propogation can still be applied and possibly just "create/add" my own "applyDataModification" for that object (although not ON it, to ensure I do not overwrite vanilla code, were it to be added in the future)
     * DEV NOTE2: Some classes will not need this for "conditional modifiers" support (as autoamtically propagated to StatObject), but will need it for "customDescription" support
     */
    private static applyDataModifications() {
        // The user will not want to restrict their data to tiny icons. The mod would always have to be considered an "object modification".
        // However, not every object supports "applyDataModification", granted one could just use a custom function, rather than hooking into the existing (just need to patch into game.modifications to extract for types that do not inherintly support it).
        // Either way, this would still require patching every single use case, just like now.
        // Unless StatObject is patched to propagate data to conditional modifiers. Then only the cases with customDescription support would need explicit patching
        // Either way, whether stat object for conditional modifiers, or e.g. an EquipmentItem for custom description, stuff would always be registered via data modification, to ensure my mod is loaded and can actually map data to the target object

        // TODO: ACTUALLY, not all "IStatObject" supports are actually "StatObject" themselves, so a general data modification like that is not possible...
        // Regardless of the data support provided, all relevant DATA classes still need patching... but I guess I at least save having to patch HtmlElement classes
        // THEN AGAIN, "IStatObject" objects which are not "StatObject" actually call a static method like "StatObject.formatAsPlainList(this)" (ultimately calls "StatObject.getDescriptions"), and the melvor patching support does not directly suppor
        // Actually, that does not really matter. At the end of the day, a StatObject-like object is processed leading to "statObject.conditionalModifiers" being evaluated, leading to the "ConditionalModifier" object being evaluated.
        // So, basically, I can just add more modification for anything where "this.conditionalModifiers" is set and should have its tagging updated
        // It is just that I will still need to patch all the relevant data classes and cannot just keep it at the "StatObject" class for the conditional modifier support
        // ^ Granted, some of those I would have had to patch anyway, due to "_customDescription" requiring proper support too

        // StatObject
        // @ts-ignore: If this works, update type definition to include this as nullable additional property on the data interface
        //PatchManager.ctx.patch(StatObject, 'applyDataModification').after(function (data: IStatObjectModificationData, game: Game): void {
        //    // @ts-ignore: If this works, update type definition to include this as nullable additional property on the data interface
        //    if (data.tinyIcons) {
        //        // @ts-ignore: If this works, update type definition to include this as nullable additional property on the data interface
        //        if (data.tinyIcons.conditionalModifierTags && data.tinyIcons.conditionalModifierTags.length > 0) {
        //            // @ts-ignore: If this works, update type definition to include this as nullable additional property on the data interface
        //            for (let i = 0; i < data.tinyIcons.conditionalModifierTags.length; i++) {
        //                if (!this.conditionalModifiers || i >= this.conditionalModifiers.length) {
        //                    Logger.warn(`TODO: Explain. conditional modifier count and cm tags count do not match`);
        //                    return;
        //                }
        //
        //                // @ts-ignore: If this works, update type definition to include this as nullable additional property on the data interface
        //                this.conditionalModifiers[i].tinyIconTags = data.tinyIcons.conditionalModifierTags[i];
        //            }
        //        }
        //    }
        //});

        // TEST: REGISTER item modification
        //game.applyDataModifications({
        //    items: [{
        //        id: 'melvorF:Sand_Treaders',
        //        // @ts-ignore
        //        tinyIcons: {
        //        // @ts-ignore
        //            conditionalModifierTags: [
        //                ['interval', 'attack']
        //            ]
        //        }
        //    }];
        //})      

        // Custom Modifiers


        // Objects that require custom escription support

    }


    /**
     * A series of context-aware patches for various game methods. This method utilizes
     * `patchWithContext` to ensure `printPlayerModifier` is called with the correct context.
     *
     * @remarks
     * - Patches for different game abilities and menus to capture context when and if to prepend icons to modifier text.
     * - Special handling for the "Show Locked Astrology Modifiers" mod.
     */
    private static patchForLocationContexts() {
        // If the character does not have global icons enabled, then we need to patch certain methods to set a custom context for enabling the icons at specific locations
        PatchManager.ctx.onCharacterLoaded(() => {
            if (!SettingsManager.settings.globalIconsEnabled) {
                PatchManager.ctx.patch(BuiltAgilityObstacleElement, 'updatePassives').before(function(obstacle: AgilityObstacle): void {
                    ModifierIconContext.setCustomLocationContext('agility');
                });
                PatchManager.ctx.patch(BuiltAgilityObstacleElement, 'updatePassives').after(function(returnValue: void, obstacle: AgilityObstacle) {
                    ModifierIconContext.resetCustomLocationContext();
                });

                PatchManager.ctx.patch(AstrologyModifierDisplayElement, 'setModifier').before(function(astroMod: AstrologyModifier, mult: number): void {
                    ModifierIconContext.setCustomLocationContext('astrology');
                });
                PatchManager.ctx.patch(AstrologyModifierDisplayElement, 'setModifier').after(function(returnValue: void, astroMod: AstrologyModifier, mult: number) {
                    ModifierIconContext.resetCustomLocationContext();
                });
            }
        });
    }

    /**
     * Some elements may set `textContent`, causing icons to not be interpreted as such.
     * In some cases may set a custom location context, if further formatting is necessary
     * @param that
     */
    private static patchForHtmlParsing() {
        PatchManager.ctx.patch(PrayerTooltipElement, 'setPrayer').before(function(prayer: ActivePrayer): void {
            ModifierIconContext.setCustomLocationContext('prayerButtonTooltip');
        });

        PatchManager.ctx.patch(PrayerTooltipElement, 'setPrayer').after(function(returnValue: void, prayer: ActivePrayer) {
            // TODO: Preferably explicitly target the span, to put the images inside there?
            // Possibly fixes the placement, as first attempt probably set imgs as siblings, which with column direction caused the icons to appear above the text, rather than before it
            this.stats.innerHTML = this.stats.innerText; // there should be no inner elements, so innerHTML should be equal to innerText, but allows to force interpret the tiny icon elements as such

            ModifierIconContext.resetCustomLocationContext();
        });

        PatchManager.ctx.patch(MapRefinementMenuElement, 'updateRefinements').after(function(returnValue: void, map: DigSiteMap) {
            this.refinements.forEach((refinementEl: HTMLLIElement) => {
                refinementEl.innerHTML = refinementEl.innerText; // there should be no inner elements, so innerHTML should be equal to innerText, but allows to force interpret the tiny icon elements as such
            });
        });

        PatchManager.ctx.patch(MapRefinementMenuElement, 'updateNewRefinement').after(function(returnValue: void, map: DigSiteMap, cartography: Cartography, game: Game) {
            this.refinementSelects.forEach((refinementEl: HTMLButtonElement) => {
                refinementEl.innerHTML = refinementEl.innerText; // there should be no inner elements, so innerHTML should be equal to innerText, but allows to force interpret the tiny icon elements as such
            });
        });
    }

    /**
     * Main patching for adding icons to modifier descriptions
     */
    private static patchModifierDescription() {
        PatchManager.ctx.patch(ModifierValue, 'print').after(function(returnValue: StatDescription, negMult?: number, posMult?: number, precision?: number) {
            return PatchManager.modifyModifierValueDescription(returnValue, this);
        });
        PatchManager.ctx.patch(ModifierValue, 'printEnemy').after(function(returnValue: StatDescription, negMult?: number, posMult?: number, precision?: number) {
            return PatchManager.modifyModifierValueDescription(returnValue, this);
        });        
    }


    /*
    PatchManager.ctx.patch(AstrologyModifierDisplayElement, 'setModifier').before(function(astroMod: AstrologyModifier, mult: number): void {
                    ModifierIconContext.setCustomLocationContext('astrology');
                });

                PatchManager.ctx.patch(AstrologyModifierDisplayElement, 'setModifier').after(function(returnValue: void, astroMod: AstrologyModifier, mult: number) {
                    ModifierIconContext.resetCustomLocationContext();
                });*/

    /** Patch ancient relic element, so its printing of the stat description is aware it is printing for a certain relic */
    private static patchAncientRelics() {
        PatchManager.ctx.patch(AncientRelicElement, 'setRelic').before(function (relic: AncientRelic): void {
            ModifierIconContext.pushEntityContext('AncientRelic', relic.id);
        });
        PatchManager.ctx.patch(AncientRelicElement, 'setRelic').after(function (returnValue: void, relic: AncientRelic): void {
            ModifierIconContext.popEntityContext('AncientRelic', relic.id);
        });
    }

    /** TODO: Explain */
    private static patchAstrology() {

    }

    /** TODO: Explain */
    private static patchCombat() {

    }

    /** TODO: Explain */
    private static patchCartography() {
        // World map mastery bonus

        // TODO: bonus.id is not enough, also needs the overlying WorldMap's id!
        // ^ This may be a use-case for the entity context STACK... although the retriever would need to be aware of having to extract two entries, rather than one...
        PatchManager.ctx.patch(MapMasteryBonusElement, 'setBonus').before(function (bonus: WorldMapMasteryBonus): void {
            ModifierIconContext.pushEntityContext('CartographyWorldMapMasteryBonus', bonus.id);
        });
        PatchManager.ctx.patch(MapMasteryBonusElement, 'setBonus').after(function (returnValue: void, bonus: WorldMapMasteryBonus): void {
            ModifierIconContext.popEntityContext('CartographyWorldMapMasteryBonus', bonus.id);
        });

        // POI
        PatchManager.ctx.patch(PoiSearchResultElement, 'setPoi').before(function (poi: PointOfInterest, cartography: Cartography): void {
            ModifierIconContext.pushEntityContext('CartographyPOI', poi.id);
        });
        PatchManager.ctx.patch(PoiSearchResultElement, 'setPoi').after(function (returnValue: void, poi: PointOfInterest, cartography: Cartography): void {
            ModifierIconContext.popEntityContext('CartographyPOI', poi.id);
        });

        PatchManager.ctx.patch(HexOverviewElement, 'showPoiInfo').before(function (poi: PointOfInterest, cartography: Cartography): void {
            ModifierIconContext.pushEntityContext('CartographyPOI', poi.id);
        });
        PatchManager.ctx.patch(HexOverviewElement, 'showPoiInfo').after(function (returnValue: void, poi: PointOfInterest, cartography: Cartography): void {
            ModifierIconContext.popEntityContext('CartographyPOI', poi.id);
        });

        // TODO: May need to patch "PointOfInterest.searchText" as well? Hmm, probably not, it's about such after all?
    }

    /** TODO: Explain */
    private static patchItems() {
        //PatchManager.ctx.patch(Item, 'modifiedDescription').get(function (o: () => string) {
        //    // Mhm? Why did I patch the base class? because of "super" calls on the derived classes?
        //    // ^ A generic icon should not createtiny icons, so should not need patching?
        //    // Unless if one were to add them now, I guess. But really, mods should only want to set icons on below ones, right?
        //    return PatchManager.getModifiedItemDescription(this, 'Item', o);
        //});
        //PatchManager.ctx.patch(EquipmentItem, 'modifiedDescription').get(function (o: () => string) {
        //    // IN THIS CASE, THIS ALSO SUPPORTS WEAPON ITEMS! (they do not have a separate getter anyway)
        //    return PatchManager.getModifiedItemDescription(this, 'EquipmentItem', o);
        //});
        //PatchManager.ctx.patch(FiremakingOilItem, 'modifiedDescription').get(function (o: () => string) {
        //    return PatchManager.getModifiedItemDescription(this, 'FiremakingOilItem', o);
        //});
        //PatchManager.ctx.patch(FoodItem, 'modifiedDescription').get(function (o: () => string) {
        //    return PatchManager.getModifiedItemDescription(this, 'FoodItem', o);
        //});
        //PatchManager.ctx.patch(PotionItem, 'modifiedDescription').get(function (o: () => string) {
        //    return PatchManager.getModifiedItemDescription(this, 'PotionItem', o);
        //});
        //PatchManager.ctx.patch(TokenItem, 'modifiedDescription').get(function (o: () => string) {
        //    return PatchManager.getModifiedItemDescription(this, 'TokenItem', o);
        //});
    }

    /** TODO: Explain */
    private static patchPets() {
        PatchManager.ctx.patch(Pet, 'description').get(function (o: () => string) {
            ModifierIconContext.pushEntityContext('Pet', this.id);
            const desc = o();
            ModifierIconContext.popEntityContext('Pet', this.id);

            return desc;
        });
    }

    /** TODO: Explain */
    private static patchShop() {
        // Only patches in conditional-modifiers-auto-generation support, NOT custom descriptions!
        PatchManager.ctx.patch(ShopPurchase, 'description').get(function (o: () => string) {
            ModifierIconContext.pushEntityContext('ShopPurchase', this.id);
            const desc = o();
            ModifierIconContext.popEntityContext('ShopPurchase', this.id);

            return desc;
        });
    }

    /** TODO: Explain */
    private static patchSkillTrees() {
        PatchManager.ctx.patch(SkillTreeNodeInfoElement, 'setNode').before(function (tree: SkillTree, node: SkillTreeNode): void {
            ModifierIconContext.pushEntityContext('SkillTreeNode', `${tree.id}_${node.id}`);
        });
        PatchManager.ctx.patch(SkillTreeNodeInfoElement, 'setNode').after(function (returnValue: void, tree: SkillTree, node: SkillTreeNode): void {
            ModifierIconContext.popEntityContext('SkillTreeNode', `${tree.id}_${node.id}`);
        });
    }

    /**
     * Patch for various locations that modify the generated description to include formatting like changing color or adding icons to certain keywords (primarily, but not exclusively, combat status effects).
     * Sets a context to delay and belatedly apply the tiny icons, as doing so as usual ({@link ModifierValue}) would break tiny icons, if the icon path contains said keywords.
     * This prevents duplicate icons from being displayed in the description.
     */
    private static patchApplyDescriptionModifications() {
        PatchManager.ctx.patch(SpecialAttack, 'modifiedDescription').get(function (o: () => string): string {
            return PatchManager.getDescWithTinyIconsLogic(this, o, '_modifiedDescription', 'SpecialAttack', this.id, true);
        });
        PatchManager.ctx.patch(CombatPassive, 'modifiedDescription').get(function (o: () => string): string {
            return PatchManager.getDescWithTinyIconsLogic(this, o, '_modifiedDescription', 'CombatPassive', this.id, true);
        });
        PatchManager.ctx.patch(EquipmentItem, 'modifiedDescription').get(function (o: () => string) {
            // IN THIS CASE, THIS ALSO SUPPORTS WEAPON ITEMS! (they do not have a separate getter anyway)
            return PatchManager.getModifiedItemDescription(this, 'EquipmentItem', o);
        });
        PatchManager.ctx.patch(FiremakingOilItem, 'modifiedDescription').get(function (o: () => string) {
            return PatchManager.getModifiedItemDescription(this, 'FiremakingOilItem', o);
        });
        PatchManager.ctx.patch(FoodItem, 'modifiedDescription').get(function (o: () => string) {
            return PatchManager.getModifiedItemDescription(this, 'FoodItem', o);
        });
        PatchManager.ctx.patch(PotionItem, 'modifiedDescription').get(function (o: () => string) {
            return PatchManager.getModifiedItemDescription(this, 'PotionItem', o);
        });
        PatchManager.ctx.patch(TokenItem, 'modifiedDescription').get(function (o: () => string) {
            return PatchManager.getModifiedItemDescription(this, 'TokenItem', o);
        });
        //PatchManager.ctx.patch(SpecialAttack, 'modifiedDescription').get(function(o: () => string) {
        //    if (this._modifiedDescription) {
        //        // if description has already been computed, then avoid running custom logic again
        //        return o();
        //    }
        //
        //    // Set description modification context
        //    ModifierIconContext.pushEntityContext('SpecialAttack', this.id);
        //    ModifierIconContext.setIsDescriptionModificationContext();
        //
        //    // Run original logic
        //    let desc = o(); // this is where `ModifierValue.print` as well as `applyDescriptionModifications` calls happen
        //
        //    // Belatedly modify description with tiny icons
        //    desc = ModifierIconContext.applyTinyIconsPlaceholderReplacement(desc);
        //    this._modifiedDescription = desc;
        //
        //    // Reset context and finish up
        //    ModifierIconContext.resetDescriptionModificationContext();
        //    ModifierIconContext.popEntityContext('SpecialAttack', this.id);
        //
        //    return desc;
        //});
        //
        //PatchManager.ctx.patch(CombatPassive, 'modifiedDescription').get(function(o: () => string) {
        //    if (this._modifiedDescription) {
        //        // if description has already been computed, then avoid running custom logic again
        //        return o();
        //    }
        //
        //    // Set context
        //    ModifierIconContext.pushEntityContext('CombatPassive', this.id);
        //    ModifierIconContext.setIsDescriptionModificationContext();
        //
        //    // Run original logic
        //    let desc = o();
        //
        //    // Belatedly modify description with tiny icons
        //    desc = ModifierIconContext.applyTinyIconsPlaceholderReplacement(desc);
        //    this._modifiedDescription = desc;
        //
        //    // Reset context and finish up
        //    ModifierIconContext.resetDescriptionModificationContext();
        //    ModifierIconContext.popEntityContext('CombatPassive', this.id);
        //
        //    return desc;
        //});

        //const originalApplyDescriptionModifications = window.applyDescriptionModifications;
        //window.applyDescriptionModifications = (desc): string => {
        //    if (setLang !== 'en') return desc;
        //
        //    // Extract and remove all tiny-icon tags
        //    const cleanDesc = desc.replace(ModifierIconHandler.TINY_ICON_TAGS, '');
        //
        //    // Process the clean description through the original function
        //    const modifiedDesc = originalApplyDescriptionModifications(cleanDesc);
        //
        //    // Extract paths after `assets/` from all img src in modifiedDesc
        //    const uniqueSources = new Set<string>();
        //    const srcRegex = /<img[^>]*src="[^"]*assets\/([^"]+)"[^>]*>/g;
        //    let matches: RegExpExecArray | null;
        //    while ((matches = srcRegex.exec(modifiedDesc))) {
        //        uniqueSources.add(matches[1]);
        //    }
        //
        //    //  Restore tiny-icons in the original description, unless they were already added by the original function
        //    const finalDesc = desc.replace(
        //        ModifierIconHandler.TINY_ICON_TAGS,
        //        (match) => {
        //            const srcMatch = match.match(/src="[^"]*assets\/([^"]+)"/);
        //            // Remove the tiny icon if it's already in the description and it's not unique
        //            return srcMatch && uniqueSources.has(srcMatch[1]) ? '' : match;
        //        },
        //    );
        //
        //    // Pass the desc now with tiny icon tags (if any) that wont get mangled
        //    return originalApplyDescriptionModifications(finalDesc);
        //};
    }

    /**
     * Helper method around modifier value print logic, to possibly add icons to it
     * @param statDescription
     * @param modifierValue
     * @param invertNegativeInterpretation whether "statDescription.isNegative" should be inverted
     * @returns
     */
    private static modifyModifierValueDescription(statDescription: StatDescription, modifierValue: ModifierValue): StatDescription {
        const printIcons = SettingsManager.settings.globalIconsEnabled
                || ModifierIconContext.isRelevantLocation();
        if (!printIcons) {
            return statDescription;
        }

        // NOTE: We use the modifier value's interpretation of whether the value is considered bad/good. This should be consistent unlike the stat description
        // ^ For example, "-5% damage resistance ON THE ENEMY", when on the player, should be shown as positive, but still show the icon for "REDUCED damage resistance"
        const iconHtml = IconManager.getIconHTML(modifierValue, !modifierValue.isNegative, true);

        // Set either original description with tiny icons either replaced by placeholders, or set directly
        let iconizedText = ModifierIconContext.isDescriptionModificationContext()
            ? ModifierIconContext.addDescriptionModificationsTinyIconsPlaceholders(statDescription.text, iconHtml)
            : iconHtml + statDescription.text;

        // Possibly adjust formatting of description further
        switch (ModifierIconContext.getCustomLocationContext()) {
            case 'prayerButtonTooltip':
                // Wrap description in a span, so the icon and text are placed horizontal, not vertical (as in, wrap them into single child for container)
                iconizedText = `<span class="tiny-icons-prayer-bonus-wrapper-element">${iconizedText}</span>`;
                break;
            default:
                break; // No adjustments needed
        }

        // Finalize
        return {
            text: iconizedText,
            isNegative: statDescription.isNegative,
            isDisabled: statDescription.isDisabled
        };
    }

    /**
     * Wraps the originalDescriptionFunc with logic to allow for adding tiny icons to its result
     * TODO: Move somewhere else (utils?)
     * @param obj - The object for which a description is being generated
     * @param originalDescriptionFunc - The original description function (may include setting a caching property)
     * @param cachingPropertyName - Possibly name of a property used to preserve the computed description, so expensive operations can be avoided on subsequent calls
     * @param entityCategory - Category of the entity for which the description is being created
     * @param entityId - Id of the entity for which the description is being created
     * @param handleApplyDescriptionModification - Whether the function being wrapped is dealing with the global, unpatchable "applyDescriptionModification" function, requiring temporarily using placeholders in the description until belated replacement can be applied
     * @returns
     */
    private static getDescWithTinyIconsLogic(obj: Object, originalDescriptionFunc: () => string, cachingPropertyName: string | undefined, entityCategory: EntityCategory, entityId: string, handleApplyDescriptionModification = true): string {
        // @ts-ignore - We are dealing with building a description, the property ought to be a string
        if (cachingPropertyName && obj[cachingPropertyName] !== undefined) {
            // if description has already been computed, then avoid running custom logic again
            return originalDescriptionFunc();
        }

        // Set context
        ModifierIconContext.pushEntityContext(entityCategory, entityId);
        if (handleApplyDescriptionModification) {
            ModifierIconContext.setIsDescriptionModificationContext();
        }

        // Run original logic
        let desc = originalDescriptionFunc();

        // Add custom tags to the start of the description, if configured for the entity
        // @ts-ignore: Missing type definition
        //const tiData = obj.tinyIcons;
        //if (tiData && tiData.descriptionTags) {
        //    // @ts-ignore: Missing type definition
        //    const iconHtml = IconManager.getIconHTMLForTags(tiData.descriptionTags);
        //    const iconizedDesc = ModifierIconContext.isDescriptionModificationContext()
        //        ? ModifierIconContext.addDescriptionModificationsTinyIconsPlaceholders(desc, iconHtml)
        //        : iconHtml + desc;
        //    desc = iconizedDesc;
        //}

        // If dealing with the "applyDescriptionModification" function, now belatedly modify description, changing the placeholders to the actual icons
        if (handleApplyDescriptionModification) {
            desc = ModifierIconContext.applyTinyIconsPlaceholderReplacement(desc);
        }
        if (cachingPropertyName) {
            // @ts-ignore - We are dealing with building a description, the property ought to be a string
            obj[cachingPropertyName] = desc;
        }

        // Reset context
        if (handleApplyDescriptionModification) {
            ModifierIconContext.resetDescriptionModificationContext();
        }
        ModifierIconContext.popEntityContext(entityCategory, entityId);

        // Return result
        return desc;
    }

    /**
     * Logic run in item patches (classes had to be patched separately, as the respective logics implementation specifically had to be patched)
     * TODO: Move somewhere else (utils?)
     * @param item
     * @param itemCategory
     * @param origGetter
     * @returns
     */
    private static getModifiedItemDescription(item: Item, itemCategory: EntityCategory, origGetter: () => string): string {
        return this.getDescWithTinyIconsLogic(item, origGetter, '_modifiedDescription', itemCategory, item.id, true);

        //return;
        //if (item._modifiedDescription) {
        //    // if description has already been computed, then avoid running custom logic again
        //    return origGetter();
        //}
        //
        //// Push a lightweight entity context reference; ModifierIconContext will resolve details
        //const itemId = item.id;
        //ModifierIconContext.pushEntityContext('EquipmentItem', itemId);
        //
        //// Set context
        //ModifierIconContext.setIsDescriptionModificationContext();
        //
        //// Run original logic
        //let desc = origGetter();
        //
        //// TODO: Obviously, not do type check like this, probably
        //if (item instanceof EquipmentItem) {
        //    // TODO: If entity context has entry, add tiny icons for them
        //    const customTags = TagAllocationMemoizer.getEntityContextTags('EquipmentItem', itemId);
        //    if (itemId === 'melvorF:Sand_Treaders' || itemId === 'melvorD:Air_Battlestaff') {
        //        Logger.log(`Custom tags for item ${item.name}`);
        //        console.log(customTags);
        //    }
        //    if (customTags && customTags.tags) {
        //        const iconHtml = customTags.tags.map(t => IconManager.getIconHTMLForTag(t)).join('');
        //        let iconizedDesc = ModifierIconContext.isDescriptionModificationContext()
        //            ? ModifierIconContext.addDescriptionModificationsTinyIconsPlaceholders(desc, iconHtml)
        //            : iconHtml + desc;
        //        desc = iconizedDesc;
        //    }
        //} 
        //
        //// Belatedly modify description with tiny icons
        //desc = ModifierIconContext.applyTinyIconsPlaceholderReplacement(desc);
        //item._modifiedDescription = desc;
        //
        //// Reset context and finish up
        //ModifierIconContext.resetDescriptionModificationContext();
        //ModifierIconContext.popEntityContext('EquipmentItem', itemId);
        //
        //return desc;
    }

    /**
     * Recursively process all modifier elements with tiny icon img tags in textContent
     */
    private static processModifier(el: HTMLElement | Element): void {
        const stack = [el];
        while (stack.length) {
            const current = stack.pop();

            // Process the current element
            this.fixTextContentImgTag(current as HTMLElement);
            if (current) {
                // Add all children to the stack
                for (const child of Array.from(current.children)) {
                    stack.push(child);
                }
            }
        }
    }

    /**
     * Fixes modifier where a tiny icon img tag was set as the text content
     * Extracts the tiny icon image tag and reinserts it as html to display the icon
     */
    private static fixTextContentImgTag(node: HTMLElement): void {
        if (!node.textContent?.includes('tiny-icon')) {
            return;
        }

        const parser = new DOMParser();
        const docFragment = document.createDocumentFragment();

        // Split the text content by 'tiny-icon' and process each segment
        const segments = node.textContent.split(/(<img.*?tiny-icon.*?>)/g);

        for (const segment of segments) {
            if (segment.includes('tiny-icon')) {
                // Parse the string as HTML
                const parsedDocument = parser.parseFromString(segment, 'text/html');
                const imgElement = parsedDocument.body.firstChild;
                if (imgElement) {
                docFragment.appendChild(imgElement);
                }
            } else {
                const textNode = document.createTextNode(segment);
                docFragment.appendChild(textNode);
            }
        }

        // Clear the current content and append the new content
        node.textContent = '';
        node.appendChild(docFragment);
    }
}