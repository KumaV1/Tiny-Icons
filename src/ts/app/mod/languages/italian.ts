export const it = {
    MODIFIER_SCOPES_SKILL: 'Skill',
    MODIFIER_SCOPES_DAMAGE_TYPE: 'Damage Type',
    MODIFIER_SCOPES_REALM: 'Realm',
    MODIFIER_SCOPES_CURRENCY: 'Currency',
    MODIFIER_SCOPES_CATEGORY: 'Category',
    MODIFIER_SCOPES_ACTION: 'Action',
    MODIFIER_SCOPES_SUBCATEGORY: 'Sucategory',
    MODIFIER_SCOPES_ITEM: 'Item',
    MODIFIER_SCOPES_EFFECT_GROUP: 'Combat effect group',

    SETTINGS_RELOAD_TEXT: 'Reload required',
    SETTINGS_SAVE_AND_RELOAD_TEXT: 'Save & Reload',

    SETTINGS_SETTING_GLOBAL_ICONS_LABEL: 'Enable Global Icons',
    SETTINGS_SETTING_GLOBAL_ICONS_HINT: 'Show icons outside of Astrology and Agility.',

    SETTINGS_SETTING_SECONDARY_ICONS_LABEL: 'Enable Secondary Icons',
    //SETTINGS_SETTING_SECONDARY_ICONS_HINT = '',

    SETTINGS_SETTING_PLACEHOLDER_ICONS_LABEL: 'Enable Placeholder Icons',
    SETTINGS_SETTING_PLACEHOLDER_ICONS_HINT: 'If enabled, then whenever the mod determines an icon should have been placed, but failed to determine which one, a cog icon will be used. This is primarily relevant for dynamically determined icons, which happens when a boost has a set scope. Though it can also happen when a new modifier is added (e.g. through another mod) which this mod does not (yet) know.',

    SETTINGS_SETTING_SCOPE_ICONS_LABEL: 'Enable scope icons',
    SETTINGS_SETTING_SCOPE_ICONS_HINT: 'Scope is the limitation of an initially "generic" buff. For example, for a generic modifier to increase your currency gain, the boost can be set to limit this effect to only GP.',

    SETTINGS_SETTING_SCOPE_ICONS_OPTION_SKILL_HINT: 'For example, a skill xp buff only affecting Agility. In which case the "Agility skill" icon should be displayed.',
    SETTINGS_SETTING_SCOPE_ICONS_OPTION_DAMAGE_TYPE_HINT: 'For example, a damage buff only affecting "Pure" damage. In which case the "Pure Damage" icon should be displayed.',
    SETTINGS_SETTING_SCOPE_ICONS_OPTION_REALM_HINT: 'Only relevant with certain expansions and possibly mods. For example, a damage buff only working in the "Normal" realm. In which case the "Normal Realm" icon should be displayed.',
    SETTINGS_SETTING_SCOPE_ICONS_OPTION_CURRENCY_HINT: 'For example, a currency gain buff only affecting GP. In which case the "GP" icon should be displayed.',
    SETTINGS_SETTING_SCOPE_ICONS_OPTION_CATEGORY_HINT: 'What the "Category" is varies on the source that is affected. In Cooking, for example, a buff that only affects the Cooking Fire. In which case the icon of the Cooking Fire should be displayed.',
    SETTINGS_SETTING_SCOPE_ICONS_OPTION_ACTION_HINT: 'For example, a buff to gain additional resources, but only when woodcutting the willow tree. In which case, the "Willow tree" icon should be displayed.',
    SETTINGS_SETTING_SCOPE_ICONS_OPTION_SUBCATEGORY_HINT: 'What the "Subcategory" is varies on the source that is affected. In Cooking, for example, this can be a "category/group", such as "All fish". In which case an icon representing "All fish" should be displayed.',
    SETTINGS_SETTING_SCOPE_ICONS_OPTION_ITEM_HINT: 'For example, a buff that provides you with an item during any skilling action (of a particular skill). For example, a buff that provides you a "Fire rune" whenever you craft a rune. In which case the icon of the "Fire Rune" item should be displayed.',
    SETTINGS_SETTING_SCOPE_ICONS_OPTION_EFFECT_GROUP_HINT: 'Combat effects can be singular ones (e.g. "Burn") or categorized into groups (e.g. "Damage-over-time"). For example, a debuff that reduces your damage while affected by any sort of "Damage-over-time". In which case an icon representing "Damage-over-time damage" should be displayed.',
};