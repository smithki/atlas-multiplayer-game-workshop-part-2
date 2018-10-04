const { DIRECTIONS, KEYS } = require('./constants');
const Snek = require('./Snek');

module.exports = class GameManager {
  constructor(io) {
    // Initialize canvas and drawing context.
    // this.canvas = document.getElementById('game-canvas')
    // this.context = this.canvas.getContext('2d');
    this.prevTime = 0;

    this.isGameOver = false;
    this.winnerIndex = 0;

    // Initialize snek stuff
    this.sneks = [];
    this.snekSpeed = 100;
    this.snekStepCounter = 0;

    // munchie stuff
    this.munchies = [];
    this.munchieWindow = 2000;
    this.munchieCounter = 0;

    this.updateBuffer = 0;
    this.updateBufferMax = 50;

    // Socket.io stuff
    this.io = io;
  }

  /**
   *
   */
  init() {
    // Create our player sneks!

    // On socket connection
    this.io.on('connection', socket => {
      // Save a new player into the game state
      socket.on('newPlayer', () => {
        const newSnek = new Snek(
          socket.id,
          { x: 10, y: 10 },
          DIRECTIONS.RIGHT,
          37,
          24
        );
        this.sneks.push(newSnek);
      });

      // Remove a player when they lose
      socket.on('removePlayer', () => {
        // maybe we should send an update that says you died
        // delete gameState.sneks[socket.id];
      });

      socket.on('playerInput', direction => {
        const properSnek = this.sneks.find(s => s.socketId = socket.id);
        if (properSnek) {
          this.processInput(properSnek, direction);
        }
      });

      socket.on('disconnect', () => {
        this.sneks = this.sneks.filter(s => s.socketId !== socket.id);
      });
    });

    setImmediate(this.update.bind(this));
  }

  broadcast() {
    const updateState = {
      sneks: this.sneks.map(s => s.serialize()),
      munchies: this.munchies,
    };
    console.log(this.sneks.map(s => s.socketId));
    this.io.sockets.emit('update', updateState);
  }

  /**
   *
   * @param {*} currentTime
   */
  update() {
    const deltaTime = Date.now() - this.prevTime;
    this.prevTime = Date.now();

    if (!this.isGameOver) {
      this.snekStepCounter += deltaTime;
      if (this.snekStepCounter >= this.snekSpeed) {
        this.sneks.forEach((snek, index) => {
          snek.update();
          this.checkCollisions(snek, index);
        });

        this.snekStepCounter = 0;
      }

      this.munchieCounter += deltaTime;
      if (this.munchies.length < 20 && this.munchieCounter >= this.munchieWindow) {
        this.spawnMunchie();
        this.munchieCounter = 0;
      }
    }

    this.updateBuffer += deltaTime;
    // Update all children with delta time (if necessary)
    if (this.updateBuffer >= this.updateBufferMax) {
      this.broadcast();
      this.updateBuffer = 0;
    }
    setImmediate(this.update.bind(this));
  }

  processInput(snek, direction) {
    if (direction === DIRECTIONS.LEFT && snek.direction !== DIRECTIONS.RIGHT) {
      snek.changeDirection(DIRECTIONS.LEFT);
    }

    if (direction === DIRECTIONS.UP && snek.direction !== DIRECTIONS.DOWN) {
      snek.changeDirection(DIRECTIONS.UP);
    }

    if (direction === DIRECTIONS.RIGHT && snek.direction !== DIRECTIONS.LEFT) {
      snek.changeDirection(DIRECTIONS.RIGHT);
    }

    if (direction === DIRECTIONS.DOWN && snek.direction !== DIRECTIONS.UP) {
      snek.changeDirection(DIRECTIONS.DOWN);
    }
  }

  checkCollisions(snek) {
    const headPosition = snek.segmentPositions[0];

    // Snek collisions
    this.sneks.forEach((otherSnek) => {
      // don't collide with ourself
      if (snek.socketId !== otherSnek.socketId) {
        otherSnek.segmentPositions.forEach(position => {
          if (headPosition.x === position.x && headPosition.y === position.y) {
            snek.isDead = true;
          }
        });
      }
    });
    this.sneks = this.sneks.filter(s => !s.isDead);

    // Munchie collisions
    let collidedMunchie = -1;
    this.munchies.forEach((munchie, i) => {
      if (headPosition.x === munchie.x && headPosition.y === munchie.y) {
        snek.addSegment();
        collidedMunchie = i;
      }
    });

    if (collidedMunchie != -1) {
      this.munchies.splice(collidedMunchie, 1);
    }
  }

  spawnMunchie() {
    let munchX = (Math.round(Math.random() * 37));
    let munchY = (Math.round(Math.random() * 24));

    this.munchies.push({ x: munchX, y: munchY });
  }
}
