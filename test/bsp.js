const { describe, it } = require("mocha");
const { strictEqual } = require("assert");

function makeLine ([p1x, p1y], [p2x, p2y]) {
  return ({
    p1: { x: p1x, y: p1x },
    p2: { x: p2x, y: p2x },
  });
}

describe("bsp", function () {
  describe("pointSide", function () {
    const { pointSide } = require("../bsp");
    
    it("should return the expected values for a positive slope line", function () {
      const line = {
        p1: { x: 0, y: 0 },
        p2: { x: 2, y: 2 },
      };

      strictEqual(pointSide(line, [1, 1]), -1, "is on the line");
      strictEqual(pointSide(line, [5, 5]), -1, "is on the line");
      strictEqual(pointSide(line, [-1, -1]), -1, "is on the line");
      strictEqual(pointSide(line, [0, 1]), 0, "is in front");
      strictEqual(pointSide(line, [0, 4]), 0, "is in front");
      strictEqual(pointSide(line, [1, 0]), 1, "is in back");
      strictEqual(pointSide(line, [1, -2]), 1, "is in back");
    });

    it ("should return the expected values for a negative slope line", function () {
      const line = {
        p1: { x: 2, y: 2 },
        p2: { x: 0, y: 0 },
      };

      strictEqual(pointSide(line, [1, 1]), -1, "is on the line");
      strictEqual(pointSide(line, [5, 5]), -1, "is on the line");
      strictEqual(pointSide(line, [-1, -1]), -1, "is on the line");
      strictEqual(pointSide(line, [1, 0]), 0, "is in front");
      strictEqual(pointSide(line, [1, -2]), 0, "is in front");
      strictEqual(pointSide(line, [0, 1]), 1, "is in back");
      strictEqual(pointSide(line, [0, 4]), 1, "is in back");
    });

    it ("should return the expected values for a horizontal line", function () {
      const line = {
        p1: { x: 0, y: 0 },
        p2: { x: 4, y: 0 },
      };

      strictEqual(pointSide(line, [1, 0]), -1, "is on the line");
      strictEqual(pointSide(line, [5, 0]), -1, "is on the line");
      strictEqual(pointSide(line, [-1, 0]), -1, "is on the line");
      strictEqual(pointSide(line, [1, 1]), 0, "is in front");
      strictEqual(pointSide(line, [-1, 2]), 0, "is in front");
      strictEqual(pointSide(line, [-1, -1]), 1, "is in back");
      strictEqual(pointSide(line, [3, -4]), 1, "is in back");
    });
  });

  describe.skip("lineSide", function () {
    const { lineSide } = require("../bsp");
    
    it("should return 0 for colinear lines", function () {
      lineA = makeLine([0, 0], [2, 2]);
      lineB = makeLine([-1, -1], [1, 1]);
      lineC = makeLine([-1, -1], [3, 3]);
      lineD = makeLine([4, 4], [5, 5]);

      strictEqual(lineSide(lineA, lineA), 0);
      strictEqual(lineSide(lineA, lineB), 0);
      strictEqual(lineSide(lineA, lineC), 0);
      strictEqual(lineSide(lineA, lineD), 0);
    });

    it("should return 0 for line2 in front", function () {});

    it("should return -2 for line2 in back", function () {});
  });
});
