const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const path = require('path');

// Create our server application
const app = express();
const server = http.Server(app);
const io = SocketIO(server);

// Server-side state
const gameState = {
  sneks: {},
};

// --- Set up express endpoints --- //

// Statically serve our `src` directory
app.use(express.static(path.resolve(__dirname, '../src')));

// Serve our `index.html` file
app.get('*', (req, res) => {
  const pathToHtml = path.resolve(__dirname, '../index.html')
  res.sendFile(pathToHtml);
});

// --- Set up socket.io endpoints --- //

// On socket connection
io.on('connection', socket => {

  // When a client requests an update, send current game state
  socket.on('update', ack => {
    ack(gameState);
  });

  // Save a new player into the game state
  socket.on('newPlayer', payload => {
    gameState.sneks[socket.id] = payload;
  });

  // Remove a player when they lose
  socket.on('removePlayer', () => {
    delete gameState.sneks[socket.id];
  });

  // When a state mutation is received from the client, update accordingly in the game manager.
  socket.on('mutation', payload => {
    game.setState(socket.id, payload);
  });

});


// --- Start our server listening on port 3000 --- //

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000/');
});
