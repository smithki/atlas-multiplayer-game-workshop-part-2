class Snek {
  constructor(initialPosition, initialDirection, worldWidth, worldHeight, color) {
    this.size = 20;
    this.sizeOffset = this.size / 2;
    this.segmentPositions = [initialPosition, initialPosition];
    this.direction = initialDirection;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.color = color;
    this.isDead = false;
  }

  update() {
    this.segmentPositions = this.segmentPositions.map((position, index) => {
      if (index === 0) {
        let newX = position.x;
        let newY = position.y;

        if (this.direction === DIRECTIONS.LEFT && this.direction !== DIRECTIONS.RIGHT) {
          newX = position.x - this.size;
          if (newX < 0) newX = this.worldWidth - this.size / 2;
        }

        if (this.direction === DIRECTIONS.UP) {
          newY = position.y - this.size;
          if (newY < 0) newY = this.worldHeight - this.size / 2;
        }

        if (this.direction === DIRECTIONS.RIGHT) {
          newX = position.x + this.size;
          if (newX > this.worldWidth) newX = 0 + this.size / 2;
        }

        if (this.direction === DIRECTIONS.DOWN) {
          newY = position.y + this.size;
          if (newY > this.worldHeight) newY = 0 + this.size / 2;
        }

        return { x: newX, y: newY };
      }

      return this.segmentPositions[index - 1];
    });
  }

  draw(context) {
    this.segmentPositions.forEach(position => {
      this.drawSegment(context, position);
    });
  }

  drawSegment(context, position) {
    context.fillStyle = this.color;
    context.fillRect(position.x - this.sizeOffset, position.y - this.sizeOffset, this.size, this.size);
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
}
