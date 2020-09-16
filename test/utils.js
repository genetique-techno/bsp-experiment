const { describe, it } = require("mocha");
const { strictEqual } = require("assert");
const { WorldLine, DivLine } = require("../types");

const pt = ([x, y]) => ({ x, y });
const wl = ([p1x, p1y], [p2x, p2y]) => new WorldLine({
  p1: pt([p1x, p1y]),
  p2: pt([p2x, p2y]),
});

describe("utils", function () {
  describe("pointSide", function () {
    const { pointSide } = require("../utils");
    
    it("should return the expected values for a positive slope line", function () {
      const line = new DivLine({ x: 0, y: 0 }, { x: 2, y: 2 });

      strictEqual(pointSide(line, { x: 1, y: 1 }), 0, "is on the line");
      strictEqual(pointSide(line, { x: 5, y: 5 }), 0, "is on the line");
      strictEqual(pointSide(line, { x: -1, y: -1 }), 0, "is on the line");
      strictEqual(pointSide(line, { x: 0, y: 1 }), 1, "is in front");
      strictEqual(pointSide(line, { x: 0, y: 4 }), 1, "is in front");
      strictEqual(pointSide(line, { x: 1, y: 0 }), -1, "is in back");
      strictEqual(pointSide(line, { x: 1, y: -2 }), -1, "is in back");
    });

    it ("should return the expected values for a negative slope line", function () {
      const line = new DivLine({ x: 2, y: 2 }, { x: 0, y: 0 });

      strictEqual(pointSide(line, { x: 1, y: 1 }), 0, "is on the line");
      strictEqual(pointSide(line, { x: 5, y: 5 }), 0, "is on the line");
      strictEqual(pointSide(line, { x: -1, y: -1 }), 0, "is on the line");
      strictEqual(pointSide(line, { x: 1, y: 0 }), 1, "is in front");
      strictEqual(pointSide(line, { x: 1, y: -2 }), 1, "is in front");
      strictEqual(pointSide(line, { x: 0, y: 1 }), -1, "is in back");
      strictEqual(pointSide(line, { x: 0, y: 4 }), -1, "is in back");
    });

    it ("should return the expected values for a horizontal line", function () {
      const line = new DivLine({ x: 0, y: 0 }, { x: 4, y: 0 });

      strictEqual(pointSide(line, { x: 1, y: 0 }), 0, "is on the line");
      strictEqual(pointSide(line, { x: 5, y: 0 }), 0, "is on the line");
      strictEqual(pointSide(line, { x: -1, y: 0 }), 0, "is on the line");
      strictEqual(pointSide(line, { x: 1, y: 1 }), 1, "is in front");
      strictEqual(pointSide(line, { x: -1, y: 2 }), 1, "is in front");
      strictEqual(pointSide(line, { x: -1, y: -1 }), -1, "is in back");
      strictEqual(pointSide(line, { x: 3, y: -4 }), -1, "is in back");
    });
  });

  describe("lineSide", function () {
    const { lineSide } = require("../utils");
    const divLine = new DivLine({ x: 0, y: 0 }, { x: 2, y: 2 });
    
    it("colinear in same direction", function () {
      const worldLine = wl([-1, -1], [1, 1]);
      strictEqual(lineSide(divLine, worldLine), 0);
    });

    it("colinear in opposite direciton", function () {
      const worldLine = wl([1, 1], [-1, -1]);
      strictEqual(lineSide(divLine, worldLine), 1);
    });

    it("in front", function () {
      const worldLine = wl([-1, 0], [1, 2]);
      strictEqual(lineSide(divLine, worldLine), 0)
    });

    it("in back", function () {
      const worldLine = wl([1, 0], [3, 2]);
      strictEqual(lineSide(divLine, worldLine), 1);
    });

    it("splits line", function () {
      const worldLine = wl([0, 2], [2, 0]);
      strictEqual(lineSide(divLine, worldLine), -2);
    });
  });
});
