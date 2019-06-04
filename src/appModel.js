import type { NodeType, RelationsResultType } from './types/types';
const NOT_FOUND = 99;

class AppModel {
  relationsResult: RelationsResultType = {};
  pointsMap: Array<NodeType> = [];
  executedRelations = [];
  executedNode = [];

  clear() {
    this.relationsResult = [];
    this.pointsMap = [];
    this.executedRelations = [];
    this.executedNode = [];
  }

  updateCoordinate = (nodeId: string, coordinate: CoordinateType): void => {
    const index = this.getIndexOfNodeInPointsMapById(nodeId);
    if (index !== NOT_FOUND) {
      this.pointsMap[index].coordinate = coordinate;
    }
  };

  isStaticNode = (node: NodeType): boolean => {
    if (node.isStatic) return true;
    for (let i = 0; i < node.dependentNodes.length; i++) {
      if (!this.isExecutedRelation(node.dependentNodes[i].relation)) return false;
    }

    return this.executedNode.includes(node.id);
  };

  isExecutedRelation = (relation: any): boolean => {
    for (let i = 0; i < this.executedRelations.length; i++) {
      if (relation === this.executedRelations[i]) return true;
    }
    return false;
  };

  updateStaticNode = () => {
    this.pointsMap = this.pointsMap.map(
      (node: NodeType): NodeType => {
        node.isStatic = this.isStaticNode(node);
        return node;
      }
    );
  };

  updatePointsMap = (node: NodeType) => {
    let index = this.getIndexOfNodeInPointsMapById(node.id);
    this.pointsMap[index] = node;
  };

  isPointsMapStatic = (): boolean => {
    for (let i = 0; i < this.pointsMap.length; i++) {
      if (!this.pointsMap[i].isStatic) return false;
    }
    return true;
  };

  isValidCoordinate = (nodeId: string) => {
    if (nodeId) {
      const node = this.getNodeInPointsMapById(nodeId);
      return node.coordinate.x && node.coordinate.y;
    }
    return false;
  };

  getNextExecuteNode = (): NodeType => {
    const clonePointsMap = [...this.pointsMap]
      .filter((node) => !this.executedNode.includes(node.id))
      .sort(this.sortNodeByPriority);

    if (clonePointsMap.length > 0) return clonePointsMap[0];
    return null;
  };

  sortNodeByPriority = (nodeOne: NodeType, nodeTwo: NodeType): number => {
    const staticNodeOneCount = this.getDependentStaticNodeCount(nodeOne);
    const nodeOneData = {
      static: staticNodeOneCount,
      nonStatic: nodeOne.dependentNodes.length - staticNodeOneCount,
      dependence: nodeOne.dependentNodes.length,
      minRelationIndex: this.getMinIndexOfDependentNodeInRelationsList(nodeOne),
      index: this.getIndexOfNodeInPointsMap(nodeOne)
    };

    const staticNodeTwoCount = this.getDependentStaticNodeCount(nodeTwo);
    const nodeTwoData = {
      static: staticNodeTwoCount,
      nonStatic: nodeTwo.dependentNodes.length - staticNodeTwoCount,
      dependence: nodeTwo.dependentNodes.length,
      minRelationIndex: this.getMinIndexOfDependentNodeInRelationsList(nodeTwo),
      index: this.getIndexOfNodeInPointsMap(nodeTwo)
    };

    //get Max
    const rankingOrderDesc = ['dependence', 'static'];

    //get Min
    const rankingOrderAsc = ['nonStatic', 'minRelationIndex', 'index'];

    let rankOne = nodeOneData.static === nodeOneData.dependence ? '1' : '0';
    let rankTwo = nodeTwoData.static === nodeTwoData.dependence ? '1' : '0';

    rankingOrderDesc.forEach((key) => {
      if (nodeOneData[key] > nodeTwoData[key]) {
        rankOne += '1';
        rankTwo += '0';
      } else if (nodeOneData[key] === nodeTwoData[key]) {
        rankOne += '1';
        rankTwo += '1';
      } else {
        rankOne += '0';
        rankTwo += '1';
      }
    });

    rankingOrderAsc.forEach((key) => {
      if (nodeOneData[key] < nodeTwoData[key]) {
        rankOne += '1';
        rankTwo += '0';
      } else if (nodeOneData[key] === nodeTwoData[key]) {
        rankOne += '1';
        rankTwo += '1';
      } else {
        rankOne += '0';
        rankTwo += '1';
      }
    });

    return parseInt(rankTwo) - parseInt(rankOne);
  };

  getMinIndexOfDependentNodeInRelationsList = (node: NodeType) => {
    const indexArray = [];
    for (let i = 0; i < node.dependentNodes.length; i++) {
      indexArray.push(this.getIndexOfRelationInRelationsList(node.dependentNodes[i]));
    }

    return Math.min(...indexArray);
  };

  getIndexOfRelationInRelationsList = (relation: any): number => {
    const list = [...this.relationsResult.shapes, ...this.relationsResult.relations];
    for (let i = 0; i < list.length; i++) {
      if (relation === list[i]) return i;
    }
    return NOT_FOUND;
  };

  getDependentStaticNodeCount = (node: NodeType): number => {
    let count = 0;
    for (let i = 0; i < node.dependentNodes.length; i++) {
      if (this.isStaticNodeById(node.dependentNodes[i].id)) count++;
    }

    return count;
  };

  getIndexOfNodeInPointsMap = (node): number => {
    for (let i = 0; i < this.pointsMap.length; i++) {
      if (node === this.pointsMap[i]) return i;
    }
    return NOT_FOUND;
  };

  getIndexOfNodeInPointsMapById = (id: string): number => {
    for (let i = 0; i < this.pointsMap.length; i++) {
      if (id === this.pointsMap[i].id) return i;
    }
    return NOT_FOUND;
  };

  getNodeInPointsMapById = (id: string): NodeType | null => {
    for (let i = 0; i < this.pointsMap.length; i++) {
      if (id === this.pointsMap[i].id) return this.pointsMap[i];
    }
    return null;
  };

  isStaticNodeById = (id: string): boolean => {
    for (let i = 0; i < this.pointsMap.length; i++) {
      if (id === this.pointsMap[i].id) {
        return this.isStaticNode(this.pointsMap[i]);
      }
    }
    return false;
  };
}

const appModel = new AppModel();

export default appModel;
