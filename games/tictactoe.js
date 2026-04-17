//tictactoe.js

const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
let currentPlayer = 'X';

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    if (cell.textContent === '') {
      cell.textContent = currentPlayer;
      if (checkWin(currentPlayer)) {
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
      }
    }
  });
});

function checkWin(player) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  return winningCombinations.some(combination => {
    return combination.every(index => {
      return cells[index].textContent === player;
    });
  });
}