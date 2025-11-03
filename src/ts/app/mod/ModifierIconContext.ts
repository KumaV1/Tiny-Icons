import { CustomLocationContext } from "./types/customLocationContext";

/**
 * Manages context from where and when to print modifier icons with printPlayerModifier.
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