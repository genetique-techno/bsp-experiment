const { describe, it } = require("mocha");
const { strictEqual } = require("assert");

const ln = ([p1x, p1y], [p2x, p2y]) => ({
  p1: { x: p1x, y: p1y },
  p2: { x: p2x, y: p2y },
});
const pt = ([x, y]) => ({ x, y });

describe("bsp", function () {
  describe("pointSide", function () {
    const { pointSide } = require("../bsp");
    
    it("should return the expected values for a positive slope line", function () {
      const line = ln([0, 0], [2, 2]);

      strictEqual(pointSide(line, pt([1, 1])), 0, "is on the line");
      strictEqual(pointSide(line, pt([5, 5])), 0, "is on the line");
      strictEqual(pointSide(line, pt([-1, -1])), 0, "is on the line");
      strictEqual(pointSide(line, pt([0, 1])), 1, "is in front");
      strictEqual(pointSide(line, pt([0, 4])), 1, "is in front");
      strictEqual(pointSide(line, pt([1, 0])), -1, "is in back");
      strictEqual(pointSide(line, pt([1, -2])), -1, "is in back");
    });

    it ("should return the expected values for a negative slope line", function () {
      const line = ln([2, 2], [0, 0]);

      strictEqual(pointSide(line, pt([1, 1])), 0, "is on the line");
      strictEqual(pointSide(line, pt([5, 5])), 0, "is on the line");
      strictEqual(pointSide(line, pt([-1, -1])), 0, "is on the line");
      strictEqual(pointSide(line, pt([1, 0])), 1, "is in front");
      strictEqual(pointSide(line, pt([1, -2])), 1, "is in front");
      strictEqual(pointSide(line, pt([0, 1])), -1, "is in back");
      strictEqual(pointSide(line, pt([0, 4])), -1, "is in back");
    });

    it ("should return the expected values for a horizontal line", function () {
      const line = ln([0, 0], [4, 0]);

      strictEqual(pointSide(line, pt([1, 0])), 0, "is on the line");
      strictEqual(pointSide(line, pt([5, 0])), 0, "is on the line");
      strictEqual(pointSide(line, pt([-1, 0])), 0, "is on the line");
      strictEqual(pointSide(line, pt([1, 1])), 1, "is in front");
      strictEqual(pointSide(line, pt([-1, 2])), 1, "is in front");
      strictEqual(pointSide(line, pt([-1, -1])), -1, "is in back");
      strictEqual(pointSide(line, pt([3, -4])), -1, "is in back");
    });
  });

  describe("lineSide", function () {
    const { lineSide } = require("../bsp");
    lineA = ln([0, 0], [2, 2]);
    
    it("colinear in same direction", function () {
      lineB = ln([-1, -1], [1, 1]);
      strictEqual(lineSide(lineA, lineB), 0);
    });

    it("colinear in opposite direciton", function () {
      lineB = ln([1, 1], [-1, -1]);
      strictEqual(lineSide(lineA, lineB), 1);
    });

    it("in front", function () {
      lineB = ln([-1, 0], [1, 2]);
      strictEqual(lineSide(lineA, lineB), 0)
    });

    it("in back", function () {
      lineB = ln([1, 0], [3, 2]);
      strictEqual(lineSide(lineA, lineB), 1);
    });

    it("splits line", function () {
      lineB = ln([0, 2], [2, 0]);
      strictEqual(lineSide(lineA, lineB), -2);
    });
  });
});
