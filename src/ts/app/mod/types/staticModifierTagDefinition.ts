import { ModModifierIconTag } from "./modModifierIconTag"
import { StaticModifierIconTag } from "./staticModifierIconTag"

export class StaticModifierTagDefinition {
    /**
     * The tag to use, if the bonus has a positive impact
     */
    positive: StaticModifierIconTag | ModModifierIconTag    

    /**
     * The tag to use, if the bonus has a negative impact
     */
    negative: StaticModifierIconTag | ModModifierIconTag

    /**
     * Whether the tag should be ignored, if a skill scope (or scope source in general?) is available
     */
    ignoreIfSkillScope: boolean

    constructor(positive: StaticModifierIconTag | ModModifierIconTag, 
        negative: StaticModifierIconTag | ModModifierIconTag,
        ignoreIfSkillScope: boolean) {
            this.positive = positive;
            this.negative = negative;
            this.ignoreIfSkillScope = ignoreIfSkillScope;
    }
}