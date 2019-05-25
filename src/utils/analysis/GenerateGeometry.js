import type { CoordinateType, LinearEquation } from "../../types/types";
import { updateCoordinate } from "./readPointsMap";
import { calculateDistanceTwoPoints, calculateLinearEquationFromTwoPoints, getRandomValue } from "../math/Math2D";

const MIN_RANDOM_NUMBER = 5;
const MAX_RANDOM_NUMBER = 30;

const geometricObj = {
  triangle: generateTriangle,
  quadrilateral: generateQuadrilateral,
  trapezoid: generateTrapezoid,
  parallelogram: generateParallelogram,
  rectangle: generateRectangle,
  rhombus: generateRhombus,
  square: generateSquare
};

export function generateGeometry(name: string, shape: string, type?: string) {
  const generateFunc = geometricObj[shape];
  if (generateFunc) {
    generateFunc(name, type);
  }
}

function generateTriangle(name: string, type: string) {
  if (name.length === 3) {
    let p1: CoordinateType = { x: 0, y: 0, z: 0 };
    let p2: CoordinateType = {};
    let p3: CoordinateType = {};

    updateCoordinate(name[0], p1);
    switch (type) {
      case "": {
        p3.y = p1.y;
        p3.x = getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER);
        updateCoordinate(name[2], p3);
        p2.y = getRandomValue(p1.y + MIN_RANDOM_NUMBER, p1.y + MAX_RANDOM_NUMBER);
        p2.x = getRandomValue(p1.x + 1, p3.x);
        updateCoordinate(name[1], p2);
        break;
      }

      case "vuông": {
        p2.y = getRandomValue(p1.y + MIN_RANDOM_NUMBER, p1.y + MAX_RANDOM_NUMBER);
        p2.x = p1.x;
        updateCoordinate(name[1], p2);
        p3.x = getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER);
        p3.y = p1.y;
        updateCoordinate(name[2], p3);
        break;
      }

      case "cân": {
        /*
         *             B
         *          *    *
         *        *        *
         *      *            *
         *    *                *
         * [A] * * * * * * * *  C
         */
        p2.x = getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER);
        p2.y = getRandomValue(p1.y + MIN_RANDOM_NUMBER, p1.y + MAX_RANDOM_NUMBER);
        updateCoordinate(name[1], p2);
        const distance_From_A_To_B = calculateDistanceTwoPoints(p1, p2);
        p3.y = p1.y;
        p3.x = distance_From_A_To_B + p1.x;
        updateCoordinate(name[2], p3);
        break;
      }

      case "vuông cân": {
        /*  B
         *  * *
         *  *   *
         *  *     *
         *  *       *
         *  *         *
         * [A]* * * * * C
         */
        p2.y = getRandomValue(p1.y + MIN_RANDOM_NUMBER, p1.y + MAX_RANDOM_NUMBER);
        p2.x = p1.x;
        updateCoordinate(name[1], p2);
        const distance_From_A_To_B = calculateDistanceTwoPoints(p1, p2);
        p3.y = p1.y;
        p3.x = p1.x + distance_From_A_To_B;
        updateCoordinate(name[2], p3);
        break;
      }

      case "đều": {
        /*
         *       [B]
         *      *   *
         *    *       *
         * [A] * * * * [C]
         */
        p2.x = getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER);
        p2.y = Math.sqrt(3) * p2.x;
        updateCoordinate(name[1], p2);
        const distance_From_A_To_B = calculateDistanceTwoPoints(p1, p2);
        p3.y = p1.y;
        p3.x = distance_From_A_To_B + p1.x;
        updateCoordinate(name[2], p3);
        break;
      }

      default: {
        break;
      }
    }
  }
}

// Tu giac
function generateQuadrilateral(name: string) {
  if (name.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = { x: 0, y: 0, z: 0 };
    updateCoordinate(name[0], p1);

    // p2 represents point B
    const p2: CoordinateType = {
      x: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER),
      y: getRandomValue(p1.y + MIN_RANDOM_NUMBER, p1.y + MAX_RANDOM_NUMBER)
    };
    updateCoordinate(name[1], p2);

    // p3 represents point C
    let p3: CoordinateType = {};
    // prevent point C is on AB line
    const linearEquation: LinearEquation = calculateLinearEquationFromTwoPoints(p1, p2);
    do {
      p3.x = getRandomValue(p2.x + MIN_RANDOM_NUMBER, p2.x + MAX_RANDOM_NUMBER);
      p3.y = getRandomValue(p1.y + MIN_RANDOM_NUMBER, p2.y);
    } while (p3.y === linearEquation.coefficientX * p3.x + linearEquation.constantTerm);
    updateCoordinate(name[2], p3);

    // p4 represents point D
    const p4: CoordinateType = {
      x: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER),
      y: p1.y
    };
    updateCoordinate(name[3], p4);
  }
}

// Hinh thang
function generateTrapezoid(name: string) {
  if (name.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = { x: 0, y: 0, z: 0 };
    updateCoordinate(name[0], p1);

    // p2 represents point B
    const p2: CoordinateType = {
      x: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER),
      y: p1.y
    };
    updateCoordinate(name[1], p2);

    // p3 represents point C
    const p3: CoordinateType = {
      x: getRandomValue(p2.x + MIN_RANDOM_NUMBER, p2.x + MAX_RANDOM_NUMBER),
      y: getRandomValue(p1.y + MIN_RANDOM_NUMBER, p1.y + MAX_RANDOM_NUMBER)
    };
    updateCoordinate(name[2], p3);

    // p4 represents point D
    const p4: CoordinateType = {
      x: getRandomValue(p1.x - MAX_RANDOM_NUMBER, p3.x - MIN_RANDOM_NUMBER),
      y: p3.y
    };
    updateCoordinate(name[3], p4);
  }
}

// hinh binh hanh
function generateParallelogram(name: string) {
  if (name.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = { x: 0, y: 0, z: 0 };
    updateCoordinate(name[0], p1);

    // p2 represents point B
    let p2: CoordinateType = {
      x: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER),
      y: p1.y
    };
    updateCoordinate(name[1], p2);

    // p3 represents point C
    let p3: CoordinateType = {
      x: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER),
      y: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER)
    };
    updateCoordinate(name[2], p3);

    // p4 represents point D
    let p4: CoordinateType = {
      x: p3.x - p2.x - p1.x,
      y: p3.y
    };
    updateCoordinate(name[3], p4);
  }
}

function generateRectangle(name: string) {
  if (name.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = { x: 0, y: 0, z: 0 };
    updateCoordinate(name[0], p1);

    // p2 represents point B
    const p2: CoordinateType = {
      x: p1.x,
      y: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER)
    };
    updateCoordinate(name[1], p2);

    // p3 represents point C
    const p3: CoordinateType = {
      x: getRandomValue(p2.x + MIN_RANDOM_NUMBER, p2.x + MAX_RANDOM_NUMBER),
      y: p2.y
    };
    updateCoordinate(name[2], p3);

    // p4 represents point D
    const p4: CoordinateType = {
      x: p3.x,
      y: p1.y
    };
    updateCoordinate(name[3], p4);
  }
}

// Hinh thoi
function generateRhombus(name: string) {
  if (name.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = { x: 0, y: 0, z: 0 };
    updateCoordinate(name[0], p1);

    // p2 represents point B
    const p2: CoordinateType = {
      x: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER),
      y: -getRandomValue(p1.y + MIN_RANDOM_NUMBER, p1.y + MAX_RANDOM_NUMBER)
    };
    updateCoordinate(name[1], p2);

    // p3 represents point C
    const p3: CoordinateType = {
      x: 2 * Math.abs(p2.x - p1.x),
      y: p1.y
    };
    updateCoordinate(name[2], p3);

    // p4 represents point D
    const p4: CoordinateType = {
      x: p2.x,
      y: Math.abs(-p2.y - p1.y)
    };
    updateCoordinate(name[3], p4);
  }
}

function generateSquare(name: string) {
  if (name.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = { x: 0, y: 0, z: 0 };
    updateCoordinate(name[0], p1);

    // p2 represents point B
    const p2: CoordinateType = {
      x: p1.x,
      y: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER)
    };
    updateCoordinate(name[1], p2);

    // p3 represents point C
    const p3: CoordinateType = {
      x: p2.x + calculateDistanceTwoPoints(p1, p2),
      y: p2.y
    };
    updateCoordinate(name[2], p3);

    // p4 represents point D
    const p4: CoordinateType = {
      x: p3.x,
      y: p1.y
    };
    updateCoordinate(name[3], p4);
  }
}
