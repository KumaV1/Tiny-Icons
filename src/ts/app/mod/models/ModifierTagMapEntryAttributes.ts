import { AllIconTags } from "../ModifierIcons";

/**
 * Describes key attributes by which the icon tags to use can be computed
 * IMPORTANT: The "positive" and "negative" markers are not used based on the modifier value, but whether the modifier's value is interpreted as positive or negative
 */
export class ModifierTagMapEntryAttributes {   

    /**
     * Primary tag associated with the modifier. Do note, that scope tags are "more important", leading to them being placed before primary and secondary icon
     */
    primaryTag: { positive: AllIconTags, negative: AllIconTags }

    /**
     * Optinally, a secondary tag can be provided
     */
    secondaryTag?: { positive: AllIconTags, negative: AllIconTags }

    /**
     * For performance, specify which tags the modifier may deal with, so not every property is checked
     * TODO: Possibly to be removed, which properties to "compute" should be readable from the "ModifierValue" which should specify the current relevant scope
     */
    //availableScopes: TrueFlags<IModifierScope>

    constructor(primaryTag: AllIconTags | { positive: AllIconTags, negative: AllIconTags }, secondaryTag?: AllIconTags | { positive: AllIconTags, negative: AllIconTags }) {
        if (typeof primaryTag == 'string') {
            this.primaryTag = {
                positive: primaryTag,
                negative: primaryTag
            };
        } else {
            this.primaryTag = {
                positive: primaryTag.positive,
                negative: primaryTag.negative
            };
        }

        if (secondaryTag) {
            if (typeof secondaryTag == 'string') {
            this.secondaryTag = {
                positive: secondaryTag,
                negative: secondaryTag
            };
            } else {
                this.secondaryTag = {
                    positive: secondaryTag.positive,
                    negative: secondaryTag.negative
                };
            }
        }
    }
}