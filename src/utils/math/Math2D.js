// @flow

import type {
  CircleEquation,
  CoordinateType,
  FirstDegreeEquation,
  LinearEquation,
  TwoVariableQuadraticEquation,
  Vector
} from '../../types/types';

const INFINITY = 'vô cực';
const IMPOSSIBLE = 'vô nghiệm';
const MIN_RANDOM_NUMBER = 5;
const MAX_RANDOM_NUMBER = 30;

export function getStartPoint(): CoordinateType {
  return { x: 0, y: 0, z: 0 };
}

export function getRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

function getRandomPointInLine(d: LinearEquation): CoordinateType {
  if (d.coefficientY !== 0) {
    const tempX = getRandomValue(MIN_RANDOM_NUMBER, MAX_RANDOM_NUMBER);
    return {
      x: tempX,
      y: (-d.constantTerm - d.coefficientX * tempX) / d.coefficientY
    };
  } else {
    return {
      x: -d.constantTerm / d.coefficientX,
      y: getRandomValue(MIN_RANDOM_NUMBER, MAX_RANDOM_NUMBER)
    };
  }
}

export function generatePointAlignmentInside(firstPoint: CoordinateType, secondPoint: CoordinateType): CoordinateType {
  const constant = getRandomValue(2, 5);
  return {
    x: (firstPoint.x + secondPoint.x) / constant,
    y: (firstPoint.y + secondPoint.y) / constant
  };
}

export function generatePointAlignmentOutside(
  firstPoint: CoordinateType,
  secondPoint: CoordinateType,
  isRight: boolean = true
): CoordinateType {
  const line = getLineFromTwoPoints(firstPoint, secondPoint);
  const tempXRight = getRandomValue(secondPoint.x, MAX_RANDOM_NUMBER);
  const tempXLeft = getRandomValue(MIN_RANDOM_NUMBER, firstPoint.x);
  return isRight
    ? {
        x: tempXRight,
        y: line.coefficientX * tempXRight + line.constantTerm
      }
    : {
        x: tempXLeft,
        y: line.coefficientX * tempXLeft + line.constantTerm
      };
}

export function generatePointNotAlignment(firstPoint: CoordinateType, secondPoint: CoordinateType): CoordinateType {
  let resultPoint: CoordinateType = {};
  resultPoint.x = getRandomValue(MIN_RANDOM_NUMBER, MAX_RANDOM_NUMBER);
  const line = getLineFromTwoPoints(firstPoint, secondPoint);
  do {
    resultPoint.y = getRandomValue(MIN_RANDOM_NUMBER, MAX_RANDOM_NUMBER);
  } while (resultPoint.y !== line.coefficientX * resultPoint.x + line.constantTerm);
  return resultPoint;
}

export function calculateMiddlePoint(firstPoint: CoordinateType, secondPoint: CoordinateType): CoordinateType {
  return {
    x: (firstPoint.x + secondPoint.x) / 2,
    y: (firstPoint.y + secondPoint.y) / 2
  };
}

export function calculateSymmetricalPoint(
  firstPoint: CoordinateType,
  secondPoint: CoordinateType,
  isRight: boolean = true
): CoordinateType {
  return isRight
    ? {
        x: 2 * secondPoint.x - firstPoint.x,
        y: 2 * secondPoint.y - firstPoint.y
      }
    : {
        x: 2 * firstPoint.x - secondPoint.x,
        y: 2 * firstPoint.y - secondPoint.y
      };
}

function getLineFromTwoPoints(p1: CoordinateType, p2: CoordinateType): LinearEquation {
  const result = calculateSetOfLinearEquationAndQuadraticEquation(
    {
      coefficientX: p1.x,
      coefficientY: 1,
      constantTerm: -p1.y
    },
    {
      a: 0,
      b: 0,
      c: p2.x,
      d: 1,
      e: -p2.y
    }
  );
  return { coefficientX: result.x, coefficientY: -1, constantTerm: result.y };
}

export function calculateLinearEquationFromTwoPoints(
  firstPoint: CoordinateType,
  secondPoint: CoordinateType
): LinearEquation {
  let directionVector: Vector = { z: 0 };
  directionVector.a = secondPoint.x - firstPoint.x;
  directionVector.b = secondPoint.y - firstPoint.y;

  let normalVector: Vector = { z: 0 };
  normalVector.a = directionVector.b;
  normalVector.b = -directionVector.a;

  const constantTerm = firstPoint.y - normalVector.a * firstPoint.x;

  let linearEquation: LinearEquation = {};
  linearEquation.coefficientX = normalVector.a;
  linearEquation.coefficientY = normalVector.b;
  linearEquation.constantTerm = constantTerm;

  return linearEquation;
}

export function calculateParallelEquation(linearEquation: LinearEquation): LinearEquation {
  // Random a constance term from MIN_RANDOM_NUMBER -> MAX_RANDOM_NUMBER
  const constantTerm = Math.floor(Math.random() * 100) - MAX_RANDOM_NUMBER;

  let parallelEquation: LinearEquation = { coefficientZ: 0 };
  parallelEquation.coefficientX = linearEquation.coefficientX;
  parallelEquation.coefficientY = linearEquation.coefficientY;
  parallelEquation.constantTerm = constantTerm;

  return parallelEquation;
}

export function calculatePerpendicularEquation(linearEquation: LinearEquation): LinearEquation {
  // Random a constance term from MIN_RANDOM_NUMBER -> MAX_RANDOM_NUMBER
  const constantTerm = Math.floor(Math.random() * 100) - MAX_RANDOM_NUMBER;

  let perpendicularEquation: LinearEquation = { coefficientZ: 0 };
  perpendicularEquation.coefficientX = -linearEquation.coefficientX;
  perpendicularEquation.coefficientY = linearEquation.coefficientY;
  perpendicularEquation.constantTerm = constantTerm;

  return perpendicularEquation;
}

export function calculateDistanceTwoPoints(firstPoint: CoordinateType, secondPoint: CoordinateType): number {
  const squareX = (secondPoint.x - firstPoint.x) * (secondPoint.x - firstPoint.x);
  const squareY = (secondPoint.y - firstPoint.y) * (secondPoint.y - firstPoint.y);

  return Math.sqrt(squareX + squareY);
}

export function calculateDistanceFromPointToLine(point: CoordinateType, line: LinearEquation): number {
  let numerator = Math.abs(line.coefficientX * point.x + line.coefficientY * point.y + line.constantTerm);
  let denominator = Math.sqrt(line.coefficientX * line.coefficientX + line.coefficientY * line.coefficientY);

  if (denominator === 0) return INFINITY;
  return numerator / denominator;
}

export function calculateParallelLineByPointAndLine(point: CoordinateType, line: LinearEquation): LinearEquation {
  let parallelLine: LinearEquation = {};

  // parallel line has `a` coefficient equals the other line.
  // parallel line's constantTerm = -ax - y with (x,y) is coordinate of the point
  parallelLine.coefficientX = line.coefficientX;
  parallelLine.coefficientY = line.coefficientY;
  parallelLine.constantTerm = -parallelLine.coefficientX * point.x - point.y;

  return parallelLine;
}

export function calculatePerpendicularLineByPointAndLine(point: CoordinateType, line: LinearEquation): LinearEquation {
  let perpendicularLine: LinearEquation = {};

  // perpendicular line has the direction vector is opposite pairs with the other line.
  // perpendicular line's constantTerm = -ax - y with (x,y) is coordinate of the point
  perpendicularLine.coefficientX = -line.coefficientX;
  perpendicularLine.coefficientY = -line.coefficientY;
  perpendicularLine.constantTerm = -perpendicularLine.coefficientX * point.x - point.y;

  return perpendicularLine;
}

export function calculateIntersectionByLineAndLine(lineOne: LinearEquation, lineTwo: LinearEquation): CoordinateType {
  let crossPoint: CoordinateType = {};

  // ax + y + b = a'x + y + b'
  // => x = (b' - b) / (a - a')
  crossPoint.x = (lineTwo.constantTerm - lineOne.constantTerm) / (lineOne.coefficientX - lineTwo.coefficientX);

  // ax + y + b = 0
  // => y = -b - ax
  crossPoint.y = -lineOne.constantTerm - lineOne.coefficientX * crossPoint.x;

  return crossPoint;
}

export function calculateCircleEquationByCenterPoint(centerPoint: CoordinateType, radius: number): CircleEquation {
  let circleEquation: CircleEquation = {};
  circleEquation.a = centerPoint.x;
  circleEquation.b = centerPoint.y;
  circleEquation.r = Math.abs(radius);

  return circleEquation;
}

export function calculateInternalBisectLineEquation(lineOne: LinearEquation, lineTwo: LinearEquation): LinearEquation {
  const results = _calculateBisectLineEquation(lineOne, lineTwo);
  const firstLine: LinearEquation = results[0];
  const secondLine: LinearEquation = results[1];

  const pointInFirstLine: CoordinateType = getRandomPointInLine(lineOne);
  let pointInSecondLine: CoordinateType = { x: pointInFirstLine.x, y: undefined };
  if (lineTwo.coefficientY !== 0) {
    pointInSecondLine.y = (-lineTwo.constantTerm - lineTwo.coefficientX * pointInSecondLine.x) / lineTwo.coefficientY;
  } else {
    pointInSecondLine.y = getRandomValue(MIN_RANDOM_NUMBER, MAX_RANDOM_NUMBER);
  }
  return _getInternalBisectLineEquation(firstLine, secondLine, pointInFirstLine, pointInSecondLine);
}

function _calculateBisectLineEquation(
  lineOne: LinearEquation,
  lineTwo: LinearEquation
): [LinearEquation, LinearEquation] {
  let resultOne: LinearEquation = {};
  let resultTwo: LinearEquation = {};

  // ax + by + c = +/- [sqrt(a*a + b*b) / sqrt(a'*a' + b'*b')] * (a'x + b'y + c)

  // check if denominator equals 0
  if (lineTwo.coefficientX * lineTwo.coefficientX + lineTwo.coefficientY * lineTwo.coefficientY === 0) return;

  // Represent for [sqrt(a*a + b*b) / sqrt(a'*a' + b'*b')]
  let coefficient =
    Math.sqrt(lineOne.coefficientX * lineOne.coefficientX + lineOne.coefficientY * lineOne.coefficientY) /
    Math.sqrt(lineTwo.coefficientX * lineTwo.coefficientX + lineTwo.coefficientY * lineTwo.coefficientY);

  /*
   * Two results:
   *    (a - coefficient*a')x + (b - coefficient*b')y + c - coefficient*c' = 0
   *    (a + coefficient*a')x + (b + coefficient*b')y + c + coefficient*c' = 0
   */
  resultOne.coefficientX = lineOne.coefficientX - coefficient * lineTwo.coefficientX;
  resultOne.coefficientY = lineOne.coefficientY - coefficient * lineTwo.coefficientY;
  resultOne.constantTerm = lineOne.constantTerm - coefficient * lineTwo.constantTerm;

  resultTwo.coefficientX = lineOne.coefficientX + coefficient * lineTwo.coefficientX;
  resultTwo.coefficientY = lineOne.coefficientY + coefficient * lineTwo.coefficientY;
  resultTwo.constantTerm = lineOne.constantTerm + coefficient * lineTwo.constantTerm;

  return [resultOne, resultTwo];
}

/*
 *   Line one and line two is 2 lines are the result of _calculateBisectLineEquation function
 *   Point one and point two are 2 points that each point located in each line
 *             which is equivalent each argument in _calculateBisectLineEquation function
 */
function _getInternalBisectLineEquation(
  lineOne: LinearEquation,
  lineTwo: LinearEquation,
  pointOne: CoordinateType,
  pointTwo: CoordinateType
): LinearEquation {
  let firstEquation = pointOne.x * lineOne.coefficientX + pointOne.y * lineOne.coefficientY + lineOne.constantTerm;
  let secondEquation = pointTwo.x * lineOne.coefficientX + pointTwo.y * lineOne.coefficientY + lineOne.constantTerm;
  return firstEquation * secondEquation > 0 ? lineOne : lineTwo;
}

function _getPointInLineWithCondition(
  line: LinearEquation,
  axis: string,
  comparison: string,
  point: CoordinateType
): CoordinateType {
  if (axis !== 'vertical' || axis !== 'horizontal' || comparison !== 'bigger' || comparison !== 'smaller') {
    return {};
  }

  if (axis === 'horizontal') {
  } else {
  }
}

export function calculateTwoVariablesFirstDegreeEquations(e1: FirstDegreeEquation, e2: FirstDegreeEquation) {
  let y = (e1.a * e2.c - e2.a * e1.c) / (e1.a * e2.b - e2.a * e1.b);
  let x = (e1.c - e1.b * y) / e1.a;

  return { x, y };
}

/*
 *  Find point(s) of intersection between a linear equation and a circle equation.
 *  @params:
 *        + d (LinearEquation): a line.
 *        + c (CircleEquation): a circle.
 *  @return:
 *        + IMPOSSIBLE: if distance from center point of the circle to the line is greater than the radius.
 *        + (Array<Object>): if the line intersects the circle.
 *          + length = 1;
 *          + length = 2;
 */
export function calculateIntersectionLinearEquationWithCircleEquation(
  d: LinearEquation,
  c: CircleEquation
): Array<Object> {
  const centerPoint: CoordinateType = { x: c.a, y: c.b };
  const distanceFromCenterPointToLine = calculateDistanceFromPointToLine(centerPoint, d);
  console.log(distanceFromCenterPointToLine);
  if (distanceFromCenterPointToLine > c.r) {
    return IMPOSSIBLE;
  } else {
    console.log(convertCircleEquationToQuadraticEquation(c));
    return calculateSetOfLinearEquationAndQuadraticEquation(d, convertCircleEquationToQuadraticEquation(c));
  }
}

function convertCircleEquationToQuadraticEquation(c: CircleEquation): TwoVariableQuadraticEquation {
  return {
    a: 1,
    b: 1,
    c: -2 * c.a,
    d: -2 * c.b,
    e: Math.round(c.a * c.a + c.b * c.b - c.r * c.r)
  };
}

/*
 * Solves a quadratic equation. This equation is defined: Ax2 + Bx + C = 0.
 *
 *  @params:
 *        + a (number): represents x's coefficient.
 *        + b (number): represents y's coefficient.
 *        + c (number): represents constant term.
 * @return:
 *        + IMPOSSIBLE (string): if the equation is no root.
 *        + (number): if the equation has only ONE root.
 *        + x1, x2 (Object): if the equation has TWO root.
 */
export function calculateQuadraticEquation(a: number, b: number, c: number) {
  const delta = b * b - 4 * a * c;
  let x1,
    x2: number = undefined;

  if (a === 0) {
    return -c / b;
  } else if (delta < 0) {
    return IMPOSSIBLE;
  } else if (delta === 0) {
    return -b / (2 * a);
  } else {
    x1 = (-b + Math.sqrt(delta)) / (2 * a);
    x2 = (-b - Math.sqrt(delta)) / (2 * a);
    return { x1, x2 };
  }
}

// Ax2 + By2 + Cx + Dy + E = 0
export function isIn(p: CoordinateType, e: TwoVariableQuadraticEquation): boolean {
  return e.a * p.x * p.x + e.b * p.y * p.y + e.c * p.x + e.d * p.y + e.e === 0;
}

/*
 *  Solves a set of a linear equation and quadratic equation.
 *  Linear equation is defined:     Ax + By + C = 0.
 *  Quadratic equation is defined:  Ax2 + By2 + Cx + Dy + E = 0.
 *
 *  @params:
 *        + l (LinearEquation): represents a linear equation.
 *        + q (QuadraticEquation): represents a quadratic equation.
 *  @return:
 *        + IMPOSSIBLE (string): if the set is no root.
 *        + (number): if the set has only ONE root.
 *        + x1, x2 (Object): if the set has TWO root.
 */
export function calculateSetOfLinearEquationAndQuadraticEquation(
  l: LinearEquation,
  q: TwoVariableQuadraticEquation
): Array<Object> {
  let results: Array<Object> = [];

  const u = q.a * l.coefficientY * l.coefficientY + q.b * l.coefficientX * l.coefficientX;
  const v =
    2 * l.coefficientX * l.constantTerm * q.b +
    q.c * l.coefficientY * l.coefficientY -
    q.d * l.coefficientY * l.coefficientX;
  const w =
    q.b * l.constantTerm * l.constantTerm -
    q.d * l.coefficientY * l.constantTerm +
    q.e * l.coefficientY * l.coefficientY;

  // solves x. Unneeded check IMPOSSIBLE.
  const root = calculateQuadraticEquation(u, v, w);

  if (typeof root === 'number') {
    results.push(Object({ x: root, y: (-l.constantTerm - l.coefficientX * root) / l.coefficientY }));
  } else if (root === IMPOSSIBLE) {
    return root;
  } else {
    results.push(
      Object({ x: root.x1, y: (-l.constantTerm - l.coefficientX * root.x1) / l.coefficientY }),
      Object({ x: root.x2, y: (-l.constantTerm - l.coefficientX * root.x2) / l.coefficientY })
    );
  }

  return results;
}

export function calculateIntersectionTwoCircleEquations(c1: CircleEquation, c2: CircleEquation) {
  const q1 = convertCircleEquationToQuadraticEquation(c1);
  const q2 = convertCircleEquationToQuadraticEquation(c2);
  console.log(q1);
  console.log(q2);
  let results: Array<Object> = [];

  const C = q1.c - q2.c;
  const D = q1.d - q2.d;
  const E = q2.e - q1.e;

  if (C === 0 && D === 0 && E === 0) {
    return INFINITY;
  }

  if (D !== 0) {
    const a = D * D + C * C;
    const b = D * D * q1.c - 2 * E * C - q1.d * D * C;
    const c = E * E + q1.e * D * D + q1.d * D * E;
    const root = calculateQuadraticEquation(a, b, c);
    if (typeof root === 'number') {
      results.push(
        Object({
          x: root,
          y: (E - C * root) / D
        })
      );
    } else if (root === IMPOSSIBLE) {
      return root;
    } else {
      results.push(
        Object({
          x: root.x1,
          y: (E - C * root.x1) / D
        }),
        Object({
          x: root.x2,
          y: (E - C * root.x2) / D
        })
      );
    }
  } else {
    const a = D * D + C * C;
    const b = C * C * q1.d - 2 * E * D - q1.c * D * C;
    const c = E * E + q1.e * C * C + q1.c * C * E;
    const root = calculateQuadraticEquation(a, b, c);
    if (typeof root === 'number') {
      results.push(
        Object({
          x: E / C,
          y: root
        })
      );
    } else if (root === IMPOSSIBLE) {
      return root;
    } else {
      results.push(
        Object({
          x: E / C,
          y: root.x1
        }),
        Object({
          x: E / C,
          y: root.x2
        })
      );
    }
  }

  return results;
}

export function calculateLinesByAnotherLineAndAngle(d: LinearEquation, p: CoordinateType, angle: number) {
  let results: Array<LinearEquation> = [];

  const cosine = Math.cos((angle * Math.PI) / 180);
  const A =
    d.coefficientX * d.coefficientX -
    cosine * cosine * d.coefficientX * d.coefficientX -
    cosine * cosine * d.coefficientY * d.coefficientY;
  const B = 2 * d.coefficientX * d.coefficientY;
  const C =
    d.coefficientY * d.coefficientY -
    cosine * cosine * d.coefficientX * d.coefficientX -
    cosine * cosine * d.coefficientY * d.coefficientY;
  const root = calculateQuadraticEquation(A, B, C);

  if (typeof root === 'number') {
    results.push({
      x: Math.round(root),
      y: -Math.round(root) * p.x - p.y
    });
  } else if (root === IMPOSSIBLE) {
    return root;
  } else {
    results.push(
      {
        coefficientX: root.x1,
        coefficientY: 1,
        constantTerm: -root.x1 * p.x - p.y
      },
      {
        coefficientX: root.x2,
        coefficientY: 1,
        constantTerm: -root.x2 * p.x - p.y
      }
    );
  }

  return results;
}
