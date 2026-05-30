export function collectSkillTreeNodes() {
    const out: Array<{ context: any, entity: any }> = [];
    const g: any = (window as any).game;
    if (!g || !g.skills) return out;

    const skills = g.skills.allObjects || g.skills.getAllObjects?.() || [];
    for (const skill of skills) {
        if (!skill) continue;
        const skillTrees = skill.skillTrees?.allObjects || skill.skillTrees?.getAllObjects?.() || [];
        for (const st of skillTrees) {
            const nodes = st.nodes?.allObjects || st.nodes?.getAllObjects?.() || [];
            for (const node of nodes) {
                if (!node || !node.id) continue;
                out.push({ context: { skillId: skill.id, skillTreeId: st.id, skillTreeNodeId: node.id }, entity: node });
            }
        }
    }

    return out;
}
