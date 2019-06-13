import type { LinearEquation, LineEquation, TwoVariableQuadraticEquation } from '../../types/types';

export function convertLinearToQuadratic(l: LinearEquation): TwoVariableQuadraticEquation {
  return {
    a: 0,
    b: 0,
    c: l.coefficientX,
    d: l.coefficientY,
    e: l.constantTerm
  };
}

export function convertLinearEquationToLineType(line: LinearEquation): LineEquation {
  return {
    a: -line.coefficientX / (line.coefficientY === 0 ? 1 : line.coefficientY),
    b: -line.constantTerm / (line.coefficientY === 0 ? 1 : line.coefficientY)
  };
}

export function convertLineEquationToLinearEquation(line: LineEquation): LinearEquation {
  return {
    coefficientX: -line.a,
    coefficientY: 1,
    constantTerm: -line.b
  };
}

export function convertQuadraticEquationToLinearEquation(q: TwoVariableQuadraticEquation): LinearEquation {
  return { coefficientX: q.c, coefficientY: q.d, constantTerm: q.e };
}
