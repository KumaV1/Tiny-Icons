export function collectAgilityObjects() {
  const out: Array<{ context: any, entity: any }> = [];

  // Collect obstacles
  const obstacles = game.agility.actions.allObjects;
  for (const obj of obstacles) {
    if (!obj || !obj.id) {
      continue;
    }

    out.push({ context: { id: obj.id, objectType: 'Obstacle' }, entity: obj });
  }

  // Collect pillars
  const pillars = game.agility.pillars.allObjects;
  for (const obj of pillars) {
    if (!obj || !obj.id) {
      continue;
    }

    out.push({ context: { id: obj.id, objectType: 'Pillar' }, entity: obj });
  }

  return out;
}
