/**
 * Definition of mod settings
 */
export type TinyIconsModSettings = {
  globalIconsEnabled: boolean,
  secondaryIconsEnabled: boolean,
  placeholderIconEnabled: boolean,
  scopeIcons: TrueFlags<IModifierScope>
}