import { ModifierTagMapEntryAttributes } from '../models/ModifierTagMapEntryAttributes';

/**
 * An object mapping all modifiers to tags that represent relevant icons.
 */
export const modifierTagMap = new Map<string, ModifierTagMapEntryAttributes>([
  ['melvorD:accuracyRating', new ModifierTagMapEntryAttributes('accuracy')],
  ['melvorD:meleeAccuracyRating', new ModifierTagMapEntryAttributes('accuracy', 'attack')],
  ['melvorD:rangedAccuracyRating', new ModifierTagMapEntryAttributes('accuracy', 'ranged')],
  ['melvorD:magicAccuracyRating', new ModifierTagMapEntryAttributes('accuracy', 'magic')],
  ['melvorD:meleeMaxHit', new ModifierTagMapEntryAttributes({positive: 'ti_strength_up', negative: 'ti_strength_dn'})],
  ['melvorD:rangedMaxHit', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:magicMaxHit', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:evasion', new ModifierTagMapEntryAttributes({positive: 'evasion_up', negative: 'evasion_dn'})],
  ['melvorD:meleeEvasion', new ModifierTagMapEntryAttributes({positive: 'offense_up', negative: 'evasion_dn'})],
  ['melvorD:rangedEvasion', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:magicEvasion', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:flatMaxHit', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:maxHit', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:flatHPRegen', new ModifierTagMapEntryAttributes('regen')],
  ['melvorD:flatAttackInterval', new ModifierTagMapEntryAttributes('interval', {positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:attackInterval', new ModifierTagMapEntryAttributes('interval', {positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:maxHitpoints', new ModifierTagMapEntryAttributes('hitpoints')],
  ['melvorD:flatMaxHitpoints', new ModifierTagMapEntryAttributes('hitpoints')],
  ['melvorD:reflectDamage', new ModifierTagMapEntryAttributes('reflect')],
  ['melvorD:hitpointRegeneration', new ModifierTagMapEntryAttributes('regen')],
  ['melvorD:minHitBasedOnMaxHit', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:attackRolls', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:dragonBreathDamage', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})], // TODO: Add tag for "dragon breath"? (and set it as the priomary one; or only, if said icon had an up/down arrow added to it); is there something that de-/increases this, whose media could be used?
  ['melvorD:flatReflectDamage', new ModifierTagMapEntryAttributes('reflect')],
  ['melvorD:rolledReflectDamage', new ModifierTagMapEntryAttributes('reflect')],
  ['melvorD:flatMinHit', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:flatMagicMinHit', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'magic')],
  ['melvorD:currentHPDamageTakenOnAttack', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:maxHPDamageTakenOnAttack', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:damageTaken', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:damageDealt', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:lifesteal', new ModifierTagMapEntryAttributes('lifesteal')],
  ['melvorD:meleeLifesteal', new ModifierTagMapEntryAttributes('lifesteal', 'attack')],
  ['melvorD:rangedLifesteal', new ModifierTagMapEntryAttributes('lifesteal', 'ranged')],
  ['melvorD:magicLifesteal', new ModifierTagMapEntryAttributes('lifesteal', 'magic')],
  ['melvorD:bleedLifesteal', new ModifierTagMapEntryAttributes('lifesteal', 'bleed')],
  ['melvorD:burnLifesteal', new ModifierTagMapEntryAttributes('lifesteal', 'burn')],
  ['melvorD:poisonLifesteal', new ModifierTagMapEntryAttributes('lifesteal', 'poison')],
  ['melvorD:meleeCritChance', new ModifierTagMapEntryAttributes('crit', 'attack')],
  ['melvorD:rangedCritChance', new ModifierTagMapEntryAttributes('crit', 'ranged')],
  ['melvorD:magicCritChance', new ModifierTagMapEntryAttributes('crit', 'magic')],
  ['melvorD:meleeProtection', new ModifierTagMapEntryAttributes('evasion_up', 'attack')],
  ['melvorD:rangedProtection', new ModifierTagMapEntryAttributes('evasion_up', 'ranged')],
  ['melvorD:magicProtection', new ModifierTagMapEntryAttributes('evasion_up', 'magic')],
  ['melvorD:effectImmunity', new ModifierTagMapEntryAttributes('combat')], // TODO: add tag for "effect" // TODO: add tag for "null/ignore, which is not specifically evasion"
  ['melvorD:effectIgnoreChance', new ModifierTagMapEntryAttributes('combat')], // TODO: add tag for "effect" // TODO: add tag for "null/ignore, which is not specifically evasion"
  ['melvorD:rebirthChance', new ModifierTagMapEntryAttributes('revive')],
  ['melvorD:summoningMaxHit', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'summoning')],
  ['melvorD:otherStyleImmunity', new ModifierTagMapEntryAttributes('immunity')],
  ['melvorD:meleeImmunity', new ModifierTagMapEntryAttributes('immunity', 'attack')],
  ['melvorD:rangedImmunity', new ModifierTagMapEntryAttributes('immunity', 'ranged')],
  ['melvorD:magicImmunity', new ModifierTagMapEntryAttributes('immunity', 'magic')],
  ['melvorD:flatTotalBleedDamage', new ModifierTagMapEntryAttributes('ti_combat_up', 'bleed')],
  ['melvorD:stunDurationIncreaseChance', new ModifierTagMapEntryAttributes('stun')], // Not used in game code, so no need to think about better tagging
  ['melvorD:flatRegenerationInterval', new ModifierTagMapEntryAttributes('regen')],
  ['melvorD:onHitSlowMagnitude', new ModifierTagMapEntryAttributes('slowed')],
  ['melvorD:globalEvasionHPScaling', new ModifierTagMapEntryAttributes({positive: 'evasion_up', negative: 'evasion_dn'}, 'hitpoints')],
  ['melvorD:flatPrayerPointsWhenHit', new ModifierTagMapEntryAttributes('prayer', 'combat')],
  ['melvorD:flatMeleeAccuracyBonusPerAttackInterval', new ModifierTagMapEntryAttributes('accuracy', 'attack')],
  ['melvorD:flatMeleeStrengthBonusPerAttackInterval', new ModifierTagMapEntryAttributes({positive: 'ti_strength_up', negative: 'ti_strength_dn'})],
  ['melvorD:flatRangedAccuracyBonusPerAttackInterval', new ModifierTagMapEntryAttributes('accuracy', 'ranged')],
  ['melvorD:flatRangedStrengthBonusPerAttackInterval', new ModifierTagMapEntryAttributes({positive: 'ti_ranged_up', negative: 'ti_ranged_dn'})],
  ['melvorD:flatMagicAccuracyBonusPerAttackInterval', new ModifierTagMapEntryAttributes('accuracy', 'magic')],
  ['melvorD:meleeMaxHitAgainstRanged', new ModifierTagMapEntryAttributes({positive: 'ti_strength_up', negative: 'ti_strength_dn'})], // TODO: Add tag for "against X"? Showing "strength up" and then "ranged" may not be as intuitive for saying "against ranged"
  ['melvorD:rangedMaxHitAgainstMagic', new ModifierTagMapEntryAttributes({positive: 'ti_ranged_up', negative: 'ti_ranged_dn'})], // TODO: Add tag for "against X"? Showing "strength up" and then "magic" may not be as intuitive for saying "against magic"
  ['melvorD:magicMaxHitAgainstMelee', new ModifierTagMapEntryAttributes({positive: 'ti_magic_up', negative: 'ti_magic_dn'})], // TODO: Add tag for "against X"? Showing "strength up" and then "melee" may not be as intuitive for saying "against melee"
  ['melvorD:doubleSlayerTaskKillChance', new ModifierTagMapEntryAttributes('slayer')],
  ['melvorD:damageTakenAddedAsPrayerPoints', new ModifierTagMapEntryAttributes('prayer', 'combat')], // TODO: Add tag for "damage"?
  ['melvorD:accuracyRatingHPScaling', new ModifierTagMapEntryAttributes('accuracy', 'hitpoints')],
  ['melvorD:sleepDurationIncreaseChance', new ModifierTagMapEntryAttributes('sleep')],
  ['melvorD:stunAvoidChance', new ModifierTagMapEntryAttributes('stun')],
  ['melvorD:healWhenStunned', new ModifierTagMapEntryAttributes('hitpoints', 'stun')],
  ['melvorD:healWhenSlept', new ModifierTagMapEntryAttributes('hitpoints', 'sleep')],
  ['melvorD:damageTakenPerAttack', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:frostburnDamage', new ModifierTagMapEntryAttributes('frost_burn')],
  ['melvorD:flatMeleeMaxHit', new ModifierTagMapEntryAttributes({positive: 'ti_strength_up', negative: 'ti_strength_dn'})],
  ['melvorD:flatRangedMaxHit', new ModifierTagMapEntryAttributes({positive: 'ti_ranged_up', negative: 'ti_ranged_dn'})],
  ['melvorD:flatMagicMaxHit', new ModifierTagMapEntryAttributes({positive: 'ti_magic_up', negative: 'ti_magic_dn'})],
  ['melvorD:curseLifesteal', new ModifierTagMapEntryAttributes('lifesteal', 'curse')],
  ['melvorD:lifestealBasedOnHPRegenEffectiveness', new ModifierTagMapEntryAttributes('lifesteal', 'regen')],
  ['melvorD:disableHPRegeneration', new ModifierTagMapEntryAttributes('nulled', 'regen')],
  ['melvorD:flatMinMeteorShowerSpellDamage', new ModifierTagMapEntryAttributes({positive: 'ti_magic_up', negative: 'ti_magic_dn'}, 'meteor_shower')],
  ['melvorD:endOfTurnEvasion2', new ModifierTagMapEntryAttributes({positive: 'evasion_up', negative: 'evasion_dn'})],
  ['melvorD:decreaseEnemyEvasionOnStun', new ModifierTagMapEntryAttributes('ti_combat_up', 'stun')],
  ['melvorD:decreaseEnemyEvasionOnSleep', new ModifierTagMapEntryAttributes('ti_combat_up', 'sleep')],
  ['melvorD:doubleLifesteal', new ModifierTagMapEntryAttributes('lifesteal')],
  ['melvorD:maxHPBurnDamage', new ModifierTagMapEntryAttributes('burn', 'hitpoints')],
  ['melvorD:disableLifesteal', new ModifierTagMapEntryAttributes('nulled', 'lifesteal')],
  ['melvorD:burnDOTDamageTaken', new ModifierTagMapEntryAttributes('burn')],
  ['melvorD:bleedDOTDamageTaken', new ModifierTagMapEntryAttributes('bleed')],
  ['melvorD:poisonDOTDamageTaken', new ModifierTagMapEntryAttributes('poison')],
  ['melvorD:deadlyPoisonDOTDamageTaken', new ModifierTagMapEntryAttributes('deadly_poison')],
  ['melvorD:evasionAgainstMelee', new ModifierTagMapEntryAttributes({positive: 'evasion_up', negative: 'evasion_dn'}, 'attack')],
  ['melvorD:evasionAgainstRanged', new ModifierTagMapEntryAttributes({positive: 'evasion_up', negative: 'evasion_dn'}, 'ranged')],
  ['melvorD:evasionAgainstMagic', new ModifierTagMapEntryAttributes({positive: 'evasion_up', negative: 'evasion_dn'}, 'magic')],
  ['melvorD:meleeAccuracyMaxHitPer8Strength', new ModifierTagMapEntryAttributes('accuracy', 'attack')],
  ['melvorD:magicMaxHitWithActivePrayer', new ModifierTagMapEntryAttributes({positive: 'ti_ranged_up', negative: 'ti_ranged_dn'})],
  ['melvorD:rangedStrengthBonusPer8Ranged', new ModifierTagMapEntryAttributes({positive: 'ti_magic_up', negative: 'ti_magic_dn'})],
  ['melvorD:flatBarrierSummonDamage', new ModifierTagMapEntryAttributes('barrier', 'summoning')],
  ['melvorD:barrierSummonDamage', new ModifierTagMapEntryAttributes('barrier', 'summoning')],
  ['melvorD:flatBarrierSummonDamageMelee', new ModifierTagMapEntryAttributes('barrier', 'summoning')],
  ['melvorD:flatBarrierSummonDamageRanged', new ModifierTagMapEntryAttributes('barrier', 'summoning')],
  ['melvorD:flatBarrierSummonDamageMagic', new ModifierTagMapEntryAttributes('barrier', 'summoning')],
  ['melvorD:barrierSummonDamageIfSlayerTask', new ModifierTagMapEntryAttributes('barrier', 'slayer')],
  ['melvorD:disableAttackDamage', new ModifierTagMapEntryAttributes('nulled', 'combat')],
  ['melvorD:cleansed', new ModifierTagMapEntryAttributes('combat')], // Not used in game code, so no need to think about better tagging
  ['melvorD:maxHitBasedOnTargetCurrentHitpoints', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'hitpoints')],
  ['melvorD:prayerPointPreservationChancePerPoint', new ModifierTagMapEntryAttributes('prayer')],
  ['melvorD:maxHitBasedOnPrayerCost', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'prayer')],
  ['melvorD:flatPrayerPointsPerMonsterKill', new ModifierTagMapEntryAttributes('prayer')],
  ['melvorD:selfDamageOnHitBasedOnCurrentHitpoints', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'hitpoints')],
  ['melvorD:noCombatDropChance', new ModifierTagMapEntryAttributes('nulled', 'loot')],
  ['melvorD:meleeAttackInterval', new ModifierTagMapEntryAttributes('interval', 'attack')],
  ['melvorD:rangedAttackInterval', new ModifierTagMapEntryAttributes('interval', 'ranged')],
  ['melvorD:magicAttackInterval', new ModifierTagMapEntryAttributes('interval', 'magic')],
  ['melvorD:dodgeChance', new ModifierTagMapEntryAttributes({positive: 'evasion_up', negative: 'evasion_dn'})],
  ['melvorD:convertMissIntoHit', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:bypassAmmoPreservationChance', new ModifierTagMapEntryAttributes('preservation', 'ranged')],
  ['melvorD:bypassRunePreservationChance', new ModifierTagMapEntryAttributes('preservation', 'magic')],
  ['melvorD:halveAttackInterval', new ModifierTagMapEntryAttributes('ti_attack_interval')],
  ['melvorD:lifestealDamageBasedOnCurrentHitpoints', new ModifierTagMapEntryAttributes('lifesteal', 'hitpoints')],
  ['melvorD:damageBasedOnCurrentHitpoints', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'hitpoints')],
  ['melvorD:damageBasedOnMaxHitpoints', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'hitpoints')],
  ['melvorD:healingWhenHit', new ModifierTagMapEntryAttributes('hitpoints')],
  ['melvorD:damageDealtWith2Effects', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})], // TODO: Add tag for "effect"
  ['melvorD:unholyMarkOnHit', new ModifierTagMapEntryAttributes('unholy')],
  ['melvorD:damageTakenBasedOnHP', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'hitpoints')],
  ['melvorD:curseOnHitWithUnholyMark', new ModifierTagMapEntryAttributes('curse', 'unholy')],
  ['melvorD:flatBarrierDamage', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'barrier')],
  ['melvorD:damageDealtPerEffect', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})], // TODO: Add tag for "effect"
  ['melvorD:regenPerDamageTaken', new ModifierTagMapEntryAttributes('regen')],
  ['melvorD:convertBoneDropsIntoCake', new ModifierTagMapEntryAttributes('combat')],
  ['melvorD:summoningAttackInterval', new ModifierTagMapEntryAttributes('interval', 'summoning')], // TODO: Change "attack interval" tag to be more clear on being combat-style-ambigous
  ['melvorD:flatSummoningAttackInterval', new ModifierTagMapEntryAttributes('interval', 'summoning')],
  ['melvorD:cantAttack', new ModifierTagMapEntryAttributes('nulled', 'combat')],
  ['melvorD:cantEvade', new ModifierTagMapEntryAttributes('nulled', 'evasion_dn')],
  ['melvorD:cantRegenBarrier', new ModifierTagMapEntryAttributes('nulled', 'barrier_regen')],
  ['melvorD:critChance', new ModifierTagMapEntryAttributes('crit')],
  ['melvorD:cantSpecialAttack', new ModifierTagMapEntryAttributes('nulled', 'special_attack')],
  ['melvorD:lacerationLifesteal', new ModifierTagMapEntryAttributes('lifesteal', 'laceration')],
  ['melvorD:damageTakenPerMissedAttack', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'combat')], // TODO: Add tag for "missing attack in combat"
  ['melvorD:flatAbyssalSlayerAreaEffectNegation', new ModifierTagMapEntryAttributes('slayer')], // TODO: Add tag for "slayer effect (negation)", if realistic?
  ['melvorD:cantMiss', new ModifierTagMapEntryAttributes('ti_combat_up')],
  ['melvorD:rawReflectDamage', new ModifierTagMapEntryAttributes('reflect')],
  ['melvorD:evasionBasedOnCorruptionLevel', new ModifierTagMapEntryAttributes({positive: 'evasion_up', negative: 'evasion_dn'}, 'corruption')],
  ['melvorD:ablazeDOTDamageTakenIfCorrupted', new ModifierTagMapEntryAttributes('ablaze', 'corruption')],
  ['melvorD:dotDamageTaken', new ModifierTagMapEntryAttributes('combat')], // TODO: Add tag for "DOT" (or use burn/bleed?)
  ['melvorD:bonusCorruptionChance', new ModifierTagMapEntryAttributes('corruption')],
  ['melvorD:extraCorruptions', new ModifierTagMapEntryAttributes('corruption')],
  ['melvorD:corruptionCounterRate', new ModifierTagMapEntryAttributes('corruption')],
  ['melvorD:critMultiplier', new ModifierTagMapEntryAttributes('crit')],
  ['melvorD:damageBasedOnMaxHitpointsSelf', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'hitpoints')],
  ['melvorD:toxinDOTDamageTaken', new ModifierTagMapEntryAttributes('toxin')],
  ['melvorD:ablazeDOTDamageTaken', new ModifierTagMapEntryAttributes('ablaze')],
  ['melvorD:ablazeLifesteal', new ModifierTagMapEntryAttributes('lifesteal', 'ablaze')],
  ['melvorD:toxinLifesteal', new ModifierTagMapEntryAttributes('lifesteal', 'toxin')],
  ['melvorD:meleeMinHitBasedOnMaxHit', new ModifierTagMapEntryAttributes({positive: 'offense_up', negative: 'offense_dn'})],
  ['melvorD:rangedMinHitBasedOnMaxHit', new ModifierTagMapEntryAttributes({positive: 'ti_ranged_up', negative: 'ti_ranged_dn'})],
  ['melvorD:magicMinHitBasedOnMaxHit', new ModifierTagMapEntryAttributes({positive: 'ti_magic_up', negative: 'ti_magic_dn'})],
  ['melvorD:lacerationDOTDamageTaken', new ModifierTagMapEntryAttributes('laceration')],
  ['melvorD:voidburstDOTDamageTaken', new ModifierTagMapEntryAttributes('voidburst')],
  ['melvorD:instantCorruptionChance', new ModifierTagMapEntryAttributes('corruption')],
  ['melvorD:extraLacerationStackChance', new ModifierTagMapEntryAttributes('laceration')],
  ['melvorD:combatLootDoublingChance', new ModifierTagMapEntryAttributes('loot', 'combat')],
  ['melvorD:damageDealtToBosses', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})], //  TODO: Add tag for "boss"
  ['melvorD:damageDealtToSlayerTasks', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'slayer')],
  ['melvorD:damageDealtToMonstersInArea', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})], // TODO: Ignore, as area must be specified and therefore will have its media used :)
  ['melvorD:damageDealtToAllMonsters', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:autoEatEfficiency', new ModifierTagMapEntryAttributes('autoeat')],
  ['melvorD:autoEatThreshold', new ModifierTagMapEntryAttributes('autoeat')],
  ['melvorD:autoEatHPLimit', new ModifierTagMapEntryAttributes('autoeat')],
  ['melvorD:foodHealingValue', new ModifierTagMapEntryAttributes('food', 'hitpoints')],
  ['melvorD:prayerPointPreservationChance', new ModifierTagMapEntryAttributes('preservation', 'prayer')],
  ['melvorD:flatPrayerPointCost', new ModifierTagMapEntryAttributes('prayer')],
  ['melvorD:ammoPreservationChance', new ModifierTagMapEntryAttributes('preservation', 'ranged')],
  ['melvorD:runePreservationChance', new ModifierTagMapEntryAttributes('preservation', 'magic')],
  ['melvorD:flatMonsterRespawnInterval', new ModifierTagMapEntryAttributes('interval')], // TODO: Add tag for "respawn" or "monster"
  ['melvorD:bankSpace', new ModifierTagMapEntryAttributes('bank')],
  ['melvorD:potionChargePreservationChance', new ModifierTagMapEntryAttributes('preservation', 'potion')],
  ['melvorD:masteryXP', new ModifierTagMapEntryAttributes('mastery')],
  ['melvorD:skillXP', new ModifierTagMapEntryAttributes('xp')],
  ['melvorD:flatMiningNodeHP', new ModifierTagMapEntryAttributes('mining')],
  ['melvorD:dungeonEquipmentSwapping', new ModifierTagMapEntryAttributes('equip_swap', 'dungeon')],
  ['melvorD:strongholdEquipmentSwapping', new ModifierTagMapEntryAttributes('equip_swap', 'stronghold')],
  ['melvorD:equipmentSets', new ModifierTagMapEntryAttributes('equip_set')],
  ['melvorD:autoSlayerUnlocked', new ModifierTagMapEntryAttributes('auto_slayer')],
  ['melvorD:treeCutLimit', new ModifierTagMapEntryAttributes('woodcutting')],
  ['melvorD:skillPreservationChance', new ModifierTagMapEntryAttributes('preservation', { positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:slayerTaskLength', new ModifierTagMapEntryAttributes('slayer')],
  ['melvorD:globalItemDoublingChance', new ModifierTagMapEntryAttributes('double')],
  ['melvorD:golbinRaidWaveSkipCost', new ModifierTagMapEntryAttributes('golbin')],
  ['melvorD:golbinRaidMaximumAmmo', new ModifierTagMapEntryAttributes('golbin', 'ranged')],
  ['melvorD:golbinRaidMaximumRunes', new ModifierTagMapEntryAttributes('golbin', 'magic')],
  ['melvorD:golbinRaidMinimumFood', new ModifierTagMapEntryAttributes('golbin', 'food')],
  ['melvorD:golbinRaidPrayerLevel', new ModifierTagMapEntryAttributes('golbin', 'prayer')],
  ['melvorD:golbinRaidStartingPrayerPoints', new ModifierTagMapEntryAttributes('golbin', 'prayer')],
  ['melvorD:golbinRaidPrayerPointsPerWave', new ModifierTagMapEntryAttributes('golbin', 'prayer')],
  ['melvorD:golbinRaidStartingRuneCount', new ModifierTagMapEntryAttributes('golbin', 'magic')],
  ['melvorD:golbinRaidPassiveSlotUnlocked', new ModifierTagMapEntryAttributes('golbin', 'combat')],
  ['melvorD:golbinRaidPrayerUnlocked', new ModifierTagMapEntryAttributes('golbin', 'prayer')],
  ['melvorD:golbinRaidStartingWeapon', new ModifierTagMapEntryAttributes('golbin', 'combat')],
  ['melvorD:flatPotionCharges', new ModifierTagMapEntryAttributes('potion')],
  ['melvorD:potionCharges', new ModifierTagMapEntryAttributes('potion')],
  ['melvorD:noMiningNodeDamageChance', new ModifierTagMapEntryAttributes('mining')],
  ['melvorD:elementalRuneChance', new ModifierTagMapEntryAttributes('runecrafting')],
  ['melvorD:elementalRuneQuantity', new ModifierTagMapEntryAttributes('runecrafting')],
  ['melvorD:randomHerblorePotionChance', new ModifierTagMapEntryAttributes('herblore')],
  ['melvorD:freeBonfires', new ModifierTagMapEntryAttributes('firemaking')],
  ['melvorD:altMagicSkillXP', new ModifierTagMapEntryAttributes('xp', 'magic')],
  ['melvorD:seedDropConversionChance', new ModifierTagMapEntryAttributes('seed', 'combat')],
  ['melvorD:flatMagicDefenceBonus', new ModifierTagMapEntryAttributes({positive: 'ti_magic_up', negative: 'ti_magic_dn'}, 'defence')],
  ['melvorD:hpRegenWhenEnemyHasMoreEvasion', new ModifierTagMapEntryAttributes('regen')], // TODO: Add tag for "evasion"
  ['melvorD:summoningAttackLifesteal', new ModifierTagMapEntryAttributes('lfiesteal', 'summoning')],
  ['melvorD:bonusFishingSpecialChance', new ModifierTagMapEntryAttributes('fishing')],
  ['melvorD:summoningSynergy_Ent_Leprechaun', new ModifierTagMapEntryAttributes('bird_nest', 'thieving')],
  ['melvorD:woodcuttingJewelryChance', new ModifierTagMapEntryAttributes('jewelry', 'woodcutting')],
  ['melvorD:summoningSynergy_4_5', new ModifierTagMapEntryAttributes('mining', 'fishing')], // TODO: Allow for more than two static tags? Primary should be "gem" with two secondary "scopings" of fishing and mining
  ['melvorD:cookingSuccessCap', new ModifierTagMapEntryAttributes('cooking')],
  ['melvorD:miningBarChance', new ModifierTagMapEntryAttributes('mining', 'smithing')],
  ['melvorD:fishingCookedChance', new ModifierTagMapEntryAttributes('fishing', 'cooking')],
  ['melvorD:summoningSynergy_Octopus_Leprechaun', new ModifierTagMapEntryAttributes('thieving')], // TODO: Add tag for "thieving fisherman" (?) - alternatively, add getters by which the icon can be retrieved (?) like extracting it from said thieving npc?
  ['melvorD:magicMinHitBasedOnMaxHitSlayerTask', new ModifierTagMapEntryAttributes({positive: 'ti_magic_up', negative: 'ti_magic_dn'}, 'slayer')],
  ['melvorD:meleeMinHitBasedOnMaxHitSlayerTask', new ModifierTagMapEntryAttributes({positive: 'offense_up', negative: 'offense_dn'}, 'slayer')],
  ['melvorD:flatHPRegenBasedOnMeleeMaxHit', new ModifierTagMapEntryAttributes('regen', 'attack')],
  ['melvorD:rangedMinHitBasedOnMaxHitSlayerTask', new ModifierTagMapEntryAttributes({positive: 'ti_ranged_up', negative: 'ti_ranged_dn'}, 'slayer')],
  ['melvorD:flatHPRegenBasedOnRangedMaxHit', new ModifierTagMapEntryAttributes('regen', 'ranged')],
  ['melvorD:slayerCoinsPerMagicDamageSlayerTask', new ModifierTagMapEntryAttributes('slayer_coins', 'magic')],
  ['melvorD:flatHPRegenBasedOnMagicMaxHit', new ModifierTagMapEntryAttributes('regen', 'magic')],
  ['melvorD:flatCraftingDragonhideCost', new ModifierTagMapEntryAttributes('crafting')], // TODO: Add tag for "dragonhide" (?)
  ['melvorD:giveRandomComboRunesRunecrafting', new ModifierTagMapEntryAttributes('runecrafting')], // TODO: MAYBE add tag for "combination rune" (?)
  ['melvorD:thievingAutoSellPrice', new ModifierTagMapEntryAttributes('thieving')], // TODO: Only possible with "currency" scope, BUT should it be possible to set a secondary tag based on currency scope?
  ['melvorD:thievingMinerRandomBarChance', new ModifierTagMapEntryAttributes('thieving')], // TODO: Add tag for "thieving miner" (?) - alternatively, add getters by which the icon can be retrieved (?) like extracting it from said thieving npc?
  ['melvorD:thievingFarmerHerbSackChance', new ModifierTagMapEntryAttributes('thieving')], // TODO: Add tag for "thieving farmer" (?) - alternatively, add getters by which the icon can be retrieved (?) like extracting it from said thieving npc?
  ['melvorD:summoningSynergy_Leprechaun_Devil', new ModifierTagMapEntryAttributes('thieving')],
  ['melvorD:hitpointRegenerationAgainstSlayerTasks', new ModifierTagMapEntryAttributes('regen', 'slayer')],
  ['melvorD:flatSmithingCoalCost', new ModifierTagMapEntryAttributes('coal', 'smithing')],
  ['melvorD:removeSmithingCoalCosts', new ModifierTagMapEntryAttributes('coal', 'smithing')],
  ['melvorD:meleeStrengthBonus', new ModifierTagMapEntryAttributes({positive: 'ti_strength_up', negative: 'ti_strength_dn'})],
  ['melvorD:rangedStrengthBonus', new ModifierTagMapEntryAttributes({positive: 'ti_ranged_up', negative: 'ti_ranged_dn'})],
  ['melvorD:magicDamageBonus', new ModifierTagMapEntryAttributes({positive: 'ti_magic_up', negative: 'ti_magic_up'})],
  ['melvorD:agilityObstacleCost', new ModifierTagMapEntryAttributes('agility')], // With obstacle cost being possible to be not just currency but also items, probably should stay without secondary icon
  ['melvorD:freeCompost', new ModifierTagMapEntryAttributes('farming')],
  ['melvorD:compostPreservationChance', new ModifierTagMapEntryAttributes('preservation', 'farming')],
  ['melvorD:bypassCompostPreservationChance', new ModifierTagMapEntryAttributes('preservation', 'farming')],
  ['melvorD:offItemChance', new ModifierTagMapEntryAttributes('loot')],
  ['melvorD:miningGemChance', new ModifierTagMapEntryAttributes('gem', 'mining')],
  ['melvorD:bonusCoalMining', new ModifierTagMapEntryAttributes('coal', 'mining')],
  ['melvorD:smithingCoalCost', new ModifierTagMapEntryAttributes('coal', 'smithing')],
  ['melvorD:allowSignetDrops', new ModifierTagMapEntryAttributes('loot')],
  ['melvorD:bonusCoalOnDungeonCompletion', new ModifierTagMapEntryAttributes('coal', 'dungeon')],
  ['melvorD:masteryPoolProgress', new ModifierTagMapEntryAttributes('mastery')],
  ['melvorD:doubleRuneProvision', new ModifierTagMapEntryAttributes('magic')],
  ['melvorD:bypassSlayerItems', new ModifierTagMapEntryAttributes('slayer')],
  ['melvorD:itemProtection', new ModifierTagMapEntryAttributes('protect_item')],
  ['melvorD:redemptionThreshold', new ModifierTagMapEntryAttributes('redemption')],
  ['melvorD:redemptionHealing', new ModifierTagMapEntryAttributes('redemption')],
  ['melvorD:autoLooting', new ModifierTagMapEntryAttributes('loot', 'combat')],
  ['melvorD:autoBurying', new ModifierTagMapEntryAttributes('prayer', 'combat')],
  ['melvorD:freeProtectItem', new ModifierTagMapEntryAttributes('protect_item')],
  ['melvorD:flatSummoningShardCost', new ModifierTagMapEntryAttributes('summoning')], // Would this count as "preservation" of resources? (if so, would have to check other modifiers which hopefully all have "cost" in their name)
  ['melvorD:summoningChargePreservationChance', new ModifierTagMapEntryAttributes('preservation', 'summoning')],
  ['melvorD:summoningChargePreservationChanceBypass', new ModifierTagMapEntryAttributes('preservation', 'summoning')],
  ['melvorD:prayerPointCost', new ModifierTagMapEntryAttributes('prayer')],
  ['melvorD:allowAttackAugmentingMagic', new ModifierTagMapEntryAttributes('magic')],
  ['melvorD:autoEquipFoodUnlocked', new ModifierTagMapEntryAttributes('cooking')],
  ['melvorD:autoSwapFoodUnlocked', new ModifierTagMapEntryAttributes('cooking', 'combat')],
  ['melvorD:successfulCookChance', new ModifierTagMapEntryAttributes('cooking')],
  ['melvorD:perfectCookChance', new ModifierTagMapEntryAttributes('cooking')],
  ['melvorD:thievingStealth', new ModifierTagMapEntryAttributes('thieving')],
  ['melvorD:altMagicRunePreservationChance', new ModifierTagMapEntryAttributes('preservation', 'magic')],
  ['melvorD:fishingSpecialChance', new ModifierTagMapEntryAttributes('fishing')],
  ['melvorD:farmingSeedCost', new ModifierTagMapEntryAttributes('farming')],
  ['melvorD:flatFarmingSeedCost', new ModifierTagMapEntryAttributes('farming')],
  ['melvorD:foodPreservationChance', new ModifierTagMapEntryAttributes('preservation', 'food')],
  ['melvorD:allowLootContainerStacking', new ModifierTagMapEntryAttributes('loot')],
  ['melvorD:woodcuttingXPAddedAsFiremakingXP', new ModifierTagMapEntryAttributes('woodcutting', 'firemaking')], // TODO: Allow for a third icon, so the info of "xp" could be added, while also keeping both relevant skills included?
  ['melvorD:flatCoalGainedOnCookingFailure', new ModifierTagMapEntryAttributes('coal', 'cooking')],
  ['melvorD:flatAbyssalGemsGainedOnCookingFailure', new ModifierTagMapEntryAttributes('gem', 'cooking')],
  ['melvorD:halveWoodcuttingDoubleChance', new ModifierTagMapEntryAttributes('woodcutting')],
  ['melvorD:qualitySuperiorGemChance', new ModifierTagMapEntryAttributes('gem', 'mining')],
  ['melvorD:doubleBoneDrops', new ModifierTagMapEntryAttributes('double', 'bones')],
  ['melvorD:summoningSynergy_Devil_Eagle', new ModifierTagMapEntryAttributes('thieving')],
  ['melvorD:xpFromNegativeObstacles', new ModifierTagMapEntryAttributes('xp', 'agility')],
  ['melvorD:masteryXPFromNegativeObstacles', new ModifierTagMapEntryAttributes('mastery', 'agility')],
  ['melvorD:thievingStunInterval', new ModifierTagMapEntryAttributes('stun', 'thieving')], // TODO: Add tag for "stun interval"?
  ['melvorD:skillInterval', new ModifierTagMapEntryAttributes('interval')],
  ['melvorD:woodcuttingArrowShaftChance', new ModifierTagMapEntryAttributes('woodcutting')],
  ['melvorD:passiveCookingInterval', new ModifierTagMapEntryAttributes('interval', 'cooking')],
  ['melvorD:disableGoldenStardustDrops', new ModifierTagMapEntryAttributes('golden_stardust', 'astrology')],
  ['melvorD:gpFromItemAlchemy', new ModifierTagMapEntryAttributes('item_alchemy')],
  ['melvorD:thievingAreaUniqueChance', new ModifierTagMapEntryAttributes('thieving')],
  ['melvorD:meteoriteLocationChance', new ModifierTagMapEntryAttributes('mining')],
  ['melvorD:thievingStunAvoidanceChance', new ModifierTagMapEntryAttributes('stun', 'thieving')],
  ['melvorD:additionalPerfectItemChance', new ModifierTagMapEntryAttributes('cooking')],
  ['melvorD:additionalItemBasedOnPrimaryQuantityChance', new ModifierTagMapEntryAttributes({positive: 'book', negative: 'book', ignoreIfSkillScope: true })],
  ['melvorD:flatTownshipPopulation', new ModifierTagMapEntryAttributes('ts_population', 'township')],
  ['melvorD:flatTownshipHappiness', new ModifierTagMapEntryAttributes('ts_happiness', 'township')],
  ['melvorD:flatTownshipEducation', new ModifierTagMapEntryAttributes('ts_education', 'township')],
  ['melvorD:townshipHealth', new ModifierTagMapEntryAttributes('ts_health', 'township')],
  ['melvorD:townshipGPProduction', new ModifierTagMapEntryAttributes('gp', 'township')],
  ['melvorD:townshipMaxStorage', new ModifierTagMapEntryAttributes('ts_storage', 'township')],
  ['melvorD:townshipBuildingCost', new ModifierTagMapEntryAttributes('building', 'township')],
  ['melvorD:townshipBuildingProduction', new ModifierTagMapEntryAttributes('building', 'township')],
  ['melvorD:townshipTaxPerCitizen', new ModifierTagMapEntryAttributes('gp', 'township')],
  ['melvorD:townshipDisableHunting', new ModifierTagMapEntryAttributes('township')], // Apparently not used anymore, so no icon improvement necessary
  ['melvorD:townshipResourceProduction', new ModifierTagMapEntryAttributes('township')],
  ['melvorD:townshipCoalUsage', new ModifierTagMapEntryAttributes('ts_coal', 'township')],
  ['melvorD:townshipBuildingHappinessPenalties', new ModifierTagMapEntryAttributes('ts_happiness', 'township')],
  ['melvorD:townshipFoodUsage', new ModifierTagMapEntryAttributes('ts_food', 'township')],
  ['melvorD:consumablePreservationChance', new ModifierTagMapEntryAttributes('preservation', 'consumable')],
  ['melvorD:gemVeinChance', new ModifierTagMapEntryAttributes('mining')],
  ['melvorD:abyssalGemVeinChanceIncrease', new ModifierTagMapEntryAttributes('mining')],
  ['melvorD:agilityPillarCost', new ModifierTagMapEntryAttributes('agility')],
  ['melvorD:abyssalWaveAPGain', new ModifierTagMapEntryAttributes('township')],
  ['melvorD:abyssalWaveASCGain', new ModifierTagMapEntryAttributes('township')],
  ['melvorD:nonCombatSkillXP', new ModifierTagMapEntryAttributes('xp', { positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:flatMeleeDefenceBonus', new ModifierTagMapEntryAttributes({positive: 'ti_dr_up', negative: 'ti_dr_dn'}, 'attack')],
  ['melvorD:flatRangedDefenceBonus', new ModifierTagMapEntryAttributes({positive: 'ti_dr_up', negative: 'ti_dr_dn'}, 'ranged')],
  ['melvorD:flatStabAttackBonus', new ModifierTagMapEntryAttributes({positive: 'offense_up', negative: 'offense_dn'})],
  ['melvorD:flatSlashAttackBonus', new ModifierTagMapEntryAttributes({positive: 'offense_up', negative: 'offense_dn'})],
  ['melvorD:flatBlockAttackBonus', new ModifierTagMapEntryAttributes({positive: 'offense_up', negative: 'offense_dn'})],
  ['melvorD:flatRangedAttackBonus', new ModifierTagMapEntryAttributes({positive: 'ti_ranged_up', negative: 'ti_ranged_dn'})],
  ['melvorD:flatMagicAttackBonus', new ModifierTagMapEntryAttributes({positive: 'ti_magic_up', negative: 'ti_magic_dn'})],
  ['melvorD:flatMeleeStrengthBonus', new ModifierTagMapEntryAttributes({positive: 'offense_up', negative: 'offense_dn'})],
  ['melvorD:flatRangedStrengthBonus', new ModifierTagMapEntryAttributes({positive: 'ti_ranged_up', negative: 'ti_ranged_dn'})],
  ['melvorD:disableSalamanderItemReduction', new ModifierTagMapEntryAttributes('nulled', 'summoning')],
  ['melvorD:masteryPoolCap', new ModifierTagMapEntryAttributes('mastery')],
  ['melvorD:bypassAllSlayerItems', new ModifierTagMapEntryAttributes('slayer')],
  ['melvorD:allowNonMagicCurses', new ModifierTagMapEntryAttributes('curse')],
  ['melvorD:townshipTraderStock', new ModifierTagMapEntryAttributes('ts_trader', 'township')],
  ['melvorD:cartographySightRange', new ModifierTagMapEntryAttributes('cartography')],
  ['melvorD:cartographySurveyRange', new ModifierTagMapEntryAttributes('cartography')],
  ['melvorD:cartographyTravelCost', new ModifierTagMapEntryAttributes('cartography')],
  ['melvorD:cartographySurveyInterval', new ModifierTagMapEntryAttributes('interval', 'cartography')],
  ['melvorD:cartographyPaperMakingInterval', new ModifierTagMapEntryAttributes('interval', 'cartography')],
  ['melvorD:cartographyMapUpgradeInterval', new ModifierTagMapEntryAttributes('interval', 'cartography')],
  ['melvorD:cartographySurveyXP', new ModifierTagMapEntryAttributes('xp', 'cartography')],
  ['melvorD:mapUpgradeActions', new ModifierTagMapEntryAttributes('map', 'cartography')],
  ['melvorD:initialMapArtefactValues', new ModifierTagMapEntryAttributes('map', 'cartography')],
  ['melvorD:sieveToolLevel', new ModifierTagMapEntryAttributes('arch_sieve', 'archaeology')],
  ['melvorD:trowelToolLevel', new ModifierTagMapEntryAttributes('arch_trowel', 'archaeology')],
  ['melvorD:brushToolLevel', new ModifierTagMapEntryAttributes('arch_brush', 'archaeology')],
  ['melvorD:shovelToolLevel', new ModifierTagMapEntryAttributes('arch_shovel', 'archaeology')],
  ['melvorD:ancientRelicLocationChance', new ModifierTagMapEntryAttributes('ancient_relics')],
  ['melvorD:flatAdditionalHolyDustFromBlessedOffering', new ModifierTagMapEntryAttributes('holy_dust', 'magic')],
  ['melvorD:flatPrayerPointsFromBurying', new ModifierTagMapEntryAttributes('prayer')],
  ['melvorD:additionalSameAreaFishChance', new ModifierTagMapEntryAttributes('fishing')],
  ['melvorD:skillPetLocationChance', new ModifierTagMapEntryAttributes('pet')],
  ['melvorD:prayerPointsFromBurying', new ModifierTagMapEntryAttributes('prayer')],
  ['melvorD:ignoreThievingDamage', new ModifierTagMapEntryAttributes('defence', 'thieving')],
  ['melvorD:xpFromMasteryTokens', new ModifierTagMapEntryAttributes('mastery')],
  ['melvorD:craftingEnchantedUrnChance', new ModifierTagMapEntryAttributes('crafting')],
  ['melvorD:halveSkillInterval', new ModifierTagMapEntryAttributes('interval', { positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:halveSkillXP', new ModifierTagMapEntryAttributes('xp', { positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:halveMasteryXP', new ModifierTagMapEntryAttributes('mastery', { positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:flatMasteryTokens', new ModifierTagMapEntryAttributes('mastery')],
  ['melvorD:townshipRepairCost', new ModifierTagMapEntryAttributes('ts_repair', 'township')],
  ['melvorD:townshipTraderCost', new ModifierTagMapEntryAttributes('ts_trader', 'township')],
  ['melvorD:enableNightfallSeason', new ModifierTagMapEntryAttributes('ts_season_nightfall', 'township')],
  ['melvorD:enableSolarEclipseSeason', new ModifierTagMapEntryAttributes('ts_season_eclipse', 'township')],
  ['melvorD:enableEternalDarknessSeason', new ModifierTagMapEntryAttributes('ts_season_eternal_darkness', 'township')],
  ['melvorD:allowUnholyPrayerUse', new ModifierTagMapEntryAttributes('prayer', 'combat')],
  ['melvorD:unholyPrayerPointPreservationChance', new ModifierTagMapEntryAttributes('prayer', 'unholy')],
  ['melvorD:disableTownshipHealthDegradation', new ModifierTagMapEntryAttributes('ts_health', 'township')],
  ['melvorD:minimumTownshipBuildingEfficiency', new ModifierTagMapEntryAttributes('building', 'township')],
  ['melvorD:enableLemonSeason', new ModifierTagMapEntryAttributes('lemon', 'township')],
  ['melvorD:bypassGlobalPreservationChance', new ModifierTagMapEntryAttributes('preservation')],
  ['melvorD:unlockAllSummoningSynergies', new ModifierTagMapEntryAttributes('summoning')], // TODO: Add tag for "summoning synergy"?
  ['melvorD:agilityItemCostReductionCanReach100', new ModifierTagMapEntryAttributes('agility')],
  ['melvorD:agilityObstacleItemCost', new ModifierTagMapEntryAttributes('agility')],
  ['melvorD:removeDebuffsFromAgility', new ModifierTagMapEntryAttributes('agility')],
  ['melvorD:harvestingUniqueProductChance', new ModifierTagMapEntryAttributes('harvesting')],
  ['melvorD:doubleModifiersInAstrologyForMaxedConstellations', new ModifierTagMapEntryAttributes('astrology')],
  ['melvorD:mapRefinementCost', new ModifierTagMapEntryAttributes('map', 'cartography')],
  ['melvorD:travelEventChance', new ModifierTagMapEntryAttributes('cartography')],
  ['melvorD:tinyArtefactChance', new ModifierTagMapEntryAttributes('arch_sieve', 'archaeology')],
  ['melvorD:smallArtefactChance', new ModifierTagMapEntryAttributes('arch_sieve', 'archaeology')],
  ['melvorD:mediumArtefactChance', new ModifierTagMapEntryAttributes('arch_sieve', 'archaeology')],
  ['melvorD:largeArtefactChance', new ModifierTagMapEntryAttributes('arch_sieve', 'archaeology')],
  ['melvorD:tinyArtefactValue', new ModifierTagMapEntryAttributes('arch_sieve', 'archaeology')],
  ['melvorD:smallArtefactValue', new ModifierTagMapEntryAttributes('arch_sieve', 'archaeology')],
  ['melvorD:mediumArtefactValue', new ModifierTagMapEntryAttributes('arch_sieve', 'archaeology')],
  ['melvorD:largeArtefactValue', new ModifierTagMapEntryAttributes('arch_sieve', 'archaeology')],
  ['melvorD:archaeologyVeryRareMapPreservation', new ModifierTagMapEntryAttributes('map', 'archaeology')],
  ['melvorD:archaeologyCommonItemSkillXP', new ModifierTagMapEntryAttributes('archaeology')],
  ['melvorD:flatDigSiteMapCharges', new ModifierTagMapEntryAttributes('map', 'cartography')],
  ['melvorD:disabledSpecialAttacks', new ModifierTagMapEntryAttributes('nulled', 'special_attack')],
  ['melvorD:meleeStrengthBonusPer10EnemyDR', new ModifierTagMapEntryAttributes({positive: 'ti_strength_up', negative: 'ti_strength_dn'}, 'defence')],
  ['melvorD:doubleConsumablesArchaeology', new ModifierTagMapEntryAttributes('archaeology')],
  ['melvorD:doubleActiveModifiersCartography', new ModifierTagMapEntryAttributes('cartography')],
  ['melvorD:soulPointPreservationChance', new ModifierTagMapEntryAttributes('preservation', 'prayer')], // TODO: Add tag for "soulpoint"?
  ['melvorD:soulPointPreservationChanceBypass', new ModifierTagMapEntryAttributes('preservation', 'prayer')], // TODO: Add tag for "soulpoint"?
  ['melvorD:skillCostReduction', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})], // TODO: Add tag for "cost"?
  ['melvorD:hPRegenBasedOnMaxHP', new ModifierTagMapEntryAttributes('regen', 'hitpoints')],
  ['melvorD:abyssalSkillXP', new ModifierTagMapEntryAttributes('xp', { positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})], // "Abyssal" text highlighting (english only) would technically be a realm indicator already here
  ['melvorD:regainAbyssalTreeSeedChance', new ModifierTagMapEntryAttributes('preservation', 'farming')],
  ['melvorD:abyssalGemChance', new ModifierTagMapEntryAttributes('gem')], // TODO: Some other gem-related modifiers had the "mining" tag instead; try standardizing all of those
  ['melvorD:ignoreThievingDamageChance', new ModifierTagMapEntryAttributes('defence', 'thieving')],
  ['melvorD:flatAdditionalPrimaryProductQuantity', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})],
  ['melvorD:flatSoulPointsPerMonsterKill', new ModifierTagMapEntryAttributes('prayer', 'combat')], // TODO: Add tag for "soulpoint"?
  ['melvorD:flatSoulPointCost', new ModifierTagMapEntryAttributes('prayer', 'combat')], // TODO: Add tag for "soulpoint"?
  ['melvorD:soulPointCost', new ModifierTagMapEntryAttributes('prayer', 'combat')], // TODO: Add tag for "soulpoint"? // TODO: Add tag for "cost"?
  ['melvorD:flatHarvestingIntensity', new ModifierTagMapEntryAttributes('harvesting')],
  ['melvorD:doubleHarvestingIntensityChance', new ModifierTagMapEntryAttributes('harvesting')],
  ['melvorD:townshipMaxSoulStorage', new ModifierTagMapEntryAttributes('township')], // TODO: Add (primary) tag for "soulpoint"?
  ['melvorD:starFallChance', new ModifierTagMapEntryAttributes('astrology')],
  ['melvorD:skillPreservationCap', new ModifierTagMapEntryAttributes('preservation', { positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})],
  ['melvorD:flatDrakeNestsFromThievingTreant', new ModifierTagMapEntryAttributes('thieving')], // TODO: Add (primary) tag for "Shadow Drake Nest" or "Thieving Blighted Trent"
  ['melvorD:woodcuttingDrakeNestJewelryChance', new ModifierTagMapEntryAttributes('jewelry', 'woodcutting')], // TODO: Add (primary) tag for "Shadow Drake Nest"? // TODO: Add ability to add more than two static icons?
  ['melvorD:woodcuttingAXPAddedAsFiremakingAXP', new ModifierTagMapEntryAttributes('woodcutting', 'firemaking')], // TODO: Add ability for more than two static icons, so "xp" icon can be included without removing either of the skill icons?
  ['melvorD:additionalAbyssalGemChance', new ModifierTagMapEntryAttributes('gem')], // TODO: Some other gem-related modifiers had the "mining" tag instead; try standardizing all of those
  ['melvorD:randomBarThievingWitheringRuinsChance', new ModifierTagMapEntryAttributes('thieving')], // TODO: Add tag for "thieving withering ruins"? Could also use iron_bar tag to indicate the bonus?
  ['melvorD:summoningSynergy_Imp_Devil', new ModifierTagMapEntryAttributes('harvesting')],
  ['melvorD:summoningSynergy_Abyssal_Leprechaun_Devil', new ModifierTagMapEntryAttributes('thieving')],
  ['melvorD:flatSoulPointsWhenHit', new ModifierTagMapEntryAttributes('prayer', 'combat')],
  ['melvorD:maxHitWith2AbyssalPrayers', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'prayer')],
  ['melvorD:minimumHarvestingIntensity', new ModifierTagMapEntryAttributes('harvesting')],
  ['melvorD:disableHarvestingVeinDegen', new ModifierTagMapEntryAttributes('nulled', 'harvesting')], // TODO: Add tag maybe for "harvesting vein"?
  ['melvorD:abyssalPrayerCost', new ModifierTagMapEntryAttributes('prayer')],
  ['melvorD:flatCombatAXPAgainstCorruptedMonsters', new ModifierTagMapEntryAttributes('xp', 'combat')],
  ['melvorD:farmingCropsCannotDie', new ModifierTagMapEntryAttributes('farming')],
  ['melvorD:cannotFishJunk', new ModifierTagMapEntryAttributes('fishing')],
  ['melvorD:fishingAdditionalSpecialItemChance', new ModifierTagMapEntryAttributes('fishing')],
  ['melvorD:miningNodeRespawnInterval', new ModifierTagMapEntryAttributes('interval', 'mining')],
  ['melvorD:runecraftingBaseXPForRunes', new ModifierTagMapEntryAttributes('xp', 'runecrafting')],
  ['melvorD:runecraftingBaseAXPForRunes', new ModifierTagMapEntryAttributes('xp', 'runecrafting')],
  ['melvorD:flatTier1SummoningShardCost', new ModifierTagMapEntryAttributes('summoning')], // TODO: Add tag for "cost"?
  ['melvorD:flatTier2SummoningShardCost', new ModifierTagMapEntryAttributes('summoning')], // TODO: Add tag for "cost"?
  ['melvorD:flatTier3SummoningShardCost', new ModifierTagMapEntryAttributes('summoning')], // TODO: Add tag for "cost"?
  ['melvorD:thievingAreaUniqueChancePercent', new ModifierTagMapEntryAttributes('thieving')],
  ['melvorD:meleeStrengthBonusWith2HWeapon', new ModifierTagMapEntryAttributes({positive: 'ti_strength_up', negative: 'ti_strength_dn'})],
  ['melvorD:evasionWith2HWeapon', new ModifierTagMapEntryAttributes({positive: 'evasion_up', negative: 'evasion_dn'})],
  ['melvorD:flatMeleeDefenceBonusPerAbyssalLevel', new ModifierTagMapEntryAttributes('defence', 'attack')],
  ['melvorD:flatRangedDefenceBonusPerAbyssalLevel', new ModifierTagMapEntryAttributes('defence', 'ranged')],
  ['melvorD:flatMagicDefenceBonusPerAbyssalLevel', new ModifierTagMapEntryAttributes('defence', 'magic')],
  ['melvorD:abyssalCombatSkillXP', new ModifierTagMapEntryAttributes('xp', 'combat')],
  ['melvorD:rangedStrengthBonusWith2HWeapon', new ModifierTagMapEntryAttributes({positive: 'ti_ranged_up', negative: 'ti_ranged_dn'})],
  ['melvorD:magicDamageBonusWith2HWeapon', new ModifierTagMapEntryAttributes({positive: 'ti_magic_up', negative: 'ti_magic_up'})],
  ['melvorD:flatSoulPointsFromReleasing', new ModifierTagMapEntryAttributes('prayer')], // TODO: Add tag for "soul point"?
  ['melvorD:slayerTaskExtensionCost', new ModifierTagMapEntryAttributes('slayer')], // TODO: Add tag for "cost"?
  ['melvorD:slayerTaskCost', new ModifierTagMapEntryAttributes('slayer')], // TODO: Add tag for "cost"?
  ['melvorD:permanentCorruptionCost', new ModifierTagMapEntryAttributes('corruption')], // TODO: Add tag for "cost"?
  ['melvorD:slashAttackBonus', new ModifierTagMapEntryAttributes({positive: 'ti_strength_up', negative: 'ti_strength_dn'}, 'attack')],
  ['melvorD:meleeAccuracyRatingWith2H', new ModifierTagMapEntryAttributes('accuracy', 'attack')],
  ['melvorD:useNoSummoningChargesAbyssalOctopus', new ModifierTagMapEntryAttributes('summoning')],
  ['melvorD:flatHiddenSkillLevel', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})],
  ['melvorD:flatSkillInterval', new ModifierTagMapEntryAttributes('interval', { positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})],
  ['melvorD:skillItemDoublingChance', new ModifierTagMapEntryAttributes('double', { positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})],
  ['melvorD:additionalPrimaryProductChance', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})],
  ['melvorD:additional2PrimaryProductChance', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})],
  ['melvorD:additional3PrimaryProductChance', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})],
  ['melvorD:additional5PrimaryProductChance', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})],
  ['melvorD:additional8PrimaryProductChance', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})],
  ['melvorD:doubleItemsSkill', new ModifierTagMapEntryAttributes('double', { positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})],
  ['melvorD:bypassDoubleItemsSkill', new ModifierTagMapEntryAttributes('double', { positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})],
  ['melvorD:skillMasteryXPPerDeedree', new ModifierTagMapEntryAttributes('mastery')], // TODO: Add secondary tag "Astrology"? Skill scope would then add a third tag for the actual skill
  ['melvorD:skillMasteryXPPerAmeria', new ModifierTagMapEntryAttributes('mastery')], // TODO: Add secondary tag "Astrology"? Skill scope would then add a third tag for the actual skill
  ['melvorD:skillMasteryXPPerVale', new ModifierTagMapEntryAttributes('mastery')], // TODO: Add secondary tag "Astrology"? Skill scope would then add a third tag for the actual skill
  ['melvorD:skillMasteryXPPerQimican', new ModifierTagMapEntryAttributes('mastery')], // TODO: Add secondary tag "Astrology"? Skill scope would then add a third tag for the actual skill
  ['melvorD:skillMasteryXPPerKo', new ModifierTagMapEntryAttributes('mastery')], // TODO: Add secondary tag "Astrology"? Skill scope would then add a third tag for the actual skill
  ['melvorD:skillMasteryXPPerArachi', new ModifierTagMapEntryAttributes('mastery')], // TODO: Add secondary tag "Astrology"? Skill scope would then add a third tag for the actual skill
  ['melvorD:skillMasteryXPPerIridan', new ModifierTagMapEntryAttributes('mastery')], // TODO: Add secondary tag "Astrology"? Skill scope would then add a third tag for the actual skill
  ['melvorD:skillMasteryXPPerHyden', new ModifierTagMapEntryAttributes('mastery')], // TODO: Add secondary tag "Astrology"? Skill scope would then add a third tag for the actual skill
  ['melvorD:skillMasteryXPPerSyllia', new ModifierTagMapEntryAttributes('mastery')], // TODO: Add secondary tag "Astrology"? Skill scope would then add a third tag for the actual skill
  ['melvorD:flatHiddenSkillLevelPer2Levels', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})], // TODO: Add tag for "level"?
  ['melvorD:flatHiddenSkillLevelBasedOnLevels', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})], // TODO: Add tag for "level"?
  ['melvorD:flatMeleeStrengthBonusBasedOnSkillLevel', new ModifierTagMapEntryAttributes({positive: 'ti_strength_up', negative: 'ti_strength_dn'})], // TODO: Add tag for "level"?
  ['melvorD:flatHiddenSkillLevelPer3Levels', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true})], // TODO: Add tag for "level"?
  ['melvorD:flatResistance', new ModifierTagMapEntryAttributes({positive: 'ti_dr_up', negative: 'ti_dr_dn'})],
  ['melvorD:flatResistanceAgainstMelee', new ModifierTagMapEntryAttributes({positive: 'ti_dr_up', negative: 'ti_dr_dn'}, 'attack')], // TODO: Would technically need to show the other combat styles instead
  ['melvorD:flatResistanceAgainstRanged', new ModifierTagMapEntryAttributes({positive: 'ti_dr_up', negative: 'ti_dr_dn'}, 'ranged')], // TODO: Would technically need to show the other combat styles instead
  ['melvorD:flatResistanceAgainstMagic', new ModifierTagMapEntryAttributes({positive: 'ti_dr_up', negative: 'ti_dr_dn'}, 'magic')], // TODO: Would technically need to show the other combat styles instead
  ['melvorD:resistance', new ModifierTagMapEntryAttributes({positive: 'ti_dr_up', negative: 'ti_dr_dn'})],
  ['melvorD:halveResistance', new ModifierTagMapEntryAttributes('ti_dr_dn')],
  ['melvorD:flatResistanceAgainstBosses', new ModifierTagMapEntryAttributes({positive: 'ti_dr_up', negative: 'ti_dr_dn'})], // TODO: Add secondary tag for "boss"
  ['melvorD:flatResistanceAgainstSlayerTasks', new ModifierTagMapEntryAttributes({positive: 'ti_dr_up', negative: 'ti_dr_dn'}, 'slayer')],
  ['melvorD:flatResistanceWithMagic2HWeapon', new ModifierTagMapEntryAttributes({positive: 'ti_dr_up', negative: 'ti_dr_dn'}, 'magic')],
  ['melvorD:flatResistancePer30Defence', new ModifierTagMapEntryAttributes({positive: 'ti_dr_up', negative: 'ti_dr_dn'}, 'defence')],
  ['melvorD:flatResistanceWithActivePrayer', new ModifierTagMapEntryAttributes({positive: 'ti_dr_up', negative: 'ti_dr_dn'}, 'prayer')],
  ['melvorD:maxHitBasedOnResistance', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'defence')],
  ['melvorD:maxHitBasedOnTargetResistance', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'defence')],
  ['melvorD:evasionBasedOnResistance', new ModifierTagMapEntryAttributes({positive: 'evasion_up', negative: 'evasion_dn'})],
  ['melvorD:meleeStrengthBonusPer10EnemyResistance', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'defence')],
  ['melvorD:flatMeleeDefenceBonusBasedOnResistance', new ModifierTagMapEntryAttributes('defence', 'attack')], // TODO: Technically add third icon, that would specifiy resistance? (right now only specified bonus id defence and against a specific style)
  ['melvorD:flatRangedDefenceBonusBasedOnResistance', new ModifierTagMapEntryAttributes('defence', 'ranged')], // TODO: Technically add third icon, that would specifiy resistance? (right now only specified bonus id defence and against a specific style)
  ['melvorD:flatMagicDefenceBonusBasedOnResistance', new ModifierTagMapEntryAttributes('defence', 'magic')], // TODO: Technically add third icon, that would specifiy resistance? (right now only specified bonus id defence and against a specific style)
  ['melvorD:ignoreResistanceWhenAttackingChance', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:healingOnHitBasedOnTargetResistance', new ModifierTagMapEntryAttributes('hitpoints', 'defence')],
  ['melvorD:healingOnAttackBasedOnResistance', new ModifierTagMapEntryAttributes('hitpoints', 'defence')],
  ['melvorD:maxHitAgainstDamageType', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'})],
  ['melvorD:accuracyRatingAgainstDamageType', new ModifierTagMapEntryAttributes('accuracy')],
  ['melvorD:doubleItemsChanceAgainstDamageType', new ModifierTagMapEntryAttributes('double')],
  ['melvorD:damageDealtToDamageTypeSlayerTasks', new ModifierTagMapEntryAttributes({positive: 'ti_combat_up', negative: 'ti_combat_dn'}, 'slayer')],
  ['melvorD:evasionAgainstDamageType', new ModifierTagMapEntryAttributes({positive: 'evasion_up', negative: 'evasion_dn'})],
  ['melvorD:maxHitpointsAgainstDamageType', new ModifierTagMapEntryAttributes('hitpoints')],
  ['melvorD:currencyGain', new ModifierTagMapEntryAttributes('currency')], // TODO: Add option to "ignoreTagOnCurrencyScope"
  ['melvorD:currencyGainFromCombat', new ModifierTagMapEntryAttributes('currency', 'combat')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the combat icon, if that is kept in...)
  ['melvorD:flatCurrencyGainFromMonsterDrops', new ModifierTagMapEntryAttributes('currency', 'combat')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the combat icon, if that is kept in...)
  ['melvorD:flatThievingCurrencyGain', new ModifierTagMapEntryAttributes('currency', 'thieving')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the thieving icon, if that is kept in...)
  ['melvorD:itemSaleCurrencyGain', new ModifierTagMapEntryAttributes('currency', 'bank')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the bank icon, if that is kept in...)
  ['melvorD:flatCurrencyGainOnEnemyHit', new ModifierTagMapEntryAttributes('currency', 'combat')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the combat icon, if that is kept in...)
  ['melvorD:flatCurrencyGainOnHitOnSlayerTask', new ModifierTagMapEntryAttributes('currency', 'slayer')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the slayer icon, if that is kept in...)
  ['melvorD:flatCurrencyGainWhenHitBasedOnResistance', new ModifierTagMapEntryAttributes('currency', 'defence')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the defence icon, if that is kept in...)
  ['melvorD:currencyGainOnMonsterKillBasedOnEvasion', new ModifierTagMapEntryAttributes('currency', 'combat')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the combat icon, if that is kept in...)
  ['melvorD:currencyGainPerDamageDealt', new ModifierTagMapEntryAttributes('currency', 'combat')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the combat icon, if that is kept in...)
  ['melvorD:currencyGainPerMeleeDamageDealt', new ModifierTagMapEntryAttributes('currency', 'combat')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the combat icon, if that is kept in...)
  ['melvorD:currencyGainPerRangedDamageDealt', new ModifierTagMapEntryAttributes('currency', 'ranged')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the ranged icon, if that is kept in...)
  ['melvorD:currencyGainPerMagicDamageDealt', new ModifierTagMapEntryAttributes('currency', 'magic')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the magic icon, if that is kept in...)
  ['melvorD:currencyGainPerMagicDamageDealtOnSlayerTask', new ModifierTagMapEntryAttributes('currency', 'slayer')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the slayer icon, if that is kept in...)
  ['melvorD:currencyGainFromMonsterDrops', new ModifierTagMapEntryAttributes('currency', 'combat')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the combat icon, if that is kept in...)
  ['melvorD:currencyGainFromSlayerTaskMonsterDrops', new ModifierTagMapEntryAttributes('currency', 'slayer')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the slayer icon, if that is kept in...)
  ['melvorD:currencyGainOnRegenBasedOnHPGained', new ModifierTagMapEntryAttributes('currency', 'hitpoints')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the hitpoints icon, if that is kept in...)
  ['melvorD:currencyGainFromLifesteal', new ModifierTagMapEntryAttributes('currency', 'lifesteal')],  // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the lifesteal icon, if that is kept in...)
  ['melvorD:minThievingCurrencyGain', new ModifierTagMapEntryAttributes('currency', 'thieving')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the thieving icon, if that is kept in...)
  ['melvorD:currencyGainFromNegativeObstacles', new ModifierTagMapEntryAttributes('currency', 'agility')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the agility icon, if that is kept in...)
  ['melvorD:currencyGainFromAgilityPerActiveObstacle', new ModifierTagMapEntryAttributes('currency', 'agility')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the agility icon, if that is kept in...)
  ['melvorD:currencyGainFromLogSales', new ModifierTagMapEntryAttributes('currency', 'bank')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the bank icon, if that is kept in...)
  ['melvorD:currencyGainFromRawFishSales', new ModifierTagMapEntryAttributes('currency', 'bank')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the bank icon, if that is kept in...)
  ['melvorD:flatCurrencyGain', new ModifierTagMapEntryAttributes('currency')], // TODO: Add option to "ignoreTagOnCurrencyScope"
  ['melvorD:currencyGainPerDamageDealtBasedOnCurrencyAmount', new ModifierTagMapEntryAttributes('currency', 'combat')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the combat icon, if that is kept in...)
  ['melvorD:minCurrencyMultiplierPerDamage', new ModifierTagMapEntryAttributes('currency', 'combat')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the combat icon, if that is kept in...)
  ['melvorD:maxCurrencyMultiplierPerDamage', new ModifierTagMapEntryAttributes('currency', 'combat')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the combat icon, if that is kept in...)
  ['melvorD:flatCurrencyGainPerArchaeologyLevelNoArtefact', new ModifierTagMapEntryAttributes('currency', 'archaeology')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the archeology icon, if that is kept in...)
  ['melvorD:agilityObstacleCurrencyCost', new ModifierTagMapEntryAttributes('agility')], // TODO: Add tag for "cost"?
  ['melvorD:currencyFromHarvestingChanceBasedOnLevel', new ModifierTagMapEntryAttributes('currency', 'harvesting')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the combat icon, if that is kept in...)
  ['melvorD:flatCurrencyGainOnMonsterKillBasedOnCombatLevel', new ModifierTagMapEntryAttributes('currency', 'combat')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the combat icon, if that is kept in...)
  ['melvorD:currencyGainFromSlayerTasks', new ModifierTagMapEntryAttributes('currency', 'slayer')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the slayer icon, if that is kept in...)
  ['melvorD:currencyGainFromMonsterDropsBasedOnDebuffs', new ModifierTagMapEntryAttributes('currency', 'combat')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the combat icon, if that is kept in...)
  ['melvorD:flatCurrencyGainFromMeleeSlayerTasksBasedOnCombatLevel', new ModifierTagMapEntryAttributes('currency', 'slayer')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the slayer icon, if that is kept in...)
  ['melvorD:flatCurrencyGainFromRangedSlayerTasksBasedOnCombatLevel', new ModifierTagMapEntryAttributes('currency', 'slayer')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the slayer icon, if that is kept in...)
  ['melvorD:flatCurrencyGainFromMagicSlayerTasksBasedOnCombatLevel', new ModifierTagMapEntryAttributes('currency', 'slayer')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the slayer icon, if that is kept in...)
  ['melvorD:currencyGainBasedOnSummonDamage', new ModifierTagMapEntryAttributes('currency', 'summoning')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the summoning icon, if that is kept in...)
  ['melvorD:currencyGainBasedOnBarrierDamage', new ModifierTagMapEntryAttributes('currency', 'barrier')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the barrier icon, if that is kept in...)
  ['melvorD:flatCurrencyGainOnEnemyHitBasedOnCombatLevel', new ModifierTagMapEntryAttributes('currency', 'combat')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the combat icon, if that is kept in...)
  ['melvorD:currencyGainPerPoisonDamage', new ModifierTagMapEntryAttributes('currency', 'poison')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the poison icon, if that is kept in...)
  ['melvorD:firemakingLogCurrencyGain', new ModifierTagMapEntryAttributes('currency', 'firemaking')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the firemaking icon, if that is kept in...)
  ['melvorD:fletchingItemToCurrencyChance', new ModifierTagMapEntryAttributes('currency', 'fletching')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the fletching icon, if that is kept in...)
  ['melvorD:crafting30CurrencyGainChance', new ModifierTagMapEntryAttributes('currency', 'crafting')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the crafting icon, if that is kept in...)
  ['melvorD:fishingCurrencyGainChance', new ModifierTagMapEntryAttributes('currency', 'fishing')], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the fishing icon, if that is kept in...)
  ['melvorD:actionsPerClick', new ModifierTagMapEntryAttributes('book')],
  ['melvorD:doubleActionsPerClickChance', new ModifierTagMapEntryAttributes('book')],
  ['melvorD:extraActionPerClickChance', new ModifierTagMapEntryAttributes('book')],
  ['melvorD:flatSlayerAreaEffectNegation', new ModifierTagMapEntryAttributes('slayer')],
  ['melvorD:doubleSoulDropChance', new ModifierTagMapEntryAttributes('double', 'prayer')],
  ['melvorD:doubleSoulDrops', new ModifierTagMapEntryAttributes('double', 'prayer')],
  ['melvorD:placeholderModifier', new ModifierTagMapEntryAttributes('placeholder')],
  ['melvorD:farmingSeedReturn', new ModifierTagMapEntryAttributes('preservation', 'farming')],
  ['melvorD:fishingMasteryDoublingChance', new ModifierTagMapEntryAttributes('mastery', 'fishing')],
  ['melvorD:halveAgilityObstacleNegatives', new ModifierTagMapEntryAttributes('agility')],
  ['melvorD:nonShardSummoningCostReduction', new ModifierTagMapEntryAttributes('summoning')],
  ['melvorD:runecraftingRuneCostReduction', new ModifierTagMapEntryAttributes('runecrafting')],
  ['melvorD:flatBasePrimaryProductQuantity', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:flatBasePrimaryProductQuantityChance', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:basePrimaryProductQuantity', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:randomProductChance', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:flatBaseRandomProductQuantity', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:currencyGainBasedOnProduct', new ModifierTagMapEntryAttributes('currency', { positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })], // TODO: Add option to "ignoreTagOnCurrencyScope" (only removing currency would cause issue though, as currency is the main bonus here but the scope would appear after the skill/item icon, if that is kept in...)
  ['melvorD:additionalRandomSkillItemChance', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:additionalRandomSkillItemChancePerInterval', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:additionalRandomGemChance', new ModifierTagMapEntryAttributes('gem', { positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:additionalRandomAbyssalGemChance', new ModifierTagMapEntryAttributes('gem', { positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:additionalRandomFragmentChance', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })], // TODO: Add primary tag for "fragment"? (if so, there were modifiers previously too)
  ['melvorD:additionalRandomFiremakingOilChance', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })], // TODO: Add primary tag for "firemaking oil"?
  ['melvorD:additionalRandomAbyssalGemChancePerInterval', new ModifierTagMapEntryAttributes('gem', { positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:flatAdditionalSkillItem', new ModifierTagMapEntryAttributes({ positive: 'skill', negative: 'skill', ignoreIfSkillScope: true })],
  ['melvorD:firemakingBonfireInterval', new ModifierTagMapEntryAttributes('interval', 'firemaking')],
  ['melvorD:astrologyModifierCost', new ModifierTagMapEntryAttributes('astrology')], // TODO: Add tag for "cost"?
  ['melvorD:flatAdditionalThievingCommonDropQuantity', new ModifierTagMapEntryAttributes('thieving')],
  ['melvorD:flatSpellRuneCost', new ModifierTagMapEntryAttributes('magic')],
  ['melvorD:flatAttackSpellRuneCost', new ModifierTagMapEntryAttributes('magic')], // TODO: Add tag for "cost"?
  ['melvorAoD:digSiteMapSlots', new ModifierTagMapEntryAttributes('archaeology')],
  ['melvorAoD:mapChargePreservationChance', new ModifierTagMapEntryAttributes('cartography')],
  ['melvorAoD:artefactValue', new ModifierTagMapEntryAttributes('archaeology')],
  ['melvorIta:maxHarvestingIntensity', new ModifierTagMapEntryAttributes('harvesting')]
]);