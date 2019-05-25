import type { CoordinateType, DrawingNodeType, LinearEquation, NodeRelationType, NodeType } from '../../types/types';
import appModel from '../../appModel';
import {
  calculateLinearEquationFromTwoPoints,
  calculateParallelLineByPointAndLine,
  calculatePerpendicularLineByPointAndLine
} from '../math/Math2D';
import { mappingShapeType, shapeRules } from '../../configuration/define';

const executedRelations = [];
const executedNode = [];
const NOT_FOUND = 99;

export function readPointsMap(): Array<DrawingNodeType> {
  while (!_isPointsMapStatic()) {
    //get node to calculate
    const executingNode = _getNextExecuteNode();
    if (!executingNode) break;

    const executingNodeRelations = _makeUniqueNodeRelation(executingNode.dependentNodes);

    executingNodeRelations.forEach((relation) => {
      if (relation.outputType === 'shape') {
        const shapeName = Object.keys(relation).filter((key) => key !== 'type')[0];
        const shapeType = mappingShapeType[relation.type] || 'normal';
        console.log(shapeType);
        if (shapeRules[shapeName][shapeType]) {
          makeCorrectShape(relation[shapeName], shapeRules[shapeName][shapeType], executingNode.id);
        }
      }
      if (!_isExecutedRelation(relation)) {
        // calculate
        executedRelations.push(relation);
      }
    });

    //Update calculated value to pointsMap
    _updatePointsMap(executingNode);
    executedNode.push(executingNode.id);

    //update static Node
    _updateStaticNode();
  }

  return appModel.pointsMap.map((node) => ({
    id: node.id,
    coordinate: node.coordinate
  }));
}

export function updateCoordinate(nodeId: string, coordinate: CoordinateType): void {
  const index = _getIndexOfNodeInPointsMapById(nodeId);
  if (index !== NOT_FOUND) {
    appModel.pointsMap[index].coordinate = coordinate;
  }
}

function _isStaticNode(node: NodeType): boolean {
  if (node.isStatic) return true;
  for (let i = 0; i < node.dependentNodes.length; i++) {
    if (!_isExecutedRelation(node.dependentNodes[i].relation)) return false;
  }

  return executedNode.includes(node.id);
}

function _isExecutedRelation(relation: any): boolean {
  for (let i = 0; i < executedRelations.length; i++) {
    if (relation === executedRelations[i]) return true;
  }
  return false;
}

function _updateStaticNode() {
  appModel.pointsMap = appModel.pointsMap.map(
    (node: NodeType): NodeType => {
      node.isStatic = _isStaticNode(node);
      return node;
    }
  );
}

function _updatePointsMap(node: NodeType) {
  let index = _getIndexOfNodeInPointsMapById(node.id);
  appModel.pointsMap[index] = node;
}

function _isPointsMapStatic(): boolean {
  for (let i = 0; i < appModel.pointsMap.length; i++) {
    if (!appModel.pointsMap[i].isStatic) return false;
  }
  return true;
}

function _getNextExecuteNode(): NodeType {
  const clonePointsMap = [...appModel.pointsMap]
    .filter((node) => !executedNode.includes(node.id))
    .sort(sortNodeByPriority);

  console.log(clonePointsMap);
  if (clonePointsMap.length > 0) return clonePointsMap[0];
  return null;
}

function sortNodeByPriority(nodeOne: NodeType, nodeTwo: NodeType): number {
  const staticNodeOneCount = _getDependentStaticNodeCount(nodeOne);
  const nodeOneData = {
    static: staticNodeOneCount,
    nonStatic: nodeOne.dependentNodes.length - staticNodeOneCount,
    dependence: nodeOne.dependentNodes.length,
    minRelationIndex: _getMinIndexOfDependentNodeInRelationsList(nodeOne),
    index: _getIndexOfNodeInPointsMap(nodeOne)
  };

  const staticNodeTwoCount = _getDependentStaticNodeCount(nodeTwo);
  const nodeTwoData = {
    static: staticNodeTwoCount,
    nonStatic: nodeTwo.dependentNodes.length - staticNodeTwoCount,
    dependence: nodeTwo.dependentNodes.length,
    minRelationIndex: _getMinIndexOfDependentNodeInRelationsList(nodeTwo),
    index: _getIndexOfNodeInPointsMap(nodeTwo)
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
}

function _getMinIndexOfDependentNodeInRelationsList(node: NodeType) {
  const indexArray = [];
  for (let i = 0; i < node.dependentNodes.length; i++) {
    indexArray.push(_getIndexOfRelationInRelationsList(node.dependentNodes[i]));
  }

  return Math.min(...indexArray);
}

function _getIndexOfRelationInRelationsList(relation: any): number {
  const list = [...appModel.relationsResult.shapes, ...appModel.relationsResult.relations];
  for (let i = 0; i < list.length; i++) {
    if (relation === list[i]) return i;
  }
  return NOT_FOUND;
}

function _getDependentStaticNodeCount(node: NodeType): number {
  let count = 0;
  for (let i = 0; i < node.dependentNodes.length; i++) {
    if (_isStaticNodeById(node.dependentNodes[i].id)) count++;
  }

  return count;
}

function _getIndexOfNodeInPointsMap(node): number {
  for (let i = 0; i < appModel.pointsMap.length; i++) {
    if (node === appModel.pointsMap[i]) return i;
  }
  return NOT_FOUND;
}

function _getIndexOfNodeInPointsMapById(id: string): number {
  for (let i = 0; i < appModel.pointsMap.length; i++) {
    if (id === appModel.pointsMap[i].id) return i;
  }
  return NOT_FOUND;
}

function _isStaticNodeById(id: string): boolean {
  for (let i = 0; i < appModel.pointsMap.length; i++) {
    if (id === appModel.pointsMap[i].id) {
      return _isStaticNode(appModel.pointsMap[i]);
    }
  }
  return false;
}

export function _makeUniqueNodeRelation(dependentNodes: Array<NodeRelationType>): Array<any> {
  let result: Array<NodeRelationType> = [];

  for (let index = 0; index < dependentNodes.length; index++) {
    let temp = true;

    for (let i = 0; i < result.length; i++) {
      if (dependentNodes[index].relation === result[i]) {
        temp = false;
        break;
      }
    }

    if (temp) result.push(dependentNodes[index].relation);
  }
  return result;
}

function makeCorrectShape(shape: string, rules: string, nonStaticPoint: string) {
  let staticPoints = shape.replace(nonStaticPoint, '').split('');

  // check all other points are static
  for (let i = 0; i < staticPoints.length; i++) {
    if (!_isStaticNodeById(staticPoints[i])) {
      return;
    }
  }

  // get node information
  const points = shape
    .split('')
    .map((point: string): NodeType => appModel.pointsMap[_getIndexOfNodeInPointsMapById(point)]);
  const arrayRules = rules.split(new RegExp('&', 'g'));

  const nonStaticIndex = shape.indexOf(nonStaticPoint);

  if (arrayRules.length > 0) {
    arrayRules.forEach((rule) => {
      const relationType = rule[2];
      if (rule.includes(nonStaticIndex))
        // eslint-disable-next-line default-case
        switch (relationType) {
          case '|':
            console.log(getLinearEquationByParallelRule(rule, points, nonStaticIndex));
            break;
          case '^':
            console.log(getLinearPerpendicularByParallelRule(rule, points, nonStaticIndex));
            break;
          case '=':
            console.log('equal');
            break;
        }
    });
  }
}

function getLinearEquationByParallelRule(
  rule: string,
  arrayPoints: Array<NodeType>,
  nonStaticIndex: number
): LinearEquation {
  const lines = rule.split('|');
  let staticLine, nonStaticLine;
  lines.forEach((line) => {
    if (line.includes(nonStaticIndex)) {
      nonStaticLine = line;
    } else {
      staticLine = line;
    }
  });

  return calculateParallelLineByPointAndLine(
    //point
    arrayPoints[nonStaticLine.replace(nonStaticIndex, '')].coordinate,
    //line
    calculateLinearEquationFromTwoPoints(arrayPoints[staticLine[0]].coordinate, arrayPoints[staticLine[1]].coordinate)
  );
}

function getLinearPerpendicularByParallelRule(
  rule: string,
  arrayPoints: Array<NodeType>,
  nonStaticIndex: number
): LinearEquation {
  const lines = rule.split('|');
  let staticLine, nonStaticLine;
  lines.forEach((line) => {
    if (line.includes(nonStaticIndex)) {
      nonStaticLine = line;
    } else {
      staticLine = line;
    }
  });

  return calculatePerpendicularLineByPointAndLine(
    //point
    arrayPoints[nonStaticLine.replace(nonStaticIndex, '')].coordinate,
    //line
    calculateLinearEquationFromTwoPoints(arrayPoints[staticLine[0]].coordinate, arrayPoints[staticLine[1]].coordinate)
  );
}

function _calculatePointCoordinate(node: NodeType): CoordinateType {
  if (node.isStatic) {
    return node.coordinate;
  }

  const executingNodeRelation = _makeUniqueNodeRelation(node.dependentNodes);
  for (let i = 0; i < executingNodeRelation; i++) {
    // TODO: calculate point
    if (executingNodeRelation[i].relation.outputType === 'shape') {
      if (!_isExecutedRelation(executingNodeRelation[i].relation)) {
        // generate point
        // ...
        executedRelations.push(executingNodeRelation[i].relation);
      }
    }

    if (node.dependentNodes[i].relation.outputType === 'define') {
    }
  }

  node.isStatic = true;
  return node;
}
