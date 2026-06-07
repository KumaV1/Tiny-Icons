declare global {
  // TODO: Define tinyIcons type
  interface ConditionalModifier {
    tinyIcons: undefined | {
      /**
       * The tags to place at the beginning of a conditional modifier's description.
       */
      descriptionTags: string[],

      /**
       * The html computed from the tags, to be cached to avoid repeating string building processes
       */
      descriptionTagsHtmlCached?: string,

      /**
       * In some cases we may want to cache the end result (not just icon html), in which case this caching field may be used
       */
      iconizedTextHtmlCached?: string
    }
  }
}

export { };