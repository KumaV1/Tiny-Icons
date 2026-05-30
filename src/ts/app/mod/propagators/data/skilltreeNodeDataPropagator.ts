import { Logger } from "../../Logger";
import { PropagatorBaseContextData } from "../../types/data/propagatorBaseContextData";
import { PropagatorBaseDataData } from "../../types/data/propagatorBaseDataData";
import { EntityModificationDataPropagator } from "./entityModificationDataPropagator";

interface SkillTreeNodePropagatorContextData extends PropagatorBaseContextData {
    skillId: string
    skillTreeId: string
    skillTreeNodeId: string;
}

// Example where more than just "category" and "id" are necessary!
export class SkillTreeNodeDataPropagator extends EntityModificationDataPropagator<SkillTreeNode,
    SkillTreeNodePropagatorContextData,
    PropagatorBaseDataData> {

    description = "Resolves the conditional modifier objects to be provided with tiny icon data. As the description always uses stat formatting, description tags are a noop";

    /**
     * 
     * @param context
     * @returns
     */
    getEntity(context: SkillTreeNodePropagatorContextData): SkillTreeNode {
        const skill = game.skills.getObjectSafe(context.skillId);
        const skillTree = skill.skillTrees.getObjectSafe(context.skillTreeId);
        return skillTree.nodes.getObjectSafe(context.skillTreeNodeId);
    }

    /**
     * 
     * @param entity
     * @param tags
     */
    //propagateForDescriptionOfEntity(entity: SkillTreeNode, tags: string[]) {
    //    Logger.warn('SkillTreeNodeDataPropagator.propagateForDescriptionOfEntity is basically a noop');
    //}
}