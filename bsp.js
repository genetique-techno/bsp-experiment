const { BSPNode } = require('./types');
const { lineSide } = require('./utils');

// return a score for this split line
function evaluateSplit(wls, dl) {
  // loop through the wls
  // count the number of front lines, back lines, and split lines
  const { frontCount, backCount, splits } = wls.reduce((a, wl) => {
    const side = lineSide(dl, wl);
    switch (side) {
      case 0:
        a.frontCount++;
        break;
      case 1:
        a.backCount++;
        break;
      default:
        a.splits++;
    }
    return a;
  }, { frontCount: 0, backCount: 0, splits: 0 });

  if (frontCount === 0 || backCount === 0) return Infinity;
  const grade = Math.max(frontCount, backCount) + splits * 8;
  return grade;
}

function executeSplit() {}

function buildBSP(worldLines) {
  let bestScore = Infinity;
  let bestLine = null;
  // loop through all worldLines
  worldLines.forEach((wl) => {
    // evaluate the score result if using this line as the splitLine
    const divLine = wl.toDivLine();
    const score = evaluateSplit(worldLines, divLine, bestScore);
    if (score < bestScore) {
      bestScore = score;
      bestLine = wl;
    }
  });

  // if nothing could be split it means all remaining lines are convex and this is a terminal node
  if (bestScore === Infinity) {
    return new BSPNode();
  }

  const divLine = bestLine.toDivLine();
  // split worldLines into front and back lists
  const { front, back } = executeSplit(worldLines, divLine);

  const node = new BSPNode(worldLines);
  // recurse into front and back lists
  node.left = buildBSP(front);
  node.right = buildBSP(back);

  return node;
}

module.exports = {
  buildBSP,
  evaluateSplit,
};