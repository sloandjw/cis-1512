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
    { id: 1, label: "HTML", pairId: "html" },
    { id: 2, label: "HTML", pairId: "html" },
    { id: 3, label: "CSS", pairId: "css" },
    { id: 4, label: "CSS", pairId: "css" },
    { id: 5, label: "JS", pairId: "js" },
    { id: 6, label: "JS", pairId: "js" },
    { id: 7, label: "DOM", pairId: "dom" },
    { id: 8, label: "DOM", pairId: "dom" },
    { id: 9, label: "Grid", pairId: "grid" },
    { id: 10, label: "Grid", pairId: "grid" },
    { id: 11, label: "Flex", pairId: "flex" },
    { id: 12, label: "Flex", pairId: "flex" }
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
                score: points
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
