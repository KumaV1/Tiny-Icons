import { StaticModifierIconTag } from "../ModifierIcons";

/**
 * Describes key attributes by which the icon tags to use can be computed
 * IMPORTANT: The "positive" and "negative" markers are not used based on the modifier value, but whether the modifier's value is interpreted as positive or negative
 */
export class ModifierTagMapEntryAttributes {

    /**
     * Primary tag associated with the modifier. Do note, that scope tags are "more important", leading to them being placed before primary and secondary icon
     */
    primaryTag: { positive: StaticModifierIconTag, negative: StaticModifierIconTag } // TODO: IDEA: Change the type to a union type of "Always" and "Conditional/only if certain scopes to dot exist"
                                                                         // TODO: IDEA: Set both primary and secondary tag to type where the tag can be disabled if a certain or any scope is available? (basically same as above, but as a single type, which may result in more checks in code than above, not sure)
                                                                         // TODO: THOUGHT: What about the order of the icons, though? in certain cases, one would want the "nonScopeTag.X" to explicitly replace the primary tag at its location

    /**
     * Optinally, a secondary tag can be provided
     */
    secondaryTag?: { positive: StaticModifierIconTag, negative: StaticModifierIconTag }



    /**
     *
     * @param primaryTag The main tag to always display for that modifier
     * @param secondaryTag An optional second tag to display for that modifier
     */
    constructor(primaryTag: StaticModifierIconTag | { positive: StaticModifierIconTag, negative: StaticModifierIconTag }, secondaryTag?: StaticModifierIconTag | { positive: StaticModifierIconTag, negative: StaticModifierIconTag }) {
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