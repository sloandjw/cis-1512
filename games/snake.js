
//declarations
const gameName = "Snake";

const startSection = document.getElementById("start-section");
const gameSection = document.getElementById("game-section");
const scoreDisplay = document.getElementById("score-display");
const startGameButton = document.getElementById("start-game");
const getPointsButton = document.getElementById("get-points");
const submitPointsButton = document.getElementById("submit-points");
const resetGameButton = document.getElementById("reset-game");
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const speed = 80;

const gameState = {
  tileSize: 20,
  gridSize: 20,
  snake: [
    { x: 10, y: 10 },
    { x: 10, y: 10 },
    { x: 10, y: 10 }
  ],
  direction: { x: 1, y: 0 },
  nextDirection: { x: 1, y: 0 },
  food: { x: 5, y: 5 },
  score: 0,
  gameOver: false,
  interval: null,
  ticks: 0
};

//entry point
initializeGame();

//methods
function initializeGame() {
    resetGameState();
    startSection.style.display = "block";
    gameSection.style.display = "none";
    startGameButton.onclick = () => {
        scoreDisplay.textContent = `Score: 0`;
        resetGameButton.style.display = "flex";
        startSection.style.display = "none";
        gameSection.style.display = "flex";
        spawnFood();
        startGame();
    }
}

function startGame() {
    draw();
    gameState.interval = setInterval(update, speed);
    resetGameButton.onclick = async () => {
        scoreDisplay.textContent = `Score: 0`;
        resetGameState();
        spawnFood();
        startGame();
    };
    // getPointsButton.onclick = () => {
    //     gameState.score += 10;
    //     console.log("Current Score:", gameState.score);
    //     scoreDisplay.textContent = `Score: ${gameState.score}`;
    // };
    
    // submitPointsButton.onclick = async () => {
    //     await endGame();
    // };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.fillRect(
        gameState.food.x * gameState.tileSize,
        gameState.food.y * gameState.tileSize,
        gameState.tileSize,
        gameState.tileSize
    );
    ctx.fillStyle = "lime";
    for (let segment of gameState.snake) {
        ctx.fillRect(
            segment.x * gameState.tileSize,
            segment.y * gameState.tileSize,
            gameState.tileSize,
            gameState.tileSize
        );
    }
}

function update() {
    gameState.ticks++;
    if (gameState.ticks > 3 && checkCollision()) {
        return;
    }
    gameState.direction = gameState.nextDirection;
    const head = gameState.snake[0];
    const newHead = {
        x: head.x + gameState.direction.x,
        y: head.y + gameState.direction.y
    };
    gameState.snake.unshift(newHead);
    if (newHead.x === gameState.food.x && newHead.y === gameState.food.y) {
        eatFood();
    } else {
        gameState.snake.pop();
    }
    wrapAround();
    draw();
}

function spawnFood() {
    gameState.food = {
        x: Math.floor(Math.random() * gameState.gridSize),
        y: Math.floor(Math.random() * gameState.gridSize)
    };
    console.log("Food spawned at:", gameState.food);
}

function wrapAround() {
    const head = gameState.snake[0];
    if (head.x < 0) {
        head.x = gameState.gridSize - 1;
    } else if (head.x >= gameState.gridSize) {
        head.x = 0;
    }
    if (head.y < 0) {
        head.y = gameState.gridSize - 1;
    } else if (head.y >= gameState.gridSize) {
        head.y = 0;
    }
}

function eatFood() {
    gameState.score += 10;
    console.log("Current Score:", gameState.score);
    scoreDisplay.textContent = `Score: ${gameState.score}`;
    spawnFood();
}

function checkCollision() {
    const head = gameState.snake[0];   
    for (let i = 1; i < gameState.snake.length; i++) {
        if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
            endGame();
            return true;
        }
    }
    return false;
}

function isOppositeDirection(dir1, dir2) {
    return (dir1.x + dir2.x === 0 && dir1.y + dir2.y === 0);
}


async function endGame() {
    gameState.gameOver = true;
    clearInterval(gameState.interval);
    scoreDisplay.textContent = `Game Over! Score: ${gameState.score}`;
    await submitScore();
}

function resetGameState() {
    gameState.snake = [
        { x: 10, y: 10 },
        { x: 10, y: 10 },
        { x: 10, y: 10 }
    ];
    gameState.direction = { x: 1, y: 0 };
    gameState.nextDirection = { x: 1, y: 0 };
    gameState.food = { x: 5, y: 5 };
    gameState.score = 0;
    gameState.gameOver = false;
    if (gameState.interval) {
        clearInterval(gameState.interval);
        gameState.interval = null;
    }
    gameState.ticks = 0;
}

async function submitScore() {
    const playerId = localStorage.getItem("playerId");
    const playerName = localStorage.getItem("playerName");
    if (!playerId || !playerName) {
        console.log("Missing player data in localStorage.");
        return;
    }
    try {
        //const response = await fetch(`/api/scores`, {
        const response = await fetch(`${apiBase}/api/scores`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                player_id: playerId,
                game_name: gameName,
                score: gameState.score
            })
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("Submit failed:", data);
            console.log("Failed to submit score.");
            return;
        }
        console.log("Score submitted successfully:", data);
        console.log("Score submitted successfully.");
    } catch (error) {
        console.error("Error submitting score:", error);
        console.log("Error submitting score.");
    }
}

//event listeners
document.addEventListener("keydown", (e) => {
    let newDirection;
    switch (e.key) {   
        case "ArrowUp":
        case "w":
            newDirection = { x: 0, y: -1 };
            break;
        case "ArrowDown":
        case "s":
            newDirection = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
        case "a":
            newDirection = { x: -1, y: 0 };
            break;
        case "ArrowRight":
        case "d":
            newDirection = { x: 1, y: 0 };
            break;
    }
    if (isOppositeDirection(gameState.direction, newDirection)) {
        endGame();
        return;
    }
    gameState.nextDirection = newDirection;
});