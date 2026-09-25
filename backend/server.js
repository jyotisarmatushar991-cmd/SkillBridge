const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();


// ======================================================
// APP SETUP
// ======================================================

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());


// ======================================================
// HTTP SERVER
// ======================================================

const server = http.createServer(app);


// ======================================================
// SOCKET.IO
// ======================================================

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


// ======================================================
// YOUR DATA / STORE
// ======================================================

// KEEP YOUR EXISTING store CODE HERE.
//
// Example:
//
// const store = {
//   notices: [],
//
//   getNotices() {
//     return this.notices;
//   },
//
//   addNotice(notice) {
//     this.notices.push(notice);
//   }
// };


// ======================================================
// SOCKET.IO CONNECTION
// ======================================================

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // --------------------------------------------------
  // KEEP YOUR EXISTING NOTICE CODE HERE
  // --------------------------------------------------

  // Example if your existing store has getNotices():
  //
  // socket.emit("NOTICES_UPDATE", store.getNotices());


  // --------------------------------------------------
  // DISCONNECT
  // --------------------------------------------------

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


// ======================================================
// API ROUTES
// ======================================================

// IMPORTANT:
// Keep your existing SkillBridge routes here.
//
// For example:
//
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/notices", noticeRoutes);


// ------------------------------------------------------
// HEALTH CHECK
// ------------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SkillBridge API is running",
  });
});


// ------------------------------------------------------
// API HEALTH CHECK
// ------------------------------------------------------

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "SkillBridge API is running",
  });
});


// ======================================================
// UNKNOWN API ROUTE
// ======================================================

app.use("/api", (req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});


// ======================================================
// ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON body",
    });
  }

  res.status(500).json({
    error: "Something went wrong on the server",
  });
});


// ======================================================
// LOCAL SERVER
// ======================================================

// Vercel handles the server when deployed.
// Locally, Node must start listening on a port.

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(
      `SkillBridge API + Socket.io running on port ${PORT}`
    );
  });
}


// ======================================================
// VERCEL EXPORT
// ======================================================

module.exports = server;