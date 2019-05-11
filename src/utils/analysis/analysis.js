// @flow

import { objectWithPoint } from '../../configuration/define';
import type {
    NodeType,
    RelationsResultType,
    NodeRelationType
} from '../../types/types';
import appModel from '../../appModel';

let RelationPointsMap: Array<NodeType> = [];

export function analyzeResult(validatedResult: RelationsResultType) {
    const shapes = validatedResult.shapes;

    shapes.forEach(shape => {
        createPointsMapByShape(shape);
    });

    const relations = validatedResult.relations;

    relations.forEach(relation => {
        createPointsMapByRelation(relation).forEach(node => {
            updateMap(node, appModel.PointsMap);
        });
    });
    trimPointsMap();
    console.table(appModel.PointsMap);
}

function trimPointsMap() {
    appModel.PointsMap = appModel.PointsMap.map(
        (node: NodeType): NodeType => ({
            ...node,
            dependentNode: unique(node.dependentNode)
        })
    );
}

function unique(
    dependentNode: Array<NodeRelationType>
): Array<NodeRelationType> {
    let result = [];

    dependentNode.forEach(node => {
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
            const index1 = findIndexByNodeId(el1, appModel.PointsMap);
            const index2 = findIndexByNodeId(el2, appModel.PointsMap);

            if (index1 === -1 && index2 === -1) {
                return 1;
            }
            if (index1 >= 0 && index2 >= 0) return 1;
            return index2 - index1;
        }
    );

    const objectPointsMap = points.map((point: string, index: number) => {
        return index !== 0
            ? createNode(point, [{ id: points[0], relation: shape }])
            : createNode(point);
    });

    objectPointsMap.forEach((node: NodeType) => {
        updateMap(node, appModel.PointsMap);
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
                            appModel.PointsMap
                        );
                        const index2 = findIndexByNodeId(
                            el2,
                            appModel.PointsMap
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
            const index1 = findIndexByNodeId(nodeOne.id, appModel.PointsMap);
            const index2 = findIndexByNodeId(nodeTwo.id, appModel.PointsMap);
            if (index1 === -1 && index2 === -1) return 1;
            if (index1 >= 0 && index2 >= 0) return index1 - index2;
            return index2 - index1;
        }
    );

    if (relation.operation === '=' && relation.value) {
        const lastNodeDependentLength =
            RelationPointsMap[RelationPointsMap.length - 1].dependentNode
                .length;
        RelationPointsMap[RelationPointsMap.length - 1].dependentNode[
            lastNodeDependentLength - 1
        ].relation = relation;
    } else {
        let lastObjectPoints = getDependentObject();
        lastObjectPoints.forEach(point => {
            const index = findIndexByNodeId(point, RelationPointsMap);
            const currentNode = RelationPointsMap[index];
            RelationPointsMap.forEach(node => {
                if (node.id !== point) {
                    RelationPointsMap[index] = {
                        ...currentNode,
                        dependentNode: [
                            ...currentNode.dependentNode,
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

    lastNode.dependentNode.forEach(node => {
        if (!result.includes(node.id)) result.push(node.id);
    });
    return result;
}

function findIndexByNodeId(
    id: string,
    map: Array<NodeType | NodeRelationType>
): number {
    for (let i = 0; i < map.length; i++) {
        if (map[i].id === id) return i;
    }
    return -1;
}

function createDependentNodeOfRelation(
    point: string,
    relation: any,
    exception: Array<string>
): Array<NodeRelationType> {
    const result: Array<NodeRelationType> = [];
    RelationPointsMap.forEach((node: NodeType, index: number) => {
        if (exception.includes(node.id)) return;
        result.push({ id: node.id, relation });
    });

    return result;
}

function createDependentNodeOfObject(
    objectType: string,
    objectName: string,
    points: Array<string>
): Array<NodeRelationType> {
    const result: Array<NodeRelationType> = [];
    let relation = {};
    relation[objectType] = objectName;

    points.forEach((point: string, index: number) => {
        if (index === points.length - 1) return;
        result.push({ id: point, relation });
    });

    return result;
}

function createNode(id: string, dependentNode?: Array<NodeRelationType>): any {
    const node = { id, coordinate: { x: 0, y: 0, z: 0 }, isStatic: false };
    const _dependentNode = dependentNode
        ? { dependentNode }
        : { dependentNode: [] };

    return { ...node, ..._dependentNode };
}

function updateMap(node: NodeType, map: Array<NodeType>) {
    const index = findIndexByNodeId(node.id, map);
    if (index !== -1) {
        //merge dependentNode
        const oldNode = map[index];
        map[index] = {
            ...oldNode,
            dependentNode: [...oldNode.dependentNode, ...node.dependentNode]
        };
    } else {
        map.push(node);
    }
}
