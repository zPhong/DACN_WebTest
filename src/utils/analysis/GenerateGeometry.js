import appModel from "../../appModel";
import type {CoordinateType, NodeType} from "../../types/types";
import {updateCoordinate} from "./readPointsMap";
import {calculateDistanceTwoPoints, getRandomValue} from "../math/Math2D";

const geometricObj = {
  triangle: generateTriangle,
  quadrilateral: generateQuadrilateral,
  trapezoid: generateTrapezoid,
  parallelogram: generateParallelogram,
  rectangle: generateRectangle,
  rhombus: generateRhombus,
  square: generateSquare,
};

function generateGeometry() {

}

function generateTriangle(type: string) {
  let p1: CoordinateType = {x: 0, y: 0, z: 0};
  let p2: CoordinateType = {};
  let p3: CoordinateType = {};

  updateCoordinate(appModel.pointsMap[0].id, p1);
  switch (type) {
    case '': {
      p3.y = p1.y;
      p3.x = getRandomValue(p1.x, p1.x + 50);
      updateCoordinate(appModel.pointsMap[2].id, p3);
      p2.y = getRandomValue(p1.y, p1.y + 50);
      p2.x = getRandomValue(p1.x, p3.x);
      updateCoordinate(appModel.pointsMap[1].id, p2);
      break;
    }

    case 'vuông': {
      p2.y = getRandomValue(p1.y, p1.y + 50);
      p2.x = p1.x;
      updateCoordinate(appModel.pointsMap[1].id, p2);
      p3.x = getRandomValue(p1.x, p1.x + 50);
      p3.y = p1.y;
      updateCoordinate(appModel.pointsMap[2].id, p3);
      break;
    }

    case 'cân': {
      /*
      *             B
      *          *    *
      *        *        *
      *      *            *
      *    *                *
      * [A] * * * * * * * *  C
      */
      p2.x = getRandomValue(p1.x, p1.x + 50);
      p2.y = getRandomValue(p1.y, p1.y + 50);
      updateCoordinate(appModel.pointsMap[1].id, p2);
      const distance_From_A_To_B = calculateDistanceTwoPoints(p1, p2);
      p3.y = p1.y;
      p3.x = distance_From_A_To_B + p1.x;
      updateCoordinate(appModel.pointsMap[2].id, p3);
      break;
    }

    case 'vuông cân': {
      /*  B
       *  * *
       *  *   *
       *  *     *
       *  *       *
       *  *         *
       * [A]* * * * * C
      */
      p2.y = getRandomValue(p1.y, p1.y + 50);
      p2.x = p1.x;
      updateCoordinate(appModel.pointsMap[1].id, p2);
      const distance_From_A_To_B = calculateDistanceTwoPoints(p1, p2);
      p3.y = p1.y;
      p3.x = p1.x + distance_From_A_To_B;
      updateCoordinate(appModel.pointsMap[2].id, p3);
      break;
    }

    case 'đều': {
      /*
       *       [B]
       *      *   *
       *    *       *
       * [A] * * * * [C]
      */
      p2.x = getRandomValue(p1.x, p1.x + 50);
      p2.y = Math.sqrt(3) * p2.x;
      updateCoordinate(appModel.pointsMap[1].id, p2);
      const distance_From_A_To_B = calculateDistanceTwoPoints(p1, p2);
      p3.y = p1.y;
      p3.x = distance_From_A_To_B + p1.x;
      updateCoordinate(appModel.pointsMap[2].id, p3);
      break;
    }

    default: {
      break;
    }
  }
}

// Tu giac
function generateQuadrilateral() {

}

// Hinh thang
function generateTrapezoid() {

}

// hinh binh hanh
function generateParallelogram() {

}

function generateRectangle() {

}

// Hinh thoi
function generateRhombus() {

}

function generateSquare() {

}