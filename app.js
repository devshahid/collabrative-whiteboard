const express = require("express");

const app = express();
// const server = app.listen(8000);
// const httpServer = require("http").createServer(app);
var socket = require("socket.io");

app.use(express.static("public"));

const PORT = 8000;
const server = app.listen(PORT, () => {
  console.log(`server listenin ${PORT}`);
});

let io = socket(server);
let connections = [];

io.on("connect", (socket) => {
  connections.push(socket);
  console.log(`${socket.id} has connected`);

  socket.on("draw", (data) => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("ondraw", { x: data.x, y: data.y });
      }
    });
  });

  socket.on("down", (data) => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("ondown", { x: data.x, y: data.y });
      }
    });
  });

  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} has disconnected because ${reason}`);
    connections = connections.filter((con) => con.id !== socket.id);
  });
});
