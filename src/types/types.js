export type CoordinateType = {
    x: number,
    y: number,
    z: number
};

type NodeRelationType = {
    id: string,
    relation: any
};

export type NodeType = {
    id: string,
    isStatic: boolean,
    coordinate: CoordinateType,
    dependentNode: Array<NodeRelationType>
};

export type RelationsResultType = {
    shapes: Array<mixed>,
    relations: Array<mixed>
};
