import { CustomLocationContext } from "./types/customLocationContext";

// IDea: Context = "EquipmentItem_something:something" -> try get  "conditionalModifiers"-Iconset, or a "at start of description" icvonset, as there are e.g. items with full _customDescriptions and those where autp-generated modifier-descs are combined with the hard-written conditional modifiers
// What about effects? Preferably setable on Templates for bettert inherent mod support? How to avoid too many icons?
import { Logger } from './Logger';

/**
 * Represents a pushed entity context entry (category + id + conditional index cursor).
 */
export class EntityContext {
  category: string;
  id: string;
  private _conditionalIndex: number = 0;

  constructor(category: string, id: string) {
    this.category = category;
    this.id = id;
    this._conditionalIndex = 0;
  }

  /**
   * Get current conditional index without advancing.
   */
  getConditionalIndex(): number {
    return this._conditionalIndex;
  }

  /**
   * Consume and advance the conditional index, returning the index used.
   */
  consumeConditionalIndex(): number {
    const idx = this._conditionalIndex;
    this._conditionalIndex++;
    return idx;
  }
}

/**
 * Manages context from where and when to print modifier icons with printPlayerModifier.
 * TODO: RENAME TO JUST "Context", or "IconContext" or whatever!
 */
export class ModifierIconContext {
  /**
   * "applyDescriptionModification" is a function that, in the English language,
   * will modify certain keywords, to change their color and add their icon. For example, causing a simple "burn" to be displayed in red and adding a fire icon.
   * However, that logic does not differentiate where that text is located in the description, breaking tiny icons with those keywords in their names.
   * Because of that, when running into logic calling that method, we need to delay adding the tiny icons to after this function was called
   */
  private static isApplyDescriptionModificationContext: boolean = false;

  /**
   * Remember how many times icon snippets are created for a single over-arching description (e.g. an item description with MULTIPLE modifier values)
   */
  private static currentSnippetCount: number = 0;

  /**
   * Map the placeholder snippet index with the corresponding html snippet to replace them with later
   */
  private static snippetMap: Map<number, string> = new Map();

  /**
   * Stack of entity contexts. Each entry may be pushed before generating an entity's
   * description and popped afterwards. LIFO semantics.
   */
  private static entityContextStack: EntityContext[] = [];

  /**
   * A custom location context, used to in some cases be able to tell where modifier description creation is rendered,
   * as there are some cases where logic is run before the "page context" is adjusted (e.g. rendering agility page elements, before actually setting the current page to agility)
   */
  private static currentCustomLocationContext: CustomLocationContext | undefined;

  /**
   * Create placeholder, which includes an index to separate the different ones
   * @param index
   * @returns
   */
  private static createSnippetPlaceholder(index: number): string {
    return `{TI_IC_SN_${index}}`;
  }

  /**
   * Set the info that we are running logic that will run this function
   * @param value
   */
  static setIsDescriptionModificationContext() {
    this.isApplyDescriptionModificationContext = true;
  }

  /**
   * Get whether we are currently in a situation that will call this method
   * @param value
   */
  static isDescriptionModificationContext(): boolean {
    return this.isApplyDescriptionModificationContext;
  }


  // TODO: HANDLING WRAPPED ACTUALLY NEEDS TESTING

  /**
   * Push an entity context onto the stack.
   * Examples:
   *  pushEntityContext('SpecialAttack', 'special_attack_id')
   *  pushEntityContext('EquipmentItem', 'special_attack_id')
   */
  /**
   * Push an entity context reference onto the stack.
   * Always accepts a category and id. Actual icon data is resolved from the registry.
   */
  static pushEntityContext(category: string, id: string): void {
    this.entityContextStack.push(new EntityContext(category, id));
  }

  /**
   * Pop the top-most entity context. If category and id are provided, pop until a matching
   * context is removed (warn if mismatches are encountered).
   */
  static popEntityContext(category: string, id: string): void {
    if (!category || !id) {
      throw new Error('ModifierIconContext.popEntityContext requires non-empty category and id');
    }

    // Pop until matching category+id is found
    while (this.entityContextStack.length) {
      const top = this.entityContextStack[this.entityContextStack.length - 1];
      if (top.category === category && top.id === id) {
        this.entityContextStack.pop();
        return;
      }

      // Mismatch: remove top and continue searching
      // eslint-disable-next-line no-console
      Logger.warn(`ModifierIconContext.popEntityContext: popping mismatched context (expected ${category}/${id}, found ${top.category}/${top.id})`);
      this.entityContextStack.pop();
      }

    // If we exhausted the stack without finding a match, warn
    Logger.warn(`ModifierIconContext.popEntityContext: no matching context found for ${category}/${id}`);
  }

  /**
   * Peek the top-most entity context without removing it.
   */
  /**
   * Peek the top-most entity context entry (category + id + cursor).
   */
  static peekEntityContext(): EntityContext | undefined {
    return this.entityContextStack[this.entityContextStack.length - 1];
  }

  /**
   * Clears all entity contexts.
   */
  static resetEntityContexts(): void {
    this.entityContextStack = [];
  }

  /**
   * Get the iconTags for the current (top-most) entity context.
   */
  /**
   * Get the top-most entity context (category + id + cursor) if any.
   */
  static getCurrentEntityContext(): EntityContext | undefined {
    return this.peekEntityContext();
  }

  /**
   * Returns the next conditional modifiers icon-tag-array for the current entity context
   * and advances the internal index. Returns undefined when none available.
   */
  /**
   * Consume and return the next conditional index for the current (top) context.
   * This does not resolve any data; it only advances and returns the numeric index.
   */
  static consumeConditionalIndex(): number | undefined {
    const top = this.entityContextStack[this.entityContextStack.length - 1];
    if (!top) {
      return undefined;
    }

    return top.consumeConditionalIndex();
  }

  /**
   *
   * @param description {@link ModifierValue} description
   * @param iconHtml The icon html we will (later) want to set
   * @returns The {@link ModifierValue} description with a placeholder added that can later be replaced
   */
  static addDescriptionModificationsTinyIconsPlaceholders(description: string, iconHtml: string): string {
    this.currentSnippetCount++;
    this.snippetMap.set(this.currentSnippetCount, iconHtml);

    const placeholder = this.createSnippetPlaceholder(this.currentSnippetCount);
    return `${placeholder}${description}`;
  }

  /**
   * Replaces the previously added placeholders with the corresponding html snippets
   * @param description
   */
  static applyTinyIconsPlaceholderReplacement(description: string) {
    this.snippetMap.forEach((value: string, key: number) => {
      const placeholder = this.createSnippetPlaceholder(key);
      description = description.replace(placeholder, value);
    });

    return description;
  }

  /**
   * Reset everything related to dealing with a call to this function
   * @param value
   */
  static resetDescriptionModificationContext() {
    this.isApplyDescriptionModificationContext = false;
    this.currentSnippetCount = 0;
    this.snippetMap.clear();
  }

  /**
   * Get the current set value for custom location context
   * @returns
   */
  static getCustomLocationContext(): CustomLocationContext | undefined {
    return this.currentCustomLocationContext;
  }

  /**
   * Set a custom location context
   * @param context
   */
  static setCustomLocationContext(context: CustomLocationContext): void {
    this.currentCustomLocationContext = context;
  }

  /**
   * Reset everything related to custom location contexts
   */
  static resetCustomLocationContext(): void {
    this.currentCustomLocationContext = undefined;
  }

  /**
   * Whether the user is currently on the agility page.
   * SOME page-specific LOGIC MAY RUN BEFORE THIS VARIABLE IS ACTUALLY CHANGED!
   * @returns
   */
  static isAgilityPage(): boolean {
    return game.openPage?.id === game.agility.id;
  }

  /**
   * Whether the user is currently on the astrology page.
   * SOME page-specific LOGIC MAY RUN BEFORE THIS VARIABLE IS ACTUALLY CHANGED!
   * @returns
   */
  static isAstrologyPage(): boolean {
    return game.openPage?.id === game.astrology.id;
  }

  /**
   * Whether the user is on a page that should always display icons
   * @returns
   */
  static isOnRelevantPage(): boolean {
    return this.isAgilityPage() || this.isAstrologyPage();
  }

  /**
   * Whether the logic is run at a location that should always display icons.
   * This can even include the {@link isOnRelevantPage}, as some logic on said page may be run before the page location is actually updated
   * @returns
   */
  static isRelevantLocation(): boolean {
    return this.currentCustomLocationContext === 'agility'
      || this.currentCustomLocationContext === 'astrology'
      || this.isOnRelevantPage();
  }
}