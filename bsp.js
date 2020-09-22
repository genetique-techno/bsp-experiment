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

function executeSplit(wls, dl) {
  // look at each wl and assign it to front list, back list, or cut it and assign each
  // to their respective list
  const { front, back } = wls.reduce((a, wl) => {
    const side = lineSide(dl, wl);
    switch (side) {
      case 0:
        a.front.push(wl);
        break;
      case 1:
        a.back.push(wl);
        break;
      case -2:
        const [f, b] = cutLine(dl, wl);
        a.front.push(f);
        a.back.push(b);
        break;
      default:
        throw Error('executeSplit failed in an unexpected way');
    }
    return a;
  }, { front: [], back: [] });

  return { front, back };
}

function buildBSP(lines) {
  let bestScore = Infinity;
  let bestLine = null;
  // loop through all lines
  lines.forEach((line) => {
    // evaluate the score result if using this line as the splitLine
    const divLine = line.toDivLine();
    const score = evaluateSplit(lines, divLine, bestScore);
    if (score < bestScore) {
      bestScore = score;
      bestLine = line;
    }
  });

  // if nothing could be split it means all remaining lines are convex and this is a terminal node
  if (bestScore === Infinity) {
    return new BSPNode({ lines });
  }

  const divLine = bestLine.toDivLine();

  // split lines into front and back lists
  const { front, back } = executeSplit(lines, divLine);

  const node = new BSPNode({ divLine });
  // recurse into front and back lists
  node.left = buildBSP(front);
  node.right = buildBSP(back);

  return node;
}

module.exports = {
  buildBSP,
  evaluateSplit,
  executeSplit,
};
