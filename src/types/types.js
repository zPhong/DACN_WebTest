type CoordinateType = {
    x: number,
    y: number,
    z: number
};

type NodeRelationType = {
    key: string,
    relation: any
};

export type NodeType = {
    id: string,
    isStatic: boolean,
    coordinate: CoordinateType,
    dependentNode: Array<NodeRelationType>
};

export type ResultType = {
    shapes: Array<mixed>,
    relations: Array<mixed>
};
