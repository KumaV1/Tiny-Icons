declare global {
    // TODO: Define tinyIcons type
    interface ItemSynergy {
        tinyIcons: undefined | {
            /**
             * An id by which the synergy can be identified, and therefore by which an html element with a tiny-icons-item-synergy-id attribute can be searched for
             */
            id: string

            /**
             * The tags to place at the beginning of a conditional modifier's description.
             */
            descriptionTags: string[]
        }
    }
}

export { };