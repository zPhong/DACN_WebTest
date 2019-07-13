// @flow

import type {
  CoordinateType,
  LinearEquation,
  LineEquation,
  TwoVariableQuadraticEquation,
  Vector
} from '../../types/types';

import { IMPOSSIBLE, INFINITY, MAX_RANDOM_NUMBER, MIN_RANDOM_NUMBER, NOT_BE_IN_LINE } from '../values';
import {
  convertLinearEquationToLineType,
  convertLinearToQuadratic,
  convertLineEquationToLinearEquation,
  convertQuadraticEquationToLinearEquation
} from './Converter';

export function getStartPoint(): CoordinateType {
  return { x: 0, y: 0, z: 0 };
}

export function getRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

export function getRandomPointInLine(d: LinearEquation): CoordinateType {
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

function _makeRound(num: number): number {
  return Math.round(num * 1000) / 1000;
}

export function generatePointAlignmentInside(firstPoint: CoordinateType, secondPoint: CoordinateType): CoordinateType {
  const line = getLineFromTwoPoints(firstPoint, secondPoint);
  const tempX = (firstPoint.x + secondPoint.x) / getRandomValue(2, 5);
  return {
    x: tempX,
    y: (line.coefficientX * tempX + line.constantTerm) / -line.coefficientY
  };
}

export function generateCoordinateInQuadratic(quadratic: TwoVariableQuadraticEquation): CoordinateType {
  if (!quadratic) {
    throw { Error: 'Sai' };
  }
  const { a, b, c, d, e } = quadratic;
  let x, y;
  const randomValue = getRandomValue(MIN_RANDOM_NUMBER, MAX_RANDOM_NUMBER);
  if (d === 0) {
    const f = b * randomValue * randomValue + d * randomValue + e;
    const roots = calculateQuadraticEquation(a, c, f);
    if (typeof roots === 'string') {
      return { Error: 'AAAA' };
    } else {
      if (typeof roots === 'object') {
        x = roots.x1;
      } else if (roots) {
        x = roots;
      }
    }
    y = randomValue;
  } else if (c === 0) {
    const f = a * randomValue * randomValue + c * randomValue + e;
    const roots = calculateQuadraticEquation(b, d, f);
    if (typeof roots === 'string') {
      return { Error: 'AAAA' };
    } else {
      if (typeof roots === 'object') {
        y = roots.x1;
      } else if (roots) {
        y = roots;
      }
    }
    x = randomValue;
  }

  return { x, y };
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
        y: (line.coefficientX * tempXRight + line.constantTerm) / -line.coefficientY
      }
    : {
        x: tempXLeft,
        y: (line.coefficientX * tempXLeft + line.constantTerm) / -line.coefficientY
      };
}

export function generatePointNotAlignment(firstPoint: CoordinateType, secondPoint: CoordinateType): CoordinateType {
  let resultPoint: CoordinateType = {};
  resultPoint.x = getRandomValue(MIN_RANDOM_NUMBER, MAX_RANDOM_NUMBER);
  const line = getLineFromTwoPoints(firstPoint, secondPoint);
  do {
    resultPoint.y = getRandomValue(MIN_RANDOM_NUMBER, MAX_RANDOM_NUMBER);
  } while (resultPoint.y === line.coefficientX * resultPoint.x + line.constantTerm);
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

export function getLineFromTwoPoints(p1: CoordinateType, p2: CoordinateType): LinearEquation {
  const directionVector: Vector = { a: p2.x - p1.x, b: p2.y - p1.y };
  const normalVector: Vector = { a: -directionVector.b, b: directionVector.a };

  return {
    coefficientX: normalVector.a,
    coefficientY: normalVector.b,
    constantTerm: -normalVector.a * p1.x - normalVector.b * p1.y
  };
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
  // parallel line has `a` coefficient equals the other line.
  // parallel line's constantTerm = -ax - y with (x,y) is coordinate of the point
  const lineEquation = convertLinearEquationToLineType(line);
  const parLine: LineEquation = {};
  parLine.a = lineEquation.a;
  parLine.b = point.y - lineEquation.a * point.x;

  let result = convertLineEquationToLinearEquation(parLine);
  if (line.coefficientY === 0) {
    result.coefficientY = line.coefficientY;
  }
  return result;
}

export function calculatePerpendicularLineByPointAndLine(point: CoordinateType, line: LinearEquation): LinearEquation {
  let perpendicularLine: LinearEquation = {};

  // perpendicular line has the direction vector is opposite pairs with the other line.
  // perpendicular line's constantTerm = -ax - y with (x,y) is coordinate of the point
  if (line.coefficientX === 0) {
    perpendicularLine.coefficientX = -1 / line.coefficientY;
    perpendicularLine.coefficientY = 0;
    perpendicularLine.constantTerm = -perpendicularLine.coefficientX * point.x;
  } else if (line.coefficientY === 0) {
    perpendicularLine.coefficientX = 0;
    perpendicularLine.coefficientY = -1 / line.coefficientX;
    perpendicularLine.constantTerm = -perpendicularLine.coefficientY * point.y;
  } else {
    const lineEquation = convertLinearEquationToLineType(line);
    const perLine: LineEquation = {};
    perLine.a = -1 / lineEquation.a;
    perLine.b = point.y + point.x / lineEquation.a;

    perpendicularLine = convertLineEquationToLinearEquation(perLine);
  }

  return perpendicularLine;
}

export function calculateIntersectionByLineAndLine(lineOne: LinearEquation, lineTwo: LinearEquation): CoordinateType {
  return calculateSetOfLinearEquationAndQuadraticEquation(
    {
      coefficientX: lineOne.coefficientX,
      coefficientY: lineOne.coefficientY,
      constantTerm: lineOne.constantTerm
    },
    {
      a: 0,
      b: 0,
      c: lineTwo.coefficientX,
      d: lineTwo.coefficientY,
      e: lineTwo.constantTerm
    }
  )[0];
}

export function calculateCircleEquationByCenterPoint(
  centerPoint: CoordinateType,
  radius: number
): TwoVariableQuadraticEquation {
  return {
    a: 1,
    b: 1,
    c: -2 * centerPoint.x,
    d: -2 * centerPoint.y,
    e: centerPoint.x * centerPoint.x + centerPoint.y * centerPoint.y - radius * radius
  };
}

export function calculateInternalBisectLineEquation(
  lineOne: LinearEquation,
  lineTwo: LinearEquation,
  pointOne: CoordinateType,
  pointTwo: CoordinateType
): LinearEquation {
  const results = _calculateBisectLineEquation(lineOne, lineTwo);
  const firstLine: LinearEquation = results[0];
  const secondLine: LinearEquation = results[1];

  // const pointInFirstLine: CoordinateType = getRandomPointInLine(lineOne);
  // let pointInSecondLine: CoordinateType = { x: pointInFirstLine.x, y: undefined };
  // if (lineTwo.coefficientY !== 0) {
  //   pointInSecondLine.y = (-lineTwo.constantTerm - lineTwo.coefficientX * pointInSecondLine.x) / lineTwo.coefficientY;
  // } else {
  //   pointInSecondLine.y = getRandomValue(MIN_RANDOM_NUMBER, MAX_RANDOM_NUMBER);
  // }

  if (getAngleFromTwoLines(lineOne, lineTwo) === 0) {
    throw new Map().set('error', 'không hỗ trợ trường hợp này');
  }

  return _getInternalBisectLineEquation(firstLine, secondLine, pointOne, pointTwo);
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
  return firstEquation * secondEquation <= 0 ? lineOne : lineTwo;
}

// TODO: Uncheck
export function calculateSetOfLinearEquations(d1: LinearEquation, d2: LinearEquation) {
  if (
    (d1.coefficientX === 0 && d2.coefficientX === 0) ||
    (d1.coefficientY === 0 && d2.coefficientY === 0) ||
    (d1.coefficientX === 0 && d1.coefficientY === 0) ||
    (d2.coefficientX === 0 && d2.coefficientY === 0)
  ) {
    return IMPOSSIBLE;
  }
  if (d1.coefficientX === 0 && d2.coefficientY === 0) {
    return { x: -d2.constantTerm / d2.coefficientX, y: -d1.constantTerm / d1.coefficientY };
  }
  if (d2.coefficientX === 0 && d1.coefficientY === 0) {
    return { x: -d1.constantTerm / d1.coefficientX, y: -d2.constantTerm / d2.coefficientY };
  }
  if (d1.constantTerm === 0 && d2.constantTerm === 0) {
    return { x: 0, y: 0 };
  }

  if (d1.coefficientX === 0) {
    const tempY = -d1.constantTerm / d1.coefficientY;
    return { x: (-d2.constantTerm - tempY * d2.coefficientY) / d2.coefficientX, y: tempY };
  }

  if (d1.coefficientY === 0) {
    const tempX = -d1.constantTerm / d1.coefficientX;
    return { y: (-d2.constantTerm - tempX * d2.coefficientX) / d2.coefficientY, x: tempX };
  }

  if (d2.coefficientX === 0) {
    const tempY = -d2.constantTerm / d2.coefficientY;
    return { x: (-d1.constantTerm - tempY * d1.coefficientY) / d1.coefficientX, y: tempY };
  }

  if (d2.coefficientY === 0) {
    const tempX = -d2.constantTerm / d2.coefficientX;
    return { y: (-d1.constantTerm - tempX * d1.coefficientX) / d1.coefficientY, x: tempX };
  }

  const tempY =
    (d1.constantTerm * d2.coefficientX - d1.coefficientX * d2.constantTerm) /
    (d1.coefficientY * d2.coefficientX + d1.coefficientX * d2.coefficientY);
  return { x: (-d1.constantTerm - d1.coefficientY * tempY) / d1.coefficientX, y: tempY };
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
  q: TwoVariableQuadraticEquation
): Array<Object> {
  const A = -q.c / 2;
  const B = -q.d / 2;
  const centerPoint: CoordinateType = { x: A, y: B };
  const distanceFromCenterPointToLine = calculateDistanceFromPointToLine(centerPoint, d);

  if (distanceFromCenterPointToLine > Math.sqrt(A * A + B * B - q.e)) {
    return IMPOSSIBLE;
  } else {
    return calculateSetOfLinearEquationAndQuadraticEquation(d, q);
  }
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
  if (p.x === undefined || p.y === undefined) return false;
  if (e.a === undefined) {
    e = convertLinearToQuadratic(e);
  }
  const temp = e.a * p.x * p.x + e.b * p.y * p.y + e.c * p.x + e.d * p.y + e.e;
  return _makeRound(temp) === 0;
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
  let u, v, w;

  const A = l.coefficientX;
  const B = l.coefficientY;
  const C = l.constantTerm;
  const D = q.a;
  const E = q.b;
  const F = q.c;
  const G = q.d;
  const H = q.e;
  if (A !== 0) {
    u = A * A * E + D * B * B;
    v = 2 * B * C * D - A * B * F + A * A * G;
    w = D * C * C - A * C * F + A * A * H;

    // solves x. Unneeded check IMPOSSIBLE.
    const root = calculateQuadraticEquation(u, v, w);
    if (typeof root === 'number') {
      results.push({ x: (-C - B * root) / A, y: root });
    } else if (root === IMPOSSIBLE) {
      return root;
    } else {
      const r1 = root.x1;
      const r2 = root.x2;
      results.push({ x: (-C - B * root.x1) / A, y: r1 }, { x: (-C - B * root.x2) / A, y: r2 });
    }
  } else {
    u = q.a * l.coefficientY * l.coefficientY;
    v = q.c * l.coefficientY * l.coefficientY;
    w =
      q.b * l.constantTerm * l.constantTerm -
      q.d * l.coefficientY * l.constantTerm +
      q.e * l.coefficientY * l.coefficientY;

    // solves x. Unneeded check IMPOSSIBLE.
    const root = calculateQuadraticEquation(u, v, w);

    if (typeof root === 'number') {
      results.push({ x: root, y: -l.constantTerm / l.coefficientY });
    } else if (root === IMPOSSIBLE) {
      return root;
    } else {
      results.push(
        { x: root.x1, y: -l.constantTerm / l.coefficientY },
        { x: root.x2, y: -l.constantTerm / l.coefficientY }
      );
    }
  }

  return results;
}

export function calculateIntersectionTwoCircleEquations(
  firstEquation: TwoVariableQuadraticEquation,
  secondEquation: TwoVariableQuadraticEquation
) {
  let results: Array<Object> = [];
  let q1, q2;
  firstEquation.a === undefined ? (q1 = convertLinearToQuadratic(firstEquation)) : (q1 = firstEquation);
  secondEquation.a === undefined ? (q2 = convertLinearToQuadratic(secondEquation)) : (q2 = secondEquation);

  if (q1.a !== q2.a && q1.b !== q2.b) {
    if (q1.a === 0 && q1.b === 0) {
      // q2 is a quadratic equation
      return calculateIntersectionLinearEquationWithCircleEquation(convertQuadraticEquationToLinearEquation(q1), q2);
    } else {
      // q1 is a quadratic equation
      return calculateIntersectionLinearEquationWithCircleEquation(convertQuadraticEquationToLinearEquation(q2), q1);
    }
  } else if (q1.a === 0 && q1.b === 0 && q2.a === 0 && q2.b === 0) {
    results.push(
      calculateSetOfLinearEquations(
        convertQuadraticEquationToLinearEquation(q1),
        convertQuadraticEquationToLinearEquation(q2)
      )
    );
  } else {
    // a x2 + b y2 + Ax + By + C = 0
    // a'x2 + b'y2 + Dx + Ey + G = 0
    const D = q2.c;
    const E = q2.d;
    const G = q2.e;

    // Z = a - a'
    const Z = q1.a - q2.a > 0 ? q1.a : q2.a;
    const _D = Z === q1.a ? q1.c : D;
    const _E = Z === q1.a ? q1.d : E;
    const _G = Z === q1.a ? q1.e : G;

    const a = Z === q1.a ? q1.c - D : D - q1.c;
    const b = Z === q1.a ? q1.d - E : E - q1.d;
    const c = Z === q1.a ? q1.e - G : G - q1.e;

    if (a === 0 || b === 0) {
      return IMPOSSIBLE;
    } else {
      const u = Z * (b * b + a * a);
      const v = 2 * b * c * Z - _D * a * b + _E * a * a;
      const w = Z * c * c - _D * a * c + _G * a * a;

      const roots = calculateQuadraticEquation(u, v, w);
      if (roots === IMPOSSIBLE) {
        return roots;
      } else if (typeof roots === 'number') {
        results.push({
          x: (-c - b * roots) / a,
          y: roots
        });
      } else {
        const r1 = roots.x1;
        const r2 = roots.x2;
        results.push(
          {
            x: (-c - b * roots.x1) / a,
            y: r1
          },
          {
            x: (-c - b * roots.x2) / a,
            y: r2
          }
        );
      }
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
      coefficientX: root,
      coefficientY: 1,
      constantTerm: -root * p.x - p.y
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

export function makeRoundCoordinate(point: CoordinateType) {
  return {
    x: _makeRound(point.x),
    y: _makeRound(point.y)
  };
}

export function getAngleFromTwoLines(d1: LinearEquation, d2: LinearEquation): number {
  const a1 = d1.coefficientX;
  const a2 = d2.coefficientX;
  const b1 = d1.coefficientY;
  const b2 = d2.coefficientY;

  const result =
    (Math.acos(Math.abs(a1 * a2 + b1 * b2) / Math.sqrt((a1 * a1 + b1 * b1) * (a2 * a2 + b2 * b2))) * 180) / Math.PI;

  // round result
  return _makeRound(result);
}

export function getMiddlePointFromThreePointsInALine(
  p1: CoordinateType,
  p2: CoordinateType,
  p3: CoordinateType
): CoordinateType {
  const line = getLineFromTwoPoints(p1, p2);
  if (!isIn(p3, { a: 0, b: 0, c: line.coefficientX, d: line.coefficientY, e: line.constantTerm }))
    return NOT_BE_IN_LINE;

  // another way: check vector =)))~
  const dis_p1_p2 = calculateDistanceTwoPoints(p1, p2);
  const dis_p2_p3 = calculateDistanceTwoPoints(p2, p3);
  const dis_p1_p3 = calculateDistanceTwoPoints(p1, p3);

  const max = Math.max(dis_p1_p2, dis_p2_p3, dis_p1_p3);
  if (dis_p1_p2 === max) return p3;
  else if (dis_p1_p3 === max) return p2;
  else return p1;
}
