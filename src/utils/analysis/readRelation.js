import type { NodeType, NodeRelationType, DrawingNodeType, CoordinateType, LinearEquation } from '../../types/types';
import appModel from '../../appModel';

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
        analyzeRelationType(relation, point);
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
    if (segmentIncludePoint) {
      const otherStaticPoint = relation.point[0];
      if (relationType === 'trung điểm') {
      }
    }
  } else if (relationType === 'song song' || relationType === 'vuông góc' || relationType === 'phân giác') {
  }
}

function analyzeOperationType(relation: mixed): CoordinateType {}
