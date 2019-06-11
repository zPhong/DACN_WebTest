import type { NodeType, NodeRelationType, DrawingNodeType, CoordinateType, LinearEquation } from '../../types/types';
import appModel from '../../appModel';
import {
  calculateParallelLineByPointAndLine,
  calculatePerpendicularLineByPointAndLine,
  calculateDistanceTwoPoints,
  calculateCircleEquationByCenterPoint,
  calculateIntersectionTwoCircleEquations,
  getLineFromTwoPoints,
  getRandomValue
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
      makeCorrectShape(
        shape,
        shapeName,
        shapeRules[shapeName][shapeType],
        executingNode.id,
        shape.split('').filter((string) => !appModel.isStaticNodeById(string) && string !== executingNode.id)
      );
    }

    //Update calculated value to pointsMap
    if (appModel.__pointDetails__.has(executingNode.id)) {
      const roots = appModel.__pointDetails__.get(executingNode.id).roots;
      if (typeof roots === 'string') {
        return { Error: `không tính toán được` };
      }
      if (roots.length > 0) {
        const randomCoordinate = roots[getRandomValue(0, roots.length)];
        appModel.updateCoordinate(executingNode.id, randomCoordinate);
      } else {
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

  let nodeSetEquations = [];
  if (arrayRules.length > 0) {
    arrayRules.forEach((rule) => {
      const relationType = rule[2];
      if (rule.includes(nonStaticIndex)) {
        let equation;
        // eslint-disable-next-line default-case
        switch (relationType) {
          case '|':
            equation = getLinearEquationByParallelRule(rule, shape, nonStaticIndex);
            break;
          case '^':
            equation = getLinearPerpendicularByParallelRule(rule, shape, nonStaticIndex);
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
    let pointDetails = appModel.__pointDetails__.get(nonStaticPoint);
    pointDetails = {
      ...pointDetails,
      setOfEquation: [...nodeSetEquations, ...pointDetails.setOfEquation]
    };
    console.log(nonStaticPoint, pointDetails);

    appModel._updatePointDetails(nonStaticPoint, pointDetails);
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

  //1 circle equation
  if (staticLine) {
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
