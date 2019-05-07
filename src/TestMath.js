import React, {Component} from 'react';
import './css/App.css';
import Math2D from './utils/math/Math2D';
import type {CoordinateType, LinearEquation} from "./types/types";

class TestMath extends Component {
  render() {
    const firstPoint: CoordinateType = {x: 1, y: 2, z: 0};
    const secondPoint: CoordinateType = {x: 7, y: 3, z: 0};
    const linearEquation: LinearEquation = Math2D.calculateLinearPointFromTwoPoints(firstPoint,secondPoint);


    const equation = Math2D.calculateParallelEquation(linearEquation);
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
           {Math2D.calculateDistanceTwoPoints(firstPoint, secondPoint)}
         </div>
       </div>
    );
  }
}

export default TestMath;
