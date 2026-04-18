//tictactoe.js

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");
const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");
const playAgainBtn = document.getElementById("play-again");

let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;
let wins = 0;
let draws = 0;
let losses = 0;
let isPlayerTurn = true;

// start screen
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  createBoard();
  updateScoreboard();
});

// play again
playAgainBtn.addEventListener("click", () => {
  resetGame();
});

// create the game board
function createBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.innerText = cell;
    div.addEventListener("click", () => playerMove(index));
    boardElement.appendChild(div);
  });
}

  // player makes a move
  function playerMove(index) {
    if (board[index] !== "" || gameOver || !isPlayerTurn) return;

    isPlayerTurn = false; // locks input

  board[index] = "X";
  updateBoard();

  if (checkWinner("X")) {
    statusText.innerText = "You win!";
    wins++;
    updateScoreboard();
    gameOver = true;
    playAgainBtn.style.display = "block";
    submitGameScore("TicTacToe", 1);
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.innerText = "It's a draw!";
    draws++;
    updateScoreboard();
    gameOver = true;
    playAgainBtn.style.display = "block";
    submitGameScore("TicTacToe", 0);
    return;
  }

  setTimeout(computerMove, 500);
}

// computer makes a move ***added strategy***
function computerMove() {
  if (gameOver) return;

  let move = findWinningMove("O");
  if (move === null) {
    move = findWinningMove("X");
  }

  if (move === null && board[4] === "") {
    move = 4;
  }

  const corners = [0, 2, 6, 8];
  if (move === null) {
    const availableCorners = corners.filter(i => board[i] === "");
    if (availableCorners.length > 0) {
      move = availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
  }
  if (move == null) {
    let emptyCells = board.map((val, idx) => (val === "" ? idx : null)).filter((val) => val !== null);
    move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  board[move] = "O";
  updateBoard();

  if (checkWinner("O")) {
    statusText.innerText = "Computer wins!";
    losses++;
    updateScoreboard();
    gameOver = true;
    playAgainBtn.style.display = "block";
    submitGameScore("TicTacToe", -1);
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.innerText = "It's a draw!";
    draws++;
    updateScoreboard();
    gameOver = true;
    playAgainBtn.style.display = "block";
    submitGameScore("TicTacToe", 0);
  }

  isPlayerTurn = true; // unlocks input
}
function findWinningMove(player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    const values = [board[a], board[b], board[c]];
    if (values.filter(v => v === player).length === 2 && values.includes("")) {
      return pattern[values.indexOf("")];
    }
  }
  return null;
}

// update the board display
function updateBoard() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell, index) => {
    cell.innerText = board[index];
    if (board[index] !== "") {
      cell.classList.add("taken");
    }
  });
}

// check for a winner
function checkWinner(player) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === player)
  );
}

// update the scoreboard
function updateScoreboard() {
  document.getElementById("scoreboard").innerText =
    `Wins: ${wins} | Losses: ${losses} | Draws: ${draws}`;
}

// reset the game
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  isPlayerTurn = true;
  statusText.innerText = "";
  playAgainBtn.style.display = "none";
  createBoard();
}
