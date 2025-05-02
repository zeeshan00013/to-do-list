const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");

require("dotenv").config();

const authRoutes = require("../routes/authRoutes");
const todoRoutes = require("../routes/todoRoutes");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/api", (req, res) => {
  res.send("API is working");
});

module.exports = app;
module.exports.handler = serverless(app);
