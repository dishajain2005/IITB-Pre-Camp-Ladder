import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

// Health check route
app.get("/", (req, res) => {
  res.send("IITB Pre-Camp Ladder Backend is running ");
});

// ✅ Leaderboard route
// ✅ Get leaderboard for a sport (rank calculated dynamically)
app.get("/leaderboard/:sport", async (req, res) => {
  const { sport } = req.params;
  try {
    const players = await prisma.player.findMany({
      where: { sport },
      orderBy: {
        points: "desc"
      },
    });

    // Assign dynamic ranks
    const rankedPlayers = players.map((p, index) => ({
      ...p,
      rank: index + 1,
    }));

    res.json(rankedPlayers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});


// ✅ Update player points
// ✅ Update player points (requires password)
// ✅ Update player points (requires password)
app.put("/player/:id", async (req, res) => {
  const { id } = req.params;
  const { points, password } = req.body;

  try {
    const player = await prisma.player.findUnique({
      where: { id: parseInt(id) },
    });

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, player.password);
    if (!validPassword) {
      return res.status(403).json({ error: "Invalid password" });
    }

    // Update points if password is correct
    const updatedPlayer = await prisma.player.update({
      where: { id: parseInt(id) },
      data: { points },
    });

    res.json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ error: "Failed to update points" });
  }
});




// ✅ Delete player
app.delete("/player/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.player.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Player removed" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete player" });
  }
});

// ✅ Add or Update Player
// ✅ Add or Update Player
// ✅ Add or Update Player with password
// ✅ Add or Update Player with password check
app.post("/player", async (req, res) => {
  const { name, sport, points, password } = req.body;

  try {
    const existing = await prisma.player.findUnique({
      where: { name_sport: { name, sport } },
    });

    if (existing) {
      // If player exists → check password
      if (existing.password !== password) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      const updated = await prisma.player.update({
        where: { name_sport: { name, sport } },
        data: { points },
      });

      return res.json(updated);
    } else {
      // If player does not exist → create new
      const player = await prisma.player.create({
        data: { name, sport, points, password },
      });

      return res.json(player);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add/update player" });
  }
});






export default app;
