declare global {
    interface GameDataModifications {
        tinyIcons?: {
            /** Tags to add */
            tags: {
                /** The name of the mod's namespace, so media can be properly computed */
                namespace: string,

                /** The actual tag data */
                data: { name: string, media: string }[]
            }
            /** Static tag allocations to add */
            staticTagAllocations?: {
                /** Info on the context for which to process the entry. For example the propagator to use and data to find the entity to propogate data to */
                context: Object & { category: EntityCategory },

                /** The actual data, aka info on what tags to actually set */
                data: Object
            }[]

            /** Modifier tag allocations to add */
            modifierTagAllocations: {
                /** The Id of the modifier for which to configure tag allocation */
                modifierId: string,

                /** Primary tag to set for the modifier */
                primaryTag: StaticModifierIconTag | ModModifierIconTag | {
                    positive: StaticModifierIconTag | ModModifierIconTag,
                    negative: StaticModifierIconTag | ModModifierIconTag,
                    ignoreIfSkillScope?: boolean
                },

                /** Optionally secondary tag to set for the modifier */
                secondaryTag?: StaticModifierIconTag | ModModifierIconTag | {
                    positive: StaticModifierIconTag | ModModifierIconTag,
                    negative: StaticModifierIconTag | ModModifierIconTag,
                    ignoreIfSkillScope?: boolean
                }
            }[]
        }
    }
}

export { };