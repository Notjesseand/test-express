// server/src/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db");

const router = express.Router();

router.post("/login", async (req: any, res: any) => {
  const { username, password } = req.body;

  console.log("Received login:", username, password);

  const userRes = await pool.query("SELECT * FROM admins WHERE username = $1", [
    username,
  ]);
  const admin = userRes.rows[0];

  console.log("Admin found:", admin);

  if (!admin) {
    console.log("No such admin");
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);
  console.log("Password match:", passwordMatch);

  if (!passwordMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: admin.id, category: admin.category },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );

  res.json({ token, category: admin.category });
});

module.exports = router;
