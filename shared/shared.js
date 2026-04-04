// global variables
// add any global variables that are shared between multiple pages here

//server connection info
//const ip = "http://162.243.174.19";
const isLocal =
  location.hostname === "127.0.0.1" ||
  location.hostname === "localhost";

const apiBase = isLocal
  ? "http://162.243.174.19"
  : "https://sloandjw.github.io/cis-1512";

// shared javascript functions
// add functions that are shared between multiple pages here

async function loadLeaderboard() {
    const leaderboardBody = document.getElementById("leaderboard-body");
    if (!leaderboardBody) return;
    leaderboardBody.innerHTML = `<tr><td colspan="4">Loading leaderboard...</td></tr>`;
    try {
        const response = await fetch(`${apiBase}/leaderboard`);
        const scores = await response.json();
        if (!response.ok) {
            leaderboardBody.innerHTML = `<tr><td colspan="4">Failed to load leaderboard.</td></tr>`;
            console.error("Leaderboard error:", scores);
            return;
        }
        if (scores.length === 0) {
            leaderboardBody.innerHTML = `<tr><td colspan="4">No scores yet.</td></tr>`;
            console.error("Leaderboard error:", scores);
            return;
        }
        leaderboardBody.innerHTML = "";
        scores.forEach((entry, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.player_name}</td>
                <td>${entry.game_name}</td>
                <td>${entry.score}</td>
            `;
            leaderboardBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading leaderboard:", error);
        leaderboardBody.innerHTML = `<tr><td colspan="4">Error loading leaderboard.</td></tr>`;
    }
}

document.addEventListener("DOMContentLoaded", loadLeaderboard);