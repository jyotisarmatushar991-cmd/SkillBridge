require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const noticesRouteFactory = require("./routes/notices");
const store = require("./data/store");

const app = express();
const server = http.createServer(app);

// Comma-separated list allowed, e.g. "http://localhost:5173,http://127.0.0.1:5173"
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const io = new Server(server, {
  cors: { origin: CLIENT_ORIGINS, methods: ["GET", "POST", "DELETE"] },
});

app.use(cors({ origin: CLIENT_ORIGINS }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "SkillBridge API" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/notices", noticesRouteFactory(io)); // notices routes need `io` to broadcast

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  // Send the current board right away so new / reconnecting clients are in sync
  socket.emit("NOTICES_UPDATE", store.getNotices());
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

// Unknown API route -> JSON 404 (instead of Express's HTML page)
app.use("/api", (req, res) => res.status(404).json({ error: "Route not found" }));

// Fallback error handler
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000; // must match the frontend proxy (was 5001)
server.listen(PORT, () => {
  console.log(`SkillBridge API + Socket.io running on port ${PORT}`);
});
