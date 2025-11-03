import { ModifierIconContext } from "../ModifierIconContext";
import { IconManager } from "./IconManager";
import { SettingsManager } from "./SettingsManager";

/**
 * Main class taking care of patching the original game logic, to involve our custom logic
 */
export class PatchManager {
    private static ctx: Modding.ModContext;

    public static patch(ctx: Modding.ModContext) {
        PatchManager.ctx = ctx;

        PatchManager.patchForContexts();
        PatchManager.patchForHtmlParsing();
        PatchManager.patchModifierDescription();
        PatchManager.patchApplyDescriptionModifications();
    }

    
    /**
     * A series of context-aware patches for various game methods. This method utilizes
     * `patchWithContext` to ensure `printPlayerModifier` is called with the correct context.
     *
     * @remarks
     * - Patches for different game abilities and menus to capture context when and if to prepend icons to modifier text.
     * - Special handling for the "Show Locked Astrology Modifiers" mod.
     */
    private static patchForContexts() {
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

    /**
     * Patch for various locations that modify the generated description to include formatting like changing color or adding icons to certain keywords (primarily, but not exclusively, combat status effects).
     * Sets a context to delay and belatedly apply the tiny icons, as doing so as usual ({@link ModifierValue}) would break tiny icons, if the icon path contains said keywords.
     * This prevents duplicate icons from being displayed in the description.
     */
    private static patchApplyDescriptionModifications() {
        PatchManager.ctx.patch(SpecialAttack, 'modifiedDescription').get(function(o: () => string) {
            if (this._modifiedDescription) {
                // if description has already been computed, then avoid running custom logic again
                return o();
            }

            // Set context
            ModifierIconContext.setIsDescriptionModificationContext();

            // Run original logic
            let desc = o(); // this is where `ModifierValue.print` as well as `applyDescriptionModifications` calls happen

            // Belatedly modify description with tiny icons
            desc = ModifierIconContext.applyTinyIconsPlaceholderReplacement(desc);

            // Reset context and finish up
            ModifierIconContext.resetdescriptionModificationContext();
            return desc;
        });

        PatchManager.ctx.patch(Item, 'modifiedDescription').get(function(o: () => string) {
            return PatchManager.getModifiedItemDescription(this, o);
        });
        PatchManager.ctx.patch(FoodItem, 'modifiedDescription').get(function(o: () => string) {
            return PatchManager.getModifiedItemDescription(this, o);
        });
        PatchManager.ctx.patch(EquipmentItem, 'modifiedDescription').get(function(o: () => string) {
            return PatchManager.getModifiedItemDescription(this, o);
        });
        PatchManager.ctx.patch(PotionItem, 'modifiedDescription').get(function(o: () => string) {
            return PatchManager.getModifiedItemDescription(this, o);
        });

        PatchManager.ctx.patch(CombatPassive, 'modifiedDescription').get(function(o: () => string) {
            if (this._modifiedDescription) {
                // if description has already been computed, then avoid running custom logic again
                return o();
            }

            // Set context
            ModifierIconContext.setIsDescriptionModificationContext();

            // Run original logic
            let desc = o();

            // Belatedly modify description with tiny icons
            desc = ModifierIconContext.applyTinyIconsPlaceholderReplacement(desc);

            // Reset context and finish up
            ModifierIconContext.resetdescriptionModificationContext();
            return desc;
        });
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
     * Logic run in item patches (classes had to be patched separately, as the respective logics implementation specifically had to be patched)
     * @param item
     * @param origGetter
     * @returns
     */
    private static getModifiedItemDescription(item: Item, origGetter: () => string): string {
        if (item._modifiedDescription) {
            // if description has already been computed, then avoid running custom logic again
            return origGetter();
        }

        // Set context
        ModifierIconContext.setIsDescriptionModificationContext();

        // Run original logic
        let desc = origGetter();

        // Belatedly modify description with tiny icons
        desc = ModifierIconContext.applyTinyIconsPlaceholderReplacement(desc);

        // Reset context and finish up
        ModifierIconContext.resetdescriptionModificationContext();
        item._modifiedDescription = desc; // otherwise it would contain the placeholders instead of the actual icons
        return desc;
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