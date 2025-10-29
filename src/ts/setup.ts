import { Main } from './app/main';
import manifest from '../../manifest.json';
export async function setup(modContext: Modding.ModContext) {
  //console.log(manifest.name + ' v' + manifest.version + ' loading...');
  const mod = new Main();
  mod.init(modContext);
}
