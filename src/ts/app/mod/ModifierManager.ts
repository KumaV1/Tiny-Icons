import { IconManager } from './IconManager';
import { ModifierIconPaths } from './ModifierIcons';
import { ModifierScopeSourceMediaMemoizer } from './ModifierScopeSourceMediaMemoizer';
import { SettingsManager } from './SettingsManager';
import { CustomLocationContext } from './types/customLocationContext';

/**
 * Mod assembly.
 */
export class ModifierManagerInit {
  public static create(ctx: Modding.ModContext): ModifierManager {
    const iconPaths = this.createIconPaths(ctx);
    const iconManager = this.createIconManager(ctx, iconPaths);
    const modifierCtx = this.createModifierIconContext(ctx);
    const modifierEl = this.createModifierIconHandler(
      modifierCtx,
      iconManager,
      ctx,
    );
    // Currently doesn't need to do anything but initialize
    this.createPatchManager(ctx, modifierCtx, modifierEl);

    return new ModifierManager(
      iconManager
    );
  }

  private static createIconPaths(ctx: Modding.ModContext): ModifierIconPaths {
    return new ModifierIconPaths(ctx);
  }

  private static createIconManager(
    ctx: Modding.ModContext,
    paths: ModifierIconPaths,
  ): IconManager {
    return new IconManager(ctx, paths, new ModifierScopeSourceMediaMemoizer(ctx));
  }

  private static createModifierIconContext(
    ctx: Modding.ModContext,
  ): ModifierIconContext {
    return new ModifierIconContext();
  }

  private static createModifierIconHandler(
    modifierCtx: ModifierIconContext,
    iconManager: IconManager,
    modCtx: Modding.ModContext,
  ): ModifierIconHandler {
    return new ModifierIconHandler(modifierCtx, iconManager, modCtx);
  }

  private static createPatchManager(
    ctx: Modding.ModContext,
    modifierCtx: ModifierIconContext,
    modifierEl: ModifierIconHandler,
  ): PatchManager {
    return new PatchManager(ctx, modifierCtx, modifierEl);
  }
}

class ModifierManager {
  constructor(
    private iconManager: IconManager,
  ) { }

  public init(): void {
    this.iconManager.exposeAPI();
  }
}

/**
 * Manages the application of patches to the game's methods.
 */
class PatchManager {
  constructor(
    private ctx: Modding.ModContext,
    private modifierCtx: ModifierIconContext,
    private modifierEl: ModifierIconHandler,
  ) {
    this.contextPatches(this);
  }

  /**
   * A series of context-aware patches for various game methods. This method utilizes
   * `patchWithContext` to ensure `printPlayerModifier` is called with the correct context.
   *
   * @remarks
   * - Patches for different game abilities and menus to capture context when and if to prepend icons to modifier text.
   * - Special handling for the "Show Locked Astrology Modifiers" mod.
   */
  private contextPatches(that: PatchManager) {
    // If the character does not have global icons enabled, then we need to patch certain methods to set a custom context for enabling the icons at specific locations
    this.ctx.onCharacterLoaded(() => {
      if (!SettingsManager.settings.globalIconsEnabled) {
        this.ctx.patch(BuiltAgilityObstacleElement, 'updatePassives').before(function(obstacle: AgilityObstacle): void {
          that.modifierCtx.setCustomLocationContext('agility');
        });
        this.ctx.patch(BuiltAgilityObstacleElement, 'updatePassives').after(function(returnValue: void, obstacle: AgilityObstacle) {
          that.modifierCtx.resetCustomLocationContext();
        });

        this.ctx.patch(AstrologyModifierDisplayElement, 'setModifier').before(function(astroMod: AstrologyModifier, mult: number): void {
          that.modifierCtx.setCustomLocationContext('astrology');
        });
        this.ctx.patch(AstrologyModifierDisplayElement, 'setModifier').after(function(returnValue: void, astroMod: AstrologyModifier, mult: number) {
          that.modifierCtx.resetCustomLocationContext();
        });
      }
    });
  }
}

/**
 * Handles the insertion and management of icons for game modifiers and their associated HTML text.
 */
class ModifierIconHandler {
  constructor(
    private modifierContext: ModifierIconContext,
    private iconManager: IconManager,
    private ctx: Modding.ModContext,
  ) {
    this.patchForHtmlParsing(this);
    this.patchModifierDescription(this);
    this.patchApplyDescriptionModifications(this);
  }

  /**
   * Some elements may set `textContent`, causing icons to not be interpreted as such.
   * In some cases may set a custom location context, if further formatting is necessary
   * @param that
   */
  private patchForHtmlParsing(that: ModifierIconHandler) {
    that.ctx.patch(PrayerTooltipElement, 'setPrayer').before(function(prayer: ActivePrayer): void {
      that.modifierContext.setCustomLocationContext('prayerButtonTooltip');
    });

    that.ctx.patch(PrayerTooltipElement, 'setPrayer').after(function(returnValue: void, prayer: ActivePrayer) {
      // TODO: Preferably explicitly target the span, to put the images inside there?
      // Possibly fixes the placement, as first attempt probably set imgs as siblings, which with column direction caused the icons to appear above the text, rather than before it
      this.stats.innerHTML = this.stats.innerText; // there should be no inner elements, so innerHTML should be equal to innerText, but allows to force interpret the tiny icon elements as such

      that.modifierContext.resetCustomLocationContext();
    });

    that.ctx.patch(MapRefinementMenuElement, 'updateRefinements').after(function(returnValue: void, map: DigSiteMap) {
      const self = this;
      this.refinements.forEach((refinementEl: HTMLLIElement) => {
        refinementEl.innerHTML = refinementEl.innerText; // there should be no inner elements, so innerHTML should be equal to innerText, but allows to force interpret the tiny icon elements as such
      });
    });

    that.ctx.patch(MapRefinementMenuElement, 'updateNewRefinement').after(function(returnValue: void, map: DigSiteMap, cartography: Cartography, game: Game) {
      const self = this;
      this.refinementSelects.forEach((refinementEl: HTMLButtonElement) => {
        refinementEl.innerHTML = refinementEl.innerText; // there should be no inner elements, so innerHTML should be equal to innerText, but allows to force interpret the tiny icon elements as such
      });
    });
  }

  private patchModifierDescription(that: ModifierIconHandler) {
    that.ctx.patch(ModifierValue, 'getDescription').after(function (returnValue: {
      description: string;
      isNegative: boolean;
    }, negMult?: number, posMult?: number, precision?: number) {
      const printIcons = SettingsManager.settings.globalIconsEnabled
        || that.modifierContext.isRelevantLocation();
      if (!printIcons) {
        return returnValue;
      }

      const iconHtml = that.iconManager.getIconHTML(this, !returnValue.isNegative, true);


      // Set either original description with tiny icons either replaced by placeholders, or set directly
      let iconizedDescription = that.modifierContext.isDescriptionModificationContext()
        ? that.modifierContext.addDescriptionModificationsTinyIconsPlaceholders(returnValue.description, iconHtml)
        : iconHtml + returnValue.description;

      // Possibly adjust formatting of description further
      switch (that.modifierContext.getCustomLocationContext()) {
        case 'prayerButtonTooltip':
          // Wrap description in a span, so the icon and text are placed horizontal, not vertical (as in, wrap them into single child for container)
          iconizedDescription = `<span class="tiny-icons-prayer-bonus-wrapper-element">${iconizedDescription}</span>`;
          break;
        default:
          break; // No adjustments needed
      }

      // Finalize
      return {
          description: iconizedDescription,
          isNegative: returnValue.isNegative
      };
    });
  }

  /**
   * Patch for various locations that modify the generated description to include formatting like changing color or adding icons to certain keywords (primarily, but not exclusively, combat status effects).
   * Sets a context to delay and belatedly apply the tiny icons, as doing so as usual ({@link ModifierValue}) would break tiny icons, if the icon path contains said keywords.
   * This prevents duplicate icons from being displayed in the description.
   */
  private patchApplyDescriptionModifications(that: ModifierIconHandler) {
    that.ctx.patch(SpecialAttack, 'modifiedDescription').get(function(o: () => string) {
      if (this._modifiedDescription) {
        // if description has already been computed, then avoid running custom logic again
        return o();
      }

      // Set context
      that.modifierContext.setIsDescriptionModificationContext();

      // Run original logic
      let desc = o();

      // Belatedly modify description with tiny icons
      desc = that.modifierContext.applyTinyIconsPlaceholderReplacement(desc);

      // Reset context and finish up
      that.modifierContext.resetdescriptionModificationContext();
      return desc;
    });

    that.ctx.patch(Item, 'modifiedDescription').get(function(o: () => string) {
      return that.getModifiedDescription(this, o, that.modifierContext);
    });
    that.ctx.patch(FoodItem, 'modifiedDescription').get(function(o: () => string) {
      return that.getModifiedDescription(this, o, that.modifierContext);
    });
    that.ctx.patch(EquipmentItem, 'modifiedDescription').get(function(o: () => string) {
      return that.getModifiedDescription(this, o, that.modifierContext);
    });
    that.ctx.patch(PotionItem, 'modifiedDescription').get(function(o: () => string) {
      return that.getModifiedDescription(this, o, that.modifierContext);
    });

    that.ctx.patch(CombatPassive, 'modifiedDescription').get(function(o: () => string) {
      if (this._modifiedDescription) {
        // if description has already been computed, then avoid running custom logic again
        return o();
      }

      // Set context
      that.modifierContext.setIsDescriptionModificationContext();

      // Run original logic
      let desc = o();

      // Belatedly modify description with tiny icons
      desc = that.modifierContext.applyTinyIconsPlaceholderReplacement(desc);

      // Reset context and finish up
      that.modifierContext.resetdescriptionModificationContext();
      return desc;
    });
  }

  /**
   * Recursively process all modifier elements with tiny icon img tags in textContent
   */
  processModifier(el: HTMLElement | Element): void {
    const stack = [el];
    while (stack.length) {
      const current = stack.pop();
      // Process the current element
      this.fixTextContentImgTag(current as HTMLElement);
      if (current)
        // Add all children to the stack
        for (const child of Array.from(current.children)) {
          stack.push(child);
        }
    }
  }

  /**
   * Logic run in item patches (classes had to be patched separately, as the respective logics implementation specifically had to be patched)
   * @param item
   * @param origGetter
   * @param ctx
   * @returns
   */
  private getModifiedDescription(item: Item, origGetter: () => string, ctx: ModifierIconContext): string {
    if (item._modifiedDescription) {
      // if description has already been computed, then avoid running custom logic again
      return origGetter();
    }

    // Set context
    ctx.setIsDescriptionModificationContext();

    // Run original logic
    let desc = origGetter();

    // Belatedly modify description with tiny icons
    desc = ctx.applyTinyIconsPlaceholderReplacement(desc);

    // Reset context and finish up
    ctx.resetdescriptionModificationContext();
    item._modifiedDescription = desc; // otherwise it would contain the placeholders instead of the actual icons
    return desc;
  }

  /**
   * Fixes modifier where a tiny icon img tag was set as the text content
   * Extracts the tiny icon image tag and reinserts it as html to display the icon
   */
  private fixTextContentImgTag(node: HTMLElement): void {
    if (!node.textContent?.includes('tiny-icon')) return;

    const parser = new DOMParser();
    const docFragment = document.createDocumentFragment();

    // Split the text content by 'tiny-icon' and process each segment
    const segments = node.textContent.split(/(<img.*?tiny-icon.*?>)/g);

    for (const segment of segments) {
      if (segment.includes('tiny-icon')) {
        // Parse the string as HTML
        const parsedDocument = parser.parseFromString(segment, 'text/html');
        const imgElement = parsedDocument.body.firstChild;
        if (imgElement) {
          docFragment.appendChild(imgElement);
        }
      } else {
        const textNode = document.createTextNode(segment);
        docFragment.appendChild(textNode);
      }
    }

    // Clear the current content and append the new content
    node.textContent = '';
    node.appendChild(docFragment);
  }
}

/**
 * Manages context from where and when to print modifier icons with printPlayerModifier.
 */
class ModifierIconContext {
  /**
   * "applyDescriptionModification" is a function that, in the English language,
   * will modify certain keywords, to change their color and add their icon. For example, causing a simple "burn" to be displayed in red and adding a fire icon.
   * However, that logic does not differentiate where that text is located in the description, breaking tiny icons with those keywords in their names.
   * Because of that, when running into logic calling that method, we need to delay adding the tiny icons to after this function was called
   */
  private isApplyDescriptionModificationContext: boolean = false;

  /**
   * Remember how many times icon snippets are created for a single over-arching description (e.g. an item description with MULTIPLE modifier values)
   */
  private currentSnippetCount: number = 0;

  /**
   * Map the placeholder snippet index with the corresponding html snippet to replace them with later
   */
  private snippetMap: Map<number, string> = new Map();

  /**
   * A custom location context, used to in some cases be able to tell where modifier description creation is rendered,
   * as there are some cases where logic is run before the "page context" is adjusted (e.g. rendering agility page elements, before actually setting the current page to agility)
   */
  private currentCustomLocationContext: CustomLocationContext | undefined;

  constructor() { }

  /**
   * Create placeholder, which includes an index to separate the different ones
   * @param index
   * @returns
   */
  private createSnippetPlaceholder(index: number): string {
    return `{TI_IC_SN_${index}}`;
  }

  /**
   * Set the info that we are running logic that will run this function
   * @param value
   */
  setIsDescriptionModificationContext() {
    this.isApplyDescriptionModificationContext = true;
  }

  /**
   * Get whether we are currently in a situation that will call this method
   * @param value
   */
  isDescriptionModificationContext(): boolean {
    return this.isApplyDescriptionModificationContext;
  }

  /**
   *
   * @param description {@link ModifierValue} description
   * @param iconHtml The icon html we will (later) want to set
   * @returns The {@link ModifierValue} description with a placeholder added that can later be replaced
   */
  addDescriptionModificationsTinyIconsPlaceholders(description: string, iconHtml: string): string {
    this.currentSnippetCount++;
    this.snippetMap.set(this.currentSnippetCount, iconHtml);

    const placeholder = this.createSnippetPlaceholder(this.currentSnippetCount);
    return `${placeholder}${description}`;
  }

  /**
   * Replaces the previously added placeholders with the corresponding html snippets
   * @param description
   */
  applyTinyIconsPlaceholderReplacement(description: string) {
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
  resetdescriptionModificationContext() {
    this.isApplyDescriptionModificationContext = false;
    this.currentSnippetCount = 0;
    this.snippetMap.clear();
  }

  /**
   * Get the current set value for custom location context
   * @returns
   */
  getCustomLocationContext(): CustomLocationContext | undefined {
    return this.currentCustomLocationContext;
  }

  /**
   * Set a custom location context
   * @param context
   */
  setCustomLocationContext(context: CustomLocationContext): void {
    this.currentCustomLocationContext = context;
  }

  /**
   * Reset everything related to custom location contexts
   */
  resetCustomLocationContext(): void {
    this.currentCustomLocationContext = undefined;
  }

  /**
   * Whether the user is currently on the agility page.
   * SOME page-specific LOGIC MAY RUN BEFORE THIS VARIABLE IS ACTUALLY CHANGED!
   * @returns
   */
  isAgilityPage(): boolean {
    return game.openPage?.id === game.agility.id;
  }

  /**
   * Whether the user is currently on the astrology page.
   * SOME page-specific LOGIC MAY RUN BEFORE THIS VARIABLE IS ACTUALLY CHANGED!
   * @returns
   */
  isAstrologyPage(): boolean {
    return game.openPage?.id === game.astrology.id;
  }

  /**
   * Whether the user is on a page that should always display icons
   * @returns
   */
  isOnRelevantPage(): boolean {
    return this.isAgilityPage() || this.isAstrologyPage();
  }

  /**
   * Whether the logic is run at a location that should always display icons.
   * This can even include the {@link isOnRelevantPage}, as some logic on said page may be run before the page location is actually updated
   * @returns
   */
  isRelevantLocation(): boolean {
    return this.currentCustomLocationContext === 'agility'
      || this.currentCustomLocationContext === 'astrology'
      || this.isOnRelevantPage();
  }
}