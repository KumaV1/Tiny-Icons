export function collectSkillTreeNodes() {
    const out: Array<{ context: any, entity: any }> = [];

    const skills = game.skills.allObjects;
    for (const skill of skills) {
        if (!skill) {
            continue;
        }

        const skillTrees = skill.skillTrees?.allObjects || [];
        for (const st of skillTrees) {
            const nodes = st.nodes?.allObjects || []
            for (const node of nodes) {
                if (!node || !node.id) {
                    continue;
                }

                out.push({ context: { skillId: skill.id, skillTreeId: st.id, skillTreeNodeId: node.id }, entity: node });
            }
        }
    }

    return out;
}
