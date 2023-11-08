/**
 * Provides utility methods to generate paths for different icons.
 */
export class ModifierIconPaths {
  constructor(private url: Modding.ModContext['getResourceUrl']) {}

  /**
   * Provides an asset path be insert to src attributes.
   * @param type - The type of the path.
   * @param path - The specific path.
   * @param ext - The file extension (default is 'svg').
   * @returns A string representing the base path.
   */
  private readonly basePath = (
    type: PathType,
    path: string,
    ext: string = 'svg'
  ) => `assets/media/${type}/${path}.${ext}`;

  /**
   * Determines the appropriate icon path based on the given parameters.
   * @param type - The type of the path.
   * @param name - The name of the icon. Also accepts a subtype.
   * @param specific - Specific file name if name is a subtype.
   * @param ext - The file extension (default is 'svg').
   * @returns A string representing the icon path.
   */
  public readonly iconPath = (
    type: PathType,
    name: string,
    specific?: string,
    ext: string = 'svg'
  ): string => {
    if (type === 'bank') ext = 'png';
    switch (type) {
      case 'skills':
        if (name === 'skill') return this.basePath('main', 'Book1', 'png');
        return !specific
          ? this.basePath('skills', `${name}/${name}`, ext)
          : this.basePath('skills', `${name}/${specific}`, ext);
      case 'ti':
        return this.url(`img/${name}.${ext}`);
      case 'bank':
      case 'main':
      case 'shop':
      case 'misc':
      case 'mods':
      case 'pets':
      case 'status':
        return this.basePath(type, name, ext);
      case 'fa':
        return `fa-${name}`;
      default:
        if (type && name)
          throw new Error(
            `Unsupported icon path: assets/media/${type}/${name}${
              specific ? '/' + specific : ''
            }.${ext}`
          );
        else throw new Error(`Unsupported icon path.`);
    }
  };

  /**
   * Categories of icons with their paths.
   */
  public iconCategories = {
    itemIcons: {
      air_rune: this.iconPath('bank', 'rune_air'),
      ash: this.iconPath('bank', 'ashes'),
      bird_nest: this.iconPath('bank', 'bird_nest'),
      clothing: this.iconPath('bank', 'armour_leather_body'),
      coal: this.iconPath('bank', 'ore_coal'),
      dark_blade: this.iconPath('bank', 'Dark_Blade_Defender'),
      despair: this.iconPath('bank', 'Mask_of_Despair'),
      diamond: this.iconPath('bank', 'diamond'),
      earth_rune: this.iconPath('bank', 'rune_earth'),
      fire_rune: this.iconPath('bank', 'rune_fire'),
      food: this.iconPath('bank', 'beef'),
      golden_stardust: this.iconPath('bank', 'golden_stardust'),
      herb: this.iconPath('bank', 'herb_garum'),
      holy_dust: this.iconPath('bank', 'holy_dust'),
      iron_bar: this.iconPath('bank', 'iron_bar'),
      leather: this.iconPath('bank', 'leather'),
      loot: this.iconPath('bank', 'alchemists_bag'),
      madness: this.iconPath('bank', 'Mask_of_Madness'),
      meteorite: this.iconPath('skills', 'astrology', 'meteorite'),
      mushroom: this.iconPath('bank', 'mushroom'),
      ore: this.iconPath('skills', 'mining', 'rock_iron'),
      rune_essence: this.iconPath('bank', 'rune_essence'),
      seed: this.iconPath('bank', 'seeds_potato'),
      stardust: this.iconPath('bank', 'stardust'),
      torment: this.iconPath('bank', 'Mask_of_Torment'),
      water_rune: this.iconPath('bank', 'rune_water'),
    },
    generalIcons: {
      ancient_relics: this.iconPath(
        'main',
        'gamemode_ancient_relic',
        undefined,
        'png'
      ),
      aurora: this.iconPath('skills', 'combat', 'auroras'),
      autoeat: this.iconPath('shop', 'autoeat'),
      bank: this.iconPath('main', 'bank_header'),
      barrier: this.iconPath('skills', 'combat', 'barrier'),
      book: this.iconPath('main', 'Book1', 'png'),
      coins: this.iconPath('main', 'coins'),
      consumable: this.iconPath('bank', 'consumable'),
      curse: this.iconPath('skills', 'combat', 'curses'),
      dig: this.iconPath('skills', 'archaeology', 'digsites'),
      double: this.iconPath('main', 'double'),
      dungeon: this.iconPath('skills', 'combat', 'dungeon'),
      equip_set: this.iconPath('shop', 'equipment_set'),
      equip_swap: this.iconPath('shop', 'equipment_swap'),
      gem: this.iconPath('bank', 'diamond'),
      golbin: this.iconPath('pets', 'golden_golbin'),
      gp: this.iconPath('main', 'coins'),
      interval: this.iconPath('main', 'timer'),
      item_alchemy: this.iconPath('skills', 'magic', 'item_alchemy'),
      lemon: cdnMedia('assets/april/images/lemon.jpg'),
      map: this.iconPath('skills', 'archaeology', 'map_colour'),
      mastery: this.iconPath('main', 'mastery_header'),
      mods: this.iconPath('mods', 'placeholder_icon', 'png'),
      pet: this.iconPath('pets', 'bandit_base'),
      potion: this.iconPath('skills', 'herblore', 'potion_empty'),
      preservation: this.iconPath('main', 'preservation'),
      shop: this.iconPath('main', 'shop_header'),
      slayer_coins: this.iconPath('main', 'slayer_coins'),
      unholy: this.iconPath('skills', 'prayer', 'unholy_prayer'),
      xp: this.iconPath('main', 'xp'),
    },
    effectMedia: {
      afflicted: this.iconPath('misc', 'afflicted'),
      crystal_sanction: this.iconPath('status', 'crystal_sanction'),
      crystallize: this.iconPath('status', 'crystallized'),
      decay: this.iconPath('skills', 'magic', 'decay'),
      despair: this.iconPath('bank', 'Mask_of_Despair'),
      evasion_dn: this.iconPath('status', 'evasion_decrease'),
      evasion_up: this.iconPath('status', 'evasion_increase'),
      frost_burn: this.iconPath('status', 'frostburn'),
      frozen: this.iconPath('status', 'frozen'),
      madness: this.iconPath('bank', 'Mask_of_Madness'),
      mark_of_death: this.iconPath('misc', 'mark_of_death'),
      offense_dn: this.iconPath('status', 'attack_decrease'),
      offense_up: this.iconPath('status', 'attack_increase'),
      shock: this.iconPath('status', 'shocked'),
      sleep: this.iconPath('status', 'sleep'),
      slowed: this.iconPath('status', 'slowed'),
      speedup: this.iconPath('status', 'speedup'),
      stun_immunity: this.iconPath('status', 'stun_immunity'),
      stun: this.iconPath('status', 'stunned'),
      torment: this.iconPath('bank', 'Mask_of_Torment'),
    },
    dotMedia: {
      barrier_bleed: this.iconPath('misc', 'blood'),
      barrier_burn: this.iconPath('main', 'burn'),
      bleed: this.iconPath('misc', 'blood'),
      burn: this.iconPath('main', 'burn'),
      deadly_poison: this.iconPath('status', 'poison'),
      poison: this.iconPath('status', 'poison'),
      regen: this.iconPath('status', 'regen_increase'),
    },
    skillMedia: {
      air_strike: this.iconPath('skills', 'magic', 'wind_strike'),
      arch_brush: this.iconPath('skills', 'archaeology', 'brush'),
      arch_shovel: this.iconPath('skills', 'archaeology', 'shovel'),
      arch_sieve: this.iconPath('skills', 'archaeology', 'sieve'),
      arch_trowel: this.iconPath('skills', 'archaeology', 'trowel'),
      archaic: this.iconPath('skills', 'magic', 'archaic_book'),
      auto_slayer: this.iconPath('shop', 'auto_slayer'),
      building: this.iconPath('skills', 'township', 'menu_town'),
      confusion: this.iconPath('skills', 'magic', 'confusion'),
      decay: this.iconPath('skills', 'magic', 'decay'),
      earth_strike: this.iconPath('skills', 'magic', 'earth_strike'),
      fire_strike: this.iconPath('skills', 'magic', 'fire_strike'),
      protect_item: this.iconPath('skills', 'prayer', 'protect_item'),
      surge: this.iconPath('skills', 'magic', 'wind_surge'),
      ti_attack_interval: this.iconPath('ti', 'attack_interval'),
      ti_combat_dn: this.iconPath('ti', 'combat_dn'),
      ti_combat_up: this.iconPath('ti', 'combat_up'),
      ti_dr_dn: this.iconPath('ti', 'dr_dn'),
      ti_dr_up: this.iconPath('ti', 'dr_up'),
      ti_magic_dn: this.iconPath('ti', 'magic_dn'),
      ti_magic_up: this.iconPath('ti', 'magic_up'),
      ti_ranged_dn: this.iconPath('ti', 'ranged_dn'),
      ti_ranged_up: this.iconPath('ti', 'ranged_up'),
      ti_strength_dn: this.iconPath('ti', 'strength_dn'),
      ti_strength_up: this.iconPath('ti', 'strength_up'),
      ts_bar: this.iconPath('bank', 'iron_bar'),
      ts_biome_arid_plains: this.iconPath(
        'skills',
        'township',
        'arid_plains',
        'png'
      ),
      ts_biome_desert: this.iconPath('skills', 'township', 'desert', 'png'),
      ts_biome_forest: this.iconPath('skills', 'township', 'forest', 'png'),
      ts_biome_grasslands: this.iconPath(
        'skills',
        'township',
        'grasslands',
        'png'
      ),
      ts_biome_jungle: this.iconPath('skills', 'township', 'jungle', 'png'),
      ts_biome_mountains: this.iconPath(
        'skills',
        'township',
        'mountains',
        'png'
      ),
      ts_biome_snowlands: this.iconPath(
        'skills',
        'township',
        'snowlands',
        'png'
      ),
      ts_biome_swamp: this.iconPath('skills', 'township', 'swamp', 'png'),
      ts_biome_valley: this.iconPath('skills', 'township', 'valley', 'png'),
      ts_biome_water: this.iconPath('skills', 'township', 'water', 'png'),
      ts_clothing: this.iconPath('bank', 'armour_leather_body'),
      ts_coal: this.iconPath('skills', 'township', 'coal'),
      ts_education: this.iconPath('skills', 'township', 'education'),
      ts_food: this.iconPath('bank', 'raw_beef'),
      ts_happiness: this.iconPath('skills', 'township', 'happiness'),
      ts_health: this.iconPath('skills', 'township', 'health'),
      ts_herb: this.iconPath('bank', 'herb_garum'),
      ts_leather: this.iconPath('bank', 'leather'),
      ts_ore: this.iconPath('skills', 'mining', 'rock_iron'),
      ts_planks: this.iconPath('skills', 'township', 'planks'),
      ts_population: this.iconPath('skills', 'township', 'population'),
      ts_potion: this.iconPath('skills', 'township', 'potion'),
      ts_repair: this.iconPath('fa', 'hammer'),
      ts_rune: this.iconPath('bank', 'rune_essence'),
      ts_season_eclipse: this.iconPath('skills', 'township', 'eclipse', 'png'),
      ts_season_nightfall: this.iconPath(
        'skills',
        'township',
        'nightfall',
        'png'
      ),
      ts_stone: this.iconPath('skills', 'township', 'stone'),
      ts_storage: this.iconPath('skills', 'township', 'storage'),
      ts_trader: this.iconPath('skills', 'township', 'menu_trader'),
      ts_wood: this.iconPath('skills', 'township', 'wood'),
      ts_worship: this.iconPath('skills', 'township', 'worship'),
      water_strike: this.iconPath('skills', 'magic', 'water_strike'),
    },
    skillIcons: {
      agility: this.iconPath('skills', 'agility'),
      archaeology: this.iconPath('skills', 'archaeology'),
      astrology: this.iconPath('skills', 'astrology'),
      attack: this.iconPath('skills', 'attack'),
      cartography: this.iconPath('skills', 'cartography'),
      combat: this.iconPath('skills', 'combat'),
      cooking: this.iconPath('skills', 'cooking'),
      crafting: this.iconPath('skills', 'crafting'),
      defence: this.iconPath('skills', 'defence'),
      farming: this.iconPath('skills', 'farming'),
      firemaking: this.iconPath('skills', 'firemaking'),
      fishing: this.iconPath('skills', 'fishing'),
      fletching: this.iconPath('skills', 'fletching'),
      herblore: this.iconPath('skills', 'herblore'),
      hitpoints: this.iconPath('skills', 'hitpoints'),
      magic: this.iconPath('skills', 'magic'),
      mining: this.iconPath('skills', 'mining'),
      prayer: this.iconPath('skills', 'prayer'),
      ranged: this.iconPath('skills', 'ranged'),
      runecrafting: this.iconPath('skills', 'runecrafting'),
      skill: this.iconPath('skills', 'skill'),
      slayer: this.iconPath('skills', 'slayer'),
      smithing: this.iconPath('skills', 'smithing'),
      strength: this.iconPath('skills', 'strength'),
      summoning: this.iconPath('skills', 'summoning'),
      thieving: this.iconPath('skills', 'thieving'),
      township: this.iconPath('skills', 'township'),
      woodcutting: this.iconPath('skills', 'woodcutting'),
    },
  };

  /**
   * An object of all defined modifier tag keys with paths for their associated icon(s) values.
   */
  public srcForTag: IconTagSources = Object.values(this.iconCategories).reduce(
    (acc, category) => {
      return { ...acc, ...category };
    },
    {}
  );

  // api
  get availableTags(): string[] {
    return Object.keys(this.srcForTag);
  }

  // api
  get availableTagSources(): IconTagSources {
    return this.srcForTag;
  }
}

export type PathType =
  | 'skills'
  | 'skill'
  | 'bank'
  | 'main'
  | 'status'
  | 'misc'
  | 'ti'
  | 'mods'
  | 'pets'
  | 'shop'
  | 'fa';

export type IconTagSources = { [key: string]: string };

// Utility type for extracting keys from nested objects.
type ExtractKeys<T> = {
  [K in keyof T]: keyof T[K];
}[keyof T];

/**
 * All available icon tags based on ModifierIconPaths categories.
 */
export type AllIconTags = ExtractKeys<
  typeof ModifierIconPaths.prototype.iconCategories
>;
