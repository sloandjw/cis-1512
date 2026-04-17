//tictactoe.js

const boardElement = document.getElementById("board");
  const statusText = document.getElementById("status");
  const startSection = document.getElementById("start-section");
  const resetButton = document.getElementById("reset-game");


  let board = ["", "", "", "", "", "", "", "", ""];
  let gameOver = false;
  let wins = 0;
  let draws = 0;
  let losses = 0;

  function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    statusText.innerText = "";
    createBoard();
  }
    resetButton.addEventListener("click", resetGame);
    
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
    if (board[index] !== "" || gameOver) return;

    board[index] = "X";
    updateBoard();
    // check for a winner (player)
    if (checkWinner("X")) {
      statusText.innerText = "You win!";
      wins++;
      updateScoreboard();
      gameOver = true;
      return;
    }

    if (board.every(cell => cell !== "")) {
      statusText.innerText = "It's a draw!";
      draws++;
      updateScoreboard();
      gameOver = true;
      return;
    }

    setTimeout(computerMove, 500);
  }
  // computer makes a move
  function computerMove() {
    let emptyCells = board
      .map((val, idx) => val === "" ? idx : null)
      .filter(val => val !== null);
    
    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = "O";
    
    updateBoard();
    // check for a winner (cpu)
    if (checkWinner("O")) {
      statusText.innerText = "Computer wins!";
      losses++;
      updateScoreboard();
      gameOver = true;
      return;
    }

    if (board.every(cell => cell !== "")) {
      statusText.innerText = "It's a draw!";
      draws++;
      updateScoreboard();
      gameOver = true;
    }
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
      [0,1,2], [3,4,5], [6,7,8], // ***rows
      [0,3,6], [1,4,7], [2,5,8], // ***columns
      [0,4,8], [2,4,6]           // ***diagonals
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
    statusText.innerText = "";
    createBoard();
  }

  createBoard();
  updateScoreboard();