class Node {
  constructor(row, col, next = null) {
    (this.row = row), (this.col = col), (this.next = next);
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
}

LinkedList.prototype.insertAtBeginning = function (row, col) {
  // A newNode object is created with property data and next = null
  let newNode = new Node(row, col);
  // The pointer next is assigned head pointer so that both pointers now point at the same node.
  newNode.next = this.head;
  // As we are inserting at the beginning the head pointer needs to now point at the newNode.

  this.head = newNode;
  return this.head;
};

LinkedList.prototype.deleteLastNode = function () {
  if (!this.head) {
    return null;
  }
  // if only one node in the list
  if (!this.head.next) {
    this.head = null;
    return;
  }
  let previous = this.head;
  let tail = this.head.next;

  while (tail.next !== null) {
    previous = tail;
    tail = tail.next;
  }

  previous.next = null;
  return this.head;
};

LinkedList.prototype.clear = function () {
  this.head = null;
};

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("keydown", logKey);

  window.onload = function () {
    $("restart").addEventListener("click", restart);
    $("start").addEventListener("click", run);
  };

  function logKey(e) {
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        direction = "up";
        break;
      case "KeyA":
      case "ArrowLeft":
        direction = "left";
        break;
      case "KeyS":
      case "ArrowDown":
        direction = "down";
        break;
      case "KeyD":
      case "ArrowRight":
        direction = "right";
        break;
    }
    e.preventDefault();
  }

  const s = $("start");

  direction = "right"; //default movement of the snake

  let snakebody = new LinkedList();

  for (i = 0; i < 100; i++) gameoverflag = false;

  var ctx = document.getElementById("grid").getContext("2d");

  var emptycolor = ctx.createLinearGradient(20, 0, 480, 0);
  emptycolor.addColorStop(0, "#365314");
  emptycolor.addColorStop(1, "#365314");
  emptycolor.addColorStop(0.5, "#65a30d");

  //emptycolor = "#365314";
  snakecolor = "#27272a";
  foodcolor = "#b91c1c";

  let score = 2;
  rownum = 20;
  colnum = 20;
  cellsize = 25;
  inndercellsize = 25;

  initializesnake();
  drawboard();
  randomfood();
  drawfood();
  drawsnake();

  function initializesnake() {
    snakebody.insertAtBeginning(4, 4);
    snakebody.insertAtBeginning(4, 5);
  }

  function randomfood() {
    foodrow = Math.floor(Math.random() * rownum);
    foodcol = Math.floor(Math.random() * colnum);
  }

  function drawfood() {
    ctx.fillStyle = foodcolor;

    ctx.beginPath();
    x = foodcol * cellsize;
    y = foodrow * cellsize;
    ctx.rect(x, y, inndercellsize, inndercellsize);
    ctx.fill();
    ctx.closePath();
  }

  function drawboard() {
    ctx.fillStyle = emptycolor;

    ctx.beginPath();

    for (var row = 0, i = 0; i < rownum; row += cellsize, i++) {
      for (var col = 0, j = 0; j < colnum; col += cellsize, j++) {
        ctx.rect(row, col, inndercellsize, inndercellsize);
      }
    }

    ctx.fill();
    ctx.closePath();
  }

  function run() {
    if (s.value === "Start") s.style.display = "none";
    setInterval(drawsnake, 16.667);
    setInterval(growsnake, 100);
  }

  function collide(row1, col1, row2, col2) {
    if (row1 == row2 && col1 == col2) return true;
    else return false;
  }

  function hitwalls() {
    if (
      snakebody.head.row < 0 ||
      snakebody.head.row > rownum - 1 ||
      snakebody.head.col < 0 ||
      snakebody.head.col > colnum - 1
    ) {
      return true;
    } else return false;
  }

  function hitfood(row, col) {
    if (collide(row, col, foodrow, foodcol)) return true;
    else return false;
  }

  function hitself(newrow, newcol) {
    agent = snakebody.head;
    while (agent != null) {
      if (collide(newrow, newcol, agent.row, agent.col)) return true;

      agent = agent.next;
    }
    return false;
  }

  function growsnake() {
    if (gameoverflag == true) return;

    switch (direction) {
      case "up":
        newrow = snakebody.head.row - 1;
        newcol = snakebody.head.col;
        break;
      case "left":
        newrow = snakebody.head.row;
        newcol = snakebody.head.col - 1;
        break;
      case "down":
        newrow = snakebody.head.row + 1;
        newcol = snakebody.head.col;
        break;
      case "right":
        newrow = snakebody.head.row;
        newcol = snakebody.head.col + 1;
        break;
    }

    if (hitself(newrow, newcol)) {
      swal({
        title: "Game Over!",
        text: "Your final length was " + score + "!",
        icon: "error",
        button: "Go Back!",
      });
      gameoverflag = true;
    }
    snakebody.insertAtBeginning(newrow, newcol);

    if (hitwalls()) {
      swal({
        title: "Game Over!",
        text: "Your final length was " + score + "!",
        icon: "error",
        button: "Go Back!",
      });
      gameoverflag = true;
    }

    if (!hitfood(newrow, newcol)) snakebody.deleteLastNode();
    else {
      score++;
      document.getElementById("score").innerHTML = "Length: " + score;
      randomfood();
      drawfood();
    }
  }

  function drawsnake() {
    if (gameoverflag == true) return;

    drawboard();
    drawfood();

    ctx.beginPath();
    ctx.fillStyle = snakecolor;

    agent = snakebody.head;
    while (agent != null) {
      y = agent.row * cellsize;
      x = agent.col * cellsize;
      ctx.rect(x, y, inndercellsize, inndercellsize);
      agent = agent.next;
    }

    ctx.fill();
    ctx.closePath();
  }

  function restart() {
    window.location = window.location;
    run();
  }
});
