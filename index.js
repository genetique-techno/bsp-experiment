const { WorldLine } = require('./types');
const { buildBSP } = require('./bsp');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.lineWidth = 3;

let paint = false; // flag for whether painting is occuring
let startPosition, stopPosition, lines;

// getDivLines should process the divLines a bit further:
// * make lines which extend to the limits of the current node's sector
//   can probably leverage the utils a bit for finding the intersection points
function getDivLines(tree) {
  // lines, divLine, left, right
  const divLines = [];
  function walk (node) {
    node.divLine ? divLines.push(node.divLine) : null;
    node.left ? walk(node.left) : null;
    node.right ? walk(node.right) : null;
  }
  walk(tree);
  return divLines;
}

// drawing divLines needs the following features:
// * draw the lines in a different style
function drawDivLine(dl) {
  console.log(dl)
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(dl.pt.x, dl.pt.y);
  ctx.lineTo(dl.pt.x + dl.dx, dl.pt.y + dl.dy);
  ctx.stroke();
}

function processLines (lines) {
  const worldLines = lines.map(([p1, p2]) => new WorldLine({ p1, p2 }));
  const tree = buildBSP(worldLines);
  const divLines = getDivLines(tree);
  divLines.forEach(drawDivLine);
}

function getPosition(event) {
  return {
    x: event.clientX - canvas.offsetLeft,
    y: event.clientY - canvas.offsetTop,
  };
}

// either start painting or continuePainting if one is already started
function startPainting(event) {
  if (paint === true) return continuePainting(event);
  clearAll();
  lines = [];
  paint = true;
  startPosition = getPosition(event);
}

function continuePainting(event) {
  // finish the current line
  const currentPosition = getPosition(event);
  lines.push([startPosition, currentPosition]);
  // set a new start position
  startPosition = currentPosition;
  sketch(event);
}

function stopPainting(event) {
  // stop painting
  paint = false;
  // take the end of the last line and set it to the start of the first line
  lines[lines.length - 1][1] = lines[0][0];
  redrawAll();
  processLines(lines);
}

function sketch(event) {
  if (!paint) return;
  clearAll();
  const currentPosition = getPosition(event);

  ctx.beginPath();
  ctx.moveTo(startPosition.x, startPosition.y);
  ctx.lineTo(currentPosition.x, currentPosition.y);
  ctx.stroke();

  redrawAll();
}

function clearAll() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function redrawAll() {
  lines.forEach(([start, stop]) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(stop.x, stop.y);
    ctx.stroke();
  });
}

window.addEventListener('load', () => {
  canvas.addEventListener('click', startPainting);
  canvas.addEventListener('dblclick', stopPainting);
  canvas.addEventListener('mousemove', sketch);
});
