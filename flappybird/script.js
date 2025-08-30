const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let frames = 0;
const gravity = 0.25;
const jump = 4.6;
let score = 0;
let gameOver = false;
let gameStarted = false; // <-- new flag

const bird = {
  x: 50,
  y: 150,
  w: 30,
  h: 30,
  velocity: 0,
  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  },
  update() {
    if (!gameStarted) return; // bird doesn't move until game starts
    this.velocity += gravity;
    this.y += this.velocity;
    if (this.y + this.h >= canvas.height) {
      gameOver = true;
    }
  },
  flap() {
    this.velocity = -jump;
  }
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 120;

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
  });
}

function updatePipes() {
  if (!gameStarted) return; // pipes don’t move until start
  if (frames % 90 === 0) {
    const top = Math.random() * (canvas.height / 2);
    const bottom = canvas.height - top - pipeGap;
    pipes.push({ x: canvas.width, top: top, bottom: bottom });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.w > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.h > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }
    if (pipe.x + pipeWidth === bird.x) {
      score++;
    }
  });

  if (pipes.length && pipes[0].x < -pipeWidth) {
    pipes.shift();
  }
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 25);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bird.update();
  bird.draw();
  updatePipes();
  drawPipes();
  drawScore();

  if (!gameStarted && !gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "25px Arial";
    ctx.fillText("Press SPACE to Start", 80, canvas.height / 2);
  }

  if (!gameOver) {
    if (gameStarted) frames++;
    requestAnimationFrame(loop);
  } else {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", 120, canvas.height / 2);
  }
}

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    if (!gameStarted) {
      gameStarted = true; // start game when space is first pressed
    }
    if (!gameOver) {
      bird.flap();
    }
  }
});

loop();
