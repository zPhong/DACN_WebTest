// @flow

import type { CircleEquation, CoordinateType, LinearEquation, Vector } from '../../types/types';

export function getStartPoint(): CoordinateType {
  return { x: 0, y: 0, z: 0 };
}

export function calculateMiddlePoint(firstPoint: CoordinateType, secondPoint: CoordinateType): CoordinateType {
  let middlePoint: CoordinateType = { z: 0 };
  middlePoint.x = (firstPoint.x + secondPoint.x) / 2;
  middlePoint.y = (firstPoint.y + secondPoint.y) / 2;

  return middlePoint;
}

export function calculateLinearPointFromTwoPoints(
  firstPoint: CoordinateType,
  secondPoint: CoordinateType
): LinearEquation {
  let directionVector: Vector = { z: 0 };
  directionVector.a = secondPoint.x - firstPoint.x;
  directionVector.b = secondPoint.y - firstPoint.y;

  let normalVector: Vector = { z: 0 };
  normalVector.a = directionVector.b;
  normalVector.b = -directionVector.a;

  const constantTerm = Math.floor(Math.random() * 100) - 50;

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
