export function collectAttackStyles() {
  const out: Array<{ context: any, entity: any }> = [];

  const objs = game.attackStyles.allObjects;
  for (const obj of objs) {
    if (!obj || !obj.id) {
      continue;
    }

    out.push({ context: { id: obj.id }, entity: obj });
  }

  return out;
}
