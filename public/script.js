// getting canvas id created in HTML File
let canvas = document.getElementById("canvas");
let pointer = document.getElementById("pointer");

// configuring width and height of canvas
canvas.width = 0.98 * window.innerWidth;
canvas.height = window.innerHeight;

pointer.width = 0.98 * window.innerWidth;
pointer.height = window.innerHeight;

// connecting socket with Backend server path io is constant which is importing from a library under scrpit tag
// var io = io.connect("http://localhost:8000/");
var io = io.connect("https://collabrative-whiteboard-gozu.onrender.com/");


// creating 2d context of canvas
let canvasContext = canvas.getContext("2d");
let pointerContext = pointer.getContext("2d");

let x;
let y;
let mouseDown = false;

// creating a function triggered when onmousedown(click and hold)
window.onmousedown = (e) => {
  // moveTo function used to move the mouse cursor to new position when started drawing
  canvasContext.moveTo(x, y);
  // then emitting even down which is defined in app.js file and passing x and y co-ordinates
  io.emit("down", { x, y });
  // setting mouseDown to true, so to draw only when mouse clicked and dragged
  mouseDown = true;
};

window.onmouseup = (e) => {
  // setting mouseDown to false, so stop drawing when when is released.
  mouseDown = false;
};

// event triggered when ondraw event is called
io.on("ondraw", ({ x, y }) => {
  // lineTo function used to draw the line with x and y co-ordinates from specific co-ordinates
  canvasContext.lineTo(x, y);
  // stroke used to stroke the line on canvas.
  canvasContext.stroke();
});

// event triggered when ondown event is called
io.on("ondown", ({ x, y }) => {
  // change the co-ordinates to new location of x and y
  canvasContext.moveTo(x, y);
});

// called when mouse started moving
window.onmousemove = (e) => {
  // get the co-ordinates from e event of x and y
  x = e.clientX;
  y = e.clientY;

  // check when mouseDown is true if true then emitting another event draw with x and y and drawing the line.
  if (mouseDown) {
    io.emit("draw", { x, y });
    canvasContext.lineTo(x, y);
    canvasContext.stroke();
  }
  io.emit("idealMoving", { x, y });
};
let colorObj = {};

io.on("onIdealMoving", ({ x, y, id, color }) => {
  pointerContext.clearRect(0, 0, pointer.width, pointer.height);
  pointerContext.beginPath();
  pointerContext.arc(x, y, 10, 0, 2 * Math.PI);
  pointerContext.fillStyle = idToColor(id);
  pointerContext.fill();
  pointerContext.font = "12px Arial";
  pointerContext.fillText(id, x - 20, y - 20);
});

function idToColor(socketId) {
  // Generate a hash code from the socket.id using a simple hashing function
  let hash = 0;
  for (let i = 0; i < socketId.length; i++) {
    hash = socketId.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert the hash code to a 24-bit hexadecimal color code
  let color = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }

  return color;
}
