import React, { Component } from 'react';
import './css/App.css';
import type {
  CircleEquation,
  CoordinateType,
  FirstDegreeEquation,
  LinearEquation,
  TwoVariableQuadraticEquation
} from './types/types';
import {
  calculateDistanceTwoPoints,
  calculateLinearEquationFromTwoPoints,
  calculateParallelEquation,
  calculateTwoVariablesFirstDegreeEquations,
  calculateIntersectionLinearEquationWithCircleEquation,
  calculateSetOfLinearEquationAndQuadraticEquation
} from './utils/math/Math2D';

class TestMath extends Component {
  render() {
    const firstPoint: CoordinateType = { x: 1, y: 2, z: 0 };
    const secondPoint: CoordinateType = { x: 7, y: 3, z: 0 };
    const linearEquation: LinearEquation = calculateLinearEquationFromTwoPoints(firstPoint, secondPoint);

    const f1: FirstDegreeEquation = { a: 4, b: 3, c: -23 };
    const f2: FirstDegreeEquation = { a: 3, b: -4, c: -36 };
    const d: LinearEquation = {
      coefficientX: 0.5,
      coefficientY: -1,
      constantTerm: -5.5
    };
    const c: CircleEquation = {
      a: 5,
      b: -3,
      r: 5
    };
    const q: TwoVariableQuadraticEquation = {
      a: 1,
      b: 1,
      c: -10,
      d: 6,
      e: 1
    };

    const equation = calculateParallelEquation(linearEquation);
    return (
      <div className="container">
        <div className="row">
          {equation.coefficientX}x{equation.coefficientY === 0 ? '' : equation.coefficientY > 0 ? '+' : ''}
          {equation.coefficientY === 0 ? '' : `${equation.coefficientY}y`}
          {equation.constantTerm === 0 ? '' : equation.constantTerm > 0 ? '+' : ''}
          {equation.constantTerm === 0 ? '' : `${equation.constantTerm}`}= 0
          {console.log(calculateSetOfLinearEquationAndQuadraticEquation(d, q))}
        </div>
        <div>{calculateDistanceTwoPoints(firstPoint, secondPoint)}</div>
      </div>
    );
  }
}

export default TestMath;
