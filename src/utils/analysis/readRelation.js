import type {
  NodeType,
  NodeRelationType,
  DrawingNodeType,
  CoordinateType,
  LinearEquation,
  CircleEquation,
  TwoVariableQuadraticEquation
} from '../../types/types';
import appModel from '../../appModel';
import {
  calculateMiddlePoint,
  calculateSymmetricalPoint,
  generatePointAlignmentInside,
  generatePointAlignmentOutside,
  generatePointNotAlignment,
  calculateIntersectionLinearEquationWithCircleEquation,
  calculateLinesByAnotherLineAndAngle,
  calculateCircleEquationByCenterPoint,
  calculateInternalBisectLineEquation,
  calculatePerpendicularLineByPointAndLine,
  calculateParallelLineByPointAndLine,
  calculateIntersectionByLineAndLine,
  getLineFromTwoPoints,
  getRandomPointInLine,
  calculateDistanceTwoPoints,
  getRandomValue,
  isIn,
  getMiddlePointFromThreePointsInALine,
  calculateIntersectionTwoCircleEquations,
  convertLinearToQuadratic,
  getAngleFromTwoLines
} from '../math/Math2D';
import { NOT_ENOUGH_SET } from '../values';

export function readRelation(relation: mixed, point: string): TwoVariableQuadraticEquation {
  let equationResults;
  if (relation.operation) {
    equationResults = analyzeOperationType(relation, point);
  } else if (relation.relation) {
    const relationType = relation.relation;
    switch (relationType) {
      case 'trung điểm':
      case 'thuộc':
      case 'không thuộc':
      case 'song song':
      case 'vuông góc':
      case 'phân giác':
      case 'thẳng hàng':
        equationResults = analyzeRelationType(relation, point);
        break;
      case 'cắt':
        equationResults = analyzeIntersectRelation(relation, point);
        break;
      default:
        break;
    }
  }

  //TODO
  if (equationResults) {
    if (equationResults.coefficientX !== undefined) {
      // equationResults is linear
      return {
        a: 0,
        b: 0,
        c: equationResults.coefficientX,
        d: equationResults.coefficientY,
        e: equationResults.constantTerm
      };
    } else {
      // equationResults is circle
      return equationResults;
    }
  }
  return null;
}

function analyzeRelationType(relation: mixed, point: string): LinearEquation {
  let segmentIncludePoint, segmentNotIncludePoint;
  if (relation.segment) {
    relation.segment.forEach((segment: string) => {
      if (segment.includes(point)) {
        segmentIncludePoint = segment;
      } else {
        segmentNotIncludePoint = segment;
      }
    });
  }

  //points = [...new Set(points)].filter((point: string): boolean => !nonStaticPoints.includes(point));
  const relationType = relation.relation;

  if (
    relationType === 'trung điểm' ||
    relationType === 'thuộc' ||
    relationType === 'không thuộc' ||
    relationType === 'thẳng hàng'
  ) {
    let calculatedPoint;
    if (segmentIncludePoint) {
      const otherStaticPoint = relation.point[0];
      const otherStaticNodeInSegment = appModel.getNodeInPointsMapById(segmentIncludePoint.replace(point, ''));

      if (!otherStaticNodeInSegment.coordinate.x && !otherStaticNodeInSegment.coordinate.y) {
        return null;
      }

      if (relationType === 'trung điểm') {
        calculatedPoint = calculateSymmetricalPoint(
          otherStaticNodeInSegment.coordinate,
          appModel.getNodeInPointsMapById(otherStaticPoint).coordinate,
          segmentIncludePoint.indexOf(point) === 1
        );

        appModel.updateCoordinate(point, calculatedPoint);
      }
    } else if (segmentNotIncludePoint) {
      switch (relationType) {
        case 'trung điểm':
          calculatedPoint = calculateMiddlePoint(
            appModel.getNodeInPointsMapById(segmentNotIncludePoint[0]).coordinate,
            appModel.getNodeInPointsMapById(segmentNotIncludePoint[1]).coordinate
          );
          appModel.updateCoordinate(point, calculatedPoint);
          break;
        case 'thuộc':
          calculatedPoint = generatePointAlignmentInside(
            appModel.getNodeInPointsMapById(segmentNotIncludePoint[0]).coordinate,
            appModel.getNodeInPointsMapById(segmentNotIncludePoint[1]).coordinate
          );
          appModel.updateCoordinate(point, calculatedPoint);
          break;
        case 'không thuộc':
          calculatedPoint = generatePointAlignmentOutside(
            appModel.getNodeInPointsMapById(segmentNotIncludePoint[0]).coordinate,
            appModel.getNodeInPointsMapById(segmentNotIncludePoint[1]).coordinate,
            getRandomValue(0, 2) === 1
          );

          appModel.additionSegment.push(`${point}${segmentNotIncludePoint[0]}`);
          appModel.updateCoordinate(point, calculatedPoint);
          break;
        default:
          break;
      }
    } else {
      const points = relation.point;
      const index = points.indexOf(point);
      if (index === 1) {
        calculatedPoint = generatePointAlignmentInside(
          appModel.getNodeInPointsMapById(points[0]).coordinate,
          appModel.getNodeInPointsMapById(points[2]).coordinate
        );
        appModel.updateCoordinate(point, calculatedPoint);
      } else {
        calculatedPoint = generatePointAlignmentOutside(
          appModel.getNodeInPointsMapById(points[index === 2 ? 0 : 1]).coordinate,
          appModel.getNodeInPointsMapById(points[index === 2 ? 1 : 2]).coordinate,
          index === 2
        );
        appModel.updateCoordinate(point, calculatedPoint);
      }

      return getLineFromTwoPoints(
        appModel.getNodeInPointsMapById(points[0]).coordinate,
        appModel.getNodeInPointsMapById(points[1]).coordinate
      );
    }

    return getLineFromTwoPoints(
      appModel.getNodeInPointsMapById(relation.segment[0][0]).coordinate,
      appModel.getNodeInPointsMapById(relation.segment[0][1]).coordinate
    );
  } else if (relationType === 'song song' || relationType === 'vuông góc') {
    //undefined point
    for (let i = 0; i < 2; i++) {
      if (!appModel.isValidCoordinate(segmentNotIncludePoint[i])) {
        return;
      }
    }

    const staticLineEquation = getLineFromTwoPoints(
      appModel.getNodeInPointsMapById(segmentNotIncludePoint[0]).coordinate,
      appModel.getNodeInPointsMapById(segmentNotIncludePoint[1]).coordinate
    );

    const otherStaticPoint = segmentIncludePoint.replace(point, '');

    if (!appModel.isValidCoordinate(otherStaticPoint)) {
      return;
    }

    let calculatedLineEquation;
    if (relationType === 'vuông góc') {
      calculatedLineEquation = calculatePerpendicularLineByPointAndLine(
        appModel.getNodeInPointsMapById(otherStaticPoint).coordinate,
        staticLineEquation
      );

      const isInStaticLine = isIn(
        appModel.getNodeInPointsMapById(otherStaticPoint).coordinate,
        convertLinearToQuadratic(staticLineEquation)
      );
      const calculatedPoint = isInStaticLine
        ? getRandomPointInLine(calculatedLineEquation)
        : calculateIntersectionByLineAndLine(calculatedLineEquation, staticLineEquation);
      appModel.updateCoordinate(point, calculatedPoint);
    }
    if (relationType === 'song song') {
      calculatedLineEquation = calculateParallelLineByPointAndLine(
        appModel.getNodeInPointsMapById(otherStaticPoint).coordinate,
        staticLineEquation
      );

      const calculatedPoint = getRandomPointInLine(calculatedLineEquation);

      appModel.updateCoordinate(point, calculatedPoint);
    }
    return calculatedLineEquation;
  } else if (relationType === 'phân giác') {
    if (relation.angle) {
      const angle = relation.angle[0];
      if (angle.includes(point)) {
        return;
      }

      const staticLineEquation = getLineFromTwoPoints(
        appModel.getNodeInPointsMapById(angle[0]).coordinate,
        appModel.getNodeInPointsMapById(angle[2]).coordinate
      );

      const calculatedLineEquation = calculateInternalBisectLineEquation(
        getLineFromTwoPoints(
          appModel.getNodeInPointsMapById(angle[0]).coordinate,
          appModel.getNodeInPointsMapById(angle[1]).coordinate
        ),
        getLineFromTwoPoints(
          appModel.getNodeInPointsMapById(angle[1]).coordinate,
          appModel.getNodeInPointsMapById(angle[2]).coordinate
        )
      );

      const calculatedPoint = calculateIntersectionByLineAndLine(calculatedLineEquation, staticLineEquation);
      console.log(point);
      appModel.updateCoordinate(point, calculatedPoint);

      return calculatedLineEquation;
    }
  }
}

function analyzeIntersectRelation(relation: mixed, point: string): CoordinateType {
  for (let index in relation.segment) {
    for (let i = 0; i < 2; i++) {
      if (!appModel.isValidCoordinate(relation.segment[index][i])) {
        return;
      }
    }
  }

  const calculatedLineEquationOne = getLineFromTwoPoints(
    appModel.getNodeInPointsMapById(relation.segment[0][0]).coordinate,
    appModel.getNodeInPointsMapById(relation.segment[0][1]).coordinate
  );
  const calculatedLineEquationTwo = getLineFromTwoPoints(
    appModel.getNodeInPointsMapById(relation.segment[1][0]).coordinate,
    appModel.getNodeInPointsMapById(relation.segment[1][1]).coordinate
  );

  const calculatedPoint = calculateIntersectionByLineAndLine(calculatedLineEquationOne, calculatedLineEquationTwo);
  appModel.updateCoordinate(point, calculatedPoint);
}

//chỉ xử lý : = , *
function analyzeOperationType(relation: mixed, point: string): any {
  const objectType = relation.segment ? 'segment' : 'angle';
  const valueData = {};

  const objectsIncludePoint = [];

  for (let index in relation[objectType]) {
    const object = relation[objectType][index];
    if (object.includes(point)) {
      objectsIncludePoint.push(object);
    }
    let isStatic = true;
    object.split('').forEach((objPoint) => {
      if (objPoint !== point && !appModel.isStaticNodeById(objPoint)) {
        isStatic = false;
      }
    });

    if (!isStatic) {
      return;
    }

    valueData[object] =
      objectType === 'segment'
        ? calculateDistanceTwoPoints(
            appModel.getNodeInPointsMapById(object[0]).coordinate,
            appModel.getNodeInPointsMapById(object[1]).coordinate
          )
        : getAngleFromTwoLines(
            getLineFromTwoPoints(
              appModel.getNodeInPointsMapById(object[0]).coordinate,
              appModel.getNodeInPointsMapById(object[1]).coordinate
            ),
            getLineFromTwoPoints(
              appModel.getNodeInPointsMapById(object[1]).coordinate,
              appModel.getNodeInPointsMapById(object[2]).coordinate
            )
          );
  }

  //điểm cần tính phụ thuộc 1 điểm duy nhất
  if (objectsIncludePoint.length === 1) {
    const index = relation[objectType].indexOf(objectsIncludePoint[0]);
    const staticObject = relation[objectType][index === 0 ? 1 : 0];
    let staticValue;
    if (relation[objectType].length > 1) {
      staticValue = index === 0 ? relation.value * valueData[staticObject] : valueData[staticObject] / relation.value;
    } else {
      staticValue = relation.value[0];
    }

    if (objectType === 'segment') {
      return calculateCircleEquationByCenterPoint(
        appModel.getNodeInPointsMapById(objectsIncludePoint[0].replace(point, '')).coordinate,
        staticValue
      );
    }
    const staticLineInAngle = getLineFromTwoPoints(
      appModel.getNodeInPointsMapById(objectsIncludePoint[0].replace(point, '')[0]).coordinate,
      appModel.getNodeInPointsMapById(objectsIncludePoint[0].replace(point, '')[1]).coordinate
    );

    return calculateLinesByAnotherLineAndAngle(
      staticLineInAngle,
      appModel.getNodeInPointsMapById(objectsIncludePoint[0].replace(point, '')[1]).coordinate,
      staticValue
    );
  }
  if (objectsIncludePoint.length === 2) {
    if (objectType === 'segment') {
      const staticPointOne = objectsIncludePoint[0].replace(point, '');
      const staticPointTwo = objectsIncludePoint[1].replace(point, '');
      console.log(staticPointOne, staticPointTwo);
      //cần check thêm loại shape
      if (!appModel.isStaticNodeById(staticPointOne) || !appModel.isStaticNodeById(staticPointTwo)) {
        return;
      }

      const staticLineEquation = getLineFromTwoPoints(
        appModel.getNodeInPointsMapById(staticPointOne).coordinate,
        appModel.getNodeInPointsMapById(staticPointTwo).coordinate
      );

      const staticDistance = calculateDistanceTwoPoints(
        appModel.getNodeInPointsMapById(staticPointOne).coordinate,
        appModel.getNodeInPointsMapById(staticPointTwo).coordinate
      );

      const isAlign = isIn(appModel.getNodeInPointsMapById(point).coordinate, {
        a: 0,
        b: 0,
        c: staticLineEquation.coefficientX,
        d: staticLineEquation.coefficientY,
        e: staticLineEquation.constantTerm
      });

      const ratio = +relation.value[0];
      if (isAlign) {
        let calculatedPoint;
        const betweenPoint = getMiddlePointFromThreePointsInALine(
          appModel.getNodeInPointsMapById(point).coordinate,
          appModel.getNodeInPointsMapById(staticPointOne).coordinate,
          appModel.getNodeInPointsMapById(staticPointTwo).coordinate
        );

        if (betweenPoint === appModel.getNodeInPointsMapById(point).coordinate) {
          calculatedPoint = calculateIntersectionLinearEquationWithCircleEquation(
            staticLineEquation,
            calculateCircleEquationByCenterPoint(
              appModel.getNodeInPointsMapById(staticPointOne).coordinate,
              (ratio * staticDistance) / (ratio + 1)
            )
          );

          [...calculatedPoint].forEach((p) => {
            const result = getMiddlePointFromThreePointsInALine(
              p,
              appModel.getNodeInPointsMapById(staticPointOne).coordinate,
              appModel.getNodeInPointsMapById(staticPointTwo).coordinate
            );
            if (result === p) {
              calculatedPoint = p;
            }
          });
        }
        if (betweenPoint === appModel.getNodeInPointsMapById(staticPointOne).coordinate && ratio < 1) {
          calculatedPoint = calculateIntersectionLinearEquationWithCircleEquation(
            staticLineEquation,
            calculateCircleEquationByCenterPoint(
              appModel.getNodeInPointsMapById(staticPointOne).coordinate,
              (ratio * staticDistance) / (1 - ratio)
            )
          );

          [...calculatedPoint].forEach((p) => {
            const result = getMiddlePointFromThreePointsInALine(
              p,
              appModel.getNodeInPointsMapById(staticPointOne).coordinate,
              appModel.getNodeInPointsMapById(staticPointTwo).coordinate
            );
            if (result === appModel.getNodeInPointsMapById(staticPointOne).coordinate) {
              calculatedPoint = p;
            }
          });
        }
        if (betweenPoint === appModel.getNodeInPointsMapById(staticPointTwo).coordinate && ratio > 1) {
          calculatedPoint = calculateIntersectionLinearEquationWithCircleEquation(
            staticLineEquation,
            calculateCircleEquationByCenterPoint(
              appModel.getNodeInPointsMapById(staticPointOne).coordinate,
              (ratio * staticDistance) / (ratio - 1)
            )
          );

          [...calculatedPoint].forEach((p) => {
            const result = getMiddlePointFromThreePointsInALine(
              p,
              appModel.getNodeInPointsMapById(staticPointOne).coordinate,
              appModel.getNodeInPointsMapById(staticPointTwo).coordinate
            );
            if (result === appModel.getNodeInPointsMapById(staticPointTwo).coordinate) {
              calculatedPoint = p;
            }
          });
        }

        appModel.updateCoordinate(point, calculatedPoint);

        return staticLineEquation;
      } else {
      }
      return null;
    }
  }
}
