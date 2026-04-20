const express = require("express");
const cors = require("cors");
const path = require("path");
const dataRoutes = require("./routes/dataRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/data", dataRoutes);
app.get("/api/summary", require("./controllers/dataController").getSummary);

app.use((err, _req, res, _next) => {
  return res.status(500).json({
    message: "Unexpected server error.",
    error: err.message,
  });
});

module.exports = app;
