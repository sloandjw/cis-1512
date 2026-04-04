//server connection info
const isLocal =
  location.hostname === "127.0.0.1" ||
  location.hostname === "localhost";
const apiBase = isLocal
  ? "http://162.243.174.19"
  : "";

// generate a unique player ID using the Web Crypto API

function generatePlayerId() {
  return crypto.randomUUID();
}

// initialize player data on page load

async function initializePlayer() {
  let playerId = localStorage.getItem("playerId");
  let playerName = localStorage.getItem("playerName");

  const newPlayerSection = document.getElementById("new-player-section");
  const returningPlayerSection = document.getElementById("returning-player-section");
  const returningPlayerMessage = document.getElementById("returning-player-message");
  const saveButton = document.getElementById("save-player-name");
  const input = document.getElementById("player-name-input");

//   console.log("playerId:", playerId);
  console.log("playerName:", playerName);

  if (!playerId) {
    playerId = generatePlayerId();
    localStorage.setItem("playerId", playerId);
  }

  if (!playerName) {
    if (newPlayerSection) {
      newPlayerSection.style.display = "block";
    }

    if (saveButton && input) {
      saveButton.onclick = async () => {
        const enteredName = input.value.trim();
        if (!enteredName) return;

        const data = await registerPlayer(playerId, enteredName);

        if (!data || data.error) {
          console.error("Server failed to save player");
          return;
        }

        // ONLY save locally after server success
        localStorage.setItem("playerName", enteredName);

        if (newPlayerSection) {
          newPlayerSection.style.display = "none";
        }

        if (returningPlayerSection && returningPlayerMessage) {
          returningPlayerMessage.textContent = `Player: ${enteredName}`;
          returningPlayerSection.style.display = "block";
        }
      };
    }
    return;
  } 
    if (returningPlayerSection && returningPlayerMessage) {
        returningPlayerMessage.textContent = `Player: ${playerName}`;
        returningPlayerSection.style.display = "block";
    }
}

// register player on the server

async function registerPlayer(playerId, playerName) {
  try {
    //const response = await fetch("/api/players", {
    const response = await fetch(`${apiBase}/api/players`, {
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

// helper functions to get player data

function getPlayerId() {
  return localStorage.getItem("playerId");
}

function getPlayerName() {
  return localStorage.getItem("playerName");
}

//run when page loads

document.addEventListener("DOMContentLoaded", () => {

  initializePlayer();

  const resetButton = document.getElementById("reset-player");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      localStorage.removeItem("playerName");
      localStorage.removeItem("playerId");
      console.log("Player data cleared");
      location.reload();
    });
  }

});