const { describe, it } = require('mocha');
const { deepStrictEqual, strictEqual } = require('assert');
const { wl, dl } = require('./helpers');
const { BSPNode } = require('../types');

describe('bsp', () => {
  describe('evaluateSplit', () => {
    const { evaluateSplit } = require('../bsp');

    it('should return the expected score with no partitioning', () => {
      const worldLines = [
        wl([0, 1], [1, 0]),
        wl([1, 0], [0, 0]),
        wl([0, 0], [0, 1]),
      ];
      const divLine = dl([0, 0], [0, 1]);
      strictEqual(evaluateSplit(worldLines, divLine), Infinity);
    });

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
      strictEqual(evaluateSplit(worldLines, divLine), 4);
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
      strictEqual(evaluateSplit(worldLines, divLine), 11);
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
      const { left, right } = executeSplit(worldLines, divLine);

      deepStrictEqual(left, [
        wl([0, 0], [0, 1]),
        wl([0, 1], [-1, 1]),
        wl([-1, -2], [0, -2]),
        wl([0, -2], [0, -1]),
        wl([0, -1], [-1, -1]),
        wl([-1, -1], [-1, 0]),
        wl([-1, 0], [0, 0]),
      ], 'left lines correct');

      deepStrictEqual(right, [
        wl([-1, 1], [-2, 0]),
        wl([-2, 0], [-2, -1]),
        wl([-2, -1], [-1, -2]),
      ], 'right lines correct');
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
      const { left, right } = executeSplit(worldLines, divLine);

      deepStrictEqual(left, [
        wl([0, 0], [0, 1]),
        wl([0, 1], [-1, 0.5]),
        wl([-1, -1.5], [0, -2]),
        wl([0, -2], [0, -1]),
        wl([0, -1], [-1, -1]),
        wl([-1, -1], [-1, 0]),
        wl([-1, 0], [0, 0]),
      ], 'left lines correct');

      deepStrictEqual(right, [
        wl([-1, 0.5], [-2, 0]),
        wl([-2, 0], [-2, -1]),
        wl([-2, -1], [-1, -1.5]),
      ], 'right lines correct');
    });
  });

  describe('buildBSP', () => {
    const { buildBSP } = require('../bsp');

    it.only('should return the expected structure', () => {
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
      console.dir(buildBSP(worldLines), {depth:null});
      // deepStrictEqual(buildBSP(worldLines), new BSPNode({
      //   divLine: dl([0, -1], [-1, -1]),
      //   left: new BSPNode({
      //     lines: [
      //       wl([-2, -1], [0, -2]),
      //       wl([0, -2], [0, -1]),
      //       wl([0, -1], [-1, -1]), ]
      //   }),
      //   right: new BSPNode({
      //     divLine: dl([-1, 0], [0, 0]),
      //     left: new BSPNode({
      //       lines: [
      //         wl([-1, 0], [0, 0]),
      //         wl([0, 0], [0, 1]),
      //         wl([0, 1], [-2, 0]),
      //       ],
      //     }),
      //     right: new BSPNode({
      //       lines: [
      //         wl([-2, 0], [-2, -1]),
      //         wl([-1, -1], [-1, 0]),
      //       ],
      //     }),
      //   }),
      // }));
    });

    it('should return the expected structure', () => {
      const worldLines = [
        wl([0, 0], [0, 1]),
        wl([0, 1], [1, 0]),
        wl([1, 0], [0, 0]),
      ];
      console.log(buildBSP(worldLines));
      // deepStrictEqual(buildBSP(worldLines), new BSPNode({
      //   lines: worldLines,
      // }))
    });
  });
});
