const { describe, it } = require('mocha');
const { deepStrictEqual, strictEqual } = require('assert');
const { WorldLine, DivLine } = require('../types');
const { wl, dl } = require('./helpers');

describe('utils', () => {
  describe('pointSide', () => {
    const { pointSide } = require('../utils');

    it('should return the expected values for a positive slope line', () => {
      const line = new DivLine({ x: 0, y: 0 }, { x: 2, y: 2 });

      strictEqual(pointSide(line, { x: 1, y: 1 }), 0, 'is on the line');
      strictEqual(pointSide(line, { x: 5, y: 5 }), 0, 'is on the line');
      strictEqual(pointSide(line, { x: -1, y: -1 }), 0, 'is on the line');
      strictEqual(pointSide(line, { x: 0, y: 1 }), -1, 'is in left');
      strictEqual(pointSide(line, { x: 0, y: 4 }), -1, 'is in left');
      strictEqual(pointSide(line, { x: 1, y: 0 }), 1, 'is in right');
      strictEqual(pointSide(line, { x: 1, y: -2 }), 1, 'is in right');
    });

    it('should return the expected values for a negative slope line', () => {
      const line = new DivLine({ x: 2, y: 2 }, { x: 0, y: 0 });

      strictEqual(pointSide(line, { x: 1, y: 1 }), 0, 'is on the line');
      strictEqual(pointSide(line, { x: 5, y: 5 }), 0, 'is on the line');
      strictEqual(pointSide(line, { x: -1, y: -1 }), 0, 'is on the line');
      strictEqual(pointSide(line, { x: 1, y: 0 }), -1, 'is in left');
      strictEqual(pointSide(line, { x: 1, y: -2 }), -1, 'is in left');
      strictEqual(pointSide(line, { x: 0, y: 1 }), 1, 'is in right');
      strictEqual(pointSide(line, { x: 0, y: 4 }), 1, 'is in right');
    });

    it('should return the expected values for a horizontal line', () => {
      const line = new DivLine({ x: 0, y: 0 }, { x: 4, y: 0 });

      strictEqual(pointSide(line, { x: 1, y: 0 }), 0, 'is on the line');
      strictEqual(pointSide(line, { x: 5, y: 0 }), 0, 'is on the line');
      strictEqual(pointSide(line, { x: -1, y: 0 }), 0, 'is on the line');
      strictEqual(pointSide(line, { x: 1, y: 1 }), -1, 'is in left');
      strictEqual(pointSide(line, { x: -1, y: 2 }), -1, 'is in left');
      strictEqual(pointSide(line, { x: -1, y: -1 }), 1, 'is in right');
      strictEqual(pointSide(line, { x: 3, y: -4 }), 1, 'is in right');
    });
  });

  describe('lineSide', () => {
    const { lineSide } = require('../utils');
    const divLine = new DivLine({ x: 0, y: 0 }, { x: 2, y: 2 });

    it('colinear in same direction', () => {
      const worldLine = wl([0, 0], [1, 1]);
      strictEqual(lineSide(divLine, worldLine), 0);
    });

    it('colinear in opposite direciton', () => {
      const worldLine = wl([0, 0], [-1, -1]);
      strictEqual(lineSide(divLine, worldLine), 1);
    });

    it('to left', () => {
      const worldLine = wl([-1, 0], [1, 2]);
      strictEqual(lineSide(divLine, worldLine), 1);
    });

    it('to right', () => {
      const worldLine = wl([1, 0], [3, 2]);
      strictEqual(lineSide(divLine, worldLine), 0);
    });

    it('splits line', () => {
      const worldLine = wl([0, 2], [2, 0]);
      strictEqual(lineSide(divLine, worldLine), -2);
    });

    it('all lines are in front', () => {
      const divLine = dl([0, 0], [0, 1]);
      const worldLines = [
        wl([0, 0], [0, 1]),
        wl([0, 1], [1, 0]),
        wl([1, 0], [0, 0]),
      ];
      const result = worldLines.map(l => lineSide(divLine, l));
      deepStrictEqual(result, [0, 0, 0]);
    });
  });

  describe('cutLine', () => {
    const { cutLine } = require('../utils');

    it('should return the expected results', () => {
      const divLine = dl([0, 0], [0, 1]);
      const worldLine = wl([-1, 0], [1, 0]);
      const expected = [
        new WorldLine({ ...worldLine, p2: { x: 0, y: 0 } }),
        new WorldLine({ ...worldLine, p1: { x: 0, y: 0 } }),
      ];
      deepStrictEqual(cutLine(divLine, worldLine), expected);
    });

    it('should return the expected results', () => {
      const divLine = dl([0, 0], [1, 0]);
      const worldLine = wl([0, -1], [0, 1]);
      const expected = [
        new WorldLine({ ...worldLine, p1: { x: 0, y: 0 } }),
        new WorldLine({ ...worldLine, p2: { x: 0, y: 0 } }),
      ];
      deepStrictEqual(cutLine(divLine, worldLine), expected);
    });

    it('should return the expected results', () => {
      const divLine = dl([-1, -1], [1, 1]);
      const worldLine = wl([-4, -2], [0, -2]);
      const expected = [
        new WorldLine({ ...worldLine, p2: { x: -2, y: -2 } }),
        new WorldLine({ ...worldLine, p1: { x: -2, y: -2 } }),
      ];
      deepStrictEqual(cutLine(divLine, worldLine), expected);
    });

    it('should return the expected results', () => {
      const divLine = dl([-1, -1], [1, 1]);
      const worldLine = wl([0, -2], [-4, -2]);
      const expected = [
        new WorldLine({ ...worldLine, p1: { x: -2, y: -2 } }),
        new WorldLine({ ...worldLine, p2: { x: -2, y: -2 } }),
      ];
      deepStrictEqual(cutLine(divLine, worldLine), expected);
    });
  });
});
