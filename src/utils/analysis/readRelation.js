import type { NodeType, NodeRelationType, DrawingNodeType, CoordinateType, LinearEquation } from '../../types/types';
import appModel from '../../appModel';
import { calculateMiddlePoint, calculateSymmetricalPoint } from '../math/Math2D';

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
    } else {
      calculatedPoint = calculateMiddlePoint(
        appModel.getNodeInPointsMapById(segmentNotIncludePoint[0]).coordinate,
        appModel.getNodeInPointsMapById(segmentNotIncludePoint[1]).coordinate
      );

      console.log(calculatedPoint);

      appModel.updateCoordinate(point, calculatedPoint);
    }
  } else if (relationType === 'song song' || relationType === 'vuông góc' || relationType === 'phân giác') {
  }
}

function analyzeOperationType(relation: mixed): CoordinateType {}
