const socket = io();

let roomId = "";
let board = [];

function joinRoom() {
  roomId = document.getElementById("room").value;
  socket.emit("joinRoom", roomId);
}

socket.on("updateGame", (game) => {
  board = game.board;
  draw();
});

function draw() {
  const container = document.getElementById("board");
  container.innerHTML = "";

  board.forEach((val, index) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.innerText = val;

    div.onclick = () => {
      socket.emit("play", {
        roomId,
        index
      });
    };

    container.appendChild(div);
  });

  document.getElementById("status").innerText =
    "Salle : " + roomId;
}
