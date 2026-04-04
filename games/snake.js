
//declarations

const startSection = document.getElementById("start-section");
const gameSection = document.getElementById("game-section");
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
    startSection.style.display = "block";
    startGameButton.onclick = () => {
        startSection.style.display = "none";
        gameSection.style.display = "block";
        startGame();
    }
}

function startGame() {
    //gameState.intervalId = setInterval(gameLoop, 200);
    getPointsButton.onclick = async () => {
        gameState.score += 10; // Simulate scoring points
        console.log("Current Score:", gameState.score);
    }
    submitPointsButton.onclick = async () => {
        const playerName = localStorage.getItem("playerName");
        // Simulate submitting points (replace with actual API call)
        console.log(`Submitting points for player: ${playerName}, Score: ${gameState.score}`);
    }

}

// updateSnake();
// drawGame();
// placeFood();
// checkCollision();
// endGame();
// submitScore();
initializeGame();