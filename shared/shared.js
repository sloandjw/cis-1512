// global variables
// add any global variables that are shared between multiple pages here

//server connection info
const apiBase =
location.hostname === "127.0.0.1" || location.hostname === "localhost"
? "http://162.243.174.19/cis-1512"
: "/cis-1512";

// shared javascript functions
// add functions that are shared between multiple pages here

// Submit a score to the server (reusable across games)
async function submitGameScore(gameName, score) {
    const playerId = localStorage.getItem("playerId");
    const playerName = localStorage.getItem("playerName");
    if (!playerId || !playerName) {
        console.log("Missing player data in localStorage.");
        return;
    }
    try {
        const response = await fetch(`${apiBase}/api/scores`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                player_id: playerId,
                game_name: gameName,
                score: score
            })
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("Submit failed:", data);
            return;
        }
        console.log("Score submitted successfully:", data);
    } catch (error) {
        console.error("Error submitting score:", error);
    }
}

// Load leaderboard data and populate game-specific tables
async function loadLeaderboards() {
    const tttBody = document.getElementById("ttt-leaderboard-body");
    const snakeBody = document.getElementById("snake-leaderboard-body");
    const memoryBody = document.getElementById("memory-leaderboard-body");
    if (!tttBody || !snakeBody || !memoryBody) return;

    try {
        const response = await fetch(`${apiBase}/leaderboard`);
        const scores = await response.json();

        if (!response.ok) {
            tttBody.innerHTML = `<tr><td colspan="5">Failed to load.</td></tr>`;
            snakeBody.innerHTML = `<tr><td colspan="3">Failed to load.</td></tr>`;
            memoryBody.innerHTML = `<tr><td colspan="3">Failed to load.</td></tr>`;
            return;
        }

        // --- Snake: highest score per player ---
        const snakeScores = scores.filter(s => s.game_name === "Snake");
        const snakeBest = {};
        snakeScores.forEach(s => {
            if (!snakeBest[s.player_name] || s.score > snakeBest[s.player_name]) {
                snakeBest[s.player_name] = s.score;
            }
        });
        const snakeRanked = Object.entries(snakeBest).sort((a, b) => b[1] - a[1]);

        if (snakeRanked.length === 0) {
            snakeBody.innerHTML = `<tr><td colspan="3">No scores yet.</td></tr>`;
        } else {
            snakeBody.innerHTML = "";
            snakeRanked.forEach(([name, score], i) => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${i + 1}</td><td>${name}</td><td>${score}</td>`;
                snakeBody.appendChild(row);
            });
        }

   // --- Memory: fewest turns per player ---
const memoryScores = scores.filter(s => s.game_name === "Memory");
const memoryBest = {};
memoryScores.forEach(s => {
    if (!memoryBest[s.player_name] || s.score < memoryBest[s.player_name]) {
        memoryBest[s.player_name] = s.score;
    }
});
const memoryRanked = Object.entries(memoryBest).sort((a, b) => a[1] - b[1]);

function movesToPoints(moves) {
    if (moves <= 8) return 100;
    if (moves <= 12) return 50;
    if (moves <= 15) return 30;
    return 10;
}

if (memoryRanked.length === 0) {
    memoryBody.innerHTML = `<tr><td colspan="4">No scores yet.</td></tr>`;
} else {
    memoryBody.innerHTML = "";
    memoryRanked.forEach(([name, turns], i) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${i + 1}</td><td>${name}</td><td>${turns}</td><td>${movesToPoints(turns)}</td>`;
        memoryBody.appendChild(row);
    });
}

        // --- TicTacToe: aggregate W/D/L per player ---
        const tttScores = scores.filter(s => s.game_name === "TicTacToe");
        const tttStats = {};
        tttScores.forEach(s => {
            if (!tttStats[s.player_name]) {
                tttStats[s.player_name] = { wins: 0, draws: 0, losses: 0 };
            }
            if (s.score === 1) tttStats[s.player_name].wins++;
            else if (s.score === 0) tttStats[s.player_name].draws++;
            else if (s.score === -1) tttStats[s.player_name].losses++;
        });
        const tttRanked = Object.entries(tttStats).sort((a, b) => b[1].wins - a[1].wins);

        if (tttRanked.length === 0) {
            tttBody.innerHTML = `<tr><td colspan="5">No scores yet.</td></tr>`;
        } else {
            tttBody.innerHTML = "";
            tttRanked.forEach(([name, stats], i) => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${i + 1}</td><td>${name}</td><td>${stats.wins}</td><td>${stats.draws}</td><td>${stats.losses}</td>`;
                tttBody.appendChild(row);
            });
        }

    } catch (error) {
        console.error("Error loading leaderboard:", error);
        tttBody.innerHTML = `<tr><td colspan="5">Error loading leaderboard.</td></tr>`;
        snakeBody.innerHTML = `<tr><td colspan="3">Error loading leaderboard.</td></tr>`;
        memoryBody.innerHTML = `<tr><td colspan="3">Error loading leaderboard.</td></tr>`;
    }
}

document.addEventListener("DOMContentLoaded", loadLeaderboards);