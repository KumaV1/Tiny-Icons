import { ModifierIconContext } from "../ModifierIconContext";
import { ModCompatbility } from "./ModCompatibility";

export class SkillBostsCompatibility extends ModCompatbility {
    protected _version: string = "3.5.13";

    protected _namespace: string = "Skill_Boosts";

    protected _name: string = "Skill Boosts";

    public init(ctx: Modding.ModContext): void {
        ctx.onModsLoaded(() => {
            if (!this.modIsLoaded()) {
                return;
            }

            const sbModContext = mod.getContext(this._namespace);
            const sbClass = mod.api.Skill_Boosts.SkillBoosts;

            // Patch wrappers that can be used to signify a context that will call "applyDescriptionModifications" at least once inside of it

            // @ts-ignore - No type definition for the "SkillBoosts" class
            sbModContext.patch(sbClass, 'getConstellationModifierSpans').before(function(_) {
                // Set context
                ModifierIconContext.setIsDescriptionModificationContext();
            });
            // @ts-ignore - No type definition for the "SkillBoosts" class
            sbModContext.patch(sbClass, 'getConstellationModifierSpans').after(function(returnValue: unknown, _) {
                // Set context
                ModifierIconContext.resetDescriptionModificationContext();
            });
            // @ts-ignore - No type definition for the "SkillBoosts" class
            sbModContext.patch(sbClass, 'createModifierTooltip').before(function(_) {
                // Set context
                ModifierIconContext.setIsDescriptionModificationContext();
            });
            // @ts-ignore - No type definition for the "SkillBoosts" class
            sbModContext.patch(sbClass, 'createModifierTooltip').after(function(returnValue: unknown, _) {
                // Set context
                ModifierIconContext.resetDescriptionModificationContext();
            });
            // @ts-ignore - No type definition for the "SkillBoosts" class
            sbModContext.patch(sbClass, 'createEquipmentTooltip').before(function(_) {
                // Set context
                ModifierIconContext.setIsDescriptionModificationContext();
            });
            // @ts-ignore - No type definition for the "SkillBoosts" class
            sbModContext.patch(sbClass, 'createEquipmentTooltip').after(function(returnValue: unknown, _) {
                // Set context
                ModifierIconContext.resetDescriptionModificationContext();
            });

            // Patch actual class that should replace tiny icon placeholders with the actual icons

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