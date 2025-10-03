const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); 
app.use(express.json());

const API_URL = "https://azmiproductions.com/restazp/";

const CREDENTIALS = {
  user: "azmiprod_smartfarmuser",
  pass: "SMARTfarm123.",
  db: "azmiprod_smartfarm"
};

// Proxy route
app.get("/api/:table", async (req, res) => {
  try {
    const payload = { ...CREDENTIALS, table: req.params.table };

    const response = await axios.get(API_URL, {
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(payload) // matches your curl
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch from API" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Proxy running at http://localhost:${PORT}`));
