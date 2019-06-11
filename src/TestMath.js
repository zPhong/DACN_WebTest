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
  getLineFromTwoPoints,
  getMiddlePointFromThreePointsInALine
} from "./utils/math/Math2D";

class TestMath extends Component {
  render() {
    const firstPoint: CoordinateType = {
      x: 2,
      y: 3
    };
    const secondPoint: CoordinateType = {
      x: 3,
      y: 4
    };
    const thirdPoint: CoordinateType = {
      x: 4,
      y: 5,
    };

    const f1: FirstDegreeEquation = { a: 4, b: 3, c: -23 };
    const f2: FirstDegreeEquation = { a: 3, b: -4, c: -36 };

    const d1: LinearEquation = {
      coefficientX: 3,
      coefficientY: -1,
      constantTerm: 9
    };
    const d2: LinearEquation = {
      coefficientX: 2,
      coefficientY: -4,
      constantTerm: 19
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
        <div className="row">{console.log(getMiddlePointFromThreePointsInALine(firstPoint, secondPoint, thirdPoint))}</div>
        <div className="row">{console.log(getLineFromTwoPoints(firstPoint, secondPoint))}</div>
        <div>{calculateDistanceTwoPoints(firstPoint, secondPoint)}</div>
      </div>
    );
  }
}

export default TestMath;
