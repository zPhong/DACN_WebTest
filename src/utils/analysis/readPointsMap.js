import type { NodeType, NodeRelationType, DrawingNodeType, CoordinateType, LinearEquation } from '../../types/types';
import appModel from '../../appModel';
import {
  calculateParallelLineByPointAndLine,
  calculatePerpendicularLineByPointAndLine,
  calculateDistanceTwoPoints,
  calculateCircleEquationByCenterPoint,
  calculateIntersectionTwoCircleEquations,
  getLineFromTwoPoints,
  getRandomValue,
  calculateIntersectionByLineAndLine
} from '../math/Math2D';
import { shapeRules, mappingShapeType, TwoStaticPointRequireShape } from '../../configuration/define';
import { generateGeometry } from './GenerateGeometry';
import { readRelation } from './readRelation';

export function readPointsMap(): Array<DrawingNodeType> | {} {
  appModel.createPointDetails();
  console.table(appModel.pointsMap);
  while (!appModel.isPointsMapStatic()) {
    //get node to calculate
    const executingNode = appModel.getNextExecuteNode();
    if (!executingNode) break;

    const executingNodeRelations = _makeUniqueNodeRelation(executingNode.dependentNodes);
    let shape, shapeName, shapeType;

    executingNodeRelations.forEach((relation) => {
      if (relation.outputType === 'shape') {
        shapeName = Object.keys(relation).filter((key) => key !== 'type')[0];
        shapeType = mappingShapeType[relation.type] || 'normal';
        shape = relation[shapeName];
        if (!appModel.isExecutedRelation(relation)) {
          generateGeometry(relation[shapeName], shapeName, relation.type);
          setPointsDirection(relation[shapeName]);
        }
      }

      let relationEquation = readRelation(relation, executingNode.id);
      if (relationEquation) {
        if (Array.isArray(relationEquation)) {
          relationEquation = relationEquation[getRandomValue(0, relationEquation.length)];
        }
        appModel.executePointDetails(executingNode.id, relationEquation);
      }

      if (!appModel.isExecutedRelation(relation)) {
        //
        appModel.executedRelations.push(relation);
      }
    });

    if (shapeRules[shapeName] && shapeRules[shapeName][shapeType]) {
      makeCorrectShape(shape, shapeName, shapeRules[shapeName][shapeType], executingNode.id);
    }

    //Update calculated value to pointsMap
    if (appModel.__pointDetails__.has(executingNode.id)) {
      const roots = appModel.__pointDetails__.get(executingNode.id).roots;
      if (typeof roots === 'string') {
        return { Error: `không tính toán được` };
      }
      if (roots.length > 0) {
        let coordinate;
        if (appModel.isNeedRandomCoordinate(executingNode.id)) {
          coordinate = roots[getRandomValue(0, roots.length)];
        } else {
          const nodeDirectionInfo = appModel.pointsDirectionMap[executingNode.id];
          const staticPointCoordinate = appModel.getNodeInPointsMapById(nodeDirectionInfo.root).coordinate;
          if (roots.length > 1) {
            const rootsDirection = roots.map((root) => ({
              coordinate: root,
              isRight: root.x > staticPointCoordinate.x,
              isUp: root.y < staticPointCoordinate.y
            }));

            const coordinateMatch = rootsDirection
              .map((directionInfo) => {
                let matchCount = 0;
                if (directionInfo.isRight === nodeDirectionInfo.isRight) {
                  matchCount++;
                }
                if (directionInfo.isUp === nodeDirectionInfo.isUp) {
                  matchCount++;
                }
                return {
                  coordinate: directionInfo.coordinate,
                  matchCount
                };
              })
              .sort((a, b) => b.matchCount - a.matchCount)[0];

            coordinate = coordinateMatch.coordinate;
          } else {
            coordinate = roots[0];
          }
        }
        appModel.updateCoordinate(executingNode.id, coordinate);
      } else {
        if (!appModel.isValidCoordinate(executingNode.id)) {
          return { Error: `không tính toán được` };
        }
      }
    }

    //appModel.updatePointsMap(executingNode);
    appModel.executedNode.push(executingNode.id);

    //update static Node
    appModel.updateStaticNode();
  }

  return appModel.pointsMap.map((node) => ({
    id: node.id,
    coordinate: node.coordinate
  }));
}

function setPointsDirection(shape: string) {
  shape.split('').forEach((point, index) => {
    if (index > 0) {
      const pointCoordinate = appModel.getNodeInPointsMapById(point).coordinate;
      const rootCoordinate = appModel.getNodeInPointsMapById(shape[index - 1]).coordinate;

      appModel.pointsDirectionMap[point] = {
        root: shape[index - 1],
        isRight: pointCoordinate.x > rootCoordinate.x,
        isUp: pointCoordinate.y < rootCoordinate.y
      };
    }
  });
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

function makeCorrectShape(shape: string, shapeName: string, rules: string, nonStaticPoint: string) {
  const staticPointCountRequire = TwoStaticPointRequireShape.includes(shapeName) ? 2 : 1;
  let staticPoints = shape.replace(nonStaticPoint, '').split('');
  // check other points are static
  let count = 0;
  for (let i = 0; i < staticPoints.length; i++) {
    if (appModel.isStaticNodeById(staticPoints[i])) {
      count++;
    }
  }
  if (count < staticPointCountRequire) {
    return;
  }

  // get node infomation
  let arrayRules = rules.split(new RegExp('&', 'g'));

  const nonStaticIndex = shape.indexOf(nonStaticPoint);

  let nodeSetEquations = [];
  if (arrayRules.length > 0) {
    arrayRules.forEach((rule) => {
      const relationType = rule[2];
      if (rule.includes(nonStaticIndex)) {
        console.log(nonStaticIndex, rule);

        let equation;
        // eslint-disable-next-line default-case
        switch (relationType) {
          case '|':
            equation = getLinearEquationByParallelRule(rule, shape, nonStaticIndex);
            break;
          case '^':
            if (rule[1] === nonStaticIndex && rule[3] === nonStaticIndex) {
              equation = getLinearPerpendicularByParallelRule(rule, shape, nonStaticIndex);
            }
            break;
          case '=':
            equation = getLinearEquationsByEqualRule(rule, shape, nonStaticIndex);
            break;
        }
        if (equation) {
          nodeSetEquations = nodeSetEquations.concat(equation);
        }
      }
    });

    if (nodeSetEquations.length > 1) {
      const coordinate = calculateIntersectionByLineAndLine(nodeSetEquations[0], nodeSetEquations[1]);
      appModel.updateCoordinate(nonStaticPoint, coordinate);
    }
    nodeSetEquations.forEach((equation) => {
      appModel.executePointDetails(nonStaticPoint, equation);
    });
  }
}

function getLinearEquationsByEqualRule(
  rule: string,
  shape: string,
  nonStaticIndex: number
): Array<TwoVariableQuadraticEquation> {
  const lines = rule.split('=');
  let staticLine;
  let nonStaticLines = [];
  // points with non-static point;
  let staticPoints = [];
  lines.forEach((line) => {
    if (line.includes(nonStaticIndex)) {
      nonStaticLines.push(line);
      staticPoints.push(line.replace(nonStaticIndex, ''));
    } else {
      staticLine = line;
    }
  });

  if (staticLine) {
    //1 circle equation
    if (staticLine.includes(nonStaticLines[0].replace(nonStaticIndex, ''))) {
      const radius = calculateDistanceTwoPoints(
        appModel.getNodeInPointsMapById(shape[staticLine[0]]).coordinate,
        appModel.getNodeInPointsMapById(shape[staticLine[1]]).coordinate
      );

      return [
        calculateCircleEquationByCenterPoint(
          appModel.getNodeInPointsMapById(shape[nonStaticLines[0].replace(nonStaticIndex, '')]).coordinate,
          radius
        )
      ];
    }

    // tam giác đều
    const radius = calculateDistanceTwoPoints(
      appModel.getNodeInPointsMapById(shape[staticLine[0]]).coordinate,
      appModel.getNodeInPointsMapById(shape[staticLine[1]]).coordinate
    );

    const circleOne = calculateCircleEquationByCenterPoint(
      appModel.getNodeInPointsMapById(shape[staticLine[0]]).coordinate,
      radius
    );

    const circleTwo = calculateCircleEquationByCenterPoint(
      appModel.getNodeInPointsMapById(shape[staticLine[0]]).coordinate,
      radius
    );

    const nonStaticNodeId = shape[nonStaticIndex].id;

    appModel.updateCoordinate(nonStaticNodeId, calculateIntersectionTwoCircleEquations(circleOne, circleTwo));
    return [circleOne, circleTwo];
  }
}

function getLinearEquationByParallelRule(rule: string, shape: string, nonStaticIndex: number): LinearEquation {
  const lines = rule.split('|');
  let staticLine, nonStaticLine;
  lines.forEach((line) => {
    if (line.includes(nonStaticIndex)) {
      nonStaticLine = line;
    } else {
      staticLine = line;
    }
  });

  return [
    calculateParallelLineByPointAndLine(
      //point
      appModel.getNodeInPointsMapById(shape[nonStaticLine.replace(nonStaticIndex, '')]).coordinate,
      //line
      getLineFromTwoPoints(
        appModel.getNodeInPointsMapById(shape[staticLine[0]]).coordinate,
        appModel.getNodeInPointsMapById(shape[staticLine[1]]).coordinate
      )
    )
  ];
}

function getLinearPerpendicularByParallelRule(rule: string, shape: string, nonStaticIndex: number): LinearEquation {
  const lines = rule.split('^');
  let staticLine;
  let nonStaticLines = [];
  // points with non-static point;
  let staticPoints = [];
  lines.forEach((line) => {
    if (line.includes(nonStaticIndex)) {
      nonStaticLines.push(line);
      staticPoints.push(line.replace(nonStaticIndex, ''));
    } else {
      staticLine = line;
    }
  });

  if (staticLine) {
    return [
      calculatePerpendicularLineByPointAndLine(
        //point
        appModel.getNodeInPointsMapById(shape[nonStaticLines[0].replace(nonStaticIndex, '')]).coordinate,
        //line
        getLineFromTwoPoints(
          appModel.getNodeInPointsMapById(shape[staticLine[0]]).coordinate,
          appModel.getNodeInPointsMapById(shape[staticLine[1]]).coordinate
        )
      )
    ];
  }
}

function _calculatePointCoordinate(node: NodeType): CoordinateType {
  if (node.isStatic) {
    return node.coordinate;
  }

  const executingNodeRelation = _makeUniqueNodeRelation(node.dependentNodes);
  for (let i = 0; i < executingNodeRelation; i++) {
    // TODO: calculate point
    if (executingNodeRelation[i].relation.outputType === 'shape') {
      if (!appModel.isExecutedRelation(executingNodeRelation[i].relation)) {
        // generate point
        // ...
        appModel.executedRelations.push(executingNodeRelation[i].relation);
      }
    }

    if (node.dependentNodes[i].relation.outputType === 'define') {
    }
  }

  node.isStatic = true;
  return node;
}
