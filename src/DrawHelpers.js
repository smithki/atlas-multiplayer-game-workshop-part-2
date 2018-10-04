const snekSize = 20;
const worldWidth = 37;
const worldHeight = 24;

function drawSnek(context, snek) {
  snek.segments.forEach(position => {
    context.fillStyle = snek.color;
    context.fillRect(
      position.x * 20,
      position.y * 20,
      snekSize,
      snekSize);
  });
}

function drawMunchie(context, position) {
  context.fillStyle = 'black';
  context.fillRect(position.x * 20 + 5, position.y * 20 + 5, 10, 10);
}
