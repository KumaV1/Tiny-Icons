import { IconManager } from './IconManager';
import { ModifierIconPaths } from './ModifierIcons';
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
    const patchManager = this.createPatchManager(ctx, modifierCtx, modifierEl);

    return new ModifierManager(
      ctx,
      iconManager,
      patchManager,
      modifierCtx,
      modifierEl,
    );
  }

  private static createIconPaths(ctx: Modding.ModContext): ModifierIconPaths {
    return new ModifierIconPaths(ctx);
  }

  private static createIconManager(
    ctx: Modding.ModContext,
    paths: ModifierIconPaths,
  ): IconManager {
    return new IconManager(ctx, paths);
  }

  private static createModifierIconContext(
    ctx: Modding.ModContext,
  ): ModifierIconContext {
    return new ModifierIconContext(ctx.settings.section('Tiny Icons'));
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
    private ctx: Modding.ModContext,
    private iconManager: IconManager,
    private patchManager: PatchManager,
    private modifierCtx: ModifierIconContext,
    private modifierEl: ModifierIconHandler,
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
    //this.patchPotionItems(patch, this);
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
    //this.patchWithContext(Agility, 'viewAllPassivesOnClick');
    //this.patchWithContext(Astrology, 'viewAllModifiersOnClick');
    //this.patchWithContext(Agility, 'displayBlueprintSwal');

    // If the character does not have global icons enabled, then we need to patch certain methods to set a custom context for enabling the icons at specific locations
    this.ctx.onCharacterLoaded(() => {
      if (!that.modifierCtx.globalIconsEnabled) {
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
    })


    // Current open page as context
    //this.patchWithContext(MappedModifiers, 'getActiveModifierDescriptions');

    //this.patchWithContext(
    //  MapRefinementMenuElement,
    //  'updateRefinements',
    //  undefined,
    //  undefined,
    //  (self: MapRefinementMenuElement) =>
    //    self.refinements.forEach((refinement) =>
    //      that.modifierEl.processModifier(refinement),
    //    ),
    //);
    //
    //this.patchWithContext(
    //  MapRefinementMenuElement,
    //  'updateNewRefinement',
    //  undefined,
    //  undefined,
    //  (self: MapRefinementMenuElement) =>
    //    self.refinementSelects.forEach((button) =>
    //      that.modifierEl.processModifier(button),
    //    ),
    //);
    //
    //this.patchWithContext(
    //  AncientRelicsMenu,
    //  'selectSkill',
    //  (skill: AnySkill) => skill.localID,
    //);
  }

  /**
   * Patches a method within a target class, providing hooks for before and after
   * the method execution, and optionally sets a context based on the method's arguments.
   *
   * @param {ClassHandle} targetClass - The class containing the method to be patched.
   * @param {string} classMethod - The name of the method to be patched.
   * @param {Function} [contextFunction] - Optional function to derive context from the method's arguments.
   * @param {Function} [beforeHook] - Optional function to be executed before the method.
   * @param {Function} [afterHook] - Optional function to be executed after the method.
   */
  //private patchWithContext(
  //  targetClass: ClassHandle,
  //  classMethod: string,
  //  contextFunction?: ((...args: any) => string) | undefined,
  //  beforeHook?: (...args: any) => any[] | void,
  //  afterHook?: (returnValue: any, ...args: any) => any | void,
  //) {
  //  const that = this;
  //  this.patch(targetClass, classMethod).before(function (...args: any) {
  //    contextFunction
  //      ? that.modifierCtx.setCustomLocationContext(contextFunction(...args))
  //      : that.modifierCtx.setCustomLocationContext();
//
  //    if (beforeHook) beforeHook(...args);
  //    if (args) return args;
  //  });
//
  //  this.patch(targetClass, classMethod).after(function (
  //    returnValue: any,
  //    ...args: any
  //  ) {
  //    if (afterHook) afterHook(this, returnValue, ...args);
  //    that.modifierCtx.resetCustomLocationContext();
  //  });
  //}

  /**
   * Patch for Agility and Astrology potions to always have tiny icons
   * TODO: Apparently a "PotionItem" includes the action it applies to, so may add this one back.
   * ^ That being said, the description also mentiones the skill it applies to, so maybe less important now?
   */
  //private patchPotionItems(
  //  patch: Modding.ModContext['patch'],
  //  that: PatchManager,
  //) {
  //  patch(PotionItem, 'description').get(function (o): any {
  //    if ([game.agility.id, game.astrology.id].includes(this.action.id)) {
  //      that.modifierCtx.setCustomLocationContext(
  //        this.action.id === game.agility.id ? 'Agility' : 'Astrology',
  //      );
  //      that.modifierCtx.potionRelevance = true;
  //      const desc = o();
  //      that.modifierCtx.resetCustomLocationContext();
  //      return desc;
  //    }
  //
  //    that.modifierCtx.potionRelevance = false;
  //    return o();
  //  });
  //}
}

/**
 * Handles the insertion and management of icons for game modifiers and their associated HTML text.
 */
class ModifierIconHandler {
  private static readonly TINY_ICON_TAGS =
    /<img class="skill-icon-xxs tiny-icon mb-1 mr-1"[^>]*>/g;

  constructor(
    private modifierContext: ModifierIconContext,
    private iconManager: IconManager,
    private ctx: Modding.ModContext,
  ) {
    this.patchModifierDescription(this);
    this.patchApplyDescriptionModifications(this);
    //this.ctx.onInterfaceAvailable(() => {
    //  this.patchCreateElement();
    //  this.patchPrintPlayerModifier();
    //  this.patchGetPlainModifierDescriptions();
    //});
  }

  /**
   * Patch to use passed key and value to append relevant icons to the modifier text
   */
  //private patchPrintPlayerModifier() {
  //  const originalPrintPlayerModifier = printPlayerModifier;
  //  window.printPlayerModifier = (
  //    key: any,
  //    value: any,
  //    precision?: number | undefined,
  //  ): [string, string] => {
  //    // original [modifier text, text class]
  //    let originalReturn = originalPrintPlayerModifier(key, value, precision);
  //    if (
  //      this.modifierContext.globalIconsEnabled ||
  //      this.modifierContext.isAstrologyContext() ||
  //      this.modifierContext.isAgilityContext() ||
  //      this.modifierContext.isOnRelevantPage()
  //    ) {
  //      // Insert the relevant icon before the modifier text
  //      originalReturn = [
  //        this.iconManager.getIconHTML(key, value) + originalReturn[0],
  //        originalReturn[1],
  //      ];
  //    }
  //    return originalReturn;
  //  };
  //}

  private patchModifierDescription(that: ModifierIconHandler) {
    that.ctx.patch(ModifierValue, 'getDescription').after(function (returnValue: {
      description: string;
      isNegative: boolean;
    }, negMult?: number, posMult?: number, precision?: number) {
      const printIcons = that.modifierContext.globalIconsEnabled
        || that.modifierContext.isRelevantLocation();
      if (!printIcons) {
        return returnValue;
      }

      const iconHtml = that.iconManager.getIconHTML(this, !returnValue.isNegative, true);

      // Depending on whether this logic is called at a location that will lead to the description being modified,
      // return the original description with tiny icons either replaced by placeholders, or set directly
      return that.modifierContext.isDescriptionModificationContext()
        ? {
          description: that.modifierContext.addDescriptionModificationsTinyIconsPlaceholders(returnValue.description, iconHtml),
          isNegative: returnValue.isNegative
        }
        : {
          description: iconHtml + returnValue.description,
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

    //const originalApplyDescriptionModifications =
    //  window.applyDescriptionModifications;
    //  window.applyDescriptionModifications = (desc): string => {
    //  if (setLang !== 'en') return desc;
  //
    //  // Extract and remove all tiny-icon tags
    //  const cleanDesc = desc.replace(ModifierIconHandler.TINY_ICON_TAGS, '');
  //
    //  // Process the clean description through the original function
    //  const modifiedDesc = originalApplyDescriptionModifications(cleanDesc);
  //
    //  // Extract paths after `assets/` from all img src in modifiedDesc
    //  const uniqueSources = new Set<string>();
    //  const srcRegex = /<img[^>]*src="[^"]*assets\/([^"]+)"[^>]*>/g;
    //  let matches: RegExpExecArray | null;
    //  while ((matches = srcRegex.exec(modifiedDesc))) {
    //    uniqueSources.add(matches[1]);
    //  }
  //
    //  //  Restore tiny-icons in the original description, unless they were already added by the original function
    //  const finalDesc = desc.replace(
    //    ModifierIconHandler.TINY_ICON_TAGS,
    //    (match) => {
    //      const srcMatch = match.match(/src="[^"]*assets\/([^"]+)"/);
    //      // Remove the tiny icon if it's already in the description and it's not unique
    //      return srcMatch && uniqueSources.has(srcMatch[1]) ? '' : match;
    //    },
    //  );
  //
    //  // Pass the desc now with tiny icon tags (if any) that wont get mangled
    //  return originalApplyDescriptionModifications(finalDesc);
    //};
  }

  /**
   * Runs some custom logic, so getters calling do not break tiny icons
   * @param getter the getter about to call "applyDescriptionModification"
   */
  //private applyDescriptionModificationCustom(getter: () => string) {
  //  if (setLang !== 'en') {
  //    return getter(); // the game only runs this logic for english language, so we should also limit this
  //  }
//
  //  // Extract and remove all tiny-icon tags
  //  const cleanDesc = desc.replace(ModifierIconHandler.TINY_ICON_TAGS, '');
  //}

  /**
   * Patch to reset context in case it persists from Astrology or Agility
   * Context is used to determine which icons to display if global icons disabled
   * This prevents icons in prayers, items, tooltips, etc. when global icons disabled
   */
  //private patchGetPlainModifierDescriptions() {
  //  const originalGetPlainModifierDescriptions =
  //    window.getPlainModifierDescriptions;
  //  window.getPlainModifierDescriptions = (modifiers): string[] => {
  //    // reset context in case it persists from Astrology or Agility
  //    if (!this.modifierContext.potionRelevance)
  //      this.modifierContext.resetCustomLocationContext();
  //    return originalGetPlainModifierDescriptions(modifiers);
  //  };
  //}
  //
  ///**
  // * Patch to process any element created with tiny icon img tags in textContent
  // */
  //private patchCreateElement() {
  //  const originalCreateElement = window.createElement;
  //  window.createElement = (tagName, options = {}): HTMLElement => {
  //    const originalElem = originalCreateElement(tagName, options);
  //    if (!originalElem.textContent?.includes('tiny-icon')) return originalElem;
  //
  //    this.fixTextContentImgTag(originalElem);
  //
  //    return originalElem;
  //  };
  //}

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
        for (const child of Array.from(current.children)) stack.push(child);
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
    if (!item._modifiedDescription) {
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
  //private relevantPotion: boolean = false;

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

  constructor(
    private settings: ReturnType<Modding.ModContext['settings']['section']>,
  ) { }

  get globalIconsEnabled(): boolean {
    return this.settings.get('global-icons') as boolean; // TODO: Move to settings manager
  }

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

  //set potionRelevance(isRelevant: boolean) {
  //  this.relevantPotion = isRelevant;
  //}
  //get potionRelevance(): boolean {
  //  return this.relevantPotion;
  //}

  setCustomLocationContext(context: CustomLocationContext): void {
    this.currentCustomLocationContext = context;
  }

  resetCustomLocationContext(): void {
    this.currentCustomLocationContext = undefined;
  }

  isAgilityPage(): boolean {
    return game.openPage?.id === game.agility.id;
  }

  isAstrologyPage(): boolean {
    return game.openPage?.id === game.astrology.id;
  }

  //isAstrologyContext(): boolean {
  //  return this.currentContext === 'Astrology';
  //}
  //
  //isAgilityContext(): boolean {
  //  return this.currentContext === 'Agility';
  //}

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