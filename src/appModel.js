import type {
    NodeType,
        ResultType,
        NodeRelationType,
        CoordinateType
} from './types/types';

class AppModel {
    relationsResult: RelationsResultType = {};
    PointsMap: Array<NodeType> = [];
}

const appModel = new AppModel();

export default appModel;
