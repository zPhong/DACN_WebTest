import type { NodeType, NodeRelationType, DrawingNodeType, CoordinateType, LinearEquation } from '../../types/types';
import appModel from '../../appModel';
import {
  calculateMiddlePoint,
  calculateSymmetricalPoint,
  generatePointAlignmentInside,
  generatePointAlignmentOutside,
  generatePointNotAlignment,
  calculatePerpendicularLineByPointAndLine,
  calculateParallelLineByPointAndLine,
  calculateIntersectionByLineAndLine,
  getLineFromTwoPoints,
  getRandomPointInLine,
  getRandomValue
} from '../math/Math2D';

export function readRelation(relation: mixed, point: string): LinearEquation {
  if (relation.operation) {
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
        const result = analyzeRelationType(relation, point);
        break;
      case 'cắt':
        break;
      default:
        break;
    }
  }
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

        console.log(calculatedPoint);

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
          appModel.updateCoordinate(point, calculatedPoint);
          break;
        default:
          break;
      }
    } else {
      const points = relation.point;
      const index = points.indexOf(point);
      console.log(index, points);
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
    }
  } else if (relationType === 'song song' || relationType === 'vuông góc' || relationType === 'phân giác') {
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

    let calculatedLineEquation;
    if (relationType === 'vuông góc') {
      calculatedLineEquation = calculatePerpendicularLineByPointAndLine(
        appModel.getNodeInPointsMapById(otherStaticPoint).coordinate,
        staticLineEquation
      );

      console.log(calculatedLineEquation, staticLineEquation);

      const calculatedPoint = calculateIntersectionByLineAndLine(calculatedLineEquation, staticLineEquation);
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

function analyzeOperationType(relation: mixed): CoordinateType {}
