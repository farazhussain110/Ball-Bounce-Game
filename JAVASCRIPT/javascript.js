
let score = 0;
let time = 60;
let gameRunning = false;

let ball;
let paddle;

let ballX = 100;
let ballY = 100;

let speedX = 4;
let speedY = 4;

let paddleX = 0;

let targets = [];
let keys = {};

let gameInterval;
let timerInterval;

const gameArea = document.getElementById("gameArea");

const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");


// START GAME

function startGame() {

    clearInterval(gameInterval);
    clearInterval(timerInterval);

    score = 0;
    time = 60;

    targets = [];
    keys = {};

    gameRunning = true;

    scoreDisplay.textContent = score;
    timerDisplay.textContent = time;

    gameArea.innerHTML = "";

    startBtn.hidden = true;
    restartBtn.hidden = true;

    // CREATE BALL

    ball = document.createElement("div");
    ball.classList.add("ball");

    ballX = 100;
    ballY = 100;

    speedX = 4;
    speedY = 4;

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";

    gameArea.appendChild(ball);

    // CREATE PADDLE

    paddle = document.createElement("div");
    paddle.classList.add("paddle");

    paddleX = (gameArea.clientWidth - 110) / 2;

    paddle.style.left = paddleX + "px";

    gameArea.appendChild(paddle);

    // CREATE TARGETS

    createTargets();

    gameInterval = setInterval(updateGame, 20);

    timerInterval = setInterval(function() {

        time--;

        timerDisplay.textContent = time;

        if (time <= 0) {
            endGame();
        }

    }, 1000);
}


// CREATE TARGET OBJECTS

function createTargets() {

    for (let i = 0; i < 8; i++) {

        let target = document.createElement("div");

        target.classList.add("target");

        let green = Math.random() > 0.5;

        let points = green ? 10 : -5;

        target.style.background = green ? "green" : "red";

        let x = 20 + (i % 4) * 100;
        let y = 30 + Math.floor(i / 4) * 45;

        target.style.left = x + "px";
        target.style.top = y + "px";

        gameArea.appendChild(target);

        targets.push({
            element: target,
            x: x,
            y: y,
            points: points
        });
    }
}


// UPDATE GAME

function updateGame() {

    if (!gameRunning) return;

    // MOVE PADDLE

    if (keys["ArrowLeft"]) {
        paddleX -= 7;
    }

    if (keys["ArrowRight"]) {
        paddleX += 7;
    }

    paddleX = Math.max(
        0,
        Math.min(paddleX, gameArea.clientWidth - 110)
    );

    paddle.style.left = paddleX + "px";
  
    // MOVE BALL

    ballX += speedX;
    ballY += speedY;

    // WALL COLLISION

    if (ballX <= 0 || ballX >= gameArea.clientWidth - 25) {
        speedX *= -1;
    }

    if (ballY <= 0) {
        speedY *= -1;
    }

    // PADDLE COLLISION
    let paddleTop = gameArea.clientHeight - 30;
    if (
        speedY > 0 &&
        ballY + 25 >= paddleTop &&
        ballY <= paddleTop + 15 &&
        ballX + 25 > paddleX &&
        ballX < paddleX + 110
    ) {
        speedY = -Math.abs(speedY);
    }
    // GAME OVER IF BALL FALLS
    if (ballY > gameArea.clientHeight) {
        endGame();
        return;
    }
    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
    // TARGET COLLISION
    for (let i = targets.length - 1; i >= 0; i--) {

        let target = targets[i];

        let collision =
            ballX < target.x + 45 &&
            ballX + 25 > target.x &&
            ballY < target.y + 20 &&
            ballY + 25 > target.y;

        if (collision) {

            // UPDATE SCORE

            score += target.points;

            scoreDisplay.textContent = score;

            // BOUNCE BALL

            speedY *= -1;

            // DELETE TARGET

            target.element.remove();

            targets.splice(i, 1);
        }
    }

    // CREATE NEW TARGETS WHEN ALL ARE REMOVED

    if (targets.length === 0) {
        createTargets();
    }
}


// KEYBOARD EVENTS

document.addEventListener("keydown", function(event) {

    if (!gameRunning) return;

    if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
    ) {
        event.preventDefault();
    }

    keys[event.key] = true;
});

document.addEventListener("keyup", function(event) {

    keys[event.key] = false;
});

// GAME OVER

function endGame() {

    gameRunning = false;

    clearInterval(gameInterval);
    clearInterval(timerInterval);

    gameArea.innerHTML = "";
    targets = [];
    let result = document.createElement("h2");
    result.textContent =
        "GAME OVER! Final Score: " + score;
    result.style.marginTop = "180px";
    gameArea.appendChild(result);
    restartBtn.hidden = false;
}
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
