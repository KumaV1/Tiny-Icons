import { Logger } from "../Logger";
import { ModifierIconContext } from "../ModifierIconContext";

export class SkillBoostsCompatibility {
    /** Version the current state of the compatibility is based on (e.g. '1.0.0') */
    private static version: string = "3.5.13";

    /** Namespaces by which monsters can be retrieved (e.g. 'tinyIconsKuma') */
    private static namespace: string = "Skill_Boosts";

    /** Name by which it can be checked whether the mod is loaded (e.g. '[Refurbished] Tiny Icons') */
    private static externalName: string = "Skill Boosts";

    public static init(ctx: Modding.ModContext) {
        ctx.onModsLoaded(() => {
            if (!mod.manager.getLoadedModList().includes(this.externalName)) {
                return;
            }

            const sbModContext = mod.getContext(this.namespace);
            const sbClass = mod.api.Skill_Boosts.SkillBoosts;
            if (!sbModContext || !sbClass) {
                Logger.warn('Identified loading of "Skill Boosts" mod, but was unable to retrieve mod context or class definition.');
                return;
            }

            // == Patch certain methods that will lead to "applyDescriptionModifications" being called
            // @ts-ignore - No type definition for the "SkillBoosts" class
            sbModContext.patch(sbClass, 'getModifierNodes').before(function(_, statObject, negMult, posMult, includeZero, isConditional, isItemSynergy, tryForceDescriptions) {
                if (!isConditional) {
                    mod.api.tinyIcons.applyDescriptionModificationsSupport.setIsDescriptionModificationContext();
                }
            });
            // @ts-ignore - No type definition for the "SkillBoosts" class
            sbModContext.patch(sbClass, 'getModifierNodes').after(function(_, statObject, negMult, posMult, includeZero, isConditional, isItemSynergy, tryForceDescriptions) {
                if (!isConditional) {
                    mod.api.tinyIcons.applyDescriptionModificationsSupport.resetDescriptionModificationContext();
                }
            });

            // == Patch location of "applyDescriptionModifications" call, after which placeholders should be replaced
            // @ts-ignore - No type definition for the "SkillBoosts" class
            sbModContext.patch(sbClass, 'createModifierNode').after(function(returnValue: HTMLHeadingElement, obj: Object) {
                // Belatedly modify description with tiny icons
                returnValue.innerHTML = ModifierIconContext.applyTinyIconsPlaceholderReplacement(returnValue.innerHTML);

                // Return modified
                return returnValue;
            });
        });
    }
}