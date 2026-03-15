function generatePlayerId() {
  return crypto.randomUUID();
}

async function initializePlayer() {
  let playerId = localStorage.getItem("playerId");
  let playerName = localStorage.getItem("playerName");

  if (!playerId) {
    playerId = generatePlayerId();
    localStorage.setItem("playerId", playerId);
  }

  if (!playerName) {
    playerName = prompt("Enter your player name:");
    if (!playerName || !playerName.trim()) {
      playerName = "Player";
    }
    localStorage.setItem("playerName", playerName);
  }

  try {
    const response = await fetch("http://localhost:3000/api/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        player_id: playerId,
        player_name: playerName
      })
    });

    const data = await response.json();
    console.log("Player initialization:", data);

    return data;
  } catch (error) {
    console.error("Failed to initialize player:", error);
    return null;
  }
}

function getPlayerId() {
  return localStorage.getItem("playerId");
}

function getPlayerName() {
  return localStorage.getItem("playerName");
}

document.addEventListener("DOMContentLoaded", () => {
  initializePlayer();
});