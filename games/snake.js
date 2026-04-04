

//declarations

const snakeGameSection = document.getElementById("snake-game-section");
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
    snakeGameSection.style.display = "block";
}

initializeGame();
// startGame();
// gameLoop();
// updateSnake();
// drawGame();
// placeFood();
// checkCollision();
// endGame();
// submitScore();