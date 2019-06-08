import type { CircleEquation, CoordinateType, NodeType, PointDetailsType, RelationsResultType } from './types/types';
import { calculateIntersectionTwoCircleEquations } from "./utils/math/Math2D";
import { NOT_ENOUGH_SET } from "./utils/values";
const NOT_FOUND = 99;

class AppModel {
  additionSegment: string[] = [];
  relationsResult: RelationsResultType = {};
  pointsMap: Array<NodeType> = [];
  executedRelations = [];
  executedNode = [];
  __pointDetails__ = new Map();

  clear() {
    this.relationsResult = [];
    this.pointsMap = [];
    this.executedRelations = [];
    this.executedNode = [];
    this.__pointDetails__.clear();
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
      if (node) {
        return node.coordinate.x !== undefined && node.coordinate.y !== undefined;
      }
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
    const rankingOrderDesc = ['static', 'dependence'];

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

  _calculateSet(equations: Array<CircleEquation>) {
    if (equations.length === 2) {
      return calculateIntersectionTwoCircleEquations(equations[0], equations[1]);
    } else return NOT_ENOUGH_SET;
  }

  _updatePointDetails(pointId: string, pointDetails: PointDetailsType) {
    this.__pointDetails__.set(pointId, {
      setOfEquation: pointDetails.setOfEquation,
      roots: pointDetails.roots,
      exceptedCoordinates: pointDetails.exceptedCoordinates
    });
  }

  executePointDetails(pointId: string, equation: CircleEquation) {
    // if (this.__pointDetails__.get(pointId))
  }
}

const appModel = new AppModel();

export default appModel;
