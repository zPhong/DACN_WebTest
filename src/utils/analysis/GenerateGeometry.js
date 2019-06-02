import appModel from '../../appModel';
import type { CoordinateType, LinearEquation } from '../../types/types';
import { calculateDistanceTwoPoints, calculateLinearEquationFromTwoPoints, getRandomValue } from '../math/Math2D';

const MIN_RANDOM_NUMBER = 5;
const MAX_RANDOM_NUMBER = 15;

const geometricObj = {
  triangle: generateTriangle,
  quadrilateral: generateQuadrilateral,
  trapezoid: generateTrapezoid,
  parallelogram: generateParallelogram,
  rectangle: generateRectangle,
  rhombus: generateRhombus,
  square: generateSquare,
  circle: generateCircle,
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

    appModel.updateCoordinate(name[0], p1);
    switch (type) {
      case '': {
        p3.y = getRandomValue(p1.y + 5, p1.y + 10);
        p3.x = getRandomValue(p1.x - 3, p1.x - 10);
        appModel.updateCoordinate(name[1], p3);
        p2.y = p3.y;
        p2.x = getRandomValue(p1.x + 3, p3.x + 10);
        appModel.updateCoordinate(name[2], p2);
        break;
      }

      case 'vuông': {
        p2.y = getRandomValue(p1.y + MIN_RANDOM_NUMBER, p1.y + MAX_RANDOM_NUMBER);
        p2.x = p1.x;
        appModel.updateCoordinate(name[2], p2);
        p3.x = getRandomValue(p1.x + 1, p1.x + 50);
        p3.y = p1.y;
        appModel.updateCoordinate(name[1], p3);
        break;
      }

      case 'cân': {
        /*
         *            [A]
         *          *    *
         *        *        *
         *      *            *
         *    *                *
         *  B  * * * * * * * *  C
         */
        const distance_From_A_To_B = getRandomValue(3, 6);

        p3.y = getRandomValue(p1.y + 5, p1.y + 10);
        p3.x = p1.x - distance_From_A_To_B;
        appModel.updateCoordinate(name[1], p3);
        p2.y = p3.y;
        p2.x = p1.x + distance_From_A_To_B;
        appModel.updateCoordinate(name[2], p2);
        break;
      }

      case 'vuông cân': {
        const distance_From_A_To_B = getRandomValue(5, 10);
        p3.y = p1.y + distance_From_A_To_B;
        p3.x = p1.x - distance_From_A_To_B;
        appModel.updateCoordinate(name[1], p3);
        p2.y = p3.y;
        p2.x = p1.x + distance_From_A_To_B;
        appModel.updateCoordinate(name[2], p2);
        break;
      }

      case 'đều': {
        /*
         *       [A]
         *      *   *
         *    *       *
         * [B] * * * * [C]
         */
        p2.x = getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER);
        p2.y = Math.sqrt(3) * p2.x;
        appModel.updateCoordinate(name[2], p2);
        const distance_From_A_To_B = calculateDistanceTwoPoints(p1, p2);
        p3.y = p2.y;
        p3.x = -distance_From_A_To_B + p2.x;
        appModel.updateCoordinate(name[1], p3);
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
    appModel.updateCoordinate(name[0], p1);

    // p2 represents point B
    const p2: CoordinateType = {
      x: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER),
      y: getRandomValue(p1.y + MIN_RANDOM_NUMBER, p1.y + MAX_RANDOM_NUMBER)
    };
    appModel.updateCoordinate(name[1], p2);

    // p3 represents point C
    let p3: CoordinateType = {};
    // prevent point C is on AB line
    const linearEquation: LinearEquation = calculateLinearEquationFromTwoPoints(p1, p2);
    do {
      p3.x = getRandomValue(p2.x + MIN_RANDOM_NUMBER, p2.x + MAX_RANDOM_NUMBER);
      p3.y = getRandomValue(p1.y + MIN_RANDOM_NUMBER, p2.y);
    } while (p3.y === linearEquation.coefficientX * p3.x + linearEquation.constantTerm);
    appModel.updateCoordinate(name[2], p3);

    // p4 represents point D
    const p4: CoordinateType = {
      x: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER),
      y: p1.y
    };
    appModel.updateCoordinate(name[3], p4);
  }
}

// Hinh thang
function generateTrapezoid(name: string, type: string) {
  if (name.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = { x: 0, y: 0, z: 0 };
    appModel.updateCoordinate(name[0], p1);

    switch (type) {
      case '': {
        // p2 represents point B
        const p2: CoordinateType = {
          x: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER),
          y: p1.y
        };
        appModel.updateCoordinate(name[1], p2);

        // p3 represents point C
        const p3: CoordinateType = {
          x: getRandomValue(p2.x + MIN_RANDOM_NUMBER, p2.x + MAX_RANDOM_NUMBER),
          y: getRandomValue(p1.y + MIN_RANDOM_NUMBER, p1.y + MAX_RANDOM_NUMBER)
        };
        appModel.updateCoordinate(name[2], p3);

        // p4 represents point D
        const p4: CoordinateType = {
          x: getRandomValue(p1.x - MAX_RANDOM_NUMBER, p3.x - MIN_RANDOM_NUMBER),
          y: p3.y
        };
        appModel.updateCoordinate(name[3], p4);
        break;
      }

      case 'cân': {
        // p2 represents point B
        const p2: CoordinateType = {
          x: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER),
          y: p1.y
        };
        appModel.updateCoordinate(name[1], p2);

        // p3 represents point C
        const p3: CoordinateType = {
          x: getRandomValue(p2.x + MIN_RANDOM_NUMBER, p2.x + MAX_RANDOM_NUMBER),
          y: getRandomValue(p1.y + MIN_RANDOM_NUMBER, p1.y + MAX_RANDOM_NUMBER)
        };
        appModel.updateCoordinate(name[2], p3);

        const distanceX = Math.abs(p3.x - p2.x);
        const p4X = getRandomValue(0,2) === 1 ? p1.x + distanceX : p1.x - distanceX;
        // p4 represents point D
        const p4: CoordinateType = {
          x: p4X,
          y: p3.y
        };
        appModel.updateCoordinate(name[3], p4);
        break;
      }

      case 'vuông': {
        // TODO: vuong tai dau?
        break;
      }

      default: {
        break;
      }
    }
  }
}

// hinh binh hanh
function generateParallelogram(name: string) {
  if (name.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = { x: 0, y: 0, z: 0 };
    appModel.updateCoordinate(name[0], p1);

    // p2 represents point B
    let p2: CoordinateType = {
      x: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER),
      y: p1.y
    };
    appModel.updateCoordinate(name[1], p2);

    // p3 represents point C
    let p3: CoordinateType = {
      x: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER),
      y: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER)
    };
    appModel.updateCoordinate(name[2], p3);

    // p4 represents point D
    let p4: CoordinateType = {
      x: p3.x - p2.x - p1.x,
      y: p3.y
    };
    appModel.updateCoordinate(name[3], p4);
  }
}

function generateRectangle(name: string) {
  if (name.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = { x: 0, y: 0, z: 0 };
    appModel.updateCoordinate(name[0], p1);

    // p2 represents point B
    const p2: CoordinateType = {
      x: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER),
      y: p1.y
    };
    appModel.updateCoordinate(name[1], p2);

    // p3 represents point C
    const p3: CoordinateType = {
      x: p2.x,
      y: getRandomValue(p2.y + MIN_RANDOM_NUMBER, p2.y + MAX_RANDOM_NUMBER)
    };
    appModel.updateCoordinate(name[2], p3);

    // p4 represents point D
    const p4: CoordinateType = {
      x: p1.x,
      y: p3.y
    };
    appModel.updateCoordinate(name[3], p4);
  }
}

// Hinh thoi
function generateRhombus(name: string) {
  if (name.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = { x: 0, y: 0, z: 0 };
    appModel.updateCoordinate(name[0], p1);

    // p2 represents point B
    const p2: CoordinateType = {
      x: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER),
      y: -getRandomValue(p1.y + MIN_RANDOM_NUMBER, p1.y + MAX_RANDOM_NUMBER)
    };
    appModel.updateCoordinate(name[1], p2);

    // p3 represents point C
    const p3: CoordinateType = {
      x: 2 * Math.abs(p2.x - p1.x),
      y: p1.y
    };
    appModel.updateCoordinate(name[2], p3);

    // p4 represents point D
    const p4: CoordinateType = {
      x: p2.x,
      y: Math.abs(-p2.y - p1.y)
    };
    appModel.updateCoordinate(name[3], p4);
  }
}

function generateSquare(name: string) {
  if (name.length === 4) {
    // p1 represents point A
    const p1: CoordinateType = { x: 0, y: 0, z: 0 };
    appModel.updateCoordinate(name[0], p1);

    // p2 represents point B
    const p2: CoordinateType = {
      x: getRandomValue(p1.x + MIN_RANDOM_NUMBER, p1.x + MAX_RANDOM_NUMBER),
      y: p1.y
    };
    appModel.updateCoordinate(name[1], p2);

    // p3 represents point C
    const p3: CoordinateType = {
      x: p2.x,
      y: p2.y + calculateDistanceTwoPoints(p1, p2)
    };
    appModel.updateCoordinate(name[2], p3);

    // p4 represents point D
    const p4: CoordinateType = {
      x: p1.x,
      y: p3.y
    };
    appModel.updateCoordinate(name[3], p4);
  }
}

function generateCircle(name: string) {

}
