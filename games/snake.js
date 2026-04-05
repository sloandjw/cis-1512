
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

const gameState = {
  tileSize: 20,
  gridSize: 20,
  snake: [
    { x: 10, y: 10 }
  ],
  direction: { x: 1, y: 0 },
  nextDirection: { x: 1, y: 0 },
  food: { x: 5, y: 5 },
  score: 0,
  gameOver: false,
  interval: null
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
        startSection.style.display = "none";
        gameSection.style.display = "flex";
        startGame();
    }
}

function startGame() {
    draw();
    gameState.interval = setInterval(update, 1000);
    getPointsButton.onclick = () => {
        gameState.score += 10;
        console.log("Current Score:", gameState.score);
        scoreDisplay.textContent = `Score: ${gameState.score}`;
    };
    
    submitPointsButton.onclick = async () => {
        await endGame();
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    gameState.direction = gameState.nextDirection;
    const head = gameState.snake[0];
    const newHead = {
        x: head.x + gameState.direction.x,
        y: head.y + gameState.direction.y
    };
    gameState.snake[0] = newHead;
    draw();
}

async function endGame() {
    gameState.gameOver = true;
    clearInterval(gameState.interval);
    scoreDisplay.textContent = `Game Over! Your Score: ${gameState.score}`;
    await submitScore();
    resetGameButton.style.display = "block";
    resetGameButton.onclick = async () => {
        scoreDisplay.textContent = `Score: 0`;
        resetGameButton.style.display = "none";
        resetGameState();
        startGame();
    };

}

function resetGameState() {
    gameState.snake = [{ x: 10, y: 10 }];
    gameState.direction = { x: 1, y: 0 };
    gameState.nextDirection = { x: 1, y: 0 };
    gameState.food = { x: 5, y: 5 };
    gameState.score = 0;
    gameState.gameOver = false;
    if (gameState.interval) {
        clearInterval(gameState.interval);
        gameState.interval = null;
    }
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
    switch (e.key) {   
        case "ArrowUp":
            if (gameState.direction.y === 0) {
                gameState.nextDirection = { x: 0, y: -1 };
            }
            break;
        case "ArrowDown":
            if (gameState.direction.y === 0) {
                gameState.nextDirection = { x: 0, y: 1 };
            }
            break;
        case "ArrowLeft":
            if (gameState.direction.x === 0) {
                gameState.nextDirection = { x: -1, y: 0 };
            }
            break;
        case "ArrowRight":
            if (gameState.direction.x === 0) {  
                gameState.nextDirection = { x: 1, y: 0 };
            }
            break;
    }       
});