const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

const scores = [];

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/leaderboard", (req, res) => {
  const sorted = scores.sort((a, b) => b.score - a.score);
  res.json(sorted);
});

app.post("/api/scores", (req, res) => {
  const { game_name, player_name, score } = req.body;

  const newScore = {
    game_name,
    player: player_name,
    score
  };

  scores.push(newScore);

  console.log("Score saved:", newScore);

  res.json({ message: "Score saved successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});