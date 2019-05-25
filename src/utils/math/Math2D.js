// @flow

import type { CircleEquation, CoordinateType, FirstDegreeEquation, LinearEquation, Vector } from '../../types/types';

const INFINITY = 'vô cực';
const IMPOSSIBLE = 'vô nghiệm';

export function getStartPoint(): CoordinateType {
  return { x: 0, y: 0, z: 0 };
}

export function getRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

export function calculateMiddlePoint(firstPoint: CoordinateType, secondPoint: CoordinateType): CoordinateType {
  let middlePoint: CoordinateType = { z: 0 };
  middlePoint.x = (firstPoint.x + secondPoint.x) / 2;
  middlePoint.y = (firstPoint.y + secondPoint.y) / 2;

  return middlePoint;
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
  // Random a constance term from -50 -> 50
  const constantTerm = Math.floor(Math.random() * 100) - 50;

  let parallelEquation: LinearEquation = { coefficientZ: 0 };
  parallelEquation.coefficientX = linearEquation.coefficientX;
  parallelEquation.coefficientY = linearEquation.coefficientY;
  parallelEquation.constantTerm = constantTerm;

  return parallelEquation;
}

export function calculatePerpendicularEquation(linearEquation: LinearEquation): LinearEquation {
  // Random a constance term from -50 -> 50
  const constantTerm = Math.floor(Math.random() * 100) - 50;

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
  const firstLine = _calculateBisectLineEquation(lineOne, lineTwo)[0];
  const secondLine = _calculateBisectLineEquation(lineOne, lineTwo)[1];

  let pointInFirstLine;
  let pointInSecondLine;
  return _getInternalBisectLineEquation();
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

function _getPointInLine(line: LinearEquation): CoordinateType {
  let point: CoordinateType = {};
  point.x = Math.floor(Math.random() * 100) - 50;
  point.y = line.coefficientX * point.x + line.constantTerm;

  return point;
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
  let results: Array<Object> = [];

  const distanceFromCenterPointToLine = calculateDistanceFromPointToLine(centerPoint, d);

  if (distanceFromCenterPointToLine > c.r) {
    return IMPOSSIBLE;
  } else {
    const u = d.coefficientX * d.coefficientX + d.coefficientY * d.coefficientY;
    const v =
      2 * d.coefficientX * d.coefficientY * c.b -
      2 * d.coefficientX * d.constantTerm -
      2 * c.a * d.coefficientY * d.coefficientY;
    const w =
      d.coefficientY * d.coefficientY * c.r * c.r -
      d.coefficientY * d.coefficientY * c.a * c.a -
      d.coefficientY * d.coefficientY * c.b * c.b +
      2 * d.coefficientY * d.constantTerm * c.b -
      d.constantTerm * d.constantTerm;

    // solves x. Unneeded check IMPOSSIBLE.
    const root = calculateQuadraticEquation(u, v, -w);

    if (typeof root === 'number') {
      results.push(Object({ x: root, y: (d.constantTerm - d.coefficientX * root) / d.coefficientY }));
    } else {
      results.push(
        Object({ x: root.x1, y: (d.constantTerm - d.coefficientX * root.x1) / d.coefficientY }),
        Object({ x: root.x2, y: (d.constantTerm - d.coefficientX * root.x2) / d.coefficientY })
      );
    }

    return results;
  }
}

/*
 * Solves a quadratic equation. This equation is defined: Ax2 + Bx + C = 0
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
