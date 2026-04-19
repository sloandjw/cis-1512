const gameName = "Memory";

const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const resetBtn = document.getElementById("reset-btn");
const memoryMode = document.getElementById("memory-mode");
const grid = document.getElementById("memory-grid");

startBtn.addEventListener("click", () => {
    memoryMode.hidden = false;
    startScreen.style.display = "none";
    renderMemoryGrid();
});

resetBtn.addEventListener("click", () => {
    memoryMode.hidden = false;
    startScreen.style.display = "none";
    renderMemoryGrid();
});

const memoryCards = [
    { id: 1, label: "⚡", pairId: "1" },
    { id: 2, label: "⚡", pairId: "1" },
    { id: 3, label: "🚀", pairId: "2" },
    { id: 4, label: "🚀", pairId: "2" },
    { id: 5, label: "🧩", pairId: "3" },
    { id: 6, label: "🧩", pairId: "3" },
    { id: 7, label: "🎸", pairId: "4" },
    { id: 8, label: "🎸", pairId: "4" },
    { id: 9, label: "🎲", pairId: "5" },
    { id: 10, label: "🎲", pairId: "5" },
    { id: 11, label: "🏆", pairId: "6" },
    { id: 12, label: "🏆", pairId: "6" }
];

//Memory match logic
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false;
let points = 0;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function renderMemoryGrid() {
    grid.innerHTML = "";
    const shuffled = shuffle([...memoryCards]);

    shuffled.forEach(card => {
        const cardEl = document.createElement("button");
        cardEl.className = "memory-card";
        cardEl.setAttribute("data-id", card.id);
        cardEl.setAttribute("data-pair", card.pairId);
        cardEl.innerHTML = `<span class="memory-card-front"></span><span class="memory-card-back">${card.label}</span>`;
        cardEl.addEventListener("click", () => flipMemoryCard(cardEl));
        cardEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                flipMemoryCard(cardEl);
            }
        });
        grid.appendChild(cardEl);
    });

    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    points = 0;
    lockBoard = false;
    updateMoveCount();
    announceStatus("Start matching cards!");
    announcePoints("Points: 0");
    resetBtn.style.display = "none";
}

function flipMemoryCard(card) {
    if (lockBoard || card.classList.contains("matched") || flippedCards.includes(card)) return;

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        lockBoard = true;
        moves++;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.pair === card2.dataset.pair;

    if (isMatch) {
        card1.classList.add("matched");
        card2.classList.add("matched");
        matchedPairs++;
        announceStatus("Match found!");
        resetTurn();
        checkWin();
    } else {
        announceStatus("Not a match.");
        setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        resetTurn();
        }, 1000);
    }
}

function resetTurn() {
    flippedCards = [];
    lockBoard = false;
    updateMoveCount();
}

async function checkWin() {
    if (matchedPairs === memoryCards.length / 2) {
        announceStatus(`You won in ${moves} moves!`);
        checkPoints();
        announcePoints(`Points: ${points}`);
        resetBtn.style.display = "block";
        // Submit turn count to leaderboard (lower is better)
        submitGameScore('Memory', moves);
    }
}

function updateMoveCount() {
    document.getElementById("moves").textContent = `Moves: ${moves}`;
}

function announceStatus(message) {
    // document.getElementById("status").textContent = message;
}

function announcePoints(message1) {
    document.getElementById("points").textContent = message1;
}

function checkPoints() {
    const pointsTable = {
        5: 1000, 6: 200, 7: 150, 8: 100, 9: 80, 10: 60,
        11: 45, 12: 30, 13: 20, 14: 10, 15: 5
    };
    points = pointsTable[moves] || 0;
}
