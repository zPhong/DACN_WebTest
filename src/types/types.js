export type CoordinateType = {
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

export type LinearEquation = {
  coefficientX: number,
  coefficientY: number,
  coefficientZ: number,
  constantTerm: number,
}

export type Vector = {
  a: number,
  b: number,
  c: number,
}

// (x − a)2 + (y − b)2 = r2
export type CircleEquation = {
  a: number,
  b: number,
  r: number,
}