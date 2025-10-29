import { ModModifierIconTag } from "../types/modModifierIconTag";
import { StaticModifierIconTag } from "../types/staticModifierIconTag";

/**
 * Describes key attributes by which the icon tags to use can be computed
 * IMPORTANT: The "positive" and "negative" markers are not used based on the modifier value, but whether the modifier's value is interpreted as positive or negative
 */
export class ModifierTagMapEntryAttributes {
    /**
     * Primary tag associated with the modifier. Do note, that scope tags are "more important", leading to them being placed before primary and secondary icon
     */
    primaryTag: { positive: StaticModifierIconTag | ModModifierIconTag, negative: StaticModifierIconTag | ModModifierIconTag }

    /**
     * Optinally, a secondary tag can be provided
     */
    secondaryTag?: { positive: StaticModifierIconTag | ModModifierIconTag, negative: StaticModifierIconTag | ModModifierIconTag }

    /**
     *
     * @param primaryTag The main tag to always display for that modifier
     * @param secondaryTag An optional second tag to display for that modifier
     */
    constructor(primaryTag: StaticModifierIconTag | ModModifierIconTag | { positive: StaticModifierIconTag | ModModifierIconTag, negative: StaticModifierIconTag | ModModifierIconTag },
        secondaryTag?: StaticModifierIconTag | ModModifierIconTag | { positive: StaticModifierIconTag | ModModifierIconTag, negative: StaticModifierIconTag | ModModifierIconTag }) {
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