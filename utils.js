const { WorldLine } = require('./types');
// make a line data structure
// make a list of lines
// make a bsp_node data structure

// function takes list of lines and recursively partitions, returns bsp_node
// find line to partition on (evaluate split function)
// divide the lines up based on the split line (execute split function)
// recursively call function on the new list of lines
// if nothing found, all lines are convex and this is a terminal node, return

// within a set of lines, step through the lines and assign a grade based on how well that lines splits the set
// determine the grade by counting the number of lines on the front and back of the split
// line grading:
// 0 if the line is colinear with the splitline, or in front of it
// 1 if the line is in back of the splitline
// -2 if the line needed to be split

// Determines if a point is on a line, or which side of the line it is one
// 1: front, -1: back, 0: colinear
function pointSide(divLine, { x, y }) {
  // differentials between point and line.p1
  const dx = divLine.pt.x - x;
  const dy = divLine.pt.y - y;

  // areas of differential rectangles
  const left = divLine.dy * dx;
  const right = divLine.dx * dy;

  if (left === right) return 0; // colinear
  if (left > right) return 1; // front
  if (right > left) return -1; // back
  return Error("shouldn't happen");
}

// 0: front, 1: back, -2: split
function lineSide(divLine, worldLine) {
  const point1Side = pointSide(divLine, worldLine.p1);
  const point2Side = pointSide(divLine, worldLine.p2);

  // if line is colinear, both sides will be 0
  if (point1Side === 0 && point2Side === 0) {
    // check if direction is the same, asign to front if true, back if false
    if (Math.sign(worldLine.dx) === Math.sign(divLine.dx) && Math.sign(worldLine.dy) === Math.sign(divLine.dy)) return 0;
    return 1;
  }

  // if line is front, side total will be > 0
  if (point1Side + point2Side > 0) return 0;
  // if line is back, side total will be < 0
  if (point1Side + point2Side < 0) return 1;
  // if line must be split, side totals will be opposites
  if (point1Side === point2Side * -1) return -2;
  return Error("shouldn't happen");
}

// takes a divLine and a worldLine, determines the coordinates of the split point along the worldLine
// return array of [ line front, line back ]
function cutLine(dl, wl) {
  // bunch of geometry tricks taken from BUILDBSP.M
  const den = dl.dy * wl.dx - dl.dx * wl.dy;
  const num = (dl.pt.x - wl.p1.x) * dl.dy + (wl.p1.y - dl.pt.y) * dl.dx;
  const frac = num / den; // represents the fractional position along the wl where split occurs
  const xIntr = wl.p1.x + wl.dx * frac;
  const yIntr = wl.p1.y + wl.dy * frac;
  const p1Side = pointSide(dl, wl.p1);

  let result = [
    new WorldLine({ ...wl, p2: { x: xIntr, y: yIntr } }),
    new WorldLine({ ...wl, p1: { x: xIntr, y: yIntr } }),
  ];
  if (p1Side === -1) {
    result = result.reverse();
  }
  return result;
}

module.exports = {
  lineSide,
  pointSide,
  cutLine,
};
