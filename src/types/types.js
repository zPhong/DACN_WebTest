export type CoordinateType = {
  x: number,
  y: number,
  z: number
};

export type HasFixedCoordinateType = {
  fixedX: boolean,
  fixedY: boolean,
  fixedZ: boolean,
}

export type DrawingNodeType = {
  id: string,
  coordinate: CoordinateType
};

export type NodeRelationType = {
  id: string,
  relation: any
};

export type NodeType = {
  id: string,
  isStatic: boolean,
  coordinate: CoordinateType,
  hasFixedCoordinate: HasFixedCoordinateType,
  dependentNodes: Array<NodeRelationType>
};

export type RelationsResultType = {
  shapes: Array<mixed>,
  relations: Array<mixed>
};

export type DrawingDataType = {
  points: Array<DrawingNodeType>,
  segment: Array<string>
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