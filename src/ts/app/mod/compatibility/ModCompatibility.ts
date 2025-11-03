export abstract class ModCompatbility {
    /** Version the current state of the compatibility is based on (e.g. '1.0.0') */
    protected abstract _version: string;

    /** Namespaces by which monsters can be retrieved (e.g. 'tinyIconsKuma') */
    protected abstract _namespace: string;

    /** Name by which it can be checked whether the mod is loaded (e.g. '[Refurbished] Tiny Icons') */
    protected abstract _name: string;

    /**
     * Checks whether the given mod is loaded
     * @returns
     */
    protected modIsLoaded(): boolean {
        return mod.manager.getLoadedModList().includes(this._name);
    }
}