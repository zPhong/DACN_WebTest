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
  calculateParallelEquation,
  calculateTwoVariablesFirstDegreeEquations,
  calculateIntersectionLinearEquationWithCircleEquation,
  calculateIntersectionTwoCircleEquations,
  calculateSetOfLinearEquationAndQuadraticEquation,
  getLineFromTwoPoints,
  calculatePerpendicularLineByPointAndLine,
  calculateIntersectionByLineAndLine
} from './utils/math/Math2D';

class TestMath extends Component {
  render() {
    const firstPoint: CoordinateType = { x: -2, y: 3, z: 0 };
    const secondPoint: CoordinateType = { x: 2, y: 6, z: 0 };

    const f1: FirstDegreeEquation = { a: 4, b: 3, c: -23 };
    const f2: FirstDegreeEquation = { a: 3, b: -4, c: -36 };

    const d1: LinearEquation = {
      coefficientX: 1,
      coefficientY: 0,
      constantTerm: 0
    };
    const d2: LinearEquation = {
      coefficientX: 0,
      coefficientY: 1,
      constantTerm: -10
    };

    const c1: CircleEquation = {
      a: 0,
      b: 0,
      r: Math.sqrt(5)
    };
    const c2: CircleEquation = {
      a: 2,
      b: 4,
      r: Math.sqrt(5)
    };

    const q: TwoVariableQuadraticEquation = {
      a: 1,
      b: 1,
      c: -10,
      d: 6,
      e: 1
    };

    return (
      <div className="container">
        <div className="row">
          {console.log(calculateIntersectionByLineAndLine(d1, d2))}
        </div>
        <div>{calculateDistanceTwoPoints(firstPoint, secondPoint)}</div>
      </div>
    );
  }
}

export default TestMath;
