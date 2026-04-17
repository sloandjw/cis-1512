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