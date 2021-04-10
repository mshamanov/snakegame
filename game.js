// CONSTANTS
const fieldSize = 26;
const snakeSize = 1;
const snakeClass = "snake";
const wormClass = "worm";
const notifySound = new Audio("sounds/notify.mp3");
const gameOverSound = new Audio("sounds/game-over.mp3");

// GAME STATE
let paused = true;
let soundOn = true;
let score = 0;
let best = 0;

// SNAKE
let xOffset = 1;
let yOffset = 0;
let appendPoint = null;
let snakePoints = [];

// WORM
let worm = null;

buildField();
createSnake();
createWorm();

$(document).click((event) => {
  if (!$(event.target).is("p#sound-setting")) {
    if (!paused) {
      paused = true;
      setTitle("Paused, Press Any Key To Continue");
    }
  }
});

$(document).keydown((event) => {
  if (paused) {
    paused = false;
    setTitle("Score: " + score);
    main();
  }

  switch (event.code) {
    case "KeyD":
      xOffset = 0;
      yOffset = yOffset < 0 ? yOffset : 1;
      break;

    case "KeyS":
      xOffset = xOffset < 0 ? xOffset : 1;
      yOffset = 0;
      break;

    case "KeyW":
      xOffset = xOffset > 0 ? xOffset : -1;
      yOffset = 0;
      break;

    case "KeyA":
      xOffset = 0;
      yOffset = yOffset > 0 ? yOffset : -1;
      break;
  }

});

$("#sound-setting").click(() => {
  soundOn = !soundOn;
  $("#sound-setting").html("Sound: " + (soundOn ? "on" : "off"));
});

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function rand(max) {
  return Math.floor(Math.random() * max);
}

function setTitle(title) {
  $("#score-title").html(title);
}

function setBestScoreTitle(title) {
  $("#best-score").html(title);
}

function main() {
  if (!paused) {
    setTimeout(() => {
      if (!paused) {
        moveSnake();
        checkCollision();
        checkEatenWorm();
        main();
      }
    }, 100);
  }
}

function moveSnake() {
  let head = snakePoints[snakePoints.length - 1];
  let tail = snakePoints.shift();

  appendPoint = new Point(tail.x, tail.y);

  let tailDiv = $("#x-" + tail.x + "> #y-" + tail.y);
  if (tailDiv.hasClass(snakeClass)) {
    tailDiv.removeClass(snakeClass);
  }

  tail.x = head.x + xOffset;
  tail.y = head.y + yOffset;

  let headDiv = $("#x-" + tail.x + "> #y-" + tail.y);
  if (!headDiv.hasClass(snakeClass)) {
    headDiv.addClass(snakeClass);
  }

  snakePoints.push(tail);
}

function checkCollision() {
  let head = snakePoints[snakePoints.length - 1];

  if (head.x < 0 || head.x > fieldSize - 1 || head.y < 0 || head.y > fieldSize - 1 ||
    snakePoints.some(point => point !== head && point.x === head.x && point.y === head.y)) {
    gameOver();
  }
}

function checkEatenWorm() {
  let head = snakePoints[snakePoints.length - 1];

  if (head.x === worm.x && head.y === worm.y) {
    playSound(notifySound);
    clearWorm();
    snakePoints.unshift(appendPoint);
    $("#x-" + appendPoint.x + "> #y-" + appendPoint.y).toggleClass(snakeClass);
    setTitle("Score: " + ++score);
    createWorm();
  }
}

function buildField() {
  for (let x = 0; x < fieldSize; x++) {
    $("#field").append("<div id=\"x-" + x + "\" class=\"row\"></div>");
    for (let y = 0; y < fieldSize; y++) {
      $("#x-" + x).append("<div id=y-" + y + " class=\"point field\"></div>");
    }
  }
}

function createSnake() {
  let x = 1;
  let y = fieldSize / 2 - 1;
  for (let i = x; i <= snakeSize; i++) {
    snakePoints.push(new Point(i, y));
  }

  for (point of snakePoints) {
    $("#x-" + point.x + "> #y-" + point.y).toggleClass(snakeClass);
  }
}

function createWorm() {
  do {
    worm = new Point(rand(fieldSize), rand(fieldSize));
  }
  while (snakePoints.some(point => point.x === worm.x && point.y === worm.y));

  $("#x-" + worm.x + "> #y-" + worm.y).toggleClass(wormClass);
}

function reset() {
  xOffset = 1;
  yOffset = 0;

  score = 0;

  clearSnake();
  clearWorm();

  createSnake();
  createWorm();
}

function clearSnake() {
  for (point of snakePoints) {
    $("#x-" + point.x + "> #y-" + point.y).removeClass(snakeClass);
  }
  snakePoints = [];
}

function clearWorm() {
  $("#x-" + worm.x + "> #y-" + worm.y).removeClass(wormClass);
}

function gameOver() {
  paused = true;
  playSound(gameOverSound);
  setTitle("Game Over, Press Any Key To Try Again")

  if (score > best) {
    best = score;
    setBestScoreTitle("Best Score: " + best);
  }

  reset();
}

function playSound(sound) {
  if (soundOn) {
    sound.play();
  }
}
