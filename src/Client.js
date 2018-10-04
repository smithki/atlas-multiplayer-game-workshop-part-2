// CONSTANTS
const KEYS = {
  // Arrow keys
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,

  // W, A, S, D keys
  W: 87,
  A: 65,
  S: 83,
  D: 68,

  // Other keys
  SPACE: 32,
};

const DIRECTIONS = {
  LEFT: 'LEFT',
  UP: 'UP',
  RIGHT: 'RIGHT',
  DOWN: 'DOWN',
}
// END CONSTANTS

let gameState = { sneks: [], munchies: [] };
let prevTime = 0;
let socket;
let canvas;
let context;

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  gameState.sneks.forEach(snek => {
    drawSnek(context, snek);
  });


  gameState.munchies.forEach(m => drawMunchie(context, m));
}

console.log('IAN');

window.onload = function () {
  socket = io();
  socket.on('update', newState => {
    gameState = newState;
  });
  socket.emit('newPlayer');
  canvas = document.querySelector('canvas');
  context = canvas.getContext('2d');

  update(0);
}

function update() {
  if (gameState.sneks.length > 0) {
    console.log(gameState.sneks[0].segments[0]);
  }
  draw();
  requestAnimationFrame(update);
}

// player inputs
window.onkeydown = function(e) {
  let direction = '';
  if (e.keyCode === KEYS.LEFT) {
    direction = DIRECTIONS.LEFT;
  }

  if (e.keyCode === KEYS.UP) {
    direction = DIRECTIONS.UP;
  }

  if (e.keyCode === KEYS.RIGHT) {
    direction = DIRECTIONS.RIGHT;
  }

  if (e.keyCode === KEYS.DOWN) {
    direction = DIRECTIONS.DOWN;
  }

  socket.emit('playerInput', direction);
};
