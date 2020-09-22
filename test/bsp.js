const { describe, it } = require('mocha');
const { deepStrictEqual, strictEqual } = require('assert');
const { wl, dl } = require('./helpers');

describe('bsp', () => {
  describe('evaluateSplit', () => {
    const { evaluateSplit } = require('../bsp');

    it('should return the expected score', () => {
      const worldLines = [
        wl([0, 1], [1, 0]),
        wl([1, 0], [0, -1]),
        wl([0, -1], [-1, 0]),
        wl([-1, 0], [0, 1]),
      ];
      const divLine = dl([0, 1], [0, -1]);
      strictEqual(evaluateSplit(worldLines, divLine), 2);
    });

    it('should return the expected score', () => {
      const worldLines = [
        wl([0, 1], [1, 0]),
        wl([1, 0], [1, -1]),
        wl([1, -1], [0, -1]),
        wl([0, -1], [-1, 0]),
        wl([-1, 0], [0, 1]),
      ];
      const divLine = dl([0, 1], [0, -1]);
      strictEqual(evaluateSplit(worldLines, divLine), 3);
    });

    it('should return the expected score with 1 colinear', () => {
      const worldLines = [
        wl([0, 0], [1, -1]),
        wl([1, -1], [1, -4]),
        wl([1, -4], [0, -5]),
        wl([0, -5], [-1, -4]),
        wl([-1, -4], [0, -3]),
        wl([0, -3], [0, -2]),
        wl([0, -2], [-1, -1]),
        wl([-1, -1], [0, 0]),
      ];
      const divLine = dl([0, 0], [0, -5]);
      strictEqual(evaluateSplit(worldLines, divLine), 5);
    });

    it('should return the expected score with 2 colinears in opposite directions', () => {
      const worldLines = [
        wl([0, 0], [0, -1]),
        wl([0, -1], [1, -2]),
        wl([1, -1], [0, -3]),
        wl([0, -3], [0, -2]),
        wl([0, -2], [-1, -1]),
        wl([-1, -1], [0, 0]),
      ];
      const divLine = dl([0, 0], [0, -3]);
      strictEqual(evaluateSplit(worldLines, divLine), 3);
    });

    it('should return the expected score with a split', () => {
      const worldLines = [
        wl([0, 0], [1, -1]),
        wl([1, -1], [0, -2]),
        wl([0, -2], [-1, -1]),
        wl([-1, -1], [0, 0]),
      ];
      const divLine = dl([0, 0], [1, -2]);
      strictEqual(evaluateSplit(worldLines, divLine), 10);
    });
  });

  describe('executeSplit', () => {
    const { executeSplit } = require('../bsp');

    it('should sort lines into the correct lists', () => {
      const worldLines = [
        wl([0, 0], [0, 1]),
        wl([0, 1], [-1, 1]),
        wl([-1, 1], [-2, 0]),
        wl([-2, 0], [-2, -1]),
        wl([-2, -1], [-1, -2]),
        wl([-1, -2], [0, -2]),
        wl([0, -2], [0, -1]),
        wl([0, -1], [-1, -1]),
        wl([-1, -1], [-1, 0]),
        wl([-1, 0], [0, 0]),
      ];
      const divLine = dl([-1, 1], [-1, -2]);
      const { front, back } = executeSplit(worldLines, divLine);

      deepStrictEqual(front, [
        wl([0, 0], [0, 1]),
        wl([0, 1], [-1, 1]),
        wl([-1, -2], [0, -2]),
        wl([0, -2], [0, -1]),
        wl([0, -1], [-1, -1]),
        wl([-1, 0], [0, 0]),
      ], 'front lines correct');

      deepStrictEqual(back, [
        wl([-1, 1], [-2, 0]),
        wl([-2, 0], [-2, -1]),
        wl([-2, -1], [-1, -2]),
        wl([-1, -1], [-1, 0]),
      ], 'back lines correct');
    });

    it('should sort the lines into the correct lists when splits happen', () => {
      const worldLines = [
        wl([0, 0], [0, 1]),
        wl([0, 1], [-2, 0]),
        wl([-2, 0], [-2, -1]),
        wl([-2, -1], [0, -2]),
        wl([0, -2], [0, -1]),
        wl([0, -1], [-1, -1]),
        wl([-1, -1], [-1, 0]),
        wl([-1, 0], [0, 0]),
      ];
      const divLine = dl([-1, 1], [-1, -2]);
      const { front, back } = executeSplit(worldLines, divLine);

      deepStrictEqual(front, [
        wl([0, 0], [0, 1]),
        wl([0, 1], [-1, 0.5]),
        wl([-1, -1.5], [0, -2]),
        wl([0, -2], [0, -1]),
        wl([0, -1], [-1, -1]),
        wl([-1, 0], [0, 0]),
      ], 'front lines correct');

      deepStrictEqual(back, [
        wl([-1, 0.5], [-2, 0]),
        wl([-2, 0], [-2, -1]),
        wl([-2, -1], [-1, -1.5]),
        wl([-1, -1], [-1, 0]),
      ], 'back lines correct');
    });
  });
});
