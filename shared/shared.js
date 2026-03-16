function generatePlayerId() {
  return crypto.randomUUID();
}

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
        if (!enteredName) {return;}
        localStorage.setItem("playerName", enteredName);
        const data = await registerPlayer(playerId, enteredName);
        console.log(data);
        if (newPlayerSection) {
          newPlayerSection.style.display = "none";
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

async function registerPlayer(playerId, playerName) {
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