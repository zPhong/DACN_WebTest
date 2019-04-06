import { shapeList } from '../../configuration/define';

export function analyzeResult(validateResult) {
    const shapes = validateResult.shape;
    const relations = validateResult.relation;

    shapes.forEach(shape => {
        const shapeName = getShapeName(shape);
        relations.forEach(relation => {
            const rank = defineRelationRank(shapeName, relation);
            relation.rank = rank;
        });
    });

    return {
        shape: shapes,
        relation: relations.sort(orderRelation)
    };
}

function getPriority(relation) {
    let priority = '';
    relation.outputType === 'define' ? (priority += '1') : (priority += '0');
    relation.value ? (priority += '1') : (priority += '0');
    relation.angle ? (priority += '1') : (priority += '0');
    relation.segment ? (priority += '1') : (priority += '0');

    return priority;
}

function orderRelation(relation1, relation2) {
    const priority1 = getPriority(relation1);
    const priority2 = getPriority(relation2);

    if (priority1 === priority2) return relation2.rank - relation1.rank;

    return parseInt(priority2) - parseInt(priority1);
}

function getShapeName(shape) {
    for (let i = 0; i < shapeList.length; i++) {
        if (shape[shapeList[i]]) return shape[shapeList[i]];
    }

    return null;
}

function defineRelationRank(shape, relation) {
    let count = 0;
    const segments = relation.segment || [];
    const angles = relation.angle || [];

    for (let i = 0; i < segments.length; i++) {
        if (isObjectinShape(shape, segments[i])) count++;
    }

    for (let i = 0; i < angles.length; i++) {
        if (isObjectinShape(shape, angles[i])) count++;
    }

    if (segments.length + angles.length === 0) return 3;

    return segments.length + angles.length + 1 - count;
}

function isObjectinShape(shape, object) {
    let count = 0;
    for (let i = 0; i < object.length; i++) {
        if (shape.includes(object[i])) count++;
    }

    return count === object.length;
}
