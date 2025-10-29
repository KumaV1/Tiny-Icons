import { TagManager } from "../managers/TagManager";

/**
 * All available icon tags (for static tagging) based on ModifierIconPaths categories.
 */
export type StaticModifierIconTag = ExtractKeys<
  typeof TagManager.staticTagsByCategories
>;