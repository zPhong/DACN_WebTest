import React, {Component} from 'react';
import './css/App.css';
import type {CoordinateType, LinearEquation} from "./types/types";
import {
  calculateDistanceTwoPoints,
  calculateLinearEquationFromTwoPoints,
  calculateParallelEquation
} from "./utils/math/Math2D";

class TestMath extends Component {
  render() {
    const firstPoint: CoordinateType = {x: 1, y: 2, z: 0};
    const secondPoint: CoordinateType = {x: 7, y: 3, z: 0};
    const linearEquation: LinearEquation = calculateLinearEquationFromTwoPoints(firstPoint, secondPoint);

    const equation = calculateParallelEquation(linearEquation);
    return (
       <div className="container">
         <div className="row">
           {console.log(equation.constantTerm)}
           {equation.coefficientX}x

           {equation.coefficientY === 0 ? '' :
              equation.coefficientY > 0 ? '+' : ''}
           {equation.coefficientY === 0 ? '' : `${equation.coefficientY}y`}

           {equation.constantTerm === 0 ? '' :
              equation.constantTerm > 0 ? '+' : ''}
           {equation.constantTerm === 0 ? '' : `${equation.constantTerm}`}

           = 0
         </div>
         <div>
           {calculateDistanceTwoPoints(firstPoint, secondPoint)}
         </div>
       </div>
    );
  }
}

export default TestMath;
