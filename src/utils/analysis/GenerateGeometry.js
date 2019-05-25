import appModel from "../../appModel";
import type {CoordinateType, LinearEquation, NodeType} from "../../types/types";
import {updateCoordinate} from "./readPointsMap";
import {calculateDistanceTwoPoints, calculateLinearEquationFromTwoPoints, getRandomValue} from "../math/Math2D";

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
  if (appModel.pointsMap.length === 3) {
    let p1: CoordinateType = {x: 0, y: 0, z: 0};
    let p2: CoordinateType = {};
    let p3: CoordinateType = {};

    updateCoordinate(appModel.pointsMap[0].id, p1);
    switch (type) {
      case '': {
        p3.y = p1.y;
        p3.x = getRandomValue(p1.x + 1, p1.x + 50);
        updateCoordinate(appModel.pointsMap[2].id, p3);
        p2.y = getRandomValue(p1.y + 1, p1.y + 50);
        p2.x = getRandomValue(p1.x + 1, p3.x);
        updateCoordinate(appModel.pointsMap[1].id, p2);
        break;
      }

      case 'vuông': {
        p2.y = getRandomValue(p1.y + 1, p1.y + 50);
        p2.x = p1.x;
        updateCoordinate(appModel.pointsMap[1].id, p2);
        p3.x = getRandomValue(p1.x + 1, p1.x + 50);
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
        p2.x = getRandomValue(p1.x + 1, p1.x + 50);
        p2.y = getRandomValue(p1.y + 1, p1.y + 50);
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
        p2.y = getRandomValue(p1.y + 1, p1.y + 50);
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
        p2.x = getRandomValue(p1.x + 1, p1.x + 50);
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
}

// Tu giac
function generateQuadrilateral() {
  if (appModel.pointsMap.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = {x: 0, y: 0, z: 0};
    updateCoordinate(appModel.pointsMap[0].id, p1);

    // p2 represents point B
    const p2: CoordinateType = {
      x: getRandomValue(p1.x + 1, p1.x + 50),
      y: getRandomValue(p1.y + 1, p1.y + 50),
    };
    updateCoordinate(appModel.pointsMap[1].id, p2);

    // p3 represents point C
    let p3: CoordinateType = {};
    // prevent point C is on AB line
    const linearEquation: LinearEquation = calculateLinearEquationFromTwoPoints(p1, p2);
    do {
      p3.x = getRandomValue(p2.x + 1, p2.x + 50);
      p3.y = getRandomValue(p1.y + 1, p2.y);
    }
    while (p3.y === linearEquation.coefficientX * p3.x + linearEquation.constantTerm);
    updateCoordinate(appModel.pointsMap[2].id, p3);

    // p4 represents point D
    const p4: CoordinateType = {
      x: getRandomValue(p1.x + 1, p1.x + 50),
      y: p1.y,
    };
    updateCoordinate(appModel.pointsMap[3].id, p4);
  }
}

// Hinh thang
function generateTrapezoid() {
  if (appModel.pointsMap.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = {x: 0, y: 0, z: 0};
    updateCoordinate(appModel.pointsMap[0].id, p1);

    // p2 represents point B
    const p2: CoordinateType = {
      x: getRandomValue(p1.x + 1, p1.x + 50),
      y: getRandomValue(p1.y + 1, p1.y + 50),
    };
    updateCoordinate(appModel.pointsMap[1].id, p2);

    // p3 represents point C
    const p3: CoordinateType = {
      x: getRandomValue(p2.x + 1, p2.x + 50),
      y: p2.y,
    };
    updateCoordinate(appModel.pointsMap[2].id, p3);

    // p4 represents point D
    const p4: CoordinateType = {
      x: getRandomValue(p1.x + 1, p1.x + 50),
      y: p1.y,
    };
    updateCoordinate(appModel.pointsMap[3].id, p4);
  }
}

// hinh binh hanh
function generateParallelogram() {
  if (appModel.pointsMap.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = {x: 0, y: 0, z: 0};
    updateCoordinate(appModel.pointsMap[0].id, p1);

    // p2 represents point B
    let p2: CoordinateType = {
      x: getRandomValue(p1.x + 1, p1.x + 50),
      y: getRandomValue(p1.x + 1, p1.x + 50)
    };
    updateCoordinate(appModel.pointsMap[1].id, p2);

    // p3 represents point C
    let p3: CoordinateType = {
      x: getRandomValue(p2.x + 1, p2.x + 50),
      y: p2.y
    };
    updateCoordinate(appModel.pointsMap[2].id, p3);

    // p4 represents point D
    let p4: CoordinateType = {
      x: getRandomValue(p1.x + 1, p1.x + 50),
      y: p1.y
    };
    updateCoordinate(appModel.pointsMap[3].id, p4);
  }
}

function generateRectangle() {
  if (appModel.pointsMap.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = {x: 0, y: 0, z: 0};
    updateCoordinate(appModel.pointsMap[0].id, p1);

    // p2 represents point B
    const p2: CoordinateType = {
      x: p1.x,
      y: getRandomValue(p1.x + 1, p1.x + 50)
    };
    updateCoordinate(appModel.pointsMap[1].id, p2);

    // p3 represents point C
    const p3: CoordinateType = {
      x: getRandomValue(p2.x + 1, p2.x + 50),
      y: p2.y,
    };
    updateCoordinate(appModel.pointsMap[2].id, p3);

    // p4 represents point D
    const p4: CoordinateType = {
      x: p3.x,
      y: p1.y,
    };
    updateCoordinate(appModel.pointsMap[3].id, p4);
  }
}

// Hinh thoi
function generateRhombus() {
  if (appModel.pointsMap.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = {x: 0, y: 0, z: 0};
    updateCoordinate(appModel.pointsMap[0].id, p1);

    // p2 represents point B
    const p2: CoordinateType = {
      x: getRandomValue(p1.x + 1, p1.x + 50),
      y: getRandomValue(p1.y + 1, p1.y + 50),
    };
    updateCoordinate(appModel.pointsMap[1].id, p2);

    // p3 represents point C
    const p3: CoordinateType = {
      x: 2 * (p2.x - p1.x),
      y: p1.y,
    };
    updateCoordinate(appModel.pointsMap[2].id, p3);

    // p4 represents point D
    const p4: CoordinateType = {
      x: p2.x,
      y: 2 * (p2.y - p1.y),
    };
    updateCoordinate(appModel.pointsMap[3].id, p4);
  }
}

function generateSquare() {
  if (appModel.pointsMap.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = {x: 0, y: 0, z: 0};
    updateCoordinate(appModel.pointsMap[0].id, p1);

    // p2 represents point B
    const p2: CoordinateType = {
      x: p1.x,
      y: getRandomValue(p1.x + 1, p1.x + 50)
    };
    updateCoordinate(appModel.pointsMap[1].id, p2);

    // p3 represents point C
    const p3: CoordinateType = {
      x: p2.x + calculateDistanceTwoPoints(p1, p2),
      y: p2.y,
    };
    updateCoordinate(appModel.pointsMap[2].id, p3);

    // p4 represents point D
    const p4: CoordinateType = {
      x: p3.x,
      y: p1.y,
    };
    updateCoordinate(appModel.pointsMap[3].id, p4);
  }
}