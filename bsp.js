
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

function slopePartials ({ p1, p2 }) {
  return {
    dx: p2.x - p1.x,
    dy: p2.y - p1.y,
  };
}

// Determines if a point is on a line, or which side of the line it is one
// 1: front, -1: back, 0: colinear
function pointSide (line, { x, y }) {
  // differentials for the line itself (p2 - p1)
  const { dx: ldx, dy: ldy } = slopePartials(line);

  // differentials between point and line.p1
  const dx = line.p1.x - x;
  const dy = line.p1.y - y; 

  // areas of differential rectangles
  const left = ldy * dx;
  const right = ldx * dy;

  if (left === right) return 0; // colinear
  if (left > right) return 1; // front
  if (right > left) return -1; // back
}

// 0: front, 1: back, -2: split
function lineSide (divLine, line) {
  const point1Side = pointSide(divLine, line.p1);
  const point2Side = pointSide(divLine, line.p2);
  const { dx: ldx, dy: ldy } = slopePartials(divLine);
  const { dx, dy } = slopePartials(line);

  // if line is colinear, both sides will be 0
  if (point1Side === 0 && point2Side ===0) {
    // check if direction is the same, asign to front if true, back if false
    if (Math.sign(dx) === Math.sign(ldx) && Math.sign(dy) === Math.sign(ldy)) return 0; 
    return 1;
  }
  // if line is front, side total will be > 0
  if (point1Side + point2Side > 0) return 0;
  // if line is back, side total will be < 0
  if (point1Side + point2Side < 0) return 1;
  // if line must be split, side totals will be opposites
  if (point1Side === point2Side * - 1) return -2;
}

module.exports = {
  lineSide,
  pointSide,
};