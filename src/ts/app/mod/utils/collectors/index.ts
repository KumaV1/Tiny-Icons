import { collectWeaponItems, collectFiremakingOilItems, collectFoodItems, collectPotionItems, collectTokenItems, collectEquipmentItems, collectItems } from './itemsCollector';
import { collectSkillTreeNodes } from './skillTreeNodeCollector';
import { collectCartography } from './cartographyCollector';
import { collectAncientRelics } from './ancientRelicCollector';
import { collectAstrologyRecipes } from './astrologyRecipeCollector';
import { collectCombatSpells } from './combatSpellCollector';
import { collectCombatPassives } from './combatPassiveCollector';
import { collectItemSynergies } from './itemSynergyCollector';
import { collectPets } from './petCollector';
import { collectPrayers } from './prayerCollector';
import { collectAttackStyles } from './attackStyleCollector';
import { collectAgilityObjects } from './agilityObjectCollector';
import { collectShopPurchases } from './shopPurchaseCollector';
import { collectSummoningSynergies } from './summoningSynergyCollector';
import { EntityCategory } from '../../types/entityCategory';

export const collectors: Map<EntityCategory, () => Array<{ context: any, entity: any }>> = new Map();

collectors.set('TokenItem', collectTokenItems);
collectors.set('PotionItem', collectPotionItems);
collectors.set('EquipmentItem', collectEquipmentItems);
collectors.set('WeaponItem', collectWeaponItems);
collectors.set('FiremakingOilItem', collectFiremakingOilItems);
collectors.set('FoodItem', collectFoodItems);

collectors.set('AncientRelic', collectAncientRelics);
collectors.set('AstrologyRecipe', collectAstrologyRecipes);
collectors.set('AttackStyle', collectAttackStyles);
collectors.set('BaseAgilityObject', collectAgilityObjects);
collectors.set('CartographyPOI', collectCartography);
collectors.set('CartographyWorldMapMasteryBonus', collectCartography);
collectors.set('CombatPassive', collectCombatPassives);
collectors.set('CombatSpell', collectCombatSpells);
collectors.set('ItemSynergy', collectItemSynergies);
collectors.set('Pet', collectPets);
collectors.set('Prayer', collectPrayers);
collectors.set('SkillTreeNode', collectSkillTreeNodes);
collectors.set('ShopPurchase', collectShopPurchases);
collectors.set('SummoningSynergy', collectSummoningSynergies);

export { collectItems, collectWeaponItems, collectFiremakingOilItems, collectFoodItems, collectPotionItems, collectTokenItems, collectEquipmentItems, collectSkillTreeNodes, collectCartography, collectAncientRelics, collectAstrologyRecipes, collectCombatSpells, collectCombatPassives, collectItemSynergies, collectPets, collectPrayers, collectAttackStyles, collectAgilityObjects, collectShopPurchases, collectSummoningSynergies };
