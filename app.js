const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

// MongoDB connection
let db;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Aryansh:Aryansh%401234@main.rnf5aoj.mongodb.net/iitb-ladder?retryWrites=true&w=majority&appName=Main";

// Connect to MongoDB
MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db();
  })
  .catch(error => {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  });

app.use(cors());
app.use(bodyParser.json());

// Helper function to get players collection
const getPlayersCollection = () => db.collection('players');

// Health check route
app.get("/", (req, res) => {
  res.send("IITB Pre-Camp Ladder Backend is running ");
});

// ✅ Leaderboard route
// ✅ Get leaderboard for a sport (rank calculated dynamically)
app.get("/leaderboard/:sport", async (req, res) => {
  const { sport } = req.params;
  
  try {
    const players = await getPlayersCollection()
      .find({ sport })
      .sort({ points: -1 })
      .toArray();

    // Assign dynamic ranks
    const rankedPlayers = players.map((p, index) => ({
      ...p,
      rank: index + 1,
    }));

    res.json(rankedPlayers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// ✅ Update player points (requires password)
app.put("/player/:id", async (req, res) => {
  const { id } = req.params;
  const { points, password } = req.body;

  try {
    const player = await getPlayersCollection().findOne({ 
      _id: new ObjectId(id) 
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
    const result = await getPlayersCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: { points } }
    );

    if (result.modifiedCount === 1) {
      const updatedPlayer = await getPlayersCollection().findOne({ 
        _id: new ObjectId(id) 
      });
      res.json(updatedPlayer);
    } else {
      res.status(500).json({ error: "Failed to update points" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update points" });
  }
});

// ✅ Delete player
app.delete("/player/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await getPlayersCollection().deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 1) {
      res.json({ message: "Player removed" });
    } else {
      res.status(404).json({ error: "Player not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete player" });
  }
});

// ✅ Add or Update Player with password check
app.post("/player", async (req, res) => {
  const { name, sport, points, password } = req.body;

  try {
    const existing = await getPlayersCollection().findOne({ 
      name, 
      sport 
    });

    if (existing) {
      // If player exists → check password
      if (existing.password !== password) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      // Update existing player
      const result = await getPlayersCollection().updateOne(
        { name, sport },
        { $set: { points } }
      );

      if (result.modifiedCount === 1) {
        const updated = await getPlayersCollection().findOne({ name, sport });
        return res.json(updated);
      } else {
        return res.status(500).json({ error: "Failed to update player" });
      }
    } else {
      // If player does not exist → create new
      const newPlayer = {
        name,
        sport,
        points,
        password,
        createdAt: new Date()
      };

      const result = await getPlayersCollection().insertOne(newPlayer);
      
      if (result.insertedId) {
        const created = await getPlayersCollection().findOne({ 
          _id: result.insertedId 
        });
        return res.json(created);
      } else {
        return res.status(500).json({ error: "Failed to create player" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add/update player" });
  }
});

// ✅ Get all players (optional - for debugging/admin)
app.get("/players", async (req, res) => {
  try {
    const players = await getPlayersCollection()
      .find({}, { projection: { password: 0 } }) // Exclude passwords
      .toArray();
    
    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

// ✅ Get players by sport
app.get("/players/:sport", async (req, res) => {
  const { sport } = req.params;
  
  try {
    const players = await getPlayersCollection()
      .find({ sport }, { projection: { password: 0 } })
      .toArray();
    
    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

module.exports = app;