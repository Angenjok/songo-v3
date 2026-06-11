const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let rooms = {};

io.on("connection", (socket) => {

  socket.on("joinRoom", (roomId) => {

    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        board: Array(12).fill(4),
        turn: 0
      };
    }

    socket.emit("updateGame", rooms[roomId]);
  });

  socket.on("play", ({ roomId, index }) => {

    let game = rooms[roomId];
    if (!game) return;

    if (game.board[index] === 0) return;

    let seeds = game.board[index];
    game.board[index] = 0;

    let i = index;

    while (seeds > 0) {
      i = (i + 1) % game.board.length;
      game.board[i]++;
      seeds--;
    }

    game.turn = 1 - game.turn;

    io.to(roomId).emit("updateGame", game);
  });

});

server.listen(3000, () => {
  console.log("Songo V3 lancé");
});
