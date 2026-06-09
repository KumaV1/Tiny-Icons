/**
 * Definition of mod settings
 */
export type TinyIconsModSettings = {
  manualTaggingEnabled: boolean,
  globalIconsEnabled: boolean,
  secondaryIconsEnabled: boolean,
  placeholderIconEnabled: boolean,
  scopeIcons: TrueFlags<IModifierScope>
}