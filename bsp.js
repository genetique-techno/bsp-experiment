
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
// 0: front, 1: back, -1: colinear
function pointSide(line, [x, y]) {
  // differentials for the line itself (p2 - p1)
  const ldx = line.p2.x - line.p1.x;
  const ldy = line.p2.y - line.p1.y;

  // differentials between point and line.p1
  const dx = line.p1.x - x;
  const dy = line.p1.y - y; 

  // areas of differential rectangles
  const left = ldy * dx;
  const right = ldx * dy;

  if (left === right) return -1; // colinear
  if (left > right) return 0; // front
  if (right > left) return 1; // back
}

// 0: colinear|front, 1: back, -2: split
function lineSide(line1, line2) {
  const line1Slope = (line1.p2[1] - line1.p1[1]) / (line1.p2[0] - line1.p1[0]);
  const line1Intecept = line1.p1[1] - line1Slope * line1.p1[0];

  console.log(line1Slope, line1Intecept)
  // determine if line2 is in front or colinear (0)
  // determine if line2 is behind (1)
  // determine if line2 is split by line1 (-2)
}

module.exports = {
  lineSide,
  pointSide,
};