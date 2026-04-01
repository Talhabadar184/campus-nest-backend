// routes/geocodeRoute.js
const express = require("express");
const router = express.Router();
const geocodeLocation = require("../utils/geocode");

router.get("/geocode", async (req, res) => {
  const { address } = req.query;

  if (!address) return res.status(400).json({ error: "Address is required" });

  try {
    const result = await geocodeLocation(address);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || "Geocode failed" });
  }
});

module.exports = router;
