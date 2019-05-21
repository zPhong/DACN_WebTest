import type { NodeType, RelationsResultType } from './types/types';

class AppModel {
    relationsResult: RelationsResultType = {};
    pointsMap: Array<NodeType> = [];
}

const appModel = new AppModel();

export default appModel;
