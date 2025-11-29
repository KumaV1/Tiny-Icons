import { ModifierIconTag } from "../types/modifierIconTag";
import { StaticModifierTagDefinition } from "../types/staticModifierTagDefinition";

/**
 * Describes key attributes by which the icon tags to use can be computed.
 * IMPORTANT: The "positive" and "negative" markers are not used based on the modifier value, but whether the modifier's value is interpreted as positive or negative
 * IMPORTANT2: The "primary" tag should generally try to describe an effect by itself (e.g. "currency gain", "damage output change", "lifesteal"),
 * with the secondary tag primarily acting as static "scope/restriction" info (e.g. "Only in Thieving", "only when using melee", "only when the enemy is bleeding")
 */
export class ModifierTagMapEntryAttributes {
    /**
     * Primary tag associated with the modifier.
     */
    primaryTag: StaticModifierTagDefinition//{ positive: ModifierIconTag, negative: ModifierIconTag }

    /**
     * Optinally, a secondary tag can be provided
     */
    secondaryTag?: StaticModifierTagDefinition//{ positive: ModifierIconTag, negative: ModifierIconTag }

    /**
     *
     * @param primaryTag The main tag to always display for that modifier
     * @param secondaryTag An optional second tag to display for that modifier
     * @param ignoreIfSkillScope - TODO: Also allow for "replace", so for example currency icon (generic) can be replaced by the actual currency at the desired location (?)
     */
    constructor(primaryTag: ModifierIconTag | { positive: ModifierIconTag, negative?: ModifierIconTag, ignoreIfSkillScope?: boolean },
        secondaryTag?: ModifierIconTag | { positive: ModifierIconTag, negative: ModifierIconTag, ignoreIfSkillScope?: boolean }) {
        if (typeof primaryTag == 'string') {
            this.primaryTag = new StaticModifierTagDefinition(primaryTag, primaryTag, false);
        } else {
            this.primaryTag = new StaticModifierTagDefinition(
                primaryTag.positive,
                primaryTag.negative ?? primaryTag.positive,
                primaryTag.ignoreIfSkillScope ?? false);
        }

        if (secondaryTag) {
            if (typeof secondaryTag == 'string') {
                this.secondaryTag = new StaticModifierTagDefinition(secondaryTag, secondaryTag, false);
            } else {
                this.secondaryTag = new StaticModifierTagDefinition(
                    secondaryTag.positive,
                    secondaryTag.negative ?? secondaryTag.positive,
                    secondaryTag.ignoreIfSkillScope ?? false);
            }
        }
    }
}