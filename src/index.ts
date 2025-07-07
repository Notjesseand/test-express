// @ts-nocheck
require("dotenv").config();
console.log("DB URL:", process.env.DATABASE_URL);

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", ticketRoutes);
app.use("/api", require("./routes/tickets"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
