let canvas = document.getElementById("canvas");

canvas.width = 0.98 * window.innerWidth;
canvas.height = window.innerHeight;

var io = io.connect("http://localhost:8000/");

let canvasContext = canvas.getContext("2d");

let x;
let y;
let mouseDown = false;

window.onmousedown = (e) => {
  canvasContext.moveTo(x, y);
  io.emit("down", { x, y });
  mouseDown = true;
};

window.onmouseup = (e) => {
  mouseDown = false;
};

io.on("ondraw", ({ x, y }) => {
  canvasContext.lineTo(x, y);
  canvasContext.stroke();
});

io.on("ondown", ({ x, y }) => {
  canvasContext.moveTo(x, y);
});

window.onmousemove = (e) => {
  x = e.clientX;
  y = e.clientY;

  if (mouseDown) {
    io.emit("draw", { x, y });
    canvasContext.lineTo(x, y);
    canvasContext.stroke();
  }
};
