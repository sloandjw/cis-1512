const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Connect to SQLite database file
const db = new sqlite3.Database("./scores.db", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create scores table if it does not exist
db.run(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_name TEXT NOT NULL,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/leaderboard", (req, res) => {
  const sql = `
    SELECT game_name, player_name, score, created_at
    FROM scores
    ORDER BY score DESC, created_at ASC
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
  const { game_name, player_name, score } = req.body;

  if (!game_name || !player_name || typeof score !== "number") {
    return res.status(400).json({ error: "Invalid score data" });
  }

  const sql = `
    INSERT INTO scores (game_name, player_name, score)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [game_name, player_name, score], function (err) {
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});