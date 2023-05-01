const express = require("express");
const app = express();
var socket = require("socket.io");

// serving public folder as middleware
app.use(express.static("public"));

const PORT = process.env.PORT || 8000;

// listening to port 8000
const server = app.listen(PORT, () => {
  console.log(`server listenin ${PORT}`);
});

// initialize socket function with above server.
let io = socket(server);

// creating empty connections array to store all connections.
let connections = [];

// creating connect event which initialized when socket is connected.
io.on("connect", (socket) => {
  // once socket is connected adding the socket details to connections array.
  connections.push(socket);
  console.log(`${socket.id} has connected`);

  //   creating another event body initialized when draw event is emitted
  socket.on("draw", (data) => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        // emitting ondraw function and passing x and y co-ordinates
        con.emit("ondraw", { x: data.x, y: data.y });
      }
    });
  });

  socket.on("idealMoving", (data) => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        // emitting ondraw function and passing x and y co-ordinates
        con.emit("onIdealMoving", {
          x: data.x,
          y: data.y,
          id: socket.id,
        });
      }
    });
  });

  //   creating another event body initialized when down even is emitted under script.js file
  socket.on("down", (data) => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        // emitting ondown function and passing x and y co-ordinates
        con.emit("ondown", { x: data.x, y: data.y });
      }
    });
  });

  //   creating another event body disconnect triggered when socket or event is disconnected.
  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} has disconnected because ${reason}`);
    connections = connections.filter((con) => con.id !== socket.id);
  });
});
