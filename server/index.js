const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const path = require('path');
// const GameManager = require('./GameManager');

// Create our server application
const app = express();
const server = http.Server(app);
const io = SocketIO(server);

// Instantiate our server-side GameManager
// const game = new GameManager();

// --- Set up express endpoints --- //

// Statically serve our `src` directory
app.use(express.static(path.resolve(__dirname, '../src')));

// Serve our `index.html` file
app.get('*', (req, res) => {
  const pathToHtml = path.resolve(__dirname, '../index.html')
  res.sendFile(pathToHtml);
});

// --- Set up socket.io endpoints --- //


// --- Start our server listening on port 3000 --- //

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000/');
});
