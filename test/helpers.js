const { WorldLine, DivLine } = require('../types');

const pt = ([x, y]) => ({ x, y });
const dl = ([x1, y1], [x2, y2]) => new DivLine({ x: x1, y: y1 }, { x: x2, y: y2 });
const wl = ([p1x, p1y], [p2x, p2y]) => new WorldLine({
  p1: pt([p1x, p1y]),
  p2: pt([p2x, p2y]),
});

module.exports = { pt, dl, wl };
