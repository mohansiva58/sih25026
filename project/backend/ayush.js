// backend/routes/ayush.js
const express = require("express");
const router = express.Router();

const ayushMappings = {
  fever: {
    treatments: [
      { name: "Guduchi Kashaya", system: "Ayurveda" },
      { name: "Triphala Churna", system: "Ayurveda" },
      { name: "Tulsi Tea", system: "Naturopathy" }
    ]
  },
  diabetes: {
    treatments: [
      { name: "Jamun Seed Powder", system: "Ayurveda" },
      { name: "Fenugreek Seeds", system: "Ayurveda" },
      { name: "Yoga Asanas (Surya Namaskar)", system: "Yoga" }
    ]
  }
};

// GET /ayush/search?q=fever
router.get("/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const result = ayushMappings[q] || null;
  res.json(result);
});

module.exports = router;
