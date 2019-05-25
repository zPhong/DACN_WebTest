import type { NodeType, RelationsResultType } from './types/types';

class AppModel {
  relationsResult: RelationsResultType = {};
  pointsMap: Array<NodeType> = [];

  clear() {
    this.relationsResult = [];
    this.pointsMap = [];
  }
}

const appModel = new AppModel();

export default appModel;
