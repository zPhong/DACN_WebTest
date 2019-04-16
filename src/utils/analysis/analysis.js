// @flow

import { objectWithPoint } from '../../configuration/define';
import type { NodeType, ResultType } from '../../types/types';

let PointsMap: Array<NodeType> = [];

export function analyzeResult(validateResult: ResultType) {
    PointsMap = [];
    const relations = validateResult.relations;

    relations.forEach(relation => {
        console.log(getAllPointInRelation(relation));
    });

    return {};
}

function getAllPointInRelation(relation) {
    let result = [];
    objectWithPoint.forEach(objectType => {
        if (relation[objectType]) {
            let arrayPoint = [];
            relation[objectType].forEach(object => {
                let points = object
                    .split('')
                    .filter(point => point === point.toUpperCase());
                points = [...points].sort(
                    (el1: string, el2: string): boolean => {
                        return findIndexByNodeId(el1) < findIndexByNodeId(el2);
                    }
                );

                points.forEach((point: string, index: number) => {});

                arrayPoint = arrayPoint.concat();
            });
            result = result.concat(arrayPoint);
        }
    });
    return result;
}

function findIndexByNodeId(id: string): number {
    for (let i = 0; i < PointsMap.length; i++) {
        if (PointsMap[i].id === id) return i;
    }
    return -1;
}

function createNode(relation?: any) {}

function updateNode() {}
