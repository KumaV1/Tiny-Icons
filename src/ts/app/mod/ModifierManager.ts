import { IconManager } from './IconManager';
import { ModifierIconPaths } from './ModifierIcons';

/**
 * Mod assembly.
 */
export class ModifierManagerInit {
  public static create(ctx: Modding.ModContext): ModifierManager {
    const iconPaths = this.createIconPaths(ctx.getResourceUrl);
    const iconManager = this.createIconManager(ctx, iconPaths);
    const modifierCtx = this.createModifierIconContext(ctx);
    const modifierEl = this.createModifierIconHandler(modifierCtx, iconManager);
    const patchManager = this.createPatchManager(ctx, modifierCtx, modifierEl);

    return new ModifierManager(
      ctx,
      iconManager,
      patchManager,
      modifierCtx,
      modifierEl
    );
  }

  private static createIconPaths(
    resourceUrl: Modding.ModContext['getResourceUrl']
  ): ModifierIconPaths {
    return new ModifierIconPaths(resourceUrl);
  }

  private static createIconManager(
    ctx: Modding.ModContext,
    paths: ModifierIconPaths
  ): IconManager {
    return new IconManager(ctx, paths);
  }

  private static createModifierIconContext(
    ctx: Modding.ModContext
  ): ModifierIconContext {
    return new ModifierIconContext(ctx.settings.section('Tiny Icons'));
  }

  private static createModifierIconHandler(
    modifierCtx: ModifierIconContext,
    iconManager: IconManager
  ): ModifierIconHandler {
    return new ModifierIconHandler(modifierCtx, iconManager);
  }

  private static createPatchManager(
    ctx: Modding.ModContext,
    modifierCtx: ModifierIconContext,
    modifierEl: ModifierIconHandler
  ): PatchManager {
    return new PatchManager(
      ctx.patch,
      modifierCtx,
      modifierEl,
      ctx.onInterfaceAvailable
    );
  }
}

class ModifierManager {
  constructor(
    private ctx: Modding.ModContext,
    private iconManager: IconManager,
    private patchManager: PatchManager,
    private modifierCtx: ModifierIconContext,
    private modifierEl: ModifierIconHandler
  ) {}

  public init(): void {
    this.iconManager.exposeAPI();
  }
}

/**
 * Manages the application of patches to the game's methods.
 */
class PatchManager {
  constructor(
    private patch: Modding.ModContext['patch'],
    private modifierCtx: ModifierIconContext,
    private modifierEl: ModifierIconHandler,
    private onInterfaceAvailable: Modding.ModContext['onInterfaceAvailable']
  ) {
    this.contextPatches(this);
    this.patchPotionItems(patch, this);
  }

  /**
   * A series of context-aware patches for various game methods. This method utilizes
   * `patchWithContext` to ensure `printPlayerModifier` is called with the correct context.
   *
   * @param {PatchManager} that - An instance of `PatchManager` to provide its methods to local functions.
   *
   * @remarks
   * - Patches for different game abilities and menus to capture context when and if to prepend icons to modifier text.
   * - Special handling for the "Show Locked Astrology Modifiers" mod.
   */
  private contextPatches(that: PatchManager) {
    this.patchWithContext(Agility, 'viewAllPassivesOnClick');
    this.patchWithContext(Astrology, 'viewAllModifiersOnClick');
    this.patchWithContext(Agility, 'displayBlueprintSwal');

    // Current open page as context
    this.patchWithContext(MappedModifiers, 'getActiveModifierDescriptions');

    // Agility obstacle modifiers, also calls getActiveMOdifierDescriptions
    this.patchWithContext(
      MappedModifiers,
      'getModifierDescriptionsAsNodes',
      () => 'Agility',
      undefined,
      (_, nodes: any[]) =>
        nodes.forEach((node) => that.modifierEl.processModifier(node))
    );

    this.patchWithContext(
      MapRefinementMenuElement,
      'updateRefinements',
      undefined,
      undefined,
      (self: MapRefinementMenuElement) => {
        self.refinements.forEach((refinement) => {
          that.modifierEl.processModifier(refinement);
        });
      }
    );

    this.patchWithContext(
      MapRefinementMenuElement,
      'updateNewRefinement',
      undefined,
      undefined,
      (self: MapRefinementMenuElement) => {
        self.refinementSelects.forEach((button) => {
          that.modifierEl.processModifier(button);
        });
      }
    );

    this.patchWithContext(
      AncientRelicsMenu,
      'selectSkill',
      (skill: AnySkill) => skill.localID
    );

    this.patchWithContext(
      AstrologyModifierDisplay,
      'setModifier',
      undefined,
      undefined,
      (self: AstrologyModifierDisplay) =>
        self.modifierText?.childNodes.forEach((node) =>
          that.modifierEl.processModifier(node as Element)
        )
    );

    // Patch for Show Locked Astrology Modifiers mod
    this.onInterfaceAvailable(() => {
      if (
        mod.manager
          .getLoadedModList()
          .includes('Show Locked Astrology Modifiers')
      )
        this.patchWithContext(Astrology, 'render', undefined, undefined, () =>
          // the mod recreates the locked modifiers on main render loop so we need to reprocess them each time
          astrologyMenus.explorePanel
            .querySelectorAll('.show-stars-div')
            .forEach((node) => that.modifierEl.processModifier(node))
        );
    });
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
  private patchWithContext(
    targetClass: ClassHandle,
    classMethod: string,
    contextFunction?: ((...args: any) => string) | undefined,
    beforeHook?: (...args: any) => any[] | void,
    afterHook?: (returnValue: any, ...args: any) => any | void
  ) {
    const that = this;
    this.patch(targetClass, classMethod).before(function (...args: any) {
      contextFunction
        ? that.modifierCtx.setContext(contextFunction(...args))
        : that.modifierCtx.setContext();

      if (beforeHook) beforeHook(...args);
      if (args) return args;
    });

    this.patch(targetClass, classMethod).after(function (
      returnValue: any,
      ...args: any
    ) {
      if (afterHook) afterHook(this, returnValue, ...args);
      that.modifierCtx.resetContext();
    });
  }

  /**
   * Patch for Agility and Astrology potions to always have tiny icons
   */
  private patchPotionItems(
    patch: Modding.ModContext['patch'],
    that: PatchManager
  ) {
    patch(PotionItem, 'description').get(function (o): any {
      if ([game.agility.id, game.astrology.id].includes(this.action.id)) {
        that.modifierCtx.setContext(
          this.action.id === game.agility.id ? 'Agility' : 'Astrology'
        );
        that.modifierCtx.potionRelevance = true;
        const desc = o();
        that.modifierCtx.resetContext();
        return desc;
      }

      that.modifierCtx.potionRelevance = false;
      return o();
    });
  }
}

/**
 * Handles the insertion and management of icons for game modifiers and their associated HTML text.
 */
class ModifierIconHandler {
  private static readonly TINY_ICON_TAGS =
    /<img class="skill-icon-xxs tiny-icon mb-1 mr-1"[^>]*>/g;

  constructor(
    private modifierContext: ModifierIconContext,
    private iconManager: IconManager
  ) {
    this.patchCreateElement();
    this.patchPrintPlayerModifier();
    this.patchGetPlainModifierDescriptions();
    this.patchApplyDescriptionModifications();
  }

  /**
   * Patch to use passed key and value to append relevant icons to the modifier text
   */
  private patchPrintPlayerModifier() {
    const originalPrintPlayerModifier = printPlayerModifier;
    window.printPlayerModifier = (
      key: any,
      value: any,
      precision?: number | undefined
    ): [string, string] => {
      // original [modifier text, text class]
      let originalReturn = originalPrintPlayerModifier(key, value, precision);
      if (
        this.modifierContext.globalIconsEnabled ||
        this.modifierContext.isAstrologyContext() ||
        this.modifierContext.isAgilityContext() ||
        this.modifierContext.isOnRelevantPage()
      ) {
        // Insert the relevant icon before the modifier text
        originalReturn = [
          this.iconManager.getIconHTML(key, value) + originalReturn[0],
          originalReturn[1],
        ];
      }
      return originalReturn;
    };
  }

  /**
   * Patch for item descriptions that have special formatting for status effects.
   * Process the modifier descriptions to remove non unique tiny icon tags.
   * This prevents duplicate icons from being displayed in the description.
   */
  private patchApplyDescriptionModifications() {
    const originalApplyDescriptionModifications =
      window.applyDescriptionModifications;
    window.applyDescriptionModifications = (desc): string => {
      if (setLang !== 'en') return desc;

      // Extract and remove all tiny-icon tags
      const cleanDesc = desc.replace(ModifierIconHandler.TINY_ICON_TAGS, '');

      // Process the clean description through the original function
      const modifiedDesc = originalApplyDescriptionModifications(cleanDesc);

      // Extract paths after `assets/` from all img src in modifiedDesc
      const uniqueSrcs = new Set<string>();
      const srcRegex = /<img[^>]*src="[^"]*assets\/([^"]+)"[^>]*>/g;
      let matches: RegExpExecArray | null;
      while ((matches = srcRegex.exec(modifiedDesc))) {
        uniqueSrcs.add(matches[1]);
      }

      //  Restore tiny-icons in the original description, unless they were already added by the original function
      const finalDesc = desc.replace(
        ModifierIconHandler.TINY_ICON_TAGS,
        (match) => {
          const srcMatch = match.match(/src="[^"]*assets\/([^"]+)"/);
          // Remove the tiny icon if it's already in the description and it's not unique
          return srcMatch && uniqueSrcs.has(srcMatch[1]) ? '' : match;
        }
      );

      // Pass the desc now with tiny icon tags (if any) that wont get mangled
      return originalApplyDescriptionModifications(finalDesc);
    };
  }

  /**
   * Patch to reset context in case it persists from Astrology or Agility
   * Context is used to determine which icons to display if global icons disabled
   * This prevents icons in prayers, items, tooltips, etc. when global icons disabled
   */
  private patchGetPlainModifierDescriptions() {
    const originalGetPlainModifierDescriptions =
      window.getPlainModifierDescriptions;
    window.getPlainModifierDescriptions = (modifiers): string[] => {
      // reset context in case it persists from Astrology or Agility
      if (!this.modifierContext.potionRelevance)
        this.modifierContext.resetContext();
      return originalGetPlainModifierDescriptions(modifiers);
    };
  }

  /**
   * Patch to process any element created with tiny icon img tags in textContent
   */
  private patchCreateElement() {
    const originalCreateElement = window.createElement;
    window.createElement = (tagName, options = {}): HTMLElement => {
      const originalElem = originalCreateElement(tagName, options);
      if (!originalElem.textContent?.includes('tiny-icon')) return originalElem;

      this.fixTextContentImgTag(originalElem);

      return originalElem;
    };
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
        for (const child of Array.from(current.children)) stack.push(child);
    }
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
  private relevantPotion: boolean = false;
  private currentContext: string | undefined = '';

  constructor(
    private settings: ReturnType<Modding.ModContext['settings']['section']>
  ) {}

  get globalIconsEnabled() {
    return this.settings.get('global-icons');
  }

  set potionRelevance(isRelevant: boolean) {
    this.relevantPotion = isRelevant;
  }
  get potionRelevance(): boolean {
    return this.relevantPotion;
  }

  setContext(context: string | undefined = undefined): void {
    this.currentContext = context ?? game.openPage?.localID;
  }

  resetContext(): void {
    this.currentContext = '';
  }

  isAstrologyContext(): boolean {
    return this.currentContext === 'Astrology';
  }

  isAgilityContext(): boolean {
    return this.currentContext === 'Agility';
  }

  isOnRelevantPage(): boolean {
    return ['Astrology', 'Agility'].includes(game.openPage?.localID || '');
  }
}
