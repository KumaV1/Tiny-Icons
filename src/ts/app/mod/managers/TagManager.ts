import { PathType } from "../types/pathType";

export class TagManager {

  /**
   * Base-implemented tags.
   * NOTE: This is NOT the actual tag storage that will be used during runtime!
   * NOTE2: Only public so the "StaticModifierIconTag" type could be created
   * NOTE3: Properties are set as functions, so the call can be delayed to AFTER the mod context is set up
   * NOTE4: Some of the paths can only be interpreted with certain expansions. The paths are set accordingly based on the assumption that said tags are only used on modifiers used with those expansions (e.g. barrier only being used with AoD, laceration only being used with ItA)
   */
  public static staticTagsByCategories = {
    /* Todo
      abyssal_magic: () => TagManager.iconPath('mods', 'placeholder_icon', undefined, 'png'),
      brume_magic: () => TagManager.iconPath('mods', 'placeholder_icon', undefined, 'png'),
      gloom_magic: () => TagManager.iconPath('mods', 'placeholder_icon', undefined, 'png'),
      wither_magic: () => TagManager.iconPath('mods', 'placeholder_icon', undefined, 'png'),
      nether_magic: () => TagManager.iconPath('mods', 'placeholder_icon', undefined, 'png'),
    */
    itemIcons: {
      air_rune: () => TagManager.iconPath('bank', 'rune_air'),
      bones: () => TagManager.iconPath('bank', 'bones'),
      ash: () => TagManager.iconPath('bank', 'ashes'),
      bird_nest: () => TagManager.iconPath('bank', 'bird_nest'),
      clothing: () => TagManager.iconPath('bank', 'armour_leather_body'),
      coal: () => TagManager.iconPath('bank', 'ore_coal'),
      dark_blade: () => TagManager.iconPath('bank', 'Dark_Blade_Defender'),
      despair: () => TagManager.iconPath('bank', 'Mask_of_Despair'),
      diamond: () => TagManager.iconPath('bank', 'diamond'),
      earth_rune: () => TagManager.iconPath('bank', 'rune_earth'),
      fire_rune: () => TagManager.iconPath('bank', 'rune_fire'),
      food: () => TagManager.iconPath('bank', 'beef'),
      golden_stardust: () => TagManager.iconPath('bank', 'golden_stardust'),
      herb: () => TagManager.iconPath('bank', 'herb_garum'),
      holy_dust: () => TagManager.iconPath('bank', 'holy_dust'),
      iron_bar: () => TagManager.iconPath('bank', 'iron_bar'),
      leather: () => TagManager.iconPath('bank', 'leather'),
      loot: () => TagManager.iconPath('bank', 'alchemists_bag'),
      madness: () => TagManager.iconPath('bank', 'Mask_of_Madness'),
      meteorite: () => TagManager.iconPath('skills', 'astrology', 'meteorite'),
      mushroom: () => TagManager.iconPath('bank', 'mushroom'),
      //ore: () => TagManager.iconPath('skills', 'mining', 'rock_iron'),
      //abyssal_ore: () => TagManager.iconPath()
      ore: () => TagManager.iconPath('bank', 'pile_of_ores', undefined, 'png'),
      //abyssal_ore: () => TagManager.iconPath(), // TODO: Give more fitting icon (without throwing an error when user does not have ItA)
      gem: () => TagManager.iconPath('bank', 'diamond'),
      //abyssal_gem: () => TagManager.iconPath(), // TODO: Give more fitting icon (without throwing an error when user does not have ItA)
      //abyssal_outcrop: () => TagManager.iconPath(), // TODO: Give more fitting icon (without throwing an error when user does not have ItA)
      //abyssal_essence: () => TagManager.iconPath('bank', 'rune_essence'),
      rune_essence: () => TagManager.iconPath('bank', 'rune_essence'),
      seed: () => TagManager.iconPath('bank', 'seeds_potato'),
      stardust: () => TagManager.iconPath('bank', 'stardust'),
      torment: () => TagManager.iconPath('bank', 'Mask_of_Torment'),
      water_rune: () => TagManager.iconPath('bank', 'rune_water'),
      soup: () => TagManager.iconPath('bank', 'basic_soup', undefined, 'png'),
      arrow_tips: () => TagManager.iconPath('bank', 'arrowtips_bronze', undefined, 'png'),
      javelin_heads: () => TagManager.iconPath('bank', 'bronze_javelin_heads', undefined, 'png'),
      crossbow_heads: () => TagManager.iconPath('bank', 'crossbow_head_bronze', undefined, 'png'),
      //abyssal_arrow_tips: () => TagManager.iconPath(), // TODO: Give more fitting icon (without throwing an error when user does not have ItA)
      //abyssal_javelin_heads: () => TagManager.iconPath(), // TODO: Give more fitting icon (without throwing an error when user does not have ItA)
      arrows: () => TagManager.iconPath('bank', 'ammo_arrow_bronze', undefined, 'png'),
      bolts: () => TagManager.iconPath('bank', 'ammo_bolt_sapphire', undefined, 'png'),
      javelins: () => TagManager.iconPath('bank', 'weapon_javelin_bronze', undefined, 'png'),
      unstrung_bows: () => TagManager.iconPath('bank', 'longbow_normal_u', undefined, 'png'),
      jewelry: () => TagManager.iconPath('bank', 'necklace_gold_topaz', undefined, 'png'),
      staves: () => TagManager.iconPath('bank', 'Basic_Staff', undefined, 'png'),
      //abyssal_staves: () => TagManager.iconPath(), // TODO: Give more fitting icon (without throwing an error when user does not have ItA)
      wands: () => TagManager.iconPath('bank', 'weapon_wand_elite', undefined, 'png'),
      //abyssal_jewelry: () => TagManager.iconPath(), // TODO: Give more fitting icon (without throwing an error when user does not have ItA)
      nature_wrath_staff: () => TagManager.iconPath('bank', 'natures_wrath_staff', undefined, 'png'),
      poison_staff: () => TagManager.iconPath('bank', 'poison_staff', undefined, 'png'),
      infernal_staff: () => TagManager.iconPath('bank', 'infernal_staff', undefined, 'png'),
      lighting_staff: () => TagManager.iconPath('bank', 'lightning_staff', undefined, 'png'),
    },
    generalIcons: {
      ancient_relics: () => TagManager.iconPath(
        'main',
        'gamemode_ancient_relic',
        undefined,
        'png',
      ),
      aurora: () => TagManager.iconPath('skills', 'combat', 'auroras'),
      autoeat: () => TagManager.iconPath('shop', 'autoeat'),
      bank: () => TagManager.iconPath('main', 'bank_header'),
      barrier: () => TagManager.iconPath('skills', 'combat', 'barrier'),
      book: () => TagManager.iconPath('main', 'Book1', undefined, 'png'),
      coins: () => TagManager.iconPath('main', 'coins'),
      consumable: () => TagManager.iconPath('bank', 'consumable'),
      curse: () => TagManager.iconPath('skills', 'combat', 'curses'),
      dig: () => TagManager.iconPath('skills', 'archaeology', 'digsites'),
      double: () => TagManager.iconPath('main', 'double'),
      dungeon: () => TagManager.iconPath('skills', 'combat', 'dungeon'),
      stronghold: () => TagManager.iconPath('skills', 'combat', 'strongholds'),
      equip_set: () => TagManager.iconPath('shop', 'equipment_set'),
      equip_swap: () => TagManager.iconPath('shop', 'equipment_swap'),
      special_attack: () => TagManager.iconPath('main', 'special_attack'),
      golbin: () => TagManager.iconPath('pets', 'golden_golbin'),
      currency: () => TagManager.iconPath('ti', 'currency_generic', 'flaticon', 'png'),
      //food: () => TagManager.iconPath('bank', 'crate_of_food', undefined, 'png'),
      gp: () => TagManager.iconPath('main', 'coins'),
      interval: () => TagManager.iconPath('main', 'timer'),
      item_alchemy: () => TagManager.iconPath('skills', 'magic', 'item_alchemy'),
      lemon: () => 'assets/april/images/lemon.jpg',
      map: () => TagManager.iconPath('skills', 'archaeology', 'map_colour'),
      mastery: () => TagManager.iconPath('main', 'mastery_header'),
      placeholder: () => TagManager.iconPath('mods', 'placeholder_icon', undefined, 'png'),
      mods: () => TagManager.iconPath('mods', 'placeholder_icon', undefined, 'png'),
      pet: () => TagManager.iconPath('pets', 'bandit_base'),
      potion: () => TagManager.iconPath('skills', 'herblore', 'potion_empty'),
      preservation: () => TagManager.iconPath('main', 'preservation'),
      shop: () => TagManager.iconPath('main', 'shop_header'),
      slayer_coins: () => TagManager.iconPath('main', 'slayer_coins'),
      unholy: () => TagManager.iconPath('skills', 'prayer', 'unholy_prayer'),
      xp: () => TagManager.iconPath('main', 'xp'),
      accuracy: () => TagManager.iconPath('ti', 'accuracy', 'flaticon', 'png'),
      immunity: () => TagManager.iconPath('ti', 'immunity', 'flaticon', 'png'),
      crit: () => TagManager.iconPath('ti', 'critical', 'flaticon', 'png'),
      reflect: () => TagManager.iconPath('ti', 'shield_reflect', 'flaticon'),
    },
    effectMedia: {
      nulled: () => TagManager.iconPath('status', 'null', undefined, 'png'),
      revive: () => TagManager.iconPath('ti', 'revive', 'flaticon', 'png'),
      regen: () => TagManager.iconPath('skills', 'magic', 'fervor_ii', 'png'),
      lifesteal: () => TagManager.iconPath('ti', 'fang', 'flaticon', 'png'),//TagManager.iconPath('skills', 'hitpoints'), // TODO: Find/Create a better icon
      afflicted: () => TagManager.iconPath('misc', 'afflicted'),
      crystal_sanction: () => TagManager.iconPath('status', 'crystal_sanction'),
      crystallize: () => TagManager.iconPath('status', 'crystallized'),
      decay: () => TagManager.iconPath('skills', 'magic', 'decay'),
      despair: () => TagManager.iconPath('bank', 'Mask_of_Despair'),
      evasion_dn: () => TagManager.iconPath('status', 'evasion_decrease'),
      evasion_up: () => TagManager.iconPath('status', 'evasion_increase'),
      frost_burn: () => TagManager.iconPath('status', 'frostburn'),
      frozen: () => TagManager.iconPath('status', 'frozen'),
      madness: () => TagManager.iconPath('bank', 'Mask_of_Madness'),
      mark_of_death: () => TagManager.iconPath('misc', 'mark_of_death'),
      offense_dn: () => TagManager.iconPath('status', 'attack_decrease'),
      offense_up: () => TagManager.iconPath('status', 'attack_increase'),
      shock: () => TagManager.iconPath('status', 'shocked'),
      sleep: () => TagManager.iconPath('status', 'sleep'),
      slowed: () => TagManager.iconPath('status', 'slowed'),
      speedup: () => TagManager.iconPath('status', 'speedup'),
      stun_immunity: () => TagManager.iconPath('status', 'stun_immunity'),
      stun: () => TagManager.iconPath('status', 'stunned'),
      torment: () => TagManager.iconPath('bank', 'Mask_of_Torment'),
      voidburst: () => TagManager.iconPath('status', 'voidburst', undefined, 'png')
    },
    dotMedia: {
      barrier_bleed: () => TagManager.iconPath('misc', 'blood'),
      barrier_burn: () => TagManager.iconPath('main', 'burn'),
      barrier_regen: () => TagManager.iconPath('skills', 'combat', 'barrier'), // TODO: Find/Create a better icon
      bleed: () => TagManager.iconPath('misc', 'blood'),
      burn: () => TagManager.iconPath('main', 'burn'),
      ablaze: () => TagManager.iconPath('main', 'burn'),
      deadly_poison: () => TagManager.iconPath('status', 'poison'),
      poison: () => TagManager.iconPath('status', 'poison'),
      toxin: () => TagManager.iconPath('status', 'poison'),
      laceration: () => TagManager.iconPath('status', 'laceration', undefined, 'png'),
      //regen: () => TagManager.iconPath('status', 'regen_increase'),
    },
    skillMedia: {
      redemption: () => TagManager.iconPath('skills', 'prayer', 'redemption', 'png'),
      air_strike: () => TagManager.iconPath('skills', 'magic', 'wind_strike'),
      water_strike: () => TagManager.iconPath('skills', 'magic', 'water_strike'),
      earth_strike: () => TagManager.iconPath('skills', 'magic', 'earth_strike'),
      fire_strike: () => TagManager.iconPath('skills', 'magic', 'fire_strike'),
      air_bolt: () => TagManager.iconPath('skills', 'magic', 'wind_bolt'),
      air_blast: () => TagManager.iconPath('skills', 'magic', 'wind_blast'),
      air_wave: () => TagManager.iconPath('skills', 'magic', 'wind_wave'),
      air_surge: () => TagManager.iconPath('skills', 'magic', 'wind_surge'),
      meteor_shower: () => TagManager.iconPath('skills', 'magic', 'meteor_shower', 'png'),
      arch_brush: () => TagManager.iconPath('skills', 'archaeology', 'brush'),
      arch_shovel: () => TagManager.iconPath('skills', 'archaeology', 'shovel'),
      arch_sieve: () => TagManager.iconPath('skills', 'archaeology', 'sieve'),
      arch_trowel: () => TagManager.iconPath('skills', 'archaeology', 'trowel'),
      archaic: () => TagManager.iconPath('skills', 'magic', 'archaic_book'),
      auto_slayer: () => TagManager.iconPath('shop', 'auto_slayer'),
      building: () => TagManager.iconPath('skills', 'township', 'menu_town'),
      confusion: () => TagManager.iconPath('skills', 'magic', 'confusion'),
      decay: () => TagManager.iconPath('skills', 'magic', 'decay'),
      protect_item: () => TagManager.iconPath('skills', 'prayer', 'protect_item'),
      spellbook: () => TagManager.iconPath('skills', 'combat', 'spellbook'),
      surge: () => TagManager.iconPath('skills', 'magic', 'wind_surge'),
      ti_attack_interval: () => TagManager.iconPath('ti', 'attack_interval'),
      ti_combat_dn: () => TagManager.iconPath('ti', 'combat_dn'),
      ti_combat_up: () => TagManager.iconPath('ti', 'combat_up'),
      ti_dr_dn: () => TagManager.iconPath('ti', 'dr_dn'),
      ti_dr_up: () => TagManager.iconPath('ti', 'dr_up'),
      ti_magic_dn: () => TagManager.iconPath('ti', 'magic_dn'),
      ti_magic_up: () => TagManager.iconPath('ti', 'magic_up'),
      ti_ranged_dn: () => TagManager.iconPath('ti', 'ranged_dn'),
      ti_ranged_up: () => TagManager.iconPath('ti', 'ranged_up'),
      ti_strength_dn: () => TagManager.iconPath('ti', 'strength_dn'),
      ti_strength_up: () => TagManager.iconPath('ti', 'strength_up'),
      ts_bar: () => TagManager.iconPath('bank', 'iron_bar'),
      ts_biome_arid_plains: () => TagManager.iconPath(
        'skills',
        'township',
        'arid_plains',
        'png',
      ),
      ts_biome_desert: () => TagManager.iconPath('skills', 'township', 'desert', 'png'),
      ts_biome_forest: () => TagManager.iconPath('skills', 'township', 'forest', 'png'),
      ts_biome_grasslands: () => TagManager.iconPath(
        'skills',
        'township',
        'grasslands',
        'png',
      ),
      ts_biome_jungle: () => TagManager.iconPath('skills', 'township', 'jungle', 'png'),
      ts_biome_mountains: () => TagManager.iconPath(
        'skills',
        'township',
        'mountains',
        'png',
      ),
      ts_biome_snowlands: () => TagManager.iconPath(
        'skills',
        'township',
        'snowlands',
        'png',
      ),
      ts_biome_swamp: () => TagManager.iconPath('skills', 'township', 'swamp', 'png'),
      ts_biome_valley: () => TagManager.iconPath('skills', 'township', 'valley', 'png'),
      ts_biome_water: () => TagManager.iconPath('skills', 'township', 'water', 'png'),
      ts_clothing: () => TagManager.iconPath('bank', 'armour_leather_body'),
      ts_coal: () => TagManager.iconPath('skills', 'township', 'coal'),
      ts_education: () => TagManager.iconPath('skills', 'township', 'education'),
      ts_food: () => TagManager.iconPath('bank', 'raw_beef'),
      ts_happiness: () => TagManager.iconPath('skills', 'township', 'happiness'),
      ts_health: () => TagManager.iconPath('skills', 'township', 'health'),
      ts_herb: () => TagManager.iconPath('bank', 'herb_garum'),
      ts_leather: () => TagManager.iconPath('bank', 'leather'),
      ts_ore: () => TagManager.iconPath('skills', 'mining', 'rock_iron'),
      ts_planks: () => TagManager.iconPath('skills', 'township', 'planks'),
      ts_population: () => TagManager.iconPath('skills', 'township', 'population'),
      ts_potion: () => TagManager.iconPath('skills', 'township', 'potion'),
      ts_repair: () => TagManager.iconPath('fa', 'hammer'),
      ts_rune: () => TagManager.iconPath('bank', 'rune_essence'),
      ts_season_eclipse: () => TagManager.iconPath('skills', 'township', 'eclipse', 'png'),
      ts_season_nightfall: () => TagManager.iconPath(
        'skills',
        'township',
        'nightfall',
        'png',
      ),
      ts_season_eternal_darkness: () => TagManager.iconPath('skills', 'township', 'EternalDarkness', 'png'),
      ts_stone: () => TagManager.iconPath('skills', 'township', 'stone'),
      ts_storage: () => TagManager.iconPath('skills', 'township', 'storage'),
      ts_trader: () => TagManager.iconPath('skills', 'township', 'menu_trader'),
      ts_wood: () => TagManager.iconPath('skills', 'township', 'wood'),
      ts_worship: () => TagManager.iconPath('skills', 'township', 'worship'),
    },
    skillIcons: {
      agility: () => TagManager.iconPath('skills', 'agility'),
      archaeology: () => TagManager.iconPath('skills', 'archaeology'),
      astrology: () => TagManager.iconPath('skills', 'astrology'),
      attack: () => TagManager.iconPath('skills', 'attack'),
      cartography: () => TagManager.iconPath('skills', 'cartography'),
      combat: () => TagManager.iconPath('skills', 'combat'),
      cooking: () => TagManager.iconPath('skills', 'cooking'),
      crafting: () => TagManager.iconPath('skills', 'crafting'),
      defence: () => TagManager.iconPath('skills', 'defence'),
      farming: () => TagManager.iconPath('skills', 'farming'),
      firemaking: () => TagManager.iconPath('skills', 'firemaking'),
      fishing: () => TagManager.iconPath('skills', 'fishing'),
      fletching: () => TagManager.iconPath('skills', 'fletching'),
      herblore: () => TagManager.iconPath('skills', 'herblore'),
      hitpoints: () => TagManager.iconPath('skills', 'hitpoints'),
      magic: () => TagManager.iconPath('skills', 'magic'),
      mining: () => TagManager.iconPath('skills', 'mining'),
      prayer: () => TagManager.iconPath('skills', 'prayer'),
      ranged: () => TagManager.iconPath('skills', 'ranged'),
      runecrafting: () => TagManager.iconPath('skills', 'runecrafting'),
      skill: () => TagManager.iconPath('skills', 'skill'),
      slayer: () => TagManager.iconPath('skills', 'slayer'),
      smithing: () => TagManager.iconPath('skills', 'smithing'),
      strength: () => TagManager.iconPath('skills', 'strength'),
      summoning: () => TagManager.iconPath('skills', 'summoning'),
      thieving: () => TagManager.iconPath('skills', 'thieving'),
      township: () => TagManager.iconPath('skills', 'township'),
      woodcutting: () => TagManager.iconPath('skills', 'woodcutting'),
      harvesting: () => TagManager.iconPath('skills', 'harvesting', undefined, 'png'),
      corruption: () => TagManager.iconPath('skills', 'corruption', 'corruption', 'png'),
    },
  };

  private static ctx: Modding.ModContext;

  /**
   * The actual collection that will be managed for runtime-usage
   */
  public static tagSrcs: Map<string, string>;

  public static init(ctx: Modding.ModContext) {
    TagManager.ctx = ctx;
    TagManager.tagSrcs = new Map();

    const staticTags: { [key: string]: () => string } = Object.values(TagManager.staticTagsByCategories).reduce(
      (acc, category) => {
        return { ...acc, ...category };
      },
      {},
    );

    for (const [k, v] of Object.entries(staticTags)) {
      TagManager.tagSrcs.set(k, v());
    }
  }

  /**
   * Provides an asset path be insert to src attributes.
   * @param type - The type of the path.
   * @param path - The specific path.
   * @param ext - The file extension (default is 'svg').
   * @returns A string representing the base path.
   */
  private static basePath (
    type: PathType,
    path: string,
    ext: string = 'svg'
  ): string {
    return `assets/media/${type}/${path}.${ext}`;
  };

  /**
   * Determines the appropriate icon path based on the given parameters.
   * @param type - The type of the path.
   * @param name - The name of the icon. Also accepts a subtype.
   * @param specific - Specific file name if name is a subtype.
   * @param ext - The file extension (default is 'svg').
   * @returns A string representing the icon path.
   */
  private static iconPath(
    type: PathType,
    name: string,
    specific?: string,
    ext: string = 'svg',
  ): string {
    if (type === 'bank') {
      ext = 'png';
    }

    switch (type) {
      case 'skills':
        if (name === 'skill') {
          return TagManager.basePath('main', 'Book1', 'png');
        }

        return !specific
          ? TagManager.basePath('skills', `${name}/${name}`, ext)
          : TagManager.basePath('skills', `${name}/${specific}`, ext);
      case 'ti':
        return specific
          ? TagManager.ctx.getResourceUrl(`img/${specific}/${name}.${ext}`)
          : TagManager.ctx.getResourceUrl(`img/${name}.${ext}`);
      case 'bank':
      case 'main':
      case 'shop':
      case 'misc':
      case 'mods':
      case 'pets':
      case 'status':
        return TagManager.basePath(type, name, ext);
      case 'fa':
        return `fa-${name}`;
      default:
        if (type && name)
          throw new Error(
            `Unsupported icon path: assets/media/${type}/${name}${specific ? '/' + specific : ''
            }.${ext}`,
          );
        else throw new Error(`Unsupported icon path.`);
    }
  };
}