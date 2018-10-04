const { DIRECTIONS, KEYS } = require('./constants');

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

module.exports = class Snek {
  constructor(socketId, initialPosition, initialDirection, worldWidth, worldHeight) {
    this.size = 20;
    this.sizeOffset = this.size / 2;
    this.segmentPositions = [initialPosition, initialPosition];
    this.direction = initialDirection;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.color = getRandomColor();
    this.socketId = socketId;
    this.isDead = false;
  }

  update() {
    this.segmentPositions = this.segmentPositions.map((position, index) => {
      if (index === 0) {
        let newX = position.x;
        let newY = position.y;

        if (this.direction === DIRECTIONS.LEFT && this.direction !== DIRECTIONS.RIGHT) {
          newX = position.x - 1;
          if (newX < 0) newX = this.worldWidth;
        }

        if (this.direction === DIRECTIONS.UP) {
          newY = position.y - 1;
          if (newY < 0) newY = this.worldHeight;
        }

        if (this.direction === DIRECTIONS.RIGHT) {
          newX = position.x + 1;
          if (newX > this.worldWidth) newX = 0;
        }

        if (this.direction === DIRECTIONS.DOWN) {
          newY = position.y + 1;
          if (newY > this.worldHeight) newY = 0;
        }

        return { x: newX, y: newY };
      }

      return this.segmentPositions[index - 1];
    });
  }

  changeDirection(newDirection) {
    this.direction = newDirection;
  }

  addSegment() {
    const numSegments = this.segmentPositions.length;
    const tailSegment = this.segmentPositions[numSegments - 1];

    this.segmentPositions.push({
      x: tailSegment.x,
      y: tailSegment.y,
    });
  }

  serialize() {
    return {
      color: this.color,
      segments: this.segmentPositions,
    }
  }
}
