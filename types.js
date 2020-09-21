// stores information about floor, ceiling textures, height, lighting & tags
class Sector {
  constructor({
    floorHeight,
    ceilingHeight,
    floorFlat,
    ceilingFlat,
    lightLevel,
    special,
    tag,
  }) {
    this.floorHeight = floorHeight;
    this.ceilingHeight = ceilingHeight;
    this.floorFlat = floorFlat;
    this.ceilingFlat = ceilingFlat;
    this.lightLevel = lightLevel;
    this.special = special;
    this.tag = tag;
  }
}

// stores information about a line's side textures and textureOffsets
class WorldSide {
  constructor({
    firstRow,
    firstColumn,
    topTexture,
    bottomTexture,
    midTexture,
    sectorDef,
    sector,
  }) {
    this.firstRow = firstRow;
    this.firstColumn = firstColumn;
    this.topTexture = topTexture;
    this.bottomTexture = bottomTexture;
    this.midTexture = midTexture;
    this.sectorDef = sectorDef;
    this.sector = sector;
  }
}

// a line used in dividing up the map data during the bsp process
class DivLine {
  constructor(pt, pt2) {
    this.pt = pt;
    this.dx = pt2.x - pt.x;
    this.dy = pt2.y - pt.y;
  }
}

// stores information about a line
class WorldLine {
  constructor({
    p1,
    p2,
    flags,
    sides = Array(2),
  }) {
    this.p1 = p1;
    this.p2 = p2;
    this.dx = p2.x - p1.x;
    this.dy = p2.y - p1.y;
    this.flags = flags;
    this.sides = sides; // two sides
  }

  toDivLine() {
    return new DivLine(this.p1, this.p2);
  }
}

class BSPNode {
  constructor(lines = [], left, right) {
    this.lines = lines;
    this.left = left;
    this.right = right;
  }
}

module.exports = {
  DivLine,
  WorldLine,
  WorldSide,
  Sector,
  BSPNode,
};
