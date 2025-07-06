const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// ✅ Auth middleware to verify JWT token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Attach admin data to request
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ✅ GET /api/tickets - Get tickets for admin's category (protected)
router.get("/tickets", authMiddleware, async (req, res) => {
  const category = req.admin.category;

  try {
    const result = await pool.query(
      "SELECT * FROM tickets WHERE category = $1 ORDER BY id DESC",
      [category]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

// ✅ POST /api/tickets - Create new ticket (unprotected or adjust if needed)
router.post("/tickets", async (req, res) => {
  const { title, description, category } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO tickets (title, description, category, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, category, "open"]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

// ✅ PUT /api/tickets/:id/resolve - Mark ticket as resolved
router.put("/tickets/:id/resolve", authMiddleware, async (req, res) => {
  const ticketId = req.params.id;

  try {
    const result = await pool.query(
      "UPDATE tickets SET status = 'resolved' WHERE id = $1 RETURNING *",
      [ticketId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json({ message: "Ticket resolved", ticket: result.rows[0] });
  } catch (err) {
    console.error("Error resolving ticket:", err);
    res.status(500).json({ error: "Failed to resolve ticket" });
  }
});

module.exports = router;
