import type {
    NodeType,
    NodeRelationType,
    CoordinateType
} from '../../types/types';
import appModel from '../../appModel';

const executedRelations = [];

function readPointsMap(): Array<CoordinateType> {}

function _isStaticNode(node: NodeType): boolean {
    if (node.isStatic) return true;
    let count = 0;
    node.dependentNode((dNode: NodeRelationType) => {
        if (!_isExecutedRelation(dNode.relation)) count++;
    });

    return count === 0;
}

function _isExecutedRelation(relation: any): boolean {
    for (let i = 0; i < executedRelations.length; i++) {
        if (relation === executedRelations[i]) return true;
    }
    return false;
}

function _updateStaticNode() {
    appModel.PointsMap = appModel.PointsMap.map(
        (node: NodeType): NodeType => {
            node.isStatic = _isStaticNode(node);
            return node;
        }
    );
}

function _getNextExcutionNode(): NodeType {
    const clonePointsMap = [...appModel.pointsMap].sort(sortNodeByPriority);
    return clonePointsMap[0];
}

function sortNodeByPriority(nodeOne: NodeType, nodeTwo: NodeType): number {
    const staticNodeOneCount = _getDependentStaticNodeCount(nodeOne);
    const nodeOneData = {
        static: staticNodeOneCount,
        nonStatic: nodeOne.dependentNode.length - staticNodeOneCount,
        dependence: nodeOne.dependentNode.length,
        minRelationIndex: _getMinIndexOfDependentNodeInRelationsList(nodeOne),
        index: _getIndexOfNodeInPointsMap(nodeOne)
    };

    const staticNodeTwoCount = _getDependentStaticNodeCount(nodeTwo);
    const nodeTwoData = {
        static: staticNodeTwoCount,
        nonStatic: nodeTwo.dependentNode.length - staticNodeTwoCount,
        dependence: nodeTwo.dependentNode.length,
        minRelationIndex: _getMinIndexOfDependentNodeInRelationsList(nodeTwo),
        index: _getIndexOfNodeInPointsMap(nodeTwo)
    };

    //get Max
    const rankingOrderDesc = ['dependence', 'static'];

    //get Min
    const rankingOrderAsc = ['nonStatic', 'minRelationIndex', 'index'];

    let rankOne = nodeOneData.static === nodeOneData.dependence ? '1' : '0';
    let rankTwo = nodeTwoData.static === nodeTwoData.dependence ? '1' : '0';

    rankingOrderDesc.forEach(key => {
        if (nodeOneData[key] > nodeTwoData[key]) {
            rankOne += '1';
            rankTwo += '0';
        } else if (nodeOneData[key] === nodeTwoData[key]) {
            rankOne += '1';
            rankTwo += '1';
        } else {
            rankOne += '0';
            rankTwo += '1';
        }
    });

    rankingOrderAsc.forEach(key => {
        if (nodeOneData[key] < nodeTwoData[key]) {
            rankOne += '1';
            rankTwo += '0';
        } else if (nodeOneData[key] === nodeTwoData[key]) {
            rankOne += '1';
            rankTwo += '1';
        } else {
            rankOne += '0';
            rankTwo += '1';
        }
    });

    return parseInt(rankTwo) - parseInt(rankOne);
}

function _getMinIndexOfDependentNodeInRelationsList(node: NodeType) {
    const indexArray = [];
    for (let i = 0; i < node.dependentNode.length; i++) {
        indexArray.push(
            _getIndexOfRelationInRelationsList(node.dependentNode[i])
        );
    }

    return Math.min(...indexArray);
}

function _getIndexOfRelationInRelationsList(relation: any): number {
    const list = [
        ...appModel.relationsResult.shapes,
        ...appModel.relationsResult.relations
    ];
    for (let i = 0; i < list.length; i++) {
        if (relation === list[i]) return i;
    }
    return 99;
}

function _getDependentStaticNodeCount(node: NodeType): number {
    let count = 0;
    for (let i = 0; i < node.dependentNode.length; i++) {
        if (_isStaticNodeById(node.dependentNode[i].id)) count++;
    }

    return count;
}

function _getIndexOfNodeInPointsMap(node): number {
    for (let i = 0; i < appModel.pointsMap.length; i++) {
        if (node === appModel.pointsMap[i]) return i;
    }
    return 99;
}

function _isStaticNodeById(id: string): boolean {
    for (let i = 0; i < appModel.pointsMap; i++) {
        if (id === appModel.pointsMap[i].id) {
            return _isStaticNode(appModel.pointsMap[i].id);
        }
    }
    return false;
}
