import { Main } from './app/main';
import manifest from '../../manifest.json';
import { Constants } from './app/constants';
import { Logger } from './app/mod/Logger';
export async function setup(modContext: Modding.ModContext) {
    if (Constants.DEV_MODE) {
        Logger.log(manifest.name + ' v' + manifest.version + ' loading...');
    }

    const mod = new Main();
    mod.init(modContext);
}
