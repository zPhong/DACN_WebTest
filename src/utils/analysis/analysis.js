// @flow

import {objectWithPoint} from '../../configuration/define';
import type {
    NodeType,
    RelationsResultType,
    NodeRelationType,
    DrawingNodeType,
    DrawingDataType
} from '../../types/types';
import appModel from '../../appModel';

let RelationPointsMap: Array<NodeType> = [];

export function analyzeResult(
    validatedResult: RelationsResultType
): DrawingDataType {
    const shapes = validatedResult.shapes;

  shapes.forEach(shape => {
    createPointsMapByShape(shape);
  });

  const relations = validatedResult.relations;

  relations.forEach(relation => {
    createPointsMapByRelation(relation).forEach(node => {
      updateMap(node, appModel.pointsMap);
    });
    trimPointsMap();
    console.table(appModel.PointsMap);

    let result = {};

    result.points = appModel.PointsMap.map(
        (node: NodeType): DrawingNodeType => ({
            id: node.id,
            coordinate: node.coordinate
        })
    );

    result.segments = getArraySegments(validatedResult);

    console.log(result);
    return result;
}

function getArraySegments(validatedResult: RelationsResultType): Array<string> {
    let result: Array<string> = [];

    const shapes = validatedResult.shapes;

    shapes.forEach(shape => {
        result = result.concat(getShapeSegments(shape));
    });

    const relations = validatedResult.relations;

    relations.forEach(relation => {
        if (relation.segment) {
            result = result.concat(relation.segment);
        }
    });

    return result.filter((item, index, array) => array.indexOf(item) === index);
}

function getShapeSegments(shape: any): Array<string> {
    const shapeName = Object.keys(shape).filter(key => key !== 'type')[0];
    let points = shape[shapeName]
        .split('')
        .filter(point => point === point.toUpperCase());

    const result = [];

    for (let i = 0; i < points.length; i++) {
        if (i === points.length - 1) {
            result.push(points[0] + points[i]);
        } else {
            result.push(points[i] + points[i + 1]);
        }
    }

    return result;
}

function trimPointsMap() {
  appModel.pointsMap = appModel.pointsMap.map(
     (node: NodeType): NodeType => ({
       ...node,
       dependentNodes: unique(node.dependentNodes)
     })
  );
}

function unique(dependentNodes: Array<NodeRelationType>): Array<NodeRelationType> {
  let result = [];

  dependentNodes.forEach(node => {
    for (let i = 0; i < result.length; i++) {
      if (JSON.stringify(node) === JSON.stringify(result[i])) return;
    }
    result.push(node);
  });

  return result;
}

function createPointsMapByShape(shape: any) {
  const shapeName = Object.keys(shape).filter(key => key !== 'type')[0];
  let points = shape[shapeName]
     .split('')
     .filter(point => point === point.toUpperCase());

  points = [...points].sort(
     (el1: string, el2: string): number => {
       const index1 = findIndexByNodeId(el1, appModel.pointsMap);
       const index2 = findIndexByNodeId(el2, appModel.pointsMap);

       if (index1 === -1 && index2 === -1) {
         return 1;
       }
       if (index1 >= 0 && index2 >= 0) return 1;
       return index2 - index1;
     }
  );

  const objectPointsMap = points.map((point: string, index: number) => {
    return index !== 0
       ? createNode(point, [{id: points[0], relation: shape}])
       : createNode(point);
  });

  objectPointsMap.forEach((node: NodeType) => {
    updateMap(node, appModel.pointsMap);
  });
}

function createPointsMapByRelation(relation: any) {
  RelationPointsMap = [];
  objectWithPoint.forEach((objectType: string) => {
    if (relation[objectType]) {
      relation[objectType].forEach(object => {
        let points = object
           .split('')
           .filter(point => point === point.toUpperCase());

        points = [...points].sort(
           (el1: string, el2: string): number => {
             const index1 = findIndexByNodeId(
                el1,
                appModel.pointsMap
             );
             const index2 = findIndexByNodeId(
                el2,
                appModel.pointsMap
             );

             if (index1 === -1 && index2 === -1) {
               return 1;
             }
             if (index1 >= 0 && index2 >= 0) return 1;
             return index2 - index1;
           }
        );

        const objectPointsMap = points.map(
           (point: string, index: number) => {
             return index === points.length - 1
                ? createNode(
                   point,
                   createDependentNodeOfObject(
                      objectType,
                      object,
                      points
                   )
                )
                : createNode(point);
           }
        );

        objectPointsMap.forEach((node: NodeType) => {
          updateMap(node, RelationPointsMap);
        });
      });
    }
  });

  RelationPointsMap = [...RelationPointsMap].sort(
     (nodeOne: NodeType, nodeTwo: NodeType): number => {
       const index1 = findIndexByNodeId(nodeOne.id, appModel.pointsMap);
       const index2 = findIndexByNodeId(nodeTwo.id, appModel.pointsMap);
       if (index1 === -1 && index2 === -1) return 1;
       if (index1 >= 0 && index2 >= 0) return index1 - index2;
       return index2 - index1;
     }
  );

  if (relation.operation === '=' && relation.value) {
    const lastNodeDependentLength = RelationPointsMap[RelationPointsMap.length - 1].dependentNodes.length;
    RelationPointsMap[RelationPointsMap.length - 1].dependentNodes[lastNodeDependentLength - 1].relation = relation;
  } else {
    let lastObjectPoints = getDependentObject();
    lastObjectPoints.forEach(point => {
      const index = findIndexByNodeId(point, RelationPointsMap);
      const currentNode = RelationPointsMap[index];
      RelationPointsMap.forEach(node => {
        if (node.id !== point) {
          RelationPointsMap[index] = {
            ...currentNode,
            dependentNodes: [
              ...currentNode.dependentNodes,
              ...createDependentNodeOfRelation(
                 node.id,
                 relation,
                 lastObjectPoints
              )
            ]
          };
        }
      });
    });
  }
  return RelationPointsMap;
}

function getDependentObject(): Array<string> {
  let result = [];
  const lastNode = RelationPointsMap[RelationPointsMap.length - 1];
  result.push(lastNode.id);

  lastNode.dependentNodes.forEach(node => {
    if (!result.includes(node.id) && !appModel.pointsMap[findIndexByNodeId(node.id, appModel.pointsMap)].isStatic) result.push(node.id);
  });
  return result;
}

function findIndexByNodeId(id: string, map: Array<NodeType | NodeRelationType>): number {
  for (let i = 0; i < map.length; i++) {
    if (map[i].id === id) return i;
  }
  return -1;
}

function createDependentNodeOfRelation(point: string, relation: any, exception: Array<string>): Array<NodeRelationType> {
  const result: Array<NodeRelationType> = [];
  RelationPointsMap.forEach((node: NodeType, index: number) => {
    if (exception.includes(node.id)) return;
    result.push({id: node.id, relation});
  });

  return result;
}

function createDependentNodeOfObject(objectType: string, objectName: string, points: Array<string>): Array<NodeRelationType> {
  const result: Array<NodeRelationType> = [];
  let relation = {};
  relation[objectType] = objectName;

  points.forEach((point: string, index: number) => {
    if (index === points.length - 1) return;
    result.push({id: point, relation});
  });

  return result;
}

function createNode(id: string, dependentNodes?: Array<NodeRelationType>): any {
  const node = {id, coordinate: {x: 0, y: 0, z: 0}, isStatic: false};
  const _dependentNodes = dependentNodes
     ? {dependentNodes}
     : {dependentNodes: []};

  return {...node, ..._dependentNodes};
}

function updateMap(node: NodeType, map: Array<NodeType>) {
  const index = findIndexByNodeId(node.id, map);
  if (index !== -1) {
    //merge dependentNodes
    const oldNode = map[index];
    map[index] = {
      ...oldNode,
      dependentNodes: [...oldNode.dependentNodes, ...node.dependentNodes]
    };
  } else {
    map.push(node);
  }
}