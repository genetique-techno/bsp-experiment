const { BSPNode } = require('./types');
const { cutLine, lineSide } = require('./utils');

// return a score for this split line
function evaluateSplit(wls, dl) {
  // loop through the wls
  // count the number of front lines, back lines, and split lines
  const { frontCount, backCount, splits } = wls.reduce((a, wl) => {
    const side = lineSide(dl, wl);
    switch (side) {
      case 0:
        a.frontCount++;
        console.log(wl)
        break;
      case 1:
        a.backCount++;
        break;
      case -2:
        a.frontCount++;
        a.backCount++;
        a.split++;
        break;
    }
    return a;
  }, { frontCount: 0, backCount: 0, splits: 0 });

  if (frontCount === 0 || backCount === 0) return Infinity;
  const newLines = frontCount + backCount - wls.length;
  const grade = Math.max(frontCount, backCount) + newLines * 8;

  return grade;
}

function executeSplit(wls, dl) {
  // look at each wl and assign it to right list, left list, or cut it and assign each
  // to their respective list
  const { left, right } = wls.reduce((a, wl) => {
    const side = lineSide(dl, wl);
    switch (side) {
      case 0:
        a.right.push(wl);
        break;
      case 1:
        a.left.push(wl);
        break;
      case -2:
        const [l, r] = cutLine(dl, wl);
        a.right.push(r);
        a.left.push(l);
        break;
      default:
        throw Error('executeSplit failed in an unexpected way');
    }
    return a;
  }, { left: [], right: [] });

  return { left, right };
}

function buildBSP(lines) {
  let bestScore = Infinity;
  let bestLine = null;
  // loop through all lines
  lines.forEach((line) => {
    // evaluate the score result if using this line as the splitLine
    const divLine = line.toDivLine();
    const score = evaluateSplit(lines, divLine, bestScore);
    console.log(divLine)
    console.log("score: ", score)
    console.log("")
    if (score > bestScore) {
      bestScore = score;
      bestLine = line;
    }
  });

  // if nothing could be split it means all remaining lines are convex and this is a terminal node
  if (bestScore === Infinity) {
    return new BSPNode({ lines });
  }

  const divLine = bestLine.toDivLine();

  // split lines into right and left lists
  const { right, left } = executeSplit(lines, divLine);

  const node = new BSPNode({ divLine });
  // recurse into front and back lists
  // node.left = buildBSP(left);
  // node.right = buildBSP(right);

  return node;
}

module.exports = {
  buildBSP,
  evaluateSplit,
  executeSplit,
};
