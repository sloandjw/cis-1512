
//declarations
const gameName = "Snake";

const startSection = document.getElementById("start-section");
const gameSection = document.getElementById("game-section");
const scoreDisplay = document.getElementById("score-display");
const startGameButton = document.getElementById("start-game");
const getPointsButton = document.getElementById("get-points");
const submitPointsButton = document.getElementById("submit-points");

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
  intervalId: null
};


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
    //gameState.intervalId = setInterval(gameLoop, 200);
    getPointsButton.onclick = () => {
        gameState.score += 10;
        console.log("Current Score:", gameState.score);
        scoreDisplay.textContent = `Score: ${gameState.score}`;
    };

    submitPointsButton.onclick = async () => {
        await submitScore();
    };



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


    //reset game state for new game
    initializeGame();
}
    
function resetGameState() {
    gameState.snake = [{ x: 10, y: 10 }];
    gameState.direction = { x: 1, y: 0 };
    gameState.nextDirection = { x: 1, y: 0 };
    gameState.food = { x: 5, y: 5 };
    gameState.score = 0;
    gameState.gameOver = false;
    if (gameState.intervalId) {
        clearInterval(gameState.intervalId);
        gameState.intervalId = null;
    }
}

// updateSnake();
// drawGame();
// placeFood();
// checkCollision();
// endGame();
// submitScore();
initializeGame();