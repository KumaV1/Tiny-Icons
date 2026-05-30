declare global {
    // TODO: Define tinyIcons type
    interface ShopPurchase {
        tinyIcons: undefined | {
            /**
             * The tags to place at the beginning of a conditional modifier's description.
             */
            descriptionTags: string[],

            /**
             * The html computed from the tags, to be cached to avoid repeating string building processes
             */
            descriptionTagsHtmlCached?: string
        }
    }
}

export { };