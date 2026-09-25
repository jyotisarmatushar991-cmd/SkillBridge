const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: false
}));

app.use(express.json());

// --------------------------------------------------
// YOUR EXISTING API ROUTES GO HERE
// --------------------------------------------------

// Example:
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/notices", noticeRoutes);


// --------------------------------------------------
// HTTP SERVER + SOCKET.IO
// --------------------------------------------------

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Keep your existing NOTICE update code here
  // Example:
  // socket.emit("NOTICES_UPDATE", store.getNotices());

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


// --------------------------------------------------
// API FALLBACK
// --------------------------------------------------

app.use("/api", (req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});


// --------------------------------------------------
// ERROR HANDLER
// --------------------------------------------------

app.use((err, req, res, next) => {
  console.error(err);

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON body"
    });
  }

  res.status(500).json({
    error: "Something went wrong on the server"
  });
});


// --------------------------------------------------
// VERCEL
// --------------------------------------------------

// IMPORTANT:
// Do NOT call server.listen() when deployed to Vercel.

module.exports = server;