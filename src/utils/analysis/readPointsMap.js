import type { NodeType, NodeRelationType, DrawingNodeType, CoordinateType, LinearEquation } from '../../types/types';
import appModel from '../../appModel';
import {
  calculateParallelLineByPointAndLine,
  calculatePerpendicularLineByPointAndLine,
  calculateDistanceTwoPoints,
  calculateCircleEquationByCenterPoint, getLineFromTwoPoints
} from '../math/Math2D';
import { shapeRules, mappingShapeType, TwoStaticPointRequireShape } from '../../configuration/define';
import { generateGeometry } from './GenerateGeometry';
import { readRelation } from './readRelation';

export function readPointsMap(): Array<DrawingNodeType> {
  console.table(appModel.pointsMap);
  while (!appModel.isPointsMapStatic()) {
    //get node to calculate
    const executingNode = appModel.getNextExecuteNode();
    if (!executingNode) break;

    const executingNodeRelations = _makeUniqueNodeRelation(executingNode.dependentNodes);

    executingNodeRelations.forEach((relation) => {
      if (relation.outputType === 'shape') {
        const shapeName = Object.keys(relation).filter((key) => key !== 'type')[0];
        const shapeType = mappingShapeType[relation.type] || 'normal';

        if (!appModel.isExecutedRelation(relation)) {
          generateGeometry(relation[shapeName], shapeName, relation.type);
        }

        if (shapeRules[shapeName] && shapeRules[shapeName][shapeType]) {
          makeCorrectShape(
            relation[shapeName],
            shapeName,
            shapeRules[shapeName][shapeType],
            executingNode.id,
            relation[shapeName]
              .split('')
              .filter((string) => !appModel.isStaticNodeById(string) && string !== executingNode.id)
          );
        }
      }

      readRelation(relation, executingNode.id);

      if (!appModel.isExecutedRelation(relation)) {
        //
        appModel.executedRelations.push(relation);
      }
    });

    //Update calculated value to pointsMap
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

function makeCorrectShape(
  shape: string,
  shapeName: string,
  rules: string,
  nonStaticPoint: string,
  exceptionPoints: string[]
) {
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
  const points = shape
    .split('')
    .map((point: string): NodeType => appModel.pointsMap[appModel.getIndexOfNodeInPointsMapById(point)]);
  let arrayRules = rules.split(new RegExp('&', 'g'));

  const nonStaticIndex = shape.indexOf(nonStaticPoint);

  const exceptionIndexArray = exceptionPoints.map((point: string): number => shape.indexOf(point));
  arrayRules = arrayRules.filter((rule) => {
    for (let index in exceptionIndexArray) {
      if (rule.includes(exceptionIndexArray[index])) {
        return false;
      }
    }
    return true;
  });

  console.log('---------------------------');
  if (arrayRules.length > 0) {
    arrayRules.forEach((rule) => {
      const relationType = rule[2];
      console.log(rule, nonStaticIndex);
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

function getLinearEquationsByEqualRule(rule: string, arrayPoints: Array<NodeType>, nonStaticIndex: number) {
  const lines = rule.split('|');
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

  //1 circle equation
  if (staticLine) {
    const radius = calculateDistanceTwoPoints(staticLine[0].coordinate, staticLine[1].coordinate);

    return calculateCircleEquationByCenterPoint(staticPoints[0], radius);
  }

  // tam giác đều
  const radius = calculateDistanceTwoPoints(staticPoints[0].coordinate, staticPoints[1].coordinate);

  const circleOne = calculateCircleEquationByCenterPoint(staticPoints[0], radius);

  const circleTwo = calculateCircleEquationByCenterPoint(staticPoints[1], radius);
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
    getLineFromTwoPoints(arrayPoints[staticLine[0]].coordinate, arrayPoints[staticLine[1]].coordinate)
  );
}

function getLinearPerpendicularByParallelRule(
  rule: string,
  arrayPoints: Array<NodeType>,
  nonStaticIndex: number
): LinearEquation {
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
    return calculatePerpendicularLineByPointAndLine(
      //point
      arrayPoints[nonStaticLines[0].replace(nonStaticIndex, '')].coordinate,
      //line
      getLineFromTwoPoints(arrayPoints[staticLine[0]].coordinate, arrayPoints[staticLine[1]].coordinate)
    );
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
