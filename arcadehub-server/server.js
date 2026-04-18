const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// *************Initialization******************

// Connect to SQLite database file
const db = new sqlite3.Database("./scores.db", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create players table if it does not exist
db.run(`
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id TEXT NOT NULL UNIQUE,
    player_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create scores table if it does not exist
db.run(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id TEXT NOT NULL,
    game_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// *************Players******************

// Register a player if new, or return existing player if known
app.post("/api/players", (req, res) => {
  const { player_id, player_name } = req.body;

  if (!player_id || !player_name) {
    return res.status(400).json({ error: "player_id and player_name are required" });
  }

  const findSql = `SELECT * FROM players WHERE player_id = ?`;

  db.get(findSql, [player_id], (err, row) => {
    if (err) {
      console.error("Error looking up player:", err.message);
      return res.status(500).json({ error: "Database lookup failed" });
    }

    if (row) {
      const updateSql = `
        UPDATE players
        SET player_name = ?, last_login = CURRENT_TIMESTAMP
        WHERE player_id = ?
      `;

      db.run(updateSql, [player_name, player_id], (updateErr) => {
        if (updateErr) {
          console.error("Error updating player:", updateErr.message);
          return res.status(500).json({ error: "Failed to update player" });
        }

        return res.json({
          message: "Returning player recognized",
          player: {
            player_id,
            player_name
          }
        });
      });
    } else {
      const insertSql = `
        INSERT INTO players (player_id, player_name)
        VALUES (?, ?)
      `;

      db.run(insertSql, [player_id, player_name], function (insertErr) {
        if (insertErr) {
          console.error("Error creating player:", insertErr.message);
          return res.status(500).json({ error: "Failed to create player" });
        }

        return res.json({
          message: "New player created",
          player: {
            player_id,
            player_name
          }
        });
      });
    }
  });
});

// Get a specific player by player_id
app.get("/api/players/:playerId", (req, res) => {
  const { playerId } = req.params;

  const sql = `SELECT * FROM players WHERE player_id = ?`;

  db.get(sql, [playerId], (err, row) => {
    if (err) {
      console.error("Error fetching player:", err.message);
      return res.status(500).json({ error: "Failed to fetch player" });
    }

    if (!row) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json(row);
  });
});

// *************Scores******************

app.get("/leaderboard/:game", (req, res) => {
  const sql = `
    SELECT 
      s.game_name, 
      s.player_id, 
      p.player_name, 
      s.score, 
      s.created_at
    FROM scores s
    JOIN players p ON s.player_id = p.player_id
    ORDER BY s.score DESC, s.created_at ASC
    LIMIT 64
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching leaderboard:", err.message);
      return res.status(500).json({ error: "Failed to fetch leaderboard" });
    }

    res.json(rows);
  });
});

app.post("/api/scores", (req, res) => {
  const { player_id, game_name, score } = req.body;
  
  if (!player_id || !game_name || typeof score !== "number") {
    return res.status(400).json({ error: "Invalid score data" });
  }
  
  const sql = `
  INSERT INTO scores (player_id, game_name, score)
  VALUES (?, ?, ?)
  `;
  
  db.run(sql, [player_id, game_name, score], function (err) {
    if (err) {
      console.error("Error saving score:", err.message);
      return res.status(500).json({ error: "Failed to save score" });
    }
    
    res.json({
      message: "Score saved successfully",
      id: this.lastID
    });
  });
});

// *******************Debug******************

//players db debug
app.get("/debug/players", (req, res) => {
  db.all("SELECT * FROM players", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

//scores db debug
app.get("/debug/scores", (req, res) => {
  db.all("SELECT * FROM scores", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// start the server

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});